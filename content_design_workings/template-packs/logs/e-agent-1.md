# Agent E1 — E-track Supplementary Content Brainstorm
*Phase 1: Independent brainstorm*
*Date: 2026-04-14*

---

## E-01: The First Word Matters

**Module concept in one sentence:** The first verb in a prompt sets the ceiling on how much the AI will decide for itself — safe verbs have defined edges, risky verbs delegate judgement.

---

### Idea 1: The Verb Swap Worksheet

**Format:** Printable or copy-paste plain-text worksheet

**What it contains / what the user does with it:**
Five real-world prompts, each written with a risky verb (Improve, Enhance, Make better, Clean up, Optimise). The user's job: rewrite each one using a safe verb plus a stopping condition. Space is left under each example for the rewrite. Three of the five have worked answer examples at the bottom of the sheet — the other two don't, so the user has to commit to their own version first.

Example row:
> Original: "Improve this client proposal."
> Your rewrite: ______
> Example rewrite: "Rewrite the opening paragraph of this client proposal to be more direct. Keep it under 80 words. Don't change the pricing section."

**Why it reinforces the concept:**
Reading about the verb difference is passive. Rewriting five actual prompts forces the user to feel the constraint — they have to choose a specific ceiling for each one, which is exactly the decision the module is teaching. The asymmetry (3 worked answers, 2 open) prevents them from skipping straight to the answer but still gives them a model.

---

### Idea 2: The Verb Permission Spectrum — Pocket Card

**Format:** Single-image reference card (printable or phone screenshot)

**What it contains / what the user does with it:**
A horizontal spectrum from "narrow permission" to "wide permission." Each verb sits at a point on it. Left end: Fix, List, Summarise. Middle: Explain, Draft, Rewrite, Compare. Right end: Improve, Enhance, Optimise, Make better. Under each verb: one-line note on what it permits the AI to decide. User keeps this open during any editing session. Referenced from the existing verb page at `/course/reference/verbs` but structured as a spatial tool rather than a list — you see the risk increasing as you move right.

**Why it reinforces the concept:**
The module teaches a binary (safe/risky) but intermediate users often feel there are shades — "Rewrite feels riskier than Fix but safer than Improve." The spectrum validates that intuition and gives it a spatial form. When in doubt, users can ask themselves "how far right am I willing to go?" rather than trying to remember a list.

---

### Idea 3: The Predict-Then-Send Exercise

**Format:** Structured exercise (2 steps per prompt)

**What it contains / what the user does with it:**
The user picks one of their own real pieces of work — an email, a paragraph, a document section. Before sending any prompt, they write down their prediction: "If I send 'Improve this', the AI will probably change ___." Then they send it and see if their prediction was right. Then they rewrite with a safe verb, predict again, send again, check again. The exercise sheet has a 2x2 grid: Predicted / Actual for each version. The user fills it in from their own results.

**Why it reinforces the concept:**
The module says "when you use a risky verb, you are not asking for a result — you are delegating a judgement." That's abstract until you predict what will happen and then watch it happen. The prediction step forces the user to model the AI's likely decision-making before the fact — which is the cognitive skill the module is actually building.

---

### Preferred pick: Idea 3 — The Predict-Then-Send Exercise

The module's core insight is that verb choice is predictable — you should be able to forecast what latitude you're giving the AI. The worksheet (Idea 1) builds substitution skill. The spectrum card (Idea 2) builds recognition. But Predict-Then-Send builds the forecasting ability, which is what separates someone who knows the rule from someone who has genuinely internalised it. The user's own work makes it immediately applicable. The grid format also makes the difference visible in a way that "compare the two responses" doesn't force.

**Concerns:** The exercise only works if the user has a real piece of work to hand. The module already asks for this, which is good, but about a quarter of intermediate users will default to something trivial. The exercise prompt needs a line that says "use something you would actually send — not a practice sentence." The 2x2 grid might feel slightly formal for users who are used to chat interfaces.

---

## LOG — E1 — E-01

The verb spectrum idea (Idea 2) felt genuinely useful — not just illustrative. The spatial representation of permission feels like something a practitioner would actually keep. The worksheet (Idea 1) is solid but fairly conventional; "rewrite these prompts" is the obvious exercise for this module. 

Predict-Then-Send felt like the real insight. The module uses the word "predict" (you can "predict how much the AI will decide") and the module's exercise already asks for a side-by-side comparison — but neither the module nor a worksheet quite forces the user to commit to a prediction before sending. That commitment step is the difference between pattern recognition and genuinely building a mental model. I'm confident this is the right pick.

