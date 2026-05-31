// GET /cyborg/admin/report?submission=<id>&tier=<candidate|manager|technical|recruiter|master>
//
// Streams a rendered report HTML through the worker with a guaranteed
// `Content-Type: text/html; charset=utf-8` so the browser embeds it
// correctly in an iframe regardless of how the file was content-typed
// when first uploaded to Supabase Storage.
//
// Lives under /cyborg/admin* so the existing CF Access wildcard gates
// it without a new dashboard entry. Service-role Supabase key reads
// the private `reports` bucket.

import { createClient } from '@supabase/supabase-js';
import { verifyAccessJwt } from '../_access.js';
import { writeAuditLog, requestMeta } from '../_lib.js';

const TIERS = new Set(['master', 'candidate', 'manager', 'technical', 'recruiter']);

export async function onRequestGet({ request, env }) {
  const meta = requestMeta(request);
  const access = await verifyAccessJwt(request, env);
  if (!access.ok) {
    const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);
    await writeAuditLog(supabase, {
      actorEmail: '(unauthenticated)', action: 'view_report',
      success: false, detail: { reason: access.reason }, ...meta,
    });
    return new Response('Unauthorized', { status: 401 });
  }

  const url = new URL(request.url);
  const submission = parseInt(url.searchParams.get('submission'), 10);
  const tier = url.searchParams.get('tier');
  if (!submission || !TIERS.has(tier)) {
    return new Response('bad request: needs ?submission=<id>&tier=<one-of>', { status: 400 });
  }

  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);
  const objectPath = `${submission}/${tier}.html`;
  const { data, error } = await supabase.storage.from('reports').download(objectPath);
  if (error || !data) {
    await writeAuditLog(supabase, {
      actorEmail: access.email, action: 'view_report',
      target: `${submission}/${tier}`, success: false,
      detail: { reason: 'not_found', objectPath, error: error?.message }, ...meta,
    });
    return new Response(`not found: ${objectPath}`, { status: 404 });
  }

  await writeAuditLog(supabase, {
    actorEmail: access.email, action: 'view_report',
    target: `${submission}/${tier}`, success: true,
    detail: { tier, submission_id: submission }, ...meta,
  });

  const html = await data.text();
  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'private, max-age=60',
      // Defence in depth: candidate-supplied content is escaped server-side
      // via scoring/report.py _esc, but lock the iframe down too. Reports
      // are static HTML+CSS only — no scripts, no XHR, no images other than
      // inline data: URIs, no embedding except by the parent admin page.
      'X-Frame-Options': 'SAMEORIGIN',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'no-referrer',
      'Content-Security-Policy': [
        "default-src 'none'",
        "style-src 'self' 'unsafe-inline'",   // reports embed <style> blocks
        "img-src 'self' data:",                // sparklines and inline data: imgs
        "font-src 'self' data:",
        "frame-ancestors 'self'",              // only the parent admin page
        "base-uri 'none'",
        "form-action 'none'",
      ].join('; '),
    },
  });
}
