// Shared helpers for cyborg/* worker functions.

export async function hmacHex(secret, message) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw', enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false, ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(message));
  return Array.from(new Uint8Array(sig))
    .map(b => b.toString(16).padStart(2, '0')).join('');
}

export function timingSafeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

export function generateToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  const hex   = Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
  return `cyb_${hex}`;
}

export function jsonResponse(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
      ...extraHeaders,
    },
  });
}

export function htmlPage(status, title, message, accent = '#6B5540') {
  // Standalone HTML page for the approve/reject endpoints — no shared CSS.
  const safe = s => String(s).replace(/[&<>]/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;' }[c]));
  return new Response(`<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>${safe(title)}</title>
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>
body{font-family:-apple-system,BlinkMacSystemFont,'Inter',sans-serif;background:#FAF8F4;color:#2A2420;margin:0;display:flex;align-items:center;justify-content:center;min-height:100vh;padding:24px;}
.card{background:#F2EDE6;border:1px solid #E5DFD6;border-radius:14px;padding:36px 40px;max-width:480px;}
h1{font-family:'Newsreader',Georgia,serif;font-size:1.6rem;font-weight:500;margin:0 0 12px;color:${accent};}
p{line-height:1.55;color:#5E5450;margin:0 0 14px;}
</style></head>
<body><div class="card"><h1>${safe(title)}</h1><p>${safe(message)}</p></div></body></html>`,
    { status, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } });
}

// Send a transactional email via Resend's REST API.
// Returns { ok: boolean, status?: number, error?: string }. Never throws.
//
// env.RESEND_API_KEY — Resend API token (already used by team/invite.js).
// `from` defaults to 'Cyborg <hello@vuelolabs.com>' (matches the team-invite
// sender so candidates see one consistent brand). Pass an override when the
// audience is operator/internal rather than candidate-facing.
//
// 2026-06-05 — added to port the candidate-token email flow (request-token.js
// + approve.js) off Tines (capped at 3-story/2-flow, see project_poster
// memory). Same Resend API the team-invite flow has been using since W3.
export async function sendEmailViaResend(env, { to, subject, html, from }) {
  if (!env.RESEND_API_KEY) {
    console.error('sendEmailViaResend: RESEND_API_KEY missing — email NOT sent');
    return { ok: false, error: 'RESEND_API_KEY missing' };
  }
  if (!to || !subject || !html) {
    console.error('sendEmailViaResend: missing required field');
    return { ok: false, error: 'missing to/subject/html' };
  }
  const recipients = Array.isArray(to) ? to : [to];
  const sender = from || 'Cyborg <hello@vuelolabs.com>';
  try {
    const r = await fetch('https://api.resend.com/emails', {
      method:  'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type':  'application/json',
      },
      body: JSON.stringify({ from: sender, to: recipients, subject, html }),
    });
    const text = await r.text().catch(() => '');
    if (!r.ok) {
      console.error('sendEmailViaResend: send failed', r.status, text.slice(0, 300));
      return { ok: false, status: r.status, error: text.slice(0, 300) };
    }
    return { ok: true, status: r.status };
  } catch (e) {
    console.error('sendEmailViaResend: fetch threw', e?.message || e);
    return { ok: false, error: String(e?.message || e) };
  }
}

// Strip control characters (except tab/LF/CR), trim, length-cap.
// Promoted from request-token.js on 2026-06-05 so the admin paths
// (issue.js, invite.js) can share the same input-cleansing surface.
// Catches unicode-shape attacks (RTL override, zero-width chars), bell
// characters, anything that would render weirdly in the admin UI or in
// outbound emails. Safe to call on any user-supplied string field.
export function cleanInput(v, max) {
  if (typeof v !== 'string') return '';
  let s = '';
  for (let i = 0; i < v.length; i++) {
    const c = v.charCodeAt(i);
    if (c === 9 || c === 10 || c === 13 || c >= 32) s += v[i];
  }
  return s.trim().slice(0, max);
}

