# Cyborg — v2 Architecture
*Date: 2026-04-15*

---

## 0. Orientation

v2 / Cyborg is not a revision of Linguist v1. It is a ground-up course about integrating AI into the process of working and living. The v1 move was "here is how to talk to AI cleanly." The v2 move is "here is what AI looks like when it lives inside the things you already do."

Two frames carry the course:

1. **Human Mode / Machine Mode** — the spine. Human Mode is thinking out loud, exploring, not knowing what you want yet. Machine Mode is precise, structured, verb-first, with a stopping condition. The skill is the transition.
2. **Scenario-first** — the teaching unit. Every lesson begins with a situation a specific kind of person has found themselves in. The concept is extracted from the situation, not the other way around.

These two decisions shape every other decision in this document.

---

## 1. The Teaching Unit: Anatomy of a Micro-Lesson

A v2 lesson is 7–12 minutes. It has one scenario, one insight, one thing to try, and one thing to keep. It does not build a framework — it drops a tool into a situation the learner recognises. Frameworks assemble themselves across lessons. No single lesson introduces "the concept of X"; the concept is what's left in the learner's hand when the scenario is over.

The structure below encodes the Human/Machine Mode transition without naming it until Stage 2. Early lessons make the learner feel the shift between "you're not sure yet" and "you know what you want" as two different postures. The posture change is the lesson.

### Template

```
PROFILE TAG          [Newsroom-of-one | Caseload | Operator | Builder | Returner]
LESSON CODE          [Stage-Number, e.g. 1-04]
TIME                 ~8 minutes
WHAT YOU WALK AWAY WITH  [one concrete artefact, habit, or move]

---

## THE SITUATION
[90–120 words. Second person. Present tense. Specific enough that the
profile-matched learner thinks: that's me, today. Names a tool they
use, a task they recognise, a frustration they've had.]

Example (Newsroom-of-one profile):
You are writing a client proposal. You have ten minutes of voice notes,
three old proposals in a folder, and a deadline. You paste everything
into Claude and ask it to "write the first draft." What comes back is
1,400 words of earnest, generic, nearly-right prose. The voice is not
yours. The structure is not what the client asked for. You can feel
you've lost twenty minutes and you are not closer.

---

## WHAT JUST HAPPENED
[3–5 short paragraphs. Diagnostic, not theoretical. Names the move
the learner made and the consequence. Does not yet introduce the fix.
This is where the micro-lesson earns the learner's attention — they
should recognise the diagnosis as more honest than the reassurance
they are used to.]

You were thinking out loud. "Write the first draft" is a Human Mode
request dressed as a Machine Mode instruction. You hadn't decided
what the proposal should argue, who it was for, or what order it
should go in. So the AI decided all three. It did that confidently,
which is why the output looked finished. Confident is not the same
as right.

---

## THE MOVE
[The one thing the lesson teaches, as a move, not a concept. 60–100
words. A single instruction, or a single diagnostic question, or a
single reframe. If it takes more than 100 words, it is two moves and
this is two lessons.]

Before you write the next prompt, answer one question out loud:
"What does the client actually want this proposal to say?" If you
can answer in one sentence, you are ready for a Machine Mode
instruction — verb, scope, length, what to leave out. If you
can't, you are still in Human Mode. Stay there. Have a conversation
with the AI about the proposal before you ask it to write anything.

---

## TRY IT NOW
[Copy → Personalise → Use. Two prompts — one for each mode.
This is the part the learner actually does. Annotations explain
which substitution controls which outcome. Saved as files / notes
where durable comparison matters.]

### Human Mode starter (use when you're not sure yet)
Copy this:
> "I'm working on [thing]. I have [materials]. I'm not yet sure
> [what I'm trying to say / who it's for / how to structure it].
> Ask me three questions that would help you help me."

Personalise: replace the brackets. Do not answer the questions in
advance — let the AI ask them.

### Machine Mode instruction (use once you know)
Copy this:
> "Draft a [format] for [audience]. The argument is [one sentence].
> Length: [number] words. Voice: [sample phrase or doc]. Leave out:
> [2–3 things]."

Personalise: the "argument" slot is the load-bearing one. If you can't
fill it, go back to the Human Mode starter.

---

## KEEP
[One sentence. Names the artefact, habit, or diagnostic the learner
is carrying into tomorrow. If nothing fits in this slot, the lesson
has no return value and should be cut or merged.]

Keep: the one-sentence argument test. If you can't say what the
thing is meant to say, the AI can't either.

---

## IF IT DIDN'T WORK
[Calibration fallback. Names the likely failure mode and gives
the learner somewhere to go. Never "try again harder."]

If the Machine Mode draft is still generic, the "argument" sentence
was too abstract. Rewrite it as a thing you would actually say out
loud to the client, then try again.
```

