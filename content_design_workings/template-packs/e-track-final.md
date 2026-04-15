# E-track Supplementary Content Pack — Final Brief
*Produced by Opus review agent from multi-agent brainstorm and consensus*
*Date: 2026-04-15*

---

## 1. Overview

This pack provides supplementary content for the seven modules of the E-track — the post-plateau track for intermediate users. The audience is learners who can already use AI and have been using it for a while, but whose results have stopped improving. They know the rules; they're not applying them in the moment. Surface instruction doesn't move this audience. Being shown the right answer doesn't either. What moves them is a personal-stakes experience that makes their own assumptions visible and breakable.

The pack assumes no technical setup beyond access to an AI chat interface. It consists of exercises and reference materials that sit alongside the module content — not inside it.

**Design principles that emerged from the two-agent brainstorm and consensus:**

- **Prediction before result.** Where possible, learners commit to a prediction or a judgement before they see the output. The moment they are wrong is the teaching moment.
- **Reversal of the usual direction.** Several modules teach a skill that reverses the natural order of thinking (protect before prompt, plan before execute, triage before carry-forward). Exercises that enforce the reversed direction — not just describe it — are what move the skill.
- **Aha arrives through being wrong, not through being shown the right answer.** Provided worked examples are support material. The primary exercises put the learner in a position to fail productively.
- **Sequencing matters.** Some pieces only work after others. A checklist before the experience is instruction. The same checklist after the experience is a framework grounded in something real. E-track has more sequencing sensitivity than B-track.
- **Behaviour change through efficiency demonstration, not conceptual explanation.** Intermediate users don't restate, don't plan-first, don't trim re-seeds because they believe the old way is faster. The content has to prove otherwise on their own time.
- **Personal work, not provided examples.** Where the exercise survives the switch, use the learner's own material. Fallback tasks exist for learners without suitable material, but they are fallbacks.

---

## 2. Chosen Content — Module by Module

### E-01 — The Verb Autopsy
- **Format:** Annotated side-by-side comparison doc (printable / pasteable)
- **What it teaches:** The first verb in a prompt is a grant of authority; risky verbs hand the AI permission to change things you never intended to negotiate.
- **What it contains:** The learner takes one piece of their own writing, sends it three times with "Improve," "Rewrite," and "Fix," pastes the three responses into a three-column layout, and circles every change the AI made that they didn't ask for.
- **Non-negotiable design requirement:** The text must be the learner's own, and it must be something they're proud of. If the original is poor, the AI's rewrites look like improvements and the lesson inverts. Facilitator and in-exercise instructions must both say: "Use something you would defend. If every circle looks like an improvement, try again with different text."
- **Confirmed secondary:** Predict-Then-Send Exercise, sequenced explicitly *after* the Autopsy. Predict-Then-Send deepens the forecasting habit after the surprise has landed. It is not a companion to be used alongside — running it before the Autopsy asks learners to model decision-making they have not yet observed.
- **Why alternatives were rejected:** The Permission Dial / verb spectrum card duplicates the existing `/course/reference/verbs` page and builds recognition, not insight. The Verb Swap Drill and Verb Swap Worksheet are solid substitution practice but don't produce the personal-stakes aha.

### E-02 — The Negative Space Rewrite
- **Format:** Guided rewrite exercise (15 minutes)
- **What it teaches:** You have to decide what to protect before you write the prompt, not after you see what got changed.
- **What it contains:** The learner takes a document, identifies three things they want left untouched, then writes the constraint layer only — the "Don't" lines — before attaching it to the prompt and sending.
- **Non-negotiable design requirement:** The protection list must be written before the prompt is drafted. The whole exercise is the direction-reversal. A worked example showing someone else's protection list should precede the blank — low-confidence writers will freeze otherwise.
- **Confirmed secondary:** (1) The Constraint Vocabulary Card, as a *standalone* reusable reference — not a bundled companion. It lives in the gap between sessions, not in the session where the Rewrite happens. (2) The Constraint Audit, a retrospective "look back" for learners with real chat history who want to see where one line would have saved a full correction round.
- **Why alternatives were rejected:** The Collateral Damage Audit works in the forward direction (send, then audit), which is the direction the module is trying to reverse. The Constraint Failure Gallery is support material for a different kind of course.

