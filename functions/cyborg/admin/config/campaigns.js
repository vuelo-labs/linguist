// GET /cyborg/admin/config/campaigns          — list campaigns with their settings
// POST /cyborg/admin/config/campaigns         — create a new campaign
//
// Auth: Cloudflare Access (same as other /cyborg/admin/* routes).
// Org-scoping for v1: every authenticated admin sees all campaigns. Per-org
// filter ships in v1.1 when customer-admin onboarding lands.

import { createClient } from '@supabase/supabase-js';
import { verifyAccessJwt } from '../../_access.js';
import { writeAuditLog, requestMeta, jsonResponse } from '../../_lib.js';
import { KNOBS_METADATA, validatePolicy } from './_knobs.js';

export async function onRequestGet({ request, env }) {
  const meta = requestMeta(request);
  const access = await verifyAccessJwt(request, env);
  if (!access.ok) {
    return jsonResponse({ error: 'Unauthorized', reason: access.reason }, 401);
  }

  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);

  const { data: campaigns, error } = await supabase
    .from('campaigns')
    .select('id, organisation_id, name, slug, status, settings, preset_id, created_at, presets ( id, slug, display_name, current_image_tag, last_build_status )')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('list campaigns error:', error.message);
    return jsonResponse({ error: 'Failed to list campaigns.' }, 500);
  }

  // Stitch in token counts per campaign (cheap at v1 cardinality).
  const enriched = await Promise.all((campaigns || []).map(async (c) => {
    const { count } = await supabase
      .from('cyborg_tokens')
      .select('token', { count: 'exact', head: true })
      .eq('campaign_id', c.id);
    return { ...c, token_count: count || 0 };
  }));

  return jsonResponse({ campaigns: enriched, knobs: KNOBS_METADATA });
}

export async function onRequestPost({ request, env }) {
  const meta = requestMeta(request);
  const access = await verifyAccessJwt(request, env);
  if (!access.ok) {
    return jsonResponse({ error: 'Unauthorized', reason: access.reason }, 401);
  }

  let body;
  try { body = await request.json(); } catch { return jsonResponse({ error: 'Invalid JSON' }, 400); }

  const name = (body.name || '').toString().trim();
  const organisationId = (body.organisation_id || '').toString().trim();
  const settings = body.settings || {};
  const presetId = (body.preset_id || '').toString().trim() || null;

  if (!name) return jsonResponse({ error: 'name is required' }, 400);
  if (name.length > 200) return jsonResponse({ error: 'name too long (max 200)' }, 400);
  if (!organisationId) return jsonResponse({ error: 'organisation_id is required' }, 400);

  const policyCheck = validatePolicy(settings);
  if (!policyCheck.ok) {
    return jsonResponse({ error: 'Invalid settings', details: policyCheck.errors }, 400);
  }

  const slugInput = (body.slug || '').toString().trim()
                    || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);

  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);

  // If a preset is provided, verify it's assigned to this org.
  if (presetId) {
    const { data: assignment, error: assignErr } = await supabase
      .from('org_presets')
      .select('preset_id')
      .eq('organisation_id', organisationId)
      .eq('preset_id', presetId)
      .maybeSingle();
    if (assignErr) return jsonResponse({ error: 'preset assignment lookup failed' }, 500);
    if (!assignment) return jsonResponse({ error: 'preset is not assigned to this organisation' }, 403);
  }

  const { data: campaign, error } = await supabase
    .from('campaigns')
    .insert({
      organisation_id: organisationId,
      name,
      slug: slugInput,
      status: 'active',
      settings,
      preset_id: presetId,
    })
    .select('id, organisation_id, name, slug, status, settings, preset_id, created_at')
    .single();

  if (error) {
    console.error('create campaign error:', error.message);
    if (error.code === '23505') {
      return jsonResponse({ error: 'A campaign with this name already exists for that org.' }, 409);
    }
    if (error.code === '23503') {
      return jsonResponse({ error: 'organisation_id not found' }, 400);
    }
    return jsonResponse({ error: 'Failed to create campaign.', detail: error.message }, 500);
  }

  await writeAuditLog(supabase, {
    actorEmail: access.email,
    action:     'create_campaign',
    target:     campaign.id,
    success:    true,
    detail:     { name: campaign.name, organisation_id: organisationId, settings },
    ...meta,
  });

  return jsonResponse({ campaign }, 201);
}
