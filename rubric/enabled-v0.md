# Enabled Tier — Capability Rubric (v0)

**Status:** Draft v0, 2026-05-06.
**Purpose:** Score an user's prompting work against the Enabled tier of the Linguist ladder. Doubles as the telemetry spec for Cyborg.

---

## The ladder

**Beginner → Enabled → Advanced → Practitioner**

Enabled is the default corporate-offer guarantee. It is the bar for *competent, deliberate use of chat AI for real work*. Below Enabled, an user is "using AI as autocomplete." Above Enabled (Advanced) means terminal-grade tooling — out of scope for the broad SKU.

**The Enabled user can:**
- Choose the verb that matches the outcome they want
- State constraints up front rather than patching them in later
- Load context deliberately rather than dumping or starving
- Recognise when a conversation has gone off-track and re-seed rather than patch
- Ask for a plan before producing, when stakes warrant it
- Carry only what matters into the next conversation
- Maintain a personal reference of what works for their tasks

---

## Scoring shape

Each behaviour has:
- **Anchor** — the observable, present/absent thing
- **Signal** — what Cyborg captures that evidences the anchor
- **Threshold** — what counts as Enabled vs below/above

Score is `present / partial / absent` per behaviour, aggregated:
- **Enabled** = ≥7 of 9 behaviours present, none absent on load-bearing items (B1, B3, B4)
- **Emerging Enabled** = 5–6 present
- **Below Enabled** = ≤4 present

Two assessors must agree within one band for placement to be considered reliable. Disagreements log to the calibration set.

---

## Behaviours

### B1 — Verb-outcome match  *(load-bearing)*
**Anchor:** Opening verb predictably matches the response shape requested. "Summarise" produces a summary. "Draft" produces a draft. "Explain" produces an explanation. Risky verbs (improve, enhance, make better) appear with an explicit success criterion or are avoided.

**Signal:** Cyborg parses the leading verb of every user message. Cross-reference against a verb taxonomy (predictable / risky / ambiguous). Risky-verb messages are flagged; if they appear without a constraint clause, count as a miss.

**Threshold:**
- Present: ≥80% of opening verbs are predictable, OR risky verbs always co-occur with a success criterion
- Partial: 60–80%
- Absent: <60% — user is still "winging" verb choice

Source: E-01 *The First Word Matters*.

---

### B2 — Constraint discipline
**Anchor:** Constraints (length, format, tone, exclusions, must-include items) appear in the opening message rather than being added in follow-ups.

**Signal:** Cyborg detects constraint phrases ("under N words," "in bullet points," "don't mention X," "must include Y," "in the style of," tone words) per turn. Compare position: opening message vs follow-up.

**Threshold:**
- Present: ≥70% of constraints land in the opening message; follow-ups are refinements not corrections
- Partial: 50–70%, or constraints appear after first response
- Absent: <50%, or correction-spiral pattern (constraint added → response wrong shape → constraint re-added)

Source: E-02 *Tell It What to Leave Alone*.

---

### B3 — Context loading  *(load-bearing)*
**Anchor:** When a task has external context (a document, an email, prior decisions, code), the user loads it into the conversation before asking for output. Context is *relevant* — not a wholesale dump, not absent.

**Signal:** Cyborg measures:
- Attachment / paste size at conversation open
- Ratio of context tokens to instruction tokens
- Whether the user ever responds to "I don't have access to X" with a paste, vs giving up or guessing

**Threshold:**
- Present: tasks needing context have it loaded ≥75% of the time, with ratio in a defensible range (not 50KB dumps for a 1-line ask, not 200 chars for a doc review)
- Partial: context loaded inconsistently or sized poorly
- Absent: starves the model, or dumps everything every time

Source: E-03 *Context Is Fuel*.

---

### B4 — Restate over patch  *(load-bearing)*
**Anchor:** When a response is materially wrong, the user rewrites the request rather than adding "no, I meant…" patches. Recognises correction spirals and exits them.

