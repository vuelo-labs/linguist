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
  // machine_id so we can stop the candidate's workspace too.
  const { data, error } = await supabase
    .from('cyborg_tokens')
    .update({ revoked_at: new Date().toISOString() })
    .eq('token', token)
    .is('revoked_at', null)
    .select('token, fly_machine_id, candidate_label')
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

  // ── Stop the candidate's Fly Machine if one is running. Fire-and-forget;
  // revocation has already succeeded in the DB, the machine stop is a
  // best-effort cleanup. The runtime's next /api/config poll picks up the
  // revoked_at state via active-time → 'locked' and the workspace becomes
  // read-only regardless.
  let machineStopAttempted = false;
  let machineStopSuccess   = null;
  if (data.fly_machine_id && env.FLY_API_TOKEN && env.FLY_APP_NAME) {
    machineStopAttempted = true;
    try {
      const r = await fetch(
        `${FLY_API_BASE}/apps/${encodeURIComponent(env.FLY_APP_NAME)}/machines/${encodeURIComponent(data.fly_machine_id)}/stop`,
        { method: 'POST', headers: { 'Authorization': `Bearer ${env.FLY_API_TOKEN}` } }
      );
      machineStopSuccess = r.ok;
      if (!r.ok) {
        console.error('revoke: fly stop failed', r.status, await r.text().catch(() => ''));
      }
    } catch (e) {
      machineStopSuccess = false;
      console.error('revoke: fly stop error', e?.message || e);
    }
  }

  await writeAuditLog(supabase, {
    actorEmail: access.email, action: 'revoke',
    target: token, success: true,
    detail: {
      candidate_label:        data.candidate_label,
      fly_machine_id:         data.fly_machine_id,
      machine_stop_attempted: machineStopAttempted,
      machine_stop_success:   machineStopSuccess,
    },
    ...meta,
  });

  return json({
    ok: true,
    token,
    machine_stopped: machineStopSuccess,
    machine_id:      data.fly_machine_id,
  });
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}
