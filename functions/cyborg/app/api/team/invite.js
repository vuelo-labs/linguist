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
import { generateToken, writeAuditLog, requestMeta } from '../../../_lib.js';

export async function onRequestPost({ request, env }) {
  const userId    = request.headers.get('x-cyborg-user-id') || '';
  const userEmail = request.headers.get('x-cyborg-user-email') || '';
  const meta      = requestMeta(request);

  if (!userId) return json({ ok: false, reason: 'no_user' }, 401);

  let body;
  try { body = await request.json(); } catch { return json({ ok: false, reason: 'bad_json' }, 400); }

  const orgId = (body.organisation_id || '').toString().trim();
  const email = (body.email || '').toString().trim().toLowerCase();
  const role  = (body.role  || 'teammate').toString().trim();

  if (!orgId || !email) return json({ ok: false, reason: 'missing_fields' }, 400);
  if (!['admin', 'teammate'].includes(role)) return json({ ok: false, reason: 'bad_role' }, 400);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ ok: false, reason: 'bad_email' }, 400);

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

  // Get the org name for the email template.
  const { data: orgRow } = await admin
    .from('organisations')
    .select('name, slug')
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

  // Fire Tines so the invitee gets an email. (Body-secret + header pattern
  // matches the existing register / approve paths.) If Tines isn't wired for
  // this event_type yet, the inviter still has the link to share manually.
  const origin    = `${new URL(request.url).protocol}//${new URL(request.url).host}`;
  const inviteUrl = `${origin}/cyborg/signup/?invite=${inviteToken}`;

  if (env.TINES_REQUEST_WEBHOOK) {
    try {
      await fetch(env.TINES_REQUEST_WEBHOOK, {
        method:  'POST',
        headers: {
          'Content-Type':            'application/json',
          'X-Cyborg-Webhook-Secret': env.TINES_WEBHOOK_SECRET || '',
        },
        body: JSON.stringify({
          webhook_secret: env.TINES_WEBHOOK_SECRET || '',
          event_type:     'team_invite',
          email,
          role,
          invite_url:     inviteUrl,
          expires_at:     expiresAt,
          organisation_name: orgRow.name,
          invited_by_email:  userEmail,
        }),
      });
    } catch (e) {
      console.error('invite: Tines forward failed', e?.message || e);
    }
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
