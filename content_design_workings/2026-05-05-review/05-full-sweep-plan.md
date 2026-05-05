# 05 — Full-Sweep Plan: Linguist Advanced Refresh + Practitioner Tier

_Source: Plan agent synthesis of 01-freshness-audit.md, 03-practitioner-concept.md, 04-cyborg-alignment.md, and the 2026-05-05 ecosystem research. Produced 2026-05-05._

## 1. Executive summary

The 2026-05-05 audit found 4 Blockers, 35 Updates, 14 Nits across 11 files. Layers 1–4 age gracefully and need framing refreshes. Layers 5–8 plus the two best-practices appendices need substantive rework: their central mechanics (manual cache breakpoints, "Agent tool", `/plan`-only permissioning, prompt-only output shaping) have been superseded by shipped Anthropic primitives (automatic prompt caching, Managed Agents + Memory, auto mode, structured outputs + task budgets, Advisor, Skills/Plugins/Hooks). The course also has zero coverage of Skills, Plugins, Hooks, MCP changes, Managed Agents, Advisor, Opus 4.7, and the Claude Code 2.1.x surface — all first-class for an Advanced learner today. Practitioner tier is approved as the deliberate-practice layer between Advanced and paid Cyborg, but P3 still references the wrong free-tier substrate; P4 sets the correction (free = Scenario Library, NOT Veralux) and lists hard MUSTs/MUST-NOTs.

**Two highest-impact decisions before execution:**
1. **L8 thesis.** Replace the dynamic-boundary thesis (now a Claude-Code-internal curiosity) with an "automatic-caching + cache-bust hygiene + production primitives (Memory, compaction API, residency, rate limits)" thesis — full rewrite — vs. keep the old thesis as a historical sidebar and bolt the new material on as L8b. **Recommendation: full rewrite.**
2. **Managed Agents placement.** New module L9 (Managed Agents + Memory + Advisor) vs. expansion of L7. **Recommendation: expand L7 into "Agent Design (in-CLI subagents → Managed Agents)" and lift Advisor into L5/L7 jointly; avoid a new module so the eight-layer spine survives.**

---

## 2. Per-module change set

### 00-index.md
- **Current thesis:** Eight-layer skill stack culminating in static/dynamic prompt boundary + cache economics.
- **Revised thesis:** Eight layers; L8 reframed to "production primitives" (caching is now automatic; the discipline is cache-bust hygiene, Memory, compaction API, residency, model selection).
- **Edits:** F00-1 update source-code citation footer (re-verify all paths against v2.1.128); F00-2 add Skills / Plugins / Hooks / MCP / Managed Agents / Advisor / Memory line to skill-stack table (or as cross-cutting "primitives layer"); F00-3 rewrite L8 row.
- **New material:** "How to read this course in 2026" sidebar — what's auto-caching now, what's Managed Agents, where the Practitioner tier slots in.
- **Effort:** S
- **Risk:** Index drift if downstream module thesis statements change after this is written. Sequence index last.

### 01-mental-model.md
- **Current thesis:** Claude as text-completion engine; tools as how the model acts.
- **Revised thesis:** Same. Sound.
- **Edits:** F01-1 bump 2025 examples to 2026 (Nits); F01-2 expand "tools" framing to include Skills (proactive activation via SKILL.md), MCP tools (`alwaysLoad`), deferred tools (WebSearch/WebFetch + `context: fork`); F01-3 strip or footnote the unsourced latency numbers (auto-caching makes them misleading).
- **New material:** Half-page "the 2026 tool surface" callout listing tool *kinds* (built-in, MCP, Skill, deferred, sub-agent-as-tool) with a sentence each.
- **Effort:** S
- **Risk:** Low.

### 02-communication-primitives.md
- **Current thesis:** Verb-first prompting; system prompt grounding.
- **Revised thesis:** Same.
- **Edits:** F02-1 re-verify `constants/prompts.ts` citation; F02-2 add structured-outputs + `output_config.format` paragraph (Feb 2026 GA + rename); F02-3 add auto-mode + skill-proactive-activation to verb table footnote.
- **New material:** Short "structured outputs vs prompt-only formatting" callout — when to reach for `output_config.format` vs. teaching the model in prose.
- **Effort:** S
- **Risk:** Low.

