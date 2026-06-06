-- v1.1 env composer: preset registry + org assignment matrix + campaign FK
-- (2026-06-06). Wave-1 schema; cached metadata for the YAML preset library
-- at cyborg/workspace-content/presets/v6.yaml.
--
-- Applied via Supabase MCP under migration name `presets_and_org_assignment`
-- on 2026-06-06. This file is the canonical source for git history.

-- ── presets: cached metadata from YAML library ─────────────────────────────
create table if not exists presets (
  id                uuid primary key default gen_random_uuid(),
  slug              text unique not null,           -- matches presets/v6.yaml `slug`
  display_name      text not null,
  description       text,
  key_source        text not null default 'byo',    -- 'byo' | 'vuelo' (wave-1: byo only)
  current_image_tag text,                            -- latest successful build (v6-<slug>-<sha>)
  current_git_sha   text,                            -- git sha of the build that produced the tag
  last_build_at     timestamptz,
  last_build_status text,                            -- 'success' | 'running' | 'failed' | null
  last_build_run_id text,                            -- GHA workflow_dispatch run id for polling
  created_at        timestamptz not null default now()
);

create index if not exists presets_slug_idx on presets (slug);

-- ── org_presets: which presets is each org allowed to use ─────────────────
create table if not exists org_presets (
  organisation_id uuid references organisations(id) on delete cascade,
  preset_id       uuid references presets(id) on delete cascade,
  assigned_at     timestamptz not null default now(),
  assigned_by     text,
  primary key (organisation_id, preset_id)
);

create index if not exists org_presets_preset_id_idx on org_presets (preset_id);

-- ── campaigns.preset_id: which preset does this campaign deploy ─────────
alter table campaigns
  add column if not exists preset_id uuid references presets(id) on delete set null;

create index if not exists campaigns_preset_id_idx on campaigns (preset_id);

-- ── Seed the 3 wave-1 presets so admin UI lists them before first build ─
insert into presets (slug, display_name, description, key_source) values
  ('haiku-byo',        'Haiku BYO (starter)',  'Haiku model, candidate brings own Claude key. Tight budget, small warehouse, 7-day deadline.',                  'byo'),
  ('sonnet-balanced',  'Sonnet balanced',      'Sonnet model, BYO key. Larger budget, medium warehouse, 14-day deadline.',                                       'byo'),
  ('opus-byo-loose',   'Opus BYO (loose)',     'Opus model, BYO key. Exploratory budget, large warehouse, 30-day deadline. Fewer tool restrictions.',           'byo')
on conflict (slug) do nothing;

-- ── Auto-assign all wave-1 presets to Vuelo Labs org so we can dogfood ──
-- (Customer orgs start empty; admin UI lets Vuelo admin tick presets per org.)
insert into org_presets (organisation_id, preset_id, assigned_by)
select o.id, p.id, 'migration:2026-06-06'
from organisations o
cross join presets p
where o.slug = 'vuelo-labs'
on conflict do nothing;

-- Rollback (manual):
--   alter table campaigns drop column if exists preset_id;
--   drop table if exists org_presets;
--   drop table if exists presets;
