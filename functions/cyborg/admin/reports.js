// GET /cyborg/admin/reports — admin-only listing of recent scored sessions.
//
// Returns the most recent ~50 rows from the reports table with signed
// URLs (1 hour expiry) for each tier's rendered HTML. Lives under the
// /cyborg/admin* path so it inherits the existing CF Access wildcard
// without needing a new application hostname entry.

import { createClient } from '@supabase/supabase-js';
import { verifyAccessJwt } from '../_access.js';
import { writeAuditLog, requestMeta } from '../_lib.js';

const SIGNED_URL_TTL_SECONDS = 60 * 60;       // 1 hour
const TIERS = ['master', 'candidate', 'manager', 'technical', 'recruiter'];

export async function onRequestGet({ request, env }) {
  const meta = requestMeta(request);
  const access = await verifyAccessJwt(request, env);
  if (!access.ok) {
    const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);
    await writeAuditLog(supabase, {
      actorEmail: '(unauthenticated)', action: 'list_reports',
      success: false, detail: { reason: access.reason }, ...meta,
    });
    return json({ error: 'Unauthorized', reason: access.reason }, 401);
  }

  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);

  // Pull recent reports. Joining to cyborg_tokens for the candidate label
  // would be nice but PostgREST doesn't make it easy across schemas.
  // We'll fetch tokens separately + stitch in JS — cheap at this volume.
  const { data: reports, error } = await supabase
    .from('reports')
    .select('id, submission_id, candidate_token, status, model_used, ' +
            'cost_usd, duration_ms, error, scored_at, created_at, ' +
            'master_url, candidate_url, manager_url, technical_url, recruiter_url, ' +
            'audience_views')
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error('list reports error:', error.message);
    return json({ error: 'Failed to list reports.' }, 500);
  }

  // Fetch the matching token rows (for human-readable label).
  const candidateTokens = [...new Set(reports.map(r => r.candidate_token).filter(Boolean))];
  let labelByToken = {};
  if (candidateTokens.length) {
    const { data: tokenRows } = await supabase
      .from('cyborg_tokens')
      .select('token, candidate_label')
      .in('token', candidateTokens);
    for (const t of (tokenRows || [])) {
      labelByToken[t.token] = t.candidate_label || null;
    }
  }

  // Generate signed URLs in parallel per report. createSignedUrl is a
  // single PostgREST round-trip each; ~250 calls for a full 50-row page.
  await Promise.all(reports.map(r => signRow(supabase, r)));

  // Stitch in at-a-glance fields the UI uses without expanding each row.
  for (const r of reports) {
    const av = r.audience_views || {};
    const recr = av.recruiter || {};
    const cand = av.candidate || {};
    r.candidate_label = labelByToken[r.candidate_token] || null;
    r.verdict = recr.verdict || null;
    r.headline_snippet = (cand.headline || recr.headline || '').slice(0, 160);
    // Drop the full audience_views payload from the response — the admin
    // page only needs verdict + snippet, and audience_views is ~10KB per row.
    delete r.audience_views;
  }

  await writeAuditLog(supabase, {
    actorEmail: access.email, action: 'list_reports',
    success: true, detail: { row_count: reports.length }, ...meta,
  });

  return json({ ok: true, reports });
}

async function signRow(supabase, r) {
  r.signed = {};
  await Promise.all(TIERS.map(async tier => {
    const stored = r[`${tier}_url`];
    if (!stored) return;
    // stored shape: "reports/<sub_id>/<tier>.html"
    const objectPath = stored.replace(/^reports\//, '');
    const { data, error } = await supabase
      .storage
      .from('reports')
      .createSignedUrl(objectPath, SIGNED_URL_TTL_SECONDS);
    if (!error && data) r.signed[tier] = data.signedUrl;
  }));
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}