Concern I need to flag: E-01 already has the verb reference page at `/course/reference/verbs`. The pocket card (Idea 2) risks duplicating that. Worth flagging to E2 for discussion — if the reference page is well-designed, a spectrum card might be redundant. If the reference page is a table/list, the spectrum adds something different.

---

## E-02: Tell It What to Leave Alone

**Module concept in one sentence:** Front-loading a constraint in any prompt — naming what should not change — is cheaper than cleaning up changes you didn't ask for.

---

### Idea 1: The Constraint Slot Vocabulary Card

**Format:** Plain-text reference card (copy-paste ready)

**What it contains / what the user does with it:**
The module already lists five types of constraint (scope, style, additions, format, voice). This card formalises them as a quick-pick menu: five constraint types, each with two ready-to-use constraint phrasings, for a total of ten phrases. The user scans the five types before sending any editing prompt and picks the one that applies. They copy the phrase, personalise it, drop it at the end of their message.

Example entry:
> **Voice** — Keeps the writing yours.
> - "Keep my sentence structure — only change the words I've marked."
> - "Don't change my tone. This is deliberately [informal / blunt / warm]."

**Why it reinforces the concept:**
The module identifies constraint types but the user has to figure out how to phrase them. Most intermediate users know they *should* constrain but don't know what words to use — so they either skip the constraint or write something too vague to work ("don't change too much"). Ready-to-personalise phrasings lower the cost of adding a constraint to near-zero.

---

### Idea 2: The Constraint Audit — Live Exercise

**Format:** Structured exercise done in the user's chat interface

**What it contains / what the user does with it:**
The user takes five prompts they have actually sent in the past two weeks — pulled from their own chat history. For each one, they answer three questions: (1) What did the AI change that you didn't ask it to change? (2) Which constraint type from the module would have prevented that? (3) Write the constraint you would add now. This is a retrospective audit, not a forward-looking exercise — it works on real mistakes the user has already made. The exercise sheet has the five rows pre-formatted, and the module's five constraint types listed at the top for reference.

**Why it reinforces the concept:**
The module says "prevention costs one line. Correction costs a whole extra conversation." The audit makes that cost visible retrospectively — the user can look at their own history and see exactly which conversations would have been shorter with one added line. That's more motivating than a theoretical example.

---

### Idea 3: The Before/After Constraint Set — Three Worked Examples

**Format:** Worked example set (reference quality, keep-able)

**What it contains / what the user does with it:**
Three complete before/after pairs. Each pair shows: a real-sounding prompt without a constraint, the AI's likely response (described, not generated — two or three sentences saying what it typically does), a revised prompt with the appropriate constraint added, and a description of what the constrained response looks like differently. The three examples cover three different jobs: editing professional writing (voice constraint), restructuring a document (scope constraint), and improving a list (additions constraint). The user reads through all three, then tries to generate a fourth pair from their own work.

**Why it reinforces the concept:**
Intermediate users often understand constraints conceptually but can't visualise what the unconstrained version does wrong. Showing the "AI's likely response" without the constraint — even described, not generated — makes the invisible visible. The instruction to generate a fourth pair from their own work closes the loop between reading and doing.

---

### Preferred pick: Idea 1 — The Constraint Slot Vocabulary Card

The module's problem for intermediate users isn't that they don't believe in constraints — it's that they don't add them in practice because they don't know what words to use. The vocabulary card solves the exact friction point: five types, ten phrases, pick one, personalise it, use it. It is a reusable tool they will actually reach for. The audit (Idea 2) is compelling as an insight exercise but requires the user to go excavate their chat history, which many won't do. The worked examples (Idea 3) are genuinely useful but feel more like a module addition than a supplementary tool.

**Concerns:** There's a risk that ready-made constraint phrases become cargo-cult prompting — users paste "Don't change my tone" without thinking about whether they actually need it. The card needs a small note: "Use the constraint that applies — not all five at once."

---

## LOG — E1 — E-02

Idea 1 felt immediately right — the vocabulary card addresses the real gap. The module lists constraint types but gives example phrases without organising them into a reusable reference. That's the gap.

Idea 2 (the audit) is genuinely interesting — forcing users to look at their own history is powerful. But I'm less sure it works as a standalone supplement because it requires both chat history and motivation to go back and analyse it. It might work better as an optional "if you want to go deeper" note than a standalone piece.

Idea 3 (worked examples) is fine but I don't think it's the highest-leverage thing. The module already has the before/after comparison structure built in. More before/afters might dilute rather than add.

