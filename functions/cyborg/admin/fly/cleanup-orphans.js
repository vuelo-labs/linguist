// POST /cyborg/admin/fly/cleanup-orphans
//
// Two sweeps in one call:
//
//   A. Per-candidate apps (Phase E, 2026-06-07): lists every Fly app in the
//      configured org with a name matching `cyborg-c-*`. Destroys any whose
//      name is NOT referenced by a currently-non-revoked cyborg_tokens row.
//      A revoked candidate whose app destroy failed mid-revoke, or a launch
//      that crashed between app-create and DB-persist, both show up here.
//
//   B. Legacy shared-pool machines (pre-Phase-E): lists every machine in
//      env.FLY_APP_NAME and destroys any whose id is NOT referenced by a
//      non-revoked token row. Kept for back-compat with in-flight pre-Phase-E
//      sessions and any test machines spawned directly via Fly CLI.
//
// Origin (2026-06-06): r16 verification machine survived the session that
// spawned it because the admin-side revoke calls .../stop (Fly auto-restarts
// stopped machines on inbound traffic). The admin-side revoke is now per-app
// DELETE (2026-06-07) but the sweep stays as the cleanup hatch.
//
// Auth: Cloudflare Access (same as other /cyborg/admin/* routes).
// Body: {} (no params; future: per-preset filter).
// Returns: { ok, per_app: {...}, legacy_pool: {...} }

import { createClient } from '@supabase/supabase-js';
import { verifyAccessJwt } from '../../_access.js';
import { writeAuditLog, requestMeta } from '../../_lib.js';

const FLY_API_BASE         = 'https://api.machines.dev/v1';
const FLY_LIST_APPS_URL    = (orgSlug) =>
  `https://api.machines.dev/v1/apps?org_slug=${encodeURIComponent(orgSlug)}`;
// NOTE: Fly's "list apps" endpoint sits on api.machines.dev/v1/apps in current
// Machines API docs. If a 404 is returned by Fly, the alternative endpoint is
// https://api.fly.io/v1/apps?org_slug=<slug> (different host, same shape).
// Sweep falls through with `list_apps_failed` so the operator can debug.
const PER_APP_PREFIX = 'cyborg-c-';

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

  // Fetch live token state once — both sweeps consume it.
  const { data: liveTokens, error: dbErr } = await supabase
    .from('cyborg_tokens')
    .select('token, fly_app_name, fly_machine_id, candidate_label')
    .is('revoked_at', null)
    .not('fly_machine_id', 'is', null);
  if (dbErr) {
    console.error('cleanup-orphans: db error', dbErr.message);
    return json({ error: 'DB query failed', detail: dbErr.message }, 500);
  }
  const liveAppNames = new Set(
    (liveTokens || []).map(t => t.fly_app_name).filter(Boolean)
  );
  const liveMachineIds = new Set((liveTokens || []).map(t => t.fly_machine_id));

  const perApp      = await sweepPerCandidateApps(env, liveAppNames);
  const legacyPool  = await sweepLegacyPoolMachines(env, liveMachineIds);

  const sweepOk = !perApp.error && !legacyPool.error
    && (perApp.errors || []).length === 0
    && (legacyPool.errors || []).length === 0;

  await writeAuditLog(supabase, {
    actorEmail: access.email, action: 'fly_cleanup_orphans',
    target: env.FLY_APP_NAME, success: sweepOk,
    detail: { per_app: perApp, legacy_pool: legacyPool }, ...meta,
  });

  return json({ ok: true, per_app: perApp, legacy_pool: legacyPool });
}

// ── Sweep A: per-candidate apps ───────────────────────────────────────────
async function sweepPerCandidateApps(env, liveAppNames) {
  if (!env.FLY_ORG_SLUG) {
    return { skipped: true, reason: 'FLY_ORG_SLUG_not_set' };
  }
  let apps;
  try {
    const r = await fetch(
      FLY_LIST_APPS_URL(env.FLY_ORG_SLUG),
      { headers: { 'Authorization': `Bearer ${env.FLY_API_TOKEN}` } },
    );
    if (!r.ok) {
      const body = await r.text().catch(() => '');
      console.error('cleanup-orphans: fly list apps failed', r.status, body);
      return { error: 'list_apps_failed', status: r.status, body };
    }
    const payload = await r.json();
    // Fly API returns either an array or { apps: [...] } depending on version.
    apps = Array.isArray(payload) ? payload : (payload?.apps || []);
  } catch (e) {
    console.error('cleanup-orphans: fly list apps error', e?.message || e);
    return { error: 'list_apps_error', detail: e?.message || String(e) };
  }

  const candidateApps = apps.filter(a => (a.name || '').startsWith(PER_APP_PREFIX));
  const orphans = candidateApps.filter(a => !liveAppNames.has(a.name));

  const errors = [];
  let destroyed = 0;
  for (const a of orphans) {
    try {
      const r = await fetch(
        `${FLY_API_BASE}/apps/${encodeURIComponent(a.name)}?force=true`,
        { method: 'DELETE', headers: { 'Authorization': `Bearer ${env.FLY_API_TOKEN}` } },
      );
      if (r.ok || r.status === 404) {
        destroyed++;
      } else {
        const body = await r.text().catch(() => '');
        errors.push({ app_name: a.name, status: r.status, body });
      }
    } catch (e) {
      errors.push({ app_name: a.name, error: e?.message || String(e) });
    }
  }

  return {
    total:    candidateApps.length,
    kept:     candidateApps.length - orphans.length,
    orphans:  orphans.length,
    destroyed,
    errors,
    apps_destroyed: orphans
      .filter(a => !errors.find(e => e.app_name === a.name))
      .map(a => ({ name: a.name, status: a.status })),
  };
}

// ── Sweep B: legacy shared-pool machines (back-compat) ────────────────────
async function sweepLegacyPoolMachines(env, liveMachineIds) {
  let machines;
  try {
    const r = await fetch(
      `${FLY_API_BASE}/apps/${encodeURIComponent(env.FLY_APP_NAME)}/machines`,
      { headers: { 'Authorization': `Bearer ${env.FLY_API_TOKEN}` } },
    );
    if (!r.ok) {
      const body = await r.text().catch(() => '');
      console.error('cleanup-orphans: fly list machines failed', r.status, body);
      return { error: 'list_machines_failed', status: r.status, body };
    }
    machines = await r.json();
  } catch (e) {
    console.error('cleanup-orphans: fly list machines error', e?.message || e);
    return { error: 'list_machines_error', detail: e?.message || String(e) };
  }

  const orphans = (machines || []).filter(m => !liveMachineIds.has(m.id));
  const errors = [];
  let destroyed = 0;
  for (const m of orphans) {
    try {
      const r = await fetch(
        `${FLY_API_BASE}/apps/${encodeURIComponent(env.FLY_APP_NAME)}/machines/${encodeURIComponent(m.id)}?force=true`,
        { method: 'DELETE', headers: { 'Authorization': `Bearer ${env.FLY_API_TOKEN}` } },
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

  return {
    total:    (machines || []).length,
    kept:     ((machines || []).length) - orphans.length,
    orphans:  orphans.length,
    destroyed,
    errors,
    machines_destroyed: orphans
      .filter(m => !errors.find(e => e.machine_id === m.id))
      .map(m => ({ id: m.id, name: m.name, state: m.state })),
  };
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}
