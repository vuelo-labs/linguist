# Agent A1 — A-track Template Repo Brainstorm
*Phase 1: Independent brainstorm*
*Date: 2026-04-15*

---

## Overview: My Lens

I read every module before writing. My filter is: does the repo structure itself teach the concept, or is the concept just mentioned in the prompts? A great template repo should make it nearly impossible to complete the exercise without internalising the module's core idea. The folder structure, what's missing, what's already there — all of it should be deliberate.

I also kept the audience in mind throughout. These are people who just finished the Enabled User stage. They are not intimidated by AI, but they are new to terminals, file systems, and thinking about tokens. The repos should feel approachable and genuinely useful — not "practice tasks" dressed up as productivity tools.

One recurring instinct I rejected: over-scaffolding. There's a temptation to provide so much boilerplate that the learner just fills in blanks. The best repos leave meaningful gaps — places where the learner has to make a real decision using Claude Code, not just copy a template.

---

## A-00: Getting Started with Claude Code

**Core concept in one sentence:** First contact with Claude Code — the permission model, file reading/writing, and the crucial shift from chat to file system.

---

### Idea 1: `daily-brief`

**What the repo contains:**
```
daily-brief/
  CLAUDE.md             ← minimal stub: "This repo builds a daily brief. Read inputs/, write to brief/"
  README.md             ← explains the exercise and what "done" looks like
  inputs/
    notes.md            ← a page of raw, unstructured meeting notes / brain dump
    articles.md         ← 3 short article summaries pasted in as plain text
    tasks.txt           ← a plain list of to-dos
  brief/                ← empty folder with .gitkeep
  prompts/
    00-first-session.md ← annotated Copy-Personalise-Use prompt for the opening message
```

**What the learner does with Claude Code:**
Navigate to the repo, start Claude Code, and ask it to read the three input files and write a structured daily brief into `brief/today.md`. They must approve a Read call on each input file and a Write call on the output. The annotated prompt walks them through the `[role]`, `[filename]`, `[format]` substitutions from the module.

**Why this specifically teaches the module concept:**
You cannot get output without approving three Read calls and one Write call. The permission model is not explained — it is experienced as the mechanic of getting the thing done. The empty `brief/` folder makes the Write permission tangible: something that did not exist now exists. The inputs are deliberately messy, so the learner can't fake the exercise with knowledge from memory.

---

### Idea 2: `folder-read-tour`

**What the repo contains:**
```
folder-read-tour/
  README.md             ← step-by-step guide to the exercise
  project/
    overview.md         ← 300-word project description
    decisions.md        ← a list of 5 decisions already made (fictional project)
    open-questions.md   ← 4 unresolved questions
    status.txt          ← one-line current status
  prompts/
    00-read-and-report.md
    00-write-to-file.md
```

**What the learner does:**
First: ask Claude Code to summarise the project folder's contents — approving Read calls one by one. Second: ask Claude Code to write a single "project snapshot" file combining the key points. Observe the difference between approving a Read (read-only) and approving a Write (changes the folder).

**Why this teaches the concept:**
The distinction between read and write permission calls is the module's key practical skill. This repo creates a situation where both are necessary and clearly different. It also introduces the concept of a folder with multiple files — more realistic than a single-file exercise.

---

### Idea 3: `letter-editor`

**What the repo contains:**
```
letter-editor/
  README.md
  drafts/
    draft-01.md   ← a 400-word letter draft with obvious issues (too long, wrong tone, buried request)
  final/          ← empty
  prompts/
    00-first-read.md
    00-edit-to-file.md
```

**What the learner does:**
Ask Claude Code to read the draft, improve it according to specific instructions (shorten to 200 words, make the request explicit in the first paragraph, professional tone), and write the result to `final/letter.md`. They must approve the read and the write.

**Why this teaches the concept:**
A read-then-write-to-new-file workflow is the cleanest illustration of the permission model in action. The learner can compare the input and output files side-by-side in their editor — a satisfying "before/after" that makes the model's role concrete.

---

**My strongest pick: `daily-brief`**

It's the only one that has immediate personal value to the learner. Most people have some version of a notes file, an article pile, and a task list. The exercise produces something genuinely useful — a brief they might actually send or act on — rather than a contrived edit. It also sets up a habit that could become a real workflow, which gives it retention value.

**Concern:** The inputs need to be realistic enough to feel like the learner's own stuff but generic enough to work for anyone. The notes.md in particular needs care — if it's too domain-specific it will feel foreign.

---

## LOG — A1 — A-00

**Initial instinct:** I immediately thought of something with personal notes, because A-00 is explicitly about the transition from chat to file system. The moment that matters is: "I have files. Claude Code can read them. Let me see it happen." That pointed me toward something with real content to read.

**What I considered and rejected:** I almost did a "file inventory" repo — ask Claude Code to list and describe everything in a folder. But that's too passive. It doesn't exercise the Write permission, which is half the point. I also considered a code-focused repo, but A-00 explicitly serves both technical and non-technical learners, so a generic document workflow is safer.

**What swayed me:** The module itself includes "summarise README.md in 5 bullet points" as the first-session example. My `daily-brief` is that example scaled up — more inputs, more structure, a real output — which makes it a natural extension of what the module already teaches rather than something foreign.

---

## A-01: Mental Model Refresher

**Core concept in one sentence:** Claude Code executes your text, not your intent — understanding this, plus the finite context window and the tool layer, is the mental model that makes every other module make sense.

---

### Idea 1: `spec-sharpener`

**What the repo contains:**
```
spec-sharpener/
  CLAUDE.md             ← "This repo is for practising precise instruction. Each task has a vague version and a sharp version."
  README.md
  tasks/
    task-01-vague.md    ← "Fix the report structure."
    task-01-sharp.md    ← intentionally left blank for the learner to write
    task-02-vague.md    ← "Research the market."
    task-02-sharp.md    ← blank
    task-03-vague.md    ← "Clean up this document."
    task-03-sharp.md    ← blank
  reference/
    vague-sharp-examples.md   ← worked examples from the module (Without/With pairs)
  prompts/
    01-sharpen-this-task.md   ← annotated prompt for the sharpening exercise
```

**What the learner does:**
Read each `vague` file. Rewrite the instruction as a sharp, precise message using the mental model from A-01 (explicit verb, named target, named tool, stated constraints). Write the sharpened version into the corresponding `sharp` file. Then test both versions in Claude Code and compare results.

