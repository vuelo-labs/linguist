// POST /cyborg/launch — provision a hosted candidate workspace for a valid token.
//
// Flow:
//   1. Validate the token (same checks as validate.js).
//   2. If the token already has a running machine, return its URL (idempotent).
//   3. Else call Fly Machines API to create a per-candidate app + spawn one
//      machine inside it with the token + deadline baked into env. Persist
//      the app name, machine_id and url back to cyborg_tokens.
//   4. Return { ok: true, url, expires_at } for the landing page to redirect to.
//
// Required env (Cloudflare Pages secrets):
//   FLY_API_TOKEN      — org-scoped token allowed to create apps + machines
//   FLY_ORG_SLUG       — Fly organisation slug under which per-candidate apps are created
//   FLY_APP_NAME       — pre-Phase-E pool app (e.g. cyborg-candidate-pool); used
//                         for legacy rows whose fly_app_name is NULL and as the
//                         registry namespace for image refs.
//   FLY_IMAGE_REF      — e.g. registry.fly.io/cyborg-candidate-pool:v5-recruiter_full
//   FLY_REGION         — default 'lhr'
//   SUBMISSION_ENDPOINT — e.g. https://linguist.vuelolabs.com/cyborg/submit
//   SUPABASE_URL, SUPABASE_SERVICE_KEY — same as the rest of /cyborg/*
//
// If any required env is missing → returns 503 not_configured. Never spawns
// silently with default values.
//
// V5 hardened (2026-06-03):
//   • Per-token rate-limit (3/min). Re-clicks within the limit hit the
//     existing function-level idempotency (returns the running URL); past
//     the limit returns 429 + Retry-After. Rate-limited by token rather
//     than IP because CGNAT'd candidates can legitimately share an IP.
//   • 429s logged to cyborg_admin_audit (action: rate_limit_hit).
//
// V1.2 fast-launch (2026-06-06 — Phase D-A):
//   • Async spawn pattern. /cyborg/launch no longer blocks waiting for
//     `started` state — it kicks off the Fly create call and returns the
//     machine_id immediately. The orientation page (`/cyborg/launch/`)
//     handles the wait via /cyborg/launch-status polling. Cold-start
//     latency moves from a 30-60s blank page into a designed wait.
//   • Resume-after-pause branch unchanged — still awaits started state
//     since the start API is much faster than a fresh create (5-10s).
//
// V1.2 Phase E (2026-06-07) — per-candidate Fly app:
//   • Each new candidate gets their own Fly app (`cyborg-c-<token-suffix>`)
//     with exactly one machine inside it. URL becomes
//     `https://cyborg-c-<suffix>.fly.dev/?token=...` — uniquely addressable;
//     no shared-pool routing ambiguity.
//   • Pool-claim path is REMOVED. The pool table, claim_pooled_machine RPC,
//     and presets.target_pool_size/max_pool_size columns were dropped in the
//     same session (2026-06-07) once the per-app path was verified.
//   • Legacy rows with NULL `fly_app_name` continue to use `env.FLY_APP_NAME`
//     for state/start/destroy calls so in-flight pre-Phase-E sessions keep
//     working until they finish or revoke.

import { createClient } from '@supabase/supabase-js';
import { requestMeta, writeAuditLog, checkEndpointRateLimit, writeSessionEvent } from './_lib.js';
import { policyToEnvVars } from './admin/config/_knobs.js';

const FLY_API_BASE = 'https://api.machines.dev/v1';
const DEFAULT_REGION = 'lhr';
const MACHINE_CPUS = 2;
const MACHINE_MEMORY_MB = 2048;
const SPAWN_TIMEOUT_MS = 60000;     // 60s — image pull + first boot (resume-after-pause branch)
const POLL_INTERVAL_MS = 1500;
const RATE_LIMIT_WINDOW_SEC  = 60;
const RATE_LIMIT_MAX_PER_TOKEN = 3;

// Phase E helper: which Fly app hosts this token's machine?
//   • token row has fly_app_name set → per-candidate app (post-Phase-E).
//   • NULL → legacy row from the shared-pool era; fall back to env.FLY_APP_NAME
//     so existing /state, /start, /destroy calls still resolve.
// Kept inline (and mirrored in launch-status.js / cleanup-orphans.js) rather
// than added to _lib.js — three sites, ~3 lines each, low drift risk.
function appNameFor(tokenRow, env) {
  return tokenRow.fly_app_name || env.FLY_APP_NAME;
}

