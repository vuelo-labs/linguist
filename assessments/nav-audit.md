# Navigation Audit

Audited: 2026-04-08
Scope: Full user journey from homepage to final lesson (A-08), plus supporting pages.

---

## / (Homepage)

**Inbound links:** Entry point. Also linked from every page via site-logo "Linguist" (href="/").
**Outbound links:**
- Header: /guide, /manifesto, /course, /start, /see
- Hero CTA: /see ("Give it a go")
- Hero secondary: /course, /guide, /manifesto
- Course section: /course/b/01 ("Start: Your First Message"), /course
- Read & download section: /download, /pdf, /handbook
- Footer: Ko-fi, Medium

**progress.js loaded:** No
**profile.js loaded:** No

**Issues:**
- No link to /start from the main hero or CTA area. The header has "Where to start" but it is hidden on mobile (480px breakpoint hides `.site-header-link`). On mobile, users see only the logo and "Give it a go" CTA — no path to /start or /course.
- Links to /download, /pdf, /handbook — these pages are not part of the audited set and may or may not exist. Potential dead ends.

---

## /see (Experience page)

**Inbound links:** Homepage header CTA, homepage hero CTA, guide page, manifesto page.
**Outbound links:**
- Nav: / (logo), /manifesto, /guide
- Done screen: /start ("Tell us where you're starting"), /guide

**progress.js loaded:** No
**profile.js loaded:** No

**Issues:**
- No link to /course from this page. A user who finishes the experience and does not want to pick a profile has no way to reach the course directly.
- No link to /start from the nav bar — only appears at the very end after completing the full experience. If a user wants to skip the experience and go to profile selection, they must use the back button or edit the URL.
- Header nav uses different classes than the rest of the site (.nav-logo, .nav-link vs .site-header, .site-logo). This is a styling concern, not a navigation gap, but it means the header here is missing "Course" and "Where to start" links that the homepage has.

---

## /start (Profile selector)

**Inbound links:** Homepage header ("Where to start"), /see done screen, /course profile-rec "Change profile" links.
**Outbound links:**
- Header: / (logo), /course, /guide
- Profile card buttons: onClick sets profile cookie and redirects to /course (via profile.js `window.location.href = redirectTo || '/course'`)
- Skip text: /course ("Go to the course")

**progress.js loaded:** No
**profile.js loaded:** Yes

**Issues:**
- No link to /see. A user who lands on /start without having done the experience has no way to discover it.
- No link to /manifesto. The homepage header has it, but /start's header does not.
- Header is missing "Manifesto" and "Where to start" (self-link, minor) compared to homepage header. Inconsistent header across pages.

---

## /course (Course index)

**Inbound links:** Homepage header, homepage hero secondary, homepage course section, /start profile buttons (redirect), /start skip link, module breadcrumbs, B-01/E-01/A-00 nav-bar links.
**Outbound links:**
- Header: / (logo), /guide, /manifesto (but NOT /start — only present inside profile-rec blocks which are conditionally shown)
- Hero CTA: /course/b/01
- Profile-rec blocks (conditional on cookie): /course/b/01, /course/b/04, /course/a/00, /start ("Change profile")
- Module cards: all 26 modules listed with links
- Footer: Ko-fi, Medium

**progress.js loaded:** Yes
**profile.js loaded:** Yes

**Issues:**
- Header is missing a link to /start ("Where to start"). If a user has no profile set, there are no profile-rec blocks visible, and no way to reach /start except going back to the homepage.
- Header is missing a link to /see. A user browsing the course index cannot discover the experience page.
- No "Home" link visible on mobile — the `.site-header-link` items for Home, Guide, Manifesto are likely hidden at 480px based on the pattern from the homepage CSS (though course page uses course.css which may handle this differently).

---

## /course/b/01 (B-01: Your First Message)

**Inbound links:** Homepage course section CTA, /course index hero CTA, /course B-01 module card, /course profile-rec (newrole).
**Outbound links:**
- Header: / (logo), /course, /guide
- Breadcrumb nav-bar: /course
- Pagination: /course/b/02 (Next)
- Body: link to A-00 in "Claude Code" section

