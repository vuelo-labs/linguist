---
course-revision: 2026-05-05
---

# Layer 10 — Production Architecture
## Skill 18

This layer is for builders deploying Claude on the API to multiple users. The skills here don't apply to a single Claude Code session — they apply when you're designing a system that serves thousands of requests per day across many users, regions, and models.

The thesis of this module changed in 2026. Until February it was *manual cache-breakpoint placement* — drawing a static/dynamic boundary in your system prompt and splitting the cache yourself. As of **2026-02-19**, automatic prompt caching is GA on the Claude API: a single `cache_control` field, with the system auto-advancing the cache point as the conversation grows. The discipline is no longer "place the boundary"; it is **cache-bust hygiene** — keeping the prefix stable so the auto-managed cache actually hits — plus the production controls that have shipped alongside it: data residency (`inference_geo`), Rate Limits API, Models API capabilities, the Compaction API, fast mode, and the 2026 model lineup itself.

This module covers Skill 18 (cache-bust hygiene), then the production primitives, then model selection across the 2026 lineup. The old boundary-placement thesis is preserved as a historical sidebar — it's still how Claude Code splits the system prompt internally, and the source-code citations are intact for anyone who wants to study a working example.

---

### Skill 18: Cache-bust hygiene under automatic prompt caching

**What it is:** Designing your system prompt, tool list, and MCP server set so the auto-managed prompt cache actually hits — turn after turn, user after user. The cache is now automatic. Your job is to *not* invalidate it.

**Why it matters:** The economics of automatic prompt caching are roughly the same as the manual-breakpoint version: cached prefix tokens are billed at a fraction of full input cost, and at scale a stable prefix is the difference between a viable cost structure and one that scales linearly with users. What changed is the failure mode. With manual breakpoints, the failure was *mis-placement* — putting dynamic content above the boundary. With automatic caching, the failure is *invalidation* — anything that mutates the prefix between turns drops the cache and forces full re-tokenisation. The disciplines below are what keep the prefix stable.

**The cache-bust hygiene checklist:**

1. **Keep the system prompt genuinely static.** No timestamps, no per-user values, no session state interpolated into the system message. Per-user context goes into the user message or a downstream content block, never into the system prefix.
2. **Keep the tool list stable.** A tool added, removed, or renamed mid-session bursts the tool-schema cache for that session. A tool whose *description* changes (e.g. one that interpolates dynamic state into the description string) does the same. The fix is to keep tool descriptions purely declarative and inject state via the system or user content, not into the schema.
3. **Use `alwaysLoad` on stable MCP servers.** As of v2.1.121 (2026-04-28), MCP servers can be marked `alwaysLoad: true` to skip the tool-search deferral mechanism — the server's tools are pre-loaded into the prompt instead of being lazily attached. For a server you know every session needs, this avoids the bust-on-first-use pattern. For a server you only need occasionally, leave the deferral on.
4. **Let reconnects summarise.** As of v2.1.128 (2026-05-04), MCP reconnects no longer flood the conversation with the full tool list — re-announces are summarised by server prefix. Earlier versions would re-emit every tool description on every reconnect, which busted the cache for every reconnect storm. If you're on the API directly (not via Claude Code) and rolling your own MCP integration, replicate this pattern: deduplicate reconnect tool announcements yourself.
5. **Treat the prefix as an architectural seam.** Anything that needs to vary per request lives below it — never in it. A team-specific rule, a per-user preference, a dynamic permission list, a current timestamp: all of it goes after the system prompt.

**Where automatic caching changes the math:** A 5,000-token static prefix shared across 1,000 users making 10 requests per day is ~50 million tokens per day of input. With cache-hit pricing the bill is roughly an order of magnitude lower than uncached — but only if the prefix actually hits. One cache-busting tool description, refreshed on every turn, drops you back to the uncached bill. The discipline is small. The cost difference at scale is not.

---

**Example 1 — Coding (internal code review tool)**

