# Layer 8 — Production Architecture
## Skill 18

This layer is for builders deploying AI systems to multiple users. The skills here don't apply to individual Claude Code sessions — they apply when you're designing a system prompt architecture that will serve thousands of requests per day.

---

### Skill 18: Prompt Architecture for Scale

**What it is:** Structuring system prompts with a deliberate static/dynamic boundary. Static instructions (your core persona, tool guidance, behaviour rules) are cached globally and shared across all users and sessions. Dynamic context (user state, session data, per-user permissions) is injected after the boundary. Tool descriptions must remain stable to avoid busting the cache.

**Why it matters:** The source code makes this explicit. In `constants/prompts.ts`, a marker constant `SYSTEM_PROMPT_DYNAMIC_BOUNDARY = '__SYSTEM_PROMPT_DYNAMIC_BOUNDARY__'` divides the system prompt array. Everything before it receives `cacheScope: 'global'` — cached across the entire fleet. Everything after receives `cacheScope: null` — computed fresh per request. In `utils/api.ts`, `splitSysPromptPrefix` splits the prompt at this boundary.

A comment in the source on why this matters: *"The dynamic agent list was ~10.2% of fleet cache_creation tokens: MCP async connect, /reload-plugins, or permission-mode changes mutate the list → description changes → full tool-schema cache bust."*

At scale, every cache miss means paying full tokenisation cost for your static instructions on every request. For a deployment with 1,000 users making 10 requests per day, a cache miss on a 5,000-token static prefix costs 50 million tokens per day that should be nearly free.

**The key disciplines:**
1. Keep static content genuinely static — no dynamic values, no per-user content, no session state
2. Keep tool descriptions stable — tool descriptions that include dynamic state (available metrics, user permissions, current config) bust the cache every time they change
3. Put all dynamic context in the section after the boundary
4. The boundary is a real architectural seam — treat it like one

---

**Example 1 — Coding (internal code review tool)**

*Scenario:* An engineering team is deploying Claude as a code review assistant for 200 engineers. The system prompt includes both general code review instructions and per-user context (which team, preferred language, recent PR history).

*WITHOUT:* The system prompt is one block mixing general instructions and user-specific context. Every user request invalidates the cache because the user-specific section changes. All 200 engineers share no cache. Token cost scales linearly with usage.

*WITH:* The system prompt is split at a deliberate boundary:

```
# Static section (cached globally — never changes per user)

You are a code review assistant for engineering teams. Your role is to:
[core instructions that never change per user]

## Code review standards
[stable rules that apply to all users]

## How to use your tools
[tool descriptions — must never contain user-specific content]

__SYSTEM_PROMPT_DYNAMIC_BOUNDARY__

# Session context (computed per request)

User: {user_name}
Team: {team_name}
Language preference: {preferred_language}
Current PR under review: {pr_url}
```

The static section is computed once and cached globally. The dynamic section is injected per-request without busting the global cache. All 200 engineers share the same cached static prefix.

**The trap to avoid:** Putting team-specific rules in the static section. If the rules are truly universal, they're static. If they differ per team, they're dynamic and belong after the boundary.

---

**Example 2 — Data/Analytics (warehouse query assistant)**

*Scenario:* A data platform team is deploying a warehouse query assistant to 50 analysts. The assistant needs to know the company's data dictionary (stable, 8,000 tokens) and also each analyst's project access and team-specific metrics (variable per analyst).

*WITHOUT:* The entire context (schema + analyst-specific access) is built into one system prompt per user. 8,000 tokens rebuilt on every request. 50 analysts × 8,000 tokens × N requests = massive cache creation cost that could be near-zero.

*WITH:*

Static section (cached globally):
```
You are a data warehouse assistant. You help analysts write SQL queries
against our BigQuery warehouse.

## Data Dictionary
[complete stable schema documentation — 8,000 tokens]

## Standard Metric Definitions
[stable metric definitions]

## Query Conventions
[always-true SQL style rules]

__SYSTEM_PROMPT_DYNAMIC_BOUNDARY__
```

Dynamic section (per-analyst, injected at request time):
```
## Analyst Context

Analyst: {analyst_name}
Team: {team}
Accessible datasets: {dataset_list}
Default project: {gcp_project_id}
Current task: {current_task_description}
```

