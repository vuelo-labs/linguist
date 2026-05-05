# Linguist Course — Freshness Audit (2026-05-05)

Audit of the eight-layer course + two best-practices appendices against the 2026-05-05 ecosystem snapshot. Per-module findings, then summary table.

Severity legend: **Blocker** (factually wrong / will mislead), **Update** (incomplete or framing-stale), **Nit** (minor).

A handful of findings recur across modules (every module is grounded in Claude Code internal source-code paths like `services/compact/prompt.ts`, `constants/prompts.ts`, `utils/api.ts`, `tools/AgentTool/prompt.ts`). These citations have not been re-verified against current Claude Code v2.1.128 source — the harness has been through ~14 minor versions in April–May 2026 (auto mode, plan mode changes, MCP hooks, skill OTEL events, plugins, etc.). Where the cited file/symbol may have moved or been renamed, that's an Update-level risk on every module rather than a per-line Blocker.

---

## 00-index.md

1. **Source-code citation footer** (line 56). `services/compact/prompt.ts`, `constants/prompts.ts`, `utils/api.ts`, `utils/claudemd.ts`, `services/compact/autoCompact.ts`, `tools/AgentTool/prompt.ts` — these paths/names predate Claude Code 2.1.x. Likely partly stale (no re-verification done in research). **Update**.
2. **No mention of Skills, Plugins, Hooks, Subagents-as-config, Managed Agents, Advisor, Memory, MCP** in the skill stack (entire table, lines 19–27). For an "Advanced" tier as of May 2026, these are first-class topics; their absence is the largest framing gap. **Update**.
3. **"Layer 8" framing as the ceiling** (line 27, "Static/dynamic prompt boundary. Cache economics at scale."). Automatic prompt caching (Feb 19, 2026) made manual cache_control breakpoint management largely unnecessary; the headline production-architecture skill is now stale framing. **Update**.

---

## 01-mental-model.md

1. **Example 2 (lines 39–48)** — uses `Q3 2025` / `Q4 2025` cohort dates. Today is 2026-05-05; using 2025 examples is harmless but reads dated. **Nit**.
2. **Example 3 — Stripe employee count (lines 184–191)** — `"Stripe employees 2025" site:linkedin.com OR site:crunchbase.com OR site:stripe.com`. Year literal is now stale; should be 2026. **Nit**.
3. **"Tools are how the model acts" framing (Skill 3, lines 140–193)** — no mention that, in current Claude Code, tools include Skills (proactive activation via SKILL.md frontmatter), MCP tools (with `alwaysLoad`, `mcp_tool` hooks), and the deferred-tool mechanism (WebSearch/WebFetch are deferred and require fork context). Advanced learners need this. **Update**.
4. **"800 tokens spent, 40 seconds elapsed" / "80 tokens, 3 seconds" (lines 152, 160)** — concrete latency numbers without source; with prompt caching auto-on, these comparisons are no longer accurate. **Nit**.

---

## 02-communication-primitives.md

1. **Verb table (lines 16–26)** — accurate but doesn't acknowledge new Claude Code 2.1.x verbs/affordances: `/plan` (still), auto mode (Mar 25 blog), plus skill-style proactive activation. Not wrong, just incomplete for advanced. **Nit**.
2. **"system prompt in `constants/prompts.ts`" citation (line 12)** — same source-path concern flagged above. **Nit**.
3. No reference to **structured outputs (now GA)** or **`output_config.format`** (Feb 5, 2026 rename of `output_format`). When teaching format/constraints to an advanced audience, structured outputs is now the canonical mechanism. **Update**.

---

## 03-session-hygiene.md

1. **CLAUDE.md hierarchy (lines 11–12)** — lists managed/user/project/local but is silent on **plugins, settings.json hierarchy, `~/.claude/settings.json` persistence (v2.1.119)**, and managed-settings inheritance (WSL v2.1.118, security fix v2.1.126). Advanced learners now need to reason about settings + CLAUDE.md jointly. **Update**.
2. **Citation `utils/claudemd.ts`** (line 12) — re-verify against current source. **Nit**.
3. **Skill 8: Session scoping / `/clear`** (lines 100–115) — doesn't mention `/compact`, `claude project purge` (v2.1.126), `/usage` (replaced `/cost` + `/stats` in v2.1.118), or compaction API (server-side, beta on Opus 4.6). **Update**.
4. **`AUTOCOMPACT_BUFFER_TOKENS` in `autoCompact.ts`** (line 104) — symbol/file likely moved across 14 minor versions; not re-verified. **Nit**.
5. **No mention of Memory** (Managed Agents Memory, public beta Apr 23 2026) in a "Persistent Instructions" lesson. Memory is now the canonical cross-session state primitive; CLAUDE.md alone is incomplete. **Update**.

