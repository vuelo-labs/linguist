# Audit Log — Linguist Course Site
**Session dates:** 2026-04-13 / 2026-04-14
**Auditor:** Claude (claude-sonnet-4-6), directed by Liam (Vuelo Labs)
**Scope:** Full structural audit of the Linguist course site — 27 modules, all supporting infrastructure, all shared assets.

---

## Session Summary

A full-day audit covering five areas: site structure and onboarding flow, accessibility (technical and content), heading hierarchy, B-01 content flow, and knowledge stacking across all 27 modules. The audit produced a complete concept dependency map (07-knowledge-map.md), fixed 20+ discrete bugs, and documented 9 open sequencing decisions requiring content or design judgment calls.

The course is now in a materially better state than before this session. The critical bugs were: a broken Netlify progress sync function (404ing silently), a CSS specificity bug showing all three profile recommendation blocks simultaneously, and a forward reference to "stopping condition" two modules before it's taught. All were fixed.

---

## Part 1: Site Structure

### 1a. Onboarding Flow

**Goal:** Establish whether a new user landing on the home page, /see, or /start reaches the right module for their profile without encountering dead-ends or confusing detours.

**Findings:**

The home page CTA ("Give it a go") correctly routes to /see. The header "Where to start" link is present. However, the course section on the home page had a direct link to /course/b/01 — bypassing /start entirely. This was a hole in the intended onboarding funnel.

/start offers profile selection but no tool selection step. That's an open design decision, not a bug — tool selection may be added later.

The course index had a hardcoded "Start here: Your First Message" CTA pointing to B-01 for all users regardless of chosen profile. This defeats the purpose of profile selection. Fixed by hiding the generic CTA when a profile is active and showing the profile-specific recommendation instead.

A CSS specificity bug caused all three `.profile-rec` blocks to display simultaneously. The rule `html[class*="profile-"] .profile-rec { display: block; }` had higher specificity than the per-profile targeting rules, so setting a profile turned on all three cards at once. Fixed by adjusting the specificity order so per-profile rules correctly override the base show rule.

The Beginner stage on the course index was collapsed by default — a user landing on /course after choosing the Beginner profile would see a collapsed list and have to click to expand. Fixed: Beginner stage now open by default.

/start profile selection correctly redirects to /course after choosing. The /see experience page correctly directs to /start after completion. Both confirmed working.

No dead-ends confirmed — every page has header nav, breadcrumbs, and pagination.

**Note (not fixed):** After profile selection at /start, the user lands on /course and must click once more to reach their recommended module. This is a minor friction point, not a blocker.

### 1b. Link Integrity

**Goal:** Confirm all modules exist on disk and all navigation links point to valid destinations.

**Findings:**

All 27 module directories confirmed present: B-01 through B-10, E-01 through E-07, A-00 through A-09. An automated check produced false positives for course.css, assets/sine-wave.svg, and cards/content.js — these files exist; the check had a file access issue.

All navigation links across all headers point to valid destinations. Four distinct header nav patterns were identified across the site — this is a design variation, not a bug.

### 1c. Supabase Integration

**Goal:** Confirm progress sync, subscribe functions, and auth flows work as designed.

**Findings:**

CRITICAL BUG FIXED: No `progress.js` existed in `netlify/functions/`. The course progress sync was 404ing silently on Netlify. Created `netlify/functions/progress.js` as a Netlify-format equivalent of the existing Cloudflare function.

BUG FIXED: In `/see/index.html`, the Supabase CDN script was loaded after the inline script that calls it. This created a race condition on PDF signup. Fixed by reordering script tags.

NOTED (not fixed): The Supabase anon key is hardcoded in `index.html` (lines 337–338) and `see/index.html` (lines 1215–1216). Anon keys are designed to be public and this is acceptable, but it's fragile if the key ever rotates — both files would need manual updates.

CONFIRMED WORKING: Subscribe functions (both Netlify and Cloudflare) are clean. The Cloudflare `course_progress` function is clean. No auth gates exist — anonymous access is by design.

DESIGN NOTE: Progress is localStorage-primary, Supabase-backup. Users who never enter their email have zero server-side record. This is intentional.

DESIGN NOTE: `/clear` silently swallows all Supabase errors by design — localStorage is the source of truth, Supabase is for backup/continuity.

### 1d. Narrative Flow and UX

**Goal:** Confirm pagination, breadcrumbs, and progress tracking are correct end-to-end.

