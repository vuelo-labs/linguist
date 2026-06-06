"""
cyborg-warmer — maintains pre-warmed Fly machine pools per preset.

A single always-on Python process. Every tick (~60s):

  1. For each `presets` row with `target_pool_size > 0`:
       deficit = target_pool_size - (ready + warming)
       if (ready + warming) >= max_pool_size: skip (hard cap)
       spawn `deficit` fresh Fly machines (one at a time; bail on first
       Fly API error to avoid runaway-create on bad credentials).
  2. Reconcile every `preset_machine_pool` row in {warming, ready}:
       - warming > 5 min old → kill the Fly machine + mark `failed`
       - warming + Fly state=='started' → /healthz probe → ready or stay
       - ready → leave alone (claim_pooled_machine RPC flips them to
         'claimed' from launch.js's hot path; we never call it).

The warmer never calls `claim_pooled_machine`. It never touches
`claimed` / `destroying` rows — that lane belongs to launch.js and the
candidate destroy path. We only own the warming and ready lanes plus
deficit-spawn.

Env contract (crash on missing):
  FLY_API_TOKEN          — deploy-scoped Fly token for the candidate-pool app
  SUPABASE_URL           — Supabase project URL
  SUPABASE_SERVICE_KEY   — Supabase service-role key (RLS bypass)

Optional env (defaults):
  FLY_APP_NAME           — defaults to 'cyborg-candidate-pool'
  FLY_REGION             — defaults to 'lhr'
  SUBMISSION_ENDPOINT    — defaults to 'https://linguist.vuelolabs.com/cyborg/submit'
  WARMER_TICK_SEC        — defaults to 60
  WARMING_TIMEOUT_SEC    — defaults to 300 (5 min)
  HEALTHZ_TIMEOUT_SEC    — defaults to 1
  MACHINE_CPUS           — defaults to 2 (mirrors launch.js)
  MACHINE_MEMORY_MB      — defaults to 2048 (mirrors launch.js)

Logs structured JSON lines to stdout; Fly's log collector tails them.

This process is intentionally idle for long stretches. CPU/memory
footprint is tiny — one Fly shared-cpu-1x / 512mb machine is fine.
"""

import json
import os
import sys
import time
import traceback
import uuid
from datetime import datetime, timedelta, timezone

import httpx
from supabase import create_client

# ── Constants ───────────────────────────────────────────────────────────────
FLY_API_BASE = "https://api.machines.dev/v1"
SENTINEL_TOKEN = "__pool_pending__"  # marks a pre-warmed machine pre-claim


# ── Logging ────────────────────────────────────────────────────────────────
def log(level: str, msg: str, **fields) -> None:
    """Structured JSON log line to stdout. Fly logs picks them up."""
    record = {
        "ts": datetime.now(timezone.utc).isoformat(),
        "level": level,
        "msg": msg,
        **fields,
    }
    print(json.dumps(record, default=str), flush=True)


# ── Env ─────────────────────────────────────────────────────────────────────
def _require_env(key: str) -> str:
    val = os.environ.get(key)
    if not val:
        log("error", "missing required env", key=key)
        sys.exit(1)
    return val


FLY_API_TOKEN = _require_env("FLY_API_TOKEN")
SUPABASE_URL = _require_env("SUPABASE_URL")
SUPABASE_SERVICE_KEY = _require_env("SUPABASE_SERVICE_KEY")

FLY_APP_NAME = os.environ.get("FLY_APP_NAME", "cyborg-candidate-pool")
FLY_REGION = os.environ.get("FLY_REGION", "lhr")
SUBMISSION_ENDPOINT = os.environ.get(
    "SUBMISSION_ENDPOINT", "https://linguist.vuelolabs.com/cyborg/submit"
)
TICK_SEC = int(os.environ.get("WARMER_TICK_SEC", "60"))
WARMING_TIMEOUT_SEC = int(os.environ.get("WARMING_TIMEOUT_SEC", "300"))
HEALTHZ_TIMEOUT_SEC = float(os.environ.get("HEALTHZ_TIMEOUT_SEC", "1"))
MACHINE_CPUS = int(os.environ.get("MACHINE_CPUS", "2"))
MACHINE_MEMORY_MB = int(os.environ.get("MACHINE_MEMORY_MB", "2048"))

