// GET /cyborg/admin/config/trace?token=cyb_... — token-centric diagnostic view
//
// Returns the data the admin Trace tab needs to triage 80% of incidents:
//   { token_row, audit_rows[], submission, report }
//
// Used by the admin UI when an admin pastes a candidate token to figure out
// what happened to that candidate. session.jsonl is NOT included in v1 —
// link out to the Fly dashboard for raw stream.
//
// Auth: Cloudflare Access.

import { createClient } from '@supabase/supabase-js';
import { verifyAccessJwt } from '../../_access.js';
import { jsonResponse } from '../../_lib.js';

const AUDIT_ROW_LIMIT = 50;

export async function onRequestGet({ request, env }) {
  const access = await verifyAccessJwt(request, env);
  if (!access.ok) return jsonResponse({ error: 'Unauthorized', reason: access.reason }, 401);

  const url = new URL(request.url);
  const token = (url.searchParams.get('token') || '').trim();
  if (!token) return jsonResponse({ error: 'token query param is required' }, 400);

  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);

  const { data: tokenRow, error: tokenErr } = await supabase
    .from('cyborg_tokens')
    .select('token, candidate_label, candidate_email, organisation_id, campaign_id, issued_at, expires_at, used_at, revoked_at, approved_at, fly_machine_id, machine_url, launched_at, active_time_used_seconds, active_time_cap_seconds')
    .eq('token', token)
    .maybeSingle();

  if (tokenErr) {
    console.error('trace token lookup error:', tokenErr.message);
    return jsonResponse({ error: 'Failed to look up token.' }, 500);
  }
  if (!tokenRow) {
    return jsonResponse({ token, found: false }, 404);
  }

  const [auditResult, submissionResult] = await Promise.all([
    supabase
      .from('cyborg_admin_audit')
      .select('id, created_at, action, target, success, detail, actor_email, ip')
      .or(`target.eq.${token},target.eq.${token.slice(0, 12)}`)
      .order('created_at', { ascending: false })
      .limit(AUDIT_ROW_LIMIT),
    supabase
      .from('submissions')
      .select('id, candidate_token, candidate_label, submitted_at, received_at, trigger, dev_mode')
      .eq('candidate_token', token)
      .order('received_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  const auditRows = auditResult.error ? [] : (auditResult.data || []);
  if (auditResult.error) console.error('trace audit error:', auditResult.error.message);
  const submission = submissionResult.error ? null : submissionResult.data;
  if (submissionResult.error) console.error('trace submission error:', submissionResult.error.message);

  let report = null;
  if (submission) {
    const { data: reportRow, error: reportErr } = await supabase
      .from('reports')
      .select('id, status, error, cost_usd, scored_at, created_at')
      .eq('submission_id', submission.id)
      .maybeSingle();
    if (reportErr) console.error('trace report error:', reportErr.message);
    report = reportRow || null;
  }

  return jsonResponse({
    token,
    found: true,
    token_row: tokenRow,
    audit_rows: auditRows,
    submission,
    report,
    audit_row_limit: AUDIT_ROW_LIMIT,
  });
}
