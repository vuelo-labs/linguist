// POST /cyborg/launch — provision a hosted candidate workspace for a valid token.
//
// Flow:
//   1. Validate the token (same checks as validate.js).
//   2. If the token already has a running machine, return its URL (idempotent).
//   3. Else call Fly Machines API to spawn a new machine with the token + deadline
//      baked into env. Persist the machine_id + url back to cyborg_tokens.
//   4. Return { ok: true, url, expires_at } for the landing page to redirect to.
//
// Required env (Cloudflare Pages secrets):
//   FLY_API_TOKEN      — deploy-scoped token for the candidate-pool app
//   FLY_APP_NAME       — e.g. cyborg-candidate-pool
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
//   • Pool-claim path: before falling through to a cold spawn, attempt
//     `claim_pooled_machine` RPC (atomic SKIP LOCKED). On hit, PATCH the
//     pooled machine's env via Fly API and return `claimed_from_pool: true`.
//     Pool is opt-in per-preset (presets.target_pool_size > 0). With pool
//     empty we land on the cold-spawn branch.
//   • Resume-after-pause branch unchanged — still awaits started state
//     since the start API is much faster than a fresh create (5-10s).

import { createClient } from '@supabase/supabase-js';
import { requestMeta, writeAuditLog, checkEndpointRateLimit } from './_lib.js';
import { policyToEnvVars } from './admin/config/_knobs.js';

const FLY_API_BASE = 'https://api.machines.dev/v1';
const DEFAULT_REGION = 'lhr';
const MACHINE_CPUS = 2;
const MACHINE_MEMORY_MB = 2048;
const SPAWN_TIMEOUT_MS = 60000;     // 60s — image pull + first boot (resume-after-pause branch)
const POLL_INTERVAL_MS = 1500;
const RATE_LIMIT_WINDOW_SEC  = 60;
const RATE_LIMIT_MAX_PER_TOKEN = 3;