The 8,000 tokens of schema documentation are cached globally. Only the ~200-token analyst context varies per user. Cache creation cost drops by ~97%.

**Critical discipline:** The schema documentation in the static section must never include any analyst-specific filtering. If you write "this analyst has access to X tables", you've made the static section dynamic and broken the cache for everyone.

---

**Example 3 — Content/Research (content generation platform)**

*Scenario:* A content platform deploys Claude as a writing assistant for 1,000 creators. The assistant has stable writing guidance and content policy instructions. Each creator has their own brand voice, posting schedule, and audience description. The tool descriptions currently include creator-specific connected platform configurations.

*WITHOUT:* Writing guidance (stable, 3,000 tokens) and creator profile (per-user, 500 tokens) are both in every system prompt. Tool descriptions include creator-specific platform configurations that change when creators update their connected platforms. Every creator update triggers a full cache bust across all tool definitions for all users.

*With — three things to fix:*

**Fix 1 — Split the boundary:**

Static section:
```
You are a content creation assistant. You help creators write posts,
captions, and long-form content.

## Writing Standards
[stable guidance — never creator-specific]

## Content Policy
[stable rules]

__SYSTEM_PROMPT_DYNAMIC_BOUNDARY__
```

Dynamic section (per-creator, per-session):
```
## Creator Profile

Creator: {creator_name}
Brand voice: {brand_voice_description}
Audience: {audience_description}
Platform focus: {primary_platform}
Current campaign: {campaign_brief}
```

**Fix 2 — Remove dynamic content from tool descriptions:**

Tool descriptions must describe what the tool does, not the current state of the creator's configuration. Creator-specific platform configurations are injected in the dynamic section, not embedded in tool descriptions.

Wrong:
```
post_to_instagram: Posts content to the creator's Instagram account
({creator_instagram_handle}). Current rate limit: {rate_limit}.
```

Right:
```
post_to_instagram: Posts content to the creator's connected Instagram account.
See "Creator Profile" in the system context for account details and current limits.
```

**Fix 3 — Understand the cache math:**

If the static section is 3,000 tokens and the dynamic section is 500 tokens:
- Without boundary: 3,500 tokens rebuilt on every request for every creator
- With boundary: 3,000 tokens cached globally + 500 tokens per request

For 1,000 creators making 20 requests per day:
- Without: 70,000,000 tokens/day in cache creation
- With: ~500,000 tokens/day in cache creation (99.3% reduction)

The boundary is not an optimisation — at scale, it's the difference between a viable cost structure and an unviable one.

---

## Beyond Skill 18: What comes next

The eight layers in this course take a person from first use to production-grade system design. The skills that extend beyond this framework — and that require their own dedicated study — include:

**Agent swarm coordination:** Designing multi-agent systems where a coordinator routes work to specialist agents, collects results, and synthesises them. The fork semantics in Claude Code (where a fork inherits parent context and shares the cache) are a starting point for understanding the tradeoffs.

**Stateful session management:** Building systems that maintain coherent multi-turn sessions across compaction events — what to preserve, how to represent session state, when to summarise vs when to carry forward verbatim.

**Evaluation and instrumentation:** Measuring prompt cache hit rates, detecting unexpected cache busts (the source's `promptCacheBreakDetection.ts` is a model for this), tracking session health, and building feedback loops that let you improve prompt architecture from production data.

**Fine-tuning and distillation:** Using production session data to identify where the base model's default behaviour diverges from what your system needs, and either adjusting prompts or fine-tuning to close the gap.

These topics build on everything in this course. The skills here are prerequisites, not alternatives.

---

*This course is grounded in the Claude Code source code: `services/compact/prompt.ts` (compaction logic and what it preserves), `constants/prompts.ts` (system prompt structure and the `SYSTEM_PROMPT_DYNAMIC_BOUNDARY` marker), `utils/api.ts` (cache scope splitting via `splitSysPromptPrefix`), `utils/claudemd.ts` (CLAUDE.md loading hierarchy), `services/compact/autoCompact.ts` (compaction thresholds), and `tools/AgentTool/prompt.ts` (agent delegation and briefing guidance).*
