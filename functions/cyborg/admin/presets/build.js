// POST /cyborg/admin/presets/build — dispatch a GitHub Actions
// `workflow_dispatch` to build the preset image. Returns the GHA run id
// so the admin UI can poll status.
//
// Body: { preset_slug: "haiku-byo" }
//
// Required CF Pages env:
//   GH_REPO          'liam-vuelo/cyborg' (the cyborg repo)
//   GH_PAT           Personal access token with `repo` + `workflow` scopes
//   GH_WORKFLOW_FILE 'build_preset.yml' (default if unset)
//
// Auth: Cloudflare Access.

import { createClient } from '@supabase/supabase-js';
import { verifyAccessJwt } from '../../_access.js';
import { writeAuditLog, requestMeta, jsonResponse } from '../../_lib.js';

const DEFAULT_WORKFLOW_FILE = 'build_preset.yml';
const DEFAULT_REF = 'uat-pass2/qa-harness';

export async function onRequestPost({ request, env }) {
  const meta = requestMeta(request);
  const access = await verifyAccessJwt(request, env);
  if (!access.ok) {
    return jsonResponse({ error: 'Unauthorized', reason: access.reason }, 401);
  }

  if (!env.GH_REPO || !env.GH_PAT) {
    return jsonResponse({ error: 'not_configured', reason: 'GH_REPO and GH_PAT env vars required.' }, 503);
  }

  let body;
  try { body = await request.json(); } catch { return jsonResponse({ error: 'Invalid JSON' }, 400); }
  const presetSlug = (body.preset_slug || '').toString().trim();
  if (!presetSlug) return jsonResponse({ error: 'preset_slug is required' }, 400);

  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);

  const { data: preset, error: presetErr } = await supabase
    .from('presets')
    .select('id, slug')
    .eq('slug', presetSlug)
    .maybeSingle();
  if (presetErr) return jsonResponse({ error: 'Lookup failed', detail: presetErr.message }, 500);
  if (!preset) return jsonResponse({ error: 'Unknown preset slug' }, 404);

  const callbackRunId = `cb_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  const workflowFile = env.GH_WORKFLOW_FILE || DEFAULT_WORKFLOW_FILE;
  const ref = env.GH_REF || DEFAULT_REF;

  const dispatchUrl = `https://api.github.com/repos/${env.GH_REPO}/actions/workflows/${workflowFile}/dispatches`;
  const dispatchResp = await fetch(dispatchUrl, {
    method: 'POST',
    headers: {
      'Authorization':         `Bearer ${env.GH_PAT}`,
      'Accept':                'application/vnd.github+json',
      'X-GitHub-Api-Version':  '2022-11-28',
      'Content-Type':          'application/json',
    },
    body: JSON.stringify({
      ref,
      inputs: { preset_slug: presetSlug, callback_run_id: callbackRunId },
    }),
  });

  if (!dispatchResp.ok) {
    const errBody = await dispatchResp.text().catch(() => '');
    console.error('GHA dispatch failed:', dispatchResp.status, errBody.slice(0, 500));
    await writeAuditLog(supabase, {
      actorEmail: access.email,
      action:     'build_preset_dispatch',
      target:     presetSlug,
      success:    false,
      detail:     { status: dispatchResp.status, body_preview: errBody.slice(0, 200) },
      ...meta,
    });
    return jsonResponse({ error: 'GHA dispatch failed', status: dispatchResp.status, detail: errBody.slice(0, 200) }, 502);
  }

  // GitHub returns 204 from workflow_dispatch with no body and no run id.
  // We mark the preset as `running` with our callback_run_id; the GHA
  // workflow will POST back to /cyborg/admin/presets/build-callback when
  // it finishes, carrying the same callback_run_id so we can match.
  const startedAt = new Date().toISOString();
  const { error: updErr } = await supabase
    .from('presets')
    .update({
      last_build_status: 'running',
      last_build_run_id: callbackRunId,
      last_build_at:     startedAt,
    })
    .eq('id', preset.id);
  if (updErr) console.error('preset status update failed:', updErr.message);

  await writeAuditLog(supabase, {
    actorEmail: access.email,
    action:     'build_preset_dispatch',
    target:     presetSlug,
    success:    true,
    detail:     { callback_run_id: callbackRunId, ref, workflow: workflowFile },
    ...meta,
  });

  return jsonResponse({
    ok: true,
    preset_slug: presetSlug,
    callback_run_id: callbackRunId,
    started_at: startedAt,
    workflow_runs_url: `https://github.com/${env.GH_REPO}/actions/workflows/${workflowFile}`,
  }, 202);
}
