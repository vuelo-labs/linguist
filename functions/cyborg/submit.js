// POST /cyborg/submit — receive and store a candidate submission.
// Validates the token, atomically marks it used, inserts the submission, and
// stops the candidate's Fly Machine so it stops billing.
// A token can only successfully submit once.

import { createClient } from '@supabase/supabase-js';

const REQUIRED_FIELDS = ['candidateToken', 'submittedAt'];
const FLY_API_BASE = 'https://api.machines.dev/v1';

export async function onRequestPost({ request, env }) {
  let body;
  try { body = await request.json(); } catch { return json({ error: 'Invalid JSON' }, 400); }

  for (const field of REQUIRED_FIELDS) {
    if (!body[field]) return json({ error: `Missing field: ${field}` }, 400);
  }

  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);
  const token = String(body.candidateToken).trim();

  // Atomic claim: only succeeds if the token exists, isn't revoked, isn't used,
  // and hasn't expired. This is the rate-limit + replay-protection mechanism.
  // Also pulls fly_machine_id + active-time accounting state.
  const nowIso = new Date().toISOString();
  const { data: claimed, error: claimErr } = await supabase
    .from('cyborg_tokens')
    .update({ used_at: nowIso })
    .eq('token', token)
    .is('used_at', null)
    .is('revoked_at', null)
    .not('approved_at', 'is', null)
    .gt('expires_at', nowIso)
    .select('token, candidate_label, fly_machine_id, active_time_used_seconds, last_resumed_at')
    .maybeSingle();

  if (claimErr) {
    console.error('token claim error:', claimErr.message);
    return json({ error: 'Failed to validate token.' }, 500);
  }
  if (!claimed) {
    return json({ error: 'Invalid, expired, or already-used token.' }, 403);
  }

  // Final active-time accumulation — closes the final running period so
  // the post-cohort report has accurate "total active time" per candidate.
  if (claimed.last_resumed_at) {
    const deltaSec = Math.max(0, Math.floor((Date.now() - new Date(claimed.last_resumed_at).getTime()) / 1000));
    const newUsed  = (claimed.active_time_used_seconds || 0) + deltaSec;
    await supabase
      .from('cyborg_tokens')
      .update({ active_time_used_seconds: newUsed, last_resumed_at: null })
      .eq('token', token);
  }

  const feedback = typeof body.feedback === 'string' ? body.feedback.trim() : '';
  const notes    = typeof body.notes    === 'string' ? body.notes           : '';

  // Insert into public.submissions — this is what the scoring worker reads
  // (via the `on_submission_insert_score` trigger that calls
  // notify_scoring_worker()). The full payload lives in `raw` so the worker
  // has everything; the typed columns mirror it for indexed querying.
  const { error } = await supabase.from('submissions').insert({
    candidate_token:     token,
    candidate_label:     claimed.candidate_label || null,
    profile:             body.profile || null,
    submitted_at:        body.submittedAt,
    received_at:         nowIso,
    trigger:             body.trigger || 'manual',
    feedback:            feedback || null,
    notes:               notes || null,
    metrics:             body.metrics || null,
    metrics_version:     body.metricsVersion || null,
    session_log:         body.sessionLog || null,
    candidate_mutations: body.candidateMutations || null,
    work_product:        body.workProduct || null,
    dev_mode:            !!body.devMode,
    raw:                 body,
  });

  if (error) {
    // Roll back the token claim so the candidate can retry.
    await supabase.from('cyborg_tokens').update({ used_at: null }).eq('token', token);
    console.error('submission insert error:', error.message);
    return json({ error: 'Failed to store submission.' }, 500);
  }

  // ── Stop the candidate's Fly Machine ──────────────────────────────────
  // Fire-and-forget — submission already succeeded. If the stop fails the
  // cleanup cron will pick it up later; either way, don't fail the user-
  // visible submit response over an idle machine.
  if (claimed.fly_machine_id && env.FLY_API_TOKEN && env.FLY_APP_NAME) {
    stopFlyMachine(env, claimed.fly_machine_id).catch(e => {
      console.error('fly stop failed (machine will idle until cleanup):', e?.message || e);
    });
  }

  return json({ ok: true, candidate_label: claimed.candidate_label || null });
}

async function stopFlyMachine(env, machineId) {
  const url = `${FLY_API_BASE}/apps/${encodeURIComponent(env.FLY_APP_NAME)}/machines/${encodeURIComponent(machineId)}/stop`;
  const r = await fetch(url, {
    method:  'POST',
    headers: { 'Authorization': `Bearer ${env.FLY_API_TOKEN}` },
  });
  if (!r.ok) {
    const errText = await r.text().catch(() => '');
    throw new Error(`fly stop ${r.status}: ${errText}`);
  }
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}
