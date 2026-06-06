// /cyborg/admin/presets/pool — manage the pre-warmed Fly machine pool
// for a single preset (V1.2 Phase D).
//
// Pool is opt-in per-preset: presets.target_pool_size > 0 is the only
// "warm" signal. The warmer process (Fly Machine Schedule) polls the
// pool table every ~60s and spawns up to target_pool_size machines per
// preset, so there is no explicit "warm now" button — bumping the target
// IS the warm signal. Likewise "drain" simply marks the existing ready/
// warming rows as `destroying` and DELETEs the underlying Fly machine;
// the warmer sweeps the row state on its next tick.
//
// Endpoints:
//   GET  ?preset_id=<id>                              → list pool rows + targets
//   POST { preset_id, action:'set_target', target_pool_size:int }
//   POST { preset_id, action:'drain' }
//
// Auth: Cloudflare Access (mirrors build.js).

import { createClient } from '@supabase/supabase-js';
import { verifyAccessJwt } from '../../_access.js';
import { writeAuditLog, requestMeta, jsonResponse } from '../../_lib.js';

const FLY_API_BASE = 'https://api.machines.dev/v1';
const RECENT_ROW_LIMIT = 20;

// ── GET ───────────────────────────────────────────────────────────────────
export async function onRequestGet({ request, env }) {
  const access = await verifyAccessJwt(request, env);
  if (!access.ok) {
    return jsonResponse({ error: 'Unauthorized', reason: access.reason }, 401);
  }

  const url = new URL(request.url);
  const presetId = (url.searchParams.get('preset_id') || '').trim();
  if (!presetId) return jsonResponse({ error: 'preset_id is required' }, 400);

  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);

  const { data: preset, error: presetErr } = await supabase
    .from('presets')
    .select('id, slug, target_pool_size, max_pool_size')
    .eq('id', presetId)
    .maybeSingle();
  if (presetErr) return jsonResponse({ error: 'Preset lookup failed', detail: presetErr.message }, 500);
  if (!preset) return jsonResponse({ error: 'Unknown preset_id' }, 404);

  const { data: rows, error: poolErr } = await supabase
    .from('preset_machine_pool')
    .select('id, fly_machine_id, fly_machine_name, state, warmed_at, claimed_at, claimed_by_token, created_at')
    .eq('preset_id', presetId)
    .order('created_at', { ascending: false })
    .limit(RECENT_ROW_LIMIT);
  if (poolErr) {
    console.error('pool GET list error:', poolErr.message);
    return jsonResponse({ error: 'Pool query failed', detail: poolErr.message }, 500);
  }

  return jsonResponse({
    ok: true,
    preset_id: preset.id,
    preset_slug: preset.slug,
    target_pool_size: preset.target_pool_size ?? 0,
    max_pool_size: preset.max_pool_size ?? 5,
    machines: rows || [],
  });
}

// ── POST (set_target | drain) ────────────────────────────────────────────
export async function onRequestPost({ request, env }) {
  const meta = requestMeta(request);
  const access = await verifyAccessJwt(request, env);
  if (!access.ok) {
    return jsonResponse({ error: 'Unauthorized', reason: access.reason }, 401);
  }

  let body;
  try { body = await request.json(); } catch { return jsonResponse({ error: 'Invalid JSON' }, 400); }
  const presetId = (body.preset_id || '').toString().trim();
  const action = (body.action || '').toString().trim();
  if (!presetId) return jsonResponse({ error: 'preset_id is required' }, 400);
  if (!action) return jsonResponse({ error: 'action is required' }, 400);

  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);

  const { data: preset, error: presetErr } = await supabase
    .from('presets')
    .select('id, slug, target_pool_size, max_pool_size')
    .eq('id', presetId)
    .maybeSingle();
  if (presetErr) return jsonResponse({ error: 'Preset lookup failed', detail: presetErr.message }, 500);
  if (!preset) return jsonResponse({ error: 'Unknown preset_id' }, 404);

  if (action === 'set_target') {
    return handleSetTarget({ request, env, supabase, access, meta, preset, body });
  }
  if (action === 'drain') {
    return handleDrain({ request, env, supabase, access, meta, preset });
  }
  return jsonResponse({ error: `Unknown action: ${action}` }, 400);
}