### 03-session-hygiene.md
- **Current thesis:** CLAUDE.md hierarchy + session scoping = persistent instructions discipline.
- **Revised thesis:** CLAUDE.md + settings.json + Memory = persistent state, with three different lifetimes and audit profiles.
- **Edits:** F03-1 add settings.json hierarchy (`~/.claude/settings.json` v2.1.119, managed settings inheritance, security fix v2.1.126); F03-2 swap `/cost`+`/stats` → `/usage`; F03-3 add `/compact`, `claude project purge` (v2.1.126); F03-4 re-verify `utils/claudemd.ts` and `AUTOCOMPACT_BUFFER_TOKENS`.
- **New material:** New section "Memory (Managed Agents)" — what it is, when it replaces CLAUDE.md, scoped permissions, audit logs.
- **Effort:** M
- **Risk:** Memory is public beta; spec may shift. Date-stamp the section.

### 04-context-awareness.md
- **Current thesis:** Manual context awareness + checkpointing against context rot.
- **Revised thesis:** Context awareness in a 1M-context, auto-compact, server-side-compaction-API world: when to reach for which primitive.
- **Edits:** F04-1 re-verify the 9-section compaction prompt quote; F04-2 add Compaction API (Feb 2026, Opus 4.6 beta) as the canonical server-side option; F04-3 acknowledge 1M GA on Sonnet 4.6 / Opus 4.6 and beta-header retirement (Apr 30); F04-4 add `context: fork` skill semantics; F04-5 update `AUTOCOMPACT_BUFFER_TOKENS` reference.
- **New material:** Decision tree "manual checkpoint vs `/compact` vs Compaction API vs Memory vs forked-skill context".
- **Effort:** M
- **Risk:** 1M-context-autocompact false-positive fix in v2.1.128 — confirm behavior current.

### 05-output-engineering.md
- **Current thesis:** Shape output via prompt construction.
- **Revised thesis:** Shape output via API primitives first (structured outputs, effort/budgets, `thinking.display`), prompt mechanics second.
- **Edits:** **B05-1 (Blocker)** add structured outputs + `output_config.format` + per-task token budgets + `xhigh` effort (Opus 4.7) as the canonical mechanisms; F05-2 reframe `/plan` → auto mode + plan + permissioning model (Mar 25 blog); F05-3 re-verify "lead with the answer" quote; F05-4 add Advisor pattern to Example 3.
- **New material:** New section "API-level output controls" (~1 page) — structured outputs, effort levels, task budgets, `thinking.display: "omitted"`.
- **Effort:** L
- **Risk:** Largest semantic rewrite in lower-half. Examples may need rebuilding.

### 06-tool-fluency.md
- **Current thesis:** Tool cost hierarchy: Read < Glob < Grep < Bash < Agent.
- **Revised thesis:** Tool *taxonomy* and *cost hierarchy*: built-in vs MCP vs Skill vs deferred vs sub-agent-as-tool; cost is one axis among several (latency, cache impact, permission surface, restartability).
- **Edits:** **B06-1 (Blocker)** rewrite tool table to include Skills, MCP (with `alwaysLoad`), Advisor, deferred tools, computer use, code execution v2; F06-2 retire single-capital-A "Agent tool" framing → subagents (frontmatter, `mcpServers`) + forked subagents (`CLAUDE_CODE_FORK_SUBAGENT=1`); F06-3 rewrite Example 3 (WebSearch as deferred tool; `context: fork`); F06-4 add `/usage`, `/skills`, `/mcp` tool count, hooks (`mcp_tool`, `PostToolUse`, `duration_ms`).
- **New material:** "Skills, Plugins, Hooks: the 2026 day-to-day" — ~2 pages introducing Skills (SKILL.md, agentskills.io, `/skills`, OTEL `claude_code.skill_activated`), official plugins (`code-review`, `feature-dev`, `pr-review-toolkit`, `hookify`), hook surface.
- **Effort:** XL
- **Risk:** Largest single rewrite. Pulls in Skills/Plugins/Hooks the rest of the course assumes.

### 07-agent-design.md
- **Current thesis:** Designing in-CLI sub-agents via "Agent tool" prompt structure.
- **Revised thesis:** Designing agents across three substrates: in-CLI subagents (frontmatter, `mcpServers`), Managed Agents (hosted, sandboxed, Memory-backed), and the Advisor pairing pattern. Sub-agent prompt-cache sharing as a cost-design lever.
- **Edits:** **B07-1 (Blocker)** add Managed Agents (Apr 8) + Memory (Apr 23) as first-class agent substrate; F07-2 add Advisor pattern (header `advisor-tool-2026-03-01`) as canonical executor+advisor pairing; F07-3 add fork semantics, sub-agent prompt-cache sharing (~3× reduction, v2.1.128), per-agent MCP servers (v2.1.117); F07-4 update "Beyond Skill 18" coda; F07-5 re-verify `tools/AgentTool/prompt.ts` quotes.
- **New material:** New section "Managed Agents + Memory" (~3 pages); new section "The Advisor pattern"; new section "Subagent cost shape" (cache sharing, fork, `mcpServers`).
- **Effort:** XL
- **Risk:** Managed Agents in beta; spec churn likely. Date-stamp aggressively.

