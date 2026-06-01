// GET /cyborg/admin/orgs/list — platform-admin listing of all organisations.
//
// Returns every org with member / campaign / candidate counts so the
// platform admin can see usage against limits at a glance. Gated by
// Cloudflare Access (same as the rest of /cyborg/admin/*).

import { createClient } from '@supabase/supabase-js';
import { verifyAccessJwt } from '../../_access.js';
import { writeAuditLog, requestMeta, jsonResponse } from '../../_lib.js';

export async function onRequestGet({ request, env }) {
  const meta = requestMeta(request);
  const access = await verifyAccessJwt(request, env);
  if (!access.ok) {
    const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);
    await writeAuditLog(supabase, {
      actorEmail: '(unauthenticated)', action: 'list_orgs',
      success: false, detail: { reason: access.reason }, ...meta,
    });
    return jsonResponse({ error: 'Unauthorized', reason: access.reason }, 401);
  }

  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);

  const { data: orgs, error: orgsErr } = await supabase
    .from('organisations')
    .select('id, name, slug, limits, created_at, created_by')
    .order('created_at', { ascending: true });

  if (orgsErr) {
    console.error('list orgs error:', orgsErr.message);
    return jsonResponse({ error: 'Failed to list organisations.' }, 500);
  }

  // Stitch in per-org counts. Cheap at small org counts; if this grows
  // beyond a few hundred orgs, move to a view or a single aggregation
  // query with grouping.
  const enriched = await Promise.all(orgs.map(async (org) => {
    const [{ count: members }, { count: campaigns }, { count: candidates }] = await Promise.all([
      supabase.from('organisation_members').select('id', { count: 'exact', head: true }).eq('organisation_id', org.id),
      supabase.from('campaigns').select('id', { count: 'exact', head: true }).eq('organisation_id', org.id),
      supabase.from('cyborg_tokens').select('token', { count: 'exact', head: true }).eq('organisation_id', org.id),
    ]);
    return {
      ...org,
      counts: { members: members || 0, campaigns: campaigns || 0, candidates: candidates || 0 },
    };
  }));

  await writeAuditLog(supabase, {
    actorEmail: access.email, action: 'list_orgs',
    target: `count=${enriched.length}`, ...meta,
  });

  return jsonResponse({ orgs: enriched });
}
