# Linguist v1 Audit — Foundation for v2
*Date: 2026-04-15*

---

## What Was Built

Linguist v1 is a self-paced web course delivered at `/course/`, with a pre-course recognition experience at `/see/` and a profile-picker onramp at `/start/`. The course is 27 modules in three tracks, sequenced linearly with pagination:

- **B-track (Beginner) — 10 modules, B-01 to B-10.** From "send your first message" through to "write a four-part Opening Seed (Role, Task, Context, Done)." Platform-agnostic across Claude, ChatGPT, Gemini, and (as a pointer) Claude Code.
- **E-track (Enabled User) — 7 modules, E-01 to E-07.** Deepens message craft: verb choice and blast radius, constraint front-loading, the load-bearing test for context, restate vs. patch, plan-before-execute, re-seed, personal reference card.
- **A-track (Advanced Practitioner) — 10 modules, A-00 to A-09.** Claude Code only. Installation, mental model, tokens and cost, `CLAUDE.md`, session hygiene, compaction, plan mode, tool fluency, agent delegation and the 5-part brief, capstone.

A planned **X-track (Builder)** for Workbench/API exists on paper (05-content-specifications.md) but was never built. The course stops at A-09.

**Teaching method.** Every exercise follows **Copy → Personalise → Use**: the learner is given a template with bracketed placeholders, explicitly taught that editing is the skill, and guided through substituting their own content before sending. B-02 is the module that installs the pattern; every later module leans on it.

**Platform orientation.** B-01 has an inline platform picker (`<details>`/`<summary>`) directly above the first exercise, with per-platform first-message instructions (where to type, how to send, how to start fresh). B-03 is a separate reference module for deeper navigation (sidebar, history, settings, where persistent instructions live). B-09 handles the actual persistent-instruction setup across Claude Projects, ChatGPT Custom Instructions, and Gemini Gems.

**Progress system.** `progress.js` tracks completion in localStorage, with a Supabase backup keyed off an optional email address (captured at stage ends). Stage-end prompts invite the email with a soft ask ("we'll bookmark where you are"). An "Already done this" button lets learners skip forward. No auth gate; anonymous completion is the default.

**Profile / quiz system.** `/see/` is a 5-screen recognition experience (Intro, See, Try, Know, Done) with a 5-question human-mode-vs-machine-mode quiz. Learners who land on `/start/` pick one of three profiles (newrole, etc.) which sets a `profile-*` class on `<html>` and switches in profile-specific copy blocks inside modules (e.g. the `data-profile="newrole"` block in B-01). Selecting a profile surfaces a "recommended starting module" card on `/course/`.

**What a learner actually encounters, start to finish.** Homepage → CTA → `/see/` (6–8 min recognition experience with a quiz and emotional decompression: "go be human") → `/start/` (pick a profile) → `/course/` (stage list, Beginner open by default) → module-by-module pagination from B-01 through A-09. Each module page has: eyebrow, objective, intro, "what is happening" / concept, a Copy-Personalise-Use exercise (usually with a Without/With comparison), "what good looks like," an "if this did not work" recovery block, and a "next" pointer. Take-home artefacts (template cards, checklists, verb reference, re-seed template, personal reference card) accumulate across the track.

---

## What It Became vs What It Set Out To Be

### The original intent

From `LINGUIST_BUILD_CONTEXT.md` and the project memory, v1 set out to be:

- **A communication course, not a prompt engineering course.** The `01-claude-code-synthesis.md` document is explicit: "Never frame as 'prompt engineering.' Always frame as 'how to say what you mean to a machine.'"
- **Built on a single load-bearing insight:** humans and machines are different; notice which mode you are in and communicate accordingly. The `/see/` experience is the purest expression of this — two absurdities, one skill.
- **For a low-general-tech-confidence audience** — not just low AI knowledge. Parents, carers, teachers, retirees, small business owners. Permission-giving in tone. "The machine will wait. It does not mind. Go be human."
- **Organised around two modes: Human Mode (warm, messy, exploratory) and Machine Mode (precise, structured, direct).** The `/see/` quiz tests recognition of the two modes as the entry skill.