**Signal:** Cyborg detects:
- Sequential corrections within a thread (≥3 user turns in a row that are corrections, not new requests)
- Restart events (new conversation opened within 10 minutes of a correction-heavy thread, with a re-seeded prompt)
- Patch phrases ("no, I meant," "actually," "not that," "try again but…") vs restate phrases ("let me start over," "rewriting:")

**Threshold:**
- Present: correction spirals (≥3 patches) exit via restate within 1–2 more turns
- Partial: spirals sometimes resolved by restate, sometimes by abandoning
- Absent: long patch chains (5+) without restart

Source: E-04 *Restate, Don't Patch*.

---

### B5 — Plan-first on stakes
**Anchor:** For tasks above a complexity threshold (multi-step, ambiguous, irreversible-feeling), the user asks for a plan or outline before production output.

**Signal:** Cyborg classifies tasks by complexity heuristic (length of brief, presence of "and then," multi-deliverable language, code or document generation requests). Detect plan-eliciting language in the opening turn ("first give me a plan," "outline the approach," "what would you do," "before you start").

**Threshold:**
- Present: ≥60% of high-complexity tasks open with plan-elicitation
- Partial: 30–60%, or plan-asks happen only after a bad first attempt
- Absent: <30% — user always asks for production output cold

Source: E-05 *Get the Plan First*.

---

### B6 — Re-seed over re-cycle
**Anchor:** When a conversation has accumulated drift, contradictions, or stale context, the user opens a new conversation with a deliberate seed prompt that carries forward only what matters.

**Signal:** Cyborg measures:
- Conversation length (turns and tokens) at point of abandonment
- New-conversation events that begin with a structured seed (named entities, decisions, constraints copied from prior thread)
- Time gap between conversations on related topics

**Threshold:**
- Present: long-running threads (≥10 turns) followed by a re-seed with structured carryover
- Partial: new conversations started but with thin/no carryover (lose state)
- Absent: rides the same thread until response quality collapses

Source: E-06 *Migration and Re-seed*.

---

### B7 — Reference-card behaviour
**Anchor:** The user has a personal repertoire of patterns they reuse — opening prompts, constraint templates, verb defaults — visible in their work as recurring shapes rather than reinventing every time.

**Signal:** Cyborg measures cross-conversation similarity:
- Repeated opening structures (same first line, same ordering of role/task/constraints)
- Reused phrasings of common asks
- Stable personal conventions (e.g. always specifies output format, always names audience)

**Threshold:**
- Present: ≥3 recurring template-shaped patterns visible across the assessment window
- Partial: 1–2 patterns
- Absent: every prompt reinvented

Source: E-07 *Your Reference Card*.

---

### B8 — Stop-condition discipline
**Anchor:** Open prompts contain a stopping condition (length, count, scope) so output ends where the user wanted, not where the model decides to stop.

**Signal:** Cyborg detects stopping-condition phrases per opening message ("under N words," "give me 3," "one paragraph," "no more than X," "stop after"). Cross-reference with response length variance — users without stop conditions show wide response-length variance.

**Threshold:**
- Present: ≥70% of opening prompts have a stop condition where one is appropriate
- Partial: 40–70%
- Absent: <40%, response-length variance high

Source: B-06 *Tell It When to Stop* (Beginner foundation; Enabled is expected to retain).

---

### B9 — Re-read discipline
**Anchor:** The user reads the response carefully enough to notice when it answered a near-but-wrong question, missed a constraint, or hallucinated. Behaviour evidence: corrections are precise, not generic ("you missed constraint X" not "this is wrong").

**Signal:** Cyborg classifies follow-up corrections:
- *Precise* — names the specific defect
- *Generic* — "this is wrong / try again"
- *No correction* (accepted) — measured against post-task survey: did the user accept output that the rubric would flag?

**Threshold:**
- Present: ≥70% of corrections are precise; accepted output rarely fails an external check
- Partial: mix of precise and generic
- Absent: mostly generic corrections, or accepts flawed output

Source: B-07 *What Just Happened?* + general fluency.

---