### E-03 — The Load-Bearing Test Live
- **Format:** Guided exercise with prediction element (20 minutes)
- **What it teaches:** Your intuition about which context is load-bearing is less accurate than you think; calibration comes from being wrong, not from thinking harder.
- **What it contains:** The learner breaks a real prompt into individual context pieces, predicts which are load-bearing, then tests by removing two or three "Yes" pieces and comparing outputs. A calibration step asks them to explain any wrong predictions.
- **Non-negotiable design requirement:** The prediction must be committed to before the test is run. The exercise must open with a worked example of a *wrong* prediction, not a correct one — framing being wrong as the expected outcome, not a failure.
- **Confirmed secondary:** The Context Stripping Sequence, which produces the "cliff edge" moment (at what point does quality break?) rather than per-piece calibration. Different and complementary, not redundant. Build if the pack has capacity.
- **Why alternatives were rejected:** The Context Audit Template / five-slot template is a workflow addition that assumes the belief already exists. The decision flowchart adds process without insight. The Context Swap relies on constructed alternative context that can feel manufactured.

### E-04 — Restate vs Patch Head-to-Head
- **Format:** Parallel experiment (two live AI sessions)
- **What it teaches:** Restating is faster — not just better. The efficiency gap is the argument.
- **What it contains:** The learner picks a real task. Session A: they patch (three corrections max, best response they can get). Session B: they write a single restate using the full course toolkit and send it once. They compare the best patched response to the first restate response and judge which they'd actually use.
- **Non-negotiable design requirement:** The exercise must stay clean — an efficiency demonstration, not a diagnostic. Appending the Restate Builder's four diagnostic questions dilutes the conversion moment. A provided fallback task is required for learners without a personal example, because the efficiency comparison works even on a provided task.
- **Confirmed secondary:** The Restate Builder — the four diagnostic questions ("What did the AI do wrong? What did you actually need? What was the missing load-bearing fact? What constraint would have prevented it?") — shipped as a *separate* piece, not bolted onto the Head-to-Head. For learners who want to understand, not just convert.
- **Why alternatives were rejected:** The Correction Spiral Transcript is a recognition exercise, not a behaviour-change exercise. The Message Length Test is diagnostic, not transformative. The Spiral Signals Checklist is a near-reformatting of content already clear in the module (and is absorbed into the combined E-04/E-06 card — see section 3).

### E-05 — The Wrong Plan Exercise
- **Format:** Provided case with a plausible-but-subtle wrong step (guided analysis)
- **What it teaches:** Plans need reading, not rubber-stamping. The skill is catching a plausible wrong step, not rejecting an obvious one.
- **What it contains:** A fictional three-step plan for a realistic task (e.g. restructuring an onboarding document). One step is confidently wrong in a subtle way — proposing alphabetical organisation instead of user-journey order. The learner identifies the wrong step and writes Message 2 before seeing the correct version.
- **Non-negotiable design requirement:** The wrong step must be genuinely missable by a careful reader. Too obvious = no aha (learners feel patronised). Too subtle = frustration. The alphabetical-vs-journey error is the reference standard, but the case needs piloting with real learners before the difficulty calibration is confirmed. Two transfer questions ("what made that step look right at first? what would you check for in your own plans?") help generalisation.
- **Confirmed secondary:** The Plan Review Checklist. Explicit sequencing note: *the checklist only works after the Wrong Plan Exercise.* Given before, it's instruction. Given after, it's a framework grounded in experience — learners know what the checklist can miss because they nearly missed something themselves. Ship the exercise first, always.
- **Why alternatives were rejected:** The Plan Divergence Test is covered by the module's own exercise. The Plan-First Decision Rule is reformatting existing module content. The Single Adjustment Practice across five scenarios trades depth for breadth — for intermediate learners who can already skim, depth wins. The One-Message-Saved Calculator is solid for buy-in but doesn't build skill.