### Why this shape

- **Situation before concept.** The learner arrives inside a recognisable moment, not at the foot of a definition.
- **Diagnosis before prescription.** "What just happened" validates the frustration. Learners who feel seen will try the move.
- **One move, one artefact.** Lessons do not teach two things. A lesson teaching two things is a lesson failing at one of them.
- **Two prompts.** The learner experiences Human Mode and Machine Mode as different postures in the same lesson, without those terms appearing in Stage 1.
- **KEEP is non-negotiable.** If there's no KEEP line, the lesson evaporates on close. The KEEP is the unit of retention.
- **IF IT DIDN'T WORK belongs on every lesson,** not only calibration-sensitive ones. Failure is routine; pretending otherwise breaks trust.

---

## 2. The Profile System

Profiles are work contexts, not personality types. They determine which scenarios a learner sees first, what KEEP artefacts they accumulate, and which optional lessons unlock. The profile is a running filter over the whole course, not a quiz result surfaced once in Stage 1.

Every micro-lesson ships with up to three profile-specific scenario variants. A learner sees one variant based on their selected profile. The WHAT JUST HAPPENED and THE MOVE sections are shared; THE SITUATION and TRY IT NOW substitutions differ.

The learner can change profile at any time and re-read the same lessons with different scenarios. This is encouraged — part of Stage 5 is "see your own lessons through another profile's eyes."

### Profile 1 — Newsroom-of-one

**Who they are.** A founder, solo consultant, freelance operator, or small-agency lead. Writes proposals, posts, emails, and docs under their own name. Their output is the product. Nobody else signs off what they publish.

**What they want from AI.** Leverage on the writing and thinking load. A collaborator who can take a half-formed idea and reflect it back sharper, and an executor who can produce clean first drafts they then edit.

**Failure modes.**
- Asks AI to "write the proposal" before deciding what the proposal should argue. Gets generic output; blames the AI.
- Over-shares context — pastes in six old docs and expects the AI to synthesise a voice. Ends up with an averaged, blanded version of themselves.
- Cannot tell when an output is subtly wrong because the voice is too close to theirs. Ships it. Regrets it on Monday.

**Sample scenario (unique to this profile).** You have a discovery call in two hours and the prospect's website is thin. You ask the AI for "a company briefing." It invents two products they don't sell and a founder who doesn't work there. You almost walk in with it.

### Profile 2 — Caseload

**Who they are.** A professional managing many similar-shaped matters at once. Teachers, social workers, lawyers, GP practice managers, grant officers, case managers. Each case is bespoke; the surface pattern repeats.

**What they want from AI.** A per-case reduction in admin. Faster triage, better notes, plain-language translations, first-draft letters. Not "a voice" — accuracy and time back.

**Failure modes.**
- Treats each case as a fresh conversation, re-explaining the same standing context every time. Burns hours.
- Accepts plausible-sounding AI output on factual matters (dates, legal references, medication interactions) without checking. Professional consequences.
- Builds prompts for the hard cases but keeps doing the easy cases by hand. Leverage stays low.