### 08-production-architecture.md
- **Current thesis:** Static/dynamic prompt boundary + cache economics at scale (`SYSTEM_PROMPT_DYNAMIC_BOUNDARY`, `splitSysPromptPrefix`, `cacheScope: 'global'`).
- **Revised thesis:** **Production primitives in 2026** — automatic prompt caching as default; cache-bust *hygiene* as the new discipline; tool-list stability via MCP `alwaysLoad`; production controls (data residency, rate limits API, models capabilities API); model selection across Opus 4.7 / Sonnet 4.6 / Haiku 4.5 with retirement timeline; Memory + Compaction API as session primitives.
- **Edits:** **B08-1 (Blocker)** rewrite the boundary thesis: keep as historical "how Claude Code does it internally" sidebar; promote automatic caching as the production default; F08-2 rebuild cache-math examples under auto-caching; F08-3 expand cache-bust hygiene with MCP `alwaysLoad`, reconnect-summarization, `promptCacheBreakDetection.ts` (re-verify); F08-4 rewrite "Beyond Skill 18" — agent swarms / stateful sessions / OTEL instrumentation are now shipped; F08-5 add data residency (`inference_geo`), fast mode, Rate Limits API, Models API capabilities; F08-6 add Compaction API; F08-7 add model-selection + retirement-timeline section (Opus 4.7 xhigh / 2576px vision / task budgets; Sonnet 4.6 1M GA; Haiku 4.5; retired models).
- **New material:** New "production primitives" section (residency, rate limits, models capabilities, fast mode); new "model selection in 2026" section; sidebar "what we used to teach: the dynamic boundary".
- **Effort:** XL
- **Risk:** Largest rewrite of the course. Many cross-references from earlier modules will need updating after L8 settles.

### claude-code-best-practices.md
- **Current thesis:** Working-with-Claude-Code field guide.
- **Revised thesis:** Same, brought to v2.1.128.
- **Edits:** F-CCBP-1 add Skills / Plugins / Hooks / MCP coverage; F-CCBP-2 reframe section 11 (auto mode, `--dangerously-skip-permissions` v2.1.126 scope, managed-settings allowlists); F-CCBP-3 add Compaction API option to Section 7; F-CCBP-4 reframe Section 8 sub-agents around frontmatter agents + Managed Agents.
- **New material:** New section "Plugins to install on day one" (`code-review`, `pr-review-toolkit`, `hookify`, `plugin-dev`, `security-guidance`).
- **Effort:** M
- **Risk:** Low.

### claude-code-best-practices-deep.md
- **Current thesis:** Long-form deep dive.
- **Revised thesis:** Same.
- **Edits:** F-CCBPD-1 expand Part 5 (Agents) with Managed Agents, Advisor, Memory, per-agent MCP, skill-as-agent, plugin parallel-agent examples; F-CCBPD-2 expand Part 6 with settings.json persistence, `prUrlTemplate`, `channelsEnabled`, env-var inventory, Memory; F-CCBPD-3 expand Part 7 with `xhigh`, task budgets, adaptive-thinking-default, `thinking.display: "omitted"`, advisor pairing, model selection criteria; F-CCBPD-4 add `ant` CLI section; F-CCBPD-5 re-verify `getMemoryFiles()` symbol; F-CCBPD-6 update Quick Reference checklists.
- **New material:** New Part 8 "Skills, Plugins, Hooks (deep)"; new Part 9 "ant CLI and the API/CLI boundary".
- **Effort:** L
- **Risk:** Length. Risk of drift from the shorter best-practices doc — need to keep them aligned.

---

## 3. New lesson(s) to author

Recommendation: **fold most new material into existing modules**, with two genuine new lessons.

### NL-1 — "Skills, Plugins, Hooks" (lives in L6)
- **Objective:** Distinguish Skill vs Plugin vs Hook by mechanism + lifetime; pick the right primitive for a given behavior.
- **Outline:** SKILL.md anatomy & proactive activation; the `/skills` workflow + `context: fork`; official plugins tour (`code-review`, `feature-dev`, `pr-review-toolkit`, `hookify`); hook surface (`type: "mcp_tool"`, `PostToolUse` replace, `duration_ms`, SessionStart/PreToolUse); decision tree "skill vs subagent vs hook".
- **Prereqs:** L1–L4; L6 tool-fluency baseline.
- **Why not folded:** Too much surface to cram into L6's tool table without breaking it. But housing it as L6's second half (rather than a standalone module) preserves the eight-layer spine.

