// POST /cyborg/app/api/reports/view — fetch a rendered report HTML for an org member.
//
// Auth: enforced by /cyborg/app/_middleware.js (sets X-Cyborg-User-Id +
// X-Cyborg-User-Email). Body: { submission_id: number, tier: string }.
//
// Behaviour:
//   1. Look up the submission row → its candidate_token.
//   2. Resolve candidate_token to its organisation via cyborg_tokens.
//   3. Verify the caller is a member of that organisation.
//   4. Fetch the rendered <submission_id>/<tier>.html from the `reports`
//      Supabase Storage bucket (worker uploaded it post-scoring).
//   5. Return the HTML with the same CSP headers as /cyborg/admin/report so
//      it renders safely inside an iframe / blob URL.
//
// Why POST + body instead of GET + query: the client uses fetch() with
// Authorization header (set by supabase-js session), then opens the result
// as a blob URL — keeps the access token out of the URL bar and out of
// referrer / log surfaces.

import { createClient } from '@supabase/supabase-js';
import { writeAuditLog, requestMeta } from '../../../_lib.js';

const TIERS = new Set(['master', 'candidate', 'manager', 'technical', 'recruiter']);
const REPORTS_BUCKET = 'reports';

export async function onRequestPost({ request, env }) {
  const userId    = request.headers.get('x-cyborg-user-id') || '';
  const userEmail = request.headers.get('x-cyborg-user-email') || '';
  const meta      = requestMeta(request);

  if (!userId) return json({ ok: false, reason: 'no_user' }, 401);

  let body;
  try { body = await request.json(); } catch { return json({ ok: false, reason: 'bad_json' }, 400); }

  const submissionId = parseInt(body.submission_id, 10);
  const tier         = (body.tier || '').toString().trim();
  if (!Number.isFinite(submissionId) || !TIERS.has(tier)) {
    return json({ ok: false, reason: 'bad_request' }, 400);
  }

  const admin = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);

  // 1. Submission → candidate_token
  const { data: sub, error: subErr } = await admin
    .from('submissions')
    .select('id, candidate_token')
    .eq('id', submissionId)
    .maybeSingle();
  if (subErr || !sub) {
    return json({ ok: false, reason: 'submission_not_found' }, 404);
  }

  // 2. candidate_token → organisation_id
  const { data: tokRow, error: tokErr } = await admin
    .from('cyborg_tokens')
    .select('organisation_id')
    .eq('token', sub.candidate_token)
    .maybeSingle();
  if (tokErr || !tokRow || !tokRow.organisation_id) {
    // Submission exists but no org-scoped token row — happens for the
    // pre-multi-tenant legacy data. Refuse rather than leak.
    return json({ ok: false, reason: 'token_unscoped' }, 403);
  }

  // 3. Verify caller is a member of that org
  const { data: membership, error: memErr } = await admin
    .from('organisation_members')
    .select('id, role')
    .eq('organisation_id', tokRow.organisation_id)
    .eq('user_id', userId)
    .maybeSingle();
  if (memErr || !membership) {
    await writeAuditLog(admin, {
      actorEmail: userEmail, action: 'view_report',
      target: `${submissionId}/${tier}`, success: false,
      detail: { reason: 'not_a_member', organisation_id: tokRow.organisation_id }, ...meta,
    });
    return json({ ok: false, reason: 'not_a_member_of_org' }, 403);
  }

  // 4. Pull the rendered HTML from storage
  const objectPath = `${submissionId}/${tier}.html`;
  const { data: blob, error: storageErr } = await admin.storage.from(REPORTS_BUCKET).download(objectPath);
  if (storageErr || !blob) {
    await writeAuditLog(admin, {
      actorEmail: userEmail, action: 'view_report',
      target: `${submissionId}/${tier}`, success: false,
      detail: { reason: 'not_found', objectPath, error: storageErr?.message }, ...meta,
    });
    return json({ ok: false, reason: 'report_not_ready' }, 404);
  }

  const html = await blob.text();

  await writeAuditLog(admin, {
    actorEmail: userEmail, action: 'view_report',
    target: `${submissionId}/${tier}`, success: true,
    detail: { tier, submission_id: submissionId, member_role: membership.role }, ...meta,
  });

  // Same CSP as /cyborg/admin/report.js — reports are static HTML+CSS with
  // inline styles, no scripts, no XHR, no external fetches.
  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type':            'text/html; charset=utf-8',
      'Cache-Control':           'private, max-age=60',
      'X-Frame-Options':         'SAMEORIGIN',
      'X-Content-Type-Options':  'nosniff',
      'Referrer-Policy':         'no-referrer',
      'Content-Security-Policy': [
        "default-src 'none'",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data:",
        "font-src 'self' data:",
        "frame-ancestors 'self'",
        "base-uri 'none'",
        "form-action 'none'",
      ].join('; '),
    },
  });
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}