**Sample scenario (unique to this profile).** You're writing the fourteenth letter of the week explaining a benefits decision in plain language. You realise you've typed the same three sentences of boilerplate context into the AI fourteen times. You have not yet set up persistent instructions.

### Profile 3 — Operator

**Who they are.** Someone inside a team or org whose job is making things run. Ops managers, programme leads, chiefs of staff, executive assistants, community managers. Their output is other people's outputs, coordinated.

**What they want from AI.** Process leverage. Summaries of long threads, status rollups, meeting prep, draft updates to stakeholders, first-pass analysis of messy spreadsheets. Increasingly: "can this run without me in the loop?"

**Failure modes.**
- Uses AI as a faster typewriter; never crosses into automation. Stays in the manual-save, manual-paste loop.
- Shares AI output upward without reading it carefully. Gets caught by a hallucinated number in a board update.
- Builds fragile one-person workflows that break the first time a field name changes, then reverts to doing it by hand.

**Sample scenario (unique to this profile).** The weekly ops review is tomorrow. You have six Slack channels, two Linear projects, and an inbox to summarise. You ask the AI to "summarise this week" and paste everything in. The summary is confident, readable, and omits the one thing the CEO will ask about.

### Profile 4 — Builder

**Who they are.** Someone who is already using AI to make things — code, content systems, side projects, internal tools. Technically confident or technically curious. Uses Claude Code, Cursor, n8n, or scripts. Comfortable in a terminal or willing to be.

**What they want from AI.** More ambitious builds with less handholding. Wants to delegate whole sub-projects, set up automations that run while they sleep, and know when to trust the output.

**Failure modes.**
- Over-delegates. Hands the agent the thing that actually needed their judgement, then debugs the agent instead of doing the thinking.
- Builds automations that silently fail — the flow runs, the output is wrong, nobody notices for a week.
- Treats every problem as a tooling problem. The answer was to write a clearer brief, not to add another integration.

**Sample scenario (unique to this profile).** You've built an n8n flow that drafts replies to support emails and files them. It's been running for three days. You spot-check one today and the AI has been making up a refund policy that doesn't exist. Eleven customers have had it quoted back to them.

### Profile 5 — Returner

**Who they are.** Someone who used AI for a while, got frustrated or disillusioned, and stopped. Or someone who finished v1 a year ago and is back because the tools changed. Not a beginner — a second-time starter. Has assumptions to unlearn.

**What they want from AI.** To find out what is actually possible now, after the hype settled. Wants honest calibration more than new techniques.

**Failure modes.**
- Applies old mental models to new tools — treats a reasoning model like a 2023 chatbot, or treats an agent like a chat.
- Defensive about previous disappointment; dismisses capabilities by testing them on the thing that failed last time.
- Over-corrects into cynicism. Misses real leverage because they're guarding against being fooled.

**Sample scenario (unique to this profile).** You tried AI for writing a year ago. It was fine for summaries, bad for anything with a voice. You've come back because a colleague said "agents" without smirking. You open Claude, type a question you already know the answer to, and watch what happens. You are not sure what you are testing for.

### Why these five

v1 used newrole / professional / maker. That framework mostly worked but conflated "what job you do" with "what relationship you have with AI." v2 separates those. Newsroom-of-one and Caseload are both "professional" in v1 terms but need almost opposite things. Operator and Builder are both making things run, but one is stitching people, the other is stitching tools. Returner is new — v1 assumed every learner was a beginner, which is no longer true.

The profiles are deliberately not "beginner / intermediate / advanced." Skill level is handled by the curriculum spine; profile determines what the skill is being applied to.

---

## 3. The Curriculum Spine

The Human/Machine Mode learning arc maps to five stages. Total lesson count target: ~40 core micro-lessons plus profile-specific variants. A learner doing only their profile's path covers ~30 lessons. Completionists see ~55.