// Liberal RFC-loose email regex. Same expression used in request-token.js
// and issue.js — kept here so invite.js and any future caller can share it.
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function fetchDadJokes(n = 3) {
  // icanhazdadjoke.com — free, no auth, JSON when Accept header is set.
  const jokes = [];
  for (let i = 0; i < n; i++) {
    try {
      const r = await fetch('https://icanhazdadjoke.com/', {
        headers: { 'Accept': 'application/json', 'User-Agent': 'cyborg-worker/1.0 (+https://linguist.vuelolabs.com)' },
        cf: { cacheTtl: 0 },
      });
      if (r.ok) {
        const d = await r.json();
        if (d.joke) jokes.push(d.joke);
      }
    } catch (_) {
      /* keep trying */
    }
  }
  return jokes;
}

export function originFromRequest(request) {
  const u = new URL(request.url);
  return `${u.protocol}//${u.host}`;
}

// ── Abuse-defence helpers — shared by /cyborg/register and /cyborg/request-token.
// Centralised so the rule set doesn't drift between the two public registration
// surfaces.

// Disposable / throwaway-email domain blocklist. Add observed offenders here.
// Lowercase, no leading '@'.
export const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com', 'tempmail.com', 'temp-mail.org', '10minutemail.com',
  'guerrillamail.com', 'guerrillamailblock.com', 'sharklasers.com',
  'getnada.com', 'maildrop.cc', 'yopmail.com', 'trashmail.com',
  'throwawaymail.com', 'mailnesia.com', 'dispostable.com', 'fakeinbox.com',
  'spambox.us', 'mintemail.com', 'mytemp.email', 'mohmal.com',
  'inboxbear.com', 'fakemail.net', 'tmail.io', 'mail-temp.com',
  'tempinbox.com', 'emailondeck.com', 'spam4.me', 'tempmailaddress.com',
]);

// Rate-limit + cap thresholds. Tuned for cohort-1 scale (~5 users); pre-launch
// the daily cap is well above legitimate inflow but well below "real money lost"
// in any abuse scenario.
export const IP_RATE_LIMIT_PER_HOUR = 3;
export const DAILY_CAP_PER_UTC_DAY  = 50;

export function isDisposableEmail(email) {
  const domain = (email || '').split('@')[1]?.toLowerCase() || '';
  return DISPOSABLE_DOMAINS.has(domain);
}

// Returns { ok: true } if the IP is under the per-hour limit, or
// { ok: false, count, limit } if it has hit / exceeded the limit.
// Counts ALL cyborg_token_requests rows from this IP in the last hour, so
// pending/approved/rejected all count toward the limit (an attacker churning
// rejected requests can still flood the inbox).
export async function checkIpRateLimit(supabase, ip) {
  if (!ip) return { ok: true };
  const sinceIso = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count, error } = await supabase
    .from('cyborg_token_requests')
    .select('request_id', { count: 'exact', head: true })
    .eq('ip', ip)
    .gt('created_at', sinceIso);
  if (error) return { ok: true };  // fail-open on lookup error; logged at caller
  if ((count || 0) >= IP_RATE_LIMIT_PER_HOUR) {
    return { ok: false, count, limit: IP_RATE_LIMIT_PER_HOUR };
  }
  return { ok: true };
}

// Returns { ok: true } if today's count is under the global cap, or
// { ok: false, count, limit } if at / over.
export async function checkDailyCap(supabase) {
  const todayStart = new Date();
  todayStart.setUTCHours(0, 0, 0, 0);
  const { count, error } = await supabase
    .from('cyborg_token_requests')
    .select('request_id', { count: 'exact', head: true })
    .gt('created_at', todayStart.toISOString());
  if (error) return { ok: true };
  if ((count || 0) >= DAILY_CAP_PER_UTC_DAY) {
    return { ok: false, count, limit: DAILY_CAP_PER_UTC_DAY };
  }
  return { ok: true };
}

