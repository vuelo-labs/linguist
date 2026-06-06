// GET /cyborg/admin/presets — list every preset in the registry with its
// current build status. Vuelo admin sees all; customer-admin filtering
// ships when customer admins land.
//
// V1.2 (2026-06-06 Phase D-C): also returns target_pool_size, max_pool_size,
// and a per-preset pool_counts breakdown so the admin Presets card can
// surface "2 ready, 1 warming / target 3 (max 5)" inline.
//
// Auth: Cloudflare Access.

import { createClient } from '@supabase/supabase-js';
import { verifyAccessJwt } from '../../_access.js';
import { jsonResponse } from '../../_lib.js';

const EMPTY_POOL_COUNTS = Object.freeze({
  ready: 0, warming: 0, claimed: 0, destroying: 0, failed: 0,
});

export async function onRequestGet({ request, env }) {
  const access = await verifyAccessJwt(request, env);
  if (!access.ok) {
    return jsonResponse({ error: 'Unauthorized', reason: access.reason }, 401);
  }

  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);

  const { data: presets, error } = await supabase
    .from('presets')
    .select('id, slug, display_name, description, key_source, current_image_tag, current_git_sha, last_build_at, last_build_status, last_build_run_id, target_pool_size, max_pool_size, created_at')
    .order('display_name', { ascending: true });

  if (error) {
    console.error('list presets error:', error.message);
    return jsonResponse({ error: 'Failed to list presets.' }, 500);
  }

  const presetRows = presets || [];

  // Pool counts: one query per preset, grouped client-side. Cheap at the
  // current preset count (<10); revisit if presets multiply by an order
  // of magnitude. We default missing states to 0 so the UI never sees an
  // undefined bucket. `failed` is reserved (not in the canonical state
  // list yet) but exposed for forward-compat with the warmer's error
  // path; today it will always be 0.
  const enriched = [];
  for (const p of presetRows) {
    const counts = { ...EMPTY_POOL_COUNTS };
    const { data: rows, error: poolErr } = await supabase
      .from('preset_machine_pool')
      .select('state')
      .eq('preset_id', p.id);
    if (poolErr) {
      console.error('list presets pool count error:', poolErr.message, 'preset:', p.slug);
      // Fall through with zeros rather than failing the whole list.
    } else {
      for (const row of rows || []) {
        const s = row.state;
        if (counts[s] !== undefined) counts[s] += 1;
      }
    }
    enriched.push({ ...p, pool_counts: counts });
  }

  return jsonResponse({ presets: enriched });
}