*Scenario:* An engineering team is deploying Claude as a code review assistant for 200 engineers. The system prompt is ~4,000 tokens (review standards, tool guidance, behaviour rules). Per-engineer state (team, language preference, recent PR history) varies per request.

*WITHOUT:* The team builds the system prompt by string-interpolating the engineer's name, team, and language preference into a single message. Every request has a different system prompt; auto-caching can't share a prefix across users; each request pays full input tokenisation. Token cost scales linearly with usage.

*WITH:* The system prompt is genuinely static — review standards, tool guidance, behaviour rules, with no user-specific interpolation. Per-engineer state is injected as the first user message in each request:

```
[system message — identical across all 200 engineers, all sessions]
You are a code review assistant for engineering teams.
[stable review standards]
[stable tool guidance]
[stable behaviour rules]

[first user message — varies per engineer]
## Session context
Engineer: {name}
Team: {team_name}
Language preference: {preferred_language}
Current PR: {pr_url}

[second user message — the actual request]
Review this diff: ...
```

The 4,000-token system prefix hits the cache from the second request onward, regardless of which engineer is calling. The 200-token session-context block doesn't share across users, but it doesn't need to — it's small.

**The trap to avoid:** Putting team-specific rules in the system prompt because "they're stable for that team." They're stable per-team, not stable across the fleet. Anything that varies between users belongs below the system message.

---

**Example 2 — Data/Analytics (warehouse query assistant)**

*Scenario:* A data platform team deploys a warehouse query assistant to 50 analysts. The data dictionary is large (~8,000 tokens) and stable. Each analyst has their own dataset access list and project default.

*WITHOUT:* The team builds one system prompt per analyst that includes the data dictionary *plus* that analyst's accessible datasets. The dictionary is identical across analysts but the appended access list is not, so the full 8,000+ tokens are different on every request. Auto-caching can't share the dictionary. Cache-creation cost scales with active analyst count.

*WITH:* The system prompt holds only the dictionary, query conventions, and stable metric definitions — no per-analyst state. The analyst's access list and project default go into the first user message:

```
[system — 8,000 tokens, identical for all 50 analysts]
You are a data warehouse assistant.
## Data dictionary
[full schema documentation]
## Query conventions
[stable SQL style rules]
## Standard metric definitions
[stable definitions]

[first user message — per analyst]
Analyst: {name}
Team: {team}
Accessible datasets: {dataset_list}
Default project: {gcp_project_id}
```

The 8,000-token dictionary hits the cache across all 50 analysts. Per-analyst state is small and cheap.

**The trap to avoid:** Filtering the dictionary in the system prompt to "only show this analyst's accessible tables." That makes the system prompt analyst-specific, breaks fleet-wide cache sharing, and is the wrong place to enforce access anyway — access enforcement belongs at the query layer or in the tool surface, not in the system prompt.

---

**Example 3 — Content/Research (content generation platform)**

*Scenario:* A content platform deploys Claude as a writing assistant for 1,000 creators. Stable writing guidance + content policy is ~3,000 tokens. Each creator has their own brand voice, audience, and connected platforms. The team has been embedding the creator's connected-platform configuration into the tool descriptions.

*WITHOUT:* Three problems compound:
1. Creator profile is interpolated into the system prompt, so the prefix differs per creator.
2. Tool descriptions include creator-specific platform configuration (handles, rate limits) — every creator update busts the tool-schema cache for everyone.
3. The MCP server set varies per creator (different platforms), and the team is not using `alwaysLoad`, so the tool list shifts between turns.

*WITH — three fixes, one per problem:*

**Fix 1 — Make the system prompt fleet-static.** Writing guidance and content policy stay; creator profile moves to the first user message.

**Fix 2 — Strip dynamic state from tool descriptions.** Tool descriptions describe what the tool does, not the current state of the creator's configuration:

```
WRONG:
post_to_instagram: Posts to {creator_instagram_handle}.
   Current rate limit: {rate_limit}.

RIGHT:
post_to_instagram: Posts content to the creator's connected Instagram
   account. See "Creator profile" in the session context for the active
   handle and current rate limits.
```