**Findings:**

Bottom pagination confirmed correct across all 27 modules including cross-stage transitions: B-10 → E-01, E-07 → A-00, A-09 is a correct terminus.

BUG FIXED: `progress.js` had `STAGE_ENDS` containing `'a-08'` as the course-complete trigger. A-09 exists — the course has 27 modules, not 26. Fixed the stage end key to `'a-09'` and updated the "twenty-six" count string to "twenty-seven".

BUG FIXED: The course index Advanced Practitioner stage intro said "Nine modules" — it is ten. Fixed to "Ten modules".

---

## Part 2: Accessibility

### 2a. Technical Accessibility

**T1 — FIXED: Skip-nav links missing from HTML.**
The `.skip-link` CSS class existed but no HTML element used it. Skip-nav links added to all pages.

**T2 — NOTED: `/see` role="main" on a hidden element.**
The `/see` page uses `role="main"` on a section that gets hidden during quiz flow. Partially addressed in other `/see` work during this session. Not fully resolved.

**T3 — FIXED: `/see` quiz feedback had no aria-live region; `goTo()` had no focus management.**
Screen readers would not announce quiz feedback. An `aria-live="polite"` region added. Focus management added to `goTo()` to shift focus to the new step on transition.

**T4 — FIXED: `/see` email input had no label.**
Visually-hidden label added to the email input field.

**T5 — FIXED: `/start` profile cards had invalid ARIA nesting.**
Profile cards had `role="button"` on an outer `div` that wrapped a real `<button>` element. This is invalid — nested interactive roles. Outer `role`, `tabindex`, and `onkeydown` attributes removed. The inner button handles interaction.

**T7 — FIXED: Completion checkmark had no text alternative.**
The completion checkmark was a CSS `::after` pseudo-element — invisible to screen readers. `progress.js` now injects a visually-hidden "Completed" span alongside the checkmark.

**T8 — NOTED: "Already done this" button provides no aria-live feedback before redirect.**
The button redirects without announcing what's about to happen. Not fixed this session.

**T9 — NOTED: `/see` step icons have no `aria-current="step"`.**
Screen reader users cannot identify which step they are on. Not fixed this session.

**T10 — NOTED: Without/With comparison blocks differentiated by colour only.**
No text label distinguishes the "before" and "after" states. Fails WCAG 1.4.1 (use of colour). Not fixed this session.

**T12 — FIXED: `--w-faint` colour failed AA contrast.**
`#6C6460` gave approximately 4.0:1 contrast against white — below the 4.5:1 AA threshold for body text. Darkened to `#5E5450`.

**T13 — FIXED: `--c-faint` colour failed AA contrast.**
`#9EB0C0` gave approximately 2.6:1 contrast. Darkened to `#5A7485`.

**T14 — FIXED: `/see` local `--w-faint` colour failed AA contrast.**
The `/see`-scoped value `#B0A89E` gave 2.4:1 contrast. Darkened to `#7A7268`.

**T15 — FIXED: Nav landmarks had no aria-label.**
Without labels, screen readers announce two unlabelled "navigation" landmarks. Added `aria-label="Site navigation"` and `aria-label="Module navigation"`.

### 2b. Content Accessibility

**C1 — OPEN: /start never tells users they can change their profile.**
Low-confidence users may worry they are permanently locked into their chosen track. One reassuring sentence needed: something like "You can always come back and change this."

**C2 — OPEN: "New role" profile card says "You have used ChatGPT at least once."**
This excludes users who have only used Claude or Gemini. Should name all three platforms or say "used an AI tool at least once."

**C3 — OPEN: B-01 exercise says "your platform" without pointing to the new platform picker.**
The platform picker was added directly above the exercise but the exercise copy still reads as though the reader already knows what their platform is. A brief parenthetical pointing up would close this.

**CONFIRMED GOOD:** Focus styles using `:focus-visible`, `prefers-reduced-motion` support, `lang="en"` on all pages, form labels on stage-end prompts, `rel="noopener"` on all external links, `.visually-hidden` utility class present and used.

**CONFIRMED GOOD — module writing quality:** Plain language, short sentences, appropriate reassurance without condescension. The "If it asks you to upgrade" and "If your response looks different" sections in B-01 directly address beginner anxiety at exactly the right moment. This is high-quality accessible writing for the target audience.

---

## Part 3: Heading Hierarchy

