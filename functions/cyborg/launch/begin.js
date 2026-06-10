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

  // ── Already bound to this user? (re-click / reload / new device, same login) ──
  // The candidate session is the source of truth, so a row already bound to
  // this user is re-entered idempotently regardless of cookies — this is what
  // makes clean multi-device resume work.
  const existing = await loadTokenByCandidateUser(supabase, candidate.userId);
  if (existing) {
    if (!validateRow(existing)) return json({ ok: false, reason: 'unavailable', message: NEUTRAL_DENIED }, 403);
    return spawnCandidate(env, supabase, existing, meta);
  }

  // ── Fresh claim ────────────────────────────────────────────────────────
  if (!jit || !/^[A-Za-z0-9_-]{16}$/.test(jit)) {
    return json({ ok: false, reason: 'no_jit' }, 400);
  }

  // Atomic first-verify-wins: binds candidate_user_id only while unclaimed AND
  // the invited email matches the authenticated email.
  const { claimed } = await claimJitForCandidate(supabase, jit, candidate.userId, candidate.email, meta);
  if (claimed) {
    if (!validateRow(claimed)) {
      return json({ ok: false, reason: 'unavailable', message: NEUTRAL_DENIED }, 403);
    }
    await writeAuditLog(supabase, {
      actorEmail: candidate.email, action: 'jit_token_consumed',
      target: jit, success: true, detail: { jit_prefix: jit.slice(0, 6) }, ...meta,
    });
    return spawnCandidate(env, supabase, claimed, meta);
  }

  // ── Claim failed — diagnose why ─────────────────────────────────────────
  const { data: row } = await supabase
    .from('cyborg_tokens')
    .select('*')
    .eq('jit_token', jit)
    .maybeSingle();

  // Double-click / reload after this same user already claimed → idempotent.
  if (row && row.candidate_user_id === candidate.userId) {
    if (!validateRow(row)) return json({ ok: false, reason: 'unavailable', message: NEUTRAL_DENIED }, 403);
    return spawnCandidate(env, supabase, row, meta);
  }

  // Authenticated as a different address than the invitation → explicit signal
  // so the page can tell the candidate to use the right inbox.
  if (row && row.candidate_email &&
      row.candidate_email.toLowerCase() !== candidate.email &&
      !row.candidate_user_id) {
    return json({ ok: false, reason: 'email_mismatch' }, 403);
  }

  // Claimed by someone else (or dead jit). Neutral copy; detail to audit.
  await writeAuditLog(supabase, {
    actorEmail: candidate.email, action: 'jit_token_claim_conflict',
    target: jit, success: false,
    detail: { stage: 'begin_post', jit_prefix: jit.slice(0, 6) }, ...meta,
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