---

## 04-context-awareness.md

1. **Compaction-prompt 9-section list (lines 6–16)** — quoted from `services/compact/prompt.ts`. Not re-verified against v2.1.x; harness's compaction has changed (compaction API exists server-side; auto mode + 1M-context-autocompact false-positive fix in v2.1.128). **Update**.
2. **Manual checkpointing framing (Skill 12, lines 189–258)** — entirely manual. Misses **Compaction API (Feb 5, 2026, Opus 4.6 beta)** which makes this server-side and "effectively infinite". For Advanced, this is the key new primitive. **Update**.
3. **`AUTOCOMPACT_BUFFER_TOKENS` reference** (line 193) — same source-symbol freshness risk. **Nit**.
4. **No mention of Memory or compaction-aware skills** (skills can fork context — `context: fork` in SKILL.md, deferred tools become available, v2.1.126). **Update**.
5. **Implicit assumption: 200k window** — never says it, but examples assume small windows. With 1M context GA on Sonnet 4.6 + Opus 4.6 (Mar 13, 2026) at standard pricing, the urgency framing of context rot is dated for many workloads. **Update**.

---

## 05-output-engineering.md

1. **`/plan` mode reference (line 12, "model has a `/plan` mode built in")** — Plan mode still exists, but auto mode (Mar 25 blog post: *Claude Code auto mode: a safer way to skip permissions*) and the broader permission model around plan/auto have evolved. Advanced learners need the auto-mode framing. **Update**.
2. **No mention of structured outputs (GA)** or **task budgets / `xhigh` effort** (Opus 4.7) for output engineering. These are now the canonical mechanisms for shape and reasoning depth control. **Blocker** for an Advanced output-engineering module — the lesson teaches prompt-only format control while the API has first-class controls.
3. **"Lead with the answer or action, not the reasoning" quote (line 83)** — sourced from system prompt; not re-verified against current Claude Code. **Nit**.
4. **Example 3 "AI infrastructure market" (lines 154–158)** — fine, but writes content without invoking the **Advisor tool** (Apr 9 2026) which is squarely the correct primitive when pairing fast/strong models. **Update**.

---

## 06-tool-fluency.md

1. **Tool cost hierarchy table (lines 16–22)** — lists Read / Glob / Grep / Bash / Agent. Missing: **Skills, MCP tools (with `alwaysLoad`), WebFetch/WebSearch as deferred tools**, **Advisor tool**, computer-use, code execution v2 (free with web search/fetch on Sonnet 4.6). For "Tool fluency" at Advanced, these omissions are large. **Blocker** for the advanced framing.
2. **"Agent" tool framing** (lines 23, 32) — Claude Code 2.1.x emphasizes **subagents (frontmatter agents with `mcpServers` declarations, v2.1.117)** and **Task/forked subagents (`CLAUDE_CODE_FORK_SUBAGENT=1`)**. The single capital-A "Agent tool" name is dated. **Update**.
3. **"Use WebSearch three times"** (Example 3, line 75) — WebSearch is now a deferred tool and requires `context: fork` for first-turn skill availability (v2.1.126). Simple "use WebSearch" instructions can fail in skill contexts. **Update**.
4. **No coverage of `/usage`, `/skills`, `/mcp` tool count, hooks (`mcp_tool`, `PostToolUse` replace, `duration_ms`)** — these are the actual day-to-day controls in 2026 Claude Code. **Update**.

---

## 07-agent-design.md

1. **"Agent tool" / `tools/AgentTool/prompt.ts`** (lines 14, 100, 102) — the canonical advanced-agent surface in 2026 is **Claude Managed Agents (public beta Apr 8, 2026)** + **Memory (Apr 23, 2026)**, plus Claude Code subagents-as-config (frontmatter agents, parallel teams shipped in `code-review` / `pr-review-toolkit` plugins). Module is silent on all of this. **Blocker** for an Advanced-tier agent-design module.
2. **No Advisor pattern** (Apr 9, 2026, beta header `advisor-tool-2026-03-01`) — the canonical "fast executor + strong advisor" pattern for long-horizon agentic work. Should be central in this module. **Update**.
3. **No mention of fork semantics, sub-agent prompt-cache sharing (~3× cache_creation reduction, v2.1.128), or per-agent MCP servers (v2.1.117)**. **Update**.
4. **"Beyond Skill 18" footer (08 file lines 169–181)** lists "Agent swarm coordination" as future work — that's now a shipped product (Managed Agents). Stale framing. **Update** (cross-listed to 08).
5. **Quotes attributed to `tools/AgentTool/prompt.ts`** — re-verify; harness has restructured. **Nit**.

