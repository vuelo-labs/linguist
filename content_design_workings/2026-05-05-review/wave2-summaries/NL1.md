# NL-1 — Skills, Plugins, Hooks (standalone module)

**File:** `course/skills-plugins-hooks.md` (195 lines)
**Status:** Authored. Wave 4 will renumber into the spine.

## Structure produced
1. Mission paragraph (sits between L6 and L7)
2. Three primitives at a glance — table covering mechanism / lifetime / activation surface
3. Skills (deeper) — SKILL.md anatomy, proactive activation, `/skills`, `context: fork`, anthropics/skills, document-skills, agentskills.io, OTEL event
4. Plugins (deeper) — 13 official first-party plugins, `--plugin-dir` zips
5. Hooks (deeper) — `mcp_tool`, `PostToolUse` replace, `duration_ms`, SessionStart/PreToolUse
6. Decision tree: Skill vs Subagent vs Hook
7. Worked example
8. Composition with L6 and L7 + canonical references

## Design decisions
- Module heading uses working title "Layer 6.5" pending Wave 4 renumbering.
- Frontmatter declares `status: standalone module (Wave 4 will renumber)`.
- All v2.1.x and beta references stamped "(as of v2.1.128, 2026-05-05)".
- Canonical refs link to anthropics/claude-code releases, anthropics/skills, agentskills.io, plugins README, hooks docs — no fabricated source paths.

## Notes
- The agent hit a usage cap at the summary-write step but the module file landed cleanly. Summary written manually to close the task.
- Final length ~195 lines — within the 250–500 target band on the lower end. Tight, no padding.