### What it drifted toward

The three agent reviews (cognitive-load, knowledge-path, mode-integration) converge on the same finding: **the course teaches one mode well and the other mode not at all**.

- Every template from B-02 onward, every stopping condition (B-06), every safe verb (B-02/E-01), every constraint (E-02), every Opening Seed (B-10), every re-seed (E-06), every CLAUDE.md (A-03), every 5-part brief (A-08) is an instrument of **Machine Mode**. The course is a carefully sequenced masterclass in precision dispatch.
- Human Mode appears **once** in the entire course — in B-09's "If this did not work" section, as an optional second project the learner can set up if they want to try "warmer, more conversational, less structured" instructions. That is the totality of Human Mode's presence across 27 modules.
- Agent 1 (cognitive-load) reads the cumulative effect as **optimisation creep**: by B-06 the learner is running a pre-send mental checklist (role, task, verb, context, stopping condition, constraint) and is being told — eight times by B-10 — that vagueness is a failure mode. The permission-giving tone of `/see/` is not sustained once exercises begin.
- Agent 3 (mode-integration) identifies this as the course's central structural contradiction: the founding frame (two modes, notice which one you're in) is **latent everywhere and named nowhere**.

### The stated philosophy vs the actual learning experience

| Stated in v1 design docs | What the built course actually does |
|---|---|
| "Not a prompt engineering course." | Teaches prompt engineering with different vocabulary: verb ceilings, blast radius, load-bearing context, constraint slots, stopping conditions, 5-part briefs. |
| "Human Mode and Machine Mode, each valid, each appropriate for different moments." | Teaches Machine Mode for 26 modules. Mentions Human Mode once, in a troubleshooting callout. |
| "Permission-giving. The machine does not mind. You are already enough." | `/see/` holds this tone. From B-02 onward, every module adds a new standing obligation (review checklist, recovery protocol, load-bearing audit, re-seed discipline). The B-track produces an anxious optimiser, not a calm mode-switcher. |
| "Context is fuel." (beginner framing) | True in the B- and E-tracks. A-04 contradicts it ("context is finite and degrades") without the learner being given a bridge between the two framings. |
| "Scenario-first, situation-specific." | The course is abstract instruction. Learners are told to "use a real task from your work this week" in a generic template — but the course does not put the learner inside a specific named scenario where the technique is the only thing that could have saved them. |

---

## What Works

Carry these into v2 deliberately.

1. **The `/see/` experience.** The single strongest piece of content in v1. Recognition-first, no AI interaction required, emotionally calibrated, completable in under 10 minutes. The two absurdities are memorable. This is the one thing that should be preserved almost exactly.

2. **Copy → Personalise → Use as a pedagogical pattern.** Teaching prompt editing as a distinct skill (not assuming learners will "figure out" bracket-fill) is one of the genuinely original design choices in v1. It is also the only way the templates land for a nervous beginner. B-02 is a load-bearing module — it should survive, possibly reshaped.

3. **B-01's platform picker and its register.** The inline `<details>` picker directly above the exercise, the "If it asks you to upgrade" section, the "A note on data" paragraph, the explicit reassurance that "every conversation is slightly different." This is high-quality accessible writing for the audience. The picker pattern should be kept.

4. **The verb taxonomy (E-01) and the "blast radius" concept.** Both reviews and both gap-analyses flag this as the highest-leverage single artefact in the course. The idea that the first word is a grant of authority — that "improve" delegates judgement while "rewrite under 150 words, don't change the opening" does not — is the most operationally useful thing v1 teaches.

5. **The load-bearing test (E-03).** "If I removed this piece of context, would the output change in a way that matters?" is a genuinely transferable thinking tool. It survives the collapse of the Machine Mode frame because it is a test of relevance, not of compliance.

