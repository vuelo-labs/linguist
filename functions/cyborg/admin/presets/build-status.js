// GET /cyborg/admin/presets/build-status?preset_slug=... — return the
// latest build state for the preset. Admin UI polls this every ~5s while
// a build is running.
//
// We read from Supabase only (the GHA workflow POSTs to build-callback
// when it finishes; that updates the preset row). No live GitHub API
// dependency here, so the poll is cheap.
//
// Auth: Cloudflare Access.

import { createClient } from '@supabase/supabase-js';
import { verifyAccessJwt } from '../../_access.js';
import { jsonResponse } from '../../_lib.js';

export async function onRequestGet({ request, env }) {
  const access = await verifyAccessJwt(request, env);
  if (!access.ok) {
    return jsonResponse({ error: 'Unauthorized', reason: access.reason }, 401);
  }

  const url = new URL(request.url);
  const slug = (url.searchParams.get('preset_slug') || '').trim();
  if (!slug) return jsonResponse({ error: 'preset_slug is required' }, 400);

  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);

  const { data: preset, error } = await supabase
    .from('presets')
    .select('slug, display_name, current_image_tag, current_git_sha, last_build_status, last_build_at, last_build_run_id')
    .eq('slug', slug)
    .maybeSingle();
  if (error) return jsonResponse({ error: 'Lookup failed', detail: error.message }, 500);
  if (!preset) return jsonResponse({ error: 'Unknown preset slug' }, 404);

  return jsonResponse({ preset });
}
