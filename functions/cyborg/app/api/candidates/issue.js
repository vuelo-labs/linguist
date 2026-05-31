// POST /cyborg/app/api/candidates/issue — org member issues a new candidate token.
//
// Auth: enforced by /cyborg/app/_middleware.js (sets X-Cyborg-User-Id +
// X-Cyborg-User-Email on the request before this handler sees it).
//
// Body: { organisation_id: uuid, label: string, days?: number }
//
// Behaviour:
//   1. Verify the caller is a member of the named org (owner/admin/member
//      all allowed for V5 — role-based gating queues for V5.1).
//   2. Mint a token, insert into cyborg_tokens with organisation_id +
//      issued_by_user_id populated.
//   3. Write to cyborg_admin_audit so the action is captured in the
//      append-only log alongside super-user actions.
//   4. Return the token and the install URL for the candidate.

import { createClient } from '@supabase/supabase-js';
import { generateToken, writeAuditLog, requestMeta } from '../../../_lib.js';

const DEFAULT_DAYS = 8;

export async function onRequestPost({ request, env }) {
  const userId    = request.headers.get('x-cyborg-user-id') || '';
  const userEmail = request.headers.get('x-cyborg-user-email') || '';
  const meta      = requestMeta(request);

  if (!userId) return json({ ok: false, reason: 'no_user' }, 401);

  let body;
  try { body = await request.json(); } catch { return json({ ok: false, reason: 'bad_json' }, 400); }

  const orgId = (body.organisation_id || '').toString().trim();
  const label = (body.label || '').toString().trim().slice(0, 200);
  const days  = Number.isFinite(body.days) ? Math.min(Math.max(body.days, 1), 30) : DEFAULT_DAYS;

  if (!orgId || !label) return json({ ok: false, reason: 'missing_fields' }, 400);

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

  const token     = generateToken();
  const issuedAt  = new Date().toISOString();
  const expiresAt = new Date(Date.now() + days * 86400000).toISOString();

  const { error: insertErr } = await admin.from('cyborg_tokens').insert({
    token,
    candidate_label:   label,
    issued_at:         issuedAt,
    expires_at:        expiresAt,
    approved_at:       issuedAt,
    organisation_id:   orgId,
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

  await writeAuditLog(admin, {
    actorEmail: userEmail, action: 'issue_candidate_token',
    target: token, success: true,
    detail: { label, days, expires_at: expiresAt, organisation_id: orgId, member_role: membership.role }, ...meta,
  });

  return json({ ok: true, token, expires_at: expiresAt });
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}