export async function onRequestPost({ request, env }) {
  // ── Env preflight ──────────────────────────────────────────────────────
  const missing = ['FLY_API_TOKEN', 'FLY_APP_NAME', 'FLY_IMAGE_REF', 'SUBMISSION_ENDPOINT', 'SUPABASE_URL', 'SUPABASE_SERVICE_KEY']
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
    .select('token, expires_at, used_at, revoked_at, approved_at, candidate_label, campaign_id, fly_machine_id, machine_url, launched_at, active_time_used_seconds, active_time_cap_seconds, last_resumed_at')
    .eq('token', token)
    .maybeSingle();

  if (lookupErr)              return json({ ok: false, reason: 'lookup_failed' }, 500);
  if (!tokenRow)              return json({ ok: false, reason: 'unknown' }, 404);
  if (tokenRow.revoked_at)    return json({ ok: false, reason: 'revoked' }, 403);
  if (!tokenRow.approved_at)  return json({ ok: false, reason: 'pending_approval' }, 403);
  if (tokenRow.used_at)       return json({ ok: false, reason: 'already_used' }, 403);
  if (new Date(tokenRow.expires_at) < new Date()) return json({ ok: false, reason: 'expired' }, 403);

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
  if (tokenRow.fly_machine_id && tokenRow.machine_url) {
    const state = await getMachineState(env, tokenRow.fly_machine_id);
    if (state === 'started' || state === 'starting') {
      // Re-click while already running. last_resumed_at is unchanged — the
      // active-time clock is already ticking from when the candidate first
      // launched (or resumed).
      return json({
        ok: true,
        url: tokenRow.machine_url,
        expires_at: tokenRow.expires_at,
        reused: true,
      });
    }
    if (state === 'stopped' || state === 'suspended') {
      // Resume the paused machine — preserves notes.md, work/, candidate-state.json.
      const startOk = await startFlyMachine(env, tokenRow.fly_machine_id);
      if (startOk) {
        const ready = await waitForMachineStarted(env, tokenRow.fly_machine_id, SPAWN_TIMEOUT_MS);
        if (ready) {
          // Restart the active-time clock for the new period.
          await supabase
            .from('cyborg_tokens')
            .update({ last_resumed_at: new Date().toISOString() })
            .eq('token', token);
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

  const candidateUrl = `https://${env.FLY_APP_NAME}.fly.dev/?token=${encodeURIComponent(token)}`;

  // ── Pool-claim path (V1.2) ───────────────────────────────────────────
  // Try to claim a pre-warmed machine for this preset before a cold spawn.
  // `claim_pooled_machine` is an atomic SKIP LOCKED SELECT+UPDATE that flips
  // a row from 'ready' to 'claimed'. Empty result = pool empty for this
  // preset, fall through to cold-spawn block. Pool is opt-in per-preset
  // (presets.target_pool_size > 0) and defaults to 0 — the cold-spawn path
  // is the safe default.
  if (campaignPresetId) {
    try {
      const { data: claimed, error: claimErr } = await supabase
        .rpc('claim_pooled_machine', { p_preset_id: campaignPresetId, p_token: token });
      if (claimErr) {
        console.error('claim_pooled_machine RPC error', claimErr.message);
      } else if (Array.isArray(claimed) && claimed.length > 0 && claimed[0].machine_id) {
        const pooledMachineId = claimed[0].machine_id;
        // PATCH the pooled machine's env so the container boots with this
        // candidate's CANDIDATE_TOKEN / DEADLINE / policy env. Fly restarts
        // the machine on a config update — restart wait is handled by the
        // orientation page polling /cyborg/launch-status.
        const patched = await patchMachineEnv(env, pooledMachineId, presetImageRef || env.FLY_IMAGE_REF, {
          CANDIDATE_TOKEN:     token,
          SUBMISSION_ENDPOINT: env.SUBMISSION_ENDPOINT,
          DEADLINE:            tokenRow.expires_at,
          PROFILE:             env.PROFILE || 'v5-recruiter_full',
          ...policyEnv,
        });
        if (!patched) {
          console.error('pool-claim PATCH failed for', pooledMachineId, '— destroying pooled machine and falling through to cold spawn');
          // PATCH failed → the pooled machine still has CANDIDATE_TOKEN=__pool_pending__
          // and is unusable. Destroy it + mark the row 'destroying' so neither the
          // warmer nor cleanup-orphans treats it as live, then fall through to
          // cold spawn. Token row is still unmodified (we never wrote fly_machine_id
          // for this attempt), so the fall-through is clean.
          await supabase
            .from('preset_machine_pool')
            .update({ state: 'destroying', failure_reason: 'pool_claim_patch_failed', updated_at: new Date().toISOString() })
            .eq('fly_machine_id', pooledMachineId);
          await destroyFlyMachine(env, pooledMachineId).catch((e) => {
            console.error('pool-claim destroy after PATCH fail also failed', e?.message || e);
          });
        } else {
          const isFirstSpawn = !tokenRow.fly_machine_id;
          const updatePayload = {
            fly_machine_id:  pooledMachineId,
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
            console.error('cyborg_tokens update failed after pool claim', updateErr.message);
            await writeAuditLog(supabase, {
              actorEmail: '(public)',
              action:     'launch_persist_failed',
              target:     token,
              success:    false,
              detail:     { machine_id: pooledMachineId, error: updateErr.message, claimed_from_pool: true },
              ...meta,
            });
            // Don't stop the pooled machine — orphan-sweep covers it.
            return json({ ok: false, reason: 'persist_failed' }, 500);
          }
          return json({
            ok: true,
            machine_id: pooledMachineId,
            url: candidateUrl,
            state: 'starting',
            claimed_from_pool: true,
            expires_at: tokenRow.expires_at,
          });
        }
      }
    } catch (e) {
      console.error('pool-claim path exception, falling through to cold spawn', e?.message || e);
    }
  }

  // ── Cold spawn ────────────────────────────────────────────────────────
  // Image precedence: preset's current_image_tag > env.FLY_IMAGE_REF (default).
  // If a campaign references a preset that hasn't been built yet, we still
  // spawn from the default — admin UI will warn the operator before they
  // mint tokens to an unbuilt preset.
  const imageRef = presetImageRef || env.FLY_IMAGE_REF;
  const machineConfig = {
    name: `cyborg-${token.slice(-12)}`,
    region,
    config: {
      image: imageRef,
      env: {
        CANDIDATE_TOKEN:     token,
        SUBMISSION_ENDPOINT: env.SUBMISSION_ENDPOINT,
        DEADLINE:            tokenRow.expires_at,
        PROFILE:             env.PROFILE || 'v5-recruiter_full',
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
    const flyRes = await fetch(`${FLY_API_BASE}/apps/${encodeURIComponent(env.FLY_APP_NAME)}/machines`, {
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
  // wait as a designed experience instead of a 30-60s blank page. Fly app
  // URL routes to any healthy machine with the service config.
  //
  // Append `?token=<token>` so the container's auth handler can exchange it
  // for a session cookie on first hit (avoids the "Session expired" screen).
  // The container's first response is a 302 that strips the token from the
  // URL, so it doesn't end up in browser history or referer headers.

  // ── Persist mapping ───────────────────────────────────────────────────
  // Fresh spawn: kick off the active-time clock. Reset to 0 only on the very
  // first spawn (no prior machine); preserve accumulated time if this is a
  // re-spawn after a destroyed machine (rare, defensive).
  const isFirstSpawn = !tokenRow.fly_machine_id;
  const updatePayload = {
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
    // F-LAUNCH-ORPHAN-MACHINE: the machine is running and billing but no
    // token row references it; a re-click would spawn a second machine.
    // Stop the orphan and return 500 so the candidate retries cleanly.
    console.error('cyborg_tokens update failed; stopping orphan machine', updateErr.message);
    await writeAuditLog(supabase, {
      actorEmail: '(public)',
      action:     'launch_persist_failed',
      target:     token,
      success:    false,
      detail:     { machine_id: machine.id, error: updateErr.message },
      ...meta,
    });
    await stopFlyMachine(env, machine.id).catch((stopErr) => {
      console.error('orphan stop also failed', stopErr.message);
    });
    return json({ ok: false, reason: 'persist_failed' }, 500);
  }

  return json({
    ok: true,
    machine_id: machine.id,
    url: candidateUrl,
    state: 'spawning',
    claimed_from_pool: false,
    expires_at: tokenRow.expires_at,
    reused: false,
  });
}

async function stopFlyMachine(env, machineId) {
  const url = `${FLY_API_BASE}/apps/${encodeURIComponent(env.FLY_APP_NAME)}/machines/${encodeURIComponent(machineId)}/stop`;
  const r = await fetch(url, {
    method:  'POST',
    headers: { 'Authorization': `Bearer ${env.FLY_API_TOKEN}` },
  });
  if (!r.ok) {
    const errText = await r.text().catch(() => '');
    throw new Error(`fly stop ${r.status}: ${errText}`);
  }
}

async function destroyFlyMachine(env, machineId) {
  // Force-DELETE so we don't have to /stop first (mirrors the teammate-side
  // revoke pattern from 2026-06-06 — Fly auto-restarts stopped machines on
  // inbound traffic, so /stop is not enough). 404 is treated as success
  // (already gone, possibly via a concurrent sweep).
  const url = `${FLY_API_BASE}/apps/${encodeURIComponent(env.FLY_APP_NAME)}/machines/${encodeURIComponent(machineId)}?force=true`;
  const r = await fetch(url, {
    method:  'DELETE',
    headers: { 'Authorization': `Bearer ${env.FLY_API_TOKEN}` },
  });
  if (!r.ok && r.status !== 404) {
    const errText = await r.text().catch(() => '');
    throw new Error(`fly destroy ${r.status}: ${errText}`);
  }
}

async function getMachineState(env, machineId) {
  try {
    const r = await fetch(`${FLY_API_BASE}/apps/${encodeURIComponent(env.FLY_APP_NAME)}/machines/${encodeURIComponent(machineId)}`, {
      headers: { 'Authorization': `Bearer ${env.FLY_API_TOKEN}` },
    });
    if (!r.ok) return null;
    const m = await r.json();
    return m.state || null;
  } catch {
    return null;
  }
}

async function startFlyMachine(env, machineId) {
  try {
    const r = await fetch(
      `${FLY_API_BASE}/apps/${encodeURIComponent(env.FLY_APP_NAME)}/machines/${encodeURIComponent(machineId)}/start`,
      { method: 'POST', headers: { 'Authorization': `Bearer ${env.FLY_API_TOKEN}` } }
    );
    return r.ok;
  } catch {
    return false;
  }
}

// V1.2 pool-claim path: PATCH a pooled machine's env so it boots for this
// specific candidate. Fly auto-restarts the machine on a config update, so
// the candidate sees the same "starting → started → ready" arc as a cold
// spawn (just minus the image-pull seconds because the image is cached
// locally on the host). Image is required by Fly's update API even when
// unchanged — re-passing the same ref is a no-op.
async function patchMachineEnv(env, machineId, imageRef, envVars) {
  try {
    const r = await fetch(
      `${FLY_API_BASE}/apps/${encodeURIComponent(env.FLY_APP_NAME)}/machines/${encodeURIComponent(machineId)}`,
      {
        method:  'POST',
        headers: {
          'Authorization': `Bearer ${env.FLY_API_TOKEN}`,
          'Content-Type':  'application/json',
        },
        body: JSON.stringify({
          config: {
            image: imageRef,
            env:   envVars,
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
        }),
      },
    );
    if (!r.ok) {
      const errText = await r.text().catch(() => '');
      console.error('fly machine env PATCH failed', r.status, errText);
      return false;
    }
    return true;
  } catch (e) {
    console.error('fly machine env PATCH error', e?.message || e);
    return false;
  }
}

async function waitForMachineStarted(env, machineId, timeoutMs) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const r = await fetch(`${FLY_API_BASE}/apps/${encodeURIComponent(env.FLY_APP_NAME)}/machines/${encodeURIComponent(machineId)}`, {
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
