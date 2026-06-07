// POST /cyborg/app/api/candidates/revoke — org member revokes a candidate token.
//
// Auth: enforced by /cyborg/app/_middleware.js (X-Cyborg-User-Id header).
// Body: { token: 'cyb_...' }
//
// Behaviour:
//   1. Look up the token; verify it belongs to an org the caller is a member of
//   2. Atomic claim on revoked_at (only the first call wins)
//   3. Destroy the candidate's Fly resources (best-effort)
//   4. Write to cyborg_admin_audit
//
// Phase E (2026-06-07): per-candidate Fly apps.
//   • fly_app_name set on the row → DELETE the whole app
//     (`/v1/apps/<name>?force=true`) — destroys the app, its single machine
//     and the public hostname in one call.
//   • fly_app_name NULL (legacy pre-Phase-E row) → keep the per-machine
//     DELETE path against env.FLY_APP_NAME so in-flight pool sessions still
//     get cleaned up correctly.
//   • Audit detail carries both legacy machine_destroy_* and new
//     app_destroy_* fields for back-compat with the audit UI.

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
    .select('token, organisation_id, fly_machine_id, fly_app_name, candidate_label, revoked_at')
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
    .select('token, fly_machine_id, fly_app_name')
    .maybeSingle();

  if (claimErr) {
    console.error('revoke: claim failed', claimErr.message);
    return json({ ok: false, reason: 'claim_failed' }, 500);
  }
  if (!claimed) return json({ ok: false, reason: 'already_revoked' }, 409);

  // Destroy candidate Fly resources.
  //   • Per-candidate app (Phase E): DELETE the whole app — one call kills
  //     app + machine + hostname.
  //   • Legacy (NULL fly_app_name): DELETE the single machine inside the
  //     shared pool app.
  // ?force=true allows destroying a started resource without an explicit
  // stop step. 404 is treated as success (already gone).
  let appDestroyAttempted     = false;
  let appDestroySuccess       = null;
  let machineDestroyAttempted = false;
  let machineDestroySuccess   = null;
  if (env.FLY_API_TOKEN) {
    if (claimed.fly_app_name) {
      appDestroyAttempted = true;
      try {
        const r = await fetch(
          `${FLY_API_BASE}/apps/${encodeURIComponent(claimed.fly_app_name)}?force=true`,
          { method: 'DELETE', headers: { 'Authorization': `Bearer ${env.FLY_API_TOKEN}` } }
        );
        appDestroySuccess = r.ok || r.status === 404;
      } catch (e) {
        appDestroySuccess = false;
        console.error('revoke: fly app destroy error', e?.message || e);
      }
    } else if (claimed.fly_machine_id && env.FLY_APP_NAME) {
      machineDestroyAttempted = true;
      try {
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
  }

  await writeAuditLog(admin, {
    actorEmail: userEmail, action: 'revoke_candidate_token',
    target: token, success: true,
    detail: {
      candidate_label:           tokenRow.candidate_label,
      organisation_id:           tokenRow.organisation_id,
      fly_app_name:              claimed.fly_app_name,
      fly_machine_id:            claimed.fly_machine_id,
      app_destroy_attempted:     appDestroyAttempted,
      app_destroy_success:       appDestroySuccess,
      machine_destroy_attempted: machineDestroyAttempted,
      machine_destroy_success:   machineDestroySuccess,
      member_role:               membership.role,
    },
    ...meta,
  });

  return json({
    ok:                true,
    token,
    app_destroyed:     appDestroySuccess,
    machine_destroyed: machineDestroySuccess,
  });
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}
