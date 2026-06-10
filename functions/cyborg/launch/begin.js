// POST /cyborg/launch/begin — authenticated claim + spawn (candidate auth, 2026-06-10).
//
// The "Begin assessment" click. Identity is now an authenticated Supabase
// candidate session (Bearer JWT, sent by the orientation page), bound to the
// recruiter-invited email — NOT a bare token/cookie. The page also carries the
// cyborg_jit cookie (which assessment). The claim is ONE conditional UPDATE
// (claimJitForCandidate) that only succeeds while the row is unclaimed AND the
// authenticated email matches candidate_email. The real cyb_ token never
// appears in any URL or body.
//
// Response contract matches the legacy POST /cyborg/launch so the orientation
// page's polling logic is shared between both paths.

import { createClient } from '@supabase/supabase-js';
import {
  requestMeta, writeAuditLog, checkEndpointRateLimit,
  readJitCookie, verifyCandidateSession, claimJitForCandidate,
} from '../_lib.js';
import { spawnCandidate } from '../launch.js';

const RATE_LIMIT_WINDOW_SEC = 60;
const RATE_LIMIT_MAX_PER_USER = 3;   // mirrors legacy launch per-token limit

const NEUTRAL_DENIED = 'This assessment link is no longer available. Contact your recruiter if you believe this is an error.';

export async function onRequestPost({ request, env }) {
  // ── Env preflight (same set as launch.js — spawnCandidate needs Fly) ───
  const missing = ['FLY_API_TOKEN', 'FLY_ORG_SLUG', 'FLY_APP_NAME', 'FLY_IMAGE_REF', 'SUBMISSION_ENDPOINT', 'SUPABASE_URL', 'SUPABASE_SERVICE_KEY']
    .filter(k => !env[k]);
  if (missing.length) {
    console.error('begin not_configured: missing env', missing);
    return json({ ok: false, reason: 'not_configured', missing }, 503);
  }

  // ── Authenticated candidate session (Bearer) ──────────────────────────
  const candidate = await verifyCandidateSession(request, env);
  if (!candidate) return json({ ok: false, reason: 'auth_required' }, 401);

  const jit = readJitCookie(request);
  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);
  const meta = requestMeta(request);

  // ── Rate-limit per authenticated user (CGNAT-safe) ────────────────────
  const rl = await checkEndpointRateLimit(
    supabase, `begin:user:${candidate.userId}`, RATE_LIMIT_WINDOW_SEC, RATE_LIMIT_MAX_PER_USER,
  );
  if (!rl.ok) {
    await writeAuditLog(supabase, {
      actorEmail: candidate.email, action: 'rate_limit_hit',
      target: '/cyborg/launch/begin', success: true,
      detail: { count: rl.count, limit: rl.limit }, ...meta,
    });
    return json({ ok: false, reason: 'rate_limited', retry_after: rl.retryAfter }, 429,
      { 'Retry-After': String(rl.retryAfter) });
  }

  // ── Resolve which assessment ──────────────────────────────────────────
  // The jit cookie is authoritative: it names the exact assessment the
  // candidate clicked (a candidate may hold more than one). Only when there's
  // no jit context do we fall back to "resume the assessment already bound to
  // this user" — the clean multi-device / cleared-cookies resume path.
  if (!jit || !/^[A-Za-z0-9_-]{16}$/.test(jit)) {
    const existing = await loadTokenByCandidateUser(supabase, candidate.userId);
    if (existing) {
      if (!validateRow(existing)) return json({ ok: false, reason: 'unavailable', message: NEUTRAL_DENIED }, 403);
      return spawnCandidate(env, supabase, existing, meta);
    }
    return json({ ok: false, reason: 'no_jit' }, 400);
  }

  // Load the jit's row, then verify the invited email matches the authenticated
  // session BEFORE the atomic claim (the email is immutable, so this is
  // race-safe — and it avoids PostgREST's '+'-in-filter pitfall).
  const { data: row } = await supabase
    .from('cyborg_tokens')
    .select('*')
    .eq('jit_token', jit)
    .maybeSingle();

  if (!row) return json({ ok: false, reason: 'unavailable', message: NEUTRAL_DENIED }, 403);

  // Already claimed?
  if (row.candidate_user_id) {
    // Same user re-clicking / new device same login → idempotent spawn.
    if (row.candidate_user_id === candidate.userId) {
      if (!validateRow(row)) return json({ ok: false, reason: 'unavailable', message: NEUTRAL_DENIED }, 403);
      return spawnCandidate(env, supabase, row, meta);
    }
    // Claimed by another identity → conflict.
    await writeAuditLog(supabase, {
      actorEmail: candidate.email, action: 'jit_token_claim_conflict',
      target: jit, success: false,
      detail: { stage: 'begin_post', jit_prefix: jit.slice(0, 6) }, ...meta,
    });
    return json({ ok: false, reason: 'unavailable', message: NEUTRAL_DENIED }, 403);
  }

  // Authenticated as a different address than the invitation → explicit signal.
  if (row.candidate_email && row.candidate_email.toLowerCase() !== candidate.email) {
    return json({ ok: false, reason: 'email_mismatch' }, 403);
  }

  if (!validateRow(row)) return json({ ok: false, reason: 'unavailable', message: NEUTRAL_DENIED }, 403);

  // Atomic first-claimer-wins on (jit, candidate_user_id IS NULL).
  const { claimed } = await claimJitForCandidate(supabase, jit, candidate.userId, meta);
  if (claimed) {
    await writeAuditLog(supabase, {
      actorEmail: candidate.email, action: 'jit_token_consumed',
      target: jit, success: true, detail: { jit_prefix: jit.slice(0, 6) }, ...meta,
    });
    return spawnCandidate(env, supabase, claimed, meta);
  }

  // Lost the race — re-read; if this same user won, idempotent spawn, else conflict.
  const { data: row2 } = await supabase
    .from('cyborg_tokens').select('*').eq('jit_token', jit).maybeSingle();
  if (row2 && row2.candidate_user_id === candidate.userId) {
    return spawnCandidate(env, supabase, row2, meta);
  }
  await writeAuditLog(supabase, {
    actorEmail: candidate.email, action: 'jit_token_claim_conflict',
    target: jit, success: false,
    detail: { stage: 'begin_post_race', jit_prefix: jit.slice(0, 6) }, ...meta,
  });
  return json({ ok: false, reason: 'unavailable', message: NEUTRAL_DENIED }, 403);
}

async function loadTokenByCandidateUser(supabase, userId) {
  const { data, error } = await supabase
    .from('cyborg_tokens')
    .select('*')
    .eq('candidate_user_id', userId)
    .order('issued_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) { console.error('candidate-user lookup error:', error.message); return null; }
  return data;
}

// Same gate set as launch.js applies before spawning (validate.js mirror).
function validateRow(row) {
  if (row.revoked_at) return false;
  if (!row.approved_at) return false;
  if (row.used_at) return false;
  if (new Date(row.expires_at) < new Date()) return false;
  return true;
}

function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...extraHeaders },
  });
}
