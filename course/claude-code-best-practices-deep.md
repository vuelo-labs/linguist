---
course-revision: 2026-05-05
---

# Claude Code — Prescriptive Best Practices
## A practitioner's guide grounded in the source, current to v2.1.128

---

## How to read this guide

Every practice here is derived from Claude Code's actual internal system prompts and implementation logic — not speculation. Where a practice is sourced from specific model instructions, that's noted. Where it depends on a public-beta API surface, the beta header string and "as of" date are stamped inline so you can re-verify.

The deep guide assumes the matching short version of `claude-code-best-practices.md` is the day-one onboarding sheet (verbs, plugin shopping list, settings hygiene). This document goes further: mechanics, decision trees, source provenance, the API/CLI boundary, and the production primitives that landed Feb–May 2026.

**Course layer cross-references** in this document use the post-Wave-3 numbering:

- **L1–L4** — mental model, communication primitives, session hygiene, context awareness
- **L5** — output engineering (structured outputs, effort, task budgets)
- **L6** — tool fluency
- **L7** — Skills / Plugins / Hooks (`07-skills-plugins-hooks.md`)
- **L8** — Agent design (`08-agent-design.md`) — in-CLI subagents
- **L9** — Managed Agents / Memory / Advisor (`09-managed-agents-memory-advisor.md`)
- **L10** — Production architecture (`10-production-architecture.md`)

---

## Part 1 — Verb-First, Deterministic Language

### Why verbs matter more than you think

Claude is explicitly trained to infer scope from the imperative verb in your request. The model uses the verb to determine how much it's allowed to do. This is not a suggestion — it's a design constraint baked into the system prompt.

These verbs carry different blast radii:

| Verb | What the model infers |
|---|---|
| `fix` | Change the minimum required to resolve the stated problem |
| `add` | New capability only — don't modify existing behaviour |
| `refactor` | Restructure without changing external behaviour |
| `update` | Modify existing functionality |
| `explain` | Read-only — no changes |
| `clean up` | **Ambiguous** — avoid this |
| `improve` | **Dangerous** — no ceiling on scope |

**The rule:** lead every request with a precise verb. The model is instructed *"don't add features, refactor code, or make improvements beyond what was asked."* It can only honour that if the verb is unambiguous.

### The full prompt structure

A well-formed request has three parts:

```
[VERB] [SPECIFIC TARGET] — [CONSTRAINT]
```

Examples:

```
Fix the off-by-one in paginate() — don't refactor anything around it.

Add a retry parameter to fetchUser() — same interface, new optional arg only.

Refactor the auth middleware to extract token validation into its own function
— don't change the function signatures or touch any callers.

Explain how the caching layer works in services/cache.ts — no changes needed.
```

Each of these has a verb (scope signal), a target (no searching required), and a constraint (ceiling on blast radius).

### What happens without constraints

Without a constraint, the model fills the gap with its own judgment. The source explicitly warns against this pattern internally — the model has been trained to be capable and thorough, which means it will expand scope when given permission to do so implicitly. "Clean this up" is implicit permission.

**The fix:** add "don't change anything else" or "leave everything else as-is" as a default trailer to any request where scope matters.

---

## Part 2 — Input Management

### Rule 1: Reference files, don't paste them

When you paste code into the chat it becomes part of the conversation history and gets re-processed every turn until it's summarised away. Claude has file-reading tools specifically to avoid this — the model reads a file once, extracts what it needs, and the raw content doesn't accumulate.

**Don't:**
> Here's the contents of auth.ts: [paste 300 lines]

**Do:**
> Read `src/auth.ts` and tell me why the token validation is failing.

The model is instructed to read files before proposing changes anyway — pasting is redundant and expensive.

### Rule 2: Be specific with targets

Vague references require the model to search before it can act. Every search turn costs context and time.

**Don't:** "That config file we were looking at"
**Do:** `config/database.ts`

**Don't:** "The function that handles user login"
**Do:** `authenticateUser()` in `src/auth/handlers.ts:142`

### Rule 3: One task per message

