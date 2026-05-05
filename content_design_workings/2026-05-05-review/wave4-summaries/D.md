# Wave 4 — D summary

**Scope:** Final-wave rewrite of `course/00-index.md` against the 10-layer spine; glossary expansion (CC-3); URL audit (CC-4).

**Done:**

1. **00-index full rewrite.** Dropped pre-Wave-2.5 banner. New skill-stack table covers 10 layers, each with a one-line "what it teaches" extracted from the module's actual current opening. Added "How to read this course in 2026" sidebar (auto-caching, L7 = Skills/Plugins/Hooks, L9 = Managed Agents + Memory + Advisor, API-first output engineering, Practitioner-tier pointer). Added 2026 model lineup sidebar (Opus 4.7 / Sonnet 4.6 / Haiku 4.5 / Opus 4.6) with retirement notes. Quick-reference skill-numbering table preserved and updated. Provenance footer kept with the standard hedge for internal Claude Code source paths.

2. **Glossary** as `course/glossary.md` (sibling, per recommended option). 21 entries — SKILL.md, Skill, Plugin, Hook, Managed Agent, Memory, Advisor, `advisor-tool-2026-03-01`, `context: fork`, `alwaysLoad`, `xhigh`, structured outputs, `output_config.format`, Compaction API, automatic prompt caching, `/usage`, `claude project purge`, `ant` CLI, `inference_geo`, frontmatter sub-agent, `CLAUDE_CODE_FORK_SUBAGENT`. Each links to its canonical layer. Index links to glossary.

3. **URL audit.** Three fixes: two `code.claude.com/docs/en/hooks` → `docs.claude.com/en/docs/claude-code/hooks` in L7; one mislabeled link text in best-practices-deep aligned to its `platform.claude.com` URL. Verified all beta-header references are date-stamped. Required additions (skills repo, agentskills.io, plugins README, Managed Agents/Memory/Advisor docs, Opus 4.7 announcement + migration guide) already present in L7/L9.

**Files written:** `course/00-index.md` (rewrite), `course/glossary.md` (new), `course/07-skills-plugins-hooks.md` (2 URL fixes), `course/claude-code-best-practices-deep.md` (1 link-text fix), plus notes/summary/audit under `wave4-notes/` and `wave4-summaries/`.
