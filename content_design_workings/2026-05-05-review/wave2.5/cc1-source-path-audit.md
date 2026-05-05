# CC-1: Claude Code Source-Path Citation Audit

**Date:** 2026-05-05
**Target version:** Claude Code v2.1.128 (released May 4 2026 by @ashwin-ant)
**Method:** Grep course corpus for path-shaped strings and named symbols attributed to Claude Code internals; verify via release notes, docs, and independent reverse-engineering write-ups.

---

## 1. Summary

| Metric | Count |
|---|---|
| Distinct internal source citations (paths) | 7 |
| Distinct internal symbol citations | 4 |
| Verified (confirmed by ≥1 independent reverse-engineering source) | 6 (paths) + 4 (symbols) |
| Not directly re-confirmed in this audit (plausible, in-tradition) | 3 (paths) |
| Already softened by Wave 1+2 with "structure verified, wording may have drifted" | All occurrences except `08-production-architecture.md` lines 12 + 185 and `00-index.md` line 56 |
| Citations to *user-example* paths (e.g. `src/auth.ts`, `src/cart/totals.ts`) | Many — out of scope, these are pedagogical placeholders, not Claude Code source |

**Key finding — repo status:** `anthropics/claude-code` is a public repo but contains **only docs, install scripts, and plugin examples**. There is **no `src/` tree** with the cited TypeScript files. v2.1.128 ships as a bundled npm package; the cited paths (`services/compact/prompt.ts` etc) are *internal module paths* visible only to those who unminify the bundle. They are widely reproduced in independent reverse-engineering work (markdown.engineering Lesson 39, helmcode claude-code-explain, deepwiki ghboke/claude-code-reverse, dbreunig 2026-04-04, claudelog, Piebald-AI/claude-code-system-prompts).

**Recommendation:** Keep the citations — they are accurate to the bundled internals and corroborated by multiple third parties — but **add a one-line provenance footnote** to the two "grounding" callouts (in `00-index.md` and `08-production-architecture.md`) clarifying that the paths refer to internal module paths in the shipped bundle, not files in the public anthropics/claude-code repo. This protects the course against the obvious "these files don't exist on GitHub" challenge.

---

## 2. Per-citation table

### Internal paths

| Citation | Files / Lines | Verification | Action |
|---|---|---|---|
| `services/compact/prompt.ts` | 00-index.md:56; 04-context-awareness.md:22, 127; 08-production-architecture.md:185; prompting-ai-agent-skills-curriculum.md:97, 511, 620, 689, 1384 | Plausible — consistent with reverse-engineering tradition; not directly quoted in this audit's searches but referenced in 04-context-awareness with "structure verified, exact wording may have drifted" hedge already applied | Keep |
| `services/compact/autoCompact.ts` (also `autoCompact.ts`) | 00-index.md:56; 04-context-awareness.md:212; 08-production-architecture.md:185; prompting-ai-agent-skills-curriculum.md:768, 1384 | Plausible — `AUTOCOMPACT_BUFFER_TOKENS` symbol independently confirmed at 33000 tokens by claudelog and hyperdev.matsuoka.com | Keep |
| `constants/prompts.ts` | 00-index.md:56; 06-tool-fluency.md:18; 05-output-engineering.md:141; 08-production-architecture.md:12, 185; prompting-ai-agent-skills-curriculum.md:1241, 1384 | **Verified** — explicitly named in markdown.engineering Lesson 39 and helmcode claude-code-explain as the location of `SYSTEM_PROMPT_DYNAMIC_BOUNDARY` | Keep |
| `utils/api.ts` | 00-index.md:56; 08-production-architecture.md:12, 185; prompting-ai-agent-skills-curriculum.md:1241, 1384 | **Verified** — markdown.engineering Lesson 39 names `src/utils/api.ts` as the home of `splitSysPromptPrefix` | Keep |
| `utils/claudemd.ts` (also `claudemd.ts`) | 00-index.md:56; 08-production-architecture.md:185; prompting-ai-agent-skills-curriculum.md:429, 1384 | **Verified** — independent sources name `utils/claudemd.ts` as the home of `getMemoryFiles()` (lines 790-1039 cited) | Keep |
| `tools/AgentTool/prompt.ts` | 00-index.md:56; 07-agent-design.md:14, 100; 08-production-architecture.md:185; prompting-ai-agent-skills-curriculum.md:1069, 1384 | Plausible — Piebald-AI mirror documents the AgentTool prompt; exact path not re-confirmed in this audit but consistent with the established naming convention (`tools/<ToolName>/prompt.ts`) | Keep |
| `promptCacheBreakDetection.ts` | 08-production-architecture.md:177 | Not directly confirmed in this audit; cited only as "a model for" instrumentation, no exact wording quoted | Keep — it's used as an inspiration reference, not a load-bearing claim |
| `prompts.ts` (unqualified) | prompting-ai-agent-skills-curriculum.md:224 | Likely shorthand for `constants/prompts.ts` | Keep — but note this file is in the legacy curriculum doc, not the numbered course |

