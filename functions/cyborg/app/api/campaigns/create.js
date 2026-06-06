// POST /cyborg/app/api/campaigns/create
//   Org member (any role for now) creates a new campaign in their org.
//   Optional preset_id selects the assessment image bundle.
//
// Body: { organisation_id: uuid, name: string, preset_id?: uuid }
//
// Auth: enforced by /cyborg/app/_middleware.js.

import { createClient } from '@supabase/supabase-js';
import { writeAuditLog, requestMeta, cleanInput, jsonResponse } from '../../../_lib.js';

const MAX_NAME = 200;

export async function onRequestPost({ request, env }) {
  const userId    = request.headers.get('x-cyborg-user-id') || '';
  const userEmail = request.headers.get('x-cyborg-user-email') || '';
  const meta      = requestMeta(request);
  if (!userId) return jsonResponse({ ok: false, reason: 'no_user' }, 401);

  let body;
  try { body = await request.json(); } catch { return jsonResponse({ ok: false, reason: 'bad_json' }, 400); }

  const orgId    = (body.organisation_id || '').toString().trim();
  const name     = cleanInput(body.name, MAX_NAME);
  const presetId = (body.preset_id || '').toString().trim() || null;

  if (!orgId)      return jsonResponse({ ok: false, reason: 'missing_organisation_id' }, 400);
  if (!name)       return jsonResponse({ ok: false, reason: 'missing_name' }, 400);

  const admin = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);

  const { data: membership, error: memErr } = await admin
    .from('organisation_members')
    .select('id, role')
    .eq('organisation_id', orgId)
    .eq('user_id', userId)
    .maybeSingle();
  if (memErr || !membership) {
    await writeAuditLog(admin, {
      actorEmail: userEmail, action: 'create_campaign',
      target: orgId, success: false,
      detail: { reason: 'not_a_member' }, ...meta,
    });
    return jsonResponse({ ok: false, reason: 'not_a_member_of_org' }, 403);
  }

  if (presetId) {
    const { data: assignment, error: assignErr } = await admin
      .from('org_presets')
      .select('preset_id')
      .eq('organisation_id', orgId)
      .eq('preset_id', presetId)
      .maybeSingle();
    if (assignErr) return jsonResponse({ ok: false, reason: 'preset_lookup_failed', detail: assignErr.message }, 500);
    if (!assignment) return jsonResponse({ ok: false, reason: 'preset_not_assigned_to_org' }, 403);
  }

  const slugInput = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);

  const { data: campaign, error: insErr } = await admin
    .from('campaigns')
    .insert({
      organisation_id: orgId,
      name,
      slug: slugInput,
      status: 'active',
      settings: {},
      preset_id: presetId,
      created_by: userId,
    })
    .select('id, organisation_id, name, slug, status, settings, preset_id, created_at')
    .single();

  if (insErr) {
    if (insErr.code === '23505') return jsonResponse({ ok: false, reason: 'duplicate_name' }, 409);
    return jsonResponse({ ok: false, reason: 'insert_failed', detail: insErr.message }, 500);
  }

  await writeAuditLog(admin, {
    actorEmail: userEmail, action: 'create_campaign',
    target: campaign.id, success: true,
    detail: { name, organisation_id: orgId, preset_id: presetId },
    ...meta,
  });

  return jsonResponse({ ok: true, campaign });
}
