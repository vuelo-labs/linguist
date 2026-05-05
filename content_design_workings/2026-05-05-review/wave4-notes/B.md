# Wave 4 — Track B: claude-code-best-practices-deep.md

Started 2026-05-05.

## Plan
- Add `course-revision: 2026-05-05` frontmatter.
- F-CCBPD-1: Expand Part 5 (Agents) — Managed Agents, Advisor, Memory, per-agent MCP, skill-as-agent, plugin parallel-agent examples. Cross-ref L7/L8/L9.
- F-CCBPD-2: Expand Part 6 — settings.json persistence, prUrlTemplate, channelsEnabled, env-var inventory, Memory.
- F-CCBPD-3: Expand Part 7 — xhigh, task budgets, adaptive-thinking-default, thinking.display: "omitted", Advisor pairing, model selection. Cross-ref L5, L10.
- F-CCBPD-4: Add `ant` CLI section (sidebar — new Part 9).
- F-CCBPD-5: Re-verify `getMemoryFiles()` symbol per CC-1 — keep with provenance hedge.
- F-CCBPD-6: Update Quick Reference checklists.
- New Part 8: Skills, Plugins, Hooks (deep) — deeper than the L7 module.
- New Part 9: ant CLI and the API/CLI boundary (sidebar).

## Layer numbering convention used
L7 = Skills/Plugins/Hooks; L8 = Agent design; L9 = Managed Agents/Memory/Advisor; L10 = Production architecture.

## Coordination
W4-A handles the shorter doc. This deep doc must go further, not duplicate. Strategy: short doc = day-one playbook + plugin shopping list; deep doc = mechanics, decision trees, source provenance, beta-header hygiene, API/CLI boundary.

## Provenance hedges to preserve
- `getMemoryFiles()` → "as named in Claude Code source through v2.1.x; symbol may have moved/renamed in later builds. Verify with current source if reproducing."
- All beta-header strings date-stamped 2026-05-05.

## Done
- Wrote full new version: frontmatter, How-to-read, Parts 1–4 lightly refreshed, Parts 5/6/7 expanded per F-CCBPD-1/2/3, new Parts 8 (Skills/Plugins/Hooks deep), 9 (ant CLI sidebar), updated Quick Reference.
