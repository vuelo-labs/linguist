// POST /cyborg/request-token — public form endpoint.
// Records the request in Supabase, mints HMAC-signed approve/reject URLs,
// and forwards the package to the Tines webhook (env.TINES_REQUEST_WEBHOOK).
// The token itself is NOT minted yet — that happens at approval time.
//
// 2026-05-31 hardened: same defence layers as /cyborg/register —
// disposable-email blocklist, per-IP rate limit, daily cap, per-email
// idempotency. Defends against inbox-flood from automated form submissions.

import { createClient } from '@supabase/supabase-js';
import {
  hmacHex, jsonResponse, originFromRequest,
  isDisposableEmail, checkIpRateLimit, checkDailyCap, findOpenRequestByEmail,
  sendEmailViaResend, cleanInput,
} from './_lib.js';

const MAX_NAME    = 200;
const MAX_EMAIL   = 320;
const MAX_NOTES   = 2000;
const MAX_BODY_KB = 8;

export async function onRequestPost({ request, env }) {
  // 2026-06-05: ported from Tines (capped at free-tier 3-story/2-flow) to
  // Resend (already in use for team invites). ADMIN_EMAIL is who gets the
  // approval notification — defaults to Liam's work address but should be
  // set explicitly per deployment via wrangler.
  if (!env.RESEND_API_KEY) return jsonResponse({ ok: false, reason: 'not_configured' }, 503);
  if (!env.ADMIN_SECRET)   return jsonResponse({ ok: false, reason: 'not_configured' }, 503);
  const adminEmail = env.ADMIN_EMAIL || 'liam@vuelolabs.com';

  const ctype = request.headers.get('content-type') || '';
  if (!ctype.includes('application/json')) return jsonResponse({ ok: false, reason: 'bad_content_type' }, 415);

  const raw = await request.text();
  if (raw.length > MAX_BODY_KB * 1024) return jsonResponse({ ok: false, reason: 'too_large' }, 413);

  let body;
  try { body = JSON.parse(raw); } catch { return jsonResponse({ ok: false, reason: 'bad_json' }, 400); }

  const name  = cleanInput(body.name,  MAX_NAME);
  const email = cleanInput(body.email, MAX_EMAIL);
  const notes = cleanInput(body.notes, MAX_NOTES);
  const hp    = (body.website || '').toString();   // honeypot

  if (hp)              return jsonResponse({ ok: true });   // pretend success, drop silently
  if (!name || !email) return jsonResponse({ ok: false, reason: 'missing_fields' }, 400);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return jsonResponse({ ok: false, reason: 'bad_email' }, 400);

  // ── Disposable-email blocklist ─────────────────────────────────────────
  if (isDisposableEmail(email)) {
    return jsonResponse({ ok: false, reason: 'disposable_email' }, 403);
  }

  // ── Turnstile verification ──────────────────────────────────────────────
  const turnstileToken = (body.turnstileToken || '').toString();
  if (!turnstileToken) return jsonResponse({ ok: false, reason: 'missing_turnstile' }, 400);
  if (!env.TURNSTILE_SECRET) return jsonResponse({ ok: false, reason: 'not_configured' }, 503);

  const tsIp = request.headers.get('cf-connecting-ip') || '';
  const tsForm = new FormData();
  tsForm.append('secret',   env.TURNSTILE_SECRET);
  tsForm.append('response', turnstileToken);
  if (tsIp) tsForm.append('remoteip', tsIp);

  try {
    const tsRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body:   tsForm,
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

  const ip      = request.headers.get('cf-connecting-ip') || '';
  const country = request.headers.get('cf-ipcountry')     || '';
  const ua      = (request.headers.get('user-agent')      || '').slice(0, 300);

  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);

  // ── Per-IP rate limit (3 / hour) + global daily cap (50 / UTC day) ────
  const ipCheck = await checkIpRateLimit(supabase, ip);
  if (!ipCheck.ok) {
    console.warn(`rate-limit: ip=${ip} count=${ipCheck.count}`);
    return jsonResponse({ ok: false, reason: 'rate_limited' }, 429);
  }
  const dailyCheck = await checkDailyCap(supabase);
  if (!dailyCheck.ok) {
    console.warn(`daily-cap: count=${dailyCheck.count}`);
    return jsonResponse({ ok: false, reason: 'daily_cap_reached' }, 503);
  }

  // ── Per-email idempotency: existing pending/approved → silent reuse ────
  const existing = await findOpenRequestByEmail(supabase, email);
  if (existing) {
    return jsonResponse({ ok: true, status: existing.status, message: 'existing_request' });
  }

  const { data, error } = await supabase
    .from('cyborg_token_requests')
    .insert({ name, email, notes, ip, country, user_agent: ua, status: 'pending' })
    .select('request_id, created_at')
    .single();

  if (error || !data) {
    console.error('insert request failed:', error?.message);
    return jsonResponse({ ok: false, reason: 'db_error' }, 500);
  }

  const requestId = data.request_id;
  const origin    = originFromRequest(request);

  const approveSig = await hmacHex(env.ADMIN_SECRET, `${requestId}:approve`);
  const rejectSig  = await hmacHex(env.ADMIN_SECRET, `${requestId}:reject`);
  const approveUrl = `${origin}/cyborg/approve?req=${requestId}&decision=approve&sig=${approveSig}`;
  const rejectUrl  = `${origin}/cyborg/approve?req=${requestId}&decision=reject&sig=${rejectSig}`;

  // Admin notification email — Liam clicks approve/reject in this email.
  const esc = s => String(s).replace(/[&<>"']/g, c => (
    { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]
  ));
  const adminHtml = `
<!DOCTYPE html>
<html><body style="font-family:-apple-system,'Inter',sans-serif; background:#FAF8F4; color:#2A2420; margin:0; padding:32px;">
  <div style="max-width:560px; margin:0 auto; background:#F2EDE6; border:1px solid #E5DFD6; border-radius:14px; padding:32px;">
    <h1 style="font-family:'Newsreader',Georgia,serif; font-size:1.4rem; font-weight:500; margin:0 0 12px; color:#6B5540;">New Cyborg token request</h1>
    <p style="line-height:1.55; color:#5E5450; margin:0 0 8px;"><strong>${esc(name)}</strong> &lt;${esc(email)}&gt;</p>
    ${notes ? `<p style="line-height:1.55; color:#5E5450; margin:0 0 14px; padding:12px 14px; background:rgba(255,255,255,0.5); border-radius:8px; font-size:0.92rem;">${esc(notes).replace(/\n/g, '<br>')}</p>` : ''}
    <p style="line-height:1.55; color:#8A7D77; font-size:0.85rem; margin:0 0 20px;">From ${esc(country || '?')} &middot; ${esc(ip || 'ip?')} &middot; request <code>${esc(requestId.slice(0, 8))}</code></p>
    <p style="margin:24px 0;">
      <a href="${esc(approveUrl)}" style="display:inline-block; background:#6B5540; color:#FAF8F4; text-decoration:none; padding:11px 22px; border-radius:9px; font-weight:500; margin-right:8px;">Approve</a>
      <a href="${esc(rejectUrl)}" style="display:inline-block; background:transparent; color:#6B5540; text-decoration:none; padding:10px 21px; border-radius:9px; font-weight:500; border:1px solid #6B5540;">Reject</a>
    </p>
    <p style="line-height:1.55; color:#8A7D77; font-size:0.82rem; margin:24px 0 0;">One-shot links — first click wins.</p>
  </div>
</body></html>`;
  const sendRes = await sendEmailViaResend(env, {
    to:      adminEmail,
    subject: `Cyborg token request: ${name} <${email}>`,
    html:    adminHtml,
    from:    'Cyborg Approvals <hello@vuelolabs.com>',
  });
  if (!sendRes.ok) {
    return jsonResponse({ ok: false, reason: 'forward_failed', detail: sendRes.error }, 502);
  }

  return jsonResponse({ ok: true });
}

// Local clean() removed 2026-06-05 — promoted to cleanInput() in _lib.js so
// the admin paths (issue.js, invite.js) share the same surface.
