// POST /cyborg/app/api/candidates/revoke — org member revokes a candidate token.
//
// Auth: enforced by /cyborg/app/_middleware.js (X-Cyborg-User-Id header).
// Body: { token: 'cyb_...' }
//
// Behaviour:
//   1. Look up the token; verify it belongs to an org the caller is a member of
//   2. Atomic claim on revoked_at (only the first call wins)
//   3. Stop the candidate's Fly Machine if one is running (best-effort)
//   4. Write to cyborg_admin_audit

import { createClient } from '@supabase/supabase-js';
import { writeAuditLog, requestMeta } from '../../../_lib.js';

const FLY_API_BASE = 'https://api.machines.dev/v1';

export async function onRequestPost({ request, env }) {
  const userId    = request.headers.get('x-cyborg-user-id') || '';
  const userEmail = request.headers.get('x-cyborg-user-email') || '';
  const meta      = requestMeta(request);

  if (!userId) return json({ ok: false, reason: 'no_user' }, 401);

  let body;
  try { body = await request.json(); } catch { return json({ ok: false, reason: 'bad_json' }, 400); }
  const token = (body.token || '').toString().trim();
  if (!token) return json({ ok: false, reason: 'missing_token' }, 400);

  const admin = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);

  // Pull the token to know which org it belongs to.
  const { data: tokenRow, error: lookupErr } = await admin
    .from('cyborg_tokens')
    .select('token, organisation_id, fly_machine_id, candidate_label, revoked_at')
    .eq('token', token)
    .maybeSingle();

  if (lookupErr || !tokenRow) return json({ ok: false, reason: 'not_found' }, 404);
  if (tokenRow.revoked_at)    return json({ ok: false, reason: 'already_revoked' }, 409);

  // Verify the caller is a member of the token's org.
  const { data: membership } = await admin
    .from('organisation_members')
    .select('id, role')
    .eq('organisation_id', tokenRow.organisation_id)
    .eq('user_id', userId)
    .maybeSingle();

  if (!membership) {
    await writeAuditLog(admin, {
      actorEmail: userEmail, action: 'revoke_candidate_token',
      target: token, success: false,
      detail: { reason: 'not_a_member' }, ...meta,
    });
    return json({ ok: false, reason: 'not_a_member_of_org' }, 403);
  }

  // Atomic claim — first revoke wins.
  const { data: claimed, error: claimErr } = await admin
    .from('cyborg_tokens')
    .update({ revoked_at: new Date().toISOString() })
    .eq('token', token)
    .is('revoked_at', null)
    .select('token, fly_machine_id')
    .maybeSingle();

  if (claimErr) {
    console.error('revoke: claim failed', claimErr.message);
    return json({ ok: false, reason: 'claim_failed' }, 500);
  }
  if (!claimed) return json({ ok: false, reason: 'already_revoked' }, 409);

  // Destroy the candidate's Fly machine if running (was: stop, but Fly
  // auto-restarts stopped machines on the next request and the resurrected
  // machine still has the old token's env → "token not recognised" for a
  // freshly-issued token in the same app. Destroy is permanent and correct
  // for a revoked candidate). Saw the ghost-machine class 2026-06-06; see
  // cyborg/planning/backlog-decisions.md § "Revoke leaves restartable
  // machine".
  let machineDestroyAttempted = false;
  let machineDestroySuccess   = null;
  if (claimed.fly_machine_id && env.FLY_API_TOKEN && env.FLY_APP_NAME) {
    machineDestroyAttempted = true;
    try {
      // ?force=true to allow destroying a started machine without an
      // explicit stop step. Idempotent: 404 on an already-destroyed machine
      // is treated as success (we already had the row revoked in DB).
      const r = await fetch(
        `${FLY_API_BASE}/apps/${encodeURIComponent(env.FLY_APP_NAME)}/machines/${encodeURIComponent(claimed.fly_machine_id)}?force=true`,
        { method: 'DELETE', headers: { 'Authorization': `Bearer ${env.FLY_API_TOKEN}` } }
      );
      machineDestroySuccess = r.ok || r.status === 404;
    } catch (e) {
      machineDestroySuccess = false;
      console.error('revoke: fly destroy error', e?.message || e);
    }
  }

  await writeAuditLog(admin, {
    actorEmail: userEmail, action: 'revoke_candidate_token',
    target: token, success: true,
    detail: {
      candidate_label:           tokenRow.candidate_label,
      organisation_id:           tokenRow.organisation_id,
      fly_machine_id:            claimed.fly_machine_id,
      machine_destroy_attempted: machineDestroyAttempted,
      machine_destroy_success:   machineDestroySuccess,
      member_role:               membership.role,
    },
    ...meta,
  });

  return json({ ok: true, token, machine_destroyed: machineDestroySuccess });
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}
