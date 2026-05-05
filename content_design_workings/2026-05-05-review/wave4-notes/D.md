# Wave 4 — D notes (00-index, glossary, URL audit)

_Live log. 2026-05-05._

## Plan
- Rewrite 00-index.md against the final 10-layer spine.
- Drop pre-Wave-2.5 banner. Keep `course-revision: 2026-05-05`.
- New skill-stack table (10 rows) sourced from each module's actual opening.
- "How to read this course in 2026" sidebar.
- Glossary as separate `course/glossary.md`.
- URL audit at `wave4-notes/D-url-audit.md`.

## Module openings (one-line theses extracted)
- L1: Model executes text, not intent. Tools are how it acts.
- L2: Verb signals scope; targets prevent search; constraints set the ceiling.
- L3: Persistent state in three places — CLAUDE.md, settings.json, Memory — three lifetimes/audit profiles.
- L4: Pick the right context primitive (manual checkpoint / `/compact` / Compaction API / Memory / `context: fork`) for the substrate in front of you.
- L5: API output primitives first (structured outputs, effort, budgets, `thinking.display`); prompt mechanics second.
- L6: 2026 tool *taxonomy* — built-in / MCP / Skill / deferred / sub-agent-as-tool — plus cost-axis discipline beyond token count.
- L7: Skills vs Plugins vs Hooks — different mechanism, lifetime, activation surface; pick one.
- L8: In-CLI subagent design — context isolation, fork semantics, cache sharing, per-agent `mcpServers`.
- L9: Hosted Managed Agents, Memory store, Advisor pattern — substrate shifts beyond the in-CLI loop.
- L10: Auto-caching is the default; the discipline is cache-bust hygiene + production primitives (residency, rate limits, Compaction API, model selection).

## URL audit findings
- L7 has `code.claude.com/docs/en/hooks` while the link text says `docs.claude.com hooks`. Canonicalise to `docs.claude.com` (matches text + L9/L10 convention of `platform.claude.com` for SDK/managed, but hooks live under docs.claude.com — actually they're under `docs.claude.com/en/docs/claude-code/hooks`). Fix both occurrences.
- All other claude-doc references use `platform.claude.com/docs/...` consistently. Leave them.
- Required additions: anthropics/skills, agentskills.io, plugins README, Managed Agents docs, Memory docs, Advisor announcement, Opus 4.7 announcement + migration guide — all already present in L7/L9. Good.

## Decision: glossary as sibling file
`course/glossary.md` per task recommendation. Index references it.
