# Review Findings — Fixes Applied

All fixes completed 2026-04-03.

| # | Fix | File | Status | Notes |
|---|-----|------|--------|-------|
| 1 | Fix `data-machine"` HTML bug — exercise-1.html | `/course/exercise-1.html` | Already fixed | No instances of `data-machine"` found; all attributes are correctly formatted |
| 2 | Fix `data-machine"` HTML bug — exercise-2.html | `/course/exercise-2.html` | Already fixed | No instances of `data-machine"` found; all attributes are correctly formatted |
| 3 | Link `/course` from homepage | `/index.html` | Fixed | Added "Course" link to site header navigation (between Manifesto and CTA button) |
| 4 | Reduce Done screen CTAs and link to `/course` | `/see/index.html` | Fixed | Replaced 8 CTAs with 2: primary (Start the course → /course), secondary (Guide). Removed Share, Support, Mailing list sections |
| 5a | Switch absolute URLs to relative in footer | `/prompt-starter.html` | Fixed | Changed all footer links from `https://linguist.vuelolabs.com/*` to relative paths (`/guide`, `/handbook`, `/pdf`, `/see`) and removed `target="_blank"` and `rel="noopener"` |
| 5b | Simplify dispatch note paragraph | `/prompt-starter.html` | Fixed | Replaced jargon-heavy paragraph with plain language: "Write a clear instruction. The AI will follow it. You can refine in the next message if needed." |
| 5c | Remove undefined terms from Step 5 intro | `/prompt-starter.html` | Fixed | Changed "You'll leave with a seed template, a re-seed technique, and a personal reference card" to "You'll leave with a personal reference card you can reuse in any conversation" |
| 6 | Resolve manifesto time contradiction | `/manifesto/index.html` | Fixed | Standardized to "Three minutes" (changed "Two to three minutes" on line 326) to match button text "(2–3 min)" |
| 7 | Trim Exercise 1 subtext paragraph | `/course/exercise-1.html` | Fixed | Reduced human-mode subtext from ~40 words to 12 words: "Build your foundation: two projects, one for exploring, one for executing." |
| 7 | Trim Exercise 2 subtext paragraph | `/course/exercise-2.html` | Fixed | Reduced human-mode subtext from ~50 words to 16 words: "The first message sets everything. Get it right from turn one or spend the session correcting it." |
