# Linguist Course Review Findings

Agent reviews conducted 2026-04-02. Two rounds of review, 2 Opus agents per round.

---

## Round 1 — Initial Review

### Agent 1: Visitor Journey (formatting, clarity, wordiness)

#### Critical Bugs
- **Broken HTML in both live exercises** — `data-machine"` (stray double-quote) throughout:
  - `exercise-1.html`: lines 629, 781, 814
  - `exercise-2.html`: lines 555, 592, 643, 697, 710, 718, 727
  - Machine-mode text leaks into human mode, showing duplicate/overlapping instructions. A nervous learner will think they broke something.

#### Navigation Gaps
- Landing page never links to `/course` — CTAs only go to `/see`, `/guide`, `/manifesto`
- `/see` Done screen has no path to `/course` — links go to Booklet, Guide, Handbook only
- Done screen has 8 CTAs (X, LinkedIn, copy link, coffee, email signup + 3 resource links) — overwhelming

#### Wordiness
- Exercise 1 & 2 subtext paragraphs are 40–50 words where 15–20 would land
- "Note to the reader" blocks sit inside copy-paste prompt boxes — learners can't tell what to paste vs. what to read
- Guide page is ~2,500 words as a single scroll, with heavy redundancy (same lessons appear 3 different ways)

#### Other Flow Issues
- Course hub claims "7 exercises" but only 2 are live, no ETAs — beginners may read as "course isn't ready"
- "Open full walkthrough" button links to Exercise 1, not an actual full walkthrough — misleading
- Glossary includes "MCP (Model Context Protocol)" and "Temperature" — too technical for this entry point
- Mobile under 480px: both header links and CTA hidden, only the logo remains — no navigation

---

### Agent 2: Prompt Starters (beginner suitability + learning arc)

#### Top 5 Prompt Starters to Rework

1. **Exercise 2 — Machine Mode opening seed** (all platforms)
   `Role: [your role] . [your domain] / Task: [verb] [object] / Context: [fact 1 the model needs — load-bearing only] / Done when: [...]`
   "Load-bearing", "Task: [verb] [object]", "Done when" — all undefined. Most jargon-dense prompt in the course, no worked example next to it.

2. **Exercise 1 — Machine Mode project setup** (all platforms, ~line 876)
   Asks learners to specify "what to skip (preamble, unsolicited suggestions, trailing summaries)" — undefined AI-output terminology, never taught.

3. **See page Quiz Q5 — the trick question**
   Casual-sounding prompt labelled machine mode. Getting it "wrong" then being told casual tone is irrelevant could feel invalidating. Binary right/wrong format is the wrong vehicle for this nuanced insight.

4. **Exercise 2 — Human Mode seed** (~line 762)
   "What would make this conversation useful" — metacognitive question that assumes experience the learner doesn't have yet.

5. **Card 36 — "Context document" practical tip**
   Presupposes a regular AI workflow. Works mid-course but intimidating as a standalone social card before any onboarding.

#### Learning Arc Assessment
- **See page is the strongest part** — no jargon, immediately recognisable, well calibrated
- **Biggest gap:** jump from "I can spot the difference" (See) directly to "set up your entire working environment" (Exercise 1) with no intermediate step of just sending one message to an AI
- Exercise 1 is doing too much at once: understand persistent instructions + platform implementation + create Human Mode project + create Machine Mode project + paste 2 prompts + evaluate against multiple criteria
- Exercise 2 assumes Exercise 1 worked perfectly (unlikely on first attempt)
- Bracket-fill pattern `[your role]` used everywhere but never explicitly taught
- Cards 31–40 (practical tips) assume someone already using AI regularly — wrong for pre-course audience

---

## Round 2 — New Content Review

### Agent 1: New Pages (formatting, clarity, navigation)

#### Bug Fix Status — Nothing Was Fixed
All three Round 1 issues remain open as of Round 2 review.

#### `/course` Is an Island
No page on the site links to `/course`. Also undiscoverable: `/prompt-starter.html` links out via absolute URLs that break on staging.

#### New Page Issues

**Handbook (`/handbook/index.html`)**
- Part 5 rehashes all 8 principles with 3 paragraphs each (~2,400 words), heavily overlapping `/pdf`
- Intro says "This is the third layer" — no explanation of layers 1 and 2 for cold arrivals
- "load-bearing," "context window," "dispatch" used without definitions (no glossary link)

**Manifesto (`/manifesto/index.html`)**
- CTA section says "Eight minutes" but button says "(2–3 min)" — contradiction

**Prompt-starter (`/prompt-starter.html`)**
- Dispatch note paragraph uses "agents," "agentic dispatch," "scope locking," "models executing" — no explanation
- Step 5 references "token efficiency," "re-seeding," "migration" — none defined
- Completely different design system (system fonts, black/white, dark mode) — no Linguist branding, looks like a different product
- Footer uses absolute URLs — breaks on staging/dev environments

**PDF (`/pdf/index.html`)**
- "Define done before you start" and "One task at a time" appear as both principles and tips — repetitive at bottom of page