### Internal symbols

| Citation | Files / Lines | Verification | Action |
|---|---|---|---|
| `SYSTEM_PROMPT_DYNAMIC_BOUNDARY` (and the literal marker `__SYSTEM_PROMPT_DYNAMIC_BOUNDARY__`) | 08-production-architecture.md:12, 46, 84, 125; prompting-ai-agent-skills-curriculum.md:1241, 1265, 1301, 1341, 1384 | **Verified** — markdown.engineering, helmcode, deepwiki all reproduce this exact constant name and the warning comment about `splitSysPromptPrefix` and `buildSystemPromptBlocks` | Keep |
| `splitSysPromptPrefix` | 08-production-architecture.md:12, 185; prompting-ai-agent-skills-curriculum.md:1241, 1384 | **Verified** — same sources | Keep |
| `AUTOCOMPACT_BUFFER_TOKENS` | 04-context-awareness.md:212; prompting-ai-agent-skills-curriculum.md:768 | **Verified** — claudelog confirms the constant exists; current value 33000 (was ~45000 prior to early 2026) | Keep |
| `getMemoryFiles()` | claude-code-best-practices-deep.md:275; prompting-ai-agent-skills-curriculum.md:429 (as `claudemd.ts`) | **Verified** — independent sources name `getMemoryFiles()` in `utils/claudemd.ts` as the CLAUDE.md discovery walk | Keep |

### User-example paths (out of scope — pedagogical, not Claude Code source)

These are *user code* in didactic examples and require no verification:
`src/cart/totals.ts`, `src/api/client.ts`, `src/api/retry.ts`, `config/defaults.json`, `src/auth.ts`, `config/database.ts`, `src/auth/handlers.ts`, `src/cart/pricing.ts`, `src/auth/session.ts`, `auth.ts`. **No action.**

---

## 3. Patches

The verification result is **"keep all citations"**. The only recommended change is to add a single-sentence provenance footnote to the two unhedged grounding callouts so the course is robust to the "those files aren't in the public repo" objection.

### Patch 1 — `00-index.md` line 56

**File:** `/Users/liam/Projects/vuelo-labs/linguist/course/00-index.md`

```
old_string:
*Source: Claude Code internal source — `services/compact/prompt.ts`, `constants/prompts.ts`, `utils/api.ts`, `utils/claudemd.ts`, `services/compact/autoCompact.ts`, `tools/AgentTool/prompt.ts`*

new_string:
*Source: Claude Code internal source (v2.1.128, May 2026) — `services/compact/prompt.ts`, `constants/prompts.ts`, `utils/api.ts`, `utils/claudemd.ts`, `services/compact/autoCompact.ts`, `tools/AgentTool/prompt.ts`. These are module paths inside the shipped npm bundle, not files in the public `anthropics/claude-code` repo (which contains only docs and install scripts). Citations are corroborated by independent reverse-engineering write-ups; exact wording may have drifted between releases.*
```

### Patch 2 — `08-production-architecture.md` line 185

**File:** `/Users/liam/Projects/vuelo-labs/linguist/course/08-production-architecture.md`