Multi-part requests split the model's attention and make it harder for it to apply constraints correctly. Break compound work into sequential messages — each one is a checkpoint.

### Rule 4: State constraints before work starts, not after

Corrections mid-task are expensive. They add turns, require rework, and have to survive context summarisation intact. The compaction logic is specifically designed to preserve user corrections verbatim — because they're so commonly needed and so often lost.

### Rule 5: Pick the right input primitive for persistent state

You now have three lifetimes for "things the model should know":

| Primitive | Lifetime | Source of truth |
|---|---|---|
| User message | This turn only (until compacted) | Conversation |
| `CLAUDE.md` | Whole session, every session in this dir | File on disk |
| `~/.claude/settings.json` | Across all projects (since v2.1.119) | User config |
| Memory store (Managed Agents beta) | Across sessions, scoped, audited | Server-side store |

See Part 6 for settings, Part 5 for Memory.

---

## Part 3 — Output Management

### The model is trained to be brief by default

Claude Code's system prompt explicitly instructs the model: *"Go straight to the point. Lead with the answer or action, not the reasoning. Skip filler words, preamble, and unnecessary transitions. Do not restate what the user said — just do it."*

If you need reasoning, walkthrough, or tradeoff analysis, ask explicitly:

> Explain your reasoning before making any changes.
> Walk me through what you're planning before you do it.
> After fixing this, explain what was wrong and why your fix addresses it.

### The model mirrors your verbosity

Short terse prompts produce short terse answers. Detailed prompts produce detailed answers. This is a calibration signal, not an accident.

### Ask for a plan before execution on complex tasks

Claude Code's plan-mode (`/plan`) is the cheap version of this; it proposes an approach, waits for your approval, then executes. Auto mode (Mar 25 blog) is the more recent answer: the classifier decides whether a task warrants planning, asks for permissioning where needed, and proceeds.

### Tool results are ephemeral

The source contains this explicit instruction to the model: *"When working with tool results, write down any important information you might need later in your response, as the original tool result may be cleared later."*

What this means for you: the model has been told that its own tool outputs (file reads, bash results, search results) may disappear before it finishes a task. It handles this by narrating key findings into its response. If you see the model stating what it found, that's it building a durable record for itself, not padding.

### API-level output controls (cross-ref L5)

Beyond prompt mechanics, the API now ships first-class output controls. When you're driving Claude Code from the SDK or building on the bare API, prefer these over prompt-only formatting:

- **Structured outputs** (`output_config.format`, GA Feb 5 2026; renamed from `output_format`). Constrain the response to a JSON schema — no fragile prose-to-JSON parsing.
- **Effort parameter GA** (Feb 5 2026; replaces `budget_tokens`). Levels include the new `xhigh` on Opus 4.7.
- **Task budgets.** Per-task token caps stop runaway thinking on long-horizon agentic work.
- **`thinking.display: "omitted"`** (Mar 16 2026). Drops thinking content from the streaming response for latency, but preserves the signature so multi-turn continuity still works. Billing is unchanged.
- **Adaptive thinking** is the default on Opus 4.6 / 4.7; manual `budget_tokens` is deprecated on those models.

Reach for the API primitive first. Prompt-mechanics formatting is a fallback when you can't change the call shape.

---

## Part 4 — Context Management and Spotting Rot

### What context rot is

Context rot is the gradual degradation of a session's usefulness as it grows longer. Two causes:

1. **Accumulation** — old tool results, irrelevant history, resolved tasks occupying space active work needs
2. **Summarisation drift** — compaction produces a summary, not a copy; fine details are lost

You can't eliminate summarisation. You can manage the conditions that make it worse.

### The 9 things compaction is designed to preserve

The source shows exactly what the compaction prompt asks the summarising model to capture:

1. Your explicit requests and intents
2. Key technical concepts and frameworks
3. Specific file names, code snippets, and function signatures
4. Errors encountered and how they were fixed
5. **Your feedback** — especially corrections where you said "do it differently"
6. All of your messages verbatim
7. Pending tasks
8. What was being worked on immediately before summarisation
9. The next step, with a direct quote from the conversation to prevent drift

