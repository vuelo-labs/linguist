---
course-revision: 2026-05-05
---

# Prompting and AI Agent Skills — Course Index

A skill stack from first use to production agent architecture, current to the spring 2026 ecosystem. Grounded in Claude Code's internal source code and the externally observable v2.1.x harness surface — Skills, Plugins, Hooks, MCP, auto mode, Managed Agents, Memory, Advisor, automatic prompt caching, the Compaction API, structured outputs, Opus 4.7.

## How this course is structured

The skills build on each other. Each layer assumes the one below it is in place. A person who hasn't internalised Layer 1 will make the same mistakes at Layer 9 — just in a more expensive place.

Each layer module follows the same structure where the layer is skill-shaped:

- **What it is** — one sentence definition
- **Why it matters** — the mechanical reason, not the motivational one
- **Worked examples** — each with a domain (coding, data/analytics, content/research), a WITHOUT version showing the failure mode, and a WITH version showing actual prompt text

L7 (Skills, Plugins, Hooks) and L9 (Managed Agents, Memory, Advisor) are primitive-shaped rather than skill-shaped — they introduce substrate, not behaviour — and are organised by primitive instead.

---

## The skill stack (2026)

| Layer | File | What it teaches |
|------|------|------------|
| 1 — Mental Model | [01-mental-model.md](01-mental-model.md) | The model executes text, not intent. Tools are how it acts. |
| 2 — Communication Primitives | [02-communication-primitives.md](02-communication-primitives.md) | Verbs signal scope. Targets prevent search. Constraints set the ceiling. |
| 3 — Session Hygiene | [03-session-hygiene.md](03-session-hygiene.md) | Persistent state lives in three places — CLAUDE.md, settings.json, Memory — with three lifetimes and audit profiles. |
| 4 — Context Awareness | [04-context-awareness.md](04-context-awareness.md) | Pick the right context primitive — manual checkpoint, `/compact`, Compaction API, Memory, `context: fork` — for the substrate in front of you. |
| 5 — Output Engineering | [05-output-engineering.md](05-output-engineering.md) | Reach for API primitives first (structured outputs, effort, task budgets, `thinking.display`); fall back to prompt mechanics inside a harness. |
| 6 — Tool Fluency | [06-tool-fluency.md](06-tool-fluency.md) | The 2026 tool taxonomy — built-in / MCP / Skill / deferred / sub-agent-as-tool — and the cost axes beyond token count. |
| 7 — Skills, Plugins, Hooks | [07-skills-plugins-hooks.md](07-skills-plugins-hooks.md) | Three primitives, three lifetimes, three activation surfaces. Pick the right one. |
| 8 — Agent Design | [08-agent-design.md](08-agent-design.md) | In-CLI subagents: context isolation, fork semantics, prompt-cache sharing, per-agent `mcpServers`. |
| 9 — Managed Agents, Memory, Advisor | [09-managed-agents-memory-advisor.md](09-managed-agents-memory-advisor.md) | Substrate shifts beyond the in-CLI loop: hosted agents, persistent memory, fast-executor + strong-advisor pairing. |
| 10 — Production Architecture | [10-production-architecture.md](10-production-architecture.md) | Caching is automatic. The discipline is cache-bust hygiene plus the production primitives (residency, rate limits, models capabilities, Compaction API, model selection). |

**Reference companions** (reread as the v2.1.x harness drifts):

- [claude-code-best-practices.md](claude-code-best-practices.md) — day-one onboarding sheet.
- [claude-code-best-practices-deep.md](claude-code-best-practices-deep.md) — long-form practitioner's guide, current to v2.1.128.
- [glossary.md](glossary.md) — terms-of-art used across the course.

---

## How to read this course in 2026

The 2026 ecosystem moved several mechanics out of "things you have to do by hand" into "things the platform does for you". Read with that in mind:

