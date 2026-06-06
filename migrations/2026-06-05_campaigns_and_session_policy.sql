-- Per-token campaign linkage (2026-06-05).
--
-- Discovered at apply time: the `campaigns` table already existed (created by
-- a prior unstaged migration) with a richer schema than this file originally
-- declared. Existing shape:
--   id uuid pk, organisation_id uuid fk, name text, slug text, status text,
--   description text, settings jsonb, created_at timestamptz, created_by uuid,
--   archived_at timestamptz
--
-- We reuse the existing `settings` JSONB column for what the spine calls
-- `session_policy` — same intent (operator-tunable knob blob), no schema drift.
-- The shape (validated app-side in admin/config/_knobs.js; see also
-- planning/control-spine.md § KNOBS for the canonical knob catalogue):
--   {
--     "pin_model": "claude-haiku-4-5",
--     "token_budget": 500000,
--     "token_rate_cap_per_minute": 50000,
--     "disallowed_tools": ["WebFetch", "WebSearch"],
--     "block_external_https": false
--   }
-- An empty {} means "use cyborg-side defaults baked into the image."
--
-- Net schema change applied by this migration: ADD COLUMN campaign_id to
-- cyborg_tokens (nullable FK to campaigns(id) with ON DELETE SET NULL) plus
-- a supporting index.
--
-- Applied via Supabase MCP under migration name `campaigns_and_session_policy`
-- on 2026-06-05. This file is the canonical source for git history.

-- Idempotent guards so this can be re-run on a database that already has the
-- table from a prior unstaged migration.
create table if not exists campaigns (
  id              uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references organisations(id) on delete cascade,
  name            text not null,
  created_at      timestamptz not null default now(),
  settings        jsonb not null default '{}'::jsonb
);

create index if not exists campaigns_organisation_id_idx
  on campaigns (organisation_id);

-- Link tokens to their campaign. Nullable so existing Vuelo-internal tokens
-- (which predate campaigns) keep working with image-baked defaults.
alter table cyborg_tokens
  add column if not exists campaign_id uuid references campaigns(id) on delete set null;

create index if not exists cyborg_tokens_campaign_id_idx
  on cyborg_tokens (campaign_id);

-- Rollback (manual, if needed):
--   alter table cyborg_tokens drop column if exists campaign_id;
--   -- campaigns table NOT dropped here because it predated this migration.
