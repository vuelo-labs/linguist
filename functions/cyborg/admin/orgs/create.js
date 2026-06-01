// POST /cyborg/admin/orgs/create — platform-admin creates a new organisation.
//
// Body: { name, slug?, ownerEmail, limits? }
//   • name           required, free-text display name
//   • slug           optional override; defaults to slugified name + uniquify
//   • ownerEmail     required, the human who'll be the owner of this org
//   • limits         optional. null = uncapped (Vuelo Labs only — reject
//                    NULL for normal orgs to enforce paid-tier defaults).
//                    Default: { members: 5, campaigns: 100, candidates: 100 }
//
// Behaviour:
//   1. Insert into organisations.
//   2. Look up ownerEmail in auth.users.
//      - If found → insert organisation_members row (role=owner) directly.
//      - If not found → insert organisation_invitations row (the owner
//        signs up with that email and lands in the org via /cyborg/auth/
//        bootstrap → invitation acceptance branch).
//   3. Audit-log the action.

import { createClient } from '@supabase/supabase-js';
import { verifyAccessJwt } from '../../_access.js';
import { writeAuditLog, requestMeta, jsonResponse } from '../../_lib.js';

const DEFAULT_LIMITS = { members: 5, campaigns: 100, candidates: 100 };

export async function onRequestPost({ request, env }) {
  const meta = requestMeta(request);
  const access = await verifyAccessJwt(request, env);
  if (!access.ok) {
    return jsonResponse({ error: 'Unauthorized', reason: access.reason }, 401);
  }

  let body;
  try { body = await request.json(); } catch { return jsonResponse({ error: 'Invalid JSON' }, 400); }

  const name       = (body.name || '').toString().trim();
  const slugInput  = (body.slug || '').toString().trim();
  const ownerEmail = (body.ownerEmail || '').toString().trim().toLowerCase();
  const limits     = body.limits === null ? null
                    : (body.limits && typeof body.limits === 'object')
                      ? { ...DEFAULT_LIMITS, ...body.limits }
                      : DEFAULT_LIMITS;

  if (!name)       return jsonResponse({ error: 'name is required' }, 400);
  if (!ownerEmail) return jsonResponse({ error: 'ownerEmail is required' }, 400);
  if (name.length > 200) return jsonResponse({ error: 'name too long (max 200)' }, 400);

  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);

  // ── Derive a unique slug ─────────────────────────────────────────────
  const slugBase = (slugInput || name).toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48) || 'org';

  let slug = slugBase;
  for (let attempt = 0; attempt < 5; attempt++) {
    const { data: existing } = await supabase
      .from('organisations').select('id').eq('slug', slug).maybeSingle();
    if (!existing) break;
    slug = `${slugBase}-${Math.random().toString(36).slice(2, 6)}`;
  }

  // ── Insert org ────────────────────────────────────────────────────────
  const { data: org, error: orgErr } = await supabase
    .from('organisations')
    .insert({ name, slug, limits, created_by: null })
    .select('id, name, slug, limits')
    .single();

  if (orgErr) {
    console.error('create org failed:', orgErr.message);
    await writeAuditLog(supabase, {
      actorEmail: access.email, action: 'create_org',
      success: false, detail: { reason: orgErr.message, name, slug }, ...meta,
    });
    return jsonResponse({ error: 'Failed to create org', detail: orgErr.message }, 500);
  }

  // ── Owner assignment ─────────────────────────────────────────────────
  // Look up the owner in auth.users. If they already have an account,
  // attach them. Otherwise create the auth row directly (email-confirmed,
  // no password) so they can sign in via magic link or Google OAuth
  // immediately — no separate invitation/signup step required.
  let ownerStatus  = 'unknown';
  let ownerUserId  = null;

  const { data: list } = await supabase.auth.admin.listUsers({ page: 1, perPage: 200 });
  const match = (list?.users || []).find(u => (u.email || '').toLowerCase() === ownerEmail);

  if (match) {
    ownerUserId = match.id;
    ownerStatus = 'added_existing_user';
  } else {
    const { data: newUser, error: createUserErr } = await supabase.auth.admin.createUser({
      email:         ownerEmail,
      email_confirm: true,   // skip Supabase's verification step — they auth via magic link / Google
    });
    if (createUserErr || !newUser?.user) {
      await supabase.from('organisations').delete().eq('id', org.id);
      console.error('owner user create failed:', createUserErr?.message);
      await writeAuditLog(supabase, {
        actorEmail: access.email, action: 'create_org',
        success: false, detail: { reason: 'user_create_failed', name, slug, error: createUserErr?.message }, ...meta,
      });
      return jsonResponse({ error: 'Failed to create owner account', detail: createUserErr?.message }, 500);
    }
    ownerUserId = newUser.user.id;
    ownerStatus = 'created_new_user';
  }

  const { error: memberErr } = await supabase.from('organisation_members').insert({
    organisation_id: org.id,
    user_id:         ownerUserId,
    role:            'admin',
    invited_at:      new Date().toISOString(),
    joined_at:       new Date().toISOString(),
  });
  if (memberErr) {
    await supabase.from('organisations').delete().eq('id', org.id);
    console.error('owner member insert failed:', memberErr.message);
    await writeAuditLog(supabase, {
      actorEmail: access.email, action: 'create_org',
      success: false, detail: { reason: 'member_insert_failed', name, slug }, ...meta,
    });
    return jsonResponse({ error: 'Failed to assign owner', detail: memberErr.message }, 500);
  }

  await writeAuditLog(supabase, {
    actorEmail: access.email,
    action:     'create_org',
    target:     org.slug,
    detail:     { organisation_id: org.id, ownerEmail, ownerStatus, limits },
    ...meta,
  });

  return jsonResponse({
    ok: true,
    organisation: org,
    ownerStatus,
    signinUrl: '/cyborg/signin/',
  });
}
