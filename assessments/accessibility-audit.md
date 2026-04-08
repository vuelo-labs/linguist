# Linguist Course Site -- Accessibility Audit

**Date:** 2026-04-08
**Scope:** WCAG 2.1 AA compliance
**Auditor:** Accessibility specialist review
**Files audited:** style.css, course/course.css, index.html, course/index.html, course/b/01/index.html, course/b/10/index.html, course/e/01/index.html, course/a/08/index.html, see/index.html, start/index.html

---

## Executive Summary

The Linguist site has a solid semantic foundation -- correct use of `<header>`, `<main>`, `<footer>`, `<nav>`, semantic lists, and proper heading hierarchy across most pages. The HTML is clean and well-structured, which gives screen readers a reasonable experience out of the box.

However, the audit identifies **three critical issues** and several serious ones:

1. **No visible focus styles anywhere.** The entire CSS layer contains no `:focus` or `:focus-visible` rules (except one `border-color` change on the email input). Keyboard users cannot see where they are on the page. This is a blanket WCAG 2.4.7 failure across every page.

2. **No skip navigation link.** Every page requires keyboard users to tab through the full header and navigation before reaching main content.

3. **Colour contrast failures.** The `--w-faint` colour (#B0A89E) on `--w-bg` (#FAF8F4) fails WCAG AA for both normal and large text. The `--w-muted` colour (#7A6E68) on `--w-bg` also fails AA for normal text. These colours are used extensively for labels, captions, and secondary text throughout the site.

The site has no images requiring alt text (text-only content), uses `aria-hidden` correctly on decorative SVGs, and has good semantic structure. The primary failures are in keyboard interaction and colour contrast -- both are fixable with targeted CSS additions.

---

## Issues Table

| # | Issue | Location | WCAG Criterion | Severity |
|---|-------|----------|----------------|----------|
| 1 | No visible focus indicators on any interactive element | style.css, course.css, all pages | 2.4.7 Focus Visible | Critical |
| 2 | No skip-to-content link | All pages | 2.4.1 Bypass Blocks | Critical |
| 3 | `--w-faint` (#B0A89E) on `--w-bg` (#FAF8F4) fails contrast -- ratio ~2.5:1 | style.css; used in footer, nav bar, labels, eyebrows | 1.4.3 Contrast (Minimum) | Critical |
| 4 | `--w-muted` (#7A6E68) on `--w-bg` (#FAF8F4) borderline -- ratio ~3.8:1 | style.css; used for body-level secondary text | 1.4.3 Contrast (Minimum) | Serious |
| 5 | `--w-accent` (#8C7355) on `--w-bg` (#FAF8F4) borderline -- ratio ~3.7:1 | style.css; used for links and accent text | 1.4.3 Contrast (Minimum) | Serious |
| 6 | Form email inputs lack visible `<label>` elements | course/b/10, course/a/08, see/index.html | 1.3.1 Info and Relationships, 3.3.2 Labels or Instructions | Serious |
| 7 | `scroll-behavior: smooth` without `prefers-reduced-motion` media query | style.css line 57 | 2.3.3 Animation from Interactions | Serious |
| 8 | Screen fade animation without `prefers-reduced-motion` respect | see/index.html line 861 | 2.3.3 Animation from Interactions | Moderate |
| 9 | `<div class="module-nav-bar">` used as navigation without `role="navigation"` or `<nav>` | All module pages | 1.3.1 Info and Relationships | Moderate |
| 10 | `role="main"` on `<section>` in see/index.html instead of using `<main>` | see/index.html line 888 | 1.3.1 Info and Relationships | Moderate |
| 11 | Only one `role="main"` applied, but it is on screen-intro; other screens have no landmark | see/index.html | 1.3.1 Info and Relationships | Moderate |
| 12 | Profile cards use `onclick` on `<div>` elements -- not keyboard accessible | start/index.html | 2.1.1 Keyboard | Serious |
| 13 | `module-pagination-next .module-pagination-label` uses `rgba(255,255,255,0.45)` -- fails contrast on dark bg | course.css line 540 | 1.4.3 Contrast (Minimum) | Serious |
| 14 | `module-already-done` button label text uses `--w-faint` (#B0A89E) -- fails contrast on white bg | course.css line 209 | 1.4.3 Contrast (Minimum) | Moderate |
| 15 | Footer text uses `--w-faint` (#B0A89E) -- fails contrast | All pages | 1.4.3 Contrast (Minimum) | Moderate |
| 16 | `<header>` element is not labelled as `<nav>` for its link group | index.html, all pages | 1.3.1 Info and Relationships | Minor |
| 17 | `<nav>` in see/index.html contains no `aria-label` to distinguish it from `module-pagination` nav | see/index.html, module pages | 2.4.1 Bypass Blocks | Minor |
| 18 | `blockquote::before` content ("prompt") is CSS-generated text -- invisible to some screen readers | course.css line 384 | 1.3.1 Info and Relationships | Minor |
| 19 | External links missing indication they open in new window | Footer links with `target="_blank"` | 3.2.5 Change on Request | Minor |
| 20 | `onmouseover`/`onmouseout` inline event handlers for hover effects are not keyboard equivalent | index.html lines 288-316 | 2.1.1 Keyboard | Moderate |

---

## Detailed Findings

### 1. Colour Contrast Analysis

Calculations use the WCAG relative luminance formula. Values are approximate.

| Foreground | Background | Ratio | Normal text AA (4.5:1) | Large text AA (3:1) |
|-----------|-----------|-------|----------------------|-------------------|
| `--w-text` #2A2420 on `--w-bg` #FAF8F4 | -- | ~12.5:1 | PASS | PASS |
| `--w-muted` #7A6E68 on `--w-bg` #FAF8F4 | -- | ~3.8:1 | FAIL | PASS |
| `--w-faint` #B0A89E on `--w-bg` #FAF8F4 | -- | ~2.5:1 | FAIL | FAIL |
| `--w-accent` #8C7355 on `--w-bg` #FAF8F4 | -- | ~3.7:1 | FAIL | PASS |
| #FFFFFF on `--w-accent` #8C7355 | -- | ~3.7:1 | FAIL | PASS |

**Impact:** `--w-faint` is used for: footer text (all pages), navigation bar text (`.module-nav-bar`), "Already done this" button text, pagination labels, step labels, card objectives on course index, various eyebrow labels, and the `done-more-label` / `done-pdf-label` classes in the /see experience. This is a widespread failure.

`--w-muted` is used for: `.module-objective`, `.stage-intro`, `.hero-body`, `.mode-text`, header links, card objectives, and callout notes. At ~3.8:1, it passes for large text (18pt+) but fails for normal-sized text where it is used at 0.82rem-1rem.

`--w-accent` is used for links (normal text) and button text. At ~3.7:1, it fails AA for normal text. White on `--w-accent` (used for `.btn-warm`) also fails at ~3.7:1 for normal text but passes for large text.

### 2. Keyboard Navigation and Focus

**No focus styles defined.** The global stylesheet (`style.css`) and course stylesheet (`course.css`) contain zero `:focus` or `:focus-visible` pseudo-class rules, with one exception: `.stage-complete-form input[type="email"]:focus` gets a `border-color` change (course.css line 1000). Every other interactive element -- links, buttons, summary/details toggles, quiz buttons -- has no visible focus indicator.

The CSS reset (`*, *::before, *::after { ... margin: 0; padding: 0; }`) does not explicitly remove `outline`, so browser defaults may remain. However, the site should not rely on browser defaults for compliance -- explicit, visible focus styles are required by 2.4.7.

**No skip link.** The `.visually-hidden` utility class exists in style.css (line 117) and could be used for a skip link, but none is implemented on any page. Module pages have a sticky header plus a navigation breadcrumb bar, meaning keyboard users must tab through 6-8 links before reaching content.

**Profile cards are not keyboard accessible.** In `start/index.html`, the three profile selection cards are `<div>` elements with click handlers on child `<button>` elements. The buttons themselves are keyboard accessible, but the parent `<div class="profile-card">` also has an `onclick` handler implied by the card hover styles -- the card itself is not focusable or operable by keyboard.

**Inline event handlers on homepage.** In `index.html` lines 288-316, the "four layers" cards use `onmouseover`/`onmouseout` for background colour changes. These have no `onfocus`/`onblur` equivalents, so keyboard users get no hover feedback.

### 3. Semantic Structure

**Heading hierarchy is correct across all pages reviewed.** Each page has a single `h1`, followed by `h2` sections, with `h3` subsections where needed. No levels are skipped.

**Landmark regions are mostly present.** All module pages and the homepage use `<header>`, `<main>`, and `<footer>`. The course index page uses these correctly. The /see page uses `<nav>` for its navigation bar but applies `role="main"` to a `<section>` element instead of using a `<main>` element -- and only applies it to `screen-intro`, leaving the other four screens without a main landmark.

**The `.module-nav-bar` breadcrumb strip is a `<div>`, not a `<nav>`.** It contains links and acts as secondary navigation but has no navigation landmark semantics. This should be a `<nav aria-label="Module breadcrumb">`.

**Lists are used correctly.** Ordered and unordered lists are used appropriately throughout module content. The `.done-pause-list` in see/index.html uses CSS pseudo-elements for bullets rather than native `<li>` markers, but the underlying markup is a correct `<ul>`.

**Module pagination uses `<nav>`.** This is correct.

### 4. Images and Media

**No `<img>` elements requiring alt text were found in the audited pages.** Content is entirely text-based.

**Decorative SVGs are handled correctly.** The sine wave and flatline SVGs in see/index.html all have `aria-hidden="true"` on their parent containers (`.panel-wave`, `.know-wave`, `.know-flatline`).

**The homepage `.sine-divider` references an `<img>` inside it** (style.css line 113), but no sine divider is actually used in the audited pages.

### 5. Forms and Inputs

**Email inputs lack associated `<label>` elements.** The stage-complete prompt forms in course/b/10 and course/a/08 have:
```html
<input type="email" id="stage-email-input" placeholder="your@email.com" autocomplete="email">
```
There is no `<label for="stage-email-input">`. The `placeholder` attribute is not an accessible substitute for a label (WCAG 3.3.2). Screen readers may announce the input with no label or only the placeholder text, which disappears on focus.

The same issue appears in see/index.html for `#pdf-email`.

**Buttons are labelled.** The "Save my place" and "Already done this" buttons have visible text content. The "No thanks, keep going" skip button also has text. These are acceptable.

**No error states are communicated accessibly.** The email submission forms have no visible error messaging or `aria-invalid` attributes. If submission fails, the user receives no feedback (the JavaScript appears to silently fail).

### 6. ARIA Usage

**`role="main"` is used on a `<section>` in see/index.html.** This should be a `<main>` element instead. Additionally, only `screen-intro` has this role; the other four screens (see, try, know, done) are `<section>` elements with no landmark role. Since only one screen is visible at a time, the active screen should carry `role="main"` or the wrapper should be a `<main>`.

**`aria-hidden="true"` is used correctly** on decorative SVG containers.

**No redundant ARIA was found.** The site generally relies on native semantics, which is the correct approach.

**Missing ARIA:** The `<details>/<summary>` stage accordions on the course index page are native HTML and do not need ARIA. However, the `.stage-toggle-label` uses `::before` content ("Expand"/"Collapse") which may not be announced by all screen readers -- an `aria-expanded` attribute on the `<summary>` or a visually-hidden text span would be more robust.

### 7. Motion and Animation

**`scroll-behavior: smooth` is set globally** (style.css line 57) without a `prefers-reduced-motion` media query to disable it. Users with vestibular disorders may experience discomfort from smooth scrolling.

**The /see experience uses a fade-in animation** (see/index.html line 861: `@keyframes fadeIn`) on screen transitions. This 0.25s opacity fade is mild but is not gated behind `prefers-reduced-motion`. The same page also uses CSS transitions on multiple elements (buttons, colours) at 0.15s durations -- these are generally acceptable.

**`transition` properties are used throughout** for hover effects (backgrounds, borders, opacity). These are short (0.15s) and limited to colour/opacity changes, which are generally not problematic for vestibular sensitivity. However, best practice would be to wrap all transitions in a `prefers-reduced-motion` check.

### 8. CSS-Generated Content

**`blockquote::before { content: 'prompt'; }`** (course.css line 384) inserts the word "prompt" as a label above every blockquote in module bodies. This CSS-generated text is announced by some screen readers (VoiceOver, NVDA) but not reliably across all assistive technologies. The label should be in the HTML as a visually-styled `<span>` or should be supplemented with `aria-label` on the blockquote.

Similarly, `.stage-toggle-label::before` (course.css lines 762-763) generates "Expand"/"Collapse" text via CSS. This is fragile for screen reader support.

---

## Recommendations

### P1 -- Critical (fix immediately)

**1. Add visible focus styles for all interactive elements.**

Add to `style.css`:
```css
a:focus-visible,
button:focus-visible,
summary:focus-visible,
input:focus-visible,
[tabindex]:focus-visible {
  outline: 2px solid var(--w-accent);
  outline-offset: 2px;
}
```
This single rule covers links, buttons, details summaries, form inputs, and any tabindex elements. Use `:focus-visible` (not `:focus`) to avoid showing outlines on mouse clicks while ensuring they appear for keyboard navigation. Test with Tab key on every page.

**2. Add a skip-to-content link on every page.**

The `.visually-hidden` class already exists. Add as the first child of `<body>`:
```html
<a href="#main" class="visually-hidden" style="position:fixed;top:0;left:0;z-index:100;padding:1rem;background:var(--w-bg);color:var(--w-text);" onfocus="this.classList.remove('visually-hidden')" onblur="this.classList.add('visually-hidden')">Skip to content</a>
```
And add `id="main"` to the `<main>` element on every page.

**3. Fix `--w-faint` contrast failures.**

Darken `--w-faint` from #B0A89E to approximately #807770 (target ~4.5:1 against #FAF8F4). Alternatively, increase font size to 18pt+ for all `--w-faint` usage (large text threshold), but this is impractical given its use in small labels. Darkening the colour is the correct fix.

### P2 -- Serious (fix soon)

**4. Fix `--w-muted` and `--w-accent` contrast for normal text.**

- Darken `--w-muted` from #7A6E68 to approximately #665A54 (target 4.5:1 for normal text).
- Darken `--w-accent` from #8C7355 to approximately #74603F (target 4.5:1 for normal text).
- For `.btn-warm` (white on accent), if `--w-accent` is darkened to #74603F, white-on-accent ratio improves to ~5.0:1. Verify after adjustment.

**5. Add `<label>` elements to all email inputs.**

Replace:
```html
<input type="email" id="stage-email-input" placeholder="your@email.com">
```
With:
```html
<label for="stage-email-input" class="visually-hidden">Email address</label>
<input type="email" id="stage-email-input" placeholder="your@email.com">
```

**6. Fix the `.module-pagination-next .module-pagination-label` contrast.**

`rgba(255,255,255,0.45)` on `--w-text` (#2A2420) yields an effective colour of approximately #8C857E, which is low contrast on a dark background. Change to `rgba(255,255,255,0.7)` minimum, or use a specific light colour that provides at least 4.5:1 against #2A2420.

**7. Add `prefers-reduced-motion` media query.**

Add to `style.css`:
```css
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

**8. Make profile card hover effects keyboard-accessible.**

On `index.html` lines 288-316, add `onfocus`/`onblur` handlers alongside `onmouseover`/`onmouseout`, or replace inline handlers with CSS `:focus-within` styling.

### P3 -- Moderate/Minor (fix when practical)

**9. Change `.module-nav-bar` to `<nav aria-label="Breadcrumb">`.**

**10. Fix the /see page landmark structure.** Replace `role="main"` on `<section id="screen-intro">` with a proper `<main>` wrapper around `#screen-wrapper`, or dynamically set `role="main"` on the active screen.

**11. Replace CSS-generated content with HTML text.** Move the "prompt" label from `blockquote::before` into an HTML `<span>` element. Move "Expand"/"Collapse" from `.stage-toggle-label::before` into a visually-hidden `<span>` or use `aria-expanded` on the `<summary>`.

**12. Add `aria-label` to distinguish multiple `<nav>` landmarks.** When a page has both a site header nav and a module pagination `<nav>`, add `aria-label="Site"` and `aria-label="Module navigation"` respectively.

**13. Indicate external links.** Add visually-hidden text "(opens in new tab)" or an icon with `aria-label` to links with `target="_blank"`.

**14. Add accessible error states to email forms.** When validation fails, set `aria-invalid="true"` on the input and display an error message linked via `aria-describedby`.

---

## Summary of Pass/Fail by WCAG Criterion

| Criterion | Description | Status |
|-----------|-------------|--------|
| 1.1.1 | Non-text Content | Pass (no images found) |
| 1.3.1 | Info and Relationships | Partial fail (nav bar, CSS content) |
| 1.4.3 | Contrast (Minimum) | Fail (--w-faint, --w-muted, --w-accent) |
| 1.4.11 | Non-text Contrast | Not fully tested |
| 2.1.1 | Keyboard | Partial fail (profile cards, inline handlers) |
| 2.4.1 | Bypass Blocks | Fail (no skip link) |
| 2.4.3 | Focus Order | Pass (logical DOM order) |
| 2.4.4 | Link Purpose | Pass |
| 2.4.6 | Headings and Labels | Pass |
| 2.4.7 | Focus Visible | Fail (no focus styles) |
| 2.5.3 | Label in Name | Pass |
| 3.1.1 | Language of Page | Pass (lang="en") |
| 3.2.5 | Change on Request | Minor fail (external links) |
| 3.3.1 | Error Identification | Fail (no error messaging) |
| 3.3.2 | Labels or Instructions | Fail (email inputs) |
| 4.1.2 | Name, Role, Value | Partial fail (see page landmarks) |
