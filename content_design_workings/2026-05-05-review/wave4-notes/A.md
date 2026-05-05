# Wave-4 A — claude-code-best-practices.md notes

Date: 2026-05-05.

## Inputs read
- 05-full-sweep-plan.md §2 (claude-code-best-practices.md row).
- 01-freshness-audit.md lines 96–102 (5 findings, all Update/Nit, no Blockers).
- research-updates/2026-05-05/claude-code-and-skills.md (full).
- course/07-skills-plugins-hooks.md head — to match terminology + voice.
- course/01/09/10 frontmatter — confirmed `course-revision: 2026-05-05` only (no status line for renumbered finals).

## Plan
- Add `course-revision: 2026-05-05` frontmatter at top.
- F-CCBP-3 → §7: append Compaction-API option + `/usage` mention; cross-ref L4.
- F-CCBP-4 → §8: reframe around frontmatter subagents + per-agent `mcpServers`; cross-ref L9 for Managed Agents.
- F-CCBP-2 → §11: rewrite around auto mode, `--dangerously-skip-permissions` v2.1.126 expanded scope, managed-settings allowlists (`allowManagedDomainsOnly`/`allowManagedReadPathsOnly`).
- F-CCBP-1 → new §13 "Skills, Plugins, Hooks, MCP" pointing at L7; new §14 "Plugins to install on day one" listing the five plugins.
- Module renumbering — cross-refs use new L1–L10 numbers; L4 = context, L7 = Skills/Plugins/Hooks, L9 = Managed Agents/Memory/Advisor.
- Date-stamp betas (v2.1.x where relevant; Compaction API as Feb 2026 beta on Opus 4.6).
- Provenance hedge: per CC-1, citations corroborated by reverse-engineering write-ups — keep a soft hedge in §13/§14 since these are externally observable surfaces.

## Voice cross-checks
- L7 module uses "as of v2.1.121, 2026-05-05" inline — match that pattern for date-stamping.
- L1/L10 lead with concrete; no preamble paragraphs. Keep new sections terse.

## Execution log
- Frontmatter added.
- §7 augmented with Compaction-API + `/usage`.
- §8 reframed.
- §11 rewritten.
- §13, §14 appended.
- Header stripped of "Sourced from internal Claude Code system prompts and implementation logic." in favor of revised provenance hedge that covers v2.1.x surfaces.

## Open follow-ups
- Plan also calls for a section 12 reference review — section 12 ("Reference files by path") is unchanged, still accurate.
- claude-code-best-practices-deep.md is the larger Wave-4 sibling (separate task).
