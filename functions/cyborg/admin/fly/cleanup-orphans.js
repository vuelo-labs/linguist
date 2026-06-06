// POST /cyborg/admin/fly/cleanup-orphans
// Lists every machine in the candidate-pool Fly app and destroys any whose
// id is NOT referenced by a currently-non-revoked cyborg_tokens row.
//
// Origin (2026-06-06): r16 verification machine survived the session that
// spawned it because the admin-side revoke calls .../stop (Fly auto-restarts
// stopped machines on inbound traffic). Until that endpoint is rewired to
// DELETE like the teammate-side one, this sweep is the cleanup hatch.
//
// Auth: Cloudflare Access (same as other /cyborg/admin/* routes).
// Body: {} (no params; future: per-preset filter).
// Returns: { ok, total, kept, destroyed, errors: [{machine_id, error}] }

import { createClient } from '@supabase/supabase-js';
import { verifyAccessJwt } from '../../_access.js';
import { writeAuditLog, requestMeta } from '../../_lib.js';

const FLY_API_BASE = 'https://api.machines.dev/v1';

export async function onRequestPost({ request, env }) {
  const meta = requestMeta(request);
  const access = await verifyAccessJwt(request, env);
  if (!access.ok) {
    const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);
    await writeAuditLog(supabase, {
      actorEmail: '(unauthenticated)', action: 'fly_cleanup_orphans',
      success: false, detail: { reason: access.reason }, ...meta,
    });
    return json({ error: 'Unauthorized', reason: access.reason }, 401);
  }

  if (!env.FLY_API_TOKEN || !env.FLY_APP_NAME) {
    return json({ error: 'Fly env not configured (FLY_API_TOKEN, FLY_APP_NAME)' }, 500);
  }

  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);

  // 1. Fetch the legitimate fly_machine_id set from non-revoked tokens.
  const { data: liveTokens, error: dbErr } = await supabase
    .from('cyborg_tokens')
    .select('token, fly_machine_id, candidate_label')
    .is('revoked_at', null)
    .not('fly_machine_id', 'is', null);
  if (dbErr) {
    console.error('cleanup-orphans: db error', dbErr.message);
    return json({ error: 'DB query failed', detail: dbErr.message }, 500);
  }
  const legitIds = new Set((liveTokens || []).map(t => t.fly_machine_id));

  // 2. List every machine in the candidate-pool app.
  let machines;
  try {
    const r = await fetch(
      `${FLY_API_BASE}/apps/${encodeURIComponent(env.FLY_APP_NAME)}/machines`,
      { headers: { 'Authorization': `Bearer ${env.FLY_API_TOKEN}` } }
    );
    if (!r.ok) {
      const body = await r.text().catch(() => '');
      console.error('cleanup-orphans: fly list failed', r.status, body);
      return json({ error: 'Fly list failed', status: r.status, body }, 502);
    }
    machines = await r.json();
  } catch (e) {
    console.error('cleanup-orphans: fly list error', e?.message || e);
    return json({ error: 'Fly list error', detail: e?.message || String(e) }, 502);
  }

  // 3. For each Fly machine whose id is NOT in legitIds, destroy.
  const orphans = (machines || []).filter(m => !legitIds.has(m.id));
  const errors = [];
  let destroyed = 0;
  for (const m of orphans) {
    try {
      const r = await fetch(
        `${FLY_API_BASE}/apps/${encodeURIComponent(env.FLY_APP_NAME)}/machines/${encodeURIComponent(m.id)}?force=true`,
        { method: 'DELETE', headers: { 'Authorization': `Bearer ${env.FLY_API_TOKEN}` } }
      );
      if (r.ok || r.status === 404) {
        destroyed++;
      } else {
        const body = await r.text().catch(() => '');
        errors.push({ machine_id: m.id, name: m.name, status: r.status, body });
      }
    } catch (e) {
      errors.push({ machine_id: m.id, name: m.name, error: e?.message || String(e) });
    }
  }

  const result = {
    total:    (machines || []).length,
    kept:     ((machines || []).length) - orphans.length,
    orphans:  orphans.length,
    destroyed,
    errors,
    machines_destroyed: orphans
      .filter(m => !errors.find(e => e.machine_id === m.id))
      .map(m => ({ id: m.id, name: m.name, state: m.state })),
  };

  await writeAuditLog(supabase, {
    actorEmail: access.email, action: 'fly_cleanup_orphans',
    target: env.FLY_APP_NAME, success: errors.length === 0,
    detail: result, ...meta,
  });

  return json({ ok: true, ...result });
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}