### Stage 1 — Feel the Difference (lessons 1–8)

The learner experiences both modes without the terms. Every lesson in this stage pairs an exploratory posture and an instruction posture against the same task. By lesson 8 the learner can feel, without naming, that "I'm not sure yet" and "I know what I want" call for different kinds of message.

**Entry point for absolute beginners.** The v1 B-01 confidence work (ten things that are not problems, platform orientation) sits here, absorbed into the first two lessons but reframed scenario-first.

### Stage 2 — Name the Modes (lessons 9–14)

The frame is named explicitly. The learner learns that what they've been feeling has a name, and that the transition between them is the skill. This stage formalises what Stage 1 built intuitively. Mode-switching exercises dominate.

Lesson 9 is the hinge: the learner re-reads a Stage 1 lesson they found frustrating and sees what was happening.

### Stage 3 — Run the Transition (lessons 15–22)

The core skill. When to stay in Human Mode, when to cross to Machine Mode, how to know you're ready. This stage contains the content that v1 spread across B-04, B-06, B-10, E-01, E-03, E-05 — compressed and reframed.

The Opening Seed lives here, but as "the standard shape of a Machine Mode first message," not as a capstone. Persistent instructions (v1 B-09) live here too, as "Machine Mode defaults for your recurring work."

### Stage 4 — Detect Bullshit (lessons 23–28)

Explicit module. See Section 4 below. Placed after Stage 3 because learners need enough Machine Mode fluency to recognise when an output should be tight and isn't. Placed before Stage 5 because automation without bullshit detection is automation of wrong answers at scale.

### Stage 5 — Build the Cyborg (lessons 29–40)

Automation, delegation, and the integration of AI into existing processes. This is where v2 does what v1 didn't. See Section 5. The stage ends with a capstone scenario per profile — the learner's own work, the learner's own automation, shipped.

### How the arc maps to entry points

- **Absolute beginner.** Starts at lesson 1. Lessons 1–8 are the equivalent of v1 B-track, compressed and scenario-first.
- **Returner profile.** Starts at lesson 5 with a re-calibration path that covers what's changed in the last 18 months, then merges into Stage 2.
- **Existing practitioner** (someone who completed v1 or equivalent). Starts at Stage 3, takes Stage 4 in full, and treats Stage 5 as the actual course.
- **Builder profile.** Can enter at Stage 4 after a 3-lesson fast path through Stage 2 naming. Stage 5 is where they spend most of their time.

Profile selection happens in lesson 0, a 2-minute orientation that sets the scenarios for everything downstream.

---

## 4. The Bullshit Detection Module (Stage 4)

### What "bullshit" means here

Five distinct failure modes, each with its own tell:

1. **Hallucination.** The AI invents a fact — a product, a person, a citation, a date. Tell: the fact is load-bearing to the answer but cannot be traced back to anything you gave the AI or anything in its training set.
2. **Sycophancy.** The AI agrees with your framing instead of testing it. Tell: you ask a leading question and get a confident yes; you ask the opposite leading question five minutes later and get a confident yes to that too.
3. **Thin answer dressed as a thick one.** The AI produces a plausible structure with nothing specific underneath. Tell: replace every concrete noun with "X" and the answer still makes grammatical sense.
4. **Confident wrongness.** The AI is wrong about something verifiable, but its tone is not hedged. Tell: specificity is high, confidence is high, and the fact is checkable — so check it.
5. **Plausible-but-wrong plans.** The AI proposes a multi-step plan where one step is subtly wrong (the alphabetical-vs-journey error from v1 E-05). Tell: one step would produce an output you can't actually use for the next step.

### Teaching it without producing paranoia

The failure mode to avoid is "learner treats every AI output as suspect, re-verifies everything, and loses the leverage that brought them to the tool." The teaching move is specificity: each of the five types has its own diagnostic, and the diagnostic is cheap. The learner is not on guard constantly; they know what to check when.

