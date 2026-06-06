// GET   /cyborg/admin/config/campaign/<id> — fetch one campaign + its settings
// PATCH /cyborg/admin/config/campaign/<id> — update settings (partial merge)
//
// PATCH body: { settings: { pin_model?, token_budget?, ... } }
//   The provided keys overlay the existing settings JSONB. Unknown keys fail.
//
// Auth: Cloudflare Access.

import { createClient } from '@supabase/supabase-js';
import { verifyAccessJwt } from '../../../_access.js';
import { writeAuditLog, requestMeta, jsonResponse } from '../../../_lib.js';
import { KNOBS_METADATA, validatePolicy } from '../_knobs.js';

export async function onRequestGet({ request, env, params }) {
  const access = await verifyAccessJwt(request, env);
  if (!access.ok) return jsonResponse({ error: 'Unauthorized', reason: access.reason }, 401);

  const id = (params && params.id) ? String(params.id) : null;
  if (!id) return jsonResponse({ error: 'campaign id is required' }, 400);

  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);

  const { data: campaign, error } = await supabase
    .from('campaigns')
    .select('id, organisation_id, name, slug, status, settings, created_at, archived_at')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('get campaign error:', error.message);
    return jsonResponse({ error: 'Failed to fetch campaign.' }, 500);
  }
  if (!campaign) return jsonResponse({ error: 'Campaign not found' }, 404);

  return jsonResponse({ campaign, knobs: KNOBS_METADATA });
}

export async function onRequestPatch({ request, env, params }) {
  const meta = requestMeta(request);
  const access = await verifyAccessJwt(request, env);
  if (!access.ok) return jsonResponse({ error: 'Unauthorized', reason: access.reason }, 401);

  const id = (params && params.id) ? String(params.id) : null;
  if (!id) return jsonResponse({ error: 'campaign id is required' }, 400);

  let body;
  try { body = await request.json(); } catch { return jsonResponse({ error: 'Invalid JSON' }, 400); }

  const incomingSettings = body.settings || {};
  const incomingPresetId = body.preset_id !== undefined ? (body.preset_id || null) : undefined;
  const hasSettings = body.settings !== undefined;

  if (hasSettings) {
    if (typeof incomingSettings !== 'object' || Array.isArray(incomingSettings)) {
      return jsonResponse({ error: 'body.settings must be an object' }, 400);
    }
    const policyCheck = validatePolicy(incomingSettings);
    if (!policyCheck.ok) {
      return jsonResponse({ error: 'Invalid settings', details: policyCheck.errors }, 400);
    }
  }
  if (!hasSettings && incomingPresetId === undefined) {
    return jsonResponse({ error: 'body must include settings and/or preset_id' }, 400);
  }

  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);

  const { data: current, error: getErr } = await supabase
    .from('campaigns')
    .select('id, organisation_id, settings, preset_id')
    .eq('id', id)
    .maybeSingle();
  if (getErr) {
    console.error('get-before-patch error:', getErr.message);
    return jsonResponse({ error: 'Failed to fetch campaign for update.' }, 500);
  }
  if (!current) return jsonResponse({ error: 'Campaign not found' }, 404);

  const updatePayload = {};
  if (hasSettings) {
    updatePayload.settings = { ...(current.settings || {}), ...incomingSettings };
  }
  if (incomingPresetId !== undefined) {
    if (incomingPresetId) {
      const { data: assignment, error: assignErr } = await supabase
        .from('org_presets')
        .select('preset_id')
        .eq('organisation_id', current.organisation_id)
        .eq('preset_id', incomingPresetId)
        .maybeSingle();
      if (assignErr) return jsonResponse({ error: 'preset assignment lookup failed' }, 500);
      if (!assignment) return jsonResponse({ error: 'preset is not assigned to this organisation' }, 403);
    }
    updatePayload.preset_id = incomingPresetId;
  }

  const { data: updated, error: updErr } = await supabase
    .from('campaigns')
    .update(updatePayload)
    .eq('id', id)
    .select('id, organisation_id, name, slug, status, settings, preset_id, created_at')
    .single();

  if (updErr) {
    console.error('update campaign error:', updErr.message);
    return jsonResponse({ error: 'Failed to update campaign.', detail: updErr.message }, 500);
  }

  await writeAuditLog(supabase, {
    actorEmail: access.email,
    action:     'update_campaign_settings',
    target:     id,
    success:    true,
    detail:     {
      changed_keys: hasSettings ? Object.keys(incomingSettings) : [],
      preset_change: incomingPresetId !== undefined ? { from: current.preset_id, to: incomingPresetId } : null,
      before: { settings: current.settings, preset_id: current.preset_id },
      after:  { settings: updatePayload.settings || current.settings, preset_id: 'preset_id' in updatePayload ? updatePayload.preset_id : current.preset_id },
    },
    ...meta,
  });

  return jsonResponse({ campaign: updated });
}
