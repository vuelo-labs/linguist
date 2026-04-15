# Agent 2 — Knowledge Path and Sequencing Review
*Lens: does the course build genuine capability in the right order?*
*Date: 2026-04-15*

---

## Methodology note

All 27 modules were read in full, alongside the knowledge map (07-knowledge-map.md). Where the knowledge map's stacking tables describe module content that differs from the actual HTML, the HTML is treated as authoritative. One significant discrepancy is noted below.

---

## B-track: sequencing assessment and dependency gaps

### What the track does well

The B-track builds cleanly from B-01 through B-06. Each module introduces a single mechanism and the next module assumes it. The progression from "send a message" (B-01) to "take a template and personalise it" (B-02) to "detail in = detail out" (B-04) to "one thing at a time" (B-05) to "tell it when to stop" (B-06) is genuinely sequential — each module creates a gap that the next module fills. A learner who does this in order will arrive at B-06 already experiencing the problem that stopping conditions solve.

### Where the track has dependency gaps

**B-03 interrupts a momentum arc.** The linear chain in the actual navigation is B-01 → B-02 → B-04 (B-02's "Next" link skips to B-04) → B-05 → B-06 → B-07 → B-08 → B-09 → B-03 → B-10. B-03 has been moved to after B-09 in the live navigation — but its content still introduces platform features (Projects, Custom Instructions, Gems) with forward references to B-09 before the learner has reached B-09. More importantly, B-03's "Next" link points to B-10, and B-09's "Next" link points to B-03, forming a B-09 → B-03 → B-10 tail. This is coherent navigation, but the knowledge map dependency graph still shows B-03 as an early branch (between B-02 and B-04), creating a mismatch between the documented structure and the live structure. Readers of the knowledge map will misread the dependency chain.

**B-04 uses stopping conditions before they exist.** B-04's Version B template includes `[length — e.g. 100 words / 5 bullet points]` and explicitly says "If Version B came back very long despite the length you specified, that is worth noting — B-06 teaches you how to set a stopping condition that the AI is more likely to follow." This is a graceful forward reference — it uses the mechanism, labels it as incomplete, and defers. But it means learners are practising a concept in B-04 and B-05 that will only be properly grounded two modules later. Some learners will internalise a wrong mental model (stopping conditions are hints, not instructions) if they get compliance in B-04 and assume they already understand the concept.

**B-09 introduces "Machine Mode" without naming or explaining the alternative.** B-09's CPU template is explicitly labelled a "Machine Mode persistent instruction template," and the module ends with: "If you want to try Human Mode instructions as well — warmer, more conversational, less structured — that is a good next step." This is the only mention of Human Mode in the entire B-track. It appears in an "If this did not work" section as an option for a second project, without any explanation of what Human Mode is, why it exists, or what it enables. The learner has spent nine modules practising a mode they have never been told they are in. At the moment the course comes closest to naming the distinction, it treats it as a setup detail rather than a foundational frame.

**The verb gap (B-02 to E-01) is a real dependency problem, not just a gap.** B-02 introduces four starter verbs (summarise, explain, draft, list) with the note "Stick to these four for now — they have a clear ceiling. You will learn the full set of safe verbs in B-05." But B-05 does not teach the full set — it just reuses the same four. The promise is not fulfilled until E-01, eight modules later. Between B-02 and E-01, learners are writing prompts with verbs they have been told are incomplete, with no guidance on which verbs are risky. In practice, most beginners reach beyond the four safe verbs — "improve this," "help me with," "make this better" — and nothing in the B-track flags those choices as problematic. The result is that a significant category of errors (risky-verb scope creep) goes undiagnosed for the entire beginner stage.

### Implicit dependency that is never named

B-07's output review checklist asks learners to notice when a response is "generic where it should be specific." This requires the learner to have a model of what specificity means in AI output — which is implicitly the concept of context as fuel (formalised only in E-03). Learners can use the checklist mechanically without understanding why outputs are generic. That is fine for B-track, but it means the checklist creates a habit without creating the understanding that would make the habit generative.

---

## E-track: sequencing assessment and dependency gaps

### What the track does well

The E-track's three-module core (E-01, E-02, E-03) builds cleanly. Verb choice sets the scope of what the AI does. Constraints set the boundaries of what it leaves alone. Context determines whether both of those produce a specific or generic result. Each module adds a dimension to a single problem: how do you get the AI to do exactly what you intended and nothing else. This is coherent.

E-04 through E-06 form an equally clean arc: what to do when prevention failed (restate, E-04), what to do before a multi-step task starts (plan first, E-05), and what to do when a conversation has run its course (re-seed, E-06). The sequencing is deliberate — reactive recovery (E-04) before proactive prevention (E-05) before lifecycle management (E-06).

E-07 is well-placed. The reference card exercise forces synthesis across everything the learner has built, and the instruction to "write it in your own words, not the course's words" is exactly the right test of whether concepts have been internalised rather than memorised.

### Where the track has dependency gaps

**E-01's readiness check is a statement, not a gate.** E-01 opens with: "Before starting this track, make sure you have completed B-08 (Recovery) and B-09 (Persistent Instructions)." This is the only gate between the B-track and E-track. The "Already done this" button allows any learner to skip B-08 and B-09, and the E-01 warning does not explain *why* these modules matter — only that they should be done. A learner who skips B-09 arrives at E-01 with no standing instructions active, meaning every E-track exercise will produce noisier output (preamble, unsolicited suggestions, default length) than the exercises were designed for. The practical effect of skipping B-09 is that E-track exercises are harder to interpret — the learner can't easily isolate whether their verb or constraint choice worked or whether the standing instructions are compensating.

**E-04 and B-08 cover overlapping ground without a clear conceptual distinction in execution.** The knowledge map correctly identifies this: B-08 is "here are three tools" and E-04 is "here is the diagnostic skill for choosing between them." But in practice, B-08's restate template and E-04's restate template are nearly identical (compare B-08's "I need to start this over. I'm a [role] and I need to [specific task]. [Stopping condition]. [Constraint]." with E-04's "Starting over. I'm a [role] working on [specific task]. I need you to [verb] [specific thing]. [One load-bearing fact]. [Stopping condition]. [Constraint]."). The distinction the knowledge map claims — B-08 teaches the tools, E-04 teaches the diagnostic skill — is mostly present in framing but barely present in exercise design. E-04 would land differently if its exercise required the learner to identify which of the three spiral signals they are seeing before deciding to restate. Right now both modules teach the same behaviour and the E-04 version is just slightly more detailed.

**E-03's load-bearing test is used in E-06 but never formally connected.** E-06's re-seed exercise says "which sentence, if removed, would change the output? Keep that one." This is a direct application of E-03's load-bearing test, but E-06 doesn't name it as such. The connection is implicit. A learner who has internalised E-03's vocabulary would recognise the test; a learner who completed E-03 but didn't absorb the phrase would not connect the two modules. This is a missed reinforcement opportunity rather than a sequencing error.

**The E-track never names what kind of AI use it is teaching.** Every E-track module refines the same fundamental mode: give the AI a precise instruction, constrain it tightly, evaluate the output, correct or restate. This is unambiguously Machine Mode. E-07 asks learners to build a personal reference card with their "three principles" and "three task templates" — but the reference card format has no slot for "when to use AI differently." There is no moment in the E-track where a learner is invited to ask whether the task in front of them calls for the precise, structured, execution-focused approach they have been building — or something looser, more exploratory. The E-track produces a skilled Machine Mode practitioner who has never been told Machine Mode is a choice rather than the only way to work.

---

## A-track: sequencing assessment and dependency gaps

### Critical discrepancy: knowledge map vs actual content

The knowledge map (07-knowledge-map.md) describes A-01 as "Tokens; billing; model tiers; 4 cost drivers; cost benchmarks; mental budget" and A-02 as the three-part mental model. The actual HTML files are the reverse: A-01 is the mental model (titled "Mental Model Refresher for Claude Code"), and A-02 is tokens and costs (titled "Cost, Tokens, and What Things Actually Cost"). The knowledge map's Open Sequencing Decision #6 ("Currently the cost model A-01 comes before the mental model A-02") describes a state that no longer exists in the files — the swap has been made in the HTML but not reflected in the knowledge map.

This matters for sequencing analysis because the knowledge map's dependency chains for A-01 and A-02 are now inverted. Any future work that uses the knowledge map to verify dependencies will be working from wrong data. The knowledge map's stacking table, dependency graph, and open decisions section all need to be updated to reflect that A-01 is now the mental model and A-02 is now the cost model.

The current live order (mental model first, then cost) is the right order. The mental model explains why context costs money, why vague requests trigger expensive tool chains, and why writing for compaction matters — all of which makes A-02's cost discussion legible. The old order had learners reading billing rates before they had a frame to understand what they were being billed for.

### Sequencing assessment (using actual content)

**A-01 to A-02 transition is correct but the conceptual handoff is abrupt.** A-01 introduces compaction as Part 2 of its three-part model: "As your session runs longer, earlier content gets compressed." This is sufficient as a concept. A-02 then teaches token costs and billing. But A-04, which is the first module to teach *how to manage* compaction (writing for it, checkpointing), comes after A-03 (CLAUDE.md). A learner who reads A-01 and A-02 has been told compaction exists and that sessions cost money, but has not yet been given any practical response to either. They are expected to set up CLAUDE.md (A-03) before they know how to manage the degradation problem that CLAUDE.md's standing instructions are partly designed to address.

**A-04 and A-05 sequencing problem is real and unresolved.** The knowledge map flags this as Open Decision #7. In the actual content: A-04 (Context Awareness and Compaction) covers what compaction preserves/loses, context rot symptoms, writing for compaction, and manual checkpointing. A-05 (Session Hygiene) covers scoping sessions, using `/clear`, and front-loading constraints. The current order (A-04 then A-05) is actually the *opposite* of what the knowledge map describes — the knowledge map says A-04 is session scoping and A-05 is compaction detail, but the HTML has it inverted. The deeper problem remains: the two modules are complementary preventive strategies (manage context within a session in A-04; manage context across sessions in A-05), and either order has the learner practising one without the full model from the other. The practical fix is not to swap them but to add a bridging sentence at the end of each that explicitly connects them: "A-05 covers the session-level equivalent of what you just learned here."

**A-06's plan-before-execute is well-placed but undersells its own connection to E-05.** A-06 opens with: "In B-07 you learned the habit of reading Claude Code's full response before acting on it." It mentions E-05 (the two-message pattern) only briefly and does not use the E-05 vocabulary. A learner who genuinely absorbed E-05 would recognise `/plan` as the formalised version of "Before doing anything, tell me how you would approach this" — but A-06 doesn't make that explicit. The E-05 connection appears in the knowledge map as a prerequisite flag, but in the module itself it is treated as background context rather than the load-bearing bridge it actually is.

**A-07's tool hierarchy is introduced 7 modules after the first tool reference.** A-00 introduces the concept of tool calls (Claude Code reads files, writes files, runs commands). A-01 mentions "Tools are how Claude Code acts in the world" as Part 3 of the mental model, with the note "The full tool hierarchy and cost comparison are covered in A-07. For now, the key insight..." Learners run actual Claude Code sessions in A-00 through A-06 while approving tool calls they don't yet have a vocabulary for. In A-02's cost discussion, the cost of tool calls is mentioned, but the learner has no cost ordering for specific tools. The practical consequence: learners are approving or rejecting tool calls in A-00 through A-05 based on intuition rather than understanding. The deferral to A-07 is pedagogically defensible but it means six modules of tool-call exercises where the learner is flying partly blind.

**A-08's delegation section has the right guardrail but a structural tension.** A-08 explicitly says "never delegate understanding." This is the right principle. But A-08 is module 8 of the track — the learner has arrived here with a full toolkit and will be tempted to delegate confidently. The delegation decision framework (3-question test) is strong. The problem is that the five-part brief format in A-08 is so similar to the Opening Seed from B-10, to the E-03 context-loading template, and to the A-06 format-control starter that a learner might wonder why they needed a separate module for it. The brief's five parts (Goal, Context, Scope, Output format, Length) map almost exactly to Role, Context, Constraints, Done from the Opening Seed. This is not a sequencing error — it's good design that shows the course is coherent — but it is a missed opportunity to explicitly close that loop: "You already know how to write this brief. You built this structure in B-10."

### Conceptual density spike

The steepest density spike in the entire course is A-00 → A-01 → A-02. In three consecutive modules the learner installs a new tool (A-00), absorbs a three-part mental model about how AI processing works at a mechanical level (A-01), and then reads billing rates and calculates costs (A-02). None of these modules is dense on its own, but the cumulative cognitive load — environment setup, mental model shift, financial awareness — arrives without a ramp. Compare this to the B-track's first three modules, where B-01 is literally "send one message," B-02 is "fill in the brackets," and B-03 is a reference module. The A-track entry assumes the learner has the E-track as foundation, but does not provide an equivalent gentleness for the additional layers it introduces.

---

## The connective tissue problem: how well does B→E and E→A work?

### B to E

The B-to-E transition is the best-handled transition in the course. B-10 explicitly collects everything the B-track has taught (role, task, context, stopping condition) into a single named structure (the Opening Seed), and the "Next" text says clearly "the Enabled User track builds on all of this." E-01's opening paragraph names the prerequisite modules explicitly. E-07's reference card is positioned as the synthesis object that carries B-track and E-track knowledge forward.

The structural problem is what the B-track *doesn't name* before handing learners to E-track. A learner completing B-10 has been trained to write precise, structured, execution-focused messages — but has never been told that this is one mode of working, not the only mode. When E-01 says "You can use AI. Now learn to control it," this framing implies that control is the goal, rather than one of two goals. The Human Mode / Machine Mode distinction, if introduced at B-10 or at the E-track threshold, would change how learners receive E-01 through E-07. Instead of "more techniques for the same thing," the E-track would read as "deeper mastery of one half of your toolkit."

### E to A

The E-to-A transition is the weakest transition in the course. The problem is not missing prerequisites — by the time a learner reaches A-00, they have every prompting concept they need. The problem is the unannounced environment shift.

E-07 closes the Enabled User stage with "The machine will wait. It does not mind. Go do the work." The implication is that E-07 completers are equipped and should use their skills. Then A-00 opens with "From conversation to command line." No conceptual bridge explains *why* a person who can use web-based chat well would want to move to a terminal tool. A-00's "What you are leaving behind and what you are keeping" section handles the technical continuity, but it doesn't address the motivational question: what can I now do that I couldn't do before? Why would I accept the friction of a terminal and API billing?

The E-to-A transition treats the shift as environmental (new tool, same principles) when it is actually motivational (new capability category, not just a harder version of the same thing). A sentence at the start of A-00 that frames what changes — "Claude Code can act in the world; it doesn't just produce text you then act on yourself" — would give learners a reason to continue that E-07's ending does not provide.

### What the Human Mode / Machine Mode frame would change

**If the frame were introduced at the start of B-track (e.g., B-01 or early B-02):**

The entire B-track would read differently. Learners would understand from the beginning that they are being taught one of two fundamental modes, and that the mode they're learning — precise, structured, execution-focused — is the right tool for some jobs but not all. This would reduce the risk of generalising Machine Mode habits to tasks that call for exploration. It would also make B-09 (Machine Mode persistent instructions) legible as a named concept rather than a label that appears once and disappears.

The risk: introducing a two-mode frame at B-01 adds conceptual load before the learner has any experience to anchor it. A learner who has never sent a message to an AI has no context in which to understand why mode matters.

**If the frame were introduced at the B-to-E transition (B-10 or E-01):**

This is the highest-leverage placement. By B-10, the learner has 10 modules of Machine Mode practice — they can recognise the pattern from their own experience. Naming it at B-10 as "the mode you've been learning" would be retrospectively clarifying. Then E-01 could explicitly say: "The E-track deepens your Machine Mode skills. Human Mode is different and we will point to it where relevant." This would give the E-track a cleaner identity.

**If the frame were introduced at E-07 (the reference card):**

E-07 asks learners to identify their "three principles" — but all possible answers are Machine Mode principles. Adding a slot to the reference card for "When I use a different approach" — even if most learners leave it blank — would plant the awareness that modes are a choice. It would also create a concrete artefact that becomes more complete as the learner develops.

**Effect on A-track entry:**

If the two-mode frame exists by E-07, A-00 can name Claude Code as a Machine Mode environment with a precision dial turned all the way up — and explain that the A-track is entirely about operating in that mode with maximum control. This gives the A-track a motivational identity rather than being just "more of the same, harder."

---

## Three specific recommendations

### 1. Name the mode at B-10, not before and not after

The single highest-leverage sequencing change is introducing the Human Mode / Machine Mode distinction at B-10. Not at B-01 (too early, no experience to anchor it), not at E-01 (the learner has already built the habit without naming it), but at B-10 — the capstone module where the Opening Seed is assembled.

Specifically: in the B-10 intro or "What is happening" section, add a short paragraph that names what the learner has been building. Something like: "The Opening Seed is the full form of what this course calls Machine Mode prompting — where you specify role, task, context, and done condition precisely, leaving as little to the AI's judgement as possible. This is the right approach for execution tasks: drafting, summarising, analysing, checking. For thinking-with tasks — exploring an idea, getting unstuck, working something out conversationally — a looser approach works better. The Enabled User track focuses on Machine Mode."

This single addition would:
- Give learners a named frame for the next seven modules
- Make B-09's "Machine Mode defaults" label legible for the first time
- Make E-07's reference card richer (it could have a Human Mode section)
- Give the A-track a clear motivational identity at entry

### 2. Fix the knowledge map's A-track module labels before any new content is added

The knowledge map describes A-01 as the cost model and A-02 as the mental model. The actual content is the reverse. Every stacking table row, dependency chain reference, and open decision in the knowledge map that references A-01 or A-02 is currently describing the wrong module. Anyone adding content to the A-track using the knowledge map as a guide will introduce dependencies against the wrong foundations.

The fix is straightforward: update the knowledge map's dependency graph, stacking table, load-bearing concepts section (concept #7 references "A-02 (introduced)" for compaction), late-track prerequisite flags, and open decisions to reflect that A-01 = mental model and A-02 = cost model.

This is not a sequencing recommendation — the current live order is correct. It is a documentation accuracy fix that prevents future sequencing errors.

### 3. Give A-04 and A-05 explicit connective sentences, and front-load A-04 with the "why this matters" from A-01

A-04 (Context Awareness and Compaction) teaches what compaction does and how to manage it. A-05 (Session Hygiene) teaches how to structure sessions to avoid compaction problems accumulating. These modules are meant to work together — A-04 explains the problem; A-05 prevents it at a higher level. But neither module explicitly connects to the other in its body text.

Two additions would close this gap:

First, A-04 should open with a callback to A-01's compaction introduction. A-01's Part 2 ("The context window is finite and degrades over time") introduces compaction at the concept level and says the consequences are covered later. A-04 is that later coverage. But A-04 doesn't say "This is the full version of what A-01 introduced." Adding one sentence — "In A-01 you learned that compaction exists. This module tells you what it does in practice and what you can do about it." — closes the forward reference A-01 opened.

Second, A-05 should end with an explicit connection to A-04 and to E-06's re-seed concept. The module already mentions B-08 and E-06 in its "Connecting to" section — but it doesn't say that A-04 and A-05 are two halves of the same problem (managing context degradation: within a session in A-04, across sessions in A-05). Adding a closing sentence that names this as a system — "A-04 and A-05 together give you full context hygiene: one for within a session, one for across sessions" — would make the pair land as integrated capability rather than two separate techniques.

---

## Summary: does the course build genuine capability in the right order?

For the B-track: mostly yes. The technical dependency chain is sound. The gaps are the unnamed mode problem (Machine Mode practised for 10 modules without being named as a mode) and the verb gap (four safe verbs promised to be incomplete from B-02, not completed until E-01). Both are recoverable — the learner doesn't hit a hard wall, just builds habits that are slightly misframed.

For the E-track: yes, with one structural concern. The three-module core (E-01, E-02, E-03) is the tightest sequencing in the course. The concern is that the entire track deepens one mode without naming it, and E-07's reference card synthesis has no slot for "when to work differently." The E-track produces a skilled Machine Mode practitioner who doesn't know they are one.

For the A-track: the live content is sequenced better than the knowledge map describes (the A-01/A-02 swap was the right call). The main remaining problem is the A-00 to A-02 entry density and the A-04/A-05 connective gap. Neither is severe — the A-track assumes a capable E-track completer — but the entry experience is abrupt compared to the B-track's careful first steps.

For B→E→A as a whole: the course reads as a coherent progression technically, but not motivationally. Each track has a clear internal logic, but the transitions between tracks answer "what comes next in the syllabus" rather than "what can I now do that I couldn't do before." The Human Mode / Machine Mode frame, introduced at B-10, would give each track transition a capability-based rather than curriculum-based rationale.
