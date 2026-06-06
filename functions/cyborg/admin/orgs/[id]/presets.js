// GET  /cyborg/admin/orgs/<id>/presets       — list presets assigned to the org
// PUT  /cyborg/admin/orgs/<id>/presets       — replace the org's assignments
//                                              body: { preset_ids: [uuid, ...] }
//
// Auth: Cloudflare Access (platform-admin gate — same as orgs/create).

import { createClient } from '@supabase/supabase-js';
import { verifyAccessJwt } from '../../../_access.js';
import { writeAuditLog, requestMeta, jsonResponse } from '../../../_lib.js';

export async function onRequestGet({ request, env, params }) {
  const access = await verifyAccessJwt(request, env);
  if (!access.ok) return jsonResponse({ error: 'Unauthorized', reason: access.reason }, 401);

  const orgId = (params && params.id) ? String(params.id) : null;
  if (!orgId) return jsonResponse({ error: 'org id is required' }, 400);

  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);

  const [{ data: assignments, error: aErr }, { data: presets, error: pErr }] = await Promise.all([
    supabase.from('org_presets')
      .select('preset_id, assigned_at, assigned_by')
      .eq('organisation_id', orgId),
    supabase.from('presets')
      .select('id, slug, display_name, description, key_source, current_image_tag, last_build_status')
      .order('display_name', { ascending: true }),
  ]);

  if (aErr) return jsonResponse({ error: 'assignment lookup failed', detail: aErr.message }, 500);
  if (pErr) return jsonResponse({ error: 'preset lookup failed', detail: pErr.message }, 500);

  const assignedIds = new Set((assignments || []).map(a => a.preset_id));
  const enriched = (presets || []).map(p => ({ ...p, assigned: assignedIds.has(p.id) }));

  return jsonResponse({ org_id: orgId, presets: enriched });
}

export async function onRequestPut({ request, env, params }) {
  const meta = requestMeta(request);
  const access = await verifyAccessJwt(request, env);
  if (!access.ok) return jsonResponse({ error: 'Unauthorized', reason: access.reason }, 401);

  const orgId = (params && params.id) ? String(params.id) : null;
  if (!orgId) return jsonResponse({ error: 'org id is required' }, 400);

  let body;
  try { body = await request.json(); } catch { return jsonResponse({ error: 'Invalid JSON' }, 400); }
  const desired = Array.isArray(body.preset_ids) ? body.preset_ids.filter(Boolean) : null;
  if (desired === null) return jsonResponse({ error: 'preset_ids (array) is required' }, 400);

  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);

  // Replace assignment set atomically: delete missing, insert new.
  const { data: existing, error: exErr } = await supabase
    .from('org_presets')
    .select('preset_id')
    .eq('organisation_id', orgId);
  if (exErr) return jsonResponse({ error: 'lookup failed', detail: exErr.message }, 500);

  const existingSet = new Set((existing || []).map(r => r.preset_id));
  const desiredSet  = new Set(desired);
  const toAdd       = desired.filter(id => !existingSet.has(id));
  const toRemove    = (existing || []).map(r => r.preset_id).filter(id => !desiredSet.has(id));

  if (toRemove.length > 0) {
    const { error: delErr } = await supabase
      .from('org_presets')
      .delete()
      .eq('organisation_id', orgId)
      .in('preset_id', toRemove);
    if (delErr) return jsonResponse({ error: 'delete failed', detail: delErr.message }, 500);
  }
  if (toAdd.length > 0) {
    const rows = toAdd.map(pid => ({ organisation_id: orgId, preset_id: pid, assigned_by: access.email }));
    const { error: insErr } = await supabase.from('org_presets').insert(rows);
    if (insErr) return jsonResponse({ error: 'insert failed', detail: insErr.message }, 500);
  }

  await writeAuditLog(supabase, {
    actorEmail: access.email,
    action:     'assign_org_presets',
    target:     orgId,
    success:    true,
    detail:     { added: toAdd, removed: toRemove, final_set: desired },
    ...meta,
  });

  return jsonResponse({ ok: true, org_id: orgId, assigned: desired });
}
