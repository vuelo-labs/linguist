// GET /cyborg/launch-status?token=cyb_... — poll for machine readiness during
// the launch wait. The orientation page (`/cyborg/launch/`) hits this every
// 2s after the initial /cyborg/launch POST returns; once state==='ready' &&
// healthz_ok, the page enables the "Enter workspace →" button.
//
// Public + unauthenticated by design (mirrors active-time.js) — the candidate
// already holds the token and that's the privilege. Rate-limited per token
// rather than per IP because CGNAT'd candidates can legitimately share an IP
// (same reasoning as launch.js).
//
// State semantics:
//   spawning  — token row exists, fly_machine_id null (haven't even called create)
//   starting  — Fly machine state in {created, starting}
//   started   — Fly machine state == 'started' but /healthz hasn't returned 200 yet
//   ready     — Fly machine state == 'started' AND /healthz returned 200 (this run)
//   failed    — Fly machine state == 'failed'
//   destroyed — Fly machine state == 'destroyed'
//   unknown   — Fly API call failed; transient
//
// No audit row per probe (high-volume polling endpoint; analogous to
// `active_time_probe` already covers usage telemetry on a similar polling
// surface). Rate-limit hits ARE audited (attack signal).

import { createClient } from '@supabase/supabase-js';
import { requestMeta, writeAuditLog, checkEndpointRateLimit } from './_lib.js';

const FLY_API_BASE = 'https://api.machines.dev/v1';
const RATE_LIMIT_WINDOW_SEC = 60;
const RATE_LIMIT_MAX_PER_TOKEN = 60;  // orientation page polls every 2s during the warm-up window — 30/min sustained + headroom
const HEALTHZ_TIMEOUT_MS = 1000;       // short — don't block the poll on a slow machine

