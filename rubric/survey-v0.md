# Linguist Survey Instrument (v0)

**Status:** Draft v0, 2026-05-06.
**Purpose:** Capture the experience side of AI fluency that telemetry can't see — drain, agency, trust, confidence — and give the corporate report a "people-side" delta to pair with the rubric and token deltas.

---

## Design constraints

- **≤5 minutes to complete.** Anything longer dies in the inbox.
- **Validated where possible.** NASA-TLX (short form) is public-domain and respected. Custom items only where no validated short form fits.
- **Aggregate-only at org level.** Individual responses never exposed to manager without explicit consent.
- **Pre / mid / post cadence.** Plus optional 3-month and 6-month longitudinal follow-ups.
- **Free-text always optional, never required.**

---

## Section A — NASA-TLX (short form)

Standard six-item workload instrument. Each item rated 0–100 (slider; "Very Low" → "Very High"). Source: Hart & Staveland 1988, public domain.

**Framing for respondent:**
> "Thinking about your AI-assisted work over the past two weeks, how would you rate…"

1. **Mental Demand** — How much mental and perceptual activity was required? (Very Low → Very High)
2. **Physical Demand** — How much physical activity was required? *(Keep for instrument fidelity even though always low for knowledge work; correlations matter.)*
3. **Temporal Demand** — How much time pressure did you feel due to the pace?
4. **Performance** — How successful do you think you were? *(Reverse-scored: Perfect → Failure)*
5. **Effort** — How hard did you have to work to accomplish your level of performance?
6. **Frustration** — How insecure, discouraged, irritated, stressed, or annoyed did you feel?

**Reporting:** mean per item + composite score (unweighted average of all 6, performance reverse-scored). Pre/post delta on composite is the headline number.

---

## Section B — Custom Likert items (5-point: Strongly disagree → Strongly agree)

Five items, each chosen because it maps to a specific Linguist thesis and isn't covered by NASA-TLX.

### B1 — Agency
> "When working with AI on a task, I feel in control of the direction the work takes — not babysitting the tool."

**Why:** Cyborg thesis is agency-preserving patterns reduce cognitive load. This is the leading indicator. A team that says "yes" here is healthier than one that scores well on TLX but says "I'm just typing what it wants."

### B2 — Trust calibration
> "I usually know when to verify what the AI gave me and when to accept it without checking."

**Why:** Both extremes are bad — over-verifying wastes time, under-verifying ships errors. Trust calibration is the skill. We expect this to *increase* through training, not necessarily through self-report alone.

### B3 — Confidence by task type
> "I feel confident using AI for the kinds of tasks I do most often at work."

**Why:** Generic "confidence" questions are noise. Anchoring to "tasks I do most often" makes it a real measurement. Tracks whether training is hitting their actual workflow.

### B4 — Perceived skill growth
> "Over the past month, my prompting has noticeably improved."

**Why:** Self-perception of growth correlates with retention and continued investment. Mid-programme dip here is a red flag worth catching.

### B5 — Recommend
> "I would recommend this kind of training to a colleague."

**Why:** Single-item NPS-shaped signal. Cheap, comparable across cohorts, useful for marketing once we have permission.

### B6 — Context-switch cost  *(headline metric)*
> "When I move between tasks, I lose less time than I used to getting the AI back up to speed."

**Why:** Context-switching is the largest hidden tax on AI-assisted work. It's the behaviour most directly improved by Linguist training and the most CFO-legible self-reported outcome (minutes per task, not vibes). Watch this item closely — it should move more than B4 (perceived skill growth).

### B7 — Resume-from-pause
> "I can pick up an AI conversation I left earlier without re-explaining what I was doing."

**Why:** Specifically captures interruption recovery, which the rubric measures behaviourally on B10. Pre/post delta here is a strong sales line for the corporate report.

### B8 — Mode-switch fluency
> "I can switch between using AI and working without it without losing my train of thought."

**Why:** Linguist's core thesis is human-mode / machine-mode awareness. This item probes whether training has reduced the cognitive cost of moving between them. Distinct from "switching tasks" — this is "switching modes within a task."

---

## Section C — Free text (optional)

Two prompts, ≤200 chars each, optional:

1. **What's the most useful pattern you've started using since the last survey?** *(post + longitudinal only)*
2. **What's the biggest thing that still feels clunky?**

These are gold for case studies and for spotting rubric gaps. Code lightly for themes; quote with permission.

---

## Cadence

| When | Sections | Time |
|---|---|---|
| **Pre-baseline** (week -1) | A + B | ~3 min |
| **Mid-programme** (week 3) | A + B + C | ~4 min |
| **Post-programme** (week 6+1) | A + B + C | ~4 min |
| **+3 months** | A + B + C | ~4 min |
| **+6 months** | A + B + C | ~4 min |

Pre-baseline is critical — without it there's no delta. Don't skip even when the engagement is on a tight timeline.

---

## Reporting layer

For the org-level report:

- **Headline (people-side outcome):** Context-switch composite — mean of B6, B7, B8. This is the strongest sales line: "users report N% lower context-switching cost." Pair with rubric B10 telemetry for triangulation.
- **TLX composite delta** (pre → post). Negative = less burdened. Secondary headline.
- **Agency delta:** B1 mean change. Distinct from workload — a team can be working hard *and* feel in control.
- **Trust delta:** B2 mean change. Watch for *over-confidence* (B2 high but rubric flags accepted-bad-output behaviour). That's a red flag, not a green one.
- **Confidence delta:** B3 by task type if we can collect role labels.
- **Recommendation:** B5 distribution (% top-2-box).

For individual reports: TLX composite + B1–B4 personal trend lines. Never share with manager without consent.

---

## Privacy + ethics

- Responses pseudonymised at the analytics layer; identifying info stays in the lead-management system, not in survey results.
- Aggregation thresholds: never report a metric for a sub-group of <5 respondents (avoids individual identification).
- DPA template needed before first paid engagement; flagged separately in the engagement checklist.

---

## Tooling

**Don't build it.** Pick one:
- **Tally** — clean UI, free tier sufficient, exports to Google Sheets / webhook
- **Typeform** — better UX, costs more, overkill for v0
- **Google Forms** — ugly but free; acceptable for pilot

Recommendation: **Tally**. Set up the survey form there, link from a per-cohort URL, dump responses into Supabase via webhook for unified reporting alongside `team_leads` and rubric scores.

---

## Open questions

1. **Length tolerance.** TLX is 6 items + 5 Likert + 2 free-text. Should be ~4 minutes but may run longer with sliders. Pilot with 3 friendly respondents and time it; cut B4 first if needed (it's the weakest item).
2. **Anonymity vs longitudinal pairing.** We need to track the same respondent across pre/mid/post. Pseudonym tokens (random-generated per respondent, mapped only in our system) are the standard solution; needs implementing in the survey tool config.
3. **Outcome data.** Do we ask the org for cycle-time / PR-review-time / incident-rate to correlate with survey deltas? Powerful if we can get it; massive sales-cycle drag if it's a contractual ask. Probably not in v0; flagged for the larger engagement template later.

---

## Versioning

**v0 = drafted from the framework, not from real data.** Expect changes after:
- 1 friendly pilot run (length, drop-off, free-text quality)
- First paid engagement (does the report read well to a buyer?)
- 5 engagements (item-level reliability — drop or replace items that don't differentiate)

Bump to v1 once it's survived a real engagement.
