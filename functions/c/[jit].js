// GET /c/<jit> — JIT launch-link exchange (token obfuscation, 2026-06-09).
//
// The candidate's emailed link is /c/<16-char-jit>. This endpoint is FULLY
// PASSIVE: it sets the cyborg_session cookie and 302s to the orientation
// page. It never writes to the DB — email scanners (Outlook safe-links,
// Gmail prefetch, AV sandboxes) follow GETs, so any DB-side claim here
// would bind the row to a scanner's discarded cookie and lock the real
// candidate out. Binding + consumption happen at POST /cyborg/launch/begin
// (the "Begin assessment" click; scanners don't click, and SameSite=Lax
// keeps their cookie off cross-site POSTs anyway).
//
// Response map:
//   unknown / expired / revoked jit            → 410 (neutral page)
//   consumed + cookie matches session_id       → 302 /cyborg/launch/ (reload)
//   consumed + different/no cookie             → 403 neutral page + audit
//   not yet consumed                           → set cookie (if absent) + 302

import { createClient } from '@supabase/supabase-js';
import {
  htmlPage, requestMeta, writeAuditLog, checkEndpointRateLimit, jitCookieHeader,
} from '../cyborg/_lib.js';

const RATE_LIMIT_WINDOW_SEC = 60;
const RATE_LIMIT_MAX_PER_IP = 20;   // office-NAT-safe; 96-bit jit entropy is the real brute-force defence

const NEUTRAL_GONE = 'This assessment link is no longer available. Contact your recruiter if you believe this is an error.';

export async function onRequestGet({ request, env, params }) {
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_KEY) {
    return htmlPage(503, 'Unavailable', 'The service is not configured. Please try again later.');
  }

  const jit = (params.jit || '').trim();
  // 16-char base64url. Reject anything else before touching the DB.
  if (!/^[A-Za-z0-9_-]{16}$/.test(jit)) {
    return htmlPage(410, 'Link unavailable', NEUTRAL_GONE);
  }

  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);
  const meta = requestMeta(request);

  // ── Rate-limit per IP (mass-replay defence on forwarded links) ─────────
  const rl = await checkEndpointRateLimit(
    supabase, `jit-exchange:ip:${meta.ip}`, RATE_LIMIT_WINDOW_SEC, RATE_LIMIT_MAX_PER_IP,
  );
  if (!rl.ok) {
    await writeAuditLog(supabase, {
      actorEmail: '(public)',
      action:     'rate_limit_hit',
      target:     '/c/<jit>',
      success:    true,
      detail:     { count: rl.count, limit: rl.limit, jit_prefix: jit.slice(0, 6) },
      ...meta,
    });
    return htmlPage(429, 'Slow down', 'Too many attempts. Please wait a minute and try again.');
  }

  const { data: row, error } = await supabase
    .from('cyborg_tokens')
    .select('jit_token, expires_at, revoked_at, approved_at')
    .eq('jit_token', jit)
    .maybeSingle();

  if (error) return htmlPage(500, 'Something went wrong', 'Please try again in a moment.');
  if (!row || row.revoked_at || !row.approved_at || new Date(row.expires_at) < new Date()) {
    return htmlPage(410, 'Link unavailable', NEUTRAL_GONE);
  }

  // Candidate auth (2026-06-10): this endpoint only records WHICH assessment
  // (the cyborg_jit cookie) and forwards to the orientation page. It does NOT
  // claim or 403 — the real gate is the OTP sign-in + the email-matched,
  // first-verify-wins claim in /cyborg/launch/begin. A consumed jit is fine to
  // re-follow: the orientation page will require the bound candidate's session,
  // so a stranger who has the link still can't get in without that inbox.
  // Stays passive (no DB write) so email scanners can't consume anything.
  const headers = new Headers({ Location: '/cyborg/launch/' });
  headers.append('Set-Cookie', jitCookieHeader(jit));
  return new Response(null, { status: 302, headers });
}
