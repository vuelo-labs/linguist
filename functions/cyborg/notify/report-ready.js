// POST /cyborg/notify/report-ready — owner/recruiter notification when a
// candidate's report has been scored.
//
// Called by the Supabase trigger `on_report_ready_notify` (fires on a
// public.reports UPDATE when status→'ready'), which POSTs `{ report_id }` with
// header `X-Cyborg-Secret` = the vault NOTIFY_SHARED_SECRET. This route is
// OUTSIDE /cyborg/app/api/* so the app `_middleware` does NOT guard it — auth is
// the shared-secret header check below (the caller is the DB, not a browser).
//
// It emails the org's team (admins/teammates + the token's issuer) a "report is
// ready — review it" notification with a link to the teammate reports page. No
// candidate-facing email is sent (locked product decision, 2026-06-10). The
// candidate-tier report stays an internal artefact unless explicitly sent.
//
// Idempotent: skips when reports.email_sent_at is already set (set only AFTER a
// successful Resend send, so a transient failure can be retried by a re-fire).

import { createClient } from '@supabase/supabase-js';
import { sendEmailViaResend, writeAuditLog, requestMeta, timingSafeEqual } from '../_lib.js';

export async function onRequestPost({ request, env }) {
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_KEY || !env.NOTIFY_SHARED_SECRET || !env.RESEND_API_KEY) {
    console.error('report-ready not_configured (missing SUPABASE/NOTIFY_SHARED_SECRET/RESEND env)');
    return json({ ok: false, reason: 'not_configured' }, 503);
  }

  // Shared-secret auth (constant-time). A mismatch here is the most likely
  // misconfig (vault NOTIFY_SHARED_SECRET vs CF Pages secret) — log it loudly.
  const presented = request.headers.get('x-cyborg-secret') || '';
  if (!timingSafeEqual(presented, env.NOTIFY_SHARED_SECRET)) {
    console.error('report-ready 401: bad or missing X-Cyborg-Secret');
    return json({ ok: false, reason: 'unauthorized' }, 401);
  }

  let body;
  try { body = await request.json(); } catch { return json({ ok: false, reason: 'bad_json' }, 400); }
  const reportId = body.report_id;
  if (reportId == null) return json({ ok: false, reason: 'missing_report_id' }, 400);

  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);
  const meta = requestMeta(request);

  // ── Load report + idempotency ─────────────────────────────────────────
  const { data: report } = await supabase
    .from('reports')
    .select('id, candidate_token, status, email_sent_at, submission_id')
    .eq('id', reportId)
    .maybeSingle();
  if (!report) return json({ ok: false, reason: 'report_not_found' }, 404);
  if (report.email_sent_at) return json({ ok: true, skipped: 'already_sent' });
  if (report.status !== 'ready') return json({ ok: true, skipped: 'not_ready', status: report.status });

  // ── Resolve org context from the token row ────────────────────────────
  const { data: tok } = await supabase
    .from('cyborg_tokens')
    .select('organisation_id, candidate_label, campaign_id, issued_by_user_id')
    .eq('token', report.candidate_token)
    .maybeSingle();
  if (!tok || !tok.organisation_id) {
    // Legacy / admin-minted token with no org → nobody to notify. Mark sent so
    // the trigger doesn't keep re-firing on every reports touch.
    await supabase.from('reports').update({ email_sent_at: new Date().toISOString() }).eq('id', report.id);
    return json({ ok: true, skipped: 'no_org' });
  }

  // ── Recipients: org admins/teammates + the issuer ─────────────────────
  // organisation_members has no email column → resolve via the admin API
  // per-user (small N; avoids listUsers pagination).
  const { data: members } = await supabase
    .from('organisation_members')
    .select('user_id, role')
    .eq('organisation_id', tok.organisation_id)
    .in('role', ['owner', 'admin', 'teammate']);
  const userIds = new Set((members || []).map(m => m.user_id));
  if (tok.issued_by_user_id) userIds.add(tok.issued_by_user_id);

  const emails = new Set();
  for (const uid of userIds) {
    try {
      const { data } = await supabase.auth.admin.getUserById(uid);
      const e = data?.user?.email;
      if (e) emails.add(String(e).toLowerCase());
    } catch (_) { /* skip a user we can't resolve */ }
  }
  const recipients = [...emails];
  if (!recipients.length) {
    await supabase.from('reports').update({ email_sent_at: new Date().toISOString() }).eq('id', report.id);
    return json({ ok: true, skipped: 'no_recipients' });
  }

  // ── Campaign name (optional) ──────────────────────────────────────────
  let campaignName = '';
  if (tok.campaign_id) {
    const { data: c } = await supabase.from('campaigns').select('name').eq('id', tok.campaign_id).maybeSingle();
    campaignName = c?.name || '';
  }

  // ── Email ─────────────────────────────────────────────────────────────
  const origin = new URL(request.url).origin;
  const reviewUrl = `${origin}/cyborg/app/reports/`;
  const who = tok.candidate_label || 'a candidate';   // never the raw cyb_ token
  const inWhere = campaignName ? ` in ${campaignName}` : '';
  const subject = `A Cyborg report is ready for ${who}${inWhere}`;
  const html = `
<!DOCTYPE html>
<html><body style="font-family:-apple-system,'Inter',sans-serif; background:#FAF8F4; color:#2A2420; margin:0; padding:32px;">
  <div style="max-width:480px; margin:0 auto; background:#F2EDE6; border:1px solid #E5DFD6; border-radius:14px; padding:32px;">
    <h1 style="font-family:'Newsreader',Georgia,serif; font-size:1.5rem; font-weight:500; margin:0 0 16px; color:#6B5540;">A report is ready to review</h1>
    <p style="line-height:1.55; color:#5E5450; margin:0 0 14px;">The Cyborg assessment for <strong>${escapeHtml(who)}</strong>${campaignName ? ` (campaign <strong>${escapeHtml(campaignName)}</strong>)` : ''} has been scored and is ready for your review.</p>
    <p style="margin:24px 0;">
      <a href="${reviewUrl}" style="display:inline-block; background:#6B5540; color:#FAF8F4; text-decoration:none; padding:11px 22px; border-radius:9px; font-weight:500;">Open the reports</a>
    </p>
    <p style="line-height:1.4; font-size:0.82rem; color:#5E5450; word-break:break-all; margin:0 0 14px;"><a href="${reviewUrl}" style="color:#6B5540;">${escapeHtml(reviewUrl)}</a></p>
    <p style="line-height:1.55; color:#8A7D77; font-size:0.82rem; margin:24px 0 0;">You're receiving this because you're on the team for this assessment. The candidate is not emailed their results.</p>
  </div>
</body></html>`;

  const sendRes = await sendEmailViaResend(env, { to: recipients, subject, html });

  // Mark sent only on success → a transient Resend failure leaves email_sent_at
  // unset so a re-fire can retry.
  if (sendRes.ok) {
    await supabase.from('reports').update({ email_sent_at: new Date().toISOString() }).eq('id', report.id);
  }
  await writeAuditLog(supabase, {
    actorEmail: '(system)', action: 'report_ready_notify',
    target: report.candidate_token, success: !!sendRes.ok,
    detail: {
      report_id: report.id, recipients: recipients.length,
      organisation_id: tok.organisation_id, campaign: campaignName || null,
      error: sendRes.ok ? undefined : sendRes.error,
    },
    ...meta,
  });

  return json({ ok: !!sendRes.ok, sent: !!sendRes.ok, recipients: recipients.length });
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}

function escapeHtml(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}
