// GET /cyborg/auth/invite-lookup?token=<token>
//
// Returns the safe public fields of an invitation row given a token, so the
// /cyborg/signup/ page can show the invitee which org they're joining and
// what email the invite is bound to. Service-role lookup because the
// invitee has no Supabase auth context yet (they haven't signed up) and
// the table's RLS policies require org membership.
//
// Only returns rows where:
//   - token matches
//   - accepted_at IS NULL
//   - expires_at > now()
//
// Tokens are 16-byte random hex (cyb_<32hex>) — enumeration is infeasible.

import { createClient } from '@supabase/supabase-js';

export async function onRequestGet({ request, env }) {
  const url   = new URL(request.url);
  const token = (url.searchParams.get('token') || '').trim();

  if (!token) return json({ ok: false, reason: 'missing_token' }, 400);
  if (!/^cyb_[0-9a-f]{32}$/i.test(token)) return json({ ok: false, reason: 'bad_format' }, 400);

  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);

  const { data: invite, error } = await supabase
    .from('organisation_invitations')
    .select('email, role, organisation_id, expires_at, organisations(name)')
    .eq('token', token)
    .is('accepted_at', null)
    .gt('expires_at', new Date().toISOString())
    .maybeSingle();

  if (error) {
    console.error('invite-lookup failed:', error.message);
    return json({ ok: false, reason: 'lookup_failed' }, 500);
  }

  if (!invite) return json({ ok: false, reason: 'invitation_not_found_or_expired' }, 404);

  return json({
    ok:     true,
    email:  invite.email,
    role:   invite.role,
    org_name:  invite.organisations?.name || 'this organisation',
    expires_at: invite.expires_at,
  });
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}