### NL-2 — "Managed Agents, Memory, and the Advisor Pattern" (extends L7)
- **Objective:** Choose between in-CLI subagent, hosted Managed Agent, and Advisor pairing for a given long-horizon task.
- **Outline:** Managed Agents architecture (sandboxes, beta header, SSE); Memory store semantics (file-backed, scoped, audited, exportable); the Advisor pattern (executor+advisor, header `advisor-tool-2026-03-01`); fork + sub-agent prompt-cache sharing; per-agent `mcpServers`.
- **Prereqs:** L7 first half (in-CLI subagent design).
- **Why not folded:** Managed Agents is a substrate shift, not just new tactics. But it inherits L7's design vocabulary, so an in-module extension beats a new module.

The remaining "major omissions" (automatic caching, compaction, Opus 4.7 specifics, Claude Code 2.1.x surface, MCP changes, structured outputs) are best **inserted into existing modules** per §2 — they each fit naturally into L3 / L4 / L5 / L6 / L8 and don't warrant standalone lessons.

---

## 4. Cross-cutting tasks

### CC-1 Re-verify Claude Code source paths against v2.1.128
Course currently cites: `services/compact/prompt.ts`, `constants/prompts.ts`, `utils/api.ts`, `utils/claudemd.ts`, `services/compact/autoCompact.ts`, `tools/AgentTool/prompt.ts`, `promptCacheBreakDetection.ts`, plus symbols `AUTOCOMPACT_BUFFER_TOKENS`, `SYSTEM_PROMPT_DYNAMIC_BOUNDARY`, `splitSysPromptPrefix`, `getMemoryFiles()`. Audit each against current source; update or excise. Modules touched: 00, 02, 03, 04, 07, 08, claude-code-best-practices-deep.

