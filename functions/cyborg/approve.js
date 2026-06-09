// GET /cyborg/approve?req=<uuid>&decision=approve|reject&sig=<hmac>
//
// Liam's approval emails contain a link to this endpoint with an HMAC-signed
// query string. We verify the signature, transition the request to its final
// state, and (on approval) mint a fresh token. We then forward the result to
// the same Tines webhook with a different `event_type` so Tines can branch
// to the candidate-facing email.

import { createClient } from '@supabase/supabase-js';
import { hmacHex, timingSafeEqual, generateToken, generateJitToken, htmlPage, fetchDadJokes, originFromRequest,
         writeAuditLog, requestMeta, sendEmailViaResend } from './_lib.js';

const TOKEN_DAYS = 8;       // 7-day window + 1-day grace

export async function onRequestGet({ request, env }) {
  const url       = new URL(request.url);
  const requestId = url.searchParams.get('req') || '';
  const decision  = url.searchParams.get('decision') || '';
  const sig       = url.searchParams.get('sig') || '';

  if (!env.ADMIN_SECRET || !env.RESEND_API_KEY) {
    return htmlPage(503, 'Service not configured', 'Approval endpoint is not fully wired up. Contact the operator.');
  }
  if (!requestId || !['approve', 'reject'].includes(decision) || !sig) {
    return htmlPage(400, 'Bad request', 'Missing or invalid parameters.');
  }

  const meta = requestMeta(request);
  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);

  const expected = await hmacHex(env.ADMIN_SECRET, `${requestId}:${decision}`);
  if (!timingSafeEqual(sig, expected)) {
    await writeAuditLog(supabase, {
      actorEmail: '(hmac-invalid)', action: `${decision}_request`,
      target: requestId, success: false,
      detail: { reason: 'invalid_signature' }, ...meta,
    });
    return htmlPage(403, 'Invalid signature', 'This approval link is not valid.');
  }

  // Atomic claim: only the first click for a pending request wins.
  const finalStatus = decision === 'approve' ? 'approved' : 'rejected';
  const nowIso = new Date().toISOString();

  const { data: claimed, error: claimErr } = await supabase
    .from('cyborg_token_requests')
    .update({ status: finalStatus, decided_at: nowIso })
    .eq('request_id', requestId)
    .eq('status', 'pending')
    .select('request_id, name, email, notes, created_at')
    .maybeSingle();

  if (claimErr) {
    console.error('claim failed:', claimErr.message);
    return htmlPage(500, 'Database error', 'Could not record decision. Try again.');
  }
  if (!claimed) {
    // Already decided (or unknown id). Fetch current state for friendlier copy.
    const { data: current } = await supabase
      .from('cyborg_token_requests')
      .select('status, decided_at, email')
      .eq('request_id', requestId)
      .maybeSingle();
    const already = current?.status || 'unknown';
    return htmlPage(200, 'Already handled',
      `This request was already marked as "${already}". One-shot link — no action taken.`);
  }

  if (decision === 'approve') {
    // Mint a fresh, approved-on-creation token.
    const token = generateToken();
    const jitToken = generateJitToken();   // opaque /c/<jit> launch ticket (2026-06-09)
    const expiresAt = new Date(Date.now() + TOKEN_DAYS * 86400000).toISOString();

    const { error: tokenErr } = await supabase.from('cyborg_tokens').insert({
      token,
      jit_token:       jitToken,
      candidate_label: `${claimed.name} (${claimed.email}) — request ${claimed.request_id.slice(0, 8)}`,
      expires_at:      expiresAt,
      approved_at:     nowIso,
    });
    if (tokenErr) {
      // Roll back the request status so the operator can retry.
      await supabase.from('cyborg_token_requests')
        .update({ status: 'pending', decided_at: null })
        .eq('request_id', requestId);
      console.error('token mint failed:', tokenErr.message);
      await writeAuditLog(supabase, {
        actorEmail: 'hmac:approve-link', action: 'approve_request',
        target: requestId, success: false,
        detail: { error: tokenErr.message, email: claimed.email }, ...meta,
      });
      return htmlPage(500, 'Could not mint token', 'Approval rolled back. Try again.');
    }

    // Stash the token on the request row for audit.
    await supabase.from('cyborg_token_requests')
      .update({ token })
      .eq('request_id', requestId);

    await writeAuditLog(supabase, {
      actorEmail: 'hmac:approve-link', action: 'approve_request',
      target: requestId, success: true,
      detail: { token, email: claimed.email, expires_at: expiresAt }, ...meta,
    });

    const origin = originFromRequest(request);
    // Opaque jit link — the real cyb_ token never appears in candidate email.
    // installCmd (local-CLI channel) still carries the real token: unchanged.
    const installUrl = `${origin}/c/${encodeURIComponent(jitToken)}`;
    const installCmd = `curl -fsSL https://raw.githubusercontent.com/vuelo-labs/cyborg_versions/main/install.sh | bash -s ${token}`;

    // Candidate approval email — Resend (was Tines until 2026-06-05).
    const esc = s => String(s).replace(/[&<>"']/g, c => (
      { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]
    ));
    const expiresDateText = new Date(expiresAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    const candidateHtml = `
<!DOCTYPE html>
<html><body style="font-family:-apple-system,'Inter',sans-serif; background:#FAF8F4; color:#2A2420; margin:0; padding:32px;">
  <div style="max-width:560px; margin:0 auto; background:#F2EDE6; border:1px solid #E5DFD6; border-radius:14px; padding:32px;">
    <h1 style="font-family:'Newsreader',Georgia,serif; font-size:1.5rem; font-weight:500; margin:0 0 14px; color:#6B5540;">You're approved, ${esc(claimed.name.split(' ')[0] || claimed.name)}</h1>
    <p style="line-height:1.55; color:#5E5450; margin:0 0 14px;">Your Cyborg assessment access is ready. Click the button below to start. Your access window is open until <strong>${esc(expiresDateText)}</strong>.</p>
    <p style="margin:24px 0;">
      <a href="${esc(installUrl)}" style="display:inline-block; background:#6B5540; color:#FAF8F4; text-decoration:none; padding:12px 24px; border-radius:9px; font-weight:500;">Open Cyborg</a>
    </p>
    <p style="line-height:1.55; color:#5E5450; font-size:0.88rem; margin:0 0 8px;">Or paste this link into your browser:</p>
    <p style="line-height:1.4; font-size:0.82rem; color:#5E5450; word-break:break-all; margin:0 0 18px;"><a href="${esc(installUrl)}" style="color:#6B5540;">${esc(installUrl)}</a></p>
    <p style="line-height:1.55; color:#8A7D77; font-size:0.82rem; margin:18px 0 0;">If anything goes wrong, reply to this email and we'll sort it.</p>
  </div>
</body></html>`;
    const sendRes = await sendEmailViaResend(env, {
      to:      claimed.email,
      subject: `Your Cyborg assessment access is ready`,
      html:    candidateHtml,
    });
    if (!sendRes.ok) {
      console.error('approve: candidate email send failed', sendRes.error);
      // Token is minted; we don't roll back. Surface the failure so the
      // operator can re-send manually or chase up.
      return htmlPage(500, 'Approved but email failed',
        `Token minted (${token.slice(0,8)}...) but the candidate email send failed: ${sendRes.error || '?'}. Re-send manually if needed.`,
        '#974f0c');
    }

    return htmlPage(200, 'Approved', `Token minted and emailed to ${claimed.email}. Window: ${TOKEN_DAYS} days.`, '#2d5a26');
  }

  // Rejection branch — pull dad jokes + send the apology email.
  const jokes = await fetchDadJokes(3);
  await supabase.from('cyborg_token_requests')
    .update({ rejection_jokes: jokes })
    .eq('request_id', requestId);

  await writeAuditLog(supabase, {
    actorEmail: 'hmac:reject-link', action: 'reject_request',
    target: requestId, success: true,
    detail: { email: claimed.email }, ...meta,
  });

  const escR = s => String(s).replace(/[&<>"']/g, c => (
    { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]
  ));
  const jokesHtml = jokes.length
    ? `<ul style="line-height:1.55; color:#5E5450; padding-left:20px; margin:0 0 14px;">${jokes.map(j => `<li style="margin:0 0 8px;">${escR(j)}</li>`).join('')}</ul>`
    : '';
  const rejectHtml = `
<!DOCTYPE html>
<html><body style="font-family:-apple-system,'Inter',sans-serif; background:#FAF8F4; color:#2A2420; margin:0; padding:32px;">
  <div style="max-width:560px; margin:0 auto; background:#F2EDE6; border:1px solid #E5DFD6; border-radius:14px; padding:32px;">
    <h1 style="font-family:'Newsreader',Georgia,serif; font-size:1.4rem; font-weight:500; margin:0 0 14px; color:#6B5540;">Sorry — not this time</h1>
    <p style="line-height:1.55; color:#5E5450; margin:0 0 14px;">Thanks for asking about Cyborg. We can't get you in on this batch. By way of apology, here are some dad jokes:</p>
    ${jokesHtml}
    <p style="line-height:1.55; color:#8A7D77; font-size:0.85rem; margin:18px 0 0;">No hard feelings if these are bad.</p>
  </div>
</body></html>`;
  await sendEmailViaResend(env, {
    to:      claimed.email,
    subject: `Cyborg access — not this time (with dad jokes)`,
    html:    rejectHtml,
  });

  return htmlPage(200, 'Rejected', `Apology email (with dad jokes) sent to ${claimed.email}.`, '#6e2618');
}