### E-06 — The Over-seeded vs Under-seeded Comparison
- **Format:** Live experiment (three short AI sessions)
- **What it teaches:** More context often produces a worse response. The AI doesn't need your journey — it needs your destination plus only the load-bearing facts.
- **What it contains:** Three re-seeds for the same task — Version A (everything from the previous conversation), Version B (just the task, no carry-forward), Version C (the three-part re-seed from the module). Compare first responses.
- **Non-negotiable design requirement:** The task selection must include a carry-forward decision that was made in the previous conversation and needs to survive. Without that, Version B and Version C are too similar and the comparison falls flat. Task-selection guidance must be explicit, not assumed. Version A must be written as genuinely over-seeded — instructions should encourage learners to really load it up. A provided fictional scenario with pre-drafted versions serves as a fallback.
- **Confirmed secondary:** The Re-seed Builder — specifically the Slot 2 decision prompt ("If you want to write two sentences here, you need to pick one. Which one changes the output if it's missing?"). Sequencing note: the comparison experiment comes first. You can't use the builder's discipline productively until you believe the one-sentence carry-forward is worth defending.
- **Why alternatives were rejected:** The Carry-Forward Triage is procedural and assumes the belief already exists. The Re-seed Quality Ladder is an analytical reading exercise rather than the empirical surprise the module needs. The Conversation Health Signals card is absorbed into the combined E-04/E-06 card.

### E-07 — The Card Stress Test
- **Format:** Guided usability exercise (90 seconds, one adjacent task)
- **What it teaches:** A reference card you have to read is not a reference card. It has to be scannable.
- **What it contains:** After the learner writes their reference card, they face a deliberately adjacent task — not one of their three templates, but a variation. They have 90 seconds to adapt a template and send a prompt, without leaving the card to look up module content. Then they answer: what was missing? what was too wordy?
- **Non-negotiable design requirement:** The timer must be framed as diagnostic, not evaluative. The instruction must say: "This shows you what to fix. If you can't find what you need in 90 seconds, the card needs editing, not your memory." Offer 2 minutes for learners with lower confidence if needed — the point is pressure, not speed.
- **Confirmed secondary:** (1) The 30-Day Update Protocol — in an ongoing practice frame, not the primary pack. (2) The Peer Card Scan — asking a colleague to find the template for one of your tasks. Optional/cohort-only; addresses the durability problem at the right level (usability by someone other than the author is the most honest measure) but requires conditions solo learners won't meet.
- **Why alternatives were rejected:** The Reference Card Skeleton removes friction the module doesn't have. The Principle Paraphrase Audit tests understanding, not usability — valuable but not the module's bottleneck. The Reference Card Review asks learners to evaluate the card calmly; using it under pressure is more revealing. The Principle Rewrite exercise may belong earlier in the track, not at E-07.

---

## 3. The Combined E-04/E-06 Reference Card

**Name:** Conversation Health Reference Card
**Format:** Single page, two-zone reference card (scannable, printable, pasteable)
**Owned by:** Neither module — infrastructure, cross-linked from E-04 and E-06.

**Why combined:** In real use, a learner mid-session who feels "something is going wrong" often can't tell which state they're in. "My messages are getting longer" sits on both lists. Shipping two separate cards forces learners to remember which module covers which state. One card with a tie-breaker solves the real-use problem.

**Structure — two visually distinct zones:**

- **Zone 1: "Conversation is fighting you" (spiral signals)**
  - Three to four signals: more than two corrections without improvement; the AI keeps returning to something you already corrected; your messages are getting longer as you try to explain; you're working around earlier mistakes rather than fixing them.
  - Action line: *Stop. Write a new brief from scratch.*

