-- 2026-06-05: extend the "one live key per email per org" partial unique
-- index to also exclude tokens that have already been used (submitted
-- against). Otherwise: a candidate who submits then needs a fresh
-- assessment is stuck — issue.js can't mint a second token for their
-- email because the old (used) row blocks the unique constraint.
--
-- Applied via Supabase MCP under migration name
-- `cyborg_tokens_live_excludes_used` on 2026-06-05.

drop index if exists cyborg_tokens_live_per_email_uidx;

create unique index if not exists cyborg_tokens_live_per_email_uidx
  on cyborg_tokens (organisation_id, lower(candidate_email))
  where candidate_email is not null
    and rotated_to_token is null
    and revoked_at is null
    and used_at is null;
