-- Per-email candidate-token rotation (2026-06-05).
-- Adds rotation linkage to cyborg_tokens so a re-issue for an existing
-- email rotates the old key (marks it rotated, points at the new) rather
-- than creating an independent second active token. Combined with the
-- partial unique index below, this enforces "one live key per email per
-- org" at the DB level.
--
-- Applied via Supabase MCP under migration name `cyborg_tokens_rotation`
-- on 2026-06-05. This file is the canonical source for git history.

alter table cyborg_tokens
  add column if not exists rotated_to_token text,
  add column if not exists rotated_at       timestamptz;

-- Partial unique: a candidate_email + organisation combo can have at most
-- ONE non-rotated, non-revoked token row at a time. Active rows are
-- (rotated_to_token IS NULL AND revoked_at IS NULL).
create unique index if not exists cyborg_tokens_live_per_email_uidx
  on cyborg_tokens (organisation_id, lower(candidate_email))
  where candidate_email is not null
    and rotated_to_token is null
    and revoked_at is null;
