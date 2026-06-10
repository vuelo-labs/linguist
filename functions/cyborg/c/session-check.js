// POST /cyborg/c/session-check — does the signed-in candidate session match the
// email this assessment was invited to? Returns ONLY a boolean — the invited
// email is never disclosed to the client (same privacy posture as request-otp).
//
// Lets the orientation page detect a wrong-account session UP FRONT (a teammate
// session in the same browser, or a stale session on a shared device) and route
// straight to the "switch account" step, instead of letting the candidate click
// "Begin" and dead-end on email_mismatch. Side-effect-free (no claim, no spawn).
// begin.js still enforces the match server-side — this is pure UX.

import { createClient } from '@supabase/supabase-js';
import { verifyCandidateSession, readJitCookie } from '../_lib.js';

export async function onRequestPost({ request, env }) {
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_KEY || !env.SUPABASE_PUBLISHABLE_KEY) {
    return json({ ok: false, reason: 'not_configured' }, 503);
  }

  const candidate = await verifyCandidateSession(request, env);
  if (!candidate) return json({ ok: true, authed: false });

  const jit = readJitCookie(request);
  if (!jit) return json({ ok: true, authed: true, matches: null, reason: 'no_jit' });

  const admin = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);
  const { data: row, error } = await admin
    .from('cyborg_tokens')
    .select('candidate_email')
    .eq('jit_token', jit)
    .maybeSingle();
  if (error) return json({ ok: true, authed: true, matches: null });
  if (!row || !row.candidate_email) return json({ ok: true, authed: true, matches: null });

  const matches = row.candidate_email.toLowerCase() === candidate.email;
  return json({ ok: true, authed: true, matches });
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}