**Why this teaches the concept:**
Part 1 of the mental model is "Claude Code executes your text, not your intent." This repo makes the gap between vague and precise instructions the literal subject of every exercise. The before/after structure mirrors the module's Without/With format. The learner is not just reading about the principle — they are rewriting instructions until they are precise enough to produce the right output.

---

### Idea 2: `constraint-lab`

**What the repo contains:**
```
constraint-lab/
  CLAUDE.md
  README.md
  documents/
    report.md       ← 600-word report with a clear structure
    notes.md        ← unstructured meeting notes
    email.md        ← draft email with multiple problems
  exercises/
    ex-01-no-constraint.md     ← task description, no constraints
    ex-01-with-constraint.md   ← blank — learner writes this
    ex-02-no-constraint.md
    ex-02-with-constraint.md
  prompts/
    01-add-constraints.md
```

**What the learner does:**
Run each "no-constraint" task. Observe what Claude Code produces. Then add constraints to the same task and run it again. Compare the outputs. Document what changed in the `with-constraint` file.

**Why this teaches the concept:**
The finite context window and constraint-survival concepts from Part 2 of the mental model are practised here: constraints stated explicitly vs buried in conversation. The side-by-side comparison makes the difference visible.

---

### Idea 3: `tool-call-observer`

**What the repo contains:**
```
tool-call-observer/
  CLAUDE.md
  README.md
  project/
    README.md
    data.csv
    notes/
      session-1.md
      session-2.md
  exercises/
    ex-vague.md     ← "Find out what this project is about."
    ex-precise.md   ← "Read README.md and tell me what this project is about."
  observation-log.md  ← blank template for the learner to fill in
  prompts/
    01-observe-tool-calls.md
```

**What the learner does:**
Run the vague task first. Count the tool calls Claude Code makes. Observe which tool it uses, which files it reads. Then run the precise task. Count again. Fill in `observation-log.md` with what they noticed. The exercise makes Part 3 of the mental model — tools are the action layer — viscerally visible.

**Why this teaches the concept:**
Part 3 of the mental model is "tools are how Claude Code acts in the world." The only way to understand this is to watch it happen. This repo creates a controlled comparison: vague instruction generates a long, expensive tool chain; precise instruction generates one targeted call.

---

**My strongest pick: `spec-sharpener`**

The module's core claim is that "Claude Code executes your text, not your intent." The way to internalise that is to write vague instructions, run them, see the wrong output, then fix the instructions until they work. `spec-sharpener` creates that loop directly. It's also the most reusable repo — the learner can add their own vague tasks and practice on them indefinitely.

**Concern:** `tool-call-observer` is good for the technically-minded learner who finds watching tool calls fascinating. For the non-technical learner it might feel like busywork. `spec-sharpener` works for both because it's about the quality of writing, not the mechanics of the tool layer.

---

## LOG — A1 — A-01

**Initial instinct:** The three-part mental model is intellectual — it's about understanding, not just doing. Template repos for understanding are harder than repos for skills. My first instinct was to make the exercise comparative: run the same task two ways and observe the difference. That survived to become all three ideas.

**What I considered and rejected:** I considered a "constraint survival test" where you set a constraint, run a 20-turn session, and check if it persists. But this is properly A-04 territory (compaction), not A-01. A-01 is explicitly about the mental model, not the technique. I had to be careful not to bleed into later modules.

**What swayed me:** The module explicitly uses Without/With examples to teach each part of the model. My `spec-sharpener` is a repo-version of those examples — same format, interactive. That alignment felt right.

---

## A-02: Cost, Tokens, and What Things Actually Cost

**Core concept in one sentence:** Every token costs money — understanding what drives session cost lets you make deliberate decisions before you start, not after you've seen the bill.

---

### Idea 1: `cost-diary`

**What the repo contains:**
```
cost-diary/
  CLAUDE.md         ← "This project is for tracking and understanding Claude Code session costs."
  README.md         ← explains the exercise and what to record
  sessions/
    template.md     ← blank session record: date, task, estimated tokens, actual tokens, cost, notes
    example-01.md   ← filled-in example: short session, 5 messages, few tool calls
    example-02.md   ← filled-in example: long session, 30 messages, many file reads
  reference/
    cost-benchmarks.md          ← the rough benchmarks from the module (copied in for easy reference)
    what-makes-sessions-expensive.md   ← the four drivers from the module
  prompts/
    02-pre-session-estimate.md    ← annotated prompt: estimate before starting
    02-post-session-review.md     ← annotated prompt: review usage after
```

**What the learner does:**
Before each Claude Code session they run over the next week: fill in the estimate fields in a new session record. After the session: fill in the actual token counts from Claude Code's output. Over 3–5 sessions, a pattern emerges. The reference files give them the vocabulary to explain why expensive sessions cost what they did.

**Why this teaches the concept:**
Cost awareness is a habit, not a fact. Reading about benchmarks doesn't build the habit — recording your own sessions does. This repo makes the module's pre-session checklist a literal form to fill in before starting. After three sessions, the learner has real data connecting their behaviour (tool calls, session length, file size) to actual cost.

---

### Idea 2: `token-weight-test`

**What the repo contains:**
```
token-weight-test/
  CLAUDE.md
  README.md
  documents/
    small.md      ← 200-word document
    medium.md     ← 2,000-word document
    large.md      ← 8,000-word document (a realistic long report)
  exercises/
    ex-01-read-small.md    ← prompt: read small.md, ask a question about it
    ex-02-read-large.md    ← prompt: read large.md, ask the same question
    ex-03-targeted.md      ← prompt: read only the relevant section of large.md
  observation-log.md       ← blank template: record token counts for each exercise
  prompts/
    02-compare-reads.md
```

**What the learner does:**
Run all three exercises. After each, record the input token count from Claude Code's output in `observation-log.md`. Compare: reading 200 words vs 8,000 words vs a targeted section of 8,000 words. The numbers make the "give it what it needs, not everything you have" principle concrete.

**Why this teaches the concept:**
The module says "sharing a 50-page report costs more than sharing one page." This exercise makes that true in the learner's own session, with their own numbers. It also demonstrates the value of targeted requests — exercise 3 (read only the section) should cost significantly less than exercise 2 (read the full document) while producing the same answer.

---

### Idea 3: `session-budget-planner`

**What the repo contains:**
```
session-budget-planner/
  CLAUDE.md
  README.md
  planner/
    budget-template.md      ← the four pre-session questions from the module, formatted as a form
    example-plan.md         ← filled-in example for a realistic medium session
  reference/
    cost-drivers.md         ← the four cost drivers from the module
    mental-budget-guide.md  ← the rough benchmarks, formatted as a decision guide
  archive/                  ← empty, for storing completed plans
  prompts/
    02-plan-this-session.md ← prompt to ask Claude Code to review your plan and flag risks
```