- **Zone 2: "Conversation has run its course" (migration / re-seed signals)**
  - Three to four signals: the task has shifted into something different; responses feel generic rather than specific; the task you came for is done and you want to start another; context from early in the thread is decaying.
  - Action line: *Start a new conversation. Use the three-part re-seed.*

- **Tie-breaker line (single line at the bottom):** *Seeing both? Treat it as migration — re-seed wins.*

**Non-negotiable design requirement:** Scannable. One card, not two. No third list for the overlap case. Resist the urge to add nuance — the edge case gets one line, not its own section. Each zone shows three or four signals maximum. Adding a fifth signal trades scannability for completeness, and scannability wins.

**Which module it ships with:** Listed as supplementary to both E-04 and E-06. Owned structurally by neither. Introduced in whichever module the learner reaches first; re-surfaced in the other.

---

## 4. Sequencing Dependencies

E-track supplementary content has more sequencing sensitivity than B-track. Three dependencies must be respected in production and in the learner path:

**E-05: Plan Review Checklist only works after the Wrong Plan Exercise.** Given before, it's a checklist — instruction to scan for specific things. Learners who run through it conscientiously can still approve the alphabetical-vs-journey error because the questions don't catch that kind of mistake. Given after, learners know from personal experience that checklists can miss plausible wrong steps; the four questions become a framework they work with rather than a test they pass. Do not ship the checklist standalone or ahead of the exercise. In the learner path, the Wrong Plan Exercise appears first; the checklist is explicitly offered as "now that you've seen what a checklist can miss, here's a scanning tool to carry forward."

**E-01: Predict-Then-Send is a post-Autopsy extension, not a companion.** The Autopsy creates the surprise; Predict-Then-Send deepens the forecasting habit after the surprise has landed. Running Predict-Then-Send before the Autopsy asks learners to model AI decision-making they haven't observed — it becomes abstract. Sequence explicitly: Autopsy, then (later, optionally) Predict-Then-Send. Do not present them as a pair.

**E-02: The Constraint Vocabulary Card is ongoing, not bundled with the Negative Space Rewrite.** The Rewrite is a one-time insight exercise — do it once, protective instinct installs, move on. The card is a tool reached for every time a constrained prompt is written. The card's real value is in the gap between sessions, not in the session where the Rewrite happens. Shipping them as a bundle implies bundled use. Ship them separately; cross-link from E-02 but give the card its own identity.

**What this means for production:** The pack is not a flat list of pieces. It has an order of appearance within each module and in some cases (E-01, E-02) across time. Production should build the primary pieces first; secondary pieces should not be built or deployed without the corresponding primary piece in place.

**What this means for learner direction:** The pack should not be presented as "here are all the supplementary materials, use whichever." Direct learners through the primary piece per module; surface secondary pieces only after primary completion, or at the appropriate later moment (vocabulary card between sessions; Predict-Then-Send as a post-Autopsy extension).

---

## 5. Rejected Ideas Worth Revisiting