# Shared httpx client for Fly API calls. 15s default is generous; we don't
# expect long-blocking Fly calls — create returns near-instantly.
fly_client = httpx.Client(
    timeout=15.0,
    headers={
        "Authorization": f"Bearer {FLY_API_TOKEN}",
        "Content-Type": "application/json",
    },
)


# ── Supabase ───────────────────────────────────────────────────────────────
supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)


# ── Fly Machines API ───────────────────────────────────────────────────────
def fly_create_machine(machine_name: str, image: str, env_vars: dict) -> dict | None:
    """POST /apps/<app>/machines. Mirrors the launch.js config for parity.
    Returns the machine JSON on 200, None on any failure."""
    config = {
        "name": machine_name,
        "region": FLY_REGION,
        "config": {
            "image": image,
            "env": env_vars,
            "services": [
                {
                    "ports": [
                        {"port": 443, "handlers": ["tls", "http"]},
                        {"port": 80, "handlers": ["http"], "force_https": True},
                    ],
                    "protocol": "tcp",
                    "internal_port": 3000,
                    "auto_stop_machines": "off",
                    "auto_start_machines": False,
                    "min_machines_running": 1,
                }
            ],
            "guest": {
                "cpu_kind": "shared",
                "cpus": MACHINE_CPUS,
                "memory_mb": MACHINE_MEMORY_MB,
            },
            "auto_destroy": False,
        },
    }
    try:
        r = fly_client.post(
            f"{FLY_API_BASE}/apps/{FLY_APP_NAME}/machines",
            json=config,
        )
    except httpx.HTTPError as exc:
        log("error", "fly create error", machine_name=machine_name, error=str(exc))
        return None
    if r.status_code >= 300:
        log(
            "error",
            "fly create failed",
            machine_name=machine_name,
            status=r.status_code,
            body=r.text[:500],
        )
        return None
    return r.json()


def fly_get_machine_state(machine_id: str) -> str | None:
    """GET /apps/<app>/machines/<id>. Returns the `state` field or None on error."""
    try:
        r = fly_client.get(f"{FLY_API_BASE}/apps/{FLY_APP_NAME}/machines/{machine_id}")
    except httpx.HTTPError as exc:
        log("warn", "fly get state error", machine_id=machine_id, error=str(exc))
        return None
    if r.status_code == 404:
        return "destroyed"  # Fly returns 404 once GC catches up
    if r.status_code >= 300:
        log(
            "warn",
            "fly get state failed",
            machine_id=machine_id,
            status=r.status_code,
        )
        return None
    return r.json().get("state")


def fly_destroy_machine(machine_id: str) -> bool:
    """DELETE /apps/<app>/machines/<id>?force=true. Stuck-warming cleanup."""
    try:
        r = fly_client.delete(
            f"{FLY_API_BASE}/apps/{FLY_APP_NAME}/machines/{machine_id}",
            params={"force": "true"},
        )
    except httpx.HTTPError as exc:
        log("error", "fly destroy error", machine_id=machine_id, error=str(exc))
        return False
    if r.status_code >= 300 and r.status_code != 404:
        log(
            "error",
            "fly destroy failed",
            machine_id=machine_id,
            status=r.status_code,
            body=r.text[:300],
        )
        return False
    return True


