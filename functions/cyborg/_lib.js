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

export function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
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
