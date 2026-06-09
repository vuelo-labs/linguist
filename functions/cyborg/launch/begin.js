// POST /cyborg/launch/begin — claim the JIT + spawn (token obfuscation, 2026-06-09).
//
// The "Begin assessment" click. Identity arrives as two HttpOnly cookies set
// by /c/<jit>: cyborg_session (browser identity) + cyborg_jit (the pending
// ticket). The claim is ONE conditional UPDATE (claimSessionAtomic) — losing
// a double-click race resolves idempotently for the same session, 403 for a
// different browser. The real cyb_ token never appears in any URL or body.
//
// Response contract matches the legacy POST /cyborg/launch so the orientation
// page's polling logic is shared between both paths.

import { createClient } from '@supabase/supabase-js';
import {
  requestMeta, writeAuditLog, checkEndpointRateLimit,
  readSessionCookie, readJitCookie, loadTokenBySession, claimSessionAtomic,
} from '../_lib.js';
import { spawnCandidate } from '../launch.js';

const RATE_LIMIT_WINDOW_SEC = 60;
const RATE_LIMIT_MAX_PER_SESSION = 3;   // mirrors legacy launch per-token limit

const NEUTRAL_DENIED = 'This assessment link is no longer available. Contact your recruiter if you believe this is an error.';

export async function onRequestPost({ request, env }) {
  // ── Env preflight (same set as launch.js — spawnCandidate needs Fly) ───
  const missing = ['FLY_API_TOKEN', 'FLY_ORG_SLUG', 'FLY_APP_NAME', 'FLY_IMAGE_REF', 'SUBMISSION_ENDPOINT', 'SUPABASE_URL', 'SUPABASE_SERVICE_KEY']
    .filter(k => !env[k]);
  if (missing.length) {
    console.error('begin not_configured: missing env', missing);
    return json({ ok: false, reason: 'not_configured', missing }, 503);
  }

  const sessionId = readSessionCookie(request);
  const jit       = readJitCookie(request);
  if (!sessionId) return json({ ok: false, reason: 'no_session' }, 401);

  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);
  const meta = requestMeta(request);

  // ── Rate-limit per session (CGNAT-safe, mirrors launch.js) ────────────
  const rl = await checkEndpointRateLimit(
    supabase, `begin:session:${sessionId}`, RATE_LIMIT_WINDOW_SEC, RATE_LIMIT_MAX_PER_SESSION,
  );
  if (!rl.ok) {
    await writeAuditLog(supabase, {
      actorEmail: '(public)',
      action:     'rate_limit_hit',
      target:     '/cyborg/launch/begin',
      success:    true,
      detail:     { count: rl.count, limit: rl.limit },
      ...meta,
    });
    return json(
      { ok: false, reason: 'rate_limited', retry_after: rl.retryAfter },
      429,
      { 'Retry-After': String(rl.retryAfter) },
    );
  }

  // ── Already bound? (re-click / page reload after claim) ───────────────
  // loadTokenBySession resolves the row this browser already owns; re-enter
  // the spawn path, whose own idempotency returns the running machine URL.
  const existing = await loadTokenBySession(supabase, sessionId);
  if (existing) {
    if (!validateRow(existing)) return json({ ok: false, reason: 'unavailable' }, 403);
    return spawnCandidate(env, supabase, existing, meta);
  }

  // ── Fresh claim ────────────────────────────────────────────────────────
  if (!jit || !/^[A-Za-z0-9_-]{16}$/.test(jit)) {
    return json({ ok: false, reason: 'no_session' }, 401);
  }

  const { claimed } = await claimSessionAtomic(supabase, jit, sessionId, meta);
  if (claimed) {
    if (!validateRow(claimed)) {
      // Revoked/expired between exchange and click — claim landed but spawn
      // is refused. Leave the row consumed; admin re-mint is the recovery.
      return json({ ok: false, reason: 'unavailable' }, 403);
    }
    await writeAuditLog(supabase, {
      actorEmail: '(public)',
      action:     'jit_token_consumed',
      target:     jit,
      success:    true,
      detail:     { jit_prefix: jit.slice(0, 6) },
      ...meta,
    });
    return spawnCandidate(env, supabase, claimed, meta);
  }

  // ── Lost the race (or jit unknown) ─────────────────────────────────────
  // Re-read: if the winner was THIS session (double-click), proceed
  // idempotently; anything else is a conflict or a dead jit.
  const { data: row } = await supabase
    .from('cyborg_tokens')
    .select('*')
    .eq('jit_token', jit)
    .maybeSingle();

  if (row && row.session_id === sessionId) {
    if (!validateRow(row)) return json({ ok: false, reason: 'unavailable' }, 403);
    return spawnCandidate(env, supabase, row, meta);
  }

  await writeAuditLog(supabase, {
    actorEmail: '(public)',
    action:     'jit_token_claim_conflict',
    target:     jit,
    success:    false,
    detail:     { stage: 'begin_post', jit_prefix: jit.slice(0, 6) },
    ...meta,
  });
  return json({ ok: false, reason: 'unavailable', message: NEUTRAL_DENIED }, 403);
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
    headers: {
      'Content-Type':  'application/json',
      'Cache-Control': 'no-store',
      ...extraHeaders,
    },
  });
}
