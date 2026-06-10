// POST /cyborg/handoff-ticket — mint a short-lived, single-use handoff ticket
// for the "Enter workspace" click (zero-exposure handoff, Phase 2, 2026-06-10).
//
// The orientation page calls this the moment the candidate clicks "Enter
// workspace", then auto-submits a form POST of the returned ticket to the
// container's /handoff. The raw cyb_ token never appears in the URL, the page,
// or any log: the ticket is `exp.nonce.sig` where sig = HMAC(secret,
// "handoff.<token>.<exp>.<nonce>") — the token is signed but not transmitted,
// and the container recomputes it from its own CANDIDATE_TOKEN env.
//
// Identity (mirrors launch-status.js): JIT path sends a Supabase candidate
// Bearer JWT (row resolved by candidate_user_id); legacy ?t= in-flight path
// sends { token } in the body. Both yield a clean machine_url + a ticket.

import { createClient } from '@supabase/supabase-js';
import {
  requestMeta, writeAuditLog, checkEndpointRateLimit,
  verifyCandidateSession, signHandoffTicket,
} from './_lib.js';

const RATE_LIMIT_WINDOW_SEC = 60;
const RATE_LIMIT_MAX = 10;   // a click mints one; headroom for resume/retry double-clicks

export async function onRequestPost({ request, env }) {
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_KEY || !env.CYBORG_HANDOFF_SECRET) {
    return json({ ok: false, reason: 'not_configured' }, 503);
  }

  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);
  const meta = requestMeta(request);

  // ── Resolve identity → token row ──────────────────────────────────────
  // JIT path: authenticated candidate session (Bearer), row by candidate_user_id.
  // Legacy path: { token } in body. Either way we end with the row + its token.
  let row = null;
  let rlKey = null;
  const candidate = await verifyCandidateSession(request, env);
  if (candidate) {
    rlKey = `handoff:user:${candidate.userId}`;
    const { data } = await supabase
      .from('cyborg_tokens')
      .select('token, expires_at, used_at, revoked_at, approved_at, fly_machine_id, machine_url')
      .eq('candidate_user_id', candidate.userId)
      .order('issued_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    row = data || null;
  } else {
    let body;
    try { body = await request.json(); } catch { body = {}; }
    const token = (body.token || '').toString().trim();
    if (!token) return json({ ok: false, reason: 'auth_required' }, 401);
    rlKey = `handoff:token:${token}`;
    const { data } = await supabase
      .from('cyborg_tokens')
      .select('token, expires_at, used_at, revoked_at, approved_at, fly_machine_id, machine_url')
      .eq('token', token)
      .maybeSingle();
    row = data || null;
  }

  // ── Rate-limit (CGNAT-safe; per user/token) ───────────────────────────
  const rl = await checkEndpointRateLimit(supabase, rlKey, RATE_LIMIT_WINDOW_SEC, RATE_LIMIT_MAX);
  if (!rl.ok) {
    await writeAuditLog(supabase, {
      actorEmail: candidate?.email || '(public)', action: 'rate_limit_hit',
      target: '/cyborg/handoff-ticket', success: true,
      detail: { count: rl.count, limit: rl.limit }, ...meta,
    });
    return json({ ok: false, reason: 'rate_limited', retry_after: rl.retryAfter }, 429,
      { 'Retry-After': String(rl.retryAfter) });
  }

  // ── Validate the row (same gate set as launch-status.js) ──────────────
  if (!row)                  return json({ ok: false, reason: 'unknown' }, 404);
  if (row.revoked_at)        return json({ ok: false, reason: 'revoked' }, 403);
  if (!row.approved_at)      return json({ ok: false, reason: 'pending_approval' }, 403);
  if (row.used_at)           return json({ ok: false, reason: 'used' }, 403);
  if (new Date(row.expires_at) < new Date()) return json({ ok: false, reason: 'expired' }, 403);
  // Machine must already be spawned + reachable — the page only mints a ticket
  // once launch-status reports ready, so a missing url/machine is a race.
  if (!row.fly_machine_id || !row.machine_url) {
    return json({ ok: false, reason: 'not_ready' }, 409);
  }

  const ticket = await signHandoffTicket(env.CYBORG_HANDOFF_SECRET, row.token);
  return json({ ok: true, url: row.machine_url, ticket });
}

function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...extraHeaders },
  });
}