The dynamic values move into the user-message creator profile. The tool description is now identical across all 1,000 creators and stable across creator updates. The tool-schema cache hits.

**Fix 3 — Mark stable MCP servers `alwaysLoad: true`.** For platforms every creator has connected (the core publishing servers), `alwaysLoad: true` keeps the tool list pre-loaded and stable. For per-creator long-tail integrations, leave deferral on — those tools enter the prompt only when invoked, and the tool list shape stabilises around the always-loaded core.

**The cache math under auto-caching:**

| Configuration | Per-request input shape (1,000 creators × 20 reqs/day) |
|---|---|
| Before fixes (per-creator system prompt + dynamic tool descriptions) | Full re-tokenisation each turn for each creator; auto-cache doesn't hit |
| After fixes (fleet-static prefix + stable tool list) | ~3,000 prefix tokens + tool schemas billed at cache-hit rate from the second request onward; ~500-token creator profile billed normally per request |

The discipline is the same as it ever was — the difference is that the platform now does the cache-management work for you, on the condition that you don't sabotage the prefix.

---

> **Sidebar — what we used to teach: the dynamic boundary**
>
> Before automatic prompt caching shipped on 2026-02-19, the production discipline was *placing the static/dynamic boundary yourself*. The course taught it from a verified Claude Code internal: in `constants/prompts.ts`, the marker constant `SYSTEM_PROMPT_DYNAMIC_BOUNDARY = '__SYSTEM_PROMPT_DYNAMIC_BOUNDARY__'` divides the system prompt array. Everything before it receives `cacheScope: 'global'` — cached across the fleet. Everything after receives `cacheScope: null` — computed fresh per request. In `utils/api.ts`, `splitSysPromptPrefix` performs the split.
>
> A comment in the source captures the failure mode the boundary was designed to address: *"The dynamic agent list was ~10.2% of fleet `cache_creation` tokens: MCP async connect, /reload-plugins, or permission-mode changes mutate the list → description changes → full tool-schema cache bust."*
>
> This is still how Claude Code handles its own system prompt internally — the boundary is real and the citations are accurate as of v2.1.128. What changed is the audience for the discipline. As an API builder you no longer place the boundary yourself; the platform manages the cache point automatically. As a Claude-Code-internal architectural pattern, it remains an exemplar of the same idea cache-bust hygiene now expresses through different mechanics: stable prefix above, dynamic content below.
>
> `SYSTEM_PROMPT_DYNAMIC_BOUNDARY`, `splitSysPromptPrefix`, `constants/prompts.ts`, `utils/api.ts`, and `utils/claudemd.ts` are module paths inside the shipped Claude Code npm bundle. Structure verified against v2.1.128, 2026-05-05.

---

## Production primitives

Cache-bust hygiene is one production discipline. The 2026 platform shipped four others that any builder serving real traffic needs to know.

### Data residency (`inference_geo`)

As of **2026-02-05**, the Claude API accepts an `inference_geo` parameter for data residency control. US-only inference is available at 1.1× pricing for models post-2026-02-01. For deployments under data-residency constraints (regulated industries, EU/UK enterprises with cross-border data limits, US federal customers), this is the canonical control — set the parameter, accept the surcharge, get the regional guarantee. Don't try to enforce residency through routing tricks or proxy layers; the platform's parameter is the supported mechanism.

### Rate Limits API

As of **2026-04-24** *(beta vs GA status unconfirmed at time of release)*, the Rate Limits API exposes per-org and per-workspace rate limits programmatically. Before this, capacity planning meant inferring limits from 429s in production. With the Rate Limits API you can query current ceilings, plan rollouts against them, surface near-limit warnings to operators, and dimension your retry/backoff logic against real numbers. Wire it into your deployment dashboard before your first scale event, not during one.

### Models API capabilities