- **E-01: The Permission Dial / Verb Spectrum Card** — rejected because it duplicates the existing verb reference page. Would be revisitable if the existing reference page is a flat list and a spatial/spectrum rendering genuinely adds a different affordance. Audit `/course/reference/verbs` before dismissing permanently.
- **E-02: The Collateral Damage Audit** — rejected because it works in the forward direction the module is trying to reverse. Would be revisitable as a post-send review tool *after* the Negative Space Rewrite has installed the protective instinct — at which point the categorisation step has somewhere to land.
- **E-03: Context Swap** — rejected because alternative contexts can feel manufactured. Would be revisitable if paired with a concrete pair of contexts the learner actually straddles (same learner writing for two audiences).
- **E-04: The Correction Spiral Transcript** — rejected in favour of the efficiency-demonstrating Head-to-Head. Would be revisitable as a low-effort recognition warm-up for learners who can't run two live sessions and need a lower-friction entry point.
- **E-04: Message Length Test** — rejected because diagnostic, not transformative. Would be revisitable as a free-standing one-minute habit audit in a "tools for the plateau" add-on pack.
- **E-05: The One-Message-Saved Calculator** — rejected because doesn't build skill. Would be revisitable as a pre-module motivation piece if engagement data shows learners don't see the pattern as worth their time.
- **E-05: Single Adjustment Practice (five scenarios)** — rejected because breadth beats depth only for beginners. Would be revisitable as practice content for learners who have done the Wrong Plan Exercise and want more reps.
- **E-07: Principle Rewrite Exercise (plain/practical/personal registers)** — rejected at E-07 because it may belong earlier. Worth considering as a mid-track supplement (possibly E-04 or E-05) where learners are still forming their own language and the three-register model could genuinely reshape how they paraphrase.
- **E-07: 30-Day Update Protocol** — rejected from the primary pack because durability belongs to course structure (see section 6). Would be revisitable as part of a post-course practice kit.

---

## 6. The E-07 Ceiling

Both agents agreed: the durability problem for the reference card — making it last beyond the course — cannot be solved by supplementary content. It belongs to course structure.

**What the ceiling is:** Supplementary content can ensure the card is high-quality on the day it is built. It can test usability (stress test), test understanding (paraphrase audit), test durability (30-day protocol). But none of these can make a learner *return to the card after the course ends.* The learner has no structural reason to come back. Content that assumes return traffic it cannot produce is content that gets built and ignored.

**Why the ceiling is appropriate:** The course should end. The reference card is how it continues. If the card needs external scaffolding to stay alive, it isn't the right artefact; if the card is the right artefact, it lives on its own through being useful in the learner's work. Supplementary content that tries to solve the durability problem through more exercises is adding scaffolding that shouldn't be necessary.

**What the course structure solution would need to look like:**

- **Re-entry points.** Scheduled moments (email, calendar prompt, course-emitted nudge) that bring learners back to the card at 30, 60, 90 days — not to do a new exercise, but to update what they have. Owned by the course delivery mechanism, not the supplementary pack.
- **Reminders tied to use, not time.** A lightweight signal that fires when a learner's prompts show signs of not using the patterns — "you haven't used the plan-first pattern this month; is it missing from your card?" Requires product telemetry.
- **Peer card scans in cohort contexts.** Where the course is delivered in cohorts or through Substack subscription with paired learners, the Peer Card Scan (listed as E-07 secondary) becomes structurally possible and is the most honest usability test available. Outside cohort contexts, it fails.

The Card Stress Test is the primary supplementary piece and it earns its place. It closes the feedback loop while the learner is still in the course and can act on what it finds. The durability problem past that point is not supplementary content's to solve.

---

## 7. Suggested Execution Order

Build in this order. Reasoning follows each piece.

1. **E-04/E-06 Conversation Health Reference Card.** Infrastructure, not module-owned. Shipping this first forces the zone/tie-breaker structure to be locked before either module's primary piece is written, which prevents the format proliferation problem that triggered the combination. Low build cost; high cross-module value.

2. **E-01 Verb Autopsy.** Low build cost (document template, facilitator notes). No sequencing dependencies to lock — ships cleanly. Gets the clearest exemplar of the "learner's own text" pattern into production early, which establishes the design standard for later pieces.

3. **E-02 Negative Space Rewrite.** Low-to-medium build cost. The one production consideration is the worked example showing someone else's protection list — it needs to be realistic enough that low-confidence writers can model from it. Ship without the vocabulary card; the card ships later as a standalone.

4. **E-03 Load-Bearing Test Live.** Medium build cost — the worked example of a wrong prediction is the critical piece and needs care. Framing being wrong as expected is a writing problem, not a structural one, but it takes iteration.

