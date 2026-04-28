// GET /cyborg/list — admin-only token listing.
// Auth: header `Authorization: Bearer <ADMIN_SECRET>`.

import { createClient } from '@supabase/supabase-js';

export async function onRequestGet({ request, env }) {
  const auth = request.headers.get('Authorization') || '';
  if (!env.ADMIN_SECRET || auth !== `Bearer ${env.ADMIN_SECRET}`) {
    return json({ error: 'Unauthorized' }, 401);
  }

  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);

  const { data: tokens, error } = await supabase
    .from('cyborg_tokens')
    .select('token, candidate_label, issued_at, expires_at, used_at, revoked_at, approved_at, notes')
    .order('issued_at', { ascending: false })
    .limit(500);

  if (error) {
    console.error('list tokens error:', error.message);
    return json({ error: 'Failed to list tokens.' }, 500);
  }

  return json({ ok: true, tokens });
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}