As of **2026-03-18**, `GET /v1/models` returns `max_input_tokens`, `max_tokens`, and `capabilities` for every model. This is the right place to source per-model behaviour at runtime — don't hard-code context limits or capability flags in your client. The endpoint is also what Claude Code uses (since v2.1.126) to populate the `/model` picker when `ANTHROPIC_BASE_URL` points at an Anthropic-compatible gateway.

### Compaction API and fast mode

The **Compaction API** (Opus 4.6, beta as of 2026-02-05) handles server-side context summarisation for effectively-infinite conversations. Layer 4 covers the decision tree of when to reach for it (versus a manual checkpoint, `/compact`, Memory, or a forked-skill context). For a production deployment, the relevant point is that the Compaction API is the only one of those primitives you can use *without* a Claude Code harness in the loop — it's the API counterpart to `/compact`, with the same lossiness profile and the same writing-for-compaction discipline (covered in Skill 11).

**Fast mode** (Opus 4.6, research preview as of 2026-02-07) offers up to 2.5× output speed at premium pricing via the `speed` parameter. Reach for it when latency dominates the user experience and the marginal cost is acceptable; leave it off when throughput per dollar is the constraint. It is a cost/latency dial, not a capability change.

---

## Model selection in 2026

The 2026 lineup gives you three current models and a retirement timeline you cannot ignore. Picking well — and migrating off retired models on time — is now part of production architecture.

### The current lineup

**Claude Opus 4.7** (released **2026-04-16**) is the long-horizon agentic-coding flagship. It introduces a fourth `effort` level — `xhigh` — for multi-step self-verification work; per-task token budgets that cap output for sub-steps inside a longer agentic run (rather than capping the whole response); and vision up to 2,576 px on the long edge (~3× prior Claude). Pricing is held flat at Opus 4.6 levels ($5 / $25 per MTok). Reach for Opus 4.7 when the task is long-horizon agentic work, complex coding with self-verification, large-image vision, or anywhere `high` effort has produced wrong plans or stopped short of self-checking. Use `xhigh` sparingly — it is the right answer for a narrow band of problems and overkill for most. (The full effort/budget treatment is in Layer 5.)

**Claude Sonnet 4.6** (released **2026-02-17**) is the workhorse. Improved agentic search at lower token cost, extended thinking supported, **1M context GA** at standard pricing (Mar 13, 2026 — the dedicated 1M rate limits and the `context-1m-2025-08-07` beta header have both retired; image/PDF limit raised from 100 to 600 per request). For mainstream agent workloads, Sonnet 4.6 is the default — Opus 4.7 only when you actually need its ceiling.

**Claude Haiku 4.5** is the fast/cheap tier. Reach for it in classification, extraction, formatting, retrieval-shaped tasks, or as the executor in an Advisor pairing where a stronger model (Sonnet 4.6 or Opus 4.7) is steering. Don't reach for it when planning depth or self-verification matter — that's Sonnet/Opus territory.

### The retirement timeline

| Model | Status | Migrate by |
|---|---|---|
| Claude Opus 3 | Retired **2026-01-05** | Done — migrate to Opus 4.7 (or Sonnet 4.6) |
| Claude Sonnet 3.7 | Retired **2026-02-19** | Done — migrate to Sonnet 4.6 |
| Claude Haiku 3.5 | Retired **2026-02-19** | Done — migrate to Haiku 4.5 |
| Claude Haiku 3 | Retired **2026-04-20** | Done — migrate to Haiku 4.5 |
| 1M-context beta on Sonnet 4.5 / Sonnet 4 (`context-1m-2025-08-07`) | Retired **2026-04-30** | Done — migrate to Sonnet 4.6 / Opus 4.6 (1M GA) |
| Claude Sonnet 4 | Deprecation announced 2026-04-14 | Retire **2026-06-15** |
| Claude Opus 4 | Deprecation announced 2026-04-14 | Retire **2026-06-15** |