**Goal:** Confirm no skipped heading levels across all 27 modules and all supporting pages.

**Scope checked:** All 27 modules (B-01–B-10, E-01–E-07, A-00–A-09), plus /start, /see, /course index, and exercises/index.html.

**Findings:**

All 27 modules: no skipped levels, no violations. E-track was the most consistent overall.

ONE FIX: A-00 had the Copy-Personalise-Use section headings as `h3` nested inside a "Your First Session" `h2`. In every other module, CPu headings are top-level `h2`s. A-00 was the only exception. Fixed to `h2`.

NOTED (not fixed): `exercises/index.html` is a multi-screen SPA with 4 `h1` elements. Technically a violation of the one-h1 rule. Not fixed — would require restructuring the SPA pattern.

NOTED (not fixed): The `/see` "That's it." heading functions as a visual label for a completed state rather than a true section heading. Not fixed.

---

## Part 4: B-01 Content Flow — Platform Picker

**Problem:**

B-01 told users to "paste into the text area on your platform" before explaining what a platform is, how to open one, or which one to use. The "Where to type" section that answered these questions was 60+ lines below the exercise that assumed the knowledge. This is an inverted information architecture that would cause confusion and drop-off for the exact audience the course is built for.

**Fix:**

Replaced the bottom-of-page "Where to type" section with a compact platform picker using `<details>`/`<summary>` elements. The picker is placed directly before the first exercise. Platforms listed: Claude (claude.ai), ChatGPT (chatgpt.com), Gemini (gemini.google.com), Claude Code (terminal).

CSS for the picker added to `course.css`. The old "Where to type" section removed from B-01.

**Scope check:** B-02 through B-10 were reviewed for the same ordering problem. No other modules had "Where to type" content below the exercise that needed it. B-01 was the only case.

---

## Part 5: Knowledge Stacking

**Goal:** Build a complete dependency map across all 27 modules and identify forward references — places where a template, instruction, or concept assumes knowledge that hasn't been taught yet.

**Output:** Full dependency map at `content_design_workings/07-knowledge-map.md`.

### 5a. Seven Load-Bearing Concepts

These are the concepts that, if missed, break everything downstream:

1. **Stopping condition (B-06)** — every module from B-06 onward depends on it. Named in templates before it is taught.
2. **Copy-Personalise-Use / CPu (B-02)** — the interaction framework for every exercise in the course.
3. **Opening Seed (B-10)** — entry point for all E-track and A-track work.
4. **New conversation as reset (B-01)** — underpins recovery, re-seeding, and session hygiene across the course.
5. **Verb choice / safe verbs (B-02 partial, E-01 formal)** — the first word of every template.
6. **Load-bearing context / load-bearing test (B-10 seed, E-03 formal)** — relied on by E-04 through E-07 and all of A-track.
7. **Compaction (A-02 introduced, A-05 detailed)** — provides the rationale for A-03 through A-06. Without it, those modules feel like arbitrary rules.

### 5b. Violations Found and Fixed

**V1 — FIXED: B-05 template used `[Stopping condition]` bracket two modules before B-06 teaches it.**

Template 2 in B-05 contained the bracket `[Stopping condition]`. A learner doing B-05 has no idea what this means. The bracket was renamed to a plain-language description: `[how much you want back — e.g. "Keep it under 100 words" or "Give me 3 options"]`. B-04 was checked and was already clean.

**V2 — FIXED: A-01 instructed `/clear` with no explanation, taught in A-04.**

A-01 told learners to use `/clear` without context. `/clear` is not explained until A-04. A deferral note added: "(A-04 covers this in full.)"

**V3 — FIXED: A-06 attributed a habit to E-05 that actually comes from B-07.**

A-06 read: "In E-05 you learned the habit of reading Claude Code's full response before acting on it." That habit is established in B-07, not E-05. Attribution corrected to B-07.

**V4 — FIXED: A-07 tool hierarchy omitted WebSearch despite A-02 naming it.**

A-02's CPu example used `WebSearch` as a tool name. A-07 is the module that formally introduces the tool hierarchy and cost tiers. `WebSearch` was absent from A-07's hierarchy. Added WebSearch to A-07 in the same cost tier as Bash, and updated the cost order to: `Read/Glob/Grep → Bash/WebSearch → Agent`.

### 5c. Open Sequencing Decisions

Nine sequencing questions were identified but left open because they require content or design judgment, not just fixes:

