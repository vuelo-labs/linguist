-- Add candidate_email column to cyborg_tokens.
-- 2026-06-05 — needed by the admin-panel candidate-issue flow so the
-- linguist worker can send the launch URL via Resend at issue time, and
-- so a future rotation/idempotency layer can address tokens by email
-- (instead of parsing the freeform `candidate_label` string).
--
-- Nullable for back-compat — every token issued before this migration
-- has its email embedded in candidate_label (typical shape: "Alex Doe
-- (alex@example.com)"). Going forward the column is populated by
-- /cyborg/app/api/candidates/issue and by the public approval flow at
-- /cyborg/approve when a request_id maps back to a known email.

alter table cyborg_tokens
  add column if not exists candidate_email text;

-- Lower-case index to support case-insensitive lookups for the future
-- per-email rotation logic. Partial: only active (non-revoked, non-used)
-- tokens contribute to uniqueness within an org.
create index if not exists cyborg_tokens_email_lower_idx
  on cyborg_tokens (lower(candidate_email))
  where candidate_email is not null;