- **Caching is automatic.** Manual cache-breakpoint placement is no longer the discipline; *cache-bust hygiene* is. L10 covers it. Earlier layers do not teach manual breakpoints.
- **Skills, Plugins, and Hooks are their own layer.** L7 sits between tool fluency (L6) and agent design (L8). Most "how do I make Claude Code always X" questions resolve to one of those three primitives — the wrong choice produces a Skill that should have been a Hook.
- **Managed Agents and Memory live in L9.** They're a substrate shift beyond in-CLI subagents (L8). A managed agent is not just "a subagent that runs on Anthropic's infra"; it has its own session lifetime, audit, and Memory store.
- **The Advisor pattern is in L9.** Fast executor (Haiku 4.5 or Sonnet 4.6) plus strong advisor (Opus 4.7) via the `advisor-tool-2026-03-01` beta header. Treat it as a strategic-guidance primitive, not a model swap.
- **Output engineering is API-first.** L5 leads with `output_config.format`, effort levels (`xhigh` on Opus 4.7), per-task token budgets, and `thinking.display`. Prompt-only formatting is the fallback when you don't own the request.
- **A Practitioner tier sits beyond this course.** The 10 layers above are the Advanced curriculum. A separate Practitioner tier — concept-only as of 2026-05-05, not yet authored — covers deliberate-practice playbooks that assume Advanced fluency.

---

## 2026 model lineup (sidebar)

| Model | Status | Notable |
|-------|--------|---------|
| **Opus 4.7** | GA (announced 2026-04-16) | `xhigh` effort, per-task token budgets, vision up to 2,576 px on long edge, multi-step self-verification |
| **Sonnet 4.6** | GA (Feb 17, 2026) | 1M context GA, web search + programmatic tool calling GA, code execution v2 free with web search/fetch |
| **Haiku 4.5** | GA | Fast executor in the Advisor pattern |
| **Opus 4.6** | GA (Feb 5, 2026) | Adaptive thinking default; Compaction API; data residency controls |

Beta-header timeline relevant to the course: `context-1m-2025-08-07` retired for Sonnet 4.5 / Sonnet 4 on 2026-04-30; `managed-agents-2026-04-01` (Managed Agents + Memory) and `advisor-tool-2026-03-01` (Advisor) are public beta as of 2026-05-05.

---

## Quick reference — skill numbering

L1–L6, L8, and L10 are skill-numbered; L7 and L9 are primitive-organised. Skill numbers below match the modules' own internal numbering.

| Layer | Skill | One Line |
|-------|-------|----------|
| 1 | 1. System not mind reader | Write what you mean, not what you assume will be inferred |
| | 2. Context window is finite | What isn't explicit doesn't survive |
| | 3. Tools are how the model acts | Understand the tool layer to control the workflow |
| 2 | 4. Verb-first requests | Pick verbs with defined blast radii |
| | 5. Target specificity | Precise references prevent search overhead |
| | 6. Constraint setting | Constraints are scope ceilings, not limitations |
| 3 | 7. CLAUDE.md / settings.json / Memory | Three persistent surfaces, three lifetimes |
| | 8. Session scoping | One session, one purpose |
| | 9. Front-loading | Corrections are expensive; specify upfront |
| 4 | 10. Context rot recognition | Catch degradation before it compounds |
| | 11. Writing for compaction | User messages survive; implicit context doesn't |
| | 12. Checkpointing & primitive selection | Manual / `/compact` / Compaction API / Memory / forked-skill context |
| 5 | 13. Plan before execution | One turn to catch misunderstanding vs many to fix it |
| | 14. Format control (API-first) | `output_config.format` and effort/budgets before prose |
| 6 | 15. Guiding tool use | Control kind, order, scope, and cost across the 2026 taxonomy |
| 7 | — | Skills / Plugins / Hooks (primitive-organised) |
| 8 | 16. Delegation decision | Delegate when you don't need the raw process |
| | 17. Briefing a subagent | Zero context assumed; brief accordingly |
| 9 | — | Managed Agents / Memory / Advisor (primitive-organised) |
| 10 | 18. Cache-bust hygiene | Keep the prefix stable so the auto-managed cache hits |

---

*Source: Claude Code internal source (v2.1.128, May 2026) — `services/compact/prompt.ts`, `constants/prompts.ts`, `utils/api.ts`, `utils/claudemd.ts`, `services/compact/autoCompact.ts`, `tools/AgentTool/prompt.ts`, `promptCacheBreakDetection.ts`. These are module paths inside the shipped npm bundle, not files in the public `anthropics/claude-code` repo (which contains only docs and install scripts). Citations are corroborated by independent reverse-engineering write-ups; structure verified against v2.1.128, exact wording may have drifted between releases. Externally observable surfaces — slash commands, settings files, plugin names, beta headers, the published 2026 model lineup — are the durable anchors.*
