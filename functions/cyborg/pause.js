// POST /cyborg/pause — stop the candidate's Fly Machine without consuming
// the token. The candidate can resume by re-clicking their launch link;
// launch.js will start the existing stopped machine instead of spawning a
// fresh one (preserves notes.md, work/, and candidate-state.json).
//
// Different from submit.js: token.used_at stays NULL, the workspace is NOT
// locked, and the assessment can be resumed.
//
// Note on the 7-day deadline: pause stops billing but does NOT extend the
// expires_at on the token. The candidate's 7-day window is calendar time
// from issue, not active-use time. (Track that in v2 if cohort feedback
// shows it's needed.)

import { createClient } from '@supabase/supabase-js';

const FLY_API_BASE = 'https://api.machines.dev/v1';

export async function onRequestPost({ request, env }) {
  // Env preflight
  const missing = ['FLY_API_TOKEN', 'FLY_APP_NAME', 'SUPABASE_URL', 'SUPABASE_SERVICE_KEY']
    .filter(k => !env[k]);
  if (missing.length) {
    console.error('pause not_configured: missing env', missing);
    return json({ ok: false, reason: 'not_configured', missing }, 503);
  }

  let body;
  try { body = await request.json(); } catch { return json({ ok: false, reason: 'bad_request' }, 400); }
  const token = (body.token || '').toString().trim();
  if (!token) return json({ ok: false, reason: 'missing_token' }, 400);

  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);
  const { data: tokenRow, error: lookupErr } = await supabase
    .from('cyborg_tokens')
    .select('token, fly_machine_id, used_at, revoked_at, expires_at, machine_url, active_time_used_seconds, last_resumed_at')
    .eq('token', token)
    .maybeSingle();

  if (lookupErr)              return json({ ok: false, reason: 'lookup_failed' }, 500);
  if (!tokenRow)              return json({ ok: false, reason: 'unknown' }, 404);
  if (tokenRow.revoked_at)    return json({ ok: false, reason: 'revoked' }, 403);
  if (tokenRow.used_at)       return json({ ok: false, reason: 'already_submitted' }, 403);
  if (!tokenRow.fly_machine_id) return json({ ok: false, reason: 'no_machine' }, 404);

  // Accumulate the active-time delta BEFORE the stop call — we need
  // last_resumed_at to still be valid when we compute the delta. Persist
  // accumulated + clear last_resumed_at so the clock stops.
  if (tokenRow.last_resumed_at) {
    const deltaSec = Math.max(0, Math.floor((Date.now() - new Date(tokenRow.last_resumed_at).getTime()) / 1000));
    const newUsed  = (tokenRow.active_time_used_seconds || 0) + deltaSec;
    await supabase
      .from('cyborg_tokens')
      .update({ active_time_used_seconds: newUsed, last_resumed_at: null })
      .eq('token', token);
  }

  // Stop the machine — Fly returns 200 immediately, the actual SIGINT lands
  // a few seconds later. The candidate's response should make it back to the
  // browser before the container is killed.
  const r = await fetch(
    `${FLY_API_BASE}/apps/${encodeURIComponent(env.FLY_APP_NAME)}/machines/${encodeURIComponent(tokenRow.fly_machine_id)}/stop`,
    { method: 'POST', headers: { 'Authorization': `Bearer ${env.FLY_API_TOKEN}` } }
  );
  if (!r.ok) {
    const errText = await r.text().catch(() => '');
    console.error('fly stop failed', r.status, errText);
    return json({ ok: false, reason: 'stop_failed', status: r.status }, 502);
  }

  return json({
    ok: true,
    expires_at: tokenRow.expires_at,
    resume_url: tokenRow.machine_url || null,
  });
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}
