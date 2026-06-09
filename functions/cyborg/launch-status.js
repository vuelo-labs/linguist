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
// Phase E (2026-06-07): Fly API URLs now resolve via fly_app_name on the
// token row (per-candidate app) with env.FLY_APP_NAME as the legacy-row
// fallback. `appNameFor` is duplicated from launch.js — three sites, ~3
// lines each, kept inline (see launch.js comment).
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
import { requestMeta, writeAuditLog, checkEndpointRateLimit, readSessionCookie, loadTokenBySession } from './_lib.js';

const FLY_API_BASE = 'https://api.machines.dev/v1';
const RATE_LIMIT_WINDOW_SEC = 60;
const RATE_LIMIT_MAX_PER_TOKEN = 60;  // orientation page polls every 2s during the warm-up window — 30/min sustained + headroom
const HEALTHZ_TIMEOUT_MS = 1000;       // short — don't block the poll on a slow machine

// Phase E helper — keep in sync with launch.js + admin/fly/cleanup-orphans.js.
// Per-candidate apps are named `cyborg-c-<token-suffix>` (see launch.js
// `deriveAppName`); legacy rows fall back to the shared-pool app.
function appNameFor(tokenRow, env) {
  return tokenRow.fly_app_name || env.FLY_APP_NAME;
}

export async function onRequestGet({ request, env }) {
  // ── Env preflight ──────────────────────────────────────────────────────
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_KEY) {
    return json({ ok: false, reason: 'not_configured' }, 503);
  }
  if (!env.FLY_API_TOKEN || !env.FLY_APP_NAME) {
    return json({ ok: false, reason: 'not_configured' }, 503);
  }

  const url = new URL(request.url);
  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);
  const meta = requestMeta(request);

  // ── Identity: session cookie (JIT path) OR ?token= (legacy) ───────────
  // JIT-claimed sessions carry the HttpOnly cyborg_session cookie and no
  // query param; pre-JIT in-flight orientation pages still pass ?token=.
  let token = (url.searchParams.get('token') || '').trim();
  if (!token) {
    const sessionId = readSessionCookie(request);
    if (sessionId) {
      const sessionRow = await loadTokenBySession(supabase, sessionId);
      if (sessionRow) token = sessionRow.token;
    }
  }
  if (!token) return json({ ok: false, reason: 'missing_token' }, 401);

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
  // pause and we want to surface how much time is left). `fly_app_name`
  // added Phase E for per-candidate app routing.
  const { data: row, error } = await supabase
    .from('cyborg_tokens')
    .select('token, expires_at, used_at, revoked_at, approved_at, fly_machine_id, fly_app_name, machine_url, active_time_used_seconds, active_time_cap_seconds, last_resumed_at')
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

  const appName = appNameFor(row, env);
  const flyState = await getFlyMachineState(env, appName, row.fly_machine_id);
  // Default to 'unknown' on transient errors so the page keeps polling.
  let state = mapFlyState(flyState);
  let healthzOk = null;
  let healthzStatus = null;  // HTTP code or 0 for network error; null if not yet probed

  if (state === 'started' && row.machine_url) {
    // Probe /healthz to distinguish "Fly says started but container's web
    // server hasn't bound yet" from "actually serving traffic". 1s timeout
    // — we don't want to block the poll on a slow boot.
    healthzStatus = await probeHealthzStatus(row.machine_url);
    healthzOk = healthzStatus >= 200 && healthzStatus < 300;
    if (healthzOk) state = 'ready';
  }

  // Diagnostic hint surfaces the most likely cause to a human operator.
  // Keeps the orientation page's "Operator details" panel useful without the
  // candidate needing to read Fly logs. Strict order:
  //   - failed/destroyed → terminal
  //   - no machine_id → launch hasn't persisted yet
  //   - fly state pre-'started' → still booting
  //   - 'started' but healthz < 200/3xx → container up, /healthz missing
  //     (means image was built before the /healthz route landed — re-publish)
  //   - 'started' + healthz 5xx → Flask crashed / not bound to port 3000 yet
  //   - 'started' + healthz network error (status=0) → IPs not allocated
  //     (Phase E launch.js handles this now; legacy apps may need backfill)
  let diagnostic = null;
  if (state === 'failed')         diagnostic = 'Fly machine entered failed state. Check fly logs.';
  else if (state === 'destroyed') diagnostic = 'Fly machine was destroyed. Token may have been revoked.';
  else if (!row.fly_machine_id)   diagnostic = 'No machine spawned yet — /cyborg/launch hasn\'t persisted.';
  else if (flyState && flyState !== 'started') diagnostic = `Booting (Fly state: ${flyState}).`;
  else if (healthzStatus === 0)   diagnostic = 'Machine started but /healthz unreachable (IP allocation? Pre-Phase-E image?).';
  else if (healthzStatus === 404) diagnostic = 'Machine started but /healthz returned 404 — image predates the /healthz route. Rebuild the preset image.';
  else if (healthzStatus && healthzStatus >= 500) diagnostic = `Machine started but /healthz returned ${healthzStatus} — Flask crashed or port 3000 not yet bound.`;
  else if (healthzStatus && healthzStatus >= 300 && healthzStatus < 400) diagnostic = `Machine started but /healthz returned ${healthzStatus} (redirect). Probe sees a CF Access page or similar.`;

  return json({
    ok: true,
    state,
    machine_id: row.fly_machine_id,
    url: row.machine_url || null,
    healthz_ok: healthzOk,
    healthz_status: healthzStatus,
    fly_state: flyState,
    fly_app_name: appName,
    diagnostic,
    active_time_used_seconds: usedTotal,
    active_time_cap_seconds: cap,
    reused: false,
  });
}

async function getFlyMachineState(env, appName, machineId) {
  try {
    const r = await fetch(
      `${FLY_API_BASE}/apps/${encodeURIComponent(appName)}/machines/${encodeURIComponent(machineId)}`,
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

async function probeHealthzStatus(machineUrl) {
  // machineUrl looks like https://<app>.fly.dev/?token=<t>. Strip query +
  // any path → root → /healthz. The container exposes /healthz on the same
  // port as the desktop UI (Flask server).
  //
  // Returns the HTTP status code, or 0 for a network/timeout/DNS error
  // (which is the most useful "operator should look at IPs / DNS" signal).
  let healthzUrl;
  try {
    const u = new URL(machineUrl);
    healthzUrl = `${u.protocol}//${u.host}/healthz`;
  } catch {
    return 0;
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
    return r.status;
  } catch {
    return 0;
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