---

## 08-production-architecture.md

1. **`SYSTEM_PROMPT_DYNAMIC_BOUNDARY` marker / `splitSysPromptPrefix` / `cacheScope: 'global'`** (lines 12–14) — this entire mechanism is framed as the production cache pattern. Since Feb 19, 2026, **Automatic Prompt Caching** is GA: single `cache_control` field, system auto-advances breakpoint. The hand-rolled boundary discipline is largely superseded. **Blocker** — the module's central thesis is now stale for new builds, even if still mechanically valid for Claude Code's own internals.
2. **Cache math examples (Examples 1–3, lines 60–164)** — token-arithmetic claims ("70,000,000 tokens/day → 500,000") assume manual breakpoints; under auto-caching the savings come for free. Numbers mislead. **Update**.
3. **Tool-description-stability discipline** (lines 17, 139–153) — still true, but advanced learners now also need: **MCP `alwaysLoad`** for stable tool listing (v2.1.121), reconnect-summarization (v2.1.128, prevents tool-list reflood), and the cache-bust class flagged by the harness's own `promptCacheBreakDetection.ts`. **Update**.
4. **"Beyond Skill 18" coda** (lines 169–181) treats agent swarms, stateful sessions, and instrumentation as future work. As of 2026-05-05: Managed Agents (swarms hosted), Memory (stateful), OTEL events including `claude_code.skill_activated` w/ `invocation_trigger` (v2.1.126) all ship. **Update**.
5. **No mention of data residency (`inference_geo`, Feb 5, 2026), fast mode (Feb 7, 2026), Rate Limits API (Apr 24, 2026), Models API capabilities (Mar 18, 2026)** — all production-architecture concerns. **Update**.
6. **No mention of compaction API (server-side, Opus 4.6 beta)** — relevant to "stateful session management" footnote. **Update**.
7. **Model assumptions** — examples reference unspecified models; 2026 advanced production builds need to think about Opus 4.7 (xhigh, 2576px vision, task budgets), Sonnet 4.6 (1M GA), Haiku 4.5; and retirements: Sonnet 3.7 + Haiku 3.5 (Feb 19), Haiku 3 (Apr 20), Sonnet 4 + Opus 4 (announced Apr 14, retire Jun 15 2026), 1M-beta header `context-1m-2025-08-07` retired Apr 30. None of this appears. **Update**.

---

## claude-code-best-practices.md

1. **"Compaction is lossy" framing (Section 3, lines 33–38)** — accurate; doesn't reference compaction API or auto mode. **Update**.
2. **Section 7 "Checkpoint on long tasks"** — manual; doesn't mention `/usage`, `claude project purge`, or the compaction-API option. **Nit**.
3. **Section 8 "Subagents for research"** — uses generic "agent" framing; doesn't reference frontmatter agents, Skills, or Managed Agents. **Update**.
4. **No mention of plugins, hooks, skills, MCP** anywhere in this best-practices doc. For 2026 it's a notable omission. **Update**.
5. **"Claude is designed to pause and confirm"** (Section 11, lines 125–130) — doesn't mention auto mode (Mar 25 blog), `--dangerously-skip-permissions` semantics (v2.1.126 expanded scope), or managed-settings allowlists (`allowManagedDomainsOnly`/`allowManagedReadPathsOnly`). **Update**.

---

## claude-code-best-practices-deep.md

1. **"Verb-first" tables (lines 20–28)** — same as 02; fine but no new verbs/affordances (auto, plan, skill activation). **Nit**.
2. **`getMemoryFiles()` reference (line 275)** — internal symbol; not re-verified against v2.1.x. **Nit**.
3. **Part 5 — Agents** (lines 219–266) — entirely framed around in-CLI subagents; no Managed Agents, no Advisor, no Memory, no per-agent MCP servers, no skill-as-agent pattern, no plugin parallel-agent examples (`code-review`, `pr-review-toolkit` ship 5–6 agents). **Update**.
4. **Part 6 — CLAUDE.md** — silent on settings.json persistence (v2.1.119), `prUrlTemplate`, `channelsEnabled`, env-var inventory, and Memory. **Update**.
5. **Part 7 — "Working with the model's behaviour"** — no mention of **`xhigh` effort, task budgets, adaptive thinking default (Opus 4.6+), `thinking.display: "omitted"`**, advisor pairing, or Sonnet 4.6 vs Opus 4.7 selection criteria. For an Advanced doc this is a significant gap. **Update**.
6. **Quick Reference (lines 332–355)** — no skill, plugin, hook, MCP, settings, or Memory checkboxes. **Update**.
7. **"Plan mode (`/plan`)"** (line 149) — current Claude Code emphasizes auto mode plus plan; framing is incomplete. **Nit**.
8. **No mention of `ant` CLI** (Apr 8, 2026) — the new CLI client for the Claude API with native Claude Code integration. Advanced learners working at the API/CLI boundary need it. **Update**.