What's *not* on this list: raw tool output, intermediate reasoning, the model's thought process. **The implication:** anything important that exists only in a tool result — and you haven't explicitly confirmed in a user message — may not survive. If something matters, say it back in your own words.

### Signs of context rot

| Signal | What it means |
|---|---|
| Model repeats something it already did | Lost track of completed work |
| Re-asks something you already answered | That answer didn't survive compaction |
| Changes approach on a constraint you set earlier | Constraint drifted out of active context |
| Uses a different name for something than you established | Terminology anchor was lost |
| Responses become less specific | Reasoning from a summary, not the source |

### How to address rot — decision tree

Pick the right primitive for the failure mode:

| Situation | Reach for |
|---|---|
| Unrelated next task | `/clear` |
| Same task, context too noisy | `/compact` (in-CLI) |
| Long-horizon API workload | Compaction API (beta, Opus 4.6+, Feb 5 2026) |
| Want fresh tool results without polluting parent | Skill with `context: fork` |
| State must survive across sessions | Memory store (Managed Agents beta — see Part 5) |
| Fully blow away project state | `claude project purge [path]` (v2.1.126) |

### 1M context — what changed

Opus 4.6 and Sonnet 4.6 went 1M-context GA on Mar 13 2026 at standard pricing. The dedicated 1M rate limits were removed and the image/PDF cap was raised from 100 to 600 per request. The legacy `context-1m-2025-08-07` beta header retired Apr 30 2026 for Sonnet 4.5/4 — migrate those workloads.

A 1M context window does not abolish rot — it postpones it. The session-length heuristic still applies: if you can't describe the session in one sentence, it's outgrown its useful scope.

---

## Part 5 — Using Agents Strategically

This part has grown. The 2026 agent surface has three substrates, not one:

1. **In-CLI subagents** — frontmatter-defined, run in your harness, read your filesystem (L8).
2. **Managed Agents** — hosted, sandboxed, Memory-backed (L9). Public beta, header `managed-agents-2026-04-01`, since Apr 8 2026.
3. **Advisor pairing** — a fast executor plus a stronger advisor giving mid-generation strategic guidance. Public beta, header `advisor-tool-2026-03-01`, since Apr 9 2026.

The decision rule has expanded accordingly. The classic question — *will I need this output again?* — still picks subagent vs inline. New questions slot above and beside it.

### What in-CLI subagents do

Subagents run in their own context window. Their tool outputs — file reads, grep results, bash output — are processed in that window and never land in yours. You receive a summary. **Context isolation** is the fundamental reason to use them.

The source describes this directly: *"Subagents are valuable for parallelizing independent queries or for protecting the main context window from excessive results."*

### When to fork — the criterion the source uses

If the raw output from a task (search results, file reads, test output) would fill your context but you only need the conclusion, delegate it.

**Use a subagent when:**
- Research question across many files
- Large intermediate output you won't need again
- Genuinely independent of current work
- Want an isolated, unbiased second opinion

**Don't use a subagent when:**
- You're hunting a specific known file (Glob/Grep is faster)
- The task is 2–3 files of reading
- Findings need to feed directly into your next step

### Per-agent MCP servers (v2.1.117)

Subagent frontmatter now supports `mcpServers` — a subagent can declare exactly which MCP servers it wants and ignore the parent's. This is the cleanest way to:

- Give a research agent a read-only data MCP without exposing it to the executor
- Give a deploy agent the cloud-credentials MCP only when invoked
- Run a subagent against a stripped-down tool surface for cache stability (cross-ref L10)

### Forked subagents

`CLAUDE_CODE_FORK_SUBAGENT=1` enables forked subagents on external builds (v2.1.117) and SDK non-interactive sessions (v2.1.121). A forked subagent inherits the parent's context state and runs deferred tools (WebSearch, WebFetch) on first turn — useful when you want a research arm that already understands the situation rather than briefing it from scratch.

### Sub-agent prompt-cache sharing (v2.1.128)

