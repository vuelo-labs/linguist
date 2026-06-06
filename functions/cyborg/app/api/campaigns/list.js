// GET /cyborg/app/api/campaigns/list?organisation_id=<uuid>
//   List campaigns in the caller's organisation, with preset metadata
//   and a count of presets the org has been assigned.
//
// Auth: enforced by /cyborg/app/_middleware.js
//   (sets X-Cyborg-User-Id + X-Cyborg-User-Email).

import { createClient } from '@supabase/supabase-js';
import { jsonResponse } from '../../../_lib.js';

export async function onRequestGet({ request, env }) {
  const userId = request.headers.get('x-cyborg-user-id') || '';
  if (!userId) return jsonResponse({ ok: false, reason: 'no_user' }, 401);

  const url = new URL(request.url);
  const orgId = (url.searchParams.get('organisation_id') || '').trim();
  if (!orgId) return jsonResponse({ ok: false, reason: 'missing_organisation_id' }, 400);

  const admin = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);

  const { data: membership, error: memErr } = await admin
    .from('organisation_members')
    .select('id, role')
    .eq('organisation_id', orgId)
    .eq('user_id', userId)
    .maybeSingle();
  if (memErr || !membership) return jsonResponse({ ok: false, reason: 'not_a_member_of_org' }, 403);

  const [{ data: campaigns, error: cErr }, { data: assignedPresets, error: pErr }] = await Promise.all([
    admin
      .from('campaigns')
      .select('id, name, slug, status, settings, preset_id, created_at, presets ( id, slug, display_name, current_image_tag, last_build_status )')
      .eq('organisation_id', orgId)
      .order('created_at', { ascending: false }),
    admin
      .from('org_presets')
      .select('preset_id, presets ( id, slug, display_name, description, current_image_tag, last_build_status, key_source )')
      .eq('organisation_id', orgId),
  ]);

  if (cErr) return jsonResponse({ ok: false, reason: 'list_failed', detail: cErr.message }, 500);
  if (pErr) return jsonResponse({ ok: false, reason: 'preset_list_failed', detail: pErr.message }, 500);

  const presets = (assignedPresets || [])
    .map((row) => row.presets)
    .filter(Boolean);

  // Stitch in token counts per campaign (cheap at v1.1 cardinality).
  const enriched = await Promise.all((campaigns || []).map(async (c) => {
    const { count } = await admin
      .from('cyborg_tokens')
      .select('token', { count: 'exact', head: true })
      .eq('campaign_id', c.id);
    return { ...c, token_count: count || 0 };
  }));

  return jsonResponse({ ok: true, campaigns: enriched, presets, member_role: membership.role });
}