### B10 — Context-switch hygiene  *(load-bearing)*
**Anchor:** When the user moves between tasks, conversations, or interruptions, the cost of re-grounding the AI is low. They keep parallel conversations cleanly scoped, return to paused work without restarting from scratch, and don't bleed context between unrelated tasks.

**Signal:** Cyborg measures, across the assessment window:
- *Re-grounding cost* — tokens/turns spent in the first user message of a new conversation re-explaining a task the user was already working on. Lower = better hygiene; high = no carryover.
- *Conversation parallelism* — number of distinct active threads in a working session. Practitioners run multiple cleanly; below-Enabled users either run one until it collapses, or open many that contaminate each other.
- *Interruption recovery* — when a conversation is paused and resumed (>30 min gap), measure whether the resume turn includes orienting context (a re-seed) or just continues blindly into stale state.
- *Topic bleed* — conversations whose later turns reference unrelated prior work signal context not properly compartmentalised.

**Threshold:**
- Present: re-grounding cost low and stable; parallel threads stay clean; resumes after pauses include orienting context ≥70% of the time
- Partial: re-grounding cost variable; some topic bleed; some pause-resumes go in cold
- Absent: high re-grounding cost (user keeps re-pasting the same context) OR conversations regularly run aground from accumulated drift OR every interruption restarts from zero

**Why this is load-bearing:** Context-switching cost is the largest hidden tax on AI-assisted work. It's the most measurable form of "drain," the most CFO-legible (minutes per task), and the behaviour most directly improved by Linguist training. A team scoring well on B1–B9 but poorly on B10 will still feel exhausted.

Source: cross-cutting; reinforces B3 (context loading), B6 (re-seed), B7 (templates).

---

## Scoring update for B10

B10 joins B1, B3, B4 as load-bearing — Enabled requires it present, not partial. Aggregate threshold becomes:
- **Enabled** = ≥8 of 10 behaviours present, none absent on B1, B3, B4, B10
- **Emerging Enabled** = 6–7 present
- **Below Enabled** = ≤5 present

---

## Borderline / emerging policy

An user at 5–6 of 9 is **Emerging Enabled**. Report shows the band, the missing behaviours, and the recommended next-step modules. Borderline placements never get forced — buyers will ask, and "emerging" is a real signal, not a fudge.

## Cyborg telemetry — minimum signals required

To run this rubric, Cyborg must emit, per assessed user, over a defined window:

1. Per-message: timestamp, conversation_id, turn index, role (user/assistant), full text, attachment presence/size, model used
2. Conversation-level: open/close timestamps, turn count, total tokens, abandonment heuristic (no message in N minutes)
3. Cross-conversation linkage where possible (same task, related entities)
4. Response-length distribution
5. Tool/feature usage where applicable (file uploads, project memory, custom instructions)

The rubric scoring layer is downstream of these signals — initially a notebook + human review, eventually automated.

## Open questions for the Cyborg team

1. Is plain-text per-message capture available today, or only metadata? (B1, B2, B5, B7, B8 all need text.)
2. What's the assessment window — a single timed session, a 2-week observation period, or both?
3. Can Cyborg detect "abandonment vs completion" of a conversation programmatically, or do we need a user-driven end signal?
4. Multi-vendor roadmap — does the rubric need to be vendor-portable in v1, or is Claude-only acceptable until v2?

## Out of scope for v0

- Wellbeing / drain / agency — covered by the survey, not this rubric
- Token cost — measured separately; correlated in the report, not a rubric input
- Advanced-tier behaviours (CLAUDE.md authoring, subagent delegation, plan-mode in Claude Code) — Advanced rubric is a separate doc when we get there
- Practitioner-tier behaviours — parked on Cyborg per existing decision

## Versioning

This is **v0** — drafted from existing E-track course material before any calibration runs. Expect significant change after:
- 5+ calibration assessments (tighten thresholds based on observed distributions)
- Inter-rater reliability check (refine anchor language where assessors disagree)
- First paid engagement (real client edge cases)

Bump to v1 once it has survived one full engagement.
