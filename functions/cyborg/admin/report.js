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

const TIERS = new Set(['master', 'candidate', 'manager', 'technical', 'recruiter']);

export async function onRequestGet({ request, env }) {
  const access = await verifyAccessJwt(request, env);
  if (!access.ok) return new Response('Unauthorized', { status: 401 });

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
    return new Response(`not found: ${objectPath}`, { status: 404 });
  }

  const html = await data.text();
  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'private, max-age=60',
      // Allow embedding from this same Pages origin (the admin page) but
      // refuse third-party embeds.
      'X-Frame-Options': 'SAMEORIGIN',
      'Content-Security-Policy': "frame-ancestors 'self'",
    },
  });
}