// Returns the most-recent open (pending/approved) request for this email, or
// null if none. Used to make registration idempotent: a candidate re-submitting
// shouldn't queue another approval ping or another row.
export async function findOpenRequestByEmail(supabase, email) {
  const { data, error } = await supabase
    .from('cyborg_token_requests')
    .select('request_id, status, created_at')
    .eq('email', email)
    .in('status', ['pending', 'approved'])
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) return null;
  return data || null;
}

// ── Admin audit log helpers (V5 security) ───────────────────────────────
// Every privileged admin action writes a row to cyborg_admin_audit. The
// table is append-only at the trigger layer — UPDATE/DELETE raise an
// exception even when called via service-role. This is the foundation for
// compliance pitch + post-incident forensics.
//
// Fire-and-forget by default: a failed audit write should never block the
// underlying admin action. Errors logged to console but not surfaced.

export async function writeAuditLog(supabase, args) {
  const row = {
    actor_email: args.actorEmail || '(unknown)',
    action:      args.action,
    target:      args.target || null,
    success:     args.success !== false,
    detail:      args.detail || null,
    ip:          args.ip || null,
    country:     args.country || null,
    user_agent:  args.userAgent ? String(args.userAgent).slice(0, 500) : null,
  };
  try {
    const { error } = await supabase.from('cyborg_admin_audit').insert(row);
    if (error) console.error('audit log insert failed:', error.message, 'action:', args.action);
  } catch (e) {
    console.error('audit log exception:', e?.message || e, 'action:', args.action);
  }
}

// Extract IP / country / user_agent from a request — same pattern used
// across the abuse-defence helpers.
export function requestMeta(request) {
  return {
    ip:        request.headers.get('cf-connecting-ip') || '',
    country:   request.headers.get('cf-ipcountry')     || '',
    userAgent: request.headers.get('user-agent')        || '',
  };
}

// ── Endpoint rate-limit helper (V5 security) ─────────────────────────────
// Per-endpoint sliding-window rate-limit using cyborg_rate_limit_events.
// bucket_key namespacing convention:
//   "<endpoint>:<dimension>:<value>"
//   e.g. "validate:ip:1.2.3.4", "launch:token:cyb_abc..."
//
// Returns { ok: true } if the call is under the limit, or
//         { ok: false, count, limit, retryAfter } if at/over the limit.
//
// Insert is best-effort: a failed insert won't make the rate-limit
// fail-closed (would lock candidates out on a transient DB blip). The
// counter check is the load-bearing operation; insert failure is logged
// but does not propagate.
//
// Race-window note: two concurrent calls can both pass the count check
// before either insert lands. Acceptable at cohort-1 scale — for higher
// throughput, swap for an atomic UPSERT against a per-bucket counter row.
//
// The insert is AWAITED (not fire-and-forget): Cloudflare Pages Functions
// cancel any pending promises once the handler returns, so a fire-and-forget
// insert never reaches the DB. The cost is one extra round-trip per call
// (~50ms typical) — acceptable for cohort-1 traffic and correctness.
export async function checkEndpointRateLimit(supabase, bucketKey, windowSec, maxCount) {
  if (!bucketKey) return { ok: true };
  const sinceIso = new Date(Date.now() - windowSec * 1000).toISOString();
  const { count, error } = await supabase
    .from('cyborg_rate_limit_events')
    .select('id', { count: 'exact', head: true })
    .eq('bucket_key', bucketKey)
    .gt('created_at', sinceIso);
  if (error) {
    console.error('rate-limit lookup error:', error.message);
    return { ok: true };  // fail-open on lookup error
  }
  if ((count || 0) >= maxCount) {
    return { ok: false, count, limit: maxCount, retryAfter: windowSec };
  }
  // Record this call — must be awaited or the CF worker discards the
  // pending promise on response.
  const { error: insertErr } = await supabase
    .from('cyborg_rate_limit_events')
    .insert({ bucket_key: bucketKey });
  if (insertErr) console.error('rate-limit insert error:', insertErr.message);
  return { ok: true };
}

