// POST /cyborg/c/request-otp — send the candidate a one-time sign-in link.
//
// Candidate auth (2026-06-10): the candidate proves live control of the
// recruiter-invited inbox before they can launch. We never ask them to type
// their email — the bound address is read from the row via the cyborg_jit
// cookie set by /c/<jit>. We then trigger a Supabase magic-link (OTP) to that
// address with a candidate-specific redirect. This keeps the email out of any
// URL and ensures the OTP can only go to the invited address.
//
// Passwordless, mirrors the teammate flow (cyborg/signin/) but server-side so
// the candidate can't substitute a different email.

import { createClient } from '@supabase/supabase-js';
import {
  requestMeta, writeAuditLog, checkEndpointRateLimit, readJitCookie,
} from '../_lib.js';

const RATE_LIMIT_WINDOW_SEC = 300;
const RATE_LIMIT_MAX_PER_JIT = 5;   // a few resends are fine; not unlimited

export async function onRequestPost({ request, env }) {
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_KEY || !env.SUPABASE_PUBLISHABLE_KEY) {
    return json({ ok: false, reason: 'not_configured' }, 503);
  }

  const jit = readJitCookie(request);
  if (!jit) return json({ ok: false, reason: 'no_jit' }, 400);

  const admin = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);
  const meta = requestMeta(request);

  // Rate-limit per jit (resend abuse / email bombing defence).
  const rl = await checkEndpointRateLimit(
    admin, `request-otp:jit:${jit}`, RATE_LIMIT_WINDOW_SEC, RATE_LIMIT_MAX_PER_JIT,
  );
  if (!rl.ok) {
    return json({ ok: false, reason: 'rate_limited', retry_after: rl.retryAfter }, 429,
      { 'Retry-After': String(rl.retryAfter) });
  }

  // Resolve the bound email from the row. Validate the row is still launchable.
  const { data: row, error } = await admin
    .from('cyborg_tokens')
    .select('candidate_email, expires_at, revoked_at, approved_at')
    .eq('jit_token', jit)
    .maybeSingle();

  if (error)            return json({ ok: false, reason: 'lookup_failed' }, 500);
  if (!row)             return json({ ok: false, reason: 'unknown' }, 410);
  if (row.revoked_at)   return json({ ok: false, reason: 'unavailable' }, 410);
  if (!row.approved_at) return json({ ok: false, reason: 'unavailable' }, 410);
  if (new Date(row.expires_at) < new Date()) return json({ ok: false, reason: 'unavailable' }, 410);
  if (!row.candidate_email) {
    // Hosted launch requires an email on the row. Pre-JIT/email-less rows
    // can't use OTP — they stay on the legacy ?t= path.
    return json({ ok: false, reason: 'no_email_on_record' }, 409);
  }

  // Pre-create the candidate's auth identity (confirmed) BEFORE sending the OTP.
  // Why: Supabase sends DIFFERENT email templates depending on whether the user
  // exists. `signInWithOtp({shouldCreateUser:true})` on a NEW user triggers the
  // default "Confirm signup" template (wrong subject + styling, and its subject
  // doesn't match the orientation copy "Your Cyborg sign-in link"); only an
  // EXISTING user gets the customized "Magic Link" template. Pre-creating the
  // user here makes every candidate — first-timer or returning — receive the
  // clean Magic Link email. Idempotent: a returning candidate / resend just hits
  // "already registered", which we ignore. email_confirm:true makes the link a
  // pure magic-link; the candidate still proves inbox control by clicking it to
  // obtain a session (the OTP only ever goes to the invited address).
  const { error: createErr } = await admin.auth.admin.createUser({
    email: row.candidate_email,
    email_confirm: true,
  });
  if (createErr && !/already|registered|exists/i.test(createErr.message || '')) {
    // Non-duplicate failure — log but don't block; signInWithOtp may still work
    // (and would fall back to shouldCreateUser if the identity truly is absent).
    console.error('candidate pre-create failed (continuing):', createErr.message);
  }

  // Trigger the magic link via the public (anon) client. The user now exists, so
  // Supabase sends the customized "Magic Link" template. shouldCreateUser stays
  // true as a safety net in case the pre-create above failed.
  const origin = new URL(request.url).origin;
  const publicClient = createClient(env.SUPABASE_URL, env.SUPABASE_PUBLISHABLE_KEY);
  const { error: otpErr } = await publicClient.auth.signInWithOtp({
    email: row.candidate_email,
    options: {
      shouldCreateUser: true,
      emailRedirectTo: `${origin}/cyborg/c/callback/`,
    },
  });

  if (otpErr) {
    console.error('candidate OTP send failed:', otpErr.message);
    await writeAuditLog(admin, {
      actorEmail: '(public)', action: 'candidate_otp_failed',
      target: jit.slice(0, 6), success: false,
      detail: { error: otpErr.message }, ...meta,
    });
    return json({ ok: false, reason: 'otp_send_failed' }, 502);
  }

  await writeAuditLog(admin, {
    actorEmail: row.candidate_email, action: 'candidate_otp_sent',
    target: jit.slice(0, 6), success: true, ...meta,
  });

  // Echo a masked address so the page can say "sent to a••@example.com".
  return json({ ok: true, email_hint: maskEmail(row.candidate_email) });
}

function maskEmail(email) {
  const [user, domain] = String(email).split('@');
  if (!domain) return 'your email';
  const head = user.length <= 2 ? user[0] || '' : user.slice(0, 2);
  return `${head}${'•'.repeat(Math.max(1, user.length - 2))}@${domain}`;
}

function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...extraHeaders },
  });
}
