// POST /cyborg/revoke — admin-only token revocation.
// Auth: Cloudflare Access JWT (cf-access-jwt-assertion header).
// Body: { token: 'cyb_...' }
//
// V5 hardening (2026-05-31):
//   • Writes to cyborg_admin_audit (append-only log)
//   • Revocation propagates to Fly: if the token has a fly_machine_id, the
//     running candidate workspace is stopped within seconds. A revoked
//     candidate cannot continue working — the runtime dies on the next
//     /api/config poll (which sees the lock + reason).
//
// Phase E (2026-06-07): admin revoke mirrors the teammate-side DELETE pattern.
//   • Per-candidate app (fly_app_name set): DELETE the whole app.
//   • Legacy row (fly_app_name NULL): DELETE the single machine. Fly
//     auto-restarts stopped machines on inbound traffic, so /stop is not
//     enough; this also closes the ghost-machine class observed 2026-06-06.
//   • Audit detail carries both legacy machine_stop_*/machine_destroy_* and
//     new app_destroy_* fields.

import { createClient } from '@supabase/supabase-js';
import { verifyAccessJwt } from './_access.js';
import { writeAuditLog, requestMeta } from './_lib.js';

const FLY_API_BASE = 'https://api.machines.dev/v1';

export async function onRequestPost({ request, env }) {
  const meta = requestMeta(request);
  const access = await verifyAccessJwt(request, env);
  if (!access.ok) {
    const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);
    await writeAuditLog(supabase, {
      actorEmail: '(unauthenticated)', action: 'revoke',
      success: false, detail: { reason: access.reason }, ...meta,
    });
    return json({ error: 'Unauthorized', reason: access.reason }, 401);
  }

  let body;
  try { body = await request.json(); } catch { return json({ error: 'Invalid JSON' }, 400); }
  const token = (body.token || '').toString().trim();
  if (!token) return json({ error: 'Missing token' }, 400);

  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);

  // Atomic claim — only one revoke "wins" if called concurrently. Pull the
  // app + machine ids so we can destroy the candidate's workspace too.
  const { data, error } = await supabase
    .from('cyborg_tokens')
    .update({ revoked_at: new Date().toISOString() })
    .eq('token', token)
    .is('revoked_at', null)
    .select('token, fly_machine_id, fly_app_name, candidate_label')
    .maybeSingle();

  if (error) {
    console.error('revoke error:', error.message);
    await writeAuditLog(supabase, {
      actorEmail: access.email, action: 'revoke',
      target: token, success: false,
      detail: { error: error.message }, ...meta,
    });
    return json({ error: 'Failed to revoke.' }, 500);
  }
  if (!data) {
    await writeAuditLog(supabase, {
      actorEmail: access.email, action: 'revoke',
      target: token, success: false,
      detail: { reason: 'not_found_or_already_revoked' }, ...meta,
    });
    return json({ ok: false, reason: 'not_found_or_already_revoked' }, 404);
  }

  // ── Destroy the candidate's Fly resources. Per-app DELETE for Phase E
  // rows; per-machine DELETE for legacy NULL-app rows. ?force=true allows
  // destroying without an explicit stop step; 404 is treated as success
  // (already gone). The runtime's next /api/config poll picks up the
  // revoked_at state via active-time → 'locked' even if the destroy fails,
  // so revocation enforcement isn't dependent on the Fly call succeeding.
  let appDestroyAttempted     = false;
  let appDestroySuccess       = null;
  let machineDestroyAttempted = false;
  let machineDestroySuccess   = null;
  if (env.FLY_API_TOKEN) {
    if (data.fly_app_name) {
      appDestroyAttempted = true;
      try {
        const r = await fetch(
          `${FLY_API_BASE}/apps/${encodeURIComponent(data.fly_app_name)}?force=true`,
          { method: 'DELETE', headers: { 'Authorization': `Bearer ${env.FLY_API_TOKEN}` } }
        );
        appDestroySuccess = r.ok || r.status === 404;
        if (!appDestroySuccess) {
          console.error('revoke: fly app destroy failed', r.status, await r.text().catch(() => ''));
        }
      } catch (e) {
        appDestroySuccess = false;
        console.error('revoke: fly app destroy error', e?.message || e);
      }
    } else if (data.fly_machine_id && env.FLY_APP_NAME) {
      machineDestroyAttempted = true;
      try {
        const r = await fetch(
          `${FLY_API_BASE}/apps/${encodeURIComponent(env.FLY_APP_NAME)}/machines/${encodeURIComponent(data.fly_machine_id)}?force=true`,
          { method: 'DELETE', headers: { 'Authorization': `Bearer ${env.FLY_API_TOKEN}` } }
        );
        machineDestroySuccess = r.ok || r.status === 404;
        if (!machineDestroySuccess) {
          console.error('revoke: fly machine destroy failed', r.status, await r.text().catch(() => ''));
        }
      } catch (e) {
        machineDestroySuccess = false;
        console.error('revoke: fly machine destroy error', e?.message || e);
      }
    }
  }

  await writeAuditLog(supabase, {
    actorEmail: access.email, action: 'revoke',
    target: token, success: true,
    detail: {
      candidate_label:           data.candidate_label,
      fly_app_name:              data.fly_app_name,
      fly_machine_id:            data.fly_machine_id,
      app_destroy_attempted:     appDestroyAttempted,
      app_destroy_success:       appDestroySuccess,
      machine_destroy_attempted: machineDestroyAttempted,
      machine_destroy_success:   machineDestroySuccess,
    },
    ...meta,
  });

  return json({
    ok:                true,
    token,
    app_destroyed:     appDestroySuccess,
    machine_destroyed: machineDestroySuccess,
    machine_id:        data.fly_machine_id,
    fly_app_name:      data.fly_app_name,
  });
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}