5. **E-06 Over-seeded vs Under-seeded Comparison.** Medium build cost. Requires task-selection guidance to be written carefully — learners who pick a task without a real carry-forward decision will find the comparison flat. A provided fictional scenario with three pre-drafted versions is needed as a fallback.

6. **E-04 Restate vs Patch Head-to-Head.** Medium build cost. Requires a provided fallback task that is concrete, realistic, but not too domain-specific. Two-session format is higher-friction than single-session exercises — instructions need to be tight.

7. **E-05 Wrong Plan Exercise** *(requires sequencing decision to be locked first).* Highest production risk in the pack. The plausibility of the wrong step is the whole exercise. Must be piloted with real learners before finalising. Build this after the other primary pieces are in production and feedback is flowing, so the calibration can borrow from observed learner behaviour in adjacent modules.

8. **E-07 Card Stress Test.** Low build cost but must come after all other modules' primary pieces — the reference card being stress-tested includes material from all of them.

**Sequencing decisions to lock before building:**
- **E-05 (before building).** Confirm that the Wrong Plan Exercise ships first and the Plan Review Checklist is explicitly sequenced after. This decision shapes how the module's learner path is structured and affects how the checklist is framed in its own copy.
- **E-01 (before building).** Confirm that Predict-Then-Send is sequenced as a post-Autopsy extension, not a companion. This affects whether it's in the same deliverable as the Autopsy or a later artefact.

Secondary pieces (vocabulary card, constraint audit, context stripping, restate builder, plan review checklist, 30-day protocol, peer scan) are built in a second wave, after the primary pieces are deployed and learner feedback is available.

---

## 8. Cross-cutting Design Principles

Design decisions that apply across the whole pack and would be wrong to violate:

**Prediction before result.** Multiple modules (E-01, E-03, E-05, E-07) depend on the learner committing to a judgement before the reveal. This prevents recency bias, post-hoc rationalisation, and the "of course that's obvious" effect that destroys the aha. Wherever a comparison is happening, the learner must commit first.

**The reversal pattern.** E-02 (protect before prompt), E-05 (plan before execute), E-06 (triage before carry-forward) all teach the same meta-skill — reversing the natural order of thinking. The supplementary content must *enforce* the reversal, not describe it. Exercises that let learners work in the forward direction (send, then audit) undermine the module's core move.

**Aha-through-being-wrong.** The most memorable learning moment across the track is a failed prediction: the wrong plan missed, the over-seeded version producing worse output, the card too wordy to scan in 90 seconds. Provided worked examples should model wrong predictions and missed errors, not correct ones. Framing the failure as expected — "this is what being wrong looks like, this is what we want to happen" — protects learners from reading their failure as inadequacy.

**One-time calibrations vs ongoing tools.** These are different categories and should not be shipped in the same format. The Load-Bearing Test Live, the Wrong Plan Exercise, the Over-seeded vs Under-seeded Comparison, the Verb Autopsy, the Negative Space Rewrite, the Head-to-Head — all are one-time calibrations. Done once, deeply, they install a belief. The Conversation Health Card and the Constraint Vocabulary Card are ongoing tools — reached for in the moment, repeatedly. Format should signal the category: calibrations as exercises with clear endpoints; tools as scannable references that live in the gap between sessions.

**Why format consistency across modules would be a mistake.** The temptation — particularly visible in E1's brainstorm — is to produce a card plus a checklist plus an exercise for every module. That makes the pack its own course and reintroduces the cognitive load problem the tools were supposed to reduce. The deliberate asymmetry in this pack (the E-04/E-06 card is shared; only two modules get reusable reference tools; most modules get a single exercise) is correct. Each module's primary piece is shaped by what that module actually needs, not by pack-level format templating. Consistency at the format level would produce consistency at the insight level — which would flatten exactly the variation the E-track depends on.

---

*End of brief.*