#### Updated Navigation Map
```
Landing (/) --> /see, /guide, /manifesto, /download, /pdf, /handbook
/see (Done) --> /, /pdf, /guide, /handbook
/course     --> exercise-1 --> exercise-2   [NO inbound links from any page]
/prompt-starter --> /guide, /handbook, /pdf, /see [via broken absolute URLs, no inbound links]
```

---

### Agent 2: Course Markdown Modules (beginner suitability)

#### Core Finding: Wrong Audience
The 8 course modules (00–08) are written for software engineers and technical power users, not for people with low general tech confidence.

- Module 00 opens with "compaction logic, caching architecture, agent delegation primitives"
- All 54 worked examples assume developers/data engineers (React, TypeScript, Express, BigQuery, dbt, SQL)
- Not one example involves a task a non-technical person would recognise

**Modules appropriate for beginners (with full rewrite):** 01, 02, 05
**Modules inappropriate for the stated audience:**
- Module 03 (Session Hygiene) — CLAUDE.md, compaction buffers, CLI commands
- Module 04 (Context Awareness) — compaction internals, writing for summarisation algorithms
- Module 06 (Tool Fluency) — Claude Code tool chain, entirely developer-only
- Module 07 (Agent Design) — multi-agent orchestration, subagent briefing
- Module 08 (Production Architecture) — fleet-scale token economics, system prompt caching

**Decision (2026-04-02):** Modules 00–08 designated as the **advanced course track**.

#### No Copy-Personalise-Use Pattern
The project spec requires every exercise to walk learners through editing prompts. None of the 8 modules include a "How to edit this" section.

#### `prompt-starter.html` Assessment
Much closer match to the beginner audience — plain language, AI-guided, co-creation model. The AI is instructed to "build a seed with me — not for me." This is the right approach for the beginner track.

---

## Round 3 — New Beginner Files vs Existing Content

Single Sonnet agent, 2026-04-02.

### What the 3 files are

- **`claude-code-best-practices.md`** — 12-point condensed reference for Claude Code users. Contains a clean verb taxonomy table (fix / refactor / add / explain) and "blast radius" framing.
- **`claude-code-best-practices-deep.md`** — Expanded version. Adds the full compaction-preservation list, context rot signals, and a blast-radius table that labels "clean up" as actively dangerous/ambiguous.
- **`prompting-ai-agent-skills-curriculum.md`** — The 18-skill, 8-layer curriculum (same as advanced modules). Full roadmap document, deeply technical by the upper layers.

**All three are practitioner documents written for someone already using Claude Code as a coding assistant.** Not beginner materials as-is, but contain the right raw material for content the course is missing.

### Gaps they fill

- **Verb taxonomy** — Priority 1/2 in COURSE_STATUS ("draft exists, not built as page"). All three files have worked verb taxonomies. The deep file is the best source: 7 verbs with explicit "ambiguous" and "dangerous" labels for "clean up" and "improve."
- **Blast radius** — named and defined consistently across files. Memorable label for the consequence of vague verb choice, needed for Exercise 3.
- **Constraints as front-loading** — not currently in the course. Feeds into Exercise 2 anatomy and Exercise 3 scope control theme.
- **Verbosity mirroring** — not covered anywhere: the model mirrors your verbosity. Simple, immediately useful once stripped of Claude Code framing.

### Key contradictions to watch

- **"Context is fuel" vs "context is finite"** — manifesto says give machines more input; curriculum Layer 4 frames context as scarce and degrading. Both true at different levels but contradictory side-by-side for beginners. Course's existing framing (context = fuel) is right for beginners; scarcity framing belongs in the advanced track.
- **Claude Code-specific mechanics** — CLAUDE.md, `/clear`, compaction, subagents have no equivalent on ChatGPT or Gemini. Cannot enter the beginner course without platform-agnostic alternatives or explicit scoping.

### Recommendations

| File | Use |
|------|-----|
| `claude-code-best-practices.md` | Strip coding examples, extract verb table + blast radius + verbosity mirroring → feed into Exercise 3 and verb reference page |
| `claude-code-best-practices-deep.md` | Best single source for Exercise 3. Blast-radius table and constraint front-loading are gold. Advanced sections → advanced track |
| `prompting-ai-agent-skills-curriculum.md` | Planning artefact / future advanced track roadmap. Layers 1–3 useful in spirit; Layers 4–8 advanced-only |

**Immediate action flagged:** extract verb taxonomy from the deep file and build it as `/course/reference/verbs` before Exercise 3. All three files agree on the core verb set.

---

## Priority Fix List (combined, current)

| # | Fix | Status |
|---|-----|--------|
| 1 | Fix `data-machine"` HTML bug — 10 instances across both live exercises | Open |
| 2 | Link `/course` from homepage and `/see` Done screen | Open |
| 3 | Fix `prompt-starter.html` — add site header/branding, simplify dispatch note + Step 5 jargon, switch to relative URLs | Open |
| 4 | Resolve manifesto time contradiction — "Eight minutes" vs "(2–3 min)" | Open |
| 5 | Trim Exercise 1 & 2 subtext; separate "Note to reader" from copy-paste areas | Open |
| 6 | Add worked example next to Exercise 2 Machine Mode template | Open |
| 7 | Reduce Done screen from 8 CTAs to 1 primary next step | Open |
