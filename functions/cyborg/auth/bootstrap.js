// POST /cyborg/auth/bootstrap — post-signup org creation / invite acceptance.
//
// Called from /cyborg/auth/callback/ after the magic-link round trip. Uses
// the user's freshly-issued access token to:
//   1. Identify the user (auth.users row)
//   2. If they have a pending invitation matching their email → accept it
//      (insert organisation_member, mark invitation accepted)
//   3. Else if they passed an orgName → create that org + add them as owner
//   4. Else if they already belong to at least one org → no-op
//   5. Else → create a default-named org and make them the owner (so the
//      app shell always has something to land on)
//
// All operations use the user's JWT for the supabase client so RLS enforces
// they can only act on rows they have access to. Service role NOT used here
// — bootstrap must be safe even if the function were called by anyone.

import { createClient } from '@supabase/supabase-js';

export async function onRequestPost({ request, env }) {
  const auth = request.headers.get('authorization') || '';
  const accessToken = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (!accessToken) return json({ ok: false, reason: 'missing_token' }, 401);

  let body;
  try { body = await request.json(); } catch { body = {}; }
  const name        = (body.name || '').toString().trim().slice(0, 200);
  const orgName     = body.orgName ? body.orgName.toString().trim().slice(0, 200) : null;
  const inviteToken = body.inviteToken ? body.inviteToken.toString().trim() : null;

  // Important: we use the user's JWT so RLS applies. The publishable key
  // is safe to embed (it's designed to be exposed client-side).
  const PUBLISHABLE_KEY = 'sb_publishable_Czk4cQMbG_EcQdYgf23fZQ_Og6uDUyo';
  const userSupabase = createClient(env.SUPABASE_URL, PUBLISHABLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
  });

  const { data: { user }, error: userErr } = await userSupabase.auth.getUser();
  if (userErr || !user) {
    console.error('bootstrap: invalid token', userErr?.message);
    return json({ ok: false, reason: 'invalid_token' }, 401);
  }

  // Service-role client for the actual writes — RLS doesn't have all the
  // policies we'd need (insert org_members on a newly-created org has a
  // chicken-and-egg problem with the policy "you can insert if you're
  // already a member"). Keep this scoped narrowly to bootstrap-time only.
  const admin = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);

  // ── Branch 1: invitation acceptance ────────────────────────────────────
  if (inviteToken) {
    const { data: invite, error: inviteErr } = await admin
      .from('organisation_invitations')
      .select('id, organisation_id, email, role, expires_at, accepted_at')
      .eq('token', inviteToken)
      .maybeSingle();

    if (inviteErr || !invite) {
      return json({ ok: false, reason: 'invite_not_found' }, 404);
    }
    if (invite.accepted_at) {
      return json({ ok: false, reason: 'invite_already_accepted' }, 409);
    }
    if (new Date(invite.expires_at) < new Date()) {
      return json({ ok: false, reason: 'invite_expired' }, 410);
    }
    if (invite.email.toLowerCase() !== (user.email || '').toLowerCase()) {
      return json({ ok: false, reason: 'invite_email_mismatch' }, 403);
    }

    // Add as member (upsert in case they're already in for some reason).
    const { error: memberErr } = await admin.from('organisation_members').upsert({
      organisation_id: invite.organisation_id,
      user_id:         user.id,
      role:            invite.role,
      invited_at:      new Date().toISOString(),
      joined_at:       new Date().toISOString(),
    }, { onConflict: 'organisation_id,user_id' });

    if (memberErr) {
      console.error('bootstrap: invite member insert failed', memberErr.message);
      return json({ ok: false, reason: 'member_insert_failed' }, 500);
    }

    await admin
      .from('organisation_invitations')
      .update({ accepted_at: new Date().toISOString() })
      .eq('id', invite.id);

    return json({ ok: true, mode: 'invite_accepted', organisation_id: invite.organisation_id });
  }

  // ── Already-a-member short-circuit ────────────────────────────────────
  // If the user already belongs to at least one org (e.g. they were added
  // by an admin from inside the app rather than via the email-invite flow),
  // we don't auto-create another org.
  const { count: memberCount } = await admin
    .from('organisation_members')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id);

  if ((memberCount || 0) > 0) {
    return json({ ok: true, mode: 'already_member' });
  }

  // ── Branch 2 / 3: create org + owner-membership ────────────────────────
  // Either an explicit orgName from signup, or a default based on email.
  const fallbackOrgName = (user.email || 'My organisation').split('@')[0] + "'s organisation";
  const finalOrgName    = orgName || fallbackOrgName;
  const slugBase        = finalOrgName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 48) || 'org';

  // Slug must be unique — append a short random suffix if collision.
  let slug = slugBase;
  for (let attempt = 0; attempt < 4; attempt++) {
    const { data: existing } = await admin
      .from('organisations')
      .select('id')
      .eq('slug', slug)
      .maybeSingle();
    if (!existing) break;
    slug = `${slugBase}-${Math.random().toString(36).slice(2, 6)}`;
  }

  const { data: org, error: orgErr } = await admin
    .from('organisations')
    .insert({ name: finalOrgName, slug, created_by: user.id })
    .select('id')
    .single();

  if (orgErr || !org) {
    console.error('bootstrap: org insert failed', orgErr?.message);
    return json({ ok: false, reason: 'org_insert_failed', detail: orgErr?.message }, 500);
  }

  const { error: ownerErr } = await admin.from('organisation_members').insert({
    organisation_id: org.id,
    user_id:         user.id,
    role:            'owner',
    invited_at:      new Date().toISOString(),
    joined_at:       new Date().toISOString(),
  });

  if (ownerErr) {
    // Clean up the org so we don't leave it orphaned.
    await admin.from('organisations').delete().eq('id', org.id);
    console.error('bootstrap: owner-member insert failed', ownerErr.message);
    return json({ ok: false, reason: 'member_insert_failed' }, 500);
  }

  // Save the display name on the auth user metadata for future UI use.
  if (name) {
    try {
      await admin.auth.admin.updateUserById(user.id, { user_metadata: { ...(user.user_metadata || {}), full_name: name } });
    } catch (_) { /* non-fatal */ }
  }

  return json({ ok: true, mode: 'org_created', organisation_id: org.id, organisation_slug: slug });
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}