export async function onRequestGet({ request, env }) {
  // ── Env preflight ──────────────────────────────────────────────────────
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_KEY) {
    return json({ ok: false, reason: 'not_configured' }, 503);
  }
  if (!env.FLY_API_TOKEN || !env.FLY_APP_NAME) {
    return json({ ok: false, reason: 'not_configured' }, 503);
  }

  const url = new URL(request.url);
  const token = (url.searchParams.get('token') || '').trim();
  if (!token) return json({ ok: false, reason: 'missing_token' }, 400);

  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);
  const meta = requestMeta(request);

  // ── Rate-limit per token (CGNAT-safe) ─────────────────────────────────
  const rl = await checkEndpointRateLimit(
    supabase,
    `launch-status:token:${token}`,
    RATE_LIMIT_WINDOW_SEC,
    RATE_LIMIT_MAX_PER_TOKEN,
  );
  if (!rl.ok) {
    await writeAuditLog(supabase, {
      actorEmail: '(public)',
      action:     'rate_limit_hit',
      target:     '/cyborg/launch-status',
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

  // ── Token lookup ──────────────────────────────────────────────────────
  // Same column set as launch.js so we can report active-time budget back
  // to the orientation page (useful if a candidate is re-launching after a
  // pause and we want to surface how much time is left).
  const { data: row, error } = await supabase
    .from('cyborg_tokens')
    .select('token, expires_at, used_at, revoked_at, approved_at, fly_machine_id, machine_url, active_time_used_seconds, active_time_cap_seconds, last_resumed_at')
    .eq('token', token)
    .maybeSingle();

  if (error)               return json({ ok: false, reason: 'lookup_failed' }, 500);
  if (!row)                return json({ ok: false, reason: 'unknown' }, 404);
  if (row.revoked_at)      return json({ ok: false, reason: 'revoked' }, 403);
  if (!row.approved_at)    return json({ ok: false, reason: 'pending_approval' }, 403);
  if (row.used_at)         return json({ ok: false, reason: 'used' }, 403);
  if (new Date(row.expires_at) < new Date()) return json({ ok: false, reason: 'expired' }, 403);

  // ── Active-time accounting (for the orientation page badge) ──────────
  const accumulated = row.active_time_used_seconds || 0;
  let currentPeriod = 0;
  if (row.last_resumed_at) {
    currentPeriod = Math.max(0, Math.floor((Date.now() - new Date(row.last_resumed_at).getTime()) / 1000));
  }
  const usedTotal = accumulated + currentPeriod;
  const cap = row.active_time_cap_seconds || 28800;

  // ── Machine state ─────────────────────────────────────────────────────
  // No machine_id yet → the launch POST hasn't completed, or it failed
  // before persistence. The orientation page treats this as 'spawning'.
  if (!row.fly_machine_id) {
    return json({
      ok: true,
      state: 'spawning',
      machine_id: null,
      url: null,
      healthz_ok: null,
      active_time_used_seconds: usedTotal,
      active_time_cap_seconds: cap,
      reused: false,
    });
  }

  const flyState = await getFlyMachineState(env, row.fly_machine_id);
  // Default to 'unknown' on transient errors so the page keeps polling.
  let state = mapFlyState(flyState);
  let healthzOk = null;

  if (state === 'started' && row.machine_url) {
    // Probe /healthz to distinguish "Fly says started but container's web
    // server hasn't bound yet" from "actually serving traffic". 1s timeout
    // — we don't want to block the poll on a slow boot.
    healthzOk = await probeHealthz(row.machine_url);
    if (healthzOk) state = 'ready';
  }

  return json({
    ok: true,
    state,
    machine_id: row.fly_machine_id,
    url: row.machine_url || null,
    healthz_ok: healthzOk,
    active_time_used_seconds: usedTotal,
    active_time_cap_seconds: cap,
    reused: false,
  });
}

async function getFlyMachineState(env, machineId) {
  try {
    const r = await fetch(
      `${FLY_API_BASE}/apps/${encodeURIComponent(env.FLY_APP_NAME)}/machines/${encodeURIComponent(machineId)}`,
      { headers: { 'Authorization': `Bearer ${env.FLY_API_TOKEN}` } },
    );
    if (!r.ok) return null;
    const m = await r.json();
    return m.state || null;
  } catch {
    return null;
  }
}

// Map raw Fly state to our orientation-page vocabulary.
// Fly states observed: created, starting, started, stopping, stopped, suspended,
// suspending, replacing, destroying, destroyed, failed.
function mapFlyState(raw) {
  if (!raw) return 'unknown';
  switch (raw) {
    case 'created':
    case 'starting':
      return 'starting';
    case 'started':
      return 'started';
    case 'failed':
      return 'failed';
    case 'destroyed':
    case 'destroying':
      return 'destroyed';
    // stopping/stopped/suspended/replacing/etc — surface as 'starting' so the
    // orientation page keeps polling (the resume-after-pause path in launch.js
    // restarts these).
    default:
      return 'starting';
  }
}

async function probeHealthz(machineUrl) {
  // machineUrl looks like https://<app>.fly.dev/?token=<t>. Strip query +
  // any path → root → /healthz. The container exposes /healthz on the same
  // port as the desktop UI (Flask server).
  let healthzUrl;
  try {
    const u = new URL(machineUrl);
    healthzUrl = `${u.protocol}//${u.host}/healthz`;
  } catch {
    return false;
  }
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), HEALTHZ_TIMEOUT_MS);
  try {
    const r = await fetch(healthzUrl, {
      method: 'GET',
      signal: ac.signal,
      // Don't follow redirects — the container responds to /healthz directly
      // with 200 once Flask is up; redirects would mask a not-yet-bound port.
      redirect: 'manual',
      cf: { cacheTtl: 0 },
    });
    return r.status >= 200 && r.status < 300;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
      // Allow same-origin browser fetch — orientation page is served from the
      // same domain so this is permissive but not required.
      'Access-Control-Allow-Origin': '*',
      ...extraHeaders,
    },
  });
}
