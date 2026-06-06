// POST /cyborg/app/api/team/members — fetch the email + display name for
// each member of an organisation. The /team page needs these (auth.users
// is not directly readable from the anon context, so this endpoint does
// the lookup with the service role after verifying the caller belongs to
// the requested org).
//
// Body: { organisation_id: uuid }

import { createClient } from '@supabase/supabase-js';

export async function onRequestPost({ request, env }) {
  const userId = request.headers.get('x-cyborg-user-id') || '';
  if (!userId) return json({ ok: false, reason: 'no_user' }, 401);

  let body;
  try { body = await request.json(); } catch { return json({ ok: false, reason: 'bad_json' }, 400); }
  const orgId = (body.organisation_id || '').toString().trim();
  if (!orgId) return json({ ok: false, reason: 'missing_organisation_id' }, 400);

  const admin = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);

  // Verify the caller belongs to the org before exposing teammate emails.
  const { data: callerMembership } = await admin
    .from('organisation_members')
    .select('id')
    .eq('organisation_id', orgId)
    .eq('user_id', userId)
    .maybeSingle();

  if (!callerMembership) return json({ ok: false, reason: 'not_a_member_of_org' }, 403);

  // Pull org members (full membership rows, not just user_ids).
  const { data: members } = await admin
    .from('organisation_members')
    .select('id, user_id, role, joined_at')
    .eq('organisation_id', orgId)
    .order('joined_at', { ascending: true });

  if (!members?.length) return json({ ok: true, profiles: [] });

  // Hydrate each with email + full_name from auth.users via admin API.
  const profiles = [];
  for (const m of members) {
    try {
      const { data, error } = await admin.auth.admin.getUserById(m.user_id);
      if (error || !data?.user) continue;
      profiles.push({
        id:         m.id,
        user_id:    m.user_id,
        role:       m.role,
        joined_at:  m.joined_at,
        email:      data.user.email,
        full_name:  data.user.user_metadata?.full_name || null,
      });
    } catch (e) {
      console.error('member lookup failed', m.user_id, e?.message || e);
    }
  }

  return json({ ok: true, profiles });
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}
