// Auth middleware for /cyborg/app/* paths.
//
// Only guards API endpoints (/cyborg/app/api/*). HTML pages are passed
// through — each page calls supabase.auth.getSession() on load and
// redirects to /cyborg/signin/ client-side if there's no session. We
// can't reliably do server-side auth for HTML page loads because
// Supabase JS stores the session in localStorage (not cookies), so a
// full-page navigation carries no auth state to the server.
//
// API endpoints work fine server-side because they're called via fetch
// with an explicit `Authorization: Bearer <jwt>` header from the app
// pages. The middleware verifies that token with Supabase Auth and
// passes the user id/email downstream via X-Cyborg-User-* request
// headers.

export async function onRequest({ request, next, env }) {
  const url = new URL(request.url);

  // Allow /cyborg/auth/callback/ + /cyborg/auth/bootstrap to bypass.
  if (url.pathname.startsWith('/cyborg/auth/')) return next();

  // HTML pages do client-side auth checks; pass through.
  const isApi = url.pathname.startsWith('/cyborg/app/api/');
  if (!isApi) return next();

  const unauth = (msg) =>
    new Response(JSON.stringify({ ok: false, reason: msg }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });

  // API paths require Authorization: Bearer <jwt> header.
  const headerAuth = request.headers.get('authorization') || '';
  let accessToken = '';
  if (headerAuth.startsWith('Bearer ')) {
    accessToken = headerAuth.slice(7);
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
  const augmented = new Request(request);
  augmented.headers.set('X-Cyborg-User-Id', user.id);
  augmented.headers.set('X-Cyborg-User-Email', user.email || '');
  return next(augmented);
}