1. **B-03 placement** — B-03 (context) breaks momentum between B-02 (first template) and B-04 (extending templates). Options: move B-03 to after B-09, or mark it as optional reference material.

2. **B-09 before/after B-08** — B-09 (preventing drift) currently follows B-08 (recovery from drift). The question is whether prevention works better as a concept if learners have first experienced recovery. Current order may be correct; needs content consideration.

3. **Verb gap B-05→E-01** — There are 8 modules (B-03 through B-10, approximately) where verb choice is relied upon but not reinforced. A brief reminder in B-07 or B-08 might reduce silent confusion.

4. **E-04 vs B-08 distinction** — Both modules cover restate/recovery patterns. The distinction between them is not sharp enough. Could cause learners to feel they are repeating material.

5. **B→E readiness bridge** — No check or prompt confirms that B-08 and B-09 were completed before E-01 begins. The E-track assumes recovery and prevention instincts from those modules.

6. **A-01 vs A-02 order** — A-01 covers cost benchmarks before A-02 establishes the mental model that makes those costs legible. Swapping them would make A-01 more meaningful.

7. **A-04 vs A-05 order** — Session hygiene (A-04) is taught before compaction is fully explained (A-05). Learners follow hygiene rules without understanding why context bloat is the problem being solved.

8. **E-07 as A-track entry point** — E-07 sets up the handoff to A-track, but A-00 never references E-07. Learners who jumped straight to A-00 lack the scaffolding E-07 provides.

9. **A-01 delegation cost benchmarks** — The "$5–20 for agent delegation" benchmark appears 7 modules before A-08, which establishes the guardrails that make that figure meaningful.

### 5d. Late-Track Prerequisite Flags

Three dependencies represent the highest risk for learners who dropped off early:

- **B-09 → A-03** — A-03 assumes the drift prevention instincts from B-09.
- **B-10 → A-00** — A-00 assumes familiarity with the Opening Seed from B-10.
- **E-06 → A-04** — A-04 assumes the session hygiene habits established in E-06.

---

## Part 6: Change Log

### Files Modified

**`course/a/00/index.html`**
Copy-Personalise-Use section headings changed from `h3` to `h2`. Reason: every other module uses CPu as top-level h2; A-00 was the only exception.

**`course/a/01/index.html`**
Deferral note added after `/clear` instruction: "(A-04 covers this in full.)". Reason: V2 forward reference fix — `/clear` is not explained until A-04.

**`course/a/06/index.html`**
"In E-05 you learned..." corrected to "In B-07 you learned...". Reason: V3 wrong attribution fix.

**`course/a/07/index.html`**
WebSearch added to tool hierarchy at same tier as Bash. Cost order updated to `Read/Glob/Grep → Bash/WebSearch → Agent`. Reason: V4 — A-02 names WebSearch but A-07 omitted it from the hierarchy.

**`course/b/01/index.html`**
Platform picker (`<details>`/`<summary>`) added directly before the first exercise. Old "Where to type" section removed from bottom of page. Reason: inverted IA — exercise assumed platform knowledge that was only explained 60+ lines later.

**`course/b/05/index.html`**
Template 2 bracket `[Stopping condition]` renamed to `[how much you want back — e.g. "Keep it under 100 words" or "Give me 3 options"]`. Reason: V1 forward reference fix — stopping condition not taught until B-06.

**`course/course.css`**
Five changes:
1. `.profile-rec` specificity fix — per-profile rules now correctly override the base show rule.
2. `.hero-default-cta` rule added — generic CTA hidden when a profile class is active on the html element.
3. Beginner stage set to open by default.
4. Platform picker styles added (details/summary, platform links, icons).
5. Accessibility contrast: `--w-faint` darkened, `--c-faint` darkened.

**`course/index.html`**
Two changes:
1. Advanced Practitioner stage intro corrected from "Nine modules" to "Ten modules".
2. Beginner `<details>` element given `open` attribute so it is expanded by default.

**`see/index.html`**
Five changes:
1. Supabase CDN script moved before inline script that calls it (race condition fix).
2. `aria-live="polite"` region added for quiz feedback.
3. Focus management added to `goTo()` function.
4. Visually-hidden label added to email input.
5. Local `--w-faint` darkened from `#B0A89E` to `#7A7268` (contrast fix).

**`style.css`**
Two changes:
1. `--w-faint` darkened from `#6C6460` to `#5E5450`.
2. `--c-faint` darkened from `#9EB0C0` to `#5A7485`.