// ── JIT token exchange + session binding (token obfuscation, 2026-06-09) ──
// The candidate-facing launch URL is /c/<jit> — a single-use opaque ticket.
// The real cyb_ token never leaves the server. Claiming binds the row to an
// HttpOnly cyborg_session cookie at "Begin assessment" click time (NOT at
// GET time — email scanners follow GETs and must not consume the ticket).

function base64url(bytes) {
  let s = '';
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// 12 bytes → 16-char base64url (96 bits). URL-facing single-use ticket.
export function generateJitToken() {
  return base64url(crypto.getRandomValues(new Uint8Array(12)));
}

// The pending (unconsumed) jit travels from /c/<jit> to /cyborg/launch/begin
// in its own HttpOnly cookie — never in the URL, so it stays out of history
// and referer headers. Cleared implicitly once consumed (begin.js ignores it
// when the session is already bound).
export function jitCookieHeader(jit) {
  return `cyborg_jit=${jit}; Path=/cyborg/; HttpOnly; Secure; SameSite=Lax; Max-Age=691200`;
}

export function readJitCookie(request) {
  const cookie = request.headers.get('cookie') || '';
  const m = cookie.match(/(?:^|;\s*)cyborg_jit=([A-Za-z0-9_-]+)/);
  return m ? m[1] : null;
}

// ── Candidate authentication (OTP / Supabase session, 2026-06-10) ─────────
// Candidate browser access depends on an authenticated Supabase session
// (bound to the recruiter-invited email), NOT a bare token. Supabase JS keeps
// the session in localStorage, so the candidate page sends it as an explicit
// `Authorization: Bearer <jwt>` header — same pattern as app/_middleware.js.
// Returns { userId, email } on a valid session, or null.
export async function verifyCandidateSession(request, env) {
  const headerAuth = request.headers.get('authorization') || '';
  if (!headerAuth.startsWith('Bearer ')) return null;
  const accessToken = headerAuth.slice(7);
  if (!accessToken || !env.SUPABASE_URL || !env.SUPABASE_PUBLISHABLE_KEY) return null;
  try {
    const r = await fetch(`${env.SUPABASE_URL}/auth/v1/user`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'apikey':        env.SUPABASE_PUBLISHABLE_KEY,
      },
    });
    if (!r.ok) return null;
    const user = await r.json();
    if (!user?.id) return null;
    return { userId: user.id, email: (user.email || '').toLowerCase() };
  } catch {
    return null;
  }
}

// Atomic first-verify-wins claim: bind the row to the authenticated candidate
// user + consume the JIT in one conditional UPDATE. Guarded only on
// (jit_token, candidate_user_id IS NULL) — the email match is verified in JS
// by the caller BEFORE this call. (We deliberately do NOT filter on
// candidate_email here: emails contain '+', which PostgREST decodes to a space
// in a filter value, silently matching 0 rows. The email is immutable on the
// row, so a prior JS check is race-safe.)
// Returns { claimed: row } on win, { claimed: null } otherwise (caller
// re-reads to distinguish idempotent same-user re-entry from a conflict).
export async function claimJitForCandidate(supabase, jitToken, userId, meta) {
  const { data, error } = await supabase
    .from('cyborg_tokens')
    .update({
      candidate_user_id:  userId,
      session_claimed_ip: meta.ip || null,
      session_user_agent: meta.userAgent ? String(meta.userAgent).slice(0, 500) : null,
      jit_consumed_at:    new Date().toISOString(),
    })
    .eq('jit_token', jitToken)
    .is('candidate_user_id', null)
    .select()
    .maybeSingle();
  if (error) {
    console.error('candidate jit claim error:', error.message);
    return { claimed: null, error };
  }
  return { claimed: data || null };
}
