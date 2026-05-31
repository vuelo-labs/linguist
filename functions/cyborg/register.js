// POST /cyborg/register — public registration request, **manual approval required**.
//
// 2026-05-31 hardened: previously self-serve auto-mint. Switched to manual-
// approval flow after the cost-amplification surface was reviewed — a single
// auto-minted token can spin a Fly machine + trigger a scoring run before any
// human eyes the request. Manual approval means owner sees every request
// before any compute/LLM cost is incurred.
//
// Defense layers (in order):
//   1. Turnstile gate (Cloudflare siteverify, server-enforced)
//   2. Honeypot field — bots that fill the hidden 'website' input are silently dropped
//   3. Disposable-email blocklist — known throwaway domains rejected
//   4. Per-IP rate limit — max 3 submissions per IP per hour
//   5. Global daily cap — max 50 new requests across all IPs per UTC day
//   6. Manual approval — request lands in cyborg_token_requests with status='pending';
//      owner clicks approve in Tines email; token only minted on approval click
//
// Cost surface after all gates: $0 until owner approves. Each approved candidate
// is ~$0.23 all-in.

import { createClient } from '@supabase/supabase-js';
import { hmacHex, jsonResponse, originFromRequest } from './_lib.js';

const MAX_NAME    = 200;
const MAX_EMAIL   = 320;
const MAX_NOTES   = 2000;
const MAX_BODY_KB = 8;

// Defense parameters
const IP_RATE_LIMIT_PER_HOUR = 3;
const DAILY_CAP_PER_UTC_DAY  = 50;

// Disposable-email domains — a small starter list. Add more as observed.
const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com', 'tempmail.com', 'temp-mail.org', '10minutemail.com',
  'guerrillamail.com', 'guerrillamailblock.com', 'sharklasers.com',
  'getnada.com', 'maildrop.cc', 'yopmail.com', 'trashmail.com',
  'throwawaymail.com', 'mailnesia.com', 'dispostable.com', 'fakeinbox.com',
  'spambox.us', 'mintemail.com', 'mytemp.email', 'mohmal.com',
]);

export async function onRequestPost({ request, env }) {
  if (!env.TINES_REQUEST_WEBHOOK) return jsonResponse({ ok: false, reason: 'not_configured' }, 503);
  if (!env.TURNSTILE_SECRET)      return jsonResponse({ ok: false, reason: 'not_configured' }, 503);
  if (!env.ADMIN_SECRET)          return jsonResponse({ ok: false, reason: 'not_configured' }, 503);

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

  if (hp)              return jsonResponse({ ok: true });   // silent drop bots
  if (!name || !email) return jsonResponse({ ok: false, reason: 'missing_fields' }, 400);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return jsonResponse({ ok: false, reason: 'bad_email' }, 400);

  // ── Layer 3: disposable-email blocklist ────────────────────────────────
  const emailDomain = email.split('@')[1]?.toLowerCase() || '';
  if (DISPOSABLE_DOMAINS.has(emailDomain)) {
    return jsonResponse({ ok: false, reason: 'disposable_email' }, 403);
  }

  const ip      = request.headers.get('cf-connecting-ip') || '';
  const country = request.headers.get('cf-ipcountry')     || '';
  const ua      = (request.headers.get('user-agent')      || '').slice(0, 300);

  // ── Layer 1: Turnstile verification ────────────────────────────────────
  const turnstileToken = (body.turnstileToken || '').toString();
  if (!turnstileToken) return jsonResponse({ ok: false, reason: 'missing_turnstile' }, 400);

  const tsForm = new FormData();
  tsForm.append('secret',   env.TURNSTILE_SECRET);
  tsForm.append('response', turnstileToken);
  if (ip) tsForm.append('remoteip', ip);

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
  const nowIso   = new Date().toISOString();

  // ── Layer 4: per-IP rate limit (3 / hour) ──────────────────────────────
  // Counts ALL requests (pending/approved/rejected) from this IP in the last hour.
  if (ip) {
    const sinceIso = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count: ipRecentCount, error: ipErr } = await supabase
      .from('cyborg_token_requests')
      .select('request_id', { count: 'exact', head: true })
      .eq('ip', ip)
      .gt('created_at', sinceIso);
    if (!ipErr && (ipRecentCount || 0) >= IP_RATE_LIMIT_PER_HOUR) {
      console.warn(`rate-limit: ip=${ip} count=${ipRecentCount}`);
      return jsonResponse({ ok: false, reason: 'rate_limited' }, 429);
    }
  }

  // ── Layer 5: global daily cap (50 / UTC day) ───────────────────────────
  const todayStart = new Date();
  todayStart.setUTCHours(0, 0, 0, 0);
  const { count: dailyCount, error: dailyErr } = await supabase
    .from('cyborg_token_requests')
    .select('request_id', { count: 'exact', head: true })
    .gt('created_at', todayStart.toISOString());
  if (!dailyErr && (dailyCount || 0) >= DAILY_CAP_PER_UTC_DAY) {
    console.warn(`daily-cap: count=${dailyCount}`);
    return jsonResponse({ ok: false, reason: 'daily_cap_reached' }, 503);
  }

  // ── Per-email idempotency: same email re-submitting gets a friendly response
  // without creating a duplicate pending row. Open requests + open tokens both
  // count — re-registers don't queue new approvals.
  const { data: existingPending } = await supabase
    .from('cyborg_token_requests')
    .select('request_id, status, created_at')
    .eq('email', email)
    .in('status', ['pending', 'approved'])
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (existingPending) {
    return jsonResponse({ ok: true, status: existingPending.status, message: 'existing_request' });
  }

  // ── Layer 6: insert as PENDING. No token minted until owner approves. ─
  const { data: inserted, error: insertErr } = await supabase
    .from('cyborg_token_requests')
    .insert({ name, email, notes, ip, country, user_agent: ua, status: 'pending' })
    .select('request_id, created_at')
    .single();

  if (insertErr || !inserted) {
    console.error('insert request failed:', insertErr?.message);
    return jsonResponse({ ok: false, reason: 'db_error' }, 500);
  }

  const requestId  = inserted.request_id;
  const origin     = originFromRequest(request);
  const approveSig = await hmacHex(env.ADMIN_SECRET, `${requestId}:approve`);
  const rejectSig  = await hmacHex(env.ADMIN_SECRET, `${requestId}:reject`);
  const approveUrl = `${origin}/cyborg/approve?req=${requestId}&decision=approve&sig=${approveSig}`;
  const rejectUrl  = `${origin}/cyborg/approve?req=${requestId}&decision=reject&sig=${rejectSig}`;

  // Tines webhook — reuses the existing 'cyborg_token_request' event type
  // that powers the owner-notification email with approve/reject links.
  try {
    const r = await fetch(env.TINES_REQUEST_WEBHOOK, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({
        type:         'cyborg_token_request',
        event_type:   'cyborg_token_request',
        request_id:   requestId,
        submitted_at: inserted.created_at,
        name, email, notes,
        request_meta: { ip, country, user_agent: ua, source: 'self_register' },
        approve_url:  approveUrl,
        reject_url:   rejectUrl,
      }),
    });
    if (!r.ok) {
      console.error('Tines webhook returned', r.status);
      return jsonResponse({ ok: false, reason: 'forward_failed' }, 502);
    }
  } catch (e) {
    console.error('Tines webhook error', e);
    return jsonResponse({ ok: false, reason: 'forward_error' }, 502);
  }

  return jsonResponse({ ok: true, status: 'pending', message: 'awaiting_approval' });
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
