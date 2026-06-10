// POST /cyborg/app/api/team/invite — invite a teammate to the org.
//
// Body: { organisation_id: uuid, email: string, role: 'admin' | 'teammate' }
//
// Behaviour:
//   1. Verify the caller is an admin of the org (teammates cannot invite)
//   2. Verify the invitee isn't already a member
//   3. Generate an invitation token; insert organisation_invitations row
//   4. Fire Tines webhook with event_type='team_invite' so the invitee
//      receives an email (you can wire a new Tines branch for this later)
//   5. Write to cyborg_admin_audit
//   6. Return the invite token (the inviter can copy/share the link if Tines
//      doesn't fire or the invitee says they didn't receive it)

import { createClient } from '@supabase/supabase-js';
import { generateToken, writeAuditLog, requestMeta,
         cleanInput, EMAIL_RE } from '../../../_lib.js';

const MAX_EMAIL = 320;
const MAX_ROLE  = 20;

export async function onRequestPost({ request, env }) {
  const userId    = request.headers.get('x-cyborg-user-id') || '';
  const userEmail = request.headers.get('x-cyborg-user-email') || '';
  const meta      = requestMeta(request);

  if (!userId) return json({ ok: false, reason: 'no_user' }, 401);

  let body;
  try { body = await request.json(); } catch { return json({ ok: false, reason: 'bad_json' }, 400); }

  const orgId = (body.organisation_id || '').toString().trim();
  // cleanInput strips control characters (RTL override, zero-width chars, etc.)
  // + trims + length-caps. Shared with request-token.js + issue.js.
  const email = cleanInput(body.email, MAX_EMAIL).toLowerCase();
  const role  = cleanInput(body.role || 'teammate', MAX_ROLE);

  if (!orgId || !email) return json({ ok: false, reason: 'missing_fields' }, 400);
  if (!['admin', 'teammate'].includes(role)) return json({ ok: false, reason: 'bad_role' }, 400);
  if (!EMAIL_RE.test(email)) return json({ ok: false, reason: 'bad_email' }, 400);

  const admin = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);

  // Verify the caller is owner/admin of the org.
  const { data: membership } = await admin
    .from('organisation_members')
    .select('id, role')
    .eq('organisation_id', orgId)
    .eq('user_id', userId)
    .maybeSingle();

  if (!membership) {
    await writeAuditLog(admin, {
      actorEmail: userEmail, action: 'invite_member',
      target: email, success: false,
      detail: { reason: 'not_a_member', organisation_id: orgId }, ...meta,
    });
    return json({ ok: false, reason: 'not_a_member_of_org' }, 403);
  }
  if (membership.role !== 'admin') {
    return json({ ok: false, reason: 'insufficient_role' }, 403);
  }

  // Get the org name (email template) + limits (cap enforcement).
  const { data: orgRow } = await admin
    .from('organisations')
    .select('name, slug, limits')
    .eq('id', orgId)
    .maybeSingle();

  if (!orgRow) return json({ ok: false, reason: 'org_not_found' }, 404);

  // Bail if there's already an active invite for this email/org.
  const { data: existing } = await admin
    .from('organisation_invitations')
    .select('id, token, expires_at')
    .eq('organisation_id', orgId)
    .eq('email', email)
    .is('accepted_at', null)
    .gt('expires_at', new Date().toISOString())
    .maybeSingle();

  if (existing) {
    return json({ ok: true, token: existing.token, message: 'invite_already_pending' });
  }

  // Enforce the org's member cap (organisations.limits.members). NULL limits =
  // uncapped (Vuelo Labs). Re-sends of a pending invite short-circuit above, so
  // they're never blocked. Pending invites aren't counted as members — the small
  // concurrent-invite overshoot is acceptable at cohort scale.
  if (orgRow.limits && Number.isFinite(orgRow.limits.members)) {
    const { count: memberCount } = await admin
      .from('organisation_members')
      .select('id', { count: 'exact', head: true })
      .eq('organisation_id', orgId);
    if ((memberCount || 0) >= orgRow.limits.members) {
      await writeAuditLog(admin, {
        actorEmail: userEmail, action: 'invite_member',
        target: email, success: false,
        detail: { reason: 'member_limit_exceeded', limit: orgRow.limits.members, count: memberCount }, ...meta,
      });
      return json({ ok: false, reason: 'member_limit_exceeded' }, 409);
    }
  }

  // Mint a token; insert the row.
  const inviteToken = generateToken();
  const expiresAt   = new Date(Date.now() + 7 * 86400000).toISOString();

  const { data: invite, error: insertErr } = await admin
    .from('organisation_invitations')
    .insert({
      organisation_id: orgId,
      email,
      role,
      token:      inviteToken,
      invited_by: userId,
      expires_at: expiresAt,
    })
    .select('id, token')
    .single();

  if (insertErr || !invite) {
    console.error('invite: insert failed', insertErr?.message);
    return json({ ok: false, reason: 'insert_failed', message: insertErr?.message }, 500);
  }

  // Send the invitation email via Resend's REST API. Uses the same RESEND_API_KEY
  // that's configured for Supabase Auth's SMTP, but here we hit Resend directly
  // (no SMTP) so we can customise the body / sender / subject without going
  // through Supabase Auth's invite flow (which uses its own token system).
  const origin    = `${new URL(request.url).protocol}//${new URL(request.url).host}`;
  const inviteUrl = `${origin}/cyborg/signup/?invite=${inviteToken}`;
  const roleLabel = role === 'admin' ? 'an admin' : 'a teammate';
  const inviterDisplay = userEmail || 'A Cyborg admin';

  console.log('invite: RESEND_API_KEY present?', !!env.RESEND_API_KEY, 'len:', env.RESEND_API_KEY?.length || 0);
  if (env.RESEND_API_KEY) {
    console.log('invite: calling Resend for', email, 'org=', orgRow.name);
    try {
      const html = `
<!DOCTYPE html>
<html><body style="font-family:-apple-system,'Inter',sans-serif; background:#FAF8F4; color:#2A2420; margin:0; padding:32px;">
  <div style="max-width:480px; margin:0 auto; background:#F2EDE6; border:1px solid #E5DFD6; border-radius:14px; padding:32px;">
    <h1 style="font-family:'Newsreader',Georgia,serif; font-size:1.5rem; font-weight:500; margin:0 0 16px; color:#6B5540;">You're invited to join ${escapeHtml(orgRow.name)}</h1>
    <p style="line-height:1.55; color:#5E5450; margin:0 0 14px;">${escapeHtml(inviterDisplay)} invited you to join <strong>${escapeHtml(orgRow.name)}</strong> on Cyborg as ${roleLabel}.</p>
    <p style="margin:24px 0;">
      <a href="${inviteUrl}" style="display:inline-block; background:#6B5540; color:#FAF8F4; text-decoration:none; padding:11px 22px; border-radius:9px; font-weight:500;">Accept invitation</a>
    </p>
    <p style="line-height:1.55; color:#5E5450; font-size:0.88rem; margin:0 0 14px;">Or paste this link into your browser:</p>
    <p style="line-height:1.4; font-size:0.82rem; color:#5E5450; word-break:break-all; margin:0 0 14px;"><a href="${inviteUrl}" style="color:#6B5540;">${escapeHtml(inviteUrl)}</a></p>
    <p style="line-height:1.55; color:#8A7D77; font-size:0.82rem; margin:24px 0 0;">This invitation expires on ${escapeHtml(new Date(expiresAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }))}. If you weren't expecting this, you can ignore the email.</p>
  </div>
</body></html>`;

      const resendRes = await fetch('https://api.resend.com/emails', {
        method:  'POST',
        headers: {
          'Authorization': `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type':  'application/json',
        },
        body: JSON.stringify({
          from:    'Cyborg <hello@vuelolabs.com>',
          to:      [email],
          subject: `You're invited to join ${orgRow.name} on Cyborg`,
          html,
        }),
      });
      const resendText = await resendRes.text().catch(() => '');
      if (!resendRes.ok) {
        console.error('invite: Resend send failed', resendRes.status, resendText);
      } else {
        console.log('invite: Resend send OK', resendRes.status, resendText.slice(0, 200));
      }
    } catch (e) {
      console.error('invite: Resend fetch threw', e?.message || e);
    }
  } else {
    console.error('invite: RESEND_API_KEY missing — email not sent');
  }

  await writeAuditLog(admin, {
    actorEmail: userEmail, action: 'invite_member',
    target: email, success: true,
    detail: { organisation_id: orgId, role, invite_token: inviteToken, expires_at: expiresAt }, ...meta,
  });

  return json({ ok: true, token: inviteToken, invite_url: inviteUrl, expires_at: expiresAt });
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}

function escapeHtml(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}
