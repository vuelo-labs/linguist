// POST /cyborg/revoke — admin-only token revocation.
// Auth: Cloudflare Access JWT (cf-access-jwt-assertion header).
// Body: { token: 'cyb_...' }

import { createClient } from '@supabase/supabase-js';
import { verifyAccessJwt } from './_access.js';

export async function onRequestPost({ request, env }) {
  const access = await verifyAccessJwt(request, env);
  if (!access.ok) return json({ error: 'Unauthorized', reason: access.reason }, 401);

  let body;
  try { body = await request.json(); } catch { return json({ error: 'Invalid JSON' }, 400); }
  const token = (body.token || '').toString().trim();
  if (!token) return json({ error: 'Missing token' }, 400);

  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);
  const { data, error } = await supabase
    .from('cyborg_tokens')
    .update({ revoked_at: new Date().toISOString() })
    .eq('token', token)
    .is('revoked_at', null)
    .select('token')
    .maybeSingle();

  if (error) {
    console.error('revoke error:', error.message);
    return json({ error: 'Failed to revoke.' }, 500);
  }
  if (!data) return json({ ok: false, reason: 'not_found_or_already_revoked' }, 404);

  return json({ ok: true, token });
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}