6. **B-10's Opening Seed as a synthesis artefact.** The four slots (Role, Task, Context, Done) are the right shape for a take-home card. The module reads as a capstone for stage 1 in the right way — the "Ten modules down" stage-end moment is the one genuine resting point in the B-track.

7. **A-track's compaction content (A-04/A-05).** Genuinely novel material. Most AI courses do not teach writing-for-compaction, context rot symptoms, or manual checkpointing. This is durable builder knowledge.

8. **A-08's agent delegation and the 5-part brief.** The 3-question delegation test and "never delegate understanding" principle are the sharpest articulation of the Human/Machine distinction anywhere in the course — they are just in the wrong place (module 26 of 27) and not connected back to the founding frame.

9. **The knowledge-map discipline (07-knowledge-map.md).** The seven load-bearing concepts and the stacking tables are a real operational tool. Keep the discipline. The map itself needs updating (see Agent 2's finding on the A-01/A-02 swap), but the methodology is right.

10. **The supplementary-pack design thinking (template-packs/).** The B-pack's "cards beat pages," "pre-send beats post-send," "permissions before instructions," and "name the fear, do not manage it" principles, and the E-pack's "prediction before result" and "aha arrives through being wrong" principles. These are the best articulation anywhere in the v1 workings of what teaching this audience actually requires. They were designed but not yet built — v2 should build them.

---

## What Is Structurally Broken

### 1. The Human Mode / Machine Mode disconnect

The founding frame is absent from the course that claims it. `/see/` teaches the recognition; the course teaches one of the two things being recognised, without naming which one. A learner completes v1 and is better at Machine Mode — but has never been told they are in Machine Mode, that Machine Mode is a choice, or that there is a different mode for different kinds of work.

The practical consequence (Agent 1): learners develop Machine Mode reflexes and apply them to tasks that call for exploration. They write tight Opening Seeds for questions they haven't thought through yet. They front-load constraints on problems they don't yet understand. They optimise in moments that call for thinking-aloud. The course has taught them that precision is the goal, when the founding frame says precision is one of two goals.

The practical consequence (Agent 3): every module contains a latent Human Mode moment that is never named. B-02's "guess and send." B-07's "read the whole response and decide." B-08's vague "Help me write something" (presented as what-not-to-do rather than as a legitimate starting state). A-08's "never delegate understanding." These are Human Mode exhibits scattered across the course with no frame to hang them on.

### 2. The commercial / philosophical misalignment

v1 is priced as a paywalled Substack-adjacent product. The target audience is described (in the project memory) as parents, carers, volunteers, teachers, retirees, small business owners — people with low general tech confidence. The delivery mechanism is a self-paced web course with 27 linear modules.

The misalignment: **the audience described does not self-teach 27 modules.** The audience described reaches for a reference card mid-task. The audience described watches one short video, tries one thing, and comes back when something broke. The audience described is motivated by "I have a specific thing I'm trying to do and it keeps going wrong," not by "I want to get better at AI literacy in general."

The course the built course most resembles — in shape, tone, and pacing — is a course for someone who has already decided AI is worth learning systematically. That person exists and is a legitimate market. But it is not the person the docs describe, and it is not obviously the person paying for a Substack subscription either. **v1 has a buyer problem, not a teaching problem.** See "The Honest Commercial Question" below.

### 3. The "too ready" problem

The course is abstract instruction dressed up as practice. Every exercise says "use something real from your work this week," which sounds scenario-first but is actually the opposite: it puts the burden of scenario-construction on the learner and assumes they always have a task ready, a voice calibration in mind, a definition of done already formed.

Agent 1's finding across B-04, B-05, B-07, B-10: **the exercises require the learner to already know what they want.** This is the most-cited friction point across all three mode-review documents. A learner who has arrived at the course because they don't know what they want — which is most of the target audience — is implicitly doing the modules wrong.

A scenario-first course would look different. It would put the learner inside a specific named situation — "you are a school governor and the head has just sent you a three-page document about SEND provision; you have fifteen minutes before the meeting" — and teach one technique as the thing that saves that specific moment. v1 has no modules of this shape. Every module is a technique looking for a scenario, not a scenario producing a technique.

### 4. The profile system: attempted personalisation that fell short

The `profile-*` system on `/start/` and `/course/` was designed to adapt content to three learner types. In practice:

- It switches in a single profile context paragraph per module (the `data-profile="newrole"` block in B-01 is the representative example) and a recommended-starting-module card on the course index.
- It does not change the exercises, the verbs, the examples, the pacing, the tone, or the prerequisites.
- A learner completing the course as a "newrole" profile and a learner completing it as a different profile have had functionally identical experiences, with cosmetically different intro paragraphs.
- The profile is never referenced again after the first few modules.

The intent was adaptive pathways. The delivery is a cosmetic layer. The profile system creates the impression of personalisation without providing it, and in the cognitive-load reviewer's view this is worse than no profile system — it raises an expectation the course cannot meet.

### 5. The B → E → A transitions: thin connective tissue

**B → E is the strongest transition** (Agent 2). B-10's Opening Seed explicitly collects the B-track into a named artefact, and E-01 names the B-08/B-09 prerequisites. The technical handoff works. What it misses is the motivational handoff: E-01's eyebrow ("You can use AI. Now learn to control it.") frames Stage 2 as more-of-the-same-but-harder rather than as a different kind of mastery. Without the Machine Mode frame, there is no language for what Stage 2 actually is.

**E → A is the weakest transition** (Agent 2). E-07 closes Stage 2 with "The machine will wait. It does not mind. Go do the work." A-00 opens with "From conversation to command line." Nothing in between explains *why* a person who can use chat well would accept the friction of a terminal, API billing, and a permission model for tool calls. The shift is environmental (new tool) when it is actually motivational (new capability category: the AI can now act, not just produce text). Learners who would genuinely benefit from A-track are dropping off here because the course has not given them a reason to continue.

**The "Already done this" bypass compounds the problem.** A learner can skip B-08 and B-09 (the two most load-bearing late-B modules) and still reach E-01. The E-01 readiness statement is a notice, not a gate. E-track exercises are calibrated for learners with standing instructions active; learners who skipped B-09 experience noisier output and attribute the noise to their prompt craft rather than to a missing prerequisite.

### 6. The course teaches techniques but not the meta-skill of knowing which technique to reach for

This is the deepest structural problem. v1 builds up twenty-ish named techniques (Copy-Personalise-Use, opening seed, stopping condition, safe verb, risky verb, constraint, load-bearing test, restate, re-seed, plan-first, CLAUDE.md, session hygiene, checkpoint, tool fluency, 5-part brief, etc.) and asks the learner to memorise the E-07 reference card as a personal synthesis.

But in real use, the question is not "do I remember the technique?" It is "which of these twenty techniques is the one I need right now?"

The course never teaches the diagnostic layer. There is no module on "here is the state you are in; here are the three techniques that could apply; here is how to tell which one." The E-pack design thinking (the combined Conversation Health Reference Card that collapses E-04 and E-06 into a single two-zone card with a tie-breaker) is the only place in the v1 workings that begins to address this — and it is supplementary content that was designed but not built.

Without the meta-skill, the techniques collapse into a grab-bag. The learner knows what each one does but not when to use each one. When something goes wrong mid-session, they either reach for the wrong technique or reach for none at all.

---

## The Philosophy That Emerged

By the end of the v1 build, a coherent philosophy had crystallised that the course itself does not fully express:

> **When thinking, use AI to expand your ideas. When you're ready to implement, switch to precision.**

This is the Human Mode / Machine Mode distinction restated as a workflow. It is an honest statement of what the two modes are *for* — Human Mode is for the cognitive state of not-yet-knowing; Machine Mode is for the cognitive state of knowing-enough-to-instruct. The skill is knowing which state you're in and having the discipline to switch deliberately.

### Where the philosophy was alive but unnamed

- **B-02's "guess and send."** A permission to start in not-knowing. Alive, unnamed.
- **B-04's Version A vs Version B comparison.** Structurally an exploratory-vs-precise comparison. Framed as a bad-vs-good comparison.
- **B-07's "the first response is a draft."** Names the iterative relationship but doesn't connect it to the mode the learner is in when drafting vs. when executing.
- **B-08's restate exercise.** The learner physically moves from Human Mode ("Help me write something") through failure to Machine Mode (a precise restate). The arc is the transition. The course calls it a correction technique.
- **E-05's two-message pattern (plan then execute).** Structurally the clearest transition moment in the entire course. Message 1 is Human Mode input ("what would you do?"). Message 2 is Machine Mode output ("go ahead"). Presented as a technique for avoiding mid-task corrections.
- **A-08's "never delegate understanding."** The highest-stakes articulation of Human Mode in the course. Buried in module 26 of 27.

### Where the philosophy was absent entirely

- **The curriculum gradient** (04-curriculum-gradient.md) sequences techniques by complexity, not by the mode-state they address. There is no version of this gradient organised around "what state is the learner in."
- **The reference card (E-07)** has slots for three principles and three templates. It has no slot for "when I work differently." A learner who completes E-07 has no structural place to record the Human Mode half of their practice.
- **The A-track entry (A-00 / A-01).** A-00 is a tool introduction. A-01 is a mental model. Neither names what the A-track is *for* in mode terms (Claude Code as a Machine-Mode environment with precision turned all the way up, suitable when you already know the job).
- **The commercial framing.** "AI literacy," "enabled user," "advanced practitioner." These are skill-level labels. None of them name the cognitive state the course is actually teaching the learner to manage.

---

## What v2 Must Not Inherit

1. **The 27-module linear syllabus as the primary delivery shape.** A linear course for an audience that does not self-teach linearly is the wrong container. v2 should experiment with scenario-first, situation-specific units that can be entered in any order from the specific moment of felt need.

2. **Machine Mode as the default unnamed mode.** If v2 keeps the two-mode frame (it should), it must name both modes from the first contact after `/see/`, and every technique must be labelled with which mode it belongs to. The fix is not "add a Human Mode module" — it is "label everything."

3. **"Use a real task from your work this week" as the exercise prompt.** This is abstract instruction pretending to be scenario practice. v2 should supply the scenario, or use the learner's actual stuck moment as the entry (see "commercial" section).

4. **The profile system as implemented.** Three cosmetic profiles switching one paragraph per module is personalisation theatre. Either commit to real branching (different exercises, different examples, different pacing) or drop the profile layer entirely and use a single well-calibrated voice.

5. **The "Already done this" button as a gate bypass.** Self-directed skip-ahead is appropriate for experienced users; for the stated audience it is a way to skip prerequisites and arrive underprepared at the next stage. v2 should either verify readiness genuinely or remove the bypass.

6. **The implicit "you already know what you want" assumption.** Every B-track exercise from B-02 onward assumes the learner has a task, a voice, a definition of done, an audience in mind. v2 must explicitly make room for the "I don't know what I want yet" state as a legitimate starting point, not a failure mode.

7. **Reference cards and checklists as ongoing obligations.** v1 accumulates standing protocols (B-07's "use this after every response"), which work against the permission-giving tone. v2 should distinguish between tools-to-reach-for-when-something-feels-wrong and ongoing-mandatory-reviews, and default to the former.

8. **A-track as the default "advanced" destination.** A-track is Claude Code only. It is a specific tool choice, not a universal progression. v2 should not present A-track as the obvious next step after E-07 — for most of the stated audience, it is the wrong next step entirely.

9. **The X-track as a future aspiration.** The Builder track was specified (05-content-specifications.md) but never built. If v2 has a builder component, it should be built or dropped; leaving it as a stubbed future direction adds scope confusion.

10. **"AI literacy" as the product category.** This framing attracts buyers who want to improve at AI generally. The stated audience does not want that; they want specific, moment-of-need help. v2 should be honest about which product category it is in.

---

## The Honest Commercial Question

### Who paid for (or would pay for) v1?

Based on the built shape, v1 is most likely to be bought by:

- Curious professionals who have heard "you should learn AI" enough times that a self-paced structured course feels like the answer.
- Substack subscribers who are buying access to Vuelo Labs' thinking generally, of which the course is one artefact.
- People who have tried AI, hit the wall described in `/see/` ("I don't know how to talk to this thing"), and are looking for an explanation and a method.

Who almost certainly does not pay for v1 as built:

- The low-general-tech-confidence audience described in the project memory. They do not buy 27-module courses. They do not finish 27-module courses. They buy one-page cheat sheets, watch 6-minute videos, and pay for outcomes rather than curricula.
- Power users who already write decent prompts. For them v1 is too slow and too permission-giving.
- Builders/developers. They go straight to Anthropic docs, `claude-code`, or community Discord servers.

### Who *should* pay for v2?

This is the question v2 has to answer first, before any content decision. Three plausible directions, each implying a different product:

1. **The stuck professional.** Someone mid-task, mid-frustration, who needs a specific intervention for a specific situation right now. Product shape: a searchable library of scenario-first micro-lessons, plus a mode-recognition tool that tells them which technique to reach for. Delivery: web + email + possibly embedded in tools. Price: low monthly or one-time, justified by time saved on a specific task. This is the product that matches the stated audience.

2. **The team lead introducing AI to a team.** Someone who needs to bring 8–15 people with varying tech confidence up to a shared baseline of competent, non-optimiser AI use. Product shape: facilitated cohort course with the v1 content as the backbone, Vuelo Labs as the facilitator, and the mode frame as the organising principle. Delivery: live + async. Price: team-level contract. This is a genuine product; the v1 content is closer to ready than it is for any other buyer.

3. **The Vuelo Labs audience itself.** Substack readers who want to see Vuelo Labs' thinking and method. Product shape: less a course than a serialised practice — essays, live examples, one technique at a time over weeks. Delivery: Substack + periodic live sessions. Price: subscription. This is the lowest-effort product and the one most aligned with the "Substack documents real Vuelo Labs work in progress" memory note.

### Is the self-teaching course format the right delivery mechanism?

For the stated audience: **no.** A nervous low-tech-confidence learner does not complete a 27-module course in the privacy of their own browser. They start, stall, feel worse, and stop. The delivery mechanism selects for learners unlike the stated audience.

For the team-lead audience: **partially.** The content is the right content; the delivery needs a facilitator layer.

For the Substack audience: **no, for a different reason.** That audience wants Vuelo Labs' ongoing thinking, not a completed artefact. Freezing a 27-module course and selling it once is the wrong shape for a subscription product.

### The honest answer

v1 is a real body of work with a genuinely coherent philosophy underneath it. It is also, as built, a product in search of a buyer. **v2's first decision is not content. It is: which audience, which delivery, which price.** Every structural decision flows from that choice. The v1 content is re-usable material for at least three plausible v2 products, but it cannot be all three at once, and it cannot be none of them.

The cleanest-eyed read is that v1 was Liam's way of thinking through what the teaching would have to contain. It succeeded at that. The body of working documents (the content_design_workings directory, the three agent reviews, the template packs, the knowledge map) is arguably the most valuable artefact v1 produced. v2 should treat v1 as the design research that earned the right to build the actual product — not as a draft product to be polished into the final one.
