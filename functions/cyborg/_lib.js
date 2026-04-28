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
