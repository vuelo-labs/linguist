-- v3 token request flow: pending requests + approval gate on tokens.
-- Run in Supabase SQL editor.

-- ── Pending request table ───────────────────────────────────────────────────
create table if not exists cyborg_token_requests (
  request_id      uuid primary key default gen_random_uuid(),
  name            text not null,
  email           text not null,
  notes           text,
  ip              text,
  country         text,
  user_agent      text,
  status          text not null default 'pending',   -- pending | approved | rejected
  token           text,                              -- cyb_* token, null until approved
  rejection_jokes jsonb,                             -- dad jokes from icanhazdadjoke
  created_at      timestamptz not null default now(),
  decided_at      timestamptz
);

create index if not exists cyborg_token_requests_email_idx  on cyborg_token_requests(email);
create index if not exists cyborg_token_requests_status_idx on cyborg_token_requests(status);

alter table cyborg_token_requests enable row level security;
-- (no policies = anon gets nothing; service role bypasses RLS)

-- ── Approval gate on existing tokens ────────────────────────────────────────
alter table cyborg_tokens add column if not exists approved_at timestamptz;

-- Auto-approve any tokens that already exist (admin-minted via mint.js).
-- New tokens minted via the request flow start with approved_at NULL until
-- the operator approves; admin-minted tokens always set approved_at = now().
update cyborg_tokens set approved_at = issued_at where approved_at is null;
