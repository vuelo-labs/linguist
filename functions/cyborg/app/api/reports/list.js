// POST /cyborg/app/api/reports/list — list submissions + reports for an org member.
//
// Auth: enforced by /cyborg/app/_middleware.js (sets X-Cyborg-User-Id +
// X-Cyborg-User-Email). Body: { organisation_id?: uuid, candidate_token?: string }
//
// If candidate_token is provided, returns only that candidate's submissions
// (used by the per-candidate View page). Otherwise returns all submissions
// for the org (used by the standalone Reports page).
//
// Server-side because:
//   - submissions table has no RLS policy for org members (only RLS is
//     reports_candidate_own which is for the candidate machine itself).
//     Without server-side, an org admin can't list their org's submissions.
//   - Service-role bypass + explicit org-membership check is the same
//     pattern team/members.js uses.

import { createClient } from '@supabase/supabase-js';
import { writeAuditLog, requestMeta } from '../../../_lib.js';

export async function onRequestPost({ request, env }) {
  const userId    = request.headers.get('x-cyborg-user-id') || '';
  const userEmail = request.headers.get('x-cyborg-user-email') || '';
  const meta      = requestMeta(request);

  if (!userId) return json({ ok: false, reason: 'no_user' }, 401);

  let body;
  try { body = await request.json(); } catch { body = {}; }
  const orgId          = (body.organisation_id || '').toString().trim();
  const candidateToken = (body.candidate_token || '').toString().trim();

  const admin = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);

  // Verify caller is a member of the requested org (or, if no org passed,
  // pick the caller's first org membership — single-org users today).
  let effectiveOrgId = orgId;
  if (!effectiveOrgId) {
    const { data: m } = await admin
      .from('organisation_members')
      .select('organisation_id')
      .eq('user_id', userId)
      .order('joined_at', { ascending: true })
      .limit(1)
      .maybeSingle();
    if (!m) return json({ ok: false, reason: 'no_org' }, 403);
    effectiveOrgId = m.organisation_id;
  } else {
    const { data: membership } = await admin
      .from('organisation_members')
      .select('id')
      .eq('organisation_id', effectiveOrgId)
      .eq('user_id', userId)
      .maybeSingle();
    if (!membership) return json({ ok: false, reason: 'not_a_member_of_org' }, 403);
  }

  // Tokens for this org. If candidate_token was specified, narrow to that
  // single token (and still verify it belongs to this org).
  let tokensQuery = admin
    .from('cyborg_tokens')
    .select('token, candidate_label, candidate_email')
    .eq('organisation_id', effectiveOrgId);
  if (candidateToken) tokensQuery = tokensQuery.eq('token', candidateToken);
  const { data: tokenRows } = await tokensQuery;
  const tokens = (tokenRows || []).map(t => t.token);
  if (!tokens.length) {
    return json({ ok: true, organisation_id: effectiveOrgId, submissions: [], reports: [], tokens: [] });
  }

  // Submissions for those tokens.
  const { data: subs } = await admin
    .from('submissions')
    .select('id, candidate_token, candidate_label, submitted_at, received_at, dev_mode')
    .in('candidate_token', tokens)
    .order('received_at', { ascending: false });

  // Reports keyed by submission_id.
  let reports = [];
  if (subs && subs.length) {
    const { data: r } = await admin
      .from('reports')
      .select('submission_id, candidate_token, status, model_used, cost_usd, duration_ms, scored_at, error')
      .in('submission_id', subs.map(s => s.id));
    reports = r || [];
  }

  await writeAuditLog(admin, {
    actorEmail: userEmail, action: 'list_reports',
    target: candidateToken || effectiveOrgId, success: true,
    detail: {
      organisation_id: effectiveOrgId,
      candidate_token_filter: candidateToken || null,
      token_count: tokens.length,
      submission_count: (subs || []).length,
      report_count: reports.length,
    }, ...meta,
  });

  return json({
    ok: true,
    organisation_id: effectiveOrgId,
    tokens:          tokenRows || [],
    submissions:     subs || [],
    reports,
  });
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}