Sub-agent progress summaries now ride the prompt cache, ~3× reduction in `cache_creation`. Older versions re-fired summaries on idle subagents — that's fixed too. Net effect: parallel subagent fan-out is cheaper than it was even three months ago. Plan accordingly when you design swarms.

### Skill-as-agent

A Skill (L7) with `context: fork` and a tightly scoped instruction is functionally a single-purpose subagent invocable by name. The official `code-review` plugin runs **5 parallel agents** (compliance, bugs, context, history, comments); `feature-dev` runs **7 phases**; `pr-review-toolkit` runs **6 specialised reviewers**. These are agent swarms shipped as plugin presets — see Part 8.

The implication for your own work: don't reinvent. If your workflow looks like a fan-out review, install `pr-review-toolkit` and read the agent prompts. If it looks like a multi-phase build, install `feature-dev`.

### Managed Agents (cross-ref L9)

Beta header: `managed-agents-2026-04-01` (as of 2026-05-05). Hosted agent harness with sandboxes, built-in tools, SSE streaming. Reach for it when:

- The agent must outlive a CLI session
- You need a sandbox you don't operate
- You want Memory (next section) for cross-session learning
- Compute residency or operator-zero-access matters

See [platform.claude.com/docs/en/managed-agents/overview](https://platform.claude.com/docs/en/managed-agents/overview).

### Memory (cross-ref L9)

Beta — same header as Managed Agents — as of 2026-05-05. Filesystem-backed stores with scoped permissions, audit logs, API export, concurrent multi-agent stores. Memory is when CLAUDE.md isn't enough — when you need:

- Cross-session learning (the agent remembers what it tried last week)
- Scoped permissions (this agent's memory is not that agent's memory)
- Audit logs (compliance)
- Programmatic export (analytics, debugging)

A useful mental model: `CLAUDE.md` is your standing briefing for one repo, `settings.json` is your standing briefing for the whole machine, **Memory is the agent's own notebook**.

### The Advisor pattern (cross-ref L9)

Beta header: `advisor-tool-2026-03-01` (as of 2026-05-05). Pair a fast executor with a stronger advisor that intervenes mid-generation. Anthropic claims close-to-advisor-solo quality at executor pricing on long-horizon agentic workloads.

Pattern: **Sonnet 4.6 executor + Opus 4.7 advisor**. The executor does turn-by-turn work; the advisor weighs in when the executor is about to commit to a plan or has wandered. You get most of the cost shape of Sonnet with most of the planning quality of Opus.

### How to brief any agent properly

The source contains explicit instructions for writing agent prompts: *"Brief the agent like a smart colleague who just walked into the room — it hasn't seen this conversation, doesn't know what you've tried, doesn't understand why this task matters."*

An agent prompt needs:
- What you're trying to accomplish and why
- What you've already tried or ruled out
- Enough surrounding context for judgment calls
- Whether to write code or just research
- Desired output format and length

The source is direct about the failure mode: *"Terse command-style prompts produce shallow, generic work."*

### Never delegate understanding

The source flags this as a failure pattern: *"Don't write 'based on your findings, fix the bug' or 'based on the research, implement it.' Those phrases push synthesis onto the agent instead of doing it yourself."*

The agent does research. You synthesise. You write the implementation prompt that includes the specific file, line, and what specifically to change. The agent that does the fix gets a directive, not an open question.

---

## Part 6 — Persistent Instructions: CLAUDE.md, settings.json, Memory

### What CLAUDE.md is

Claude loads `CLAUDE.md` files at session start, before your first message. This content is treated as standing instructions — the equivalent of a briefing that's always there, without costing you per-turn.

Through v2.1.x the source loaded CLAUDE.md via `getMemoryFiles()` into the user context, memoised for the session. *(Symbol provenance: confirmed in Claude Code source through v2.1.x; the symbol may be renamed or relocated in later builds — verify against current source if reproducing.)* Anything in CLAUDE.md is processed once, cached, and doesn't accumulate in conversation history.

### What belongs in CLAUDE.md

Standing instructions that apply to every session in this directory:

- Project tech-stack constraints ("we use Bun, not Node")
- Code style rules ("don't add type annotations to files you didn't change")
- Workflow rules ("always run tests before marking a task done")
- Pre-authorised permissions ("you can commit directly, always ask before pushing")
- Terminology ("we call it a 'workspace', not a 'project'")

**The test:** if you've said something more than once in a session, it belongs in CLAUDE.md.

### What doesn't belong in CLAUDE.md

Task-specific context, in-progress work, or session state. CLAUDE.md is for standing rules, not notes. The model reads it at start and caches it — it's not a scratchpad.

### settings.json — the machine-wide layer

Since v2.1.119, `/config` persists to `~/.claude/settings.json`. Settings live in a hierarchy:

| File | Scope |
|---|---|
| `~/.claude/settings.json` | User, all projects |
| `<repo>/.claude/settings.json` | Project, checked-in |
| `<repo>/.claude/settings.local.json` | Project, gitignored, machine-local |
| Managed settings (org-deployed) | Enforced, inherited; security fix in v2.1.126 |

Useful settings that landed Apr–May 2026:

- **`prUrlTemplate`** (v2.1.119) — custom code-review URL template, e.g. for self-hosted GitLab.
- **`channelsEnabled`** (v2.1.128) — required for managed-settings orgs to opt into `--channels` (Telegram/Discord/iMessage/webhook event push).
- **`allowManagedDomainsOnly`, `allowManagedReadPathsOnly`** — security-tier permission allowlists. v2.1.126 fixed an inheritance bug where these were ignored when a higher-priority managed-settings source lacked a `sandbox` block. **If you operate a managed deployment, audit your config against v2.1.126+.**

### Environment variable inventory (current)

| Variable | Effect |
|---|---|
| `ANTHROPIC_BASE_URL` | Point CLI at an Anthropic-compatible gateway; `/model` populates from gateway `/v1/models` |
| `ANTHROPIC_BEDROCK_SERVICE_TIER` | Bedrock tier selection (v2.1.122) |
| `CLAUDE_CODE_HIDE_CWD` | Suppress working directory display (v2.1.119) |
| `CLAUDE_CODE_FORK_SUBAGENT` | `=1` enables forked subagents on external/SDK builds (v2.1.117/121) |
| `CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS` | OAuth retry safety (v2.1.123) |
| `CLAUDE_CODE_SHELL_PREFIX` | Custom shell prefix for Bash; arg-corruption fixed v2.1.128 |
| `CLAUDE_CODE_PROVIDER_MANAGED_BY_HOST` | Provider lifecycle deference for SDK hosts |
| `DISABLE_UPDATES` | Disable auto-update (v2.1.118) |
| `OTEL_*` | **No longer inherited by subprocesses** (v2.1.128) — explicit anti-leak fix |

### Memory — the cross-session layer (cross-ref L9)

When CLAUDE.md isn't enough, Memory is. As of 2026-05-05, beta header `managed-agents-2026-04-01`. Compared with CLAUDE.md:

| Property | CLAUDE.md | Memory |
|---|---|---|
| Lifetime | Session, this directory | Cross-session, scoped |
| Mutability | You edit a file | Agent writes via tools |
| Scope | One repo | One agent (or shared, controlled) |
| Audit | git history | Server-side audit log |
| Export | Read the file | API export |

Use CLAUDE.md for what you decide. Use Memory for what the agent learns.

---

## Part 7 — Working with the Model's Behaviour, Not Against It

### The model won't push back unless you give it permission to

The external system prompt instructs the model to defer to user judgment. By default it executes. If you want flagging, alternatives, or pushback, say so:

> If you think my approach has a problem, tell me before starting.
> If you notice anything unexpected while doing this, flag it.
> I want your honest assessment of this design, not just execution.

### The model won't verify unless you ask it to

The source includes an internal-only instruction to verify work before marking it done. The external version doesn't. For code tasks, explicitly ask:

> After making the change, run the tests and confirm they pass.
> Once you've made the edit, check that nothing else in the file references the old interface.

### Explicit permission changes the default safety gates

Claude is designed to pause before irreversible actions. The source's reasoning: *"the cost of pausing to confirm is low, while the cost of an unwanted action can be very high."*

If you want operation without these pauses, say so for that task:

> Proceed without checking in — I'll review the diff at the end.

A one-time confirmation doesn't carry over: *"A user approving an action once does NOT mean that they approve it in all contexts."* For standing permissions, use CLAUDE.md or settings.json (Part 6).

`--dangerously-skip-permissions` since v2.1.126 also bypasses prompts for writes to `.claude/`, `.git/`, `.vscode/`, and shell config files (the catastrophic-removal safety net remains). Don't use this flag for routine work.

### Pick the right effort and the right model (cross-ref L5, L10)

The 2026 model lineup:

| Model | Niche |
|---|---|
| **Opus 4.7** (Apr 16 2026, `claude-opus-4-7`) | SOTA agentic coding, vision; new `xhigh` effort; same $5/$25 MTok pricing as 4.6 |
| **Sonnet 4.6** (Feb 17 2026) | Improved agentic search, fewer tokens, 1M context GA |
| **Opus 4.6** (Feb 5 2026) | Adaptive thinking by default; Compaction API host |
| **Haiku 4.5** | Fast tier, available on Bedrock self-serve as of Apr 16 |

**Retired / retiring:** Sonnet 3.7 + Haiku 3.5 (Feb 19), Haiku 3 (Apr 20), Sonnet 4 + Opus 4 (deprecation announced Apr 14, retire **Jun 15 2026**). Migrate before then.

Effort selection rule of thumb on Opus 4.7:

| Effort | When |
|---|---|
| `low` | Tight loops, classification, single-file edits |
| `medium` | Default for most everyday agentic work |
| `high` | Multi-file design changes, architecture decisions |
| `xhigh` | Long-horizon planning, hard refactors, deep multi-step debugging |

Pair `xhigh` with **task budgets** so it doesn't run away. Pair `thinking.display: "omitted"` with streaming UIs that don't surface thinking — you keep multi-turn signature continuity but lose the latency cost of streaming the thinking itself.

When you can't justify Opus xhigh end-to-end, the **Advisor pattern** (Part 5) is the cost compromise — Sonnet executes, Opus advises.

### The model won't re-ask what it already knows

If the model asks something it should know from earlier, that's a context rot signal. Don't just answer — restate any *other* context from that conversation that might also have been lost.

---

## Part 8 — Skills, Plugins, Hooks (deep)

L7 introduces the three primitives. This part is the authoring-and-operations deep dive.

### The taxonomy in one screen

| Primitive | Mechanism | Activation | Lifetime |
|---|---|---|---|
| **Skill** | Folder + `SKILL.md` + assets | Proactive (model picks) or `/skills` slash | This invocation |
| **Plugin** | Bundle of skills/commands/hooks/agents | `/plugin install`, `--plugin-dir` | Whole session |
| **Hook** | Event handler in settings | Event fires (PreToolUse, PostToolUse, SessionStart, etc.) | Per event |

Decision rule: **Skill** when the model should opt in by judgment. **Plugin** when you ship a coherent capability bundle. **Hook** when the harness — not the model — must execute behaviour deterministically every time.

### SKILL.md authoring

A skill is a folder containing `SKILL.md` with YAML frontmatter:

```yaml
---
name: my-skill-name
description: Clear description of what this skill does and when to invoke it
---

# Skill body — instructions Claude follows when activated
```

**The `description` is the activation contract.** The model uses it to decide proactive activation. Bad descriptions get either over-activation (skill fires on unrelated tasks) or under-activation (model never picks it). Write the description as if briefing a colleague: what does this do, *and when should you reach for it?*

Optional skill features:

- **`context: fork`** — skill runs in a forked context. Gets deferred tools (WebSearch/WebFetch) on first turn (fix in v2.1.126). Use this when the skill does heavy research that shouldn't pollute the parent.
- **Bundled scripts/templates/data** — anything in the skill folder is reachable. Skills are just folders.

The official spec lives at [agentskills.io](http://agentskills.io); the canonical template is in `anthropics/skills/template`.

### Activation telemetry

Since v2.1.126, `claude_code.skill_activated` OTEL events fire with `invocation_trigger`:

| Trigger | Meaning |
|---|---|
| `user-slash` | User typed `/skill-name` |
| `claude-proactive` | Model picked the skill autonomously |
| `nested-skill` | A skill activated another skill |

Wire this to your observability and you can finally answer *"which skills does the model actually pick?"* — the basis for tuning descriptions.

### Plugin packaging

Plugins are folders bundling skills, slash commands, hooks, and subagents under a single `.claude-plugin/` config. Recent operational changes:

- `--plugin-dir` accepts `.zip` archives (v2.1.128).
- `claude plugin prune` removes orphaned dependencies (v2.1.121).
- Auto-install of missing plugin dependencies (v2.1.116/117).
- `/plugin update` correctly detects new npm-sourced versions (v2.1.128).
- Managed-settings enforcement on plugin operations (v2.1.117).
- Plugin error reporting in headless `--output-format stream-json` `init.plugin_errors` (v2.1.128).

### The official plugin shelf — what each one teaches

The short doc lists "plugins to install on day one." The deep angle: read these plugins as worked examples of agent design.

| Plugin | What to learn from it |
|---|---|
| `code-review` | 5 parallel specialist agents — fan-out review pattern |
| `feature-dev` | 7-phase workflow with explicit exploration/architecture/review agents |
| `pr-review-toolkit` | 6 specialised reviewers — orthogonal-axes review |
| `hookify` | Hook authoring scaffolding — `/hookify`, `/hookify:configure`, `/hookify:list`, `/hookify:help` |
| `plugin-dev` | Plugin authoring — 7 expert skills + 3 agents |
| `security-guidance` | PreToolUse hook monitoring **9 security patterns** — example of harness-enforced guardrails |
| `explanatory-output-style` / `learning-output-style` | SessionStart hook for output-style injection |
| `claude-opus-4-5-migration` | Self-applied migration tooling — useful template if you build internal migration plugins |

### Hook patterns

Hooks fire on harness events, not model decisions. Recent surface:

- **`PostToolUse` can replace tool output for all tools** (v2.1.121, previously limited).
- **`type: "mcp_tool"`** targets MCP tools specifically (v2.1.118). Useful for redacting / annotating MCP results.
- **`duration_ms`** field on hook payloads (v2.1.119) — instrument tool latency.
- **SessionStart** hooks — inject standing context (used by `explanatory-output-style`).
- **PreToolUse** — enforce policy before a tool runs (used by `security-guidance`).

Decision tree: **PreToolUse** when you must block. **PostToolUse** when you must transform results. **SessionStart** when every session needs a kick. Don't reach for hooks when a Skill activation will do — hooks fire unconditionally, Skills fire by judgment.

### Skill vs Subagent vs Hook — when to pick which

| Need | Reach for |
|---|---|
| Capability the model invokes when relevant | Skill |
| Capability you bundle and share | Plugin |
| Behaviour the harness must execute every time | Hook |
| Deep, isolated work in its own context | Subagent (or skill with `context: fork`) |
| Persistent, hosted, sandboxed | Managed Agent |

---

## Part 9 — `ant` CLI and the API/CLI boundary

*Sidebar: this part exists because Linguist learners increasingly drive the bare API alongside Claude Code, and `ant` is the Anthropic-blessed seam between them.*

### What `ant` is

Launched Apr 8 2026. CLI client for the Claude API with native Claude Code integration and YAML versioning of API resources. Reference: [platform.claude.com/docs/en/api/sdks/cli](https://platform.claude.com/docs/en/api/sdks/cli).

The mental model: where `claude` is the *interactive harness*, `ant` is the *deployment surface*. You use `ant` to:

- Inspect and version API resources (model configs, skills, agents) as YAML
- Drive scripted, headless calls against the API with the same auth surface as Claude Code
- Bridge artefacts between a CLI session and a hosted Managed Agent

### When you reach for `ant` instead of `claude`

| Need | Tool |
|---|---|
| Pair-programming, exploration, ad-hoc refactor | `claude` (interactive) |
| Reproducible API call, scripted in CI | `ant` |
| Version-controlled prompt / skill / agent config | `ant` (YAML resources) |
| One-shot codegen against a remote project | `ant` headless or `claude --print` |

### The API/CLI boundary in 2026

Several primitives exist on both sides — pick the right side:

| Primitive | API side | CLI side |
|---|---|---|
| Caching | Automatic via `cache_control` (Feb 19 2026 GA) | Auto-managed; hygiene = stable tool list, MCP `alwaysLoad` |
| Compaction | Compaction API (beta, Opus 4.6+) | `/compact`, autocompact |
| Memory | Memory store (beta, Apr 23) | `CLAUDE.md`, `settings.json` |
| Effort | `effort: xhigh` etc. | `/model` selects, effort follows model defaults |
| Output shape | `output_config.format` | Prompt mechanics |
| Skills | Skills API guide | `/skills`, plugin install |

Reach for the API primitive when you need determinism, audit, or scale. Reach for the CLI primitive when you need ergonomics or interactivity. Most production Linguist workflows end up doing both — `ant` is the seam.

---

## Quick Reference

### Before starting a task
- [ ] Do I have a CLAUDE.md with standing rules?
- [ ] Are my user-wide settings in `~/.claude/settings.json` (v2.1.119+)?
- [ ] Is my verb specific? (fix / add / refactor / explain — not improve / clean up)
- [ ] Have I stated the constraint ceiling?
- [ ] Am I referencing by path, not by description?
- [ ] Is this task single-purpose?

### Choosing the right primitive
- [ ] Is this Skill / Plugin / Hook territory? (Part 8 decision tree)
- [ ] In-CLI subagent, Managed Agent, or Advisor pairing? (Part 5)
- [ ] Have I considered structured outputs / effort / task budgets instead of prompt-only formatting? (Part 3)
- [ ] Is the right model selected for the task? (Part 7)

### During a task
- [ ] Am I pasting files instead of referencing them?
- [ ] Should this research phase be delegated to a subagent or a forked-context skill?
- [ ] Have I asked for a plan before execution on anything complex?
- [ ] If I'm running on Opus xhigh, do I have a task budget set?

### Spotting rot
- [ ] Is the model re-asking things I already answered?
- [ ] Is it drifting from constraints I set earlier?
- [ ] Can I still describe this session in one sentence?
- [ ] Did I read the last compaction summary?
- [ ] Would this state be better served by Memory than by re-pasting context?

### Closing a task
- [ ] Did the model verify the change, or just make it?
- [ ] Should I `/clear` before the next task?
- [ ] Are there standing rules from this session that should go into CLAUDE.md or settings.json?
- [ ] If this was a beta-API workload, did I record the beta-header strings I depended on?

### Operations / managed deployments
- [ ] Settings hierarchy audited against v2.1.126+ (managed-settings inheritance fix)?
- [ ] `channelsEnabled` set if the org wants `--channels` event push (v2.1.128)?
- [ ] `prUrlTemplate` set for self-hosted code review (v2.1.119)?
- [ ] OTEL endpoint not leaking into subprocesses (v2.1.128 fixed inheritance)?
- [ ] Plugin operations enforced via managed settings (v2.1.117)?

---

## Source provenance and beta-header hygiene

This document cites Claude Code source paths and symbols as didactic anchors. They were verified against v2.1.x source as of 2026-05-05; symbols may move or be renamed in later builds. Treat them as *what the harness was doing* rather than *what to import*.

Beta headers cited (all current as of 2026-05-05):

- `managed-agents-2026-04-01` — Managed Agents + Memory
- `advisor-tool-2026-03-01` — Advisor tool
- `output-300k-2026-03-24` — 300k Message Batches output cap

Verify each before depending on it in production; betas evolve.

*Course revision: 2026-05-05.*
