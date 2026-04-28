-- v4 fast-follow future-proofing: vendor + cost ledger columns.
-- Reserves schema for M20 (agent-assessed correction events with cost cap)
-- and multi-vendor support (Codex / Gemini / Copilot). v4 launch is Claude-only;
-- these columns are written/read by fast-follow work, not by anything in v4.
--
-- Run in Supabase SQL editor.

-- ── cyborg_tokens: vendor + per-candidate cost ledger ────────────────────────
alter table cyborg_tokens add column if not exists vendor            text    not null default 'claude';
alter table cyborg_tokens add column if not exists cost_budget_usd   numeric;
alter table cyborg_tokens add column if not exists cost_consumed_usd numeric not null default 0;

-- ── cyborg_submissions: vendor (lets fast-follow filter without migration) ───
alter table cyborg_submissions add column if not exists vendor text not null default 'claude';