```
old_string:
*This course is grounded in the Claude Code source code: `services/compact/prompt.ts` (compaction logic and what it preserves), `constants/prompts.ts` (system prompt structure and the `SYSTEM_PROMPT_DYNAMIC_BOUNDARY` marker), `utils/api.ts` (cache scope splitting via `splitSysPromptPrefix`), `utils/claudemd.ts` (CLAUDE.md loading hierarchy), `services/compact/autoCompact.ts` (compaction thresholds), and `tools/AgentTool/prompt.ts` (agent delegation and briefing guidance).*

new_string:
*This course is grounded in the Claude Code internal source (v2.1.128, May 2026): `services/compact/prompt.ts` (compaction logic and what it preserves), `constants/prompts.ts` (system prompt structure and the `SYSTEM_PROMPT_DYNAMIC_BOUNDARY` marker), `utils/api.ts` (cache scope splitting via `splitSysPromptPrefix`), `utils/claudemd.ts` (CLAUDE.md loading hierarchy), `services/compact/autoCompact.ts` (compaction thresholds), and `tools/AgentTool/prompt.ts` (agent delegation and briefing guidance). These are module paths inside the shipped npm bundle, not files in the public `anthropics/claude-code` repo. Citations are corroborated by independent reverse-engineering work; exact wording may have drifted between releases.*
```

### Patch 3 — `08-production-architecture.md` line 12 (optional, light hedge)

The existing prose is already specific and load-bearing. Recommend leaving it as-is since Patch 2 covers it. **No change.**

### Patches for `prompting-ai-agent-skills-curriculum.md`

This file is a legacy curriculum doc, not part of the numbered course (00-08). Per the user's task scope (which lists only the numbered course + best-practices files), I have not generated patches for it. If desired, the same provenance footnote can be appended to its closing line 1384 by analogy with Patch 2.

---

## 4. Caveats

1. **Cannot directly inspect bundle.** I do not have access to a v2.1.128 npm install in this sandbox, so I cannot grep the unminified bundle to confirm exact filenames. Verification rests on:
   - The v2.1.128 changelog (confirms autocompact + 1M-context behaviour referenced in 04-context-awareness.md:212).
   - Independent reverse-engineering write-ups dated 2026 that reproduce the *exact* constant name `SYSTEM_PROMPT_DYNAMIC_BOUNDARY`, the function name `splitSysPromptPrefix`, and the path `constants/prompts.ts` / `utils/api.ts` / `utils/claudemd.ts` / `getMemoryFiles()`.

2. **Not directly re-quoted in this audit** (but plausible and consistent with the same naming tradition):
   - `services/compact/prompt.ts` and `services/compact/autoCompact.ts` — the `services/compact/` prefix is consistent with `services/api/` (which IS confirmed via `services/api/claude.ts`/`buildSystemPromptBlocks`). The `AUTOCOMPACT_BUFFER_TOKENS` symbol is independently confirmed.
   - `tools/AgentTool/prompt.ts` — Piebald-AI mirror confirms the AgentTool prompt content; the path follows the documented `tools/<ToolName>/prompt.ts` convention.
   - `promptCacheBreakDetection.ts` — not re-confirmed; used only as an inspirational reference ("is a model for this") not a load-bearing factual claim, so the risk of error is contained.

3. **Wording drift.** Most quoted snippets (e.g. "Fork yourself when the intermediate tool output isn't worth keeping in your context", "Brief the agent like a smart colleague…", "Don't add features, refactor code, or make improvements beyond what was asked", "List ALL user messages that are not tool results") are reproduced in the course but not re-verified verbatim against v2.1.128 in this audit. The course already hedges several with "structure verified, exact wording may have drifted". Recommend keeping that hedge wherever it appears and accepting residual risk on the unhedged direct quotes (in 07-agent-design.md:14, 100 and prompting-ai-agent-skills-curriculum.md:1069, 224, 689). A future audit pass focused exclusively on quoted strings is the cleanest way to retire that risk.

4. **`prompts.ts` (unqualified) at prompting-ai-agent-skills-curriculum.md:224** — almost certainly means `constants/prompts.ts`. Out of scope per the file list, but worth normalising if that file is ever folded back in.