**progress.js loaded:** Yes
**profile.js loaded:** Yes

**Issues:**
- No "Previous" pagination link (expected — this is the first module).
- No link to /start from this page. A user who landed here from the homepage CTA without choosing a profile has no way to reach /start.
- Header is missing /manifesto link (present on homepage and /course, but not here).

---

## /course/b/10 (B-10: The Opening Seed — last Beginner module)

**Inbound links:** /course B-10 module card, B-09 pagination "Next".
**Outbound links:**
- Header: / (logo), /course, /guide
- Breadcrumb nav-bar: /course
- Pagination: /course/b/09 (Previous), /course/e/01 (Next)
- Stage-complete prompt: email save form

**progress.js loaded:** Yes
**profile.js loaded:** Yes

**Issues:**
- No link to /start from this page.
- No link back to /course from the stage-complete prompt. After saving email or dismissing, the user sees no explicit CTA to continue — they must click the pagination "Next" link or the header "Course" link.
- Header missing /manifesto.

---

## /course/e/01 (E-01: The First Word Matters — first Enabled User module)

**Inbound links:** /course E-01 module card, B-10 pagination "Next".
**Outbound links:**
- Header: / (logo), /course, /guide
- Breadcrumb nav-bar: /course
- Pagination: /course/b/10 (Previous), /course/e/02 (Next)
- Body: /course/reference/verbs

**progress.js loaded:** No
**profile.js loaded:** No

**Issues:**
- progress.js is NOT loaded. Every other stage-boundary module (B-10, E-07, A-08) loads it. E-01 does not. Progress will not be tracked for this module.
- profile.js is NOT loaded. Profile-conditional content will not display correctly (though E-01 does not appear to use data-profile blocks, so this is a minor inconsistency rather than a visible bug).
- No link to /start.
- Header missing /manifesto.
- Links to /course/reference/verbs — this page may or may not exist. Potential dead end.

---

## /course/e/07 (E-07: Your Reference Card — last Enabled User module)

**Inbound links:** /course E-07 module card, E-06 pagination "Next".
**Outbound links:**
- Header: / (logo), /course, /guide
- Breadcrumb nav-bar: /course
- Pagination: /course/e/06 (Previous), /course/a/00 (Next)
- Stage-complete prompt: email save form

**progress.js loaded:** Yes
**profile.js loaded:** Yes

**Issues:**
- No link to /start.
- No link back to /course from the stage-complete prompt (same issue as B-10).
- Header missing /manifesto.
- The closing text mentions "The Advanced track" but the only way to reach it is the pagination Next link — no explicit CTA link to /course/a/00 in the body text.

---

## /course/a/00 (A-00: Getting Started with Claude Code — first Advanced module)

**Inbound links:** /course A-00 module card, E-07 pagination "Next", /course profile-rec (maker).
**Outbound links:**
- Header: / (logo), /course, /guide
- Breadcrumb nav-bar: /course
- Pagination: /course/e/07 (Previous), /course/a/01 (Next)

**progress.js loaded:** No
**profile.js loaded:** No

**Issues:**
- progress.js is NOT loaded. This is a stage-entry module. Progress will not be tracked.
- profile.js is NOT loaded. No profile-conditional content appears on this page, so no visible impact — but it is inconsistent with other stage-boundary modules.
- No link to /start.
- Header missing /manifesto.

---

## /course/a/08 (A-08: Agent Delegation and Briefing — final module of entire course)

**Inbound links:** /course A-08 module card, A-07 pagination "Next".
**Outbound links:**
- Header: / (logo), /course, /guide
- Breadcrumb nav-bar: /course
- Pagination: /course/a/07 (Previous) — no "Next" (expected — final module)
- Stage-complete prompt: email save form

**progress.js loaded:** Yes
**profile.js loaded:** Yes