**What the learner does:**
Before any Claude Code session this week, copy `budget-template.md` into `archive/`, fill it in, and then run the session. Afterwards, add actual cost. The `02-plan-this-session.md` prompt lets them ask Claude Code itself to review a proposed session plan and flag whether it sounds cheap or expensive.

**Why this teaches the concept:**
The module's framing is "use it with intention, not surprises." The planner repo operationalises that framing. The meta-moment — using Claude Code to review a plan for a Claude Code session — is also a nice illustration of the tool's self-awareness about costs.

---

**My strongest pick: `cost-diary`**

Token counting is abstract until you see your own numbers. The diary creates a feedback loop: predict, run, record, repeat. After 3–5 sessions the learner has a personal dataset that makes the benchmarks from the module real. The other two repos are useful but they're exercises rather than habits — `cost-diary` builds something the learner might actually keep.

**Concern:** `token-weight-test` could be the first exercise that costs a noticeable amount of tokens (reading an 8,000-word document). The README needs a clear cost warning and a way to do the exercise with smaller files if they want to reduce cost.

---

## LOG — A1 — A-02

**Initial instinct:** Cost is an anxious topic for new Claude Code users. The module does a good job of making it not-scary. My first instinct was to make the repo feel calm and informational rather than alarming — a diary, a planner, a ledger. Not "don't spend money" but "know what you're spending and why."

**What I considered and rejected:** I thought about a repo that runs token counting scripts. But the module explicitly says "for current per-token rates, check anthropic.com/pricing" — it doesn't want to give hard numbers. Scripted token counting would be too clever and might mislead people if prices change.

**What swayed me:** The module says "set a budget before your next session." That's the action it asks for. `cost-diary` is the lightest possible operationalisation of that action — a template to fill in before you start.

---

## A-03: CLAUDE.md — Your Persistent Instructions

**Core concept in one sentence:** CLAUDE.md is where you store standing rules so you stop repeating yourself — and learning to write a good one is the skill.

---

### Idea 1: `claude-md-workshop`

**What the repo contains:**
```
claude-md-workshop/
  README.md             ← explains the exercise: write, test, iterate
  CLAUDE.md             ← stub: "# CLAUDE.md — replace this with your own rules"
  reference/
    bad-claude-md.md    ← example of a CLAUDE.md with vague, untestable rules
    good-claude-md.md   ← example with specific, testable rules
    rule-audit.md       ← a checklist: is each rule specific? testable? standing (not task-specific)?
  test-tasks/
    task-01.md          ← a task designed to trigger one of the example rules
    task-02.md          ← a task that reveals whether a rule about tone is working
    task-03.md          ← a task that reveals whether a constraint about files is active
  prompts/
    03-write-your-rules.md
    03-test-a-rule.md
```

**What the learner does:**
Read the bad and good examples. Write their own CLAUDE.md using the module's template. Test it by running the test tasks and checking whether the rules had the intended effect. Use the rule-audit checklist to review each rule they wrote.

**Why this teaches the concept:**
Writing good CLAUDE.md rules is a skill with common failure modes (vague, task-specific, over-long). This repo makes those failure modes visible through comparison and auditing before the learner discovers them the hard way in a real session.

---

### Idea 2: `writing-style-guide`

**What the repo contains:**
```
writing-style-guide/
  CLAUDE.md             ← stub for the learner to fill in
  README.md
  style/
    current-style.md    ← "These are my writing preferences" — 5 principles, informal language
    anti-patterns.md    ← things this writer consistently dislikes seeing in AI output
  drafts/
    test-draft-01.txt   ← raw notes to turn into a short piece
    test-draft-02.txt   ← another set of raw notes
  output/               ← empty
  prompts/
    03-translate-style-to-rules.md   ← prompt to turn current-style.md into CLAUDE.md rules
    03-test-style.md
```

**What the learner does:**
Use Claude Code with the `translate-style-to-rules.md` prompt to turn their informal style preferences into formal CLAUDE.md rules. Write those rules into the CLAUDE.md stub. Then run the test drafts and check whether the output matches their style preferences.

**Why this teaches the concept:**
This repo closes the gap between "here's what I prefer" and "here's how to write that as a testable rule." Many learners know what they want but don't know how to express it in a way Claude Code will reliably follow. The exercise makes that translation process the explicit skill being practised.

---

### Idea 3: `project-brief-builder`

**What the repo contains:**
```
project-brief-builder/
  CLAUDE.md             ← stub
  README.md
  project/
    description.md      ← 200-word description of a fictional project (generic enough to adapt)
    conventions.md      ← a list of conventions for this project (naming, file structure, terminology)
    boundaries.md       ← what Claude Code should never touch in this project
  reference/
    claude-md-template.md   ← the Copy-Personalise-Use template from the module
  prompts/
    03-build-from-project.md    ← prompt to synthesise project files into CLAUDE.md rules
    03-verify-active.md         ← prompt to confirm CLAUDE.md is loaded and active
```

**What the learner does:**
Use `build-from-project.md` to ask Claude Code to read the three project files and synthesise them into CLAUDE.md rules. Review the generated rules. Edit them. Then test whether they're active in a fresh session using the verification prompt.

**Why this teaches the concept:**
Real projects have existing conventions, boundaries, and preferences that aren't written as Claude Code rules. This exercise teaches the learner to extract standing rules from existing project documentation — a skill they'll use every time they set up a new project in Claude Code.

---

**My strongest pick: `writing-style-guide`**

