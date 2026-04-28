-- v3 security pass: per-candidate tokens, RLS, unique constraint.
-- Run in Supabase SQL editor.

-- ── Token table ──────────────────────────────────────────────────────────────
create table if not exists cyborg_tokens (
  token            text primary key,
  candidate_label  text,
  issued_at        timestamptz not null default now(),
  expires_at       timestamptz not null,
  used_at          timestamptz,
  revoked_at       timestamptz,
  notes            text
);

create index if not exists cyborg_tokens_expires_at_idx on cyborg_tokens(expires_at);
create index if not exists cyborg_tokens_used_at_idx    on cyborg_tokens(used_at);

-- ── Submissions: one per token (idempotent, prevents replay) ────────────────
create unique index if not exists cyborg_submissions_candidate_token_uidx
  on cyborg_submissions(candidate_token);

-- ── RLS — anon key gets nothing; service role bypasses RLS ──────────────────
alter table cyborg_submissions enable row level security;
alter table cyborg_tokens      enable row level security;

-- (No policies = no access for anon. Service-role bypasses RLS.)
-- The Cloudflare worker uses SUPABASE_SERVICE_KEY, so it still works.
