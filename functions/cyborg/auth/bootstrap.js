// POST /cyborg/auth/bootstrap — post-signup invite acceptance.
//
// Called from /cyborg/auth/callback/ after the magic-link round trip. Uses
// the user's freshly-issued access token to:
//   1. Identify the user (auth.users row)
//   2. If they have a pending invitation matching their email → accept it
//      (insert organisation_member, mark invitation accepted)
//   3. Else if they already belong to at least one org → no-op
//   4. Else → return ok with mode='no_action'. The dashboard surfaces the
//      "contact Vuelo Labs" message in that case. Org creation is platform-
//      admin gated (paywall) — bootstrap never creates an org.
//
// All operations use the user's JWT for the supabase client so RLS enforces
// they can only act on rows they have access to. Service role NOT used here
// — bootstrap must be safe even if the function were called by anyone.

import { createClient } from '@supabase/supabase-js';
import { requestMeta, writeAuditLog } from '../_lib.js';

// F-RLS-HARDCODED-PUBLISHABLE-KEY follow-up: see _middleware.js for the
// same pattern. When the auth verification fails with a publishable-key-
// shaped body, emit auth_key_mismatch{caller:'bootstrap'} so a stale key
// surfaces in the audit log instead of a silent "invalid_token" rejection.
const _KEY_BODY_HINTS = ['publishable', 'anon', 'api key', 'apikey'];

export async function onRequestPost({ request, env }) {
  const auth = request.headers.get('authorization') || '';
  const accessToken = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (!accessToken) return json({ ok: false, reason: 'missing_token' }, 401);

  let body;
  try { body = await request.json(); } catch { body = {}; }
  const name        = (body.name || '').toString().trim().slice(0, 200);
  const inviteToken = body.inviteToken ? body.inviteToken.toString().trim() : null;

  // Important: we use the user's JWT so RLS applies. The publishable key
  // is safe to embed (it's designed to be exposed client-side), but we read
  // it from env so rotating the key doesn't require finding-and-replacing
  // duplicates across files (see F-RLS-HARDCODED-PUBLISHABLE-KEY).
  if (!env.SUPABASE_URL || !env.SUPABASE_PUBLISHABLE_KEY || !env.SUPABASE_SERVICE_KEY) {
    return json({ ok: false, reason: 'not_configured' }, 503);
  }
  const userSupabase = createClient(env.SUPABASE_URL, env.SUPABASE_PUBLISHABLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
  });

  // Service-role client for writes + the auth_key_mismatch audit on the
  // invalid-token path below. Created here (not after getUser) so the error
  // path can use it — previously it was declared later, so the audit write
  // threw a ReferenceError that the catch swallowed and the event never landed.
  const admin = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);

  const { data: { user }, error: userErr } = await userSupabase.auth.getUser();
  if (userErr || !user) {
    console.error('bootstrap: invalid token', userErr?.message);
    // Probe /auth/v1/user directly so we can inspect the raw 401 body for
    // publishable-key-drift markers. The SDK wraps the fetch and only
    // surfaces a generic AuthApiError; this lets us distinguish "JWT is
    // genuinely bad" from "publishable key is stale".
    try {
      const probe = await fetch(`${env.SUPABASE_URL}/auth/v1/user`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'apikey':        env.SUPABASE_PUBLISHABLE_KEY,
        },
      });
      if (probe.status === 401) {
        const bodyText = await probe.text().catch(() => '');
        const lower = bodyText.toLowerCase();
        if (_KEY_BODY_HINTS.some((hint) => lower.includes(hint))) {
          await writeAuditLog(admin, {
            actorEmail: '(public)',
            action:     'auth_key_mismatch',
            target:     '/cyborg/auth/bootstrap',
            success:    false,
            detail:     { caller: 'bootstrap', body_preview: bodyText.slice(0, 200) },
            ...requestMeta(request),
          });
        }
      }
    } catch (_) { /* never block on audit */ }
    return json({ ok: false, reason: 'invalid_token' }, 401);
  }

  // (admin service-role client created above — used for the writes below.
  // RLS doesn't have all the policies we'd need; insert org_members on a
  // newly-created org has a chicken-and-egg problem with the "you can insert
  // if you're already a member" policy. Scoped to bootstrap-time only.)

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
    // Persist display name on auth.users metadata if supplied.
    if (name) {
      try {
        await admin.auth.admin.updateUserById(user.id, { user_metadata: { ...(user.user_metadata || {}), full_name: name } });
      } catch (_) { /* non-fatal */ }
    }
    return json({ ok: true, mode: 'already_member' });
  }

  // ── No-action branch ────────────────────────────────────────────────
  // No invitation, not yet a member. Org creation is platform-admin
  // gated — bootstrap never creates an org. The dashboard will show the
  // "contact Vuelo Labs" message on next render.
  if (name) {
    try {
      await admin.auth.admin.updateUserById(user.id, { user_metadata: { ...(user.user_metadata || {}), full_name: name } });
    } catch (_) { /* non-fatal */ }
  }
  return json({ ok: true, mode: 'no_action' });
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}
