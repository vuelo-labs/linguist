---
course-revision: 2026-05-05
---

# Glossary

Terms of art used across the 10-layer course. Each entry is one or two sentences plus a pointer to the layer that covers it deeply.

---

**`advisor-tool-2026-03-01`** — Beta header on the Anthropic API that enables the Advisor pattern: a fast executor model paired with a stronger reasoner that injects mid-generation strategic guidance. Public beta as of 2026-05-05. See [L9](09-managed-agents-memory-advisor.md).

**Advisor** — The pairing pattern (e.g. Haiku 4.5 executor + Opus 4.7 advisor) gated by the `advisor-tool-2026-03-01` header. The advisor doesn't replace the executor; it interjects strategy. See [L9](09-managed-agents-memory-advisor.md).

**`alwaysLoad`** — MCP server flag that pins tools into the cached tool-list across turns, preventing prompt-cache invalidation when the server reconnects or its tool inventory shifts. See [L6](06-tool-fluency.md), [L10](10-production-architecture.md).

**`ant` CLI** — Anthropic's first-party CLI client for the Claude API (launched 2026-04-08), with native Claude Code integration and YAML versioning of API resources. See [claude-code-best-practices-deep.md](claude-code-best-practices-deep.md).

**Automatic prompt caching** — GA on the Claude API as of 2026-02-19. A single `cache_control` field; the system auto-advances the cache point as the conversation grows. The discipline shifts from manual breakpoint placement to keeping the prefix stable. See [L10](10-production-architecture.md).

**`claude project purge`** — Slash/CLI command (v2.1.126) that removes all project-scoped state — settings, history, cached resources. See [L3](03-session-hygiene.md).

**`CLAUDE_CODE_FORK_SUBAGENT`** — Environment-variable flag (`=1`) enabling fork semantics for in-CLI subagents: the subagent inherits the parent's prompt cache rather than starting fresh, with a roughly 3× cache-cost reduction (v2.1.128). See [L8](08-agent-design.md).

**Compaction API** — Server-side rolling-summary primitive on the Anthropic API (Opus 4.6, beta as of 2026-05-05). Replaces hand-rolled summarisation for long-running API workloads. See [L4](04-context-awareness.md), [L10](10-production-architecture.md).

**`context: fork`** — `SKILL.md` frontmatter directive that activates the skill in a fresh sub-context rather than inline in the parent. Deferred tools (WebSearch, WebFetch) become available on first turn (v2.1.126). See [L7](07-skills-plugins-hooks.md).

**Frontmatter sub-agent** — A subagent declared as a Markdown file with YAML frontmatter (name, description, allowed tools, per-agent `mcpServers`). The 2026 replacement for the historical "Agent tool" mental model. See [L8](08-agent-design.md).

**Hook** — A harness-executed shell command or MCP tool call fired on a defined event (`PreToolUse`, `PostToolUse`, `SessionStart`, `mcp_tool`, …). Hooks change what the *harness* does around model actions, regardless of model decisions. See [L7](07-skills-plugins-hooks.md).

**`inference_geo`** — Request-level field on the Claude API for data-residency control. Production primitive in the 2026 lineup. See [L10](10-production-architecture.md).

**Managed Agent** — A hosted, sandboxed agent loop on Anthropic's infra with built-in tools and SSE streaming. Public beta as of 2026-05-05; beta header `managed-agents-2026-04-01`. See [L9](09-managed-agents-memory-advisor.md).

**Memory** — File-backed cross-session state store inside Managed Agents — scoped, audited, exportable. Public beta as of 2026-05-05; same beta header as Managed Agents. See [L9](09-managed-agents-memory-advisor.md), [L3](03-session-hygiene.md).

**`output_config.format`** — Structured-outputs parameter on the Claude API (GA 2026-02-05; renamed from `output_format`). Constrains output at decode time to JSONSchema, enums, or typed fields. See [L5](05-output-engineering.md).

**Plugin** — An installable bundle of Skills, slash commands, agents, hooks, and MCP servers shipped as one unit. Persists across sessions at user or project level. See [L7](07-skills-plugins-hooks.md).

**Skill / SKILL.md** — A folder containing a `SKILL.md` file with YAML frontmatter (`name`, `description`, optionally `context: fork`) and a body. The model activates the skill when its `description` matches the current request, or the user does so explicitly via `/skills`. See [L7](07-skills-plugins-hooks.md).

**Structured outputs** — The category that `output_config.format` belongs to: API-side, decode-time shape constraints. See [L5](05-output-engineering.md).

**`/usage`** — Slash command that replaces the older `/cost` and `/stats` pair, surfacing token spend, cache hit rate, and rate-limit headroom in one view. See [L3](03-session-hygiene.md), [L6](06-tool-fluency.md).

**`xhigh` effort** — Reasoning-effort level introduced with Opus 4.7 (2026-04-16), above `high`. Pair with per-task token budgets rather than as a global setting. See [L5](05-output-engineering.md).
