---
course-revision: 2026-05-05
status: pre-Wave-2.5 — modules below have moved on; index rewrite scheduled for Wave 4
---

# Prompting and AI Agent Skills — Course Index

A skill stack from first use to automated agent swarm design. Grounded in Claude Code's internal source code — system prompts, compaction logic, caching architecture, and agent delegation primitives.

> **Reader note (2026-05-05):** This index is stale relative to the modules. Layers 1–6 have been rewritten against the 2026 ecosystem (auto prompt caching, structured outputs, Skills/Plugins/Hooks, Memory, Compaction API, Advisor, Opus 4.7). A new Layer 6.5 (`skills-plugins-hooks.md`) sits between L6 and L7. Layers 7–8 are pending Wave 3. Treat each module's own opening as the source of truth; the rows below will be rebuilt in Wave 4.

## How this course is structured

The skills build on each other. Each layer assumes the one below it is in place. A person who hasn't internalised Layer 1 will make the same mistakes at Layer 4 — just in a more expensive place.

Each skill follows the same structure:
- **What it is** — one sentence definition
- **Why it matters** — the mechanical reason, not the motivational one
- **Three worked examples** — each with a domain (coding, data/analytics, content/research), a WITHOUT version showing the failure mode, and a WITH version showing actual prompt text

---

## The Skill Stack

| File | Layer | Skills | Core Theme |
|------|-------|--------|------------|
| [01-mental-model.md](01-mental-model.md) | Layer 1 | 1–3 | The model executes text. It has no access to your intent outside what's written. |
| [02-communication-primitives.md](02-communication-primitives.md) | Layer 2 | 4–6 | Verbs signal scope. Targets prevent search. Constraints set the ceiling. |
| [03-session-hygiene.md](03-session-hygiene.md) | Layer 3 | 7–9 | Where instructions live, how sessions are bounded, cost of late corrections. |
| [04-context-awareness.md](04-context-awareness.md) | Layer 4 | 10–12 | What compaction preserves, what it loses, how to intervene. |
| [05-output-engineering.md](05-output-engineering.md) | Layer 5 | 13–14 | Plan before execute. Format is not automatic. |
| [06-tool-fluency.md](06-tool-fluency.md) | Layer 6 | 15 | Control which tools run, in what order, at what scope. |
| [07-agent-design.md](07-agent-design.md) | Layer 7 | 16–17 | Delegation decisions and how to brief a subagent with zero context. |
| [08-production-architecture.md](08-production-architecture.md) | Layer 8 | 18 | Static/dynamic prompt boundary. Cache economics at scale. |

---

## Quick reference

| Layer | Skill | One Line |
|-------|-------|----------|
| 1 | 1. System not mind reader | Write what you mean, not what you assume will be inferred |
| | 2. Context window is finite | What isn't explicit doesn't survive |
| | 3. Tools are how the model acts | Understand the tool layer to control the workflow |
| 2 | 4. Verb-first requests | Pick verbs with defined blast radii |
| | 5. Target specificity | Precise references prevent search overhead |
| | 6. Constraint setting | Constraints are scope ceilings, not limitations |
| 3 | 7. CLAUDE.md | Standing rules in memory, not chat |
| | 8. Session scoping | One session, one purpose |
| | 9. Front-loading | Corrections are expensive; specify upfront |
| 4 | 10. Context rot recognition | Catch degradation before it compounds |
| | 11. Writing for compaction | User messages survive; implicit context doesn't |
| | 12. Checkpointing | Intervene in compaction on your own terms |
| 5 | 13. Plan before execution | One turn to catch misunderstanding vs many to fix it |
| | 14. Format control | Defaults are for brevity; specify when you need more |
| 6 | 15. Guiding tool use | Control path, cost, and auditability |
| 7 | 16. Delegation decision | Delegate when you don't need the raw process |
| | 17. Briefing an agent | Zero context assumed; brief accordingly |
| 8 | 18. Prompt architecture for scale | Static/dynamic split controls cache economics |

---

*Source: Claude Code internal source (v2.1.128, May 2026) — `services/compact/prompt.ts`, `constants/prompts.ts`, `utils/api.ts`, `utils/claudemd.ts`, `services/compact/autoCompact.ts`, `tools/AgentTool/prompt.ts`. These are module paths inside the shipped npm bundle, not files in the public `anthropics/claude-code` repo (which contains only docs and install scripts). Citations are corroborated by independent reverse-engineering write-ups; exact wording may have drifted between releases.*