---

## Cross-cutting omissions (apply to multiple modules)

These are 2026 advanced-tier topics absent from the entire course:

- **Skills system** (SKILL.md, agentskills.io spec, `/skills`, `context: fork`, OTEL `claude_code.skill_activated`, document-skills, install via `/plugin install`).
- **Plugins** (official plugins: `code-review`, `feature-dev`, `pr-review-toolkit`, `hookify`, `plugin-dev`, `security-guidance`; marketplace; `claude plugin prune`).
- **Hooks** (`type: "mcp_tool"`, `PostToolUse` replace, `duration_ms`, SessionStart, PreToolUse pattern monitoring).
- **MCP changes** (`alwaysLoad`, reserved `workspace`, per-subagent `mcpServers`, reconnect summarization).
- **Claude Managed Agents + Memory** (public beta Apr 2026, hosted harness, sandboxes, audit/permissions).
- **Advisor tool** (Apr 9, 2026 — fast executor + strong advisor pairing).
- **Opus 4.7 capabilities** (xhigh effort, vision 2576px, per-task token budgets, breaking changes vs 4.6).
- **Automatic prompt caching** (Feb 19, 2026 — supersedes manual breakpoint mgmt).
- **Compaction API** (Feb 5, 2026, Opus 4.6 beta — server-side context summarization).
- **Structured outputs GA** + `output_config.format` rename (Feb 5, 2026).
- **Fast mode** (Feb 7, 2026, Opus 4.6, 2.5× speed).
- **Data residency** (`inference_geo`, Feb 5, 2026).
- **Models API capabilities** (Mar 18, 2026 — `max_input_tokens`, `max_tokens`, `capabilities`).
- **Rate Limits API** (Apr 24, 2026).
- **`thinking.display: "omitted"`** (Mar 16, 2026).
- **1M context GA** (Mar 13, 2026, Opus 4.6 + Sonnet 4.6) and **1M-beta header retirement** (Apr 30, 2026).
- **Retired/retiring models**: Sonnet 3.7, Haiku 3.5 (Feb 19), Haiku 3 (Apr 20), Sonnet 4 + Opus 4 (Jun 15).
- **Claude Code 2.1.x surface**: `/usage` (replaces `/cost`+`/stats`), `claude project purge`, `claude plugin prune`, `prUrlTemplate`, `channelsEnabled`, expanded `--dangerously-skip-permissions`, settings.json persistence, OTEL events, `ANTHROPIC_BEDROCK_SERVICE_TIER`, `CLAUDE_CODE_FORK_SUBAGENT`, IDE/Desktop/Web/Channels/Routines/Dispatch.
- **`ant` CLI** (Apr 8, 2026 — YAML-versioned API resources, native Claude Code integration).
- **Source-path citations across all modules** (`services/compact/prompt.ts`, `constants/prompts.ts`, `utils/api.ts`, `utils/claudemd.ts`, `services/compact/autoCompact.ts`, `tools/AgentTool/prompt.ts`, `promptCacheBreakDetection.ts`) — not re-verified against current Claude Code; potentially stale paths/symbols.

---

## Summary table

| File | Blocker | Update | Nit |
|------|--------:|-------:|----:|
| 00-index.md | 0 | 3 | 0 |
| 01-mental-model.md | 0 | 1 | 3 |
| 02-communication-primitives.md | 0 | 1 | 2 |
| 03-session-hygiene.md | 0 | 3 | 2 |
| 04-context-awareness.md | 0 | 4 | 1 |
| 05-output-engineering.md | 1 | 2 | 1 |
| 06-tool-fluency.md | 1 | 3 | 0 |
| 07-agent-design.md | 1 | 3 | 1 |
| 08-production-architecture.md | 1 | 6 | 0 |
| claude-code-best-practices.md | 0 | 4 | 1 |
| claude-code-best-practices-deep.md | 0 | 5 | 3 |
| **Total** | **4** | **35** | **14** |

Blockers cluster in the upper layers (5/6/7/8) where the course teaches manual mechanics that a 2026 Advanced learner would now solve via shipped Anthropic primitives (auto-prompt-caching, Managed Agents, Advisor, structured outputs, Skills/Plugins/Hooks). The lower layers (1–4) age more gracefully — mostly framing-stale rather than wrong.