def probe_healthz(machine_id: str) -> bool:
    """GET https://<app>.fly.dev/healthz with fly-prefer-instance-id header.
    Used to gate warming → ready. Container's /healthz must respond 200 once
    boot is complete."""
    url = f"https://{FLY_APP_NAME}.fly.dev/healthz"
    try:
        r = httpx.get(
            url,
            headers={"fly-prefer-instance-id": machine_id},
            timeout=HEALTHZ_TIMEOUT_SEC,
        )
    except httpx.HTTPError:
        return False
    return r.status_code == 200


# ── DB helpers ─────────────────────────────────────────────────────────────
def list_active_presets() -> list[dict]:
    """Presets with target_pool_size > 0 and a built image. Anything without
    `current_image_tag` can't be spawned; skip with a warn."""
    resp = (
        supabase.table("presets")
        .select("id, slug, current_image_tag, target_pool_size, max_pool_size")
        .gt("target_pool_size", 0)
        .execute()
    )
    rows = resp.data or []
    out = []
    for row in rows:
        if not row.get("current_image_tag"):
            log(
                "warn",
                "preset has target_pool_size but no current_image_tag; skipping",
                preset=row.get("slug"),
                preset_id=row.get("id"),
            )
            continue
        out.append(row)
    return out


def count_pool_state(preset_id: str, state: str) -> int:
    resp = (
        supabase.table("preset_machine_pool")
        .select("id", count="exact")
        .eq("preset_id", preset_id)
        .eq("state", state)
        .execute()
    )
    return resp.count or 0


def insert_pool_row(preset_id: str, machine_id: str, machine_name: str) -> None:
    supabase.table("preset_machine_pool").insert(
        {
            "preset_id": preset_id,
            "fly_machine_id": machine_id,
            "fly_machine_name": machine_name,
            "state": "warming",
            "created_at": datetime.now(timezone.utc).isoformat(),
        }
    ).execute()


def list_rows_by_state(state: str) -> list[dict]:
    resp = (
        supabase.table("preset_machine_pool")
        .select("id, preset_id, fly_machine_id, fly_machine_name, state, created_at")
        .eq("state", state)
        .execute()
    )
    return resp.data or []


def mark_ready(row_id: str) -> None:
    supabase.table("preset_machine_pool").update(
        {
            "state": "ready",
            "warmed_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat(),
        }
    ).eq("id", row_id).execute()


def mark_failed(row_id: str, reason: str) -> None:
    supabase.table("preset_machine_pool").update(
        {
            "state": "failed",
            "failure_reason": reason,
            "updated_at": datetime.now(timezone.utc).isoformat(),
        }
    ).eq("id", row_id).execute()


# ── Tick logic ─────────────────────────────────────────────────────────────
def spawn_for_preset(preset: dict) -> None:
    """Spawn `deficit` machines for one preset. Bails on first Fly error so
    a misconfigured token doesn't burn machines in a loop."""
    preset_id = preset["id"]
    slug = preset["slug"]
    target = preset.get("target_pool_size") or 0
    max_pool = preset.get("max_pool_size") or 5
    image_tag = preset["current_image_tag"]

    ready_count = count_pool_state(preset_id, "ready")
    warming_count = count_pool_state(preset_id, "warming")
    total = ready_count + warming_count

    if total >= max_pool:
        log(
            "info",
            "pool at max_pool_size; skipping",
            preset=slug,
            ready=ready_count,
            warming=warming_count,
            max_pool=max_pool,
        )
        return

    deficit = max(0, target - total)
    if deficit == 0:
        return

    # Don't blow past max_pool even if target says otherwise.
    deficit = min(deficit, max_pool - total)

    log(
        "info",
        "spawning for preset",
        preset=slug,
        ready=ready_count,
        warming=warming_count,
        target=target,
        deficit=deficit,
    )

    image = f"registry.fly.io/{FLY_APP_NAME}:{image_tag}"
    env_vars = {
        "CANDIDATE_TOKEN": SENTINEL_TOKEN,
        "SUBMISSION_ENDPOINT": SUBMISSION_ENDPOINT,
        # Fly env values must be strings; epoch zero is the sentinel for
        # "no real deadline yet" — launch.js patches the env at claim time.
        "DEADLINE": "1970-01-01T00:00:00Z",
        "PROFILE": slug,
    }

    for _ in range(deficit):
        # 8-char slug + 8 hex = pool-abcdefgh-12345678 (within Fly's 30-char limit).
        machine_name = f"pool-{slug[:8]}-{uuid.uuid4().hex[:8]}"
        machine = fly_create_machine(machine_name, image, env_vars)
        if not machine:
            log(
                "error",
                "bail on Fly create failure; will retry next tick",
                preset=slug,
            )
            return
        try:
            insert_pool_row(preset_id, machine["id"], machine_name)
        except Exception as exc:
            # Orphan-machine guard: DB insert failed but the Fly machine
            # exists. Destroy it so we don't bill for an unreferenced VM.
            log(
                "error",
                "DB insert failed; destroying orphan Fly machine",
                preset=slug,
                machine_id=machine["id"],
                error=str(exc),
            )
            fly_destroy_machine(machine["id"])
            return
        log(
            "info",
            "spawned",
            preset=slug,
            machine_id=machine["id"],
            machine_name=machine_name,
            state="warming",
        )