### CC-2 Reconcile P3 against P4
Edits required to `03-practitioner-concept.md`:
- §2 entry criteria: replace "free-tier Cyborg account for the lab scenarios" with "free-tier Cyborg **Scenario Library** access" (P4 §2 correction).
- §2 exit criteria: replace "free-tier Cyborg telemetry" + "free-tier Cyborg lab" — Scenario Library does not provide Veralux-style telemetry. Reframe as "self-attested + Scenario Library artefacts where applicable".
- §3 Playbooks "Always paired with a free-tier Cyborg scenario" — restrict to Scenario Library entries only; add explicit "never Veralux content" caveat.
- §3 add new MUST-NOT list mirroring P4 §5 (no Veralux names, no 15 tensions, no Gordon brief, no assessment-shape replication, no Scenario Library rebrand).
- §4 cadence references — change "free-tier Cyborg sandbox" to "Scenario Library + Practitioner-bespoke artefacts".
- §5 add new open question: "Profile alignment — five Cyborg profiles vs analyst-first framing" (P4 OQ#3).
- New §6 — add Cyborg open-questions list verbatim from P4 §6 (or cross-link).

### CC-3 Glossary / 00-index updates
- Add to skill-stack table or new "primitives layer": Skills, Plugins, Hooks, MCP, Managed Agents, Memory, Advisor.
- Add 2026 model lineup + retirement dates as a sidebar.
- Add Practitioner tier pointer + scope statement.
- New glossary entries: SKILL.md, plugin, hook (`mcp_tool` / `PostToolUse` / `duration_ms`), Managed Agent, Memory, Advisor, fork, `context: fork`, `alwaysLoad`, `xhigh`, structured outputs, Compaction API, automatic prompt caching, `/usage`, `claude project purge`, `ant` CLI, `inference_geo`.

### CC-4 URL / path / redirect updates
- Replace any `code.claude.com/docs/en/overview` vs `docs.claude.com/en/docs/claude-code/overview` inconsistencies — pick one canonical.
- Add links: anthropics/skills repo, agentskills.io, plugins README, Managed Agents docs, Memory docs, Advisor announcement, Opus 4.7 announcement + migration guide.
- Date-stamp every section that cites a beta header (Memory, Managed Agents, Advisor, Compaction).

### CC-5 Versioning convention
Add a `course-revision: 2026-05-05` frontmatter (or footer) to each module so future drift is traceable. Add per-section "as of" stamps for any beta or v2.1.x-specific content.

---

## 5. Execution order

Five waves. Within a wave, items are independent and parallelizable.

### Wave 0 — Verification (must complete first; serial dependency for all downstream)
- CC-1 source-path re-verification.
- Confirm Memory + Managed Agents + Advisor beta-header strings are still current.
- Confirm 1M context behavior + Compaction API status on Opus 4.6/4.7.

### Wave 1 — Lower-layer refreshes (parallel, low-risk)
- L1 (01-mental-model)
- L2 (02-communication-primitives)
- L3 (03-session-hygiene)
- L4 (04-context-awareness)
- CC-2 reconcile P3 against P4 (independent of course edits)

### Wave 2 — Mid-layer rewrites (parallel after Wave 1; medium risk)
- L5 (05-output-engineering) — Blocker B05-1
- L6 (06-tool-fluency) — Blocker B06-1, includes NL-1 inline

### Wave 3 — Upper-layer rewrites (parallel after Wave 2; highest risk)
- L7 (07-agent-design) — Blocker B07-1, includes NL-2 inline
- L8 (08-production-architecture) — Blocker B08-1; depends on L6/L7 framing for Skills/Memory cross-refs

### Wave 4 — Appendices + index (serial after Wave 3)
- claude-code-best-practices.md
- claude-code-best-practices-deep.md
- 00-index.md (last; reflects final shape of all eight modules)
- CC-3 glossary; CC-4 URLs; CC-5 versioning stamps applied across all files

**Critical path:** Wave 0 → L8 (longest single rewrite) → 00-index. Everything else can ride in parallel.

---

## 6. Open decisions for the user

1. **L8 thesis replacement.** Full rewrite around "production primitives" with the dynamic boundary as a historical sidebar — vs additive layer (keep existing L8, append "L8b: 2026 production primitives"). *Recommendation: full rewrite.*
2. **Managed Agents placement.** New L9 module vs expansion of L7 (NL-2 inline). *Recommendation: extend L7.*
3. **Skills/Plugins/Hooks placement.** Folded into L6 as second-half (NL-1 inline) vs standalone module between L6 and L7 vs split across L3/L6/L7. *Recommendation: NL-1 inline in L6.*
4. **Source-path citations.** Re-verify and keep them as didactic anchors — vs strip entirely and replace with capability-level descriptions (decoupling course from harness internals). *Open — has long-term-maintenance implications.*
5. **Cyborg "profile mismatch" (P4 OQ#3).** Five-profile system vs analyst-first framing vs profiles-as-flavoring. Linguist needs a stance for Practitioner. *Needs Cyborg-team alignment.*
6. **Practitioner Cyborg surface.** P3 currently assumes free-tier Cyborg gives lab telemetry; P4 establishes free = Scenario Library only. Confirm Practitioner exit criteria can be met without Veralux telemetry. *Likely yes; needs explicit user sign-off.*
7. **Linguist stance on tool drift.** Quarterly review cadence vs continuous-update vs frozen-by-design with version stamps. Practitioner playbooks especially exposed.
8. **`ant` CLI emphasis.** First-class in claude-code-best-practices-deep — vs sidebar — vs out of scope this sweep.
9. **Free-zip Version D (P4 OQ#1).** Whether `trellis_analytics` can be referenced by Practitioner. Pending Cyborg team.
10. **Course versioning convention.** `course-revision:` frontmatter — or per-file changelog — or git tags only.
11. **Practitioner publication target.** Lives under `course/` as a sibling tier — or `course/practitioner/` subdir — or separate top-level `practitioner/`. (Affects 00-index design.)

---

## 7. Out-of-scope for this sweep

- **No Practitioner lesson authoring.** This sweep produces (a) revised Advanced course and (b) Practitioner *concept* reconciled with P4. Drill/playbook/field-report content authoring is a separate downstream pass.
- **No Cyborg content changes.** P4 is binding; Cyborg docs are not edited.
- **No platform spread expansion.** Multi-platform (ChatGPT / Gemini / Tines) coverage stays at current depth; no new platform modules.
- **No exercise-HTML / interactive-asset rebuilds.** `exercise-1.html`, `exercise-2.html`, `exercises/` directory, `course.css` untouched unless a textual edit upstream demands it.
- **No `prompting-ai-agent-skills-curriculum.md`.** Touch only if directly contradicted by Wave-2/3 changes.
- **No retroactive translation/localization.**
- **No new evals or assessments.** Practitioner-self-rubrics are deferred to the Practitioner authoring pass.
- **No marketing / positioning rewrites.**
- **No re-verification of third-party links** (DeepLearning.AI, Skilljar) beyond what `learning-resources.md` already flags.
- **No `ant` CLI tutorial content** beyond a sidebar in claude-code-best-practices-deep.
