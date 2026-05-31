// Auth middleware for /cyborg/app/* paths.
//
// Verifies the Supabase Auth session (read from the sb-* cookie family) and
// either passes through to the underlying static page / function, or
// redirects to /cyborg/signin/?next=<requested-path>.
//
// Implementation notes:
//   • Supabase JS persists the session as a JSON cookie named
//     `sb-<projectref>-auth-token` (split into `.0` / `.1` for large tokens).
//     We extract + assemble it, then call /auth/v1/user with the access token
//     to verify it's still valid. One network round-trip per request.
//   • Session lookups go to the Supabase Auth REST API directly — no
//     supabase-js client construction needed in the middleware. Lighter
//     and faster.
//   • If the cookie is missing or the token's expired, redirect to signin.

const PROJECT_REF = 'odnzrykfmfgdfybnmcfd';
const AUTH_COOKIE_BASE = `sb-${PROJECT_REF}-auth-token`;

export async function onRequest({ request, next, env }) {
  const url = new URL(request.url);

  // Allow /cyborg/auth/callback/ + /cyborg/auth/bootstrap to bypass.
  if (url.pathname.startsWith('/cyborg/auth/')) return next();

  // API paths return JSON 401; HTML paths get a 302 redirect to signin.
  const isApi = url.pathname.startsWith('/cyborg/app/api/');
  const unauth = (msg) => isApi
    ? new Response(JSON.stringify({ ok: false, reason: msg }), { status: 401, headers: { 'Content-Type': 'application/json' } })
    : redirectToSignin(url);

  // Two auth pathways: Authorization: Bearer <jwt> header (typical for
  // fetch() from the app) OR sb-* cookies (typical for HTML page nav).
  const headerAuth = request.headers.get('authorization') || '';
  let accessToken = '';
  if (headerAuth.startsWith('Bearer ')) {
    accessToken = headerAuth.slice(7);
  } else {
    const cookieHeader = request.headers.get('cookie') || '';
    const sessionJson  = cookieHeader ? extractSessionCookie(cookieHeader) : null;
    if (sessionJson) {
      try { accessToken = JSON.parse(sessionJson).access_token || ''; } catch { /* fall through */ }
    }
  }

  if (!accessToken) return unauth('no_session');

  // Verify the token with the Auth API. Cheap; ~50ms.
  let user;
  try {
    const r = await fetch(`${env.SUPABASE_URL}/auth/v1/user`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'apikey':        'sb_publishable_Czk4cQMbG_EcQdYgf23fZQ_Og6uDUyo',
      },
    });
    if (!r.ok) return unauth('invalid_token');
    user = await r.json();
  } catch {
    return unauth('verify_failed');
  }

  if (!user?.id) return unauth('no_user');

  // Pass the verified user info to downstream functions via request headers.
  // Static pages don't see these (they re-fetch in the browser), but our
  // org/candidate API endpoints can trust them without re-verifying.
  const augmented = new Request(request);
  augmented.headers.set('X-Cyborg-User-Id', user.id);
  augmented.headers.set('X-Cyborg-User-Email', user.email || '');
  return next(augmented);
}

function extractSessionCookie(cookieHeader) {
  // Supabase JS may split the cookie across .0 / .1 for large tokens.
  // Concatenate in order if both exist; otherwise return the single value.
  const cookies = parseCookies(cookieHeader);
  if (cookies[AUTH_COOKIE_BASE]) {
    return decodeURIComponent(cookies[AUTH_COOKIE_BASE]);
  }
  const parts = [];
  let i = 0;
  while (cookies[`${AUTH_COOKIE_BASE}.${i}`] !== undefined) {
    parts.push(cookies[`${AUTH_COOKIE_BASE}.${i}`]);
    i++;
  }
  if (parts.length) return decodeURIComponent(parts.join(''));
  return null;
}

function parseCookies(header) {
  const out = {};
  for (const part of header.split(';')) {
    const eq = part.indexOf('=');
    if (eq < 0) continue;
    const key = part.slice(0, eq).trim();
    const val = part.slice(eq + 1).trim();
    if (key) out[key] = val;
  }
  return out;
}

function redirectToSignin(url) {
  const next = encodeURIComponent(url.pathname + url.search);
  return Response.redirect(`${url.origin}/cyborg/signin/?next=${next}`, 302);
}