**Issues:**
- No link to /start.
- No link back to /course or / after completing the course. The only navigation after the stage-complete prompt is the header and breadcrumb. The body text mentions "continue to X-01: API Fundamentals" but there is no link — the X-series does not exist yet. This is a dead-end reference.
- Header missing /manifesto.
- The closing keynote and stage-complete prompt have no "back to course" or "back to home" CTA. After completing the entire course, the user's only navigation options are the small header links.

---

## /guide (Practical Guide)

**Inbound links:** Homepage header, homepage hero secondary, /see nav, /start header, /course header, all module headers, /see done screen.
**Outbound links:**
- Header: / (logo), /manifesto, /see ("Give it a go")
- Body CTAs: /see, /manifesto
- Body links: /pdf, /handbook

**progress.js loaded:** No
**profile.js loaded:** No

**Issues:**
- No link to /course. A user reading the guide has no way to reach the course except going home first.
- No link to /start. A user cannot choose a profile from this page.
- Header is missing /course link — the most important destination from a guide page.

---

## /manifesto

**Inbound links:** Homepage header, homepage hero secondary, /course header, /guide header.
**Outbound links:**
- Header: / (logo), /guide, /see ("Give it a go")
- Body CTAs: /see, /guide
- Body links: /pdf, /handbook, /download

**progress.js loaded:** No
**profile.js loaded:** No

**Issues:**
- No link to /course. Same problem as /guide — a reader cannot reach the course from here.
- No link to /start.
- Header is missing /course link.

---

## Fixes needed

Listed in priority order (highest impact first).

### P1 — Dead ends and missing critical links

1. **Guide page (/guide) is missing a link to /course.** The guide is a primary content page linked from every module header. A user reading it has no path to the course. Add /course to the guide header.

2. **Manifesto page (/manifesto) is missing a link to /course.** Same issue. Add /course to the manifesto header.

3. **A-08 references "X-01: API Fundamentals" with no link and the page does not exist.** This is a dead-end reference at the very end of the course. Either remove the reference, add a "coming soon" note, or link to a placeholder.

4. **/see (experience page) has no link to /course.** A user who finishes the experience and does not want to pick a profile cannot reach the course. Add /course to the nav or the done screen.

5. **E-01 is missing progress.js.** Progress tracking breaks at the first Enabled User module. Add `<script src="/progress.js"></script>` to the head.

6. **A-00 is missing progress.js.** Progress tracking breaks at the first Advanced module. Add `<script src="/progress.js"></script>` to the head.

### P2 — Missing secondary navigation

7. **E-01 is missing profile.js.** Minor inconsistency — no profile-conditional content on this page currently, but if any is added later it will silently fail. Add `<script src="/profile.js"></script>` to the head.

8. **A-00 is missing profile.js.** Same issue. Add `<script src="/profile.js"></script>` to the head.

9. **No module page links to /start.** A user who enters the course from the homepage CTA (bypassing /start) has no way to set a profile from inside the course. The only path to /start from within the course is via the conditional profile-rec block on /course/index.html. Add /start to the module header or to each module page as a secondary link (e.g. "Set your profile" or "Where to start").

10. **Homepage header hides all nav links on mobile (480px).** At small screen sizes, users see only the logo and "Give it a go" CTA. /course, /start, /guide, /manifesto are all hidden. At minimum, /course should remain visible on mobile.

### P3 — Inconsistent headers

11. **Headers are inconsistent across pages.** The homepage header has: Guide, Manifesto, Course, Where to start, Give it a go. The /course header has: Home, Guide, Manifesto. Module pages have: Course, Guide. The guide has: Manifesto, Give it a go. The manifesto has: Guide, Give it a go. Standardise the header links across all pages to a consistent set (at minimum: Home, Course, Guide).

12. **Stage-complete prompts (B-10, E-07, A-08) have no navigation CTA after dismissal.** After saving email or clicking "No thanks," the user sees no clear next action. Consider adding a "Continue to next module" or "Back to course" link below the prompt.

### P4 — Potential dead links (unverified)

13. **/course/reference/verbs** is linked from E-01. Verify this page exists.
14. **/download**, **/pdf**, **/handbook** are linked from homepage, guide, and manifesto. Verify these pages exist.