The tension here: E-02 and E-01 both want "vocabulary card"-style outputs. Worth checking whether E2 reaches for the same format — if both agents converge on vocabulary cards, it might indicate the format is genuinely the right answer for this track, or it might indicate we're both defaulting to the obvious.

---

## E-03: Context Is Fuel

**Module concept in one sentence:** Load-bearing context changes the output; decorative context doesn't — and the difference is testable before you send.

---

### Idea 1: The Load-Bearing Test — Decision Flowchart

**Format:** Single-page flowchart (printable or reference image)

**What it contains / what the user does with it:**
A simple flowchart applied to each sentence of context in a prompt. Entry point: "I'm about to include this piece of context." First question: "If I removed this, would the AI have to guess?" Yes → keep it. No → remove it. Then, for the "keep" path: "Does including this change the audience, tone, or specific output?" Yes → it's load-bearing, move it to the top. No → it's marginally useful, include it last or drop it. The flowchart ends with: "What are you still missing that the AI would have to guess?" with a checklist of the five common load-bearing types (audience, purpose, tone, key facts, what's been tried).

**Why it reinforces the concept:**
The load-bearing test is the module's central tool, but it's described in prose. Making it a decision flowchart forces users to apply it step-by-step to each piece of context they're considering — which is how it becomes a habit rather than a principle they remember in the abstract.

---

### Idea 2: The Context Stripping Exercise

**Format:** Structured exercise (three rounds)

**What it contains / what the user does with it:**
The user takes the context-heavy prompt from E-03 — the Q3 results example — and strips it down round by round. Round 1: remove all numbers and specific facts. Send it. Round 2: restore the facts but remove the audience description. Send it. Round 3: restore the audience but remove the tone instruction. Send it. For each round, the user records what changed in the AI's response. The point is not to produce better output — it's to isolate which piece of context did the most work.

The user then applies the same three-round strip to one of their own real prompts.

**Why it reinforces the concept:**
The module describes which context types are load-bearing, but the user has to take it on faith until they can see it. Stripping rounds make each piece of context testable in isolation — so the user experiences the consequence of removing each type, not just reads about it. The consequence is more memorable than the principle.

---

### Idea 3: The Context Audit Template — Five Slots

**Format:** Plain-text template (copy-paste into any task)

**What it contains / what the user does with it:**
A five-slot template that maps directly to the five load-bearing context types from the module. The user pastes it above any prompt they're building and fills in only the slots that apply.

```
Audience: [who will read or use this, and what they care about — or leave blank]
Purpose: [what this is for, not just what it is — or leave blank]
Tone: [how it should sound, if the default would be wrong — or leave blank]
Key facts: [numbers, decisions, constraints specific to this situation — or leave blank]
What's been tried: [what not to repeat — or leave blank]
```

Instructions: Fill in the slots that change the output. Delete the empty ones. Move what remains to the front of your prompt. The template disappears — only the load-bearing context stays.

**Why it reinforces the concept:**
The module's Copy-Personalise-Use starter combines all context types into one dense template. The five-slot version separates them, which helps users see clearly which types they're including and which they're skipping. The "delete the empty ones" instruction also enforces the load-bearing test — if you can't fill in a slot, it's probably not load-bearing for this task.

---

### Preferred pick: Idea 3 — The Context Audit Template

The flowchart (Idea 1) is useful as a teaching tool but slightly process-heavy for an intermediate user who just wants to send a prompt. The stripping exercise (Idea 2) is the best for building genuine understanding of what each context type does — it's excellent as a one-time calibration exercise, but it's not a reusable tool. The five-slot template is both a learning device and a durable workflow addition: it forces the user to consciously consider each context type every time, which is the habit the module is trying to build. It also integrates cleanly with the module's existing Copy-Personalise-Use structure.

**Concerns:** The template might encourage completionist filling — users who feel they need to fill in all five slots even when the task doesn't need them. The "or leave blank" instruction is crucial and needs to be visible. There's also a risk this overlaps too closely with the module's own starter — the supplementary content should add something the module doesn't already have.

---

## LOG — E1 — E-03

The stripping exercise (Idea 2) felt like the strongest insight here. The thing that separates plateau-ers from improvers in context management is often that they think they're giving good context when they're actually giving decorative context that doesn't change the output. The stripping exercise makes the cost of each type of context visible in a way the module can't — you have to send the stripped version and see what's missing before you believe it.

But I picked the template because it's reusable. The stripping exercise works once; the template works every time. There's an argument that a one-time calibration exercise that produces genuine belief is worth more than a tool that gets followed mechanically. I'm not fully satisfied with the preferred pick for this module.

The flowchart is the weakest of the three — it adds process without adding insight. I included it because it's the obvious structural rendition of the load-bearing test, but I don't think it's actually better than the prose description in the module.

---

## E-04: Restate, Don't Patch

**Module concept in one sentence:** When a conversation has gone wrong, continuing to correct inherits and amplifies the original misunderstanding — starting fresh is faster.

---

### Idea 1: The Spiral Signals Checklist

**Format:** Plain-text reference card (3 signals, print or paste)

**What it contains / what the user does with it:**
The three spiral signals from the module, formatted as a quick self-check. User applies it mid-conversation when something feels off.

```
Spiral check — stop if any of these is true:

[ ] I've sent more than two corrections and the response is still not what I wanted.
[ ] The AI keeps returning to something I already corrected.
[ ] My messages are getting longer, not shorter, as I try to explain.

If any box is checked: stop. Open a new conversation. Restate from scratch.
```

The card includes a one-line reminder of the restate structure: Role + verb + specific thing + load-bearing fact + stopping condition + constraint.

**Why it reinforces the concept:**
The hardest part of this module isn't knowing that spirals are bad — it's catching yourself in one in real time. The checklist gives users a concrete moment to pause and apply a yes/no test. Without it, the spiral signals are things users recognise in retrospect. With it, users can apply them in the moment.

---

### Idea 2: The Spiral vs. Restate Comparison — Worked Timeline

**Format:** Worked example (visual or formatted text)

**What it contains / what the user does with it:**
A side-by-side comparison of two approaches to the same failed task. Left column: a realistic spiral — original prompt, first correction ("no, I meant..."), second correction ("actually..."), third correction ("still not right..."), final result (still off-target). Right column: a restate — what the user learned from the failed attempt, a single rewritten prompt that incorporates it, the result. The timeline format shows the total messages sent (6 vs. 2) and the quality of the final output.

The worked example uses a realistic task: drafting an internal announcement that kept coming out too formal.

**Why it reinforces the concept:**
Users often stay in spirals because leaving them feels like giving up work they've already done. Seeing the message count (6 vs. 2) and the output quality (still wrong vs. right first time) makes the efficiency argument concrete and immediate. The timeline also shows that the restate incorporates everything learned from the spiral — it's not abandonment, it's a distillation.

---

### Idea 3: The Restate Builder — Guided Prompt Reconstruction

**Format:** Guided exercise with fill-in structure

**What it contains / what the user does with it:**
The user finds a recent conversation that went into correction spiral. They fill in a four-question diagnostic:
1. What did the AI do on the first response that was wrong?
2. What did you actually need that you didn't state clearly enough?
3. What is the load-bearing fact you didn't include?
4. What constraint would have prevented the specific thing that went wrong?

The answers feed directly into the restate structure from the module. The exercise ends with the user writing the restate message and sending it in a new conversation. There's a final comparison: how does this first response compare to the conversation you just spent six messages in?

**Why it reinforces the concept:**
The module frames a failed conversation as a diagnostic — "the first attempt showed you what the AI will do if you leave something vague." The guided reconstruction forces the user to extract that diagnostic information explicitly, which turns a frustrating experience into a prompt-writing lesson. The four questions map directly to the module's framework so the user builds the bridge between "what went wrong" and "how to write the restate."

---

### Preferred pick: Idea 3 — The Restate Builder

The checklist (Idea 1) is genuinely useful as a real-time tool — I considered it as the preferred pick. But the module already gives users the three signals in clear prose, so a checklist is a slight reformatting rather than a new tool. The timeline comparison (Idea 2) is powerful for motivation but doesn't help users actually write the restate. The Restate Builder does both: it diagnoses the failed conversation and produces a better prompt. It's also the most directly action-generating — the user ends the exercise with a sent restate, not just a completed worksheet.

**Concerns:** This exercise requires the user to have a recent failed conversation to work from. The module acknowledges this ("if you do not have a recent conversation to look at, that is fine") and so does the exercise — but without a real example, this becomes hypothetical and loses most of its value. A note is needed: "If you don't have a recent spiral to work from, come back to this the next time one happens. It works best on a real one."

---

## LOG — E1 — E-04

The restate module is where I felt the most clarity about what intermediate users actually need. The plateau is not "I don't know what a correction spiral is." It's "I'm in one right now and I don't recognise it until I've sent five messages." The gap between knowing the rule and applying it in real time is large.

The checklist (Idea 1) is the right format for the real-time recognition problem. I almost picked it. But it competes too closely with what the module already does — the three signals are already stated clearly in the module and a checklist is just a reformatting. The Restate Builder adds something the module doesn't have: a structured process for turning the failed conversation into a better prompt.

The timeline comparison (Idea 2) was the most fun to think about — making the "6 messages vs. 2 messages" comparison concrete. But it's an illustration, not a tool. Illustrations are what the module is for.

I'm confident in Idea 3. The four diagnostic questions are the key insight: they turn a frustrating experience into data. That's the mindset shift the module is actually trying to produce.

---

## E-05: Get the Plan First

**Module concept in one sentence:** For multi-step tasks, asking for the plan before execution gives you a checkpoint to redirect before any work has been done.

---

### Idea 1: The Plan Review Checklist — What to Look For

**Format:** Plain-text checklist (four questions, applied to any AI plan)

**What it contains / what the user does with it:**
After sending Message 1 and receiving the plan, the user applies this checklist before sending Message 2:

```
When you receive the plan, ask:

[ ] Does the first step match what I actually need to happen first?
[ ] Is there a step I would need to undo later if the AI does it the way it's described?
[ ] Is anything missing that would cause the output to miss the point?
[ ] Is anything in the plan that I should do myself, not the AI?

One adjustment. Name the step. Send Message 2.
```

A note at the bottom: "If you have more than one adjustment, the brief in Message 1 needs more context — not more adjustments in Message 2."

**Why it reinforces the concept:**
The module gives users the two-message pattern but doesn't give them specific guidance on how to evaluate the plan in the gap between messages. Most intermediate users will scan the plan and nod along without critically reading it — because they don't know what they're looking for. The four questions turn "review the plan" from a passive step into an active one.

---

### Idea 2: The Plan-First Decision Rule

**Format:** Single-line decision rule on a pocket reference card

**What it contains / what the user does with it:**
A simple rule the user can apply before starting any AI task:

> "If the task has more than two steps, or if getting the structure wrong would mean starting over — ask for the plan first."

The card also includes the two-message starters from the module (verbatim) plus three worked examples of what "asking for the plan first" looks like for the user's common task types:
- Restructuring a document
- Writing a report
- Drafting a sequence of communications

For each example, Message 1 is shown in full, and a sample plan response is described (not shown verbatim — described in two sentences). The card ends with a prompt: "Add your own task type here: ___"

**Why it reinforces the concept:**
The module gives the rule ("more than two steps") and the module gives the starters. The gap is: users don't apply it because they don't immediately recognise when a task qualifies. Worked examples for three common task types train pattern recognition faster than the rule alone.

---

### Idea 3: The Single Adjustment Practice — Five Scenarios

**Format:** Practice exercise (five scenarios)

**What it contains / what the user does with it:**
Five fictional plans — each one a four-step plan an AI might produce for a real-sounding task. Each plan has one deliberate problem: a step in the wrong order, a step that makes an assumption you didn't ask for, a step missing something the user would know from their real situation. The user reads each plan, identifies the single thing to adjust, and writes Message 2 ("Good. Change step X to..."). Worked answers are included for steps 3-5 but hidden for steps 1-2 so the user has to commit first.

Example scenario:
> Task: Write a case study about a recent client win.
> Plan: 1. Gather background on the client and industry. 2. Interview the client contact. 3. Write a 600-word case study. 4. Include a quote from the client.
> What would you adjust? ___

**Why it reinforces the concept:**
The skill being taught isn't just "ask for the plan" — it's "evaluate the plan and make one targeted adjustment." That second half is surprisingly hard: most intermediate users either approve the plan wholesale or want to rewrite it entirely. The five scenarios train the specific skill of identifying the one thing to change — which is what keeps Message 2 short and the task on track.

---

### Preferred pick: Idea 3 — The Single Adjustment Practice

The plan review checklist (Idea 1) is a solid real-time tool, but it adds process to a step that should feel quick. The decision rule card (Idea 2) is useful for knowing when to use the pattern, but the module already gives that rule clearly. The single adjustment practice (Idea 3) trains the hardest and most underappreciated part of the module: making exactly one adjustment to a plan without over-correcting. This is where intermediate users plateau — they either rubber-stamp the plan or try to rewrite it in Message 2. Five practice scenarios with worked answers builds the calibration for "is this a one-step fix or a restate?" that takes weeks of natural use to develop.

**Concerns:** The worked examples need to be genuinely realistic — plans that could plausibly come from an AI. If the "problems" are too obvious, users won't need to think. If they're too subtle, users will miss them and feel frustrated. Calibration of difficulty is the main production risk here.

---

## LOG — E1 — E-05

This module was the one where I felt most like I was filling space on Idea 2. The decision rule card felt slightly thin — it's a reformatting of content that's already clearly stated in the module. I included it because it pairs naturally with the message starters, but I don't think it earns its place as a standalone supplement.

Idea 3 felt like genuine insight. The problem with "get the plan first" as a teaching goal is that it's two skills: (1) knowing when to use the pattern, and (2) knowing how to evaluate the plan. The module teaches both, but the exercises mostly focus on (1). Practicing (2) — making one targeted adjustment — is where the real control lives. Five scenarios is maybe one too many; three might be more appropriate for the reading level.

The checklist (Idea 1) is actually the kind of thing this track should produce more of — it's genuinely applicable in the moment. But for this module specifically, I think the practice scenarios do more distinctive work.

---

## E-06: Migration and Re-seed

**Module concept in one sentence:** When a conversation has run its course, closing it and writing a re-seed that carries only the essential context forward is faster than continuing in a degraded thread.

---

### Idea 1: The Re-seed Builder — Three-Slot Template with Decision Prompts

**Format:** Guided template (copy-paste and fill)

**What it contains / what the user does with it:**
The module's re-seed template expanded with decision prompts at each slot:

```
SLOT 1 — Role and context:
"I'm a [role]."
→ Same as your opening seed. One sentence. Don't add history.

SLOT 2 — What exists now (carry-forward):
"I've been working on [task] and [one sentence: what was decided or produced]."
→ What exists now that didn't before? A draft, a decision, a structure.
→ Load-bearing test: if you removed this sentence, would the AI produce something irrelevant? Yes = keep it.
→ If you want to write two sentences here, you need to pick one. Which one changes the output if it's missing?

SLOT 3 — New task:
"Now I need to [verb] [specific thing]. [Stopping condition]. [Constraint]."
→ Verb from E-01. Stopping condition from B-10. Constraint from E-02.
→ This is a fresh task, not a continuation. Write it as if the AI has no memory of what came before — because it doesn't.
```

**Why it reinforces the concept:**
The discipline of a re-seed is specifically about the carry-forward — what to include and what to leave behind. The module calls out the "one-sentence carry-forward" as the critical discipline. The decision prompts make that discipline active rather than assumed: the user has to consciously decide whether to keep or cut each piece of context.

---

### Idea 2: The Conversation Health Signals — Quick Reference

**Format:** Plain-text reference card (five signals)

**What it contains / what the user does with it:**
The five "re-seed signals" from the module, formatted as a quick self-check. The user applies this at any point mid-conversation when the responses are starting to feel less useful.

```
Time to re-seed? Check:

[ ] The AI repeated something I corrected two or three messages ago.
[ ] My messages are getting longer as I re-explain context.
[ ] The task has shifted — this is now really a different conversation.
[ ] I'm working around earlier mistakes rather than fixing them.
[ ] The responses feel generic rather than specific to my situation.

If any box is checked: write a re-seed. Start fresh.
```

One-line note: "You do not lose anything by starting fresh. The only continuity in AI use is what you carry forward yourself."

**Why it reinforces the concept:**
Like the E-04 spiral checklist, the value here is real-time recognition. The module lists the signals in prose; a checklist makes them scannable mid-session. The difference from E-04: the signals here are subtle (the AI being "safe" rather than specific is hard to name without a word for it). The checklist gives users a vocabulary for something they were already sensing but couldn't diagnose.

---

### Idea 3: The Re-seed vs. Continue Comparison — Three Conversation Scenarios

**Format:** Worked comparison set (three scenarios)

**What it contains / what the user does with it:**
Three realistic conversation extracts, each one showing a conversation that has gone long. For each scenario: a "bad" continuation attempt (the user tries to add context to recover the conversation) and a "good" re-seed (a clean three-part opening message). The comparison is side-by-side, with the message count shown. Scenario types: (1) task drift — started as an email rewrite, turned into a strategy discussion; (2) context decay — AI forgets an important constraint after 8 messages; (3) completion — task is done, user tries to add a second task instead of starting fresh.

The user reads all three, then writes a re-seed for a conversation they currently have open.

**Why it reinforces the concept:**
The module lists five re-seed signals, but most users will only clearly identify one of them — usually when the AI repeats something corrected. The three scenarios cover different failure modes (drift, decay, completion), giving users examples for signals they might not yet recognise in their own conversations.

---

### Preferred pick: Idea 1 — The Re-seed Builder

The conversation health checklist (Idea 2) is useful but feels like a near-duplicate of the E-04 spiral checklist — both are "when to stop and restart" signals, just at different stages. If both are produced, they should be considered as a pair. The comparison scenarios (Idea 3) are strong for building recognition but are teaching content, not a reusable tool. The re-seed builder (Idea 1) is the thing users will actually reach for when they're writing the re-seed — the decision prompts at each slot do work that the module template alone doesn't do. The "if you want to write two sentences here, you need to pick one" prompt in Slot 2 is specifically the discipline the module is trying to build.

**Concerns:** The re-seed builder might encourage users to think of the re-seed as a form to fill rather than a piece of writing. The prompts are there to help, not to be followed mechanically. A note at the top: "Use these prompts to decide what to include — then write the re-seed as one flowing paragraph, not a list."

Also: there's something slightly awkward about E-04 and E-06 both producing "checklist of signals" type content (Ideas 1 and 2 for E-04; Idea 2 for E-06). If E2 also reaches for these formats, it might be worth combining them into a single "conversation health" reference rather than two separate checklists.

---

## LOG — E1 — E-06

E-06 and E-04 have a structural similarity that I kept noticing: both are about recognising a problem (spiral / run-its-course conversation) and taking a specific action (restate / re-seed). The supplementary content ideas naturally converged on similar formats: a checklist, a comparison, a builder.

The distinction I tried to maintain: E-04 is about catching a conversation going wrong; E-06 is about recognising a conversation that has gone right (task complete) or drifted. The re-seed is often not a rescue — it's a transition. That's subtler and the signals are harder to see. Scenario 3 in Idea 3 (completion — task done, user tries to add a second task) is probably the most underrepresented case in the course and might be the most practically useful.

The re-seed builder (Idea 1) felt clearest and most directly useful. The one-sentence carry-forward is where users make the most mistakes in practice — they want to include too much history because they're nervous the AI won't understand the context. The decision prompts force them to be surgical.

---

## E-07: Your Reference Card

**Module concept in one sentence:** A personal reference card written in your own words for your own most common tasks is the thing that replaces the course — and makes the learning stick.

---

### Idea 1: The Reference Card Skeleton — Blank Fill-in Version

**Format:** Plain-text document (copy-paste ready, five sections)

**What it contains / what the user does with it:**
A clean blank version of the five-section reference card structure from the module, with minimal prompting:

```
MY AI REFERENCE CARD

YOUR ROLE
"I'm a ___ at ___ and I work on ___."

YOUR THREE PRINCIPLES
1.
2.
3.

YOUR THREE TASK TEMPLATES

Task 1: ___
Opening seed: I'm a [your role]. [Verb] [specific thing]. [Context]. [Stopping condition]. [Constraint].

Task 2: ___
Opening seed:

Task 3: ___
Opening seed:

YOUR VERB SHORTLIST
Safe verbs you use:
Verbs to avoid:

YOUR RE-SEED TEMPLATE
"I'm a [your role]. I've been working on ___ and ___. Now I need to [verb] ___. [Stopping condition]. [Constraint]."
```

Includes a single note at the top: "Write for yourself, not for posterity. If a word on this card would confuse you in two weeks, change it. If a template is still too generic to be useful, make it more specific."

**Why it reinforces the concept:**
The module tells users to build the card but doesn't give them a blank to fill. Starting from a blank page is a friction point for many intermediate users — they know what sections they need but don't want to figure out the formatting. The skeleton removes that friction. The note about writing for yourself reiterates the module's own instruction in a different voice.

---

### Idea 2: The Reference Card Review — How to Know If It's Working

**Format:** Self-check exercise (four tests)

**What it contains / what the user does with it:**
After the user writes their reference card, they apply four tests:

1. **The 10-second test:** Open the card. Without reading it carefully, can you immediately see your role line and your three verbs? If not, the layout needs work.
2. **The task test:** Pick a task from your list that isn't one of your three templates. Can you adapt a template in under a minute? If not, the templates are too specific.
3. **The principle test:** Read your three principles aloud. Do they sound like you, or like the course? If they sound like the course, rewrite them in your own words.
4. **The gap test:** Use the card for one week. Which slot did you reach for most? Which slot did you ignore? The slot you ignore is either wrong for your work or not written clearly enough — update it.

**Why it reinforces the concept:**
The module says "a reference card that has been used once is worth ten times a reference card that has only been written." The review exercise operationalises that — it gives users a specific protocol for evaluating and updating the card rather than assuming they'll do so naturally. The gap test is the most important: it transforms the card from a completed artifact into a living document.

---

### Idea 3: The Principle Rewrite — From Course Language to Your Language

**Format:** Translation exercise (five examples + blank)

**What it contains / what the user does with it:**
Five course-language principles from across the E-track, each written first in the course's voice and then in three alternative "human" versions at different levels of informality. The user reads the alternatives and picks the one that sounds most like them — or writes their own.

Example:
> **Course version:** "Safe verbs have defined ceilings. Risky verbs delegate judgement."
> Version A (plain): "Don't use 'improve' — it means 'you decide what better looks like.'"
> Version B (practical): "Always start with fix, summarise, or draft. Avoid: improve, enhance, optimise."
> Version C (personal): "The first word is a promise. Make it specific."

Five principles covered: verb choice, the load-bearing test, front-loading constraints, plan-before-execute, re-seed timing.

**Why it reinforces the concept:**
The module explicitly says "in your own words, not the course's words." But intermediate users often don't know how to translate — they write their own words that are still basically the course's words with slight paraphrasing. Seeing three versions of the same principle modelled teaches them what "your own words" actually looks like. The exercise also functions as a final review of the five core concepts.

---

### Preferred pick: Idea 2 — The Reference Card Review

The skeleton (Idea 1) removes real friction but is essentially a blank template — useful, but it doesn't teach anything new and the module itself describes the five sections clearly. A user who reads the module carefully already knows what to build. The principle rewrite (Idea 3) is the most pedagogically interesting: it teaches users what "in your own words" looks like in practice. But it risks adding a reading exercise at the end of a track where the goal is to produce something.

The review exercise (Idea 2) is the supplement that keeps giving. The four tests — especially the gap test — turn the reference card from a one-time module output into an evolving document. That's the difference between a learner who completes the track and one who keeps improving: the habit of updating the reference card when a gap appears. The 10-second test is also the most immediately concrete piece of advice about card design anyone will encounter in this track.

**Concerns:** "One week" in the gap test is a long feedback loop. Users might not return to the course to do the gap test. Consider adding: "Note your first gap now — before you close the card — and add a reminder to update it." The review needs to be done at least once immediately, not just promised for later.

---

## LOG — E1 — E-07

E-07 is the synthesis module, which means the supplementary content risk is either (a) duplicating what the module already asks users to produce, or (b) adding process to something that should be simple. The module's instruction is essentially "now build the thing." Any supplement that makes that instruction more complicated is counterproductive.

I think Idea 2 (the review) threads the needle: it doesn't help the user build the card, it helps them test and improve it. That's additive. The gap test is the insight I'm most confident in — it turns the card into a feedback loop. The 10-second test is the practical thing that might never occur to a user without being told.

The principle rewrite (Idea 3) felt like genuine creative thinking on my part. The examples were fun to write, and the three-register approach (plain / practical / personal) is a real model for how to translate course language. But I'm not sure it belongs at E-07 rather than earlier in the track — it might work better as a mid-track supplement than a capstone one.

The skeleton (Idea 1) is the obvious supplement for this module and will be the obvious idea for E2 as well. If E2 picks it, fine — but I deliberately moved away from it because I think the review does more distinctive work.

---

## Overall observations for Phase 2 synthesis

**Patterns I noticed in my own brainstorm:**

1. **Checklists for real-time recognition; builders for production.** Most of the modules split into two needs: knowing when to apply the skill (checklists work), and actually applying it (builders/templates work). I tended to prefer the builders as preferred picks, but the checklists may be underweighted in the track's supplementary content as a whole.

2. **Three exercises that should be "one-time calibration" experiences, not recurring tools:** E-03 stripping exercise, E-04 restate builder, E-05 single adjustment practice. These are valuable but their value is in being done once, deeply, rather than repeatedly. The format should signal this.

3. **E-04 and E-06 overlap risk.** Both produce "spiral signals" style content. Worth discussing with E2 whether these should be combined into a single "conversation health" reference, or whether they should remain separate and cross-referenced.

4. **The gap between "knowing the rule" and "applying it in the moment."** This is where every module has its supplementary content opportunity. The learner who plateaus knows the rules. The learner who keeps improving applies them before they remember to — because the tools are already open.

5. **Format consistency across the track.** If every module gets a vocabulary card, every module gets a checklist, and every module gets an exercise, the supplementary content becomes its own course. The most useful outcome would be: two or three formats that recur across modules (so users don't have to learn new tools) with content that changes per module.