Most learners in the A-track have writing-heavy workflows (that's who takes an AI literacy course). The style guide problem — "I know what I want but I can't express it as rules" — is one they've almost certainly felt. The repo is also self-contained and immediately personal: you're working with your own preferences, not fictional project conventions.

**Concern:** `project-brief-builder` is the most broadly applicable, but it requires the learner to engage with a fictional project they don't care about. The ideas that work best in this track are ones where the learner is working on their own stuff.

---

## LOG — A1 — A-03

**Initial instinct:** CLAUDE.md is a meta-skill: it's about writing instructions that teach the tool how to behave. The instinct was to make the exercise about the quality of the rules, not just the act of writing them. Good rules are specific and testable. Bad rules are vague. That drove all three ideas.

**What I considered and rejected:** I thought about a "CLAUDE.md version history" repo where you write, test, improve over multiple sessions. But that's A-04/A-05 territory (long sessions, iteration). A-03's scope is specifically writing your first CLAUDE.md and observing its effect — not refining it over weeks.

**What swayed me:** The module's exercise is literally "write three to five rules, test them, iterate." My `writing-style-guide` is that exercise with a personal, high-value domain (your own writing style) and a bridge over the "I don't know how to turn preferences into rules" gap.

---

## A-04: Context Awareness and Compaction

**Core concept in one sentence:** Compaction is automatic and lossy — learning to write messages that survive it, and to checkpoint before it fires, is what separates practitioners from beginners.

---

### Idea 1: `constraint-survival-test`

**What the repo contains:**
```
constraint-survival-test/
  CLAUDE.md
  README.md
  task/
    long-task.md          ← a substantial writing or research task that will take 8-12 turns
    constraints.md        ← 3 constraints to set at the start of the session (pre-written for learner)
    survival-report.md    ← blank template: did each constraint survive? where did rot appear?
  reference/
    compaction-checklist.md   ← the survival checklist from the module
    context-rot-signals.md    ← the symptoms table from the module
  prompts/
    04-set-constraints.md     ← the opening constraint message, annotated
    04-checkpoint.md          ← the checkpoint prompt from Copy-Personalise-Use
    04-restate-constraint.md  ← the constraint restatement prompt for when rot is detected
```

**What the learner does:**
Set the three constraints using the opening message. Work through the long task for 8–12 turns. Send the checkpoint prompt partway through. Check whether the constraints appear in Claude Code's summary. Fill in `survival-report.md`. If a constraint is missing, restate it using the restatement prompt and continue.

**Why this teaches the concept:**
The only way to understand compaction is to experience it. This repo is set up to give the learner a session long enough that something will almost certainly drift. The survival report and checkpoint prompt make the experience structured rather than just confusing.

---

### Idea 2: `long-document-build`

**What the repo contains:**
```
long-document-build/
  CLAUDE.md
  README.md
  document/
    outline.md         ← a 5-section document outline (fictional but realistic: a strategy brief)
    section-01.md      ← blank
    section-02.md      ← blank
    section-03.md      ← blank
    section-04.md      ← blank
    section-05.md      ← blank
    style-rules.md     ← 4 style rules to apply throughout (the ones most likely to drift)
  prompts/
    04-open-with-constraints.md
    04-checkpoint-mid-document.md
    04-restate-after-drift.md
  completed/           ← empty, for final assembled document
```

**What the learner does:**
Build the document section by section across multiple turns. Apply the style rules from the start. After section 3, send the checkpoint and verify whether the style rules are still active. Complete sections 4 and 5. Assemble the final document in `completed/`.

**Why this teaches the concept:**
Long document production is a genuine use case where compaction matters. Style drift over a multi-section document is something the learner can detect by reading the output — the moment writing becomes less precise, or hedged, or the terminology shifts, is the moment to restate. This exercise makes that happen in a controlled, documentable way.

---

### Idea 3: `decision-log`

**What the repo contains:**
```
decision-log/
  CLAUDE.md
  README.md
  project/
    brief.md           ← a project description requiring several decisions to be made
    decisions/
      decided.md       ← blank — learner records confirmed decisions here
      pending.md       ← initial list of decisions to be made
  prompts/
    04-confirm-decision.md      ← the "Decision confirmed:" message format from the module
    04-checkpoint.md
  reference/
    what-survives-compaction.md   ← the survival/loss lists from the module
```

**What the learner does:**
Work through the project brief, making decisions about how to approach it. After each decision is reached through dialogue, write a "Decision confirmed:" message in the format from the module and record it in `decided.md`. At a checkpoint, verify which decisions survived. This is the content-and-research version of the constraint survival exercise.

**Why this teaches the concept:**
The module's most specific advice is "when a decision is reached through dialogue, confirm it as a clean standalone statement." `decision-log` is a repo built around practising exactly that habit — not as a contrived exercise but as a record of real project decisions.

---

**My strongest pick: `long-document-build`**

It's the most practically useful repo in this module's set. Most learners in the A-track are doing writing-heavy work, and long documents are where compaction hurts most. The exercise is self-evidently valuable (you end up with a complete document) and the style drift experience is almost guaranteed to happen if they follow the exercise, which means the lesson about restating constraints is earned rather than simulated.

**Concern:** The long-task in `constraint-survival-test` needs to be carefully calibrated — too short and compaction won't fire, too long and the learner gets impatient. A-04 explicitly says "6–10 turns." The `long-document-build` naturally creates the right session length through the five-section structure.

---

## LOG — A1 — A-04

**Initial instinct:** Compaction is invisible by default — it happens and you don't notice until things go wrong. The repo needs to make compaction visible in a way that the learner can't miss. Every idea I wrote involves some kind of observation mechanism (survival report, style drift detection, decision log) precisely because the concept is easy to read about and easy to miss in practice.

**What I considered and rejected:** I thought about a technical "compaction stress test" with lots of tool calls. But the module explicitly has both coding and content examples — the audience is not all technical. I stayed with writing-focused scenarios. I also considered a repo that shows you the compacted summary directly, but there's no clean way to expose that in a repo structure — it's a live session artifact.

**What swayed me:** The module's exercise is explicitly "run a checkpoint." All three of my ideas include the checkpoint prompt. The strongest repo is the one where the checkpoint is most naturally motivated — where the learner genuinely wants to know if their constraints survived because the output would be noticeably wrong if they didn't.

---

## A-05: Session Hygiene

**Core concept in one sentence:** One task per session, /clear between tasks, and front-loaded constraints — these three habits prevent the conditions that make correction necessary.

---

### Idea 1: `multi-project-hub`

**What the repo contains:**
```
multi-project-hub/
  CLAUDE.md         ← user-level style: applies to all projects in this hub
  README.md         ← explains the hub structure and session hygiene principles
  projects/
    project-alpha/
      brief.md      ← 200-word project description and current status
      task-list.md  ← 5 tasks for this project
      output/       ← empty
    project-beta/
      brief.md
      task-list.md
      output/
    project-gamma/
      brief.md
      task-list.md
      output/
  session-log.md    ← blank template: date, project, task, /clear used? yes/no
  prompts/
    05-session-open.md    ← the scoped session opener from Copy-Personalise-Use
    05-session-close.md   ← a closing message to write before /clear
```

**What the learner does:**
Work through tasks across multiple projects over several days. Before each session, fill in one row of `session-log.md` with the scope. After finishing one project's task and before switching to another, practice using `/clear`. The session log builds a visible record of scope discipline.

**Why this teaches the concept:**
The module is about habits, not a single exercise. A hub with multiple projects creates genuine transitions where `/clear` is the right move — not a forced drill but a natural consequence of the structure. The session log makes the habit visible and reviewable.

---

### Idea 2: `single-task-sprints`

**What the repo contains:**
```
single-task-sprints/
  CLAUDE.md
  README.md
  sprint-template/
    scope.md        ← the session scope template from the module, pre-formatted
    constraints.md  ← blank constraints section
    done-when.md    ← blank done-state description
  sprints/
    sprint-01/      ← blank, ready for learner's first sprint
    sprint-02/      ← blank
    sprint-03/      ← blank
  reference/
    good-scope.md   ← 3 examples of well-scoped sessions
    bad-scope.md    ← 3 examples of vague, drifting sessions
  prompts/
    05-scope-this-session.md
```

**What the learner does:**
For each sprint: fill in the scope, constraints, and done-when template before opening Claude Code. Run the session. After it ends, review whether the session stayed on scope. Repeat for three sprints.

**Why this teaches the concept:**
The module's key practice is "scope the session before you start." This repo makes the scope document a required step — you physically fill it in before the session begins. The three-sprint structure creates repetition, which is what turns a principle into a habit.

---

### Idea 3: `context-reset-practice`

**What the repo contains:**
```
context-reset-practice/
  CLAUDE.md
  README.md
  task-a/
    brief.md        ← Task A (content task — draft a short piece)
    output/
  task-b/
    brief.md        ← Task B (research task — find and summarise something)
    output/
  task-c/
    brief.md        ← Task C (edit task — improve an existing document)
    input.md        ← draft to edit
    output/
  log.md            ← blank: did you use /clear between tasks? what changed?
  prompts/
    05-open-a.md
    05-open-b-after-clear.md  ← the re-seed format from the module
    05-open-c-after-clear.md
```

**What the learner does:**
Run Task A. Use `/clear`. Open Task B with the re-seed prompt format. Use `/clear` again. Open Task C. Document in `log.md` whether starting fresh felt different to carrying context forward.

**Why this teaches the concept:**
The module explicitly connects `/clear` to the re-seed format from E-06. This repo creates three distinct tasks that are genuinely unrelated, making the argument for `/clear` obvious rather than academic. The different task types (write, research, edit) create realistic transitions.

---

**My strongest pick: `multi-project-hub`**

Session hygiene is a habit that only makes sense in the context of ongoing work. A one-off exercise can teach the mechanics of `/clear`, but it can't teach the discipline of scoping. The hub gives the learner a real structure they might keep using — multiple projects, each with tasks — and makes session hygiene the natural operating procedure rather than an add-on skill.

**Concern:** Three fictional projects is more scaffolding to create than the other repos in this set. The project briefs need to be realistic enough that the learner doesn't feel like they're maintaining made-up work.

---

## LOG — A1 — A-05

**Initial instinct:** Session hygiene is a habit, not knowledge. The repo needs to create the conditions where the habit is practised repeatedly, not just once. That pushed me toward repos with multiple sessions built in.

**What I considered and rejected:** I considered a "bad session" repo — a deliberately messy, mixed-context session to clean up. But that's a recovery exercise, and the module is explicitly about prevention, not recovery (it says B-08 is for recovery). I stayed with prospective hygiene.

**What swayed me:** The module opens with "decide what one task this session is for before you open it." The hub repo makes that decision a literal step — you navigate to a project folder, read its task list, pick one, and open Claude Code. The directory structure enforces scope through its own logic.

---

## A-06: Output Engineering in Claude Code

**Core concept in one sentence:** Plan before you execute, and specify the format you want — these two habits together give you control over what Claude Code produces before it starts, not after.

---

### Idea 1: `plan-then-build`

**What the repo contains:**
```
plan-then-build/
  CLAUDE.md
  README.md
  tasks/
    task-01-complex.md    ← a multi-step task (restructure a report, touch 4 files)
    task-02-ambiguous.md  ← a task with architectural choice (two equally valid approaches)
    task-03-risky.md      ← a task where the wrong choice is hard to reverse
  plans/
    task-01-plan.md       ← blank — learner writes the plan they approved here
    task-02-plan.md       ← blank
    task-03-plan.md       ← blank
  reference/
    when-to-plan.md       ← the "when to separate plan from execution" list from the module
  prompts/
    06-planning-message.md    ← the planning starter from Copy-Personalise-Use
    06-approve-or-redirect.md ← how to respond to a plan you want to change
```

**What the learner does:**
For each task: send the planning message first. Review the plan. Write the approved plan into the corresponding `plans/` file. Then execute. Compare the executed output to the plan — did it match?

**Why this teaches the concept:**
The plan-before-execute habit is learned by doing it three times in a row with tasks that genuinely require it (complex, ambiguous, risky). Writing the plan into a file makes it explicit: this is what I approved, this is what was built, were they the same?

---

### Idea 2: `format-control-library`

**What the repo contains:**
```
format-control-library/
  CLAUDE.md
  README.md
  source/
    raw-research.md     ← 800 words of raw research notes, unformatted
    meeting-notes.md    ← unstructured meeting transcript
    data-summary.md     ← raw numbers and bullet points, no structure
  outputs/              ← empty
  format-cards/
    executive-summary.md    ← format spec: 100 words, one paragraph, no bullets, no headers
    briefing-doc.md         ← format spec: 3 sections, headers, max 300 words
    action-list.md          ← format spec: numbered list, max 10 items, 15 words per item
    slide-bullets.md        ← format spec: 5 bullets, max 12 words each, present tense
  prompts/
    06-format-control.md    ← the format control starter from the module
```

**What the learner does:**
Pick a source file. Pick a format card. Use the format control prompt to transform the source into that format. Repeat with different combinations. The format cards are reusable — learner builds a set they can apply to their own documents.

**Why this teaches the concept:**
The module says "when you need reasoning shown, a specific structure, a particular length, or a different register, you must ask for it." This repo provides a vocabulary of format specifications and a practice ground for using them. The format cards themselves are the output — learner ends with a reusable library.

---

### Idea 3: `structure-first-drafts`

**What the repo contains:**
```
structure-first-drafts/
  CLAUDE.md
  README.md
  topics/
    topic-01.md    ← raw notes on a topic (e.g. "quarterly results communication")
    topic-02.md    ← another topic with raw notes
    topic-03.md    ← another topic
  structures/      ← blank — learner writes approved structures here before drafting
  drafts/          ← blank — finished drafts go here
  reference/
    structure-options.md   ← 5 named document structures with descriptions
  prompts/
    06-propose-structures.md   ← ask Claude Code to propose 2 structures before drafting
    06-choose-and-draft.md
```

**What the learner does:**
For each topic: ask Claude Code to propose two document structures without drafting. Review the structures. Choose one. Write the chosen structure into `structures/`. Then ask Claude Code to draft using that structure.

**Why this teaches the concept:**
The Without/With content example in the module is exactly this: proposing structures before drafting, choosing before executing. This repo makes that pattern the entire workflow — every draft goes through a structure approval step first.

---

**My strongest pick: `format-control-library`**

Format control is the most immediately reusable skill from this module. The format cards concept gives the learner something they can actually keep and apply to their own work indefinitely — not just a repo exercise but a set of reusable specifications. It's also more immediately accessible to non-technical learners than `plan-then-build`, which has a more developer flavour (complex tasks touching multiple files).

**Concern:** `plan-then-build`'s tasks need to be genuinely complex enough to warrant the planning step. A trivial multi-step task won't motivate the habit. The task files need to be carefully written.

---

## LOG — A1 — A-06

**Initial instinct:** This module has two distinct skills: plan-before-execute and format control. My first instinct was to build a repo for each. That's how I ended up with `plan-then-build` and `format-control-library` as two distinct ideas. The third (`structure-first-drafts`) blends both.

**What I considered and rejected:** I thought about a repo that uses `/plan` mode explicitly. But the module is careful to say "/plan or just add instructions to your message — both work." I didn't want to over-privilege the mode flag.

**What swayed me:** The format cards concept came from noticing that the module gives a list of "format controls you can use" — a list of controls is naturally represented as cards or templates. Making those cards reusable and file-based felt like the right translation.

---

## A-07: Tool Fluency

**Core concept in one sentence:** Name the right tool in your message — Read, Glob, Grep, Bash, WebSearch — and Claude Code uses that tool precisely instead of escalating to a more expensive one.

---

### Idea 1: `codebase-explorer`

**What the repo contains:**
```
codebase-explorer/
  CLAUDE.md
  README.md
  project/
    src/
      components/    ← 8 small component files (.js or plain .txt)
      utils/         ← 5 utility files
      config/        ← 3 config files
    docs/
      README.md
      architecture.md
      changelog.md
    tests/           ← 6 test files
  exercises/
    ex-01-find-file.md       ← use Glob to find all config files
    ex-02-search-text.md     ← use Grep to find all mentions of "timeout"
    ex-03-read-one.md        ← use Read to open a specific utility file
    ex-04-bash-tail.md       ← use Bash to see last 10 lines of a log
    ex-05-compare-cost.md    ← run the same search vague vs named tool, compare tokens
  tool-log.md                ← blank: record which tool fired for each exercise
  prompts/
    07-name-the-tool.md      ← the Copy-Personalise-Use starter from the module
```

**What the learner does:**
Work through the five exercises in order. For each: write the message naming the tool before sending. After the tool call completes, record in `tool-log.md` which tool fired, what it found, and the approximate token count. Exercise 5 is the comparison — same search, vague vs named, token counts side by side.

**Why this teaches the concept:**
The tool hierarchy (Read/Glob/Grep cheaper than Bash/WebSearch much cheaper than Agent) is abstract until you see the tool calls fire in order. The exercises move through the hierarchy deliberately — cheapest to most expensive — and the tool log makes the pattern visible across all five.

---

### Idea 2: `research-folder`

**What the repo contains:**
```
research-folder/
  CLAUDE.md
  README.md
  sources/
    article-01.md    ← 600-word article on a topic
    article-02.md    ← 800-word article
    article-03.md    ← 500-word article
    notes-raw.md     ← 300 words of unstructured notes
    interview.md     ← 400-word interview transcript
  exercises/
    ex-01-find-mentions.md    ← Grep task: find all mentions of "retention"
    ex-02-read-source.md      ← Read task: read article-01 fully
    ex-03-find-files.md       ← Glob task: find all .md files in sources/
    ex-04-bash-wordcount.md   ← Bash task: count words in each file
  token-comparison.md         ← blank: record and compare token costs
  prompts/
    07-choose-right-tool.md
```

**What the learner does:**
Run each exercise, naming the tool explicitly in the message. Record the token count for each in `token-comparison.md`. After all four, rank the exercises by cost and check whether the ranking matches the cost hierarchy from the module.

**Why this teaches the concept:**
A research folder is a common non-technical use case. The exercises use the same content but different tools, making the cost differences visible on familiar material. The cost ranking exercise at the end makes the hierarchy concrete and personal.

---

### Idea 3: `tool-decision-cards`

**What the repo contains:**
```
tool-decision-cards/
  CLAUDE.md
  README.md
  project/
    mixed-files/   ← 10 files of various types and sizes
    logs/
      app.log      ← a realistic log file with multiple entries
  cards/
    read-card.md      ← when to use Read: conditions, examples, cost note
    glob-card.md      ← when to use Glob
    grep-card.md      ← when to use Grep
    bash-card.md      ← when to use Bash
    websearch-card.md ← when to use WebSearch
  exercises/
    decision-01.md   ← scenario: which tool? (answer not given)
    decision-02.md   ← scenario: which tool?
    decision-03.md   ← scenario: which tool?
    decision-04.md   ← scenario: which tool?
    decision-05.md   ← scenario: which tool?
  my-decisions.md    ← blank: learner writes their reasoning before checking
  prompts/
    07-justify-tool-choice.md   ← prompt to ask Claude Code to explain why it chose a tool
```

**What the learner does:**
Read each card. Read each decision scenario. Write down which tool they'd use and why in `my-decisions.md` — before running the exercise. Then run it with Claude Code and see which tool actually fires. Compare reasoning.

**Why this teaches the concept:**
Tool decision-making is a thinking skill before it's an execution skill. The pre-commit "which tool?" step forces the learner to apply the hierarchy consciously before the tool call runs. The comparison between predicted and actual tool choice reveals where intuition is solid and where it needs more practice.

---

**My strongest pick: `codebase-explorer`**

It exercises the full tool hierarchy in a single repo, in the right order, with a comparison exercise built in. The tool log creates a personal record of what each tool costs on a real-ish project structure. It works for both technical and non-technical learners — the "project" doesn't need to be code, the files could be any content.

**Concern:** The module carries a cost warning for A-07 specifically. The exercises need scope limits ("don't read the full files — just the matching lines") built into the prompts to keep costs predictable.

---

## LOG — A1 — A-07

**Initial instinct:** Tool fluency is the most technical module in the track before A-08. The instinct was to make the repo as concrete and observable as possible — not "understand the hierarchy" but "watch the hierarchy in action on a real project." The tool log and comparison exercise came from that.

**What I considered and rejected:** I thought about a terminal-heavy Bash-focused repo. But the module explicitly positions Bash as a last resort ("only reach for Bash when Read, Glob, and Grep genuinely cannot do what you need"). A repo that leads with Bash would contradict the module's message.

**What swayed me:** The module's exercise is literally "send the same request twice — once vague, once with named tool — and compare token counts." My `codebase-explorer` builds that comparison into Exercise 5. That alignment felt tight.

---

## A-08: Agent Delegation and Briefing

**Core concept in one sentence:** Delegation is for tasks that are independent, produce evaluable output, and would fill your main session with content you don't need — writing a tight 5-part brief is what makes it work.

---

### Idea 1: `research-pipeline`

**What the repo contains:**
```
research-pipeline/
  CLAUDE.md
  README.md
  pipeline/
    step-01-decide/
      delegation-test.md     ← the three-question test from the module
      task-a.md              ← candidate task (delegate or not?)
      task-b.md              ← candidate task (delegate or not?)
      task-c.md              ← candidate task (delegate or not?)
      my-decisions.md        ← blank: learner writes their reasoning
    step-02-brief/
      brief-template.md      ← the 5-part brief template from the module
      brief-example.md       ← filled-in example
      my-brief.md            ← blank: learner writes their brief here
    step-03-evaluate/
      evaluation-rubric.md   ← the 4 evaluation questions from the module
      my-evaluation.md       ← blank: learner evaluates the output here
  prompts/
    08-delegation-decision.md
    08-write-brief.md
    08-evaluate-output.md
```

**What the learner does:**
Work through the three steps in order: decide (which tasks are delegatable?), brief (write the 5-part brief for the chosen task), evaluate (did the output match the brief?). All three steps have templates and annotated prompts.

**Why this teaches the concept:**
The module has three distinct skills: the delegation decision, the brief, and the evaluation. This repo scaffolds all three as a pipeline — learner can't skip to the brief without completing the decision step. The evaluation rubric at the end creates a feedback loop on brief quality.

---

### Idea 2: `brief-quality-lab`

**What the repo contains:**
```
brief-quality-lab/
  CLAUDE.md
  README.md
  briefs/
    brief-weak-01.md   ← a poor brief (missing scope, vague goal, no format spec)
    brief-weak-02.md   ← another poor brief
    brief-strong-01.md ← a well-written brief as comparison
  your-briefs/         ← empty — learner writes their own briefs here
  tasks/
    task-for-brief-01.md   ← the actual task that brief-weak-01 was written for
    task-for-brief-02.md
  analysis/
    analysis-template.md   ← what part of the brief failed? why?
  reference/
    5-part-template.md     ← the brief template from the module
  prompts/
    08-diagnose-weak-brief.md   ← ask Claude Code to identify what's missing
    08-rewrite-brief.md
```

**What the learner does:**
Read each weak brief. Ask Claude Code (using the diagnose prompt) what's missing or wrong. Rewrite the brief using the 5-part template. Run the improved brief. Compare output quality.

**Why this teaches the concept:**
The module says "if the brief failed, identify what it got wrong, rewrite the affected part." This repo starts with failed briefs deliberately — learner learns what good looks like by diagnosing bad first. The weak briefs are calibrated to have the specific failures the module names (missing scope, vague goal, no format spec).

---

### Idea 3: `parallel-research-project`

**What the repo contains:**
```
parallel-research-project/
  CLAUDE.md
  README.md
  project/
    overview.md        ← a research project requiring 3 independent sub-investigations
    sub-task-a/
      task.md          ← independent research task A
      brief.md         ← blank — learner writes the brief
      output/          ← empty
    sub-task-b/
      task.md
      brief.md
      output/
    sub-task-c/
      task.md
      brief.md
      output/
    synthesis/         ← empty — final synthesis goes here
  reference/
    when-to-delegate.md   ← the delegation criteria from the module
    brief-template.md
  prompts/
    08-write-brief.md
    08-synthesise-results.md
```

**What the learner does:**
The three sub-tasks are deliberately designed to be independent of each other. The learner writes a brief for each, runs each as a sub-agent task, evaluates the output, and then synthesises the three results in the main session.

**Why this teaches the concept:**
The module mentions "multiple independent subtasks can run without depending on each other" as a prime use case for delegation. This repo creates that exact scenario. The synthesis step at the end demonstrates what you do with delegated output — bring it back to the main session for judgement.

---

**My strongest pick: `research-pipeline`**

The three-step pipeline is the module's actual structure: decide, brief, evaluate. A repo that scaffolds all three in sequence gives the learner the clearest possible path through the module's skills. The decision step is often what learners skip — they jump to briefing without asking whether the task is actually delegatable. The pipeline prevents that.

**Concern:** A-08 carries the highest cost warning in the track. The `research-pipeline` repo needs a prominent cost warning in the README, and the CLAUDE.md should include "delegate only after passing the delegation test." The `brief-quality-lab` idea is appealing precisely because it teaches through diagnosis rather than production — it might work better as an optional supplement or as the first step in the pipeline.

---

## LOG — A1 — A-08

**Initial instinct:** Delegation is where learners are most likely to make expensive mistakes. The instinct was to build the "go slow" structure in — make the delegation decision a required first step, not an optional one. All three ideas reflect that.

**What I considered and rejected:** I thought about a repo that uses GitHub issues as the delegation task — delegate a research task about a real codebase. But that requires external API access. I stayed fully file-system-based.

**What swayed me:** The module's own structure is three skills in order: decide, brief, evaluate. A repo that follows that structure exactly (`research-pipeline`) is the most direct translation of the module into a practice environment.

---

## A-09: Capstone: A Real Project

**Core concept in one sentence:** Apply all six prior habits — CLAUDE.md, scoped sessions, compaction management, output engineering, tool naming, and delegation — to a real piece of work you need to do.

---

### Idea 1: `personal-knowledge-base`

**What the repo contains:**
```
personal-knowledge-base/
  CLAUDE.md             ← stub with "replace this with your project rules"
  README.md             ← explains the capstone structure and required techniques checklist
  inbox/
    note-01.md          ← a raw note
    note-02.md          ← another note
    note-03.md
    note-04.md
    note-05.md
    article-clip-01.md
    article-clip-02.md
    article-clip-03.md
  organised/
    topics/             ← empty — learner builds topic structure here
    summaries/          ← empty
    index.md            ← blank — master index
  research/             ← empty — sub-agent research outputs land here
  sessions/
    session-plan.md     ← blank template for session scoping
  checklist.md          ← the six required techniques from the module, as a checklist
  prompts/
    09-open-session.md
    09-checkpoint.md
    09-delegate-research.md
    09-synthesise.md
```

**What the learner does:**
Build a structured knowledge base from the `inbox/` files. Requires: a CLAUDE.md (which rules apply to knowledge management work?), multiple scoped sessions (one to organise, one to summarise, one to build the index), at least one checkpoint, planning before restructuring, named tools for searching, and one delegated research task that adds new content to `research/`. Checklist in the repo confirms all six techniques were applied.

**Why this teaches the concept:**
The capstone's requirements (multiple sessions, files, real output) are built into the repo structure. The inbox of raw notes is designed to be useful to the learner even if they swap the synthetic notes for their own — which the README explicitly encourages. The checklist is the self-assessment mechanism from the module.

---

### Idea 2: `research-brief-builder`

**What the repo contains:**
```
research-brief-builder/
  CLAUDE.md             ← stub
  README.md
  raw-sources/
    source-01.md        ← a 1,000-word primary source
    source-02.md        ← 800-word source
    source-03.md        ← 600-word source
    source-04.md        ← 900-word source
    web-research/       ← empty — sub-agent web research lands here
  brief/
    sections/           ← empty — each section built separately
    final.md            ← empty — assembled brief
  session-plans/        ← empty — one plan per session
  checklist.md          ← six required techniques
  prompts/
    09-session-open.md
    09-plan-section.md
    09-checkpoint.md
    09-delegate-web.md
    09-assemble.md
```

**What the learner does:**
Build a structured research brief across 3–4 sessions. Session 1: read and organise sources. Session 2: draft sections 1–2 (with planning step). Session 3: draft sections 3–4, send checkpoint. Session 4: delegate a web research task, assemble final brief. Checklist at end.

**Why this teaches the concept:**
Research briefs require every technique in the track: CLAUDE.md for style rules, scoped sessions to avoid source-bleed, checkpoints in long drafting sessions, planning before restructuring, named tools for reading sources, delegation for web research. The multi-session nature is built into the task, not added artificially.

---

### Idea 3: `content-production-pipeline`

**What the repo contains:**
```
content-production-pipeline/
  CLAUDE.md             ← stub — designed to hold content style rules
  README.md
  pipeline/
    01-research/
      brief.md          ← what this content is for and who it's for
      sources/          ← empty — filled in session 1
      sub-agent-brief.md ← blank — learner writes sub-agent research brief
    02-outline/
      structure-options.md   ← blank — proposed structures go here
      approved-outline.md    ← blank — chosen structure goes here
    03-draft/
      sections/         ← empty
    04-edit/
      style-check.md    ← blank — style consistency check
      final.md          ← blank
  session-log.md        ← one row per session: scope, /clear used, techniques applied
  checklist.md          ← six required techniques
  prompts/
    09-research-brief.md
    09-propose-structure.md
    09-draft-section.md
    09-checkpoint.md
    09-style-check.md
```

**What the learner does:**
Build a complete piece of content through a four-phase pipeline: research (with sub-agent delegation), outline (plan-before-execute), draft (scoped sessions, checkpoints), and edit (tool-named style check). Each phase naturally exercises the techniques from the track.

**Why this teaches the concept:**
The pipeline structure forces the full toolkit — each phase calls for a different set of habits. It's also the most reusable repo: learner can reuse the pipeline structure for any piece of content they produce, making it a permanent workflow rather than a one-time exercise.

---

**My strongest pick: `personal-knowledge-base`**

The capstone needs to be genuinely useful, and a personal knowledge base built from one's own notes is universally relevant. The `inbox/` + `organised/` structure maps naturally to the multiple-session requirement, and the learner is explicitly invited to swap the synthetic notes for their own. It also demonstrates the full arc of Claude Code use: reading (Read/Grep), organising (Write), researching (delegation), and indexing (planning + output engineering). The checklist mechanism from the module is the right capstone self-assessment.

**Concern:** All three ideas here are large. The capstone is supposed to be large — the module says "at least two or three scoped sessions" — but the README needs to make it clear that the learner should pace themselves over days, not try to complete it in one sitting.

---

## LOG — A1 — A-09

**Initial instinct:** The capstone is explicitly "not an exercise with a correct answer" — it's real work. The tension is between a repo that's structured enough to guide the learner and open enough to let them do real work. All three ideas resolve this the same way: they provide a structure (folder layout, session plan, checklist) but fill the content slots with either synthetic material (that can be replaced) or blanks (that the learner populates).

**What I considered and rejected:** I considered a "capstone with code" option — build a small CLI tool. But the module explicitly says "if everything lives in your head, Claude Code has nothing to work with" and recommends "take a folder of notes, research, or documents you have been meaning to make sense of." That's clearly document/research work, not code.

**What swayed me:** The module's own recommended default project is "take a folder of notes or documents and build a structured brief from them." `personal-knowledge-base` is that project with structure added. I'm giving the learner the same project the module recommends, in a clean repo form with the prompts and checklist built in.

---

## Cross-cutting concerns and gaps

**Ideas that might be too similar across modules:** A-03 (`writing-style-guide`) and A-06 (`format-control-library`) both involve writing style. They're actually complementary — A-03 is about persistent rules, A-06 is about per-output format specification — but the reviewing agents should check that these don't feel redundant to learners doing the track sequentially.

**The technical/non-technical balance:** I deliberately mixed technical and non-technical examples within each module's three ideas. I don't think any module's set requires coding knowledge, but A-07 (`codebase-explorer`) skews technical in its framing (components, utils, config). An alternative framing with the same structure (research articles, notes, source documents) might be safer for the audience.

**Cost warnings:** Three modules (A-02, A-07, A-08) carry explicit cost warnings in the module content. The repos for those modules need prominent cost warnings in their READMEs and should include scope-limiting instructions in the prompts by default. I flagged this in the individual module notes but it should be a standard element when the pack is built.

**The biggest risk overall:** These repos are most valuable if the learner uses their own content. The strongest learning moment in every repo is when the learner swaps the synthetic material for something they actually care about. The READMEs should consistently invite this swap — not just mention it, but make it the default path.