**`start/index.html`**
`role="button"`, `tabindex`, and `onkeydown` removed from outer profile card `div` elements. The inner `<button>` handles all interaction. Reason: invalid nested interactive ARIA roles.

**`progress.js`**
Three changes:
1. `STAGE_ENDS` corrected: `'a-08'` → `'a-09'` (course complete trigger on the correct final module).
2. Count string updated: "twenty-six" → "twenty-seven".
3. Visually-hidden "Completed" span injected alongside completion checkmark for screen reader support.

### Files Created

**`netlify/functions/progress.js`**
New file. Netlify-format course progress sync function. Created because no Netlify equivalent existed — the Cloudflare version was deployed but Netlify was 404ing silently on all progress sync calls.

**`content_design_workings/07-knowledge-map.md`**
New file. Complete concept dependency map across all 27 modules. Documents which concepts each module introduces, which it relies on, and the full dependency chain for each of the 7 load-bearing concepts.

**`content_design_workings/08-audit-log.md`**
This file.

---

## Part 7: Open Decisions

These items were identified but not fixed. They require content or design judgment and cannot be resolved by a technical fix alone.

### Content decisions needed

**C1 — /start profile reassurance**
Add one sentence telling users they can change their profile. Example: "Not sure? Pick the closest one — you can always come back and change it." Without this, low-confidence users may feel locked in.

**C2 — "New role" profile card excludes non-ChatGPT beginners**
"You have used ChatGPT at least once" excludes users whose first AI tool was Claude or Gemini. Suggested fix: "You have used an AI tool at least once" or name all three platforms.

**C3 — B-01 exercise copy doesn't reference the platform picker**
The exercise says "your platform" but doesn't point to the picker directly above. A brief parenthetical like "(pick yours above if you haven't yet)" would close this.

**T8 — "Already done this" button has no announcement before redirect**
Screen reader users get no warning before the page changes. An `aria-live` announcement or confirmation step would address this.

**T9 — /see step icons have no `aria-current="step"`**
Screen reader users cannot identify their current step in the /see quiz flow.

**T10 — Without/With comparison blocks are colour-only**
The before/after comparison blocks in module exercises are differentiated only by colour. Text labels ("Before" / "After") are needed to meet WCAG 1.4.1.

### Sequencing decisions needed

See Part 5c for the full list of 9 open sequencing decisions. In priority order:

- **Highest:** B-03 placement (disrupts early momentum)
- **High:** E-04 vs B-08 distinction (currently blurred)
- **High:** A-01 vs A-02 order (costs before mental model)
- **Medium:** Verb gap B-05→E-01
- **Medium:** B→E readiness bridge
- **Medium:** A-04 vs A-05 order
- **Lower:** B-09 before/after B-08
- **Lower:** E-07 as A-track entry point
- **Lower:** A-01 delegation benchmarks 7 modules before guardrails

---

## Part 8: Confirmed Good

The following were audited and confirmed working correctly. No changes made.

**Onboarding:**
- Home page CTA → /see: correct.
- Header "Where to start" → /start: correct.
- /see completion → /start redirect: correct.
- /start profile selection → /course redirect: correct.
- No dead-ends anywhere — all pages have header nav, breadcrumbs, and pagination.

**Navigation:**
- All 27 module directories present on disk.
- All cross-stage pagination correct (B-10→E-01, E-07→A-00, A-09 terminus).
- Breadcrumbs present on every module page.
- Top nav present on every module page.

**Supabase/backend:**
- Subscribe function (Netlify): clean.
- Subscribe function (Cloudflare): clean.
- course_progress function (Cloudflare): clean.
- Anonymous access by design: correct.
- localStorage-primary progress design: correct.

**Accessibility foundations:**
- `:focus-visible` focus styles: present on all interactive elements.
- `prefers-reduced-motion` support: present.
- `lang="en"`: set on all pages.
- Form labels on stage-end prompts: present.
- `rel="noopener"` on all external links: present.
- `.visually-hidden` utility class: present and used correctly.

**Content quality:**
- All 27 modules: no skipped heading levels.
- Module writing quality: plain language, short sentences, appropriate reassurance. Specific beginner-anxiety sections ("If it asks you to upgrade", "If your response looks different") are well-placed and well-written.
- B-04 template: clean (no forward references found).
- E-track heading consistency: most consistent track overall.
- Bottom pagination: correct across all 27 modules.
