// POST /cyborg/app/api/candidates/issue — org member issues OR re-sends a
// candidate token.
//
// Auth: enforced by /cyborg/app/_middleware.js (sets X-Cyborg-User-Id +
// X-Cyborg-User-Email on the request before this handler sees it).
//
// Body: { organisation_id: uuid, label: string, candidate_email?: string, days?: number }
//
// Behaviour:
//   1. Verify the caller is a member of the named org (owner/admin/member
//      all allowed for V5 — role-based gating queues for V5.1).
//   2. If candidate_email is provided AND there's already a LIVE token for
//      (org, email): RESEND mode. Keep the existing token + window, just
//      re-email the launch URL. No new DB row.
//   3. Otherwise: ISSUE mode. Mint a token, insert into cyborg_tokens with
//      organisation_id + issued_by_user_id populated.
//   4. In both modes: send the candidate the launch URL via Resend (when
//      candidate_email is valid).
//   5. Write to cyborg_admin_audit (action = issue_candidate_token or
//      resend_candidate_token).
//   6. Return the token (existing or new), install URL, and `resend` flag.
//
// Rotation note: there is no per-issuance rotation. The realistic case
// for "send a new email" is "candidate lost the previous one" — that's a
// resend, not a rotation. For the security-incident case (suspected leak)
// use the explicit /cyborg/app/api/candidates/revoke endpoint first, then
// issue a fresh token for that email.
//
// Share-prevention: not enforced at the platform layer. A leaked URL can
// be opened by anyone. The protection is in the human panel stage — the
// candidate is interviewed about their own work; a stand-in cannot answer.

import { createClient } from '@supabase/supabase-js';
import { generateToken, generateJitToken, writeAuditLog, requestMeta, sendEmailViaResend,
         cleanInput, EMAIL_RE, isDisposableEmail } from '../../../_lib.js';

const DEFAULT_DAYS = 8;
const MAX_LABEL    = 200;
const MAX_EMAIL    = 320;

