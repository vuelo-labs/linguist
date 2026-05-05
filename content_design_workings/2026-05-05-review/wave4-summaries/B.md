# Wave 4 Track B — claude-code-best-practices-deep.md

## Scope completed
Full Wave-4 plan §2 edits to the deep best-practices doc. File grew from 355 lines to ~370+ lines of denser material; structure expanded from 7 parts + Quick Reference to 9 parts + provenance footer.

## Edits applied
- **Frontmatter** added: `course-revision: 2026-05-05`.
- **How-to-read** rewritten; added explicit L1–L10 cross-reference key using the new layer numbering (L7 Skills/Plugins/Hooks, L8 Agent design, L9 Managed Agents/Memory/Advisor, L10 Production architecture).
- **Part 2** (Input Management) extended with Rule 5 — persistent-state primitive table (user message vs CLAUDE.md vs settings.json vs Memory).
- **Part 3** (Output Management) — new "API-level output controls" section: `output_config.format`, effort GA, `xhigh`, task budgets, `thinking.display: "omitted"`, adaptive thinking on Opus 4.6/4.7. Auto mode replaces `/plan`-only framing.
- **Part 4** (Context) — added rot-mitigation decision tree (clear / compact / Compaction API / forked skill / Memory / project purge); 1M-context GA + retired beta-header section.
- **Part 5** (Agents) — F-CCBPD-1 expansion: three substrates (in-CLI subagents, Managed Agents, Advisor pairing); per-agent MCP (v2.1.117); forked subagents (`CLAUDE_CODE_FORK_SUBAGENT`); sub-agent prompt-cache sharing (v2.1.128); skill-as-agent with plugin parallel-agent examples (`code-review` 5 agents, `feature-dev` 7 phases, `pr-review-toolkit` 6); Managed Agents + Memory beta-header stamped; Advisor pattern Sonnet+Opus pairing.
- **Part 6** (Persistence) — F-CCBPD-2: settings.json hierarchy + `prUrlTemplate` + `channelsEnabled` + managed-settings security fix v2.1.126; full env-var inventory table; CLAUDE.md vs Memory comparison table. `getMemoryFiles()` kept with explicit provenance hedge per F-CCBPD-5.
- **Part 7** (Working with the model) — F-CCBPD-3: `xhigh`, task budgets, `thinking.display: "omitted"`, Advisor pairing as cost compromise, model-selection table with retirement timeline (Opus 4.7 / Sonnet 4.6 / Opus 4.6 / Haiku 4.5; Sonnet 4 + Opus 4 retire Jun 15 2026).
- **Part 8 (NEW)** — Skills, Plugins, Hooks deep: SKILL.md authoring + activation contract; `context: fork` + deferred-tool fix; OTEL `claude_code.skill_activated` triggers; plugin operations (zip, prune, npm update, headless errors); plugin shelf annotated as worked examples; hook surface (`PostToolUse` all-tools, `mcp_tool`, `duration_ms`, SessionStart/PreToolUse); Skill-vs-Subagent-vs-Hook decision matrix.
- **Part 9 (NEW, sidebar)** — F-CCBPD-4 `ant` CLI: API/CLI boundary table (caching, compaction, memory, effort, output, skills) showing where each primitive lives.
- **Quick Reference** — F-CCBPD-6 expanded into five checklist groups including primitive selection and managed-deployment ops.
- **Provenance footer** — date-stamped beta headers (`managed-agents-2026-04-01`, `advisor-tool-2026-03-01`, `output-300k-2026-03-24`) and source-path hedge.

## Coordination
Stayed clear of W4-A territory: no day-one plugin shopping list, no install-on-day-one section. Deep doc focuses on mechanics, decision trees, source provenance, API/CLI boundary, beta-header hygiene.

## Key findings / hedges
- `getMemoryFiles()` retained with explicit "verify against current source" hedge — symbol confirmed through v2.1.x but may have moved.
- All beta headers stamped "as of 2026-05-05".
- All v2.1.x version numbers preserved as didactic anchors per CC-1 stance.

## Files
- Edited: `/Users/liam/Projects/vuelo-labs/linguist/course/claude-code-best-practices-deep.md`
- Notes: `/Users/liam/Projects/vuelo-labs/linguist/content_design_workings/2026-05-05-review/wave4-notes/B.md`
