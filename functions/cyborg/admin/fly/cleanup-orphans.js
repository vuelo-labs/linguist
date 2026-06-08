// POST /cyborg/admin/fly/cleanup-orphans  → actually destroys orphans
// GET  /cyborg/admin/fly/cleanup-orphans  → dry-run preview (no destruction)
//
// Two sweeps in one call:
//
//   A. Per-candidate apps (Phase E, 2026-06-07): lists every Fly app in the
//      configured org with a name matching `cyborg-c-*`. Targets any whose
//      name is NOT referenced by a currently-non-revoked cyborg_tokens row.
//
//   B. Legacy shared-pool machines (pre-Phase-E): lists every machine in
//      env.FLY_APP_NAME and targets any whose id is NOT referenced by a
//      non-revoked token row. Kept for back-compat with in-flight pre-Phase-E
//      sessions and any test machines spawned directly via Fly CLI.
//
// Response shape (both modes):
//   { ok, dry_run, per_app: {
//       total, kept, orphans, destroyed,
//       orphan_apps:    [{ name, status }],   // always — the targets
//       apps_destroyed: [{ name, status }],   // POST only — subset that succeeded
//       errors: [...]
//     },
//     legacy_pool: {
//       total, kept, orphans, destroyed,
//       orphan_machines:    [{ id, name, state }],
//       machines_destroyed: [{ id, name, state }],
//       errors: [...]
//     }
//   }
//
// Auth: Cloudflare Access (same as other /cyborg/admin/* routes).

import { createClient } from '@supabase/supabase-js';
import { verifyAccessJwt } from '../../_access.js';
import { writeAuditLog, requestMeta } from '../../_lib.js';

const FLY_API_BASE         = 'https://api.machines.dev/v1';
const FLY_LIST_APPS_URL    = (orgSlug) =>
  `https://api.machines.dev/v1/apps?org_slug=${encodeURIComponent(orgSlug)}`;
const PER_APP_PREFIX = 'cyborg-c-';

export async function onRequestGet({ request, env }) {
  return handle(request, env, { dryRun: true });
}

export async function onRequestPost({ request, env }) {
  return handle(request, env, { dryRun: false });
}

async function handle(request, env, { dryRun }) {
  const meta = requestMeta(request);
  const access = await verifyAccessJwt(request, env);
  if (!access.ok) {
    const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);
    await writeAuditLog(supabase, {
      actorEmail: '(unauthenticated)',
      action: dryRun ? 'fly_cleanup_orphans_preview' : 'fly_cleanup_orphans',
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

  const perApp     = await sweepPerCandidateApps(env, liveAppNames, dryRun);
  const legacyPool = await sweepLegacyPoolMachines(env, liveMachineIds, dryRun);

  // Don't audit preview calls — they're idempotent / no side effects.
  if (!dryRun) {
    const sweepOk = !perApp.error && !legacyPool.error
      && (perApp.errors || []).length === 0
      && (legacyPool.errors || []).length === 0;
    await writeAuditLog(supabase, {
      actorEmail: access.email, action: 'fly_cleanup_orphans',
      target: env.FLY_APP_NAME, success: sweepOk,
      detail: { per_app: perApp, legacy_pool: legacyPool }, ...meta,
    });
  }

  return json({ ok: true, dry_run: dryRun, per_app: perApp, legacy_pool: legacyPool });
}

// ── Sweep A: per-candidate apps ───────────────────────────────────────────
async function sweepPerCandidateApps(env, liveAppNames, dryRun) {
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
    apps = Array.isArray(payload) ? payload : (payload?.apps || []);
  } catch (e) {
    console.error('cleanup-orphans: fly list apps error', e?.message || e);
    return { error: 'list_apps_error', detail: e?.message || String(e) };
  }

  const candidateApps = apps.filter(a => (a.name || '').startsWith(PER_APP_PREFIX));
  const orphans = candidateApps.filter(a => !liveAppNames.has(a.name));
  const orphanList = orphans.map(a => ({ name: a.name, status: a.status }));

  if (dryRun) {
    return {
      total:   candidateApps.length,
      kept:    candidateApps.length - orphans.length,
      orphans: orphans.length,
      destroyed: 0,
      orphan_apps: orphanList,
      apps_destroyed: [],
      errors: [],
    };
  }

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
    total:   candidateApps.length,
    kept:    candidateApps.length - orphans.length,
    orphans: orphans.length,
    destroyed,
    orphan_apps:    orphanList,
    apps_destroyed: orphans
      .filter(a => !errors.find(e => e.app_name === a.name))
      .map(a => ({ name: a.name, status: a.status })),
    errors,
  };
}

// ── Sweep B: legacy shared-pool machines (back-compat) ────────────────────
async function sweepLegacyPoolMachines(env, liveMachineIds, dryRun) {
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
  const orphanList = orphans.map(m => ({ id: m.id, name: m.name, state: m.state }));

  if (dryRun) {
    return {
      total:   (machines || []).length,
      kept:    ((machines || []).length) - orphans.length,
      orphans: orphans.length,
      destroyed: 0,
      orphan_machines:    orphanList,
      machines_destroyed: [],
      errors: [],
    };
  }

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
    total:   (machines || []).length,
    kept:    ((machines || []).length) - orphans.length,
    orphans: orphans.length,
    destroyed,
    orphan_machines:    orphanList,
    machines_destroyed: orphans
      .filter(m => !errors.find(e => e.machine_id === m.id))
      .map(m => ({ id: m.id, name: m.name, state: m.state })),
    errors,
  };
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}
