// POST /cyborg/register — self-serve registration + auto-mint.
//
// Different from /cyborg/request-token: no manual approval step. The candidate
// fills the form, the token is minted immediately, and the existing Tines
// flow (event_type: 'cyborg_approval') emails them the launch link.
//
// Why this is reasonable abuse-safety-wise:
//   • Turnstile gate (same as request-token.js)
//   • Honeypot field (same as request-token.js)
//   • Cost-cap: each token spins one shared-2x Fly machine that auto-stops
//     on submit; abandoned machines cost ~$0.40/day until 7-day expiry
//   • Per-email throttle: one active (unused, non-revoked, non-expired) token
//     per email at a time — re-registers reuse the existing token

import { createClient } from '@supabase/supabase-js';
import { generateToken, jsonResponse, originFromRequest } from './_lib.js';

const MAX_NAME    = 200;
const MAX_EMAIL   = 320;
const MAX_NOTES   = 2000;
const MAX_BODY_KB = 8;
const TOKEN_DAYS  = 8;          // 7-day window + 1-day grace

export async function onRequestPost({ request, env }) {
  if (!env.TINES_REQUEST_WEBHOOK) return jsonResponse({ ok: false, reason: 'not_configured' }, 503);
  if (!env.TURNSTILE_SECRET)      return jsonResponse({ ok: false, reason: 'not_configured' }, 503);

  const ctype = request.headers.get('content-type') || '';
  if (!ctype.includes('application/json')) return jsonResponse({ ok: false, reason: 'bad_content_type' }, 415);

  const raw = await request.text();
  if (raw.length > MAX_BODY_KB * 1024) return jsonResponse({ ok: false, reason: 'too_large' }, 413);

  let body;
  try { body = JSON.parse(raw); } catch { return jsonResponse({ ok: false, reason: 'bad_json' }, 400); }

  const name  = clean(body.name,  MAX_NAME);
  const email = clean(body.email, MAX_EMAIL);
  const notes = clean(body.notes, MAX_NOTES);
  const hp    = (body.website || '').toString();           // honeypot

  if (hp)              return jsonResponse({ ok: true });   // silent drop
  if (!name || !email) return jsonResponse({ ok: false, reason: 'missing_fields' }, 400);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return jsonResponse({ ok: false, reason: 'bad_email' }, 400);

  // ── Turnstile verification ──────────────────────────────────────────────
  const turnstileToken = (body.turnstileToken || '').toString();
  if (!turnstileToken) return jsonResponse({ ok: false, reason: 'missing_turnstile' }, 400);

  const tsIp = request.headers.get('cf-connecting-ip') || '';
  const tsForm = new FormData();
  tsForm.append('secret',   env.TURNSTILE_SECRET);
  tsForm.append('response', turnstileToken);
  if (tsIp) tsForm.append('remoteip', tsIp);

  try {
    const tsRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST', body: tsForm,
    });
    const tsData = await tsRes.json();
    if (!tsData.success) {
      console.error('turnstile failed:', tsData['error-codes']);
      return jsonResponse({ ok: false, reason: 'turnstile_failed' }, 403);
    }
  } catch (e) {
    console.error('turnstile verify error:', e);
    return jsonResponse({ ok: false, reason: 'turnstile_failed' }, 502);
  }

  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);
  const origin   = originFromRequest(request);
  const nowIso   = new Date().toISOString();

  // ── Per-email throttle: re-registration with the same email returns the
  // existing active token (silent idempotency). Avoids one candidate burning
  // many machines if they re-submit the form.
  const { data: existing } = await supabase
    .from('cyborg_tokens')
    .select('token, expires_at, candidate_label')
    .ilike('candidate_label', `%${email}%`)
    .is('used_at', null)
    .is('revoked_at', null)
    .not('approved_at', 'is', null)
    .gt('expires_at', nowIso)
    .order('issued_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  let token, expiresAt;
  if (existing) {
    token     = existing.token;
    expiresAt = existing.expires_at;
  } else {
    token     = generateToken();
    expiresAt = new Date(Date.now() + TOKEN_DAYS * 86400000).toISOString();

    const { error: insertErr } = await supabase.from('cyborg_tokens').insert({
      token,
      candidate_label: `${name} (${email})`,
      expires_at:      expiresAt,
      approved_at:     nowIso,                  // self-approve at mint time
      notes:           notes || null,
    });
    if (insertErr) {
      console.error('mint failed:', insertErr.message);
      return jsonResponse({ ok: false, reason: 'mint_failed' }, 500);
    }
  }

  const installUrl = `${origin}/cyborg/?t=${encodeURIComponent(token)}`;

  // ── Tines webhook — same `cyborg_approval` event the existing approve-flow
  // emits, so the candidate email goes out via the already-wired Tines story.
  // (event_type reused intentionally; payload shape matches approve.js.)
  try {
    const r = await fetch(env.TINES_REQUEST_WEBHOOK, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({
        event_type:   'cyborg_approval',
        request_id:   null,
        name,
        email,
        token,
        expires_at:   expiresAt,
        install_url:  installUrl,
        install_cmd:  `curl -fsSL https://raw.githubusercontent.com/vuelo-labs/cyborg_versions/main/install.sh | bash -s ${token}`,
        source:       'self_register',
      }),
    });
    if (!r.ok) {
      console.error('Tines forward returned', r.status);
      // Don't fail the user-facing request — the token exists in Supabase,
      // owner can manually resend the email from there.
    }
  } catch (e) {
    console.error('Tines forward error', e);
  }

  // Light owner-side audit ping (best-effort, separate event so it doesn't
  // collide with the candidate-email Tines route).
  try {
    await fetch(env.TINES_REQUEST_WEBHOOK, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({
        event_type:    'cyborg_self_register_audit',
        name, email, notes,
        request_meta:  {
          ip:         request.headers.get('cf-connecting-ip')  || '',
          country:    request.headers.get('cf-ipcountry')      || '',
          user_agent: (request.headers.get('user-agent')       || '').slice(0, 300),
        },
        token,
        is_re_register: !!existing,
      }),
    });
  } catch (_) { /* audit-only; ignore */ }

  return jsonResponse({ ok: true, email });
}

function clean(v, max) {
  if (typeof v !== 'string') return '';
  let s = '';
  for (let i = 0; i < v.length; i++) {
    const c = v.charCodeAt(i);
    if (c === 9 || c === 10 || c === 13 || c >= 32) s += v[i];
  }
  return s.trim().slice(0, max);
}