def reconcile_warming() -> None:
    """For each warming row: timeout-kill, or probe + flip to ready."""
    now = datetime.now(timezone.utc)
    timeout = timedelta(seconds=WARMING_TIMEOUT_SEC)

    rows = list_rows_by_state("warming")
    for row in rows:
        machine_id = row["fly_machine_id"]
        created_at_str = row["created_at"]
        # Supabase returns ISO 8601 with timezone; fromisoformat handles both.
        created_at = datetime.fromisoformat(created_at_str.replace("Z", "+00:00"))
        age = now - created_at

        if age > timeout:
            log(
                "warn",
                "warming timed out; destroying",
                machine_id=machine_id,
                age_sec=int(age.total_seconds()),
            )
            fly_destroy_machine(machine_id)
            mark_failed(row["id"], "warming_timeout")
            continue

        fly_state = fly_get_machine_state(machine_id)
        if fly_state != "started":
            # Still booting — leave the row alone, recheck next tick.
            continue

        if probe_healthz(machine_id):
            mark_ready(row["id"])
            log(
                "info",
                "warmed → ready",
                machine_id=machine_id,
                age_sec=int(age.total_seconds()),
            )
        # If /healthz isn't 200 yet but Fly says started, app is still
        # initializing inside the container. Leave warming for the next tick.


def tick() -> None:
    """One full pass: spawn-for-deficit + reconcile-warming. Each preset is
    isolated — one preset's failure shouldn't block the others."""
    presets = list_active_presets()
    log("info", "tick start", presets=len(presets))

    for preset in presets:
        try:
            spawn_for_preset(preset)
        except Exception as exc:
            log(
                "error",
                "spawn_for_preset crashed",
                preset=preset.get("slug"),
                error=str(exc),
                trace=traceback.format_exc(limit=3),
            )

    try:
        reconcile_warming()
    except Exception as exc:
        log(
            "error",
            "reconcile_warming crashed",
            error=str(exc),
            trace=traceback.format_exc(limit=3),
        )


def main() -> None:
    log(
        "info",
        "warmer starting",
        fly_app=FLY_APP_NAME,
        region=FLY_REGION,
        tick_sec=TICK_SEC,
        warming_timeout_sec=WARMING_TIMEOUT_SEC,
    )
    while True:
        try:
            tick()
        except Exception as exc:
            # Outer-loop catch-all: a bad tick must not crash the process.
            # Restart on next sleep cycle.
            log(
                "error",
                "tick crashed; sleeping and retrying",
                error=str(exc),
                trace=traceback.format_exc(limit=3),
            )
        time.sleep(TICK_SEC)


if __name__ == "__main__":
    main()
