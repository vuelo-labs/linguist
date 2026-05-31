// GET /cyborg/list — admin-only token listing.
// Auth: Cloudflare Access JWT (cf-access-jwt-assertion header).

import { createClient } from '@supabase/supabase-js';
import { verifyAccessJwt } from './_access.js';
import { writeAuditLog, requestMeta } from './_lib.js';

export async function onRequestGet({ request, env }) {
  const meta = requestMeta(request);
  const access = await verifyAccessJwt(request, env);
  if (!access.ok) {
    const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);
    await writeAuditLog(supabase, {
      actorEmail: '(unauthenticated)', action: 'list_tokens',
      success: false, detail: { reason: access.reason }, ...meta,
    });
    return json({ error: 'Unauthorized', reason: access.reason }, 401);
  }

  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);

  const { data: tokens, error } = await supabase
    .from('cyborg_tokens')
    .select('token, candidate_label, issued_at, expires_at, used_at, revoked_at, approved_at, notes')
    .order('issued_at', { ascending: false })
    .limit(500);

  if (error) {
    console.error('list tokens error:', error.message);
    await writeAuditLog(supabase, {
      actorEmail: access.email, action: 'list_tokens',
      success: false, detail: { error: error.message }, ...meta,
    });
    return json({ error: 'Failed to list tokens.' }, 500);
  }

  await writeAuditLog(supabase, {
    actorEmail: access.email, action: 'list_tokens',
    success: true, detail: { row_count: tokens.length }, ...meta,
  });

  return json({ ok: true, tokens });
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}
