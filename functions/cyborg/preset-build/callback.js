// POST /cyborg/admin/presets/build-callback — GHA workflow (or local
// build_preset.sh) posts here when a build finishes. Updates the preset
// row with image tag + status. Admin UI polling sees the new state.
//
// Body:
//   {
//     "preset_slug":      "haiku-byo",
//     "image_tag":        "v6-haiku-byo-d5dd245678",  // success only
//     "git_sha":          "d5dd245678",                // success only
//     "callback_run_id":  "cb_1735...",                // echoed from dispatch
//     "finished_at":      "2026-06-06T08:21:13Z",
//     "status":           "success" | "failed",
//     "run_url":          "https://github.com/.../actions/runs/123" // failure only
//   }
//
// Auth: bearer token (Authorization: Bearer <LINGUIST_CALLBACK_TOKEN>).
// CF Access is bypassed because GHA can't carry an Access JWT.

import { createClient } from '@supabase/supabase-js';
import { writeAuditLog, jsonResponse } from '../../_lib.js';

export async function onRequestPost({ request, env }) {
  // Bearer-token auth (no CF Access — this is server-to-server).
  const authHeader = request.headers.get('authorization') || '';
  const presented = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
  if (!env.LINGUIST_CALLBACK_TOKEN || presented !== env.LINGUIST_CALLBACK_TOKEN) {
    return jsonResponse({ error: 'Unauthorized' }, 401);
  }

  let body;
  try { body = await request.json(); } catch { return jsonResponse({ error: 'Invalid JSON' }, 400); }

  const slug = (body.preset_slug || '').toString().trim();
  if (!slug) return jsonResponse({ error: 'preset_slug is required' }, 400);
  const status = (body.status || '').toString().trim();
  if (status !== 'success' && status !== 'failed') {
    return jsonResponse({ error: 'status must be "success" or "failed"' }, 400);
  }

  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);

  const { data: preset, error: presetErr } = await supabase
    .from('presets')
    .select('id, slug, last_build_run_id')
    .eq('slug', slug)
    .maybeSingle();
  if (presetErr) return jsonResponse({ error: 'Lookup failed', detail: presetErr.message }, 500);
  if (!preset) return jsonResponse({ error: 'Unknown preset slug' }, 404);

  // If the dispatcher recorded a callback_run_id, verify the incoming one
  // matches — guards against an out-of-order callback overwriting a newer
  // dispatched build.
  const incomingRunId = (body.callback_run_id || '').toString();
  if (preset.last_build_run_id && incomingRunId && preset.last_build_run_id !== incomingRunId) {
    console.warn(`callback for ${slug} has stale run id (${incomingRunId} vs ${preset.last_build_run_id}); ignoring`);
    return jsonResponse({ ok: true, ignored: 'stale_run_id' }, 200);
  }

  const finishedAt = body.finished_at || new Date().toISOString();
  const update = {
    last_build_status: status,
    last_build_at:     finishedAt,
  };
  if (status === 'success') {
    if (!body.image_tag) return jsonResponse({ error: 'image_tag required on success' }, 400);
    update.current_image_tag = body.image_tag;
    update.current_git_sha   = body.git_sha || null;
  }

  const { error: updErr } = await supabase
    .from('presets')
    .update(update)
    .eq('id', preset.id);
  if (updErr) return jsonResponse({ error: 'Update failed', detail: updErr.message }, 500);

  await writeAuditLog(supabase, {
    actorEmail: 'github-actions:build_preset',
    action:     'build_preset_callback',
    target:     slug,
    success:    status === 'success',
    detail:     {
      status,
      image_tag: body.image_tag || null,
      run_url:   body.run_url || null,
      finished_at: finishedAt,
    },
  });

  return jsonResponse({ ok: true, preset_slug: slug, status });
}