export async function onRequestPost({ request, env }) {
  const userId    = request.headers.get('x-cyborg-user-id') || '';
  const userEmail = request.headers.get('x-cyborg-user-email') || '';
  const meta      = requestMeta(request);

  if (!userId) return json({ ok: false, reason: 'no_user' }, 401);

  let body;
  try { body = await request.json(); } catch { return json({ ok: false, reason: 'bad_json' }, 400); }

  const orgId = (body.organisation_id || '').toString().trim();
  // cleanInput strips control characters (RTL override, zero-width chars,
  // bell chars) before trimming + length-capping. Without this, weird
  // unicode in a candidate name lands in audit logs + emails + admin UI.
  const label = cleanInput(body.label, MAX_LABEL);
  const days  = Number.isFinite(body.days) ? Math.min(Math.max(body.days, 1), 30) : DEFAULT_DAYS;
  // candidate_email is optional but recommended — drives the Resend send.
  // If unset, the operator gets the URL back to share manually.
  const candidateEmail = cleanInput(body.candidate_email, MAX_EMAIL).toLowerCase();
  const emailValid     = candidateEmail && EMAIL_RE.test(candidateEmail) && !isDisposableEmail(candidateEmail);
  // Optional v1.1 preset path: the candidate's Fly machine spawns from
  // the campaign's preset image (campaigns.preset_id → presets.current_image_tag).
  // Tokens with no campaign_id fall through to the default image (env.FLY_IMAGE_REF).
  const campaignId = (body.campaign_id || '').toString().trim() || null;

  if (!orgId || !label) return json({ ok: false, reason: 'missing_fields' }, 400);

  // Candidate auth (2026-06-10): the hosted launch now requires a verified
  // email (OTP sign-in), so a valid candidate_email is mandatory here. The
  // local-CLI/install tier is a separate channel and is not issued from here.
  if (!emailValid) return json({ ok: false, reason: 'email_required' }, 400);

  const admin = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);

  // Org membership check — the caller MUST belong to this org.
  const { data: membership, error: memErr } = await admin
    .from('organisation_members')
    .select('id, role')
    .eq('organisation_id', orgId)
    .eq('user_id', userId)
    .maybeSingle();

  if (memErr || !membership) {
    await writeAuditLog(admin, {
      actorEmail: userEmail, action: 'issue_candidate_token',
      target: orgId, success: false,
      detail: { reason: 'not_a_member' }, ...meta,
    });
    return json({ ok: false, reason: 'not_a_member_of_org' }, 403);
  }

  // Verify the campaign belongs to this org (if specified).
  if (campaignId) {
    const { data: campaign, error: campaignErr } = await admin
      .from('campaigns')
      .select('id')
      .eq('id', campaignId)
      .eq('organisation_id', orgId)
      .maybeSingle();
    if (campaignErr || !campaign) {
      return json({ ok: false, reason: 'campaign_not_in_org' }, 403);
    }
  }

  // ── Resend-on-existing ───────────────────────────────────────────────────
  // 2026-06-05: if there's already a LIVE token for (org, email) — not
  // rotated, not revoked — this "issue" is a RESEND. We keep the existing
  // token and email it again. This handles the realistic case ("candidate
  // lost the email / deleted it / never received it") cleanly without
  // creating parallel keys or new install URLs.
  //
  // For the security-incident case (suspected leak, need to invalidate the
  // old key), use the explicit revoke endpoint first — that frees the
  // (org, email) slot under the partial unique index so the next issue
  // creates a fresh row.
  //
  // Share-prevention is NOT enforced at the platform layer (one URL can be
  // forwarded). The protection is in the human stage — a candidate who
  // outsourced the assessment can't answer panel-depth questions about
  // their own work.
  let isResend     = false;
  let existingRow  = null;
  if (emailValid) {
    // Only fall into RESEND mode for a token that's still genuinely live —
    // not rotated, not revoked, AND not already used (submitted against).
    // A used token = the candidate already finished an assessment with that
    // key; if the admin is "issuing" again for the same email, they want
    // a fresh assessment, not a re-email of the spent one.
    const { data: existing, error: lookupErr } = await admin
      .from('cyborg_tokens')
      .select('token, jit_token, candidate_label, expires_at, issued_at, fly_machine_id, launched_at')
      .eq('organisation_id', orgId)
      .ilike('candidate_email', candidateEmail)
      .is('rotated_to_token', null)
      .is('revoked_at', null)
      .is('used_at', null)
      .maybeSingle();
    if (lookupErr) {
      console.error('issue: prior-token lookup failed', lookupErr.message);
      // Fall through; treat as fresh issuance. The partial unique index
      // will reject a duplicate live row at INSERT if the lookup raced
      // and missed one.
    } else if (existing) {
      isResend    = true;
      existingRow = existing;
    }
  }

  const token     = isResend ? existingRow.token : generateToken();
  const issuedAt  = isResend ? existingRow.issued_at : new Date().toISOString();
  const expiresAt = isResend ? existingRow.expires_at : new Date(Date.now() + days * 86400000).toISOString();

  // JIT launch ticket (2026-06-09). RESEND reuses the row's existing jit so
  // a re-sent email carries the same /c/ link; pre-JIT rows (NULL) get one
  // backfilled here so the re-send moves them onto the opaque path.
  let jitToken = isResend ? existingRow.jit_token : generateJitToken();
  if (isResend && !jitToken) {
    jitToken = generateJitToken();
    const { error: jitErr } = await admin
      .from('cyborg_tokens')
      .update({ jit_token: jitToken })
      .eq('token', token);
    if (jitErr) {
      console.error('issue: jit backfill failed', jitErr.message);
      return json({ ok: false, reason: 'jit_backfill_failed' }, 500);
    }
  }

  if (!isResend) {
    // Enforce the org's candidate cap (organisations.limits.candidates) on FRESH
    // issuance only — a resend reuses an existing row and is never blocked here.
    // NULL limits = uncapped (Vuelo Labs). Counts non-revoked tokens (matches the
    // admin usage pill, which now also filters non-revoked).
    const { data: orgRow } = await admin
      .from('organisations').select('limits').eq('id', orgId).maybeSingle();
    if (orgRow?.limits && Number.isFinite(orgRow.limits.candidates)) {
      const { count: candCount } = await admin
        .from('cyborg_tokens')
        .select('token', { count: 'exact', head: true })
        .eq('organisation_id', orgId)
        .is('revoked_at', null);
      if ((candCount || 0) >= orgRow.limits.candidates) {
        await writeAuditLog(admin, {
          actorEmail: userEmail, action: 'issue_candidate_token',
          target: label, success: false,
          detail: { reason: 'candidate_limit_exceeded', limit: orgRow.limits.candidates, count: candCount }, ...meta,
        });
        return json({ ok: false, reason: 'candidate_limit_exceeded' }, 409);
      }
    }

    const { error: insertErr } = await admin.from('cyborg_tokens').insert({
      token,
      jit_token:         jitToken,
      candidate_label:   label,
      candidate_email:   emailValid ? candidateEmail : null,
      issued_at:         issuedAt,
      expires_at:        expiresAt,
      approved_at:       issuedAt,
      organisation_id:   orgId,
      campaign_id:       campaignId,
      issued_by_user_id: userId,
    });

    if (insertErr) {
      console.error('issue: insert failed', insertErr.message);
      await writeAuditLog(admin, {
        actorEmail: userEmail, action: 'issue_candidate_token',
        target: label, success: false,
        detail: { error: insertErr.message, organisation_id: orgId }, ...meta,
      });
      return json({ ok: false, reason: 'insert_failed', message: insertErr.message }, 500);
    }
  }

  // ── Send candidate the launch URL via Resend ────────────────────────────
  // 2026-06-05: previously the UI promised "the candidate will receive an
  // email" but no send was wired. Now: if a valid email was provided,
  // fire-and-await the Resend send. Failure is recorded in the response
  // but does NOT roll back the token (operator can re-share manually).
  const origin    = `${new URL(request.url).protocol}//${new URL(request.url).host}`;
  // Opaque jit link — the real cyb_ token never appears in candidate email.
  const launchUrl = `${origin}/c/${encodeURIComponent(jitToken)}`;
  let emailSent       = false;
  let emailSendError  = null;
  if (emailValid) {
    const esc = s => String(s).replace(/[&<>"']/g, c => (
      { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]
    ));
    // Best-effort candidate first-name parse from the label.
    // Label is freeform ("Alex Doe (alex@example.com)") — take the head
    // before any opening paren/angle, then the first space-separated token.
    const labelHead = label.split(/[\(<]/, 1)[0].trim();
    const firstName = labelHead.split(/\s+/)[0] || 'there';
    const expiresDateText = new Date(expiresAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    const headlineCopy   = isResend
      ? `Your Cyborg assessment link, ${esc(firstName)}`
      : `Your Cyborg assessment is ready, ${esc(firstName)}`;
    const introCopy      = isResend
      ? `Re-sending your access link. Your window is still open until <strong>${esc(expiresDateText)}</strong>. Click the button below to pick up where you left off.`
      : `Click the button below to start. Your access window stays open until <strong>${esc(expiresDateText)}</strong>.`;
    const html = `
<!DOCTYPE html>
<html><body style="font-family:-apple-system,'Inter',sans-serif; background:#FAF8F4; color:#2A2420; margin:0; padding:32px;">
  <div style="max-width:560px; margin:0 auto; background:#F2EDE6; border:1px solid #E5DFD6; border-radius:14px; padding:32px;">
    <h1 style="font-family:'Newsreader',Georgia,serif; font-size:1.5rem; font-weight:500; margin:0 0 14px; color:#6B5540;">${headlineCopy}</h1>
    <p style="line-height:1.55; color:#5E5450; margin:0 0 14px;">${introCopy}</p>
    <p style="margin:24px 0;">
      <a href="${esc(launchUrl)}" style="display:inline-block; background:#6B5540; color:#FAF8F4; text-decoration:none; padding:12px 24px; border-radius:9px; font-weight:500;">Open Cyborg</a>
    </p>
    <p style="line-height:1.55; color:#5E5450; font-size:0.9rem; margin:0 0 16px; padding:12px 14px; background:#EFE8DD; border-radius:8px;">
      <strong>What happens next:</strong> when you open the link, we'll email a one-time sign-in link to this same address to confirm it's you. Open that, and your workspace starts. Two quick emails, one assessment — both from us.
    </p>
    <p style="line-height:1.55; color:#5E5450; font-size:0.88rem; margin:0 0 8px;">Or paste this link into your browser:</p>
    <p style="line-height:1.4; font-size:0.82rem; color:#5E5450; word-break:break-all; margin:0 0 18px;"><a href="${esc(launchUrl)}" style="color:#6B5540;">${esc(launchUrl)}</a></p>
    <p style="line-height:1.55; color:#8A7D77; font-size:0.82rem; margin:0 0 6px;"><strong>This link is for you only.</strong> The assessment is paired with a panel conversation about your work — sharing the link won't get someone else through.</p>
    <p style="line-height:1.55; color:#8A7D77; font-size:0.82rem; margin:18px 0 0;">If anything goes wrong, reply to this email and we'll sort it.</p>
  </div>
</body></html>`;
    const sendRes = await sendEmailViaResend(env, {
      to:      candidateEmail,
      subject: isResend
        ? `Your Cyborg assessment link (re-sent)`
        : `Your Cyborg assessment access is ready`,
      html,
    });
    emailSent      = sendRes.ok;
    emailSendError = sendRes.ok ? null : (sendRes.error || 'unknown');
    if (!sendRes.ok) {
      console.error('issue: candidate email send failed', emailSendError);
    }
  }

  await writeAuditLog(admin, {
    actorEmail: userEmail, action: isResend ? 'resend_candidate_token' : 'issue_candidate_token',
    target: token, success: true,
    detail: {
      label, days, expires_at: expiresAt, organisation_id: orgId,
      member_role: membership.role, candidate_email: candidateEmail || null,
      email_sent: emailSent, email_send_error: emailSendError,
      resend: isResend,
    }, ...meta,
  });

  return json({
    ok:               true,
    token,
    // Opaque /c/<jit> link for the "share this link directly" UI — the real
    // cyb_ token must NOT be handed to the frontend to compose a ?t= URL.
    launch_url:       launchUrl,
    expires_at:       expiresAt,
    email_sent:       emailSent,
    email_send_error: emailSendError,
    resend:           isResend,
  });
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}
