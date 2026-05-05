# Wave 4 — URL audit (CC-4)

_Scope: 12 course files (10 layers + 2 best-practices). 2026-05-05._

## Method
`grep -nE 'https?://...'` across all 12 files. Inspected each external URL for:
1. `code.claude.com` vs `docs.claude.com` vs `platform.claude.com` consistency.
2. Date-stamps on beta-header references.
3. Required additions per plan §4 CC-4.

## Findings

### Inconsistency: `code.claude.com` reference (FIXED)
- `07-skills-plugins-hooks.md:124` — `https://code.claude.com/docs/en/hooks` with link text "docs.claude.com hooks". Mismatched. Fixed to `https://docs.claude.com/en/docs/claude-code/hooks`.
- `07-skills-plugins-hooks.md:194` — same issue in "Further reading". Fixed.

No other `code.claude.com` references in the corpus.

### Mislabeled link text (FIXED)
- `claude-code-best-practices-deep.md:286` — link text said "docs.claude.com/docs/en/managed-agents/overview" but URL points to platform.claude.com. Aligned text to URL (platform.claude.com).

### Canonical hosts in use (LEFT AS IS)
- `platform.claude.com/docs/...` — Managed Agents, Memory, Advisor docs, `ant` CLI, migration guide, release notes (L9, claude-code-best-practices-deep). Consistent.
- `www.anthropic.com/news`, `www.anthropic.com/engineering` — announcements + engineering blog. Consistent.
- `github.com/anthropics/skills`, `github.com/anthropics/claude-code/blob/main/plugins/README.md`, `github.com/anthropics/claude-agent-sdk-python` — repo links. Consistent.
- `agentskills.io` — cross-vendor skill spec. Present in L7 and best-practices-deep.

### Required additions — coverage check (NO ACTION NEEDED)
Plan called for: anthropics/skills, agentskills.io, plugins README, Managed Agents docs, Memory docs, Advisor announcement, Opus 4.7 announcement + migration guide. All present in L7 and L9 from prior waves. No additions needed in 00-index (it now points readers to the layers and to the glossary, which cross-link).

### Date-stamps on beta-header references (VERIFIED)
- `managed-agents-2026-04-01` — stamped "public beta as of 2026-05-05" in L9 (lines 11–13, 37, 70).
- `advisor-tool-2026-03-01` — stamped in L9 line 13 and 112.
- Compaction API beta — stamped "(Opus 4.6, beta as of 2026-05-05)" in L4.
- 1M context retirement — `context-1m-2025-08-07` retired 2026-04-30, stamped in L4 and 00-index sidebar.
- Memory beta header — stamped in L3 and L9.

All beta references carry "as of" date stamps. Pass.

## Summary
- 3 fixes applied (2 in L7, 1 in best-practices-deep).
- All other URLs canonical and consistent.
- All beta-header references date-stamped per CC-4.
- Required additions already present from Waves 2/3.
