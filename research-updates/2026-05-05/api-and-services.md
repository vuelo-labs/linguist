# Anthropic API & Platform Services — Updates

_Snapshot: 2026-05-05. Window: ~Feb–May 2026._

Source of truth: [Claude Platform release notes](https://platform.claude.com/docs/en/release-notes/api).

## New models

- **Claude Opus 4.7** (Apr 16, 2026) — `claude-opus-4-7`. SOTA on SWE-bench Verified, vision, long-horizon agentic coding. Same $5 / $25 per MTok pricing as 4.6. New `xhigh` effort level. Available on Claude API, Bedrock, Vertex AI, Microsoft Foundry. API breaking changes vs 4.6 — see [migration guide](https://platform.claude.com/docs/en/about-claude/models/migration-guide#migrating-to-claude-opus-4-7). [Announcement](https://www.anthropic.com/news/claude-opus-4-7).
- **Claude Sonnet 4.6** (Feb 17, 2026) — improved agentic search, fewer tokens, supports extended thinking + 1M context (now GA at standard pricing).
- **Claude Opus 4.6** (Feb 5, 2026) — adaptive thinking by default; manual `budget_tokens` deprecated; no assistant prefilling; compaction API (beta) introduced for it.

## Retirements / deprecations

- **Apr 30, 2026** — 1M context beta retired for Sonnet 4.5 / Sonnet 4 (`context-1m-2025-08-07` no longer effective). Migrate to Sonnet 4.6 / Opus 4.6 (1M GA).
- **Apr 20, 2026** — Claude Haiku 3 retired.
- **Apr 14, 2026** — Sonnet 4 + Opus 4 deprecation announced; retire **Jun 15, 2026**.
- **Feb 19, 2026** — Sonnet 3.7 + Haiku 3.5 retired.

## Agents platform

- **Apr 8, 2026 — Claude Managed Agents** (public beta). Hosted agent harness with sandboxes, built-in tools, SSE streaming. Beta header: `managed-agents-2026-04-01`. [Docs](https://platform.claude.com/docs/en/managed-agents/overview). Background: [SiliconANGLE](https://siliconangle.com/2026/04/08/anthropic-launches-claude-managed-agents-speed-ai-agent-development/).
- **Apr 23, 2026 — Memory for Managed Agents** (public beta). Cross-session learning via filesystem-backed stores, scoped permissions, audit logs, API export, concurrent multi-agent stores. Same beta header as Managed Agents. [Docs](https://platform.claude.com/docs/en/managed-agents/memory) · [Coverage](https://www.testingcatalog.com/anthropic-launches-memory-in-claude-agents-for-enterprise/).
- **Apr 8, 2026 — `ant` CLI** launched. CLI client for the Claude API, native Claude Code integration, YAML versioning of API resources. [Reference](https://platform.claude.com/docs/en/api/sdks/cli).

## API features

- **Apr 24, 2026 — Rate Limits API** — programmatically query org/workspace rate limits.
- **Apr 9, 2026 — Advisor tool** (public beta, header `advisor-tool-2026-03-01`). Pair fast executor model with stronger advisor for mid-generation strategic guidance — close to advisor-solo quality at executor pricing on long-horizon agentic workloads.
- **Mar 30, 2026** — `max_tokens` cap raised to **300k** on Message Batches API for Opus 4.6 / Sonnet 4.6 via `output-300k-2026-03-24` beta header.
- **Mar 18, 2026 — Models API capabilities** — `GET /v1/models` now returns `max_input_tokens`, `max_tokens`, `capabilities`.
- **Mar 16, 2026 — `thinking.display: "omitted"`** — drop thinking content from streaming responses for speed; signature preserved for multi-turn continuity. Billing unchanged.
- **Mar 13, 2026 — 1M context GA** for Opus 4.6 + Sonnet 4.6 at standard pricing, dedicated 1M rate limits removed, image/PDF limit raised 100→600 per request.
- **Feb 19, 2026 — Automatic prompt caching** — single `cache_control` field; system auto-advances cache point as conversation grows. No manual breakpoint mgmt. Available on Claude API + Azure AI Foundry preview.
- **Feb 7, 2026 — Fast mode** (research preview) — up to 2.5× output speed on Opus 4.6 at premium pricing, via `speed` param. [Waitlist](https://claude.com/fast-mode).
- **Feb 5, 2026 — Compaction API** (beta) — server-side context summarization for effectively-infinite conversations on Opus 4.6.
- **Feb 5, 2026 — Data residency controls** — `inference_geo` parameter; US-only inference at 1.1× pricing for models post-2026-02-01.
- **Feb 5, 2026 — Effort parameter GA** — replaces `budget_tokens` on new models.
- **Feb 5, 2026 — Fine-grained tool streaming GA**; `output_format` → `output_config.format`.

## Cloud / regional

- **Apr 16, 2026** — Claude in Amazon Bedrock open to all Bedrock customers. Opus 4.7 + Haiku 4.5 self-serve via `/anthropic/v1/messages`, 27 AWS regions, global + regional endpoints.
- **Apr 7, 2026** — Messages API research preview on Bedrock (us-east-1; AWS-managed, zero operator access).

## Programs / previews

- **Apr 7, 2026 — Claude Mythos Preview** — gated research preview for defensive cybersecurity ([Project Glasswing](https://anthropic.com/glasswing)). Invite-only.

## Notes

- All April 2026 dates verified against the official platform release notes page.
- Pricing for Opus 4.7 explicitly held flat at Opus 4.6 levels ($5 / $25 per MTok).