The June 15 retirement of Sonnet 4 and Opus 4 is the active migration deadline as of 2026-05-05. If you have production traffic on either, build the migration plan now — Opus 4.7 has API breaking changes vs. 4.6 (see the official migration guide). The pattern over the past six months is steady: announce, deprecate, retire on a roughly six-week tail. Plan your model selection with that cadence in mind.

### Selection criteria

Three questions, in order:

1. **Does the task need long-horizon agentic depth, self-verification, or large-image vision?** If yes, Opus 4.7 — and consider `xhigh` if `high` has fallen short. If no, drop to Sonnet 4.6.
2. **Is the task retrieval-shaped, classification-shaped, or executor-in-a-pair?** If yes, Haiku 4.5. If no, Sonnet 4.6 is the default.
3. **Are there residency or rate-limit constraints?** Set `inference_geo`, query the Rate Limits API, dimension capacity against real ceilings. The model choice doesn't change; the deployment shape does.

---

## Beyond Skill 18

The ten layers in this course take a person from first use to production-grade design. Three topics that previously sat outside the framework — agent swarms, stateful sessions, and instrumentation — have shipped as Anthropic primitives in 2026 and now belong inside the course rather than as forward-looking notes.

**Managed Agents and Memory.** The "agent swarm" framing of 2025 — where you'd hand-roll a coordinator, dispatch to specialist agents, collect and synthesise — is now a hosted primitive. **Claude Managed Agents** (public beta, 2026-04-08, header `managed-agents-2026-04-01`) ships a sandboxed agent harness with built-in tools and SSE streaming. **Memory** (public beta, 2026-04-23) gives those agents file-backed cross-session state with scoped permissions and audit logs. The Advisor pattern (header `advisor-tool-2026-03-01`, beta as of 2026-04-09) pairs a fast executor with a stronger advisor for mid-generation strategic guidance. These are the new substrate for stateful long-horizon work, and they're covered in depth in the **Managed Agents, Memory, and the Advisor pattern** module.

**Stateful sessions across compaction.** What was a hand-rolled discipline in 2025 — preserving session state across compaction events — is now a layered primitive: Layer 4 covers the in-window decision tree (manual checkpoint vs `/compact` vs Compaction API vs Memory vs forked-skill context); Memory covers the across-session case. Writing-for-compaction (Skill 11) is the prompt discipline that survives every variant.

**Instrumentation and OTEL.** Claude Code emits OTEL events (e.g. `claude_code.skill_activated` with `invocation_trigger: user-slash | claude-proactive | nested-skill` since v2.1.126) that let you measure the production behaviours that used to require custom telemetry. Cache hit-rate, skill activation patterns, hook `duration_ms`, prompt-cache break detection — these are now first-class signals from the harness, not invariants you have to infer from cost reports.

The skills in this course remain prerequisites for working with these primitives. What's changed is that the primitives are real, hosted, and beta-headered — not theoretical extensions of the eight-layer model.

---

*This module is grounded in the Claude Code internal source (v2.1.128, 2026-05-04) and the 2026 Claude Platform release notes. Internal source citations: `services/compact/prompt.ts` (compaction logic and what it preserves), `constants/prompts.ts` (system prompt structure and the `SYSTEM_PROMPT_DYNAMIC_BOUNDARY` marker — preserved in the historical sidebar), `utils/api.ts` (cache scope splitting via `splitSysPromptPrefix` — preserved in the sidebar), `utils/claudemd.ts` (CLAUDE.md loading hierarchy), `services/compact/autoCompact.ts` (compaction thresholds), and `tools/AgentTool/prompt.ts` (agent delegation and briefing guidance). These are module paths inside the shipped npm bundle. Structure was verified against v2.1.128; exact wording may have drifted between releases. Platform-level claims (automatic prompt caching, `inference_geo`, Rate Limits API, Models API capabilities, Compaction API, fast mode, Opus 4.7 / Sonnet 4.6 / Haiku 4.5 lineup, retirement timeline) are sourced from the official Claude Platform release notes and announcements; dates are verified against those notes as of 2026-05-05.*
