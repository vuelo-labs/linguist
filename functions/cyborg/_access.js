// Verify a Cloudflare Access JWT (cf-access-jwt-assertion header).
// Returns { ok: true, email, sub } on success, { ok: false, reason } otherwise.

let JWKS_CACHE = { keys: null, fetchedAt: 0 };
const JWKS_TTL_MS = 5 * 60 * 1000;

async function getJwks(teamDomain) {
  const now = Date.now();
  if (JWKS_CACHE.keys && now - JWKS_CACHE.fetchedAt < JWKS_TTL_MS) return JWKS_CACHE.keys;
  const r = await fetch(`https://${teamDomain}/cdn-cgi/access/certs`);
  if (!r.ok) throw new Error('jwks_fetch_failed');
  const data = await r.json();
  JWKS_CACHE = { keys: data.keys, fetchedAt: now };
  return data.keys;
}

function b64urlToBytes(s) {
  s = s.replace(/-/g, '+').replace(/_/g, '/');
  const pad = s.length % 4;
  if (pad) s += '='.repeat(4 - pad);
  const bin = atob(s);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

function b64urlToString(s) {
  return new TextDecoder().decode(b64urlToBytes(s));
}

export async function verifyAccessJwt(request, env) {
  if (!env.CF_ACCESS_TEAM_DOMAIN || !env.CF_ACCESS_AUD) {
    return { ok: false, reason: 'not_configured' };
  }
  const token = request.headers.get('cf-access-jwt-assertion');
  if (!token) return { ok: false, reason: 'missing_jwt' };

  const parts = token.split('.');
  if (parts.length !== 3) return { ok: false, reason: 'malformed_jwt' };
  const [headerB64, payloadB64, sigB64] = parts;

  let header, payload;
  try {
    header  = JSON.parse(b64urlToString(headerB64));
    payload = JSON.parse(b64urlToString(payloadB64));
  } catch { return { ok: false, reason: 'parse_failed' }; }

  if (header.alg !== 'RS256') return { ok: false, reason: 'bad_alg' };

  const keys = await getJwks(env.CF_ACCESS_TEAM_DOMAIN);
  const jwk = keys.find(k => k.kid === header.kid);
  if (!jwk) return { ok: false, reason: 'unknown_kid' };

  const cryptoKey = await crypto.subtle.importKey(
    'jwk', jwk, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']
  );
  const data = new TextEncoder().encode(`${headerB64}.${payloadB64}`);
  const valid = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', cryptoKey, b64urlToBytes(sigB64), data);
  if (!valid) return { ok: false, reason: 'bad_signature' };

  const now = Math.floor(Date.now() / 1000);
  if (payload.exp && payload.exp < now) return { ok: false, reason: 'expired' };
  if (payload.nbf && payload.nbf > now) return { ok: false, reason: 'not_yet_valid' };

  const auds = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
  if (!auds.includes(env.CF_ACCESS_AUD)) return { ok: false, reason: 'bad_audience' };

  const expectedIss = `https://${env.CF_ACCESS_TEAM_DOMAIN}`;
  if (payload.iss !== expectedIss) return { ok: false, reason: 'bad_issuer' };

  return { ok: true, email: payload.email, sub: payload.sub };
}