### Placement

Lessons 23–28. After Stage 3 (so learners have Machine Mode fluency and can recognise when an answer is shaped wrong), before Stage 5 (so automation happens with bullshit filters in place, not bolted on).

Stage 1 contains **one** early-warning lesson (lesson 6 or 7) that names hallucination and sycophancy without going deep — enough to inoculate beginners against the worst first-week mistakes. The full module is Stage 4.

### Structure of the module

Six micro-lessons, one per failure mode plus a synthesis:

- **23.** Hallucination — the invented fact. Scenario: an AI-generated company briefing with a product that doesn't exist.
- **24.** Sycophancy — the mirror. Scenario: you ask "is this a good idea?" and get unconditional yes; you ask "what's wrong with this idea?" and get unconditional concerns.
- **25.** Thin dressed as thick. Scenario: a strategy doc that reads well until you try to act on it.
- **26.** Confident wrongness. Scenario: a specific number, a specific date, a specific claim — checkable, wrong.
- **27.** The wrong plan. Scenario: the three-step plan where step two makes step three impossible.
- **28.** Synthesis — the Five Tells card. One-page diagnostic the learner keeps. The KEEP artefact of the stage.

### Exercise pattern for each lesson

A scenario-matched output is provided (not generated live — the production team crafts it so the bullshit is reliably present). The learner:

1. Reads the output once and notes their gut reaction (1 sentence).
2. Applies the tell for that failure mode.
3. Either catches the bullshit or doesn't.
4. Reads the annotation explaining what was wrong and what signalled it.

The exercise is calibration. The KEEP is the tell — a single question the learner can ask of any future output.

---

## 5. The Automation Layer (Stage 5)

### The core move

Automation is Machine Mode at scale. Once a task is tight enough to instruct cleanly once, the question becomes: does it need to be a conversation at all? Stage 5 teaches the learner to recognise when a recurring Machine Mode prompt has become a process, and to move it from chat window into something that runs without them.

### Minimum automation knowledge

Two concepts are non-negotiable before Stage 5:

1. **Triggers and actions.** "When X happens, do Y." That is the whole mental model at the entry level. Everything else is tooling.
2. **What can go wrong silently.** Automations fail without telling you. The bullshit detection work from Stage 4 extends here as "running a check on your own automation."

No programming required for the base path. Builder profile path includes scripting.

### Tools in scope

Tiered by profile and stage depth:

- **Tier 0 (everyone).** Persistent instructions / Projects / Gems. These are "Machine Mode defaults" — the softest form of automation.
- **Tier 1 (everyone).** Zapier or Make, one trigger-one action flows. No branching.
- **Tier 2 (Operator, Caseload, Builder).** n8n, multi-step flows with a single AI call inside. Introduces branching and the idea of a "loop-check" — a step that checks the AI output before acting on it.
- **Tier 3 (Builder).** Claude Code as an automation runner; agent-delegated sub-projects; simple scripts invoked from flows.
- **Tier 4 (Builder, optional).** Scheduled agents, cron-triggered jobs, the appendix-tool-landscape content (Superset, Tauri, Go, RoboRev, Agents View) as an extension pack.

IFTTT, Shortcuts (iOS), and browser-side triggers get named in Tier 1 for learners whose life is outside work.

### Connection to the mode frame

Every Stage 5 lesson asks two questions at the top:

