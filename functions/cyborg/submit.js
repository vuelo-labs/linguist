// POST /cyborg/submit — receive and store a candidate submission.
// Validates the token, atomically marks it used, and inserts the submission.
// A token can only successfully submit once.

import { createClient } from '@supabase/supabase-js';

const REQUIRED_FIELDS = ['candidateToken', 'submittedAt'];

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
  const nowIso = new Date().toISOString();
  const { data: claimed, error: claimErr } = await supabase
    .from('cyborg_tokens')
    .update({ used_at: nowIso })
    .eq('token', token)
    .is('used_at', null)
    .is('revoked_at', null)
    .not('approved_at', 'is', null)
    .gt('expires_at', nowIso)
    .select('token, candidate_label')
    .maybeSingle();

  if (claimErr) {
    console.error('token claim error:', claimErr.message);
    return json({ error: 'Failed to validate token.' }, 500);
  }
  if (!claimed) {
    return json({ error: 'Invalid, expired, or already-used token.' }, 403);
  }

  const feedback = typeof body.feedback === 'string' ? body.feedback.trim() : '';

  const { error } = await supabase.from('cyborg_submissions').insert({
    candidate_token: token,
    profile:         body.profile || null,
    submitted_at:    body.submittedAt,
    feedback:        feedback || null,
    metrics:         body.metrics || null,
    metrics_version: body.metricsVersion || null,
    session_log:     body.sessionLog || null,
    received_at:     nowIso,
  });

  if (error) {
    // Roll back the token claim so the candidate can retry.
    await supabase.from('cyborg_tokens').update({ used_at: null }).eq('token', token);
    console.error('submission insert error:', error.message);
    return json({ error: 'Failed to store submission.' }, 500);
  }

  return json({ ok: true, candidate_label: claimed.candidate_label || null });
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}