// Phase E: deterministic per-candidate app name. Last 12 chars of the token
// give a 48-bit address space — collision-free at any plausible cohort size.
// Lower-cased + dash-only because Fly app names must match [a-z0-9-]+.
function deriveAppName(token) {
  return `cyborg-c-${token.slice(-12)}`;
}

export async function onRequestPost({ request, env }) {
  // ── Env preflight ──────────────────────────────────────────────────────
  // FLY_ORG_SLUG required (Phase E) — used to create per-candidate apps via
  // POST /v1/apps. FLY_APP_NAME still required because (a) legacy in-flight
  // rows reference it and (b) the candidate image lives at
  // registry.fly.io/${FLY_APP_NAME}:<tag>.
  const missing = ['FLY_API_TOKEN', 'FLY_ORG_SLUG', 'FLY_APP_NAME', 'FLY_IMAGE_REF', 'SUBMISSION_ENDPOINT', 'SUPABASE_URL', 'SUPABASE_SERVICE_KEY', 'CYBORG_HANDOFF_SECRET']
    .filter(k => !env[k]);
  if (missing.length) {
    console.error('launch not_configured: missing env', missing);
    return json({ ok: false, reason: 'not_configured', missing }, 503);
  }
  const region = env.FLY_REGION || DEFAULT_REGION;

  // ── Body ──────────────────────────────────────────────────────────────
  let body;
  try { body = await request.json(); } catch { return json({ ok: false, reason: 'bad_request' }, 400); }
  const token = (body.token || '').toString().trim();
  if (!token) return json({ ok: false, reason: 'missing_token' }, 400);

  // ── Token validation (mirrors validate.js) ────────────────────────────
  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);
  const meta = requestMeta(request);

  // ── Rate-limit: 3 req/min per token ───────────────────────────────────
  // Re-clicks within the limit hit the idempotency check below (which
  // returns the existing machine URL); past the limit returns 429. Scoped
  // by token rather than IP so CGNAT'd candidates don't collide.
  const rl = await checkEndpointRateLimit(
    supabase,
    `launch:token:${token}`,
    RATE_LIMIT_WINDOW_SEC,
    RATE_LIMIT_MAX_PER_TOKEN,
  );
  if (!rl.ok) {
    await writeAuditLog(supabase, {
      actorEmail: '(public)',
      action:     'rate_limit_hit',
      target:     '/cyborg/launch',
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
  const { data: tokenRow, error: lookupErr } = await supabase
    .from('cyborg_tokens')
    .select('token, expires_at, used_at, revoked_at, approved_at, candidate_label, campaign_id, fly_machine_id, fly_app_name, machine_url, launched_at, active_time_used_seconds, active_time_cap_seconds, last_resumed_at')
    .eq('token', token)
    .maybeSingle();

  if (lookupErr)              return json({ ok: false, reason: 'lookup_failed' }, 500);
  if (!tokenRow)              return json({ ok: false, reason: 'unknown' }, 404);
  if (tokenRow.revoked_at)    return json({ ok: false, reason: 'revoked' }, 403);
  if (!tokenRow.approved_at)  return json({ ok: false, reason: 'pending_approval' }, 403);
  if (tokenRow.used_at)       return json({ ok: false, reason: 'already_used' }, 403);
  if (new Date(tokenRow.expires_at) < new Date()) return json({ ok: false, reason: 'expired' }, 403);

  return spawnCandidate(env, supabase, tokenRow, meta);
}

// ── Shared spawn path (JIT exchange, 2026-06-09) ─────────────────────────
// Everything from the active-time check through machine spawn + persistence.
// Two callers: the legacy POST handler above (token-in-body) and
// launch/begin.js (cookie-session claim). Returns a Response; semantics are
// byte-identical to the pre-extraction inline flow.
export async function spawnCandidate(env, supabase, tokenRow, meta) {
  const token = tokenRow.token;
  const region = env.FLY_REGION || DEFAULT_REGION;

  // ── Active-time cap check ─────────────────────────────────────────────
  // Total active time = accumulated + (currently running period, if any).
  // If the candidate is over the 8h cap, refuse to (re)launch.
  const accumulated = tokenRow.active_time_used_seconds || 0;
  let currentPeriod = 0;
  if (tokenRow.last_resumed_at) {
    currentPeriod = Math.max(0, Math.floor((Date.now() - new Date(tokenRow.last_resumed_at).getTime()) / 1000));
  }
  const usedTotal = accumulated + currentPeriod;
  const cap = tokenRow.active_time_cap_seconds || 28800;
  if (usedTotal >= cap) {
    return json({ ok: false, reason: 'out_of_active_time', used: usedTotal, cap }, 403);
  }

  // ── Idempotency + resume-after-pause ─────────────────────────────────
  // Three sub-cases when an fly_machine_id is already on the row:
  //   1. Machine is already starting/started → return its URL (re-clicks)
  //   2. Machine is stopped (paused) → start it, wait for ready, return URL
  //      (this preserves all in-container state across pause/resume)
  //   3. Machine is destroyed/failed/unknown → fall through to spawn fresh
  //
  // Phase E: machine address depends on whether the token row has fly_app_name
  // set (post-Phase-E per-candidate app) or NULL (pre-Phase-E shared pool).
  // `appNameFor` resolves either case.
  if (tokenRow.fly_machine_id && tokenRow.machine_url) {
    const appNameExisting = appNameFor(tokenRow, env);
    const state = await getMachineState(env, appNameExisting, tokenRow.fly_machine_id);
    if (state === 'started' || state === 'starting') {
      // Re-click while already running. last_resumed_at is unchanged — the
      // active-time clock is already ticking from when the candidate first
      // launched (or resumed).
      // Integrity capture: a re-entry is where a second device re-clicking
      // "Enter" would surface (device/network snapshot at this moment).
      await writeSessionEvent(supabase, { token, kind: 'launch', candidateUserId: tokenRow.candidate_user_id, meta });
      return json({
        ok: true,
        url: tokenRow.machine_url,
        expires_at: tokenRow.expires_at,
        reused: true,
      });
    }
    if (state === 'stopped' || state === 'suspended') {
      // Resume the paused machine — preserves notes.md, work/, candidate-state.json.
      const startOk = await startFlyMachine(env, appNameExisting, tokenRow.fly_machine_id);
      if (startOk) {
        const ready = await waitForMachineStarted(env, appNameExisting, tokenRow.fly_machine_id, SPAWN_TIMEOUT_MS);
        if (ready) {
          // Restart the active-time clock for the new period.
          await supabase
            .from('cyborg_tokens')
            .update({ last_resumed_at: new Date().toISOString() })
            .eq('token', token);
          // Integrity capture: resume-after-pause device/network snapshot.
          await writeSessionEvent(supabase, { token, kind: 'resume', candidateUserId: tokenRow.candidate_user_id, meta });
          return json({
            ok: true,
            url: tokenRow.machine_url,
            expires_at: tokenRow.expires_at,
            resumed: true,
          });
        }
        console.warn('launch: stopped machine failed to start, respawning', tokenRow.fly_machine_id);
      } else {
        console.warn('launch: start API failed for paused machine, respawning', tokenRow.fly_machine_id);
      }
    }
    // Machine destroyed/failed/unknown — fall through to spawn fresh.
    console.warn('launch: stale machine_id for token, respawning', tokenRow.fly_machine_id, 'state:', state);
  }

  // ── Resolve per-campaign session policy + preset image ────────────────
  // v1.1 preset path: campaign → preset → image_ref (Fly registry tag).
  // Per-campaign settings JSONB stays as the runtime knob override surface.
  // Both are merged into the Fly machine env at spawn (settings overlays
  // preset.runtime_knobs).
  let policyEnv = {};
  let presetImageRef = null;
  let campaignPresetId = null;
  if (tokenRow.campaign_id) {
    const { data: campaign, error: campaignErr } = await supabase
      .from('campaigns')
      .select('id, settings, preset_id')
      .eq('id', tokenRow.campaign_id)
      .maybeSingle();
    if (campaignErr) {
      console.error('campaign lookup failed at spawn time', campaignErr.message);
    } else if (campaign) {
      if (campaign.settings) policyEnv = policyToEnvVars(campaign.settings);
      if (campaign.preset_id) {
        campaignPresetId = campaign.preset_id;
        const { data: preset, error: presetErr } = await supabase
          .from('presets')
          .select('slug, current_image_tag')
          .eq('id', campaign.preset_id)
          .maybeSingle();
        if (presetErr) {
          console.error('preset lookup failed at spawn time', presetErr.message);
        } else if (preset && preset.current_image_tag) {
          presetImageRef = `registry.fly.io/${env.FLY_APP_NAME}:${preset.current_image_tag}`;
        }
      }
    }
  }

  // ── Per-candidate Fly app (Phase E) ──────────────────────────────────
  // Each candidate gets their own Fly app + one machine inside. The URL
  // (cyborg-c-<suffix>.fly.dev) is uniquely addressable — no shared-pool
  // routing ambiguity.
  //
  // Idempotency: if the token row already has fly_app_name from a prior
  // attempt that failed mid-way (app created but spawn returned an error
  // before persistence), reuse that app name. Otherwise derive a fresh one.
  const appName = tokenRow.fly_app_name || deriveAppName(token);
  // Zero-exposure handoff (Phase 2): the URL carries NO token. The orientation
  // page mints a short-lived HMAC handoff ticket at "Enter workspace" click and
  // POSTs it to <url>/handoff (ticket in the body, never the URL). The raw token
  // stays fully server-side. (Legacy ?token= GET on the container is kept behind
  // a flag for manual rollback only — no flow appends it anymore.)
  const candidateUrl = `https://${appName}.fly.dev/`;

  // ── Create the Fly app ───────────────────────────────────────────────
  // POST /v1/apps. 422 "app already exists" is treated as idempotent success
  // (re-spawn against a prior half-created app). Anything else → 502.
  let appWasCreated = false;
  try {
    const appRes = await fetch(`${FLY_API_BASE}/apps`, {
      method:  'POST',
      headers: {
        'Authorization': `Bearer ${env.FLY_API_TOKEN}`,
        'Content-Type':  'application/json',
      },
      body: JSON.stringify({
        app_name: appName,
        org_slug: env.FLY_ORG_SLUG,
        network:  'default',
      }),
    });
    if (appRes.ok) {
      appWasCreated = true;
    } else {
      const errText = await appRes.text().catch(() => '');
      // Fly returns 422 when the app name is already taken. Anything in the
      // body referencing 'already' / 'taken' is treated as idempotent reuse.
      const isAlreadyExists =
        appRes.status === 422 && /already|taken|exists/i.test(errText);
      if (!isAlreadyExists) {
        console.error('fly app create failed', appRes.status, errText);
        return json({ ok: false, reason: 'app_create_failed', status: appRes.status }, 502);
      }
      console.warn('fly app create returned 422 (already exists); reusing', appName);
    }
  } catch (e) {
    console.error('fly app create error', e?.message || e);
    return json({ ok: false, reason: 'app_create_failed' }, 502);
  }

  // ── Allocate shared IPv4 so the app is reachable on *.fly.dev ────────
  // Fly's Machines API creates the app but does NOT auto-allocate public
  // IPs — without this call, the new <app>.fly.dev hostname returns 404 at
  // the edge. Skipped on idempotent reuse (existing app already has IPs).
  // GraphQL endpoint (api.fly.io/graphql) is used because the Machines API
  // doesn't expose IP allocation as REST yet; requires org-scoped token
  // (app-scoped deploy tokens 403 — same constraint as POST /v1/apps).
  if (appWasCreated) {
    try {
      const ipRes = await fetch('https://api.fly.io/graphql', {
        method:  'POST',
        headers: {
          'Authorization': `Bearer ${env.FLY_API_TOKEN}`,
          'Content-Type':  'application/json',
        },
        body: JSON.stringify({
          query: `mutation($input: AllocateIPAddressInput!) {
            allocateIpAddress(input: $input) { ipAddress { address type } }
          }`,
          variables: { input: { appId: appName, type: 'shared_v4' } },
        }),
      });
      const ipBody = await ipRes.json().catch(() => null);
      if (!ipRes.ok || (ipBody && ipBody.errors)) {
        console.error('fly allocate shared v4 failed', ipRes.status, JSON.stringify(ipBody?.errors || ipBody));
        return json({ ok: false, reason: 'ip_allocate_failed', status: ipRes.status }, 502);
      }
    } catch (e) {
      console.error('fly allocate shared v4 error', e?.message || e);
      return json({ ok: false, reason: 'ip_allocate_failed' }, 502);
    }
  }

  // ── Spawn the machine inside the per-candidate app ───────────────────
  // Image precedence: preset's current_image_tag > env.FLY_IMAGE_REF (default).
  // Image still lives at registry.fly.io/${FLY_APP_NAME}:<tag> — the registry
  // is namespaced under the pool app, not the per-candidate app.
  const imageRef = presetImageRef || env.FLY_IMAGE_REF;
  const machineConfig = {
    name: `cyborg-${token.slice(-12)}`,
    region,
    config: {
      image: imageRef,
      env: {
        CANDIDATE_TOKEN:       token,
        // Shared HMAC secret for the zero-exposure handoff + submission auth
        // (Phase 2). Held only in the Fly machine env (never client-side); the
        // container verifies handoff tickets + signs submissions with it.
        CYBORG_HANDOFF_SECRET: env.CYBORG_HANDOFF_SECRET,
        // Phase 2 fully proven (2026-06-10) → disable the legacy ?token= GET
        // sideload on new machines, closing the last URL-token redemption vector.
        // Entry stays HTTPS POST /auth (paste form) + the HMAC handoff only.
        CYBORG_LEGACY_TOKEN_GET: '0',
        SUBMISSION_ENDPOINT:   env.SUBMISSION_ENDPOINT,
        DEADLINE:              tokenRow.expires_at,
        PROFILE:               env.PROFILE || 'v5-recruiter_full',
        ...policyEnv,
      },
      services: [{
        ports: [
          { port: 443, handlers: ['tls', 'http'] },
          { port: 80,  handlers: ['http'],         force_https: true },
        ],
        protocol: 'tcp',
        internal_port: 3000,
        auto_stop_machines: 'off',
        auto_start_machines: false,
        min_machines_running: 1,
      }],
      guest: { cpu_kind: 'shared', cpus: MACHINE_CPUS, memory_mb: MACHINE_MEMORY_MB },
      auto_destroy: false,
    },
  };

  let machine;
  try {
    const flyRes = await fetch(`${FLY_API_BASE}/apps/${encodeURIComponent(appName)}/machines`, {
      method:  'POST',
      headers: {
        'Authorization': `Bearer ${env.FLY_API_TOKEN}`,
        'Content-Type':  'application/json',
      },
      body: JSON.stringify(machineConfig),
    });
    if (!flyRes.ok) {
      const errText = await flyRes.text().catch(() => '');
      console.error('fly machines create failed', flyRes.status, errText);
      return json({ ok: false, reason: 'spawn_failed', status: flyRes.status }, 502);
    }
    machine = await flyRes.json();
  } catch (e) {
    console.error('fly machines create error', e);
    return json({ ok: false, reason: 'spawn_failed' }, 502);
  }

  // V1.2 async-launch: do NOT await waitForMachineStarted on the cold-spawn
  // path. The orientation page polls /cyborg/launch-status and surfaces the
  // wait as a designed experience instead of a 30-60s blank page. Auth happens
  // later, at "Enter workspace", via the zero-exposure handoff (no token in URL).

  // ── Persist mapping ───────────────────────────────────────────────────
  // Fresh spawn: kick off the active-time clock. Reset to 0 only on the very
  // first spawn (no prior machine); preserve accumulated time if this is a
  // re-spawn after a destroyed machine (rare, defensive).
  const isFirstSpawn = !tokenRow.fly_machine_id;
  const updatePayload = {
    fly_app_name:    appName,
    fly_machine_id:  machine.id,
    machine_url:     candidateUrl,
    launched_at:     new Date().toISOString(),
    last_resumed_at: new Date().toISOString(),
  };
  if (isFirstSpawn) updatePayload.active_time_used_seconds = 0;

  const { error: updateErr } = await supabase
    .from('cyborg_tokens')
    .update(updatePayload)
    .eq('token', token);
  if (updateErr) {
    // F-LAUNCH-ORPHAN-MACHINE: the app + machine are running and billing but
    // no token row references them; a re-click would spawn a second machine
    // inside the SAME app (the idempotency path covers this via fly_app_name=NULL
    // → derive same name) but the audit trail is broken. Destroy the orphan
    // app entirely and return 500 so the candidate retries cleanly.
    console.error('cyborg_tokens update failed; destroying orphan app', updateErr.message);
    await writeAuditLog(supabase, {
      actorEmail: '(public)',
      action:     'launch_persist_failed',
      target:     token,
      success:    false,
      detail:     { fly_app_name: appName, machine_id: machine.id, error: updateErr.message },
      ...meta,
    });
    await destroyFlyApp(env, appName).catch((destroyErr) => {
      console.error('orphan app destroy also failed', destroyErr?.message || destroyErr);
    });
    return json({ ok: false, reason: 'persist_failed' }, 500);
  }

  // Integrity capture: fresh-spawn device/network/country snapshot. This is the
  // baseline the later resume/status snapshots are compared against. (Folds in
  // the plan's "claim" touchpoint — begin → spawnCandidate is one request, so a
  // separate claim event would be the same device/time.)
  await writeSessionEvent(supabase, { token, kind: 'launch', candidateUserId: tokenRow.candidate_user_id, meta });

  return json({
    ok: true,
    machine_id:   machine.id,
    fly_app_name: appName,
    url:          candidateUrl,
    state:        'spawning',
    expires_at:   tokenRow.expires_at,
    reused:       false,
  });
}

// Phase E: each helper takes the resolved Fly app name (per-candidate post-Phase-E,
// or env.FLY_APP_NAME for legacy rows). Callers use `appNameFor(tokenRow, env)`
// or, on the cold-spawn path, the freshly-derived appName.

async function destroyFlyApp(env, appName) {
  // Destroy the entire per-candidate app — kills the app, machines, volumes,
  // and the public hostname all in one call. 404 is treated as success
  // (already gone). Used as the orphan-rollback path when post-spawn DB
  // persistence fails.
  const url = `${FLY_API_BASE}/apps/${encodeURIComponent(appName)}?force=true`;
  const r = await fetch(url, {
    method:  'DELETE',
    headers: { 'Authorization': `Bearer ${env.FLY_API_TOKEN}` },
  });
  if (!r.ok && r.status !== 404) {
    const errText = await r.text().catch(() => '');
    throw new Error(`fly app destroy ${r.status}: ${errText}`);
  }
}

async function getMachineState(env, appName, machineId) {
  try {
    const r = await fetch(`${FLY_API_BASE}/apps/${encodeURIComponent(appName)}/machines/${encodeURIComponent(machineId)}`, {
      headers: { 'Authorization': `Bearer ${env.FLY_API_TOKEN}` },
    });
    if (!r.ok) return null;
    const m = await r.json();
    return m.state || null;
  } catch {
    return null;
  }
}

async function startFlyMachine(env, appName, machineId) {
  try {
    const r = await fetch(
      `${FLY_API_BASE}/apps/${encodeURIComponent(appName)}/machines/${encodeURIComponent(machineId)}/start`,
      { method: 'POST', headers: { 'Authorization': `Bearer ${env.FLY_API_TOKEN}` } }
    );
    return r.ok;
  } catch {
    return false;
  }
}

async function waitForMachineStarted(env, appName, machineId, timeoutMs) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const r = await fetch(`${FLY_API_BASE}/apps/${encodeURIComponent(appName)}/machines/${encodeURIComponent(machineId)}`, {
        headers: { 'Authorization': `Bearer ${env.FLY_API_TOKEN}` },
      });
      if (r.ok) {
        const m = await r.json();
        if (m.state === 'started') return true;
        if (['failed', 'destroyed'].includes(m.state)) return false;
      }
    } catch {
      /* keep polling */
    }
    await new Promise(res => setTimeout(res, POLL_INTERVAL_MS));
  }
  return false;
}

function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type':  'application/json',
      'Cache-Control': 'no-store',
      ...extraHeaders,
    },
  });
}