- Is the human part of this task over? (If not, automation is premature.)
- Is the machine part of this task the same every time? (If not, it's still a conversation.)

Automation lives only where both answers are yes. The course teaches the learner to say no to the others.

### Woven or separate?

Stage 5 is a distinct stage but it is not a separate track. Every profile reaches it. What differs is the depth: Newsroom-of-one leaves with persistent instructions and one Zapier flow; Builder leaves with a scheduled agent and a CLAUDE.md that runs their side project.

The stage ends with a profile-matched capstone scenario: "pick one thing in your current week that is currently a conversation, and move it one tier down." The scenario is real work, not a provided fictional project.

---

## 6. What v1 Content Survives

Not a throwaway. v1 did load-bearing work; v2 keeps what was load-bearing and drops what was scaffolding. The list below is explicit about which of each.

### Carried through (with rewrite)

- **Copy → Personalise → Use.** Still the exercise backbone. Every TRY IT NOW section uses it. Rewritten only in that the prompts are profile-variant and annotations explain which substitution controls which outcome (v1 already moved this way; v2 makes it universal).
- **The Opening Seed (Role, Task, Context, Done).** Retained as the standard Machine Mode first message. Reframed: no longer a capstone ("if you learn one thing, learn this") but a default shape the learner meets in Stage 3 and uses throughout Stage 5. Drops the ceremony. The four slots survive intact.
- **Stopping conditions.** Load-bearing. Survives as the single most important Machine Mode move. Introduced earlier in v2 — somewhere in Stage 1 — because automation in Stage 5 depends on it absolutely.
- **Load-bearing context / the load-bearing test.** Survives. Reframed from "a concept in E-03" to "the question you ask of every sentence in a Machine Mode prompt." Becomes a lens, not a module.
- **The re-seed.** Survives for Operator and Builder profiles as "how to start fresh when the conversation has gone somewhere it shouldn't." Other profiles meet a lighter version.
- **Verb choice / safe verbs vs risky verbs.** Survives as a Stage 2 lesson. Reframed around the authority the verb hands over, not around a list of seven verbs to memorise.
- **Persistent instructions (v1 B-09).** Survives as the Tier 0 automation in Stage 5. Upgraded from "standing preferences" to "the first automation you ever ship."
- **CLAUDE.md (v1 A-03).** Survives for Builder profile only, in Stage 5 Tier 3. Reframed as "the persistent instructions for your Claude Code projects."
- **The 5-part brief (v1 A-08).** Survives for Builder profile in Stage 5 Tier 3 as the delegation instrument. Reframed: the brief is the automation — the subagent is just where the brief runs.
- **"Never delegate understanding" (A-08).** Elevated. Becomes a course-wide principle, quoted in Stage 1 lesson 3 and re-quoted at the Stage 5 capstone. This is the sentence the course is built around.
- **The B-track confidence layer.** The "ten things that are not problems" card, the "you are allowed to ignore this response" permission work — survives in Stage 1 as the emotional register of the first lessons, not as its own artefact library.

### Dropped

- **The three-stage (beginner / enabled / advanced) vocabulary.** v2 uses "stages" differently — Stages 1–5 are arc positions, not learner-level labels. Profile determines level-of-application; stage determines conceptual depth.
- **The v1 sequential track structure (B → E → A).** v2 lets a Builder skip Stage 1 and a Newsroom-of-one stop at Stage 3 if that's the useful shape. No all-tracks completion pressure.
- **The v1 module count as a frame.** v1 had "27 modules." v2 has "about 40 micro-lessons, take the ones that look like your week." Quantity is not the promise.
- **Module 9 as the mode-introduction moment.** Replaced by Stage 2 as an explicit naming stage, with Stage 1 seeding the feel.
- **The reference card / graduation card as a single capstone artefact.** Replaced by stage-specific KEEP artefacts that accumulate.

---

## 7. The First Five Lessons

All five are Stage 1. None of them use the terms Human Mode, Machine Mode, Opening Seed, or stopping condition. They make the learner feel the relevant difference before naming it.

### Lesson 1 — The Twenty-Minute Proposal

*You asked the AI to write something, and what came back was confident, earnest, and not what you needed. Here's why.*

**Situation (Newsroom-of-one variant):** You're on a deadline for a client proposal. You paste your voice notes, three old proposals, and the client's website into the AI and ask it to write the first draft. Twenty minutes later you have 1,400 words of generic prose. You have not yet decided what this proposal should argue.

**Situation (Operator variant):** You've been asked to "write the Q2 update for the board." You paste the six-month Slack history into the AI and ask for "a summary." What comes back reads like a news article about your company written by someone who doesn't work there.

**What it teaches:** The request that isn't a request yet. Asking AI to do something you haven't decided produces something nobody asked for.

### Lesson 2 — The Question You Already Have

*The AI doesn't need you to know. It needs you to be specific about not knowing.*

**Situation (Returner variant):** You open Claude for the first time in a year. You want to come back in, but you're not sure what to test. You type "what are you good at now?" and get a paragraph that sounds like marketing copy.

**Situation (Caseload variant):** You have a situation you can't quite describe — a case that isn't fitting the usual pattern and you don't know why. You don't have a clean question yet. You open the AI and sit with the blinking cursor.

**What it teaches:** Thinking out loud with the AI is a legitimate way to start — but it requires saying "I'm not sure yet" out loud, not pretending you are. The move: tell the AI what you don't know, and ask it to ask you questions.

### Lesson 3 — Never Delegate Understanding

*The moment you notice you've stopped thinking.*

**Situation (Builder variant):** You've asked the AI to explain a regulation you need to comply with. It produces three clean paragraphs. You paste it into your doc and move on. An hour later you realise you couldn't restate it in your own words if someone asked.

**Situation (Caseload variant):** You have to make a decision about a case. The AI produces a reasoned recommendation. You almost forward it. You stop.

**What it teaches:** Some work has to stay with you. The AI can help you get to understanding; it cannot hold the understanding for you. Names the failure mode ("I outsourced the thinking") without naming Human Mode yet. This lesson is early because every subsequent lesson trades on the learner believing it.

### Lesson 4 — The Second Prompt

*The one you should have sent first.*

**Situation (Newsroom-of-one variant):** You got a bad draft. You type "make it better." You get a slightly different bad draft. You type "no, more like [vague gesture]." You get a third variant. Forty minutes in, you realise your second message should have been your first.

**Situation (Operator variant):** The AI summarised the wrong thing. You correct it: "focus more on risks." It rewrites, focusing on risks but losing the wins. You correct again. The conversation is now longer than the source material.

**What it teaches:** The correction spiral. When you are three corrections in and it is not getting better, the first message was wrong — start again with what you've learned. Introduces the restate move without calling it that. The KEEP is the diagnostic: "three corrections and it's not closer — rewrite the first message."

### Lesson 5 — Tell It When to Stop

*The single move that will save you more time than any other.*

**Situation (everyone — this is a shared-scenario lesson):** You ask for "a short summary." You get 400 words. You ask for "a few bullet points." You get 14. You ask for "a draft email." You get three paragraphs of preamble and then the email.

**What it teaches:** Every instruction needs an edge. A number, a format, a "leave out." Otherwise the AI decides, and it decides generously. This is the first lesson where the learner writes a Machine Mode prompt deliberately, though the term isn't used. The KEEP is a small card — five stopping-condition phrases the learner can paste into any message.

### Why these five, in this order

- **1 and 2** establish the two postures (ready to instruct / not ready to instruct) as felt experiences. The learner meets both in their first sitting.
- **3** is the ethical spine planted early. Everything else in the course sits on top of "don't outsource the thinking."
- **4** gives the learner a diagnostic for when something has gone wrong, before they've done enough to recognise it unaided.
- **5** puts the first real Machine Mode move in their hand. Stopping conditions are the smallest Machine Mode instruction that meaningfully changes output, so they come first.

By the end of lesson 5, the learner has felt both modes, been warned about the deepest failure mode, been given a diagnostic, and made one clean Machine Mode instruction. They have four KEEPs in their pocket. They have not yet heard the words "Human Mode" or "Machine Mode" once.

That is the design.
