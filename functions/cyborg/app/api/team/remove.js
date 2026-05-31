// POST /cyborg/app/api/team/remove — remove a teammate from the org.
//
// Body: { member_id: uuid, organisation_id: uuid }
//
// Behaviour:
//   1. Verify the caller is owner/admin of the org
//   2. Verify the target member belongs to that org
//   3. Disallow removing the org's last owner (or yourself if you're the only owner)
//   4. Delete the organisation_members row
//   5. Write to cyborg_admin_audit

import { createClient } from '@supabase/supabase-js';
import { writeAuditLog, requestMeta } from '../../../_lib.js';

export async function onRequestPost({ request, env }) {
  const userId    = request.headers.get('x-cyborg-user-id') || '';
  const userEmail = request.headers.get('x-cyborg-user-email') || '';
  const meta      = requestMeta(request);

  if (!userId) return json({ ok: false, reason: 'no_user' }, 401);

  let body;
  try { body = await request.json(); } catch { return json({ ok: false, reason: 'bad_json' }, 400); }

  const memberId = (body.member_id || '').toString().trim();
  const orgId    = (body.organisation_id || '').toString().trim();
  if (!memberId || !orgId) return json({ ok: false, reason: 'missing_fields' }, 400);

  const admin = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);

  // Caller must be owner/admin of the org.
  const { data: callerMembership } = await admin
    .from('organisation_members')
    .select('id, role')
    .eq('organisation_id', orgId)
    .eq('user_id', userId)
    .maybeSingle();

  if (!callerMembership) return json({ ok: false, reason: 'not_a_member_of_org' }, 403);
  if (!['owner', 'admin'].includes(callerMembership.role)) return json({ ok: false, reason: 'insufficient_role' }, 403);

  // Target must belong to the org.
  const { data: target } = await admin
    .from('organisation_members')
    .select('id, user_id, role')
    .eq('id', memberId)
    .eq('organisation_id', orgId)
    .maybeSingle();

  if (!target) return json({ ok: false, reason: 'member_not_found' }, 404);

  // Can't remove the last owner (or yourself if you're an owner).
  if (target.role === 'owner') {
    const { count: ownerCount } = await admin
      .from('organisation_members')
      .select('id', { count: 'exact', head: true })
      .eq('organisation_id', orgId)
      .eq('role', 'owner');
    if ((ownerCount || 0) <= 1) {
      return json({ ok: false, reason: 'cannot_remove_last_owner' }, 400);
    }
  }

  const { error: delErr } = await admin
    .from('organisation_members')
    .delete()
    .eq('id', memberId);

  if (delErr) {
    console.error('remove: delete failed', delErr.message);
    await writeAuditLog(admin, {
      actorEmail: userEmail, action: 'remove_member',
      target: memberId, success: false,
      detail: { error: delErr.message, organisation_id: orgId }, ...meta,
    });
    return json({ ok: false, reason: 'delete_failed' }, 500);
  }

  await writeAuditLog(admin, {
    actorEmail: userEmail, action: 'remove_member',
    target: memberId, success: true,
    detail: { organisation_id: orgId, removed_user_id: target.user_id, removed_role: target.role }, ...meta,
  });

  return json({ ok: true });
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}
