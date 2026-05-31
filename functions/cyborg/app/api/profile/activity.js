// POST /cyborg/app/api/profile/activity — pull the caller's recent
// admin-audit actions. cyborg_admin_audit has no RLS policy granting
// authenticated users read access (only service-role writes), so this
// endpoint does the lookup with the service role after verifying the
// caller and scoping to their email.

import { createClient } from '@supabase/supabase-js';

export async function onRequestPost({ request, env }) {
  const userId    = request.headers.get('x-cyborg-user-id') || '';
  const userEmail = (request.headers.get('x-cyborg-user-email') || '').toLowerCase();
  if (!userId || !userEmail) return json({ ok: false, reason: 'no_user' }, 401);

  const admin = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);

  const { data: activity, error } = await admin
    .from('cyborg_admin_audit')
    .select('id, action, target, success, created_at, ip, country')
    .ilike('actor_email', userEmail)
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) {
    console.error('activity fetch failed', error.message);
    return json({ ok: false, reason: 'fetch_failed' }, 500);
  }

  return json({ ok: true, activity: activity || [] });
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}