async function handleSetTarget({ supabase, access, meta, preset, body }) {
  const raw = body.target_pool_size;
  const target = Number.isFinite(raw) ? Math.trunc(raw) : parseInt(raw, 10);
  if (!Number.isFinite(target)) {
    return jsonResponse({ error: 'target_pool_size must be an integer' }, 400);
  }
  const maxAllowed = preset.max_pool_size ?? 5;
  if (target < 0 || target > maxAllowed) {
    return jsonResponse({
      error: `target_pool_size out of range`,
      detail: `Must be between 0 and ${maxAllowed} (preset max_pool_size).`,
    }, 400);
  }

  const { error: updErr } = await supabase
    .from('presets')
    .update({ target_pool_size: target })
    .eq('id', preset.id);
  if (updErr) {
    console.error('pool set_target update failed:', updErr.message);
    return jsonResponse({ error: 'Update failed', detail: updErr.message }, 500);
  }

  await writeAuditLog(supabase, {
    actorEmail: access.email,
    action:     'pool_target_set',
    target:     preset.slug,
    success:    true,
    detail:     { preset_id: preset.id, target_pool_size: target },
    ...meta,
  });

  return jsonResponse({
    ok: true,
    preset_id: preset.id,
    target_pool_size: target,
    max_pool_size: maxAllowed,
  });
}

async function handleDrain({ env, supabase, access, meta, preset }) {
  if (!env.FLY_API_TOKEN || !env.FLY_APP_NAME) {
    return jsonResponse({ error: 'Fly env not configured (FLY_API_TOKEN, FLY_APP_NAME)' }, 500);
  }

  // 1. Snapshot the rows we're going to drain (ready + warming).
  const { data: rows, error: listErr } = await supabase
    .from('preset_machine_pool')
    .select('id, fly_machine_id, fly_machine_name, state')
    .eq('preset_id', preset.id)
    .in('state', ['ready', 'warming']);
  if (listErr) {
    console.error('pool drain list failed:', listErr.message);
    return jsonResponse({ error: 'List failed', detail: listErr.message }, 500);
  }

  const errors = [];
  let destroyed = 0;

  // 2. DELETE the Fly machine + UPDATE row state to 'destroying'. The
  //    warmer will collect the destroying rows on its next tick (final
  //    delete from the pool table happens there to keep the audit trail).
  for (const row of rows || []) {
    try {
      const r = await fetch(
        `${FLY_API_BASE}/apps/${encodeURIComponent(env.FLY_APP_NAME)}/machines/${encodeURIComponent(row.fly_machine_id)}?force=true`,
        { method: 'DELETE', headers: { 'Authorization': `Bearer ${env.FLY_API_TOKEN}` } },
      );
      if (r.ok || r.status === 404) {
        destroyed++;
      } else {
        const txt = await r.text().catch(() => '');
        errors.push({ pool_id: row.id, fly_machine_id: row.fly_machine_id, status: r.status, body: txt.slice(0, 200) });
      }
    } catch (e) {
      errors.push({ pool_id: row.id, fly_machine_id: row.fly_machine_id, error: e?.message || String(e) });
    }

    const { error: updErr } = await supabase
      .from('preset_machine_pool')
      .update({ state: 'destroying' })
      .eq('id', row.id);
    if (updErr) {
      console.error('pool drain row update failed:', updErr.message, 'row:', row.id);
      errors.push({ pool_id: row.id, fly_machine_id: row.fly_machine_id, db_error: updErr.message });
    }
  }

  await writeAuditLog(supabase, {
    actorEmail: access.email,
    action:     'pool_drain',
    target:     preset.slug,
    success:    errors.length === 0,
    detail:     { preset_id: preset.id, destroyed, errors: errors.length, drained_rows: (rows || []).length },
    ...meta,
  });

  return jsonResponse({ ok: true, preset_id: preset.id, destroyed, errors });
}
