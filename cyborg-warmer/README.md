# cyborg-warmer

Maintains pre-warmed Fly machine pools per preset, so candidate launches
go from 30-60s (cold start) to 3-5s (claim a pre-warmed machine).

Deployed as its own Fly app (`cyborg-pool-warmer`). The candidate
machines live in a separate Fly app (`cyborg-candidate-pool`); this
process holds a deploy-scoped token for that app and creates machines in
it via the Fly Machines API.

## What it does

Every `WARMER_TICK_SEC` (default 60s):

1. For each `presets` row with `target_pool_size > 0`:
   - Counts `ready` + `warming` rows in `preset_machine_pool`.
   - If below `target_pool_size` (and below `max_pool_size`), spawns the
     deficit fresh Fly machines with the preset's `current_image_tag`.
2. For each row in `state='warming'`:
   - If older than 5 min: destroys the Fly machine, marks row `failed`.
   - Else fetches Fly state; if `started`, probes
     `https://cyborg-candidate-pool.fly.dev/healthz` with
     `fly-prefer-instance-id: <machine_id>` (1s timeout). 200 → flips
     row to `ready`.
3. Does **not** call `claim_pooled_machine` — that RPC is invoked from
   `linguist/functions/cyborg/launch.js`. The warmer never touches
   `claimed` or `destroying` rows.

## Env contract

Required (crash on missing):

- `FLY_API_TOKEN` — deploy-scoped Fly token for the candidate-pool app
- `SUPABASE_URL`
- `SUPABASE_SERVICE_KEY`

Optional:

- `FLY_APP_NAME` (default `cyborg-candidate-pool`)
- `FLY_REGION` (default `lhr`)
- `SUBMISSION_ENDPOINT` (default `https://linguist.vuelolabs.com/cyborg/submit`)
- `WARMER_TICK_SEC` (default `60`)
- `WARMING_TIMEOUT_SEC` (default `300`)
- `HEALTHZ_TIMEOUT_SEC` (default `1`)
- `MACHINE_CPUS` (default `2`)
- `MACHINE_MEMORY_MB` (default `2048`)

## Deploy

From `linguist/cyborg-warmer/`:

```bash
# One-time:
fly apps create cyborg-pool-warmer --org vuelo-labs

fly secrets set \
  FLY_API_TOKEN=fo1_... \
  SUPABASE_URL=https://<ref>.supabase.co \
  SUPABASE_SERVICE_KEY=eyJ... \
  --app cyborg-pool-warmer

# Each deploy:
fly deploy --config fly.toml
```

The Fly token must be deploy-scoped for `cyborg-candidate-pool` (not the
warmer's own app) since that's where the candidate machines live.

## Observability

```bash
fly logs --app cyborg-pool-warmer
```

Every line is structured JSON:

```json
{"ts":"2026-06-06T18:00:00+00:00","level":"info","msg":"spawned",
 "preset":"v6-recruiter_full","machine_id":"...","state":"warming"}
```

Key messages to grep for:
- `"msg":"tick start"` — once per cycle, shows preset count
- `"msg":"spawned"` — a new Fly machine entered the warming lane
- `"msg":"warmed → ready"` — a machine passed /healthz and is claimable
- `"msg":"warming timed out; destroying"` — a stuck machine got killed
- `"msg":"bail on Fly create failure"` — Fly API is unhappy; check token

## Operational notes

- The warmer is intentionally idle for long stretches; one shared-cpu-1x
  / 512mb machine is sized for that. CPU stays under 1%.
- Misconfigured `FLY_API_TOKEN` causes `bail on Fly create failure`
  every tick (60s) — log volume stays low, no runaway machine creation.
- Single instance is fine. Two warmers would double-spawn for the same
  deficit (no row-level lock on the count→spawn gap). Fly's `[processes]`
  default is one machine per app, which is what we want.
