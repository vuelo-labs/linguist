// GET /cyborg/active-time?token=cyb_... — return current active-time accounting
// for a token. The candidate Flask server proxies to this on /api/config so
// the workspace badge can show "Xh Ym work time left."
//
// Active time = sum of all (resume → pause/submit) periods.
// Currently-running period (last_resumed_at NOT NULL) is added on the fly.
//
// F-ACTIVE-TIME-UNAUTH-LOOKUP: public + unauthenticated by design (the
// candidate Flask server proxies without holding admin credentials), but
// rate-limited per IP so it can't be used as a token-existence probe oracle.

import { createClient } from '@supabase/supabase-js';
import { requestMeta, writeAuditLog, checkEndpointRateLimit } from './_lib.js';

const RATE_LIMIT_WINDOW_SEC = 60;
const RATE_LIMIT_MAX_PER_IP = 60;  // ~1/s; badge refreshes ~1/min in normal use

export async function onRequestGet({ request, env }) {
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_KEY) {
    return json({ ok: false, reason: 'not_configured' }, 503);
  }

  const url = new URL(request.url);
  const token = (url.searchParams.get('token') || '').trim();
  if (!token) return json({ ok: false, reason: 'missing_token' }, 400);

  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);
  const meta = requestMeta(request);

  if (meta.ip) {
    const rl = await checkEndpointRateLimit(
      supabase,
      `active-time:ip:${meta.ip}`,
      RATE_LIMIT_WINDOW_SEC,
      RATE_LIMIT_MAX_PER_IP,
    );
    if (!rl.ok) {
      await writeAuditLog(supabase, {
        actorEmail: '(public)',
        action:     'rate_limit_hit',
        target:     '/cyborg/active-time',
        success:    true,
        detail:     { count: rl.count, limit: rl.limit, token_prefix: token.slice(0, 8) },
        ...meta,
      });
      return json(
        { ok: false, reason: 'rate_limited', retry_after: rl.retryAfter },
        429,
        { 'Retry-After': String(rl.retryAfter) },
      );
    }
  }

  const { data: row, error } = await supabase
    .from('cyborg_tokens')
    .select('token, expires_at, used_at, revoked_at, active_time_used_seconds, last_resumed_at, active_time_cap_seconds')
    .eq('token', token)
    .maybeSingle();

  if (error)        return json({ ok: false, reason: 'lookup_failed' }, 500);
  if (!row)         return json({ ok: false, reason: 'unknown' }, 404);

  // F-ACTIVE-TIME-UNAUTH-LOOKUP follow-up: usage telemetry. Rate-limit
  // already covers attack patterns; this row gives admin visibility on
  // legitimate probe volume. Token prefix only (cyb_ + 8 hex = 12 chars)
  // so the audit log never carries a full token.
  await writeAuditLog(supabase, {
    actorEmail: '(public)',
    action:     'active_time_probe',
    target:     token.slice(0, 12),
    success:    true,
    detail:     { ip: meta.ip || null },
    ...meta,
  });

  // Compute used = stored accumulated + (now - last_resumed_at if running)
  const accumulated = row.active_time_used_seconds || 0;
  let currentPeriod = 0;
  if (row.last_resumed_at) {
    currentPeriod = Math.max(
      0,
      Math.floor((Date.now() - new Date(row.last_resumed_at).getTime()) / 1000)
    );
  }
  const usedTotal = accumulated + currentPeriod;
  const cap = row.active_time_cap_seconds || 28800;
  const remaining = Math.max(0, cap - usedTotal);

  return json({
    ok: true,
    active_time_used_seconds: usedTotal,
    active_time_remaining_seconds: remaining,
    active_time_cap_seconds: cap,
    is_running: !!row.last_resumed_at,
    last_resumed_at: row.last_resumed_at,
    expires_at: row.expires_at,
    used_at: row.used_at,
    revoked: !!row.revoked_at,
  });
}

function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
      // Allow the candidate Flask server (any origin) to proxy this.
      'Access-Control-Allow-Origin': '*',
      ...extraHeaders,
    },
  });
}
