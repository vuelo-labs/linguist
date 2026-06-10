// POST /cyborg/c/my-assessments — list the signed-in candidate's assessments.
//
// Auth: an authenticated Supabase candidate session (Bearer, verified via
// verifyCandidateSession). This route is OUTSIDE /cyborg/app/api/* so the app
// `_middleware` does not guard it — we self-verify here.
//
// Returns each cyborg_tokens row bound to this candidate_user_id, with a derived
// status and its `jit_token`. The dashboard links each row to /c/<jit_token> to
// launch/resume — reusing the zero-exposure launch flow (the real cyb_ token is
// NEVER returned; the jit is the same opaque ticket the candidate already
// received in their invite email). The service-role key is used by necessity
// (cyborg_tokens has no candidate-facing RLS policy); the session check above is
// the gate.

import { createClient } from '@supabase/supabase-js';
import { verifyCandidateSession } from '../_lib.js';

export async function onRequestPost({ request, env }) {
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_KEY || !env.SUPABASE_PUBLISHABLE_KEY) {
    return json({ ok: false, reason: 'not_configured' }, 503);
  }
  const candidate = await verifyCandidateSession(request, env);
  if (!candidate) return json({ ok: false, reason: 'auth_required' }, 401);

  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);
  const { data: rows, error } = await supabase
    .from('cyborg_tokens')
    // `token` is selected for the reports join only — it is NEVER returned.
    .select('jit_token, token, candidate_label, campaign_id, expires_at, revoked_at, approved_at, launched_at, used_at, issued_at')
    .eq('candidate_user_id', candidate.userId)
    .order('issued_at', { ascending: false });
  if (error) {
    console.error('my-assessments lookup failed:', error.message);
    return json({ ok: false, reason: 'lookup_failed' }, 500);
  }

  // Campaign names (batched).
  const campaignIds = [...new Set((rows || []).map(r => r.campaign_id).filter(Boolean))];
  const campaignNames = {};
  if (campaignIds.length) {
    const { data: cs } = await supabase.from('campaigns').select('id, name').in('id', campaignIds);
    for (const c of (cs || [])) campaignNames[c.id] = c.name;
  }

  // Which tokens have a scored ('ready') report — batched.
  const tokens = (rows || []).map(r => r.token).filter(Boolean);
  const scored = new Set();
  if (tokens.length) {
    const { data: reps } = await supabase.from('reports').select('candidate_token, status').in('candidate_token', tokens);
    for (const rp of (reps || [])) if (rp.status === 'ready') scored.add(rp.candidate_token);
  }

  const now = Date.now();
  const assessments = (rows || []).map(r => {
    let status;
    if (r.revoked_at) status = 'revoked';
    else if (!r.approved_at) status = 'pending';
    else if (new Date(r.expires_at).getTime() < now) status = 'expired';
    else if (r.used_at) status = scored.has(r.token) ? 'scored' : 'submitted';
    else if (r.launched_at) status = 'in-progress';
    else status = 'not-launched';
    return {
      jit_token: r.jit_token || null,
      label: r.candidate_label || null,
      campaign_name: r.campaign_id ? (campaignNames[r.campaign_id] || null) : null,
      status,
      expires_at: r.expires_at,
    };
  });

  return json({ ok: true, assessments });
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}
