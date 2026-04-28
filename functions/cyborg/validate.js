// POST /cyborg/validate — public, checks token validity.
// Used by install.sh (fail fast on bad token) and the container at submit time.

import { createClient } from '@supabase/supabase-js';

export async function onRequestPost({ request, env }) {
  let body;
  try { body = await request.json(); } catch { return json({ ok: false, reason: 'bad_request' }, 400); }
  const token = (body.token || '').toString().trim();
  if (!token) return json({ ok: false, reason: 'missing_token' }, 400);

  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);
  const { data, error } = await supabase
    .from('cyborg_tokens')
    .select('token, expires_at, used_at, revoked_at, approved_at, candidate_label')
    .eq('token', token)
    .maybeSingle();

  if (error)           return json({ ok: false, reason: 'lookup_failed' }, 500);
  if (!data)           return json({ ok: false, reason: 'unknown' }, 404);
  if (data.revoked_at) return json({ ok: false, reason: 'revoked' }, 403);
  if (!data.approved_at) return json({ ok: false, reason: 'pending_approval' }, 403);
  if (data.used_at)    return json({ ok: false, reason: 'already_used' }, 403);
  if (new Date(data.expires_at) < new Date()) return json({ ok: false, reason: 'expired' }, 403);

  return json({
    ok:               true,
    candidate_label:  data.candidate_label,
    expires_at:       data.expires_at,
  });
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}
