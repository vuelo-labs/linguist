// GET /cyborg/admin/presets — list every preset in the registry with its
// current build status. Vuelo admin sees all; customer-admin filtering
// ships when customer admins land.
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

  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);

  const { data: presets, error } = await supabase
    .from('presets')
    .select('id, slug, display_name, description, key_source, current_image_tag, current_git_sha, last_build_at, last_build_status, last_build_run_id, created_at')
    .order('display_name', { ascending: true });

  if (error) {
    console.error('list presets error:', error.message);
    return jsonResponse({ error: 'Failed to list presets.' }, 500);
  }

  return jsonResponse({ presets: presets || [] });
}
