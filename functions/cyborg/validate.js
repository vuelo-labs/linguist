// POST /cyborg/validate — public, checks token validity.
// Used by install.sh (fail fast on bad token) and the container at submit time.
//
// V5 hardened (2026-06-03):
//   • Per-IP rate-limit (10/min) — public token-paste endpoint with no
//     prior backpressure; without this it's an info-probe surface.
//   • 429s logged to cyborg_admin_audit (action: rate_limit_hit).

import { createClient } from '@supabase/supabase-js';
import { requestMeta, writeAuditLog, checkEndpointRateLimit } from './_lib.js';

const RATE_LIMIT_WINDOW_SEC = 60;
const RATE_LIMIT_MAX_PER_IP = 10;

export async function onRequestPost({ request, env }) {
  let body;
  try { body = await request.json(); } catch { return json({ ok: false, reason: 'bad_request' }, 400); }
  const token = (body.token || '').toString().trim();
  if (!token) return json({ ok: false, reason: 'missing_token' }, 400);

  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);
  const meta = requestMeta(request);

  // ── Rate-limit: 10 req/min per IP ──────────────────────────────────────
  // Run before the token lookup so the cheap DB count gates the more
  // expensive token select. Fail-open on lookup error (already encoded
  // in the helper).
  if (meta.ip) {
    const rl = await checkEndpointRateLimit(
      supabase,
      `validate:ip:${meta.ip}`,
      RATE_LIMIT_WINDOW_SEC,
      RATE_LIMIT_MAX_PER_IP,
    );
    if (!rl.ok) {
      await writeAuditLog(supabase, {
        actorEmail: '(public)',
        action:     'rate_limit_hit',
        target:     '/cyborg/validate',
        success:    true,
        detail:     { count: rl.count, limit: rl.limit, token_prefix: token.slice(0, 8) },
        ...meta,
      });
      return json(
        { ok: false, reason: 'rate_limited', retry_after: rl.retryAfter },
        429,
        { 'Retry-After': String(rl.retryAfter) },
      );
    }
  }

  const { data, error } = await supabase
    .from('cyborg_tokens')
    .select('token, expires_at, used_at, revoked_at, approved_at, candidate_label')
    .eq('token', token)
    .maybeSingle();

  if (error)           return json({ ok: false, reason: 'lookup_failed' }, 500);
  if (!data)           return json({ ok: false, reason: 'unknown' }, 404);
  if (data.revoked_at) return json({ ok: false, reason: 'revoked' }, 403);
  if (!data.approved_at) return json({ ok: false, reason: 'pending_approval' }, 403);
  if (data.used_at)    return json({ ok: false, reason: 'already_used' }, 403);
  if (new Date(data.expires_at) < new Date()) return json({ ok: false, reason: 'expired' }, 403);

  return json({
    ok:               true,
    candidate_label:  data.candidate_label,
    expires_at:       data.expires_at,
  });
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
