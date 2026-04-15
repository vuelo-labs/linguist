# Agent A3 — A-track Template Repo Brainstorm
*Phase 1: Independent brainstorm — Creative lens*
*Date: 2026-04-14*

---

## Preface — My Approach

My job here is to find projects that are genuinely motivating to open. A template repo needs to pass a simple test: when the learner sees the folder for the first time, do they want to finish it? That tension — a half-built thing you actually care about — is where real learning happens. I've read every module and tried to find the match between the concept being taught and a project that would make it vivid. I've also been honest about what I rejected and why.

---

## A-00: Getting Started with Claude Code

**Core concept:** First session, file reading/writing, permission model — Claude Code is a terminal tool that acts on your file system with your approval at each step.

---

### Idea 1 — `my-letter-archive`

**Name:** my-letter-archive

**What the repo contains:**
```
my-letter-archive/
  CLAUDE.md           (model CLAUDE.md: who you are, what this folder is for)
  README.md           (brief description of the project)
  inbox/
    letter-01.txt     (a sample letter — warm, personal tone, fictional)
    letter-02.txt     (another sample letter, different topic)
    letter-03.txt     (third sample — all three are pre-written, interesting to read)
  archive/
    (empty — waiting to be populated)
  prompts/
    01-read-a-letter.md   (annotated prompt: read one letter and summarise it)
    02-move-to-archive.md (annotated prompt: write a summary file to archive/)
```

**What the learner does:**
Opens Claude Code in the folder. Follows the annotated prompts to: read a letter (approves the Read tool call), summarise it, then ask Claude Code to write a summary file to the `archive/` folder (approves the Write call). Three real tool call approvals, one real file produced.

**Why this teaches the module concept:**
The permission model is invisible until you do it. This makes it concrete and satisfying: you read something, approve, you write something, approve. The "inbox to archive" metaphor is immediately legible to anyone — no technical framing required. The pre-written letters are pleasant enough to be worth reading, which makes the act of summarising feel real rather than arbitrary.

---

### Idea 2 — `field-notes-starter`

**Name:** field-notes-starter

**What the repo contains:**
```
field-notes-starter/
  CLAUDE.md           (standing instructions for field notes work)
  notes/
    2026-03-14.txt    (a day's worth of rough notes — deliberately messy)
    2026-03-21.txt    (another day — different topic)
    2026-03-28.txt    (third day)
  output/
    (empty)
  prompts/
    first-session.md  (annotated: read one file, ask for a structured summary)
```

**What the learner does:**
Starts their first Claude Code session in this folder. Reads one note file (approves the Read), asks Claude Code to produce a structured output, then writes it to `output/`. Ends the session.

**Why this teaches the module concept:**
Field notes are genuinely useful — this is the kind of thing learners might actually have. The messiness of the pre-written notes makes the "Claude Code reads my file" moment feel like real value, not a demo. It forces the first `/compact` understanding: one session, one file, one output.

---

### Idea 3 — `film-log`

**Name:** film-log

**What the repo contains:**
```
film-log/
  CLAUDE.md           (instructions: you are maintaining a personal film log)
  films/
    watched.txt       (15 film titles with one-line notes — messy, informal)
    want-to-watch.txt (another 10 titles, no notes)
  output/
    (empty)
  prompts/
    00-read-the-log.md          (annotated: read watched.txt)
    01-write-a-formatted-log.md (annotated: produce a formatted version in output/)
```

**What the learner does:**
Opens Claude Code. Reads `watched.txt` (approves the Read). Asks Claude Code to produce a formatted log file in `output/`. Approves the Write. Sees their messy list become a clean, structured document.

**Why this teaches the module concept:**
The before/after is viscerally satisfying — messy list to formatted document, all in one session. The permission model is demonstrated through two approvals that feel natural: I asked to read, it wants to read. I asked it to write, it wants to write. Nothing feels arbitrary. Non-technical learners will love this because the output is immediately personal.

**A3's pick:** Idea 3 — `film-log`. The satisfaction loop is the tightest. Before: messy list. After: clean document. Two tool calls, both obviously linked to the request. The personal subject matter makes it stickier than field notes or letters for most learners. The permission model is taught without the word "permission" appearing anywhere.

**Concerns:** The `watched.txt` needs to be pre-written with enough personality that learners want to read it — if it's generic it loses its charm. Also need to make sure the annotated prompts don't over-explain; they should feel like nudges, not instructions.

---

## LOG — A3 — A-00

Initial instinct: the key moment in A-00 is the first tool call approval — that "oh, it's asking me" moment. The template needs to create conditions where that moment lands. I considered a code file (too alienating for non-technical learners), a recipe collection (cute but light), a reading list, a travel notes folder. Rejected travel notes because it implies a kind of life experience not everyone has. Rejected recipe collection because writing about food to Claude Code feels low-stakes to the point of silly. Landed on three options that are genuinely personal but accessible. Film log won because the before/after is the sharpest and the subject matter is near-universal.

What I almost missed: the annotated prompts are load-bearing here. For A-00, these aren't just "try this prompt" — they're the first time the learner is navigating a terminal session with an AI. The prompts need to be written at the pace of someone who is a bit nervous.

---

## A-01: Mental Model Refresher

**Core concept:** Claude Code executes your text, not your intent; the context window is finite and degrades; tools are the action layer. Precision in your message is the only thing you control.

---

### Idea 1 — `ambiguity-audit`

**Name:** ambiguity-audit

**What the repo contains:**
```
ambiguity-audit/
  CLAUDE.md           (standing instructions: you are auditing your own prompts)
  prompts/
    vague/
      prompt-01.txt   ("Fix the summary")
      prompt-02.txt   ("Research our competitors")
      prompt-03.txt   ("Help me write the email")
    improved/
      (empty — learner writes their own versions here)
  documents/
    sample-summary.md (a paragraph of text to be "fixed" — deliberately vague target)
    competitor-notes.txt (rough notes about two companies)
    email-draft.txt   (a half-written email)
  output/
    (empty)
  prompts/
    exercise.md       (annotated: run a vague prompt, observe the result, improve it)
```

**What the learner does:**
Runs the vague prompt against the actual file. Observes what Claude Code decides. Then rewrites the prompt with explicit constraints and re-runs it. Compares the results. Writes their improved version to `improved/`.

**Why this teaches the module concept:**
The three-part mental model from A-01 is illustrated by contrast. The vague prompt is not a hypothetical — the learner sends it and sees what Claude Code actually does. The improved version is not suggested by the course — the learner writes it. The concept "Claude Code executes text, not intent" becomes visceral rather than theoretical.

---

### Idea 2 — `constraint-lab`

**Name:** constraint-lab

**What the repo contains:**
```
constraint-lab/
  CLAUDE.md           (instructions: this is an experiment, not a production task)
  scenarios/
    01-the-modal-fix/
      component.txt   (a description of a modal component — as a plain text brief)
      vague-prompt.md (annotated: "Fix the modal" — explains what's wrong with it)
      notes.md        (space for the learner's observations)
    02-the-research-task/
      brief.txt       (Notion positioning scenario)
      vague-prompt.md (annotated: "Research how Notion positions their product")
      notes.md
  output/
    (empty)
```

**What the learner does:**
Runs each vague prompt. Writes down what Claude Code did versus what was intended. Then rewrites each prompt with explicit constraints and re-runs. Writes observations to `notes.md`.

**Why this teaches the module concept:**
Directly mirrors the Without/With structure from A-01. Learners live through the gap between intent and execution rather than reading about it. The annotation on each vague prompt is the teaching — it explains why the prompt is vague before the learner sends it.

---

### Idea 3 — `recipe-for-a-good-session`

**Name:** recipe-for-a-good-session

**What the repo contains:**
```
recipe-for-a-good-session/
  CLAUDE.md                     (itself a worked example of good standing instructions)
  ingredients/
    meeting-notes.txt           (a real-feeling meeting transcript — 400 words)
    draft-email.txt             (a half-written follow-up email)
    style-guide.txt             (simple style preferences — three rules)
  prompts/
    01-vague.md                 (annotated: send this vague request first)
    02-with-context.md          (annotated: same request, but with the style guide loaded)
    03-with-tool-named.md       (annotated: same request, with explicit tool + target)
  output/
    (empty)
```

**What the learner does:**
Runs the same task three times, each with a different level of message quality. Sees the output change. The third version — with tool named, context loaded, format specified — produces the best result with the fewest tokens.

**Why this teaches the module concept:**
The three-part mental model is taught as three rounds of the same task. Round 1 = vague text executes badly. Round 2 = context loaded, better. Round 3 = tool named and explicit, best. The learner experiences all three parts of the mental model in sequence, on the same material.

**A3's pick:** Idea 3 — `recipe-for-a-good-session`. Running the same task three times on the same material is the most direct demonstration of the three-part mental model. It has a clear before-and-after, costs little (three short sessions), and produces output the learner can compare side-by-side. The meeting notes + follow-up email scenario is highly relatable.

**Concerns:** The meeting notes need to be realistic enough to care about but short enough to not bloat the context. 400 words feels right. Risk: learners skip round 1 and 2 because they "get it already." The annotation should explain why you have to run the bad version too.

---

## LOG — A3 — A-01

Initial instinct: this module is about contrast — vague vs. precise, intent vs. text. The exercise needs to create a situation where the learner feels the difference rather than just reads about it. I considered a pure constraint-writing exercise (too dry), a template for annotating bad prompts (interesting but feels like homework), and the three-round approach. Rejected the annotation-only approach because it's passive. The three-round approach works because it's active and comparative — you run the bad version on purpose to see what happens, which is both educational and slightly satisfying in a rubbernecking way.

---

## A-02: Cost, Tokens, and What Things Actually Cost

**Core concept:** Tokens are money; long context, many tool calls, long sessions, and agent delegation each drive cost in predictable ways; learn to estimate before you start and read usage after.

---

### Idea 1 — `cost-detective`

**Name:** cost-detective

**What the repo contains:**
```
cost-detective/
  CLAUDE.md           (instructions: this is a cost investigation, record everything)
  cases/
    case-01-the-big-file/
      large-doc.txt   (a 2,000-word document — realistic size)
      small-excerpt.txt (just the relevant 200-word section)
      brief.md        (annotated: run both, compare token counts)
    case-02-the-vague-search/
      folder/
        doc-a.txt
        doc-b.txt
        doc-c.txt
      brief.md        (annotated: vague request first, then named file request)
    case-03-the-long-session/
      brief.md        (annotated: run 10 back-and-forth turns, check the token trend)
  log/
    session-log.md    (empty template: date, session type, input tokens, output tokens, notes)
```

**What the learner does:**
Works through three cases, each designed to illustrate one cost driver. Records token counts in the session log. Builds their own intuition about what a session actually costs by doing it, not by reading about it.

**Why this teaches the module concept:**
A-02 is fundamentally about building intuition through worked examples. The "cost detective" framing turns token counting from a chore into a puzzle. The log file creates a habit: record your usage. The three cases isolate the three main cost drivers (long context, vague search, long sessions) so each one is experienced separately.

---

### Idea 2 — `my-session-budget`

**Name:** my-session-budget

**What the repo contains:**
```
my-session-budget/
  CLAUDE.md           (standing instructions: always record token usage for sessions in this folder)
  tasks/
    task-01.md        (a short, focused task description — summarise this document)
    task-02.md        (a medium task — compare two documents)
    task-03.md        (a longer task — research + summarise)
  documents/
    doc-a.txt         (short document, ~300 words)
    doc-b.txt         (medium document, ~800 words)
    doc-c.txt         (longer document, ~2,000 words)
  budget/
    estimates.md      (template: before each session, write your estimate)
    actuals.md        (empty: fill in after each session from the token counter)
```

**What the learner does:**
Before each task, writes a cost estimate in `estimates.md`. Runs the session. Records actual token usage in `actuals.md`. Compares. Iterates. By the end of three tasks, has a calibrated sense of their own usage patterns.

**Why this teaches the module concept:**
The estimate-then-actual cycle is exactly how you build cost intuition. Budgeting before spending is the discipline A-02 is trying to install. The comparison between estimate and actual is where learning happens. This also introduces the session log habit that pays dividends throughout the track.

---

### Idea 3 — `token-almanac`

**Name:** token-almanac

**What the repo contains:**
```
token-almanac/
  CLAUDE.md           (instructions: you are building a personal reference for your own token usage)
  entries/
    (empty — learner populates this)
  reference/
    session-types.md  (pre-written: the four session types from A-02 with rough benchmarks)
    cost-drivers.md   (pre-written: the four cost drivers, annotated)
    reading-the-counter.md  (pre-written: how to read the token counter in Claude Code)
  template/
    entry-template.md (what each almanac entry should contain: session type, task, tokens in, tokens out, cost estimate, what drove cost)
  prompts/
    first-entry.md    (annotated: complete your first session and write your first entry)
```

**What the learner does:**
Reads the reference materials. Runs a real session of their own choice. Fills in the entry template. Builds their personal token almanac over the course of the track — a growing record of their own usage.

**Why this teaches the module concept:**
The almanac framing is unusual and sticky. Most learners will not track their token usage unless there's a structure to put it in. This gives them that structure and makes it feel like a living document rather than a one-time exercise. The reference materials are the module content in a form they'll actually look up later.

**A3's pick:** Idea 1 — `cost-detective`. The three-case structure isolates the three main cost drivers cleanly, and the detective framing makes what would otherwise be dry (token counting) feel like problem-solving. The session log creates the tracking habit without making it feel like admin. The comparison within each case (big file vs. excerpt, vague vs. named) is more direct than estimate-vs-actual for a learner who hasn't built intuition yet.

**Concerns:** The large-doc.txt needs to be genuinely interesting to read — a 2,000-word generic placeholder will kill the session. Consider pre-writing it as a compelling short essay. Risk: learners run all three cases in one session, which defeats the purpose of seeing per-session token counts.

---

## LOG — A3 — A-02

Initial instinct: cost is invisible until you look at it. The exercise needs to make the invisible visible. I considered a pure estimation game (too abstract before you've seen the numbers), a cost calculator template (useful but not a learning experience), and the detective framing. The detective framing won because it treats cost as information to be discovered rather than a warning to be heeded. The almanac idea is genuinely good — almost picked it — but it requires multiple sessions over time to be useful, which is harder to guarantee in a template repo context.

---

## A-03: CLAUDE.md — Your Persistent Instructions

**Core concept:** CLAUDE.md is a plain text file that gives Claude Code standing instructions for every session — write it well and you never have to repeat yourself.

---

### Idea 1 — `the-newsletter-studio`

**Name:** the-newsletter-studio

**What the repo contains:**
```
the-newsletter-studio/
  CLAUDE.md               (intentionally INCOMPLETE — marked with [FILL IN] placeholders)
  style/
    voice-notes.txt       (pre-written: three paragraphs describing a newsletter's voice)
    dont-do-this.txt      (pre-written: things the newsletter avoids — listicles, jargon, etc.)
  issues/
    issue-draft-01.txt    (a half-written newsletter draft, 400 words, good bones)
  prompts/
    before-claude-md.md   (annotated: run a task WITHOUT completing CLAUDE.md first)
    complete-claude-md.md (annotated: fill in the placeholders)
    after-claude-md.md    (annotated: run the same task WITH CLAUDE.md active)
```

**What the learner does:**
Runs a task on `issue-draft-01.txt` before completing CLAUDE.md. Observes the generic output. Fills in the CLAUDE.md placeholders using the voice notes and don't-do-this file. Runs the same task again. Compares the two outputs. The contrast is the lesson.

**Why this teaches the module concept:**
CLAUDE.md's value is invisible until you see the before/after. This forces that comparison explicitly. The newsletter studio is personal enough that the learner can fill in the placeholders with their own preferences even if they don't run a newsletter — the structure is transferable.

---

### Idea 2 — `writer-in-residence`

**Name:** writer-in-residence

**What the repo contains:**
```
writer-in-residence/
  CLAUDE.md               (a beautifully written example CLAUDE.md for a writer — complete)
  work/
    draft-01.txt          (a rough first draft of a short personal essay — 600 words)
    research-notes.txt    (10 bullet points of research — unformed)
  prompts/
    01-read-the-claude-md.md (annotated: open CLAUDE.md and read it before your first task)
    02-first-task.md         (annotated: ask Claude Code to improve the draft)
    03-personalise.md        (annotated: now rewrite CLAUDE.md for yourself)
  my-claude-md/
    draft.md              (empty — learner writes their own)
```

**What the learner does:**
Reads the example CLAUDE.md (which is itself a model of how to write one). Uses it to complete a task. Then writes their own version in `my-claude-md/draft.md`.

**Why this teaches the module concept:**
Seeing an excellent example before writing your own is one of the most effective learning patterns. The example CLAUDE.md is doing double duty: it's a working instruction set for the session AND a teaching artefact. The learner absorbs the format by using it before being asked to replicate it.

---

### Idea 3 — `project-brain`

**Name:** project-brain

**What the repo contains:**
```
project-brain/
  CLAUDE.md.template      (a fill-in template with annotations explaining each section)
  CLAUDE.md               (does not exist — learner creates it)
  context/
    project-brief.txt     (a fictional product brief — specific, realistic, 400 words)
    terminology.txt       (10 terms specific to the fictional project, with definitions)
    constraints.txt       (5 rules that apply to this project — file boundaries, naming, etc.)
  tasks/
    task-01.md            (a task that will go wrong without CLAUDE.md — tests a specific rule)
    task-02.md            (a second task that tests a different rule)
  prompts/
    write-your-claude-md.md (annotated: use the template and context files to write CLAUDE.md)
```

**What the learner does:**
Reads the template and context files. Writes their CLAUDE.md using the template. Runs two tasks that are designed to test whether the rules they wrote actually work. Sees the rules in action (or not) and iterates.

**Why this teaches the module concept:**
This is the most direct path to the module's objective: create a CLAUDE.md, start a session with it active, observe the difference. The two test tasks are designed to immediately reveal whether the CLAUDE.md is doing its job — which creates a feedback loop the module explicitly values. The annotated template is a teaching tool, not just a scaffold.

**A3's pick:** Idea 1 — `the-newsletter-studio`. The before/after contrast is the clearest of the three, and the newsletter format is accessible to any learner regardless of their work domain. The voice notes and don't-do-this files give the learner something to work with even if they've never thought about their own preferences. Most importantly: it forces learners to run the same task twice — once without CLAUDE.md, once with — which is the most direct demonstration of its value.

**Concerns:** The newsletter framing will resonate less with learners who are developers or researchers. The CLAUDE.md template should be in the repo even for this option — learners shouldn't have to start completely from scratch. Also: the newsletter voice needs to be written with enough specificity that the "before" output is noticeably generic.

---

## LOG — A3 — A-03

Initial instinct: the value of CLAUDE.md is invisible until you see the before/after. Every idea needs to force that comparison. I considered a coding project CLAUDE.md (too technical), a personal preferences setup (useful but abstract), and the before/after approach. Rejected the pure "write your CLAUDE.md from scratch" approach because it's intimidating and produces variable results — learners don't know what good looks like. Rejected the coding project because it alienates non-technical learners. The newsletter studio won because the before/after is sharpest and the domain is accessible.

---

## A-04: Context Awareness and Compaction

**Core concept:** Compaction silently replaces your session history with a summary; some things survive (explicit, standalone, named) and some don't (implicit, conversational, buried); learn to recognise context rot and write messages that survive.

---

### Idea 1 — `constraint-stress-test`

**Name:** constraint-stress-test

**What the repo contains:**
```
constraint-stress-test/
  CLAUDE.md               (instructions: this is an experiment — track what survives)
  material/
    long-document.txt     (a 3,000-word document — realistic, readable content)
    constraints.md        (three constraints — one stated well, one stated badly, one not stated)
  prompts/
    01-setup.md           (annotated: state your three constraints in the way described)
    02-work.md            (annotated: do 8-10 turns of real work on the document)
    03-checkpoint.md      (annotated: send the checkpoint prompt from A-04)
    04-diagnose.md        (annotated: identify which constraints survived and which didn't)
  output/
    checkpoint-results.md (template for recording what survived)
```

**What the learner does:**
States three constraints — one as a clean standalone message, one buried in a conversational reply, one never stated at all. Does 8-10 turns of real work. Sends a manual checkpoint. Records what survived. The experiment is designed so one constraint almost certainly survives, one might, and one won't.

**Why this teaches the module concept:**
The module's key insight is that how you state something affects whether it survives. This experiment makes that difference observable rather than theoretical. The three-constraint design guarantees a differential outcome, which is the entire point.

---

### Idea 2 — `the-decision-log`

**Name:** the-decision-log

**What the repo contains:**
```
the-decision-log/
  CLAUDE.md               (instructions: maintain a decision log as you work)
  project/
    brief.txt             (a complex brief — fictional product strategy, 600 words)
    sections/
      section-01.txt      (pre-written: first section of a report — 400 words)
      section-02.txt      (pre-written: second section — different topic)
      section-03.txt      (empty — to be built in the session)
  decisions/
    (empty — learner creates confirmed-decisions.md here during the session)
  prompts/
    01-read-brief.md          (annotated)
    02-make-decisions.md      (annotated: establish 3 decisions through dialogue)
    03-confirm-decisions.md   (annotated: write a "Decision confirmed:" message for each)
    04-checkpoint.md          (annotated: checkpoint to verify decisions survived)
```

**What the learner does:**
Works through the brief, making several decisions through dialogue. Then writes a "Decision confirmed:" message for each one. Runs a checkpoint. Compares whether the dialogue decisions and the confirmed decisions both appear in the summary.

**Why this teaches the module concept:**
The A-04 module uses the "confirmed finding:" and "decision for this session:" phrasing as durability signals. This repo makes the learner practice that exact technique on decisions they've actually made during the session, so the comparison between dialogue-decisions and confirmed-decisions is live.

---

### Idea 3 — `context-archaeology`

**Name:** context-archaeology

**What the repo contains:**
```
context-archaeology/
  CLAUDE.md               (instructions: you are studying what survives compaction)
  layers/
    layer-01-explicit.txt (a set of constraints stated explicitly — clean and standalone)
    layer-02-conversational.txt (the same constraints stated conversationally — buried)
    layer-03-implied.txt  (the same constraints implied through example only — never stated)
  document/
    working-doc.txt       (a 2,500-word document to work on — gives the session substance)
  prompts/
    01-load-layers.md     (annotated: state each layer's constraints in its stated form)
    02-work.md            (annotated: do 8 turns of work)
    03-excavate.md        (annotated: send the checkpoint and see what survived)
  findings/
    archaeology-report.md (template: record what survived from each layer)
```

**What the learner does:**
States constraints from all three layers in the appropriate form. Does 8 turns of work. Sends checkpoint. Fills in the archaeology report: what survived from each layer, what was compressed, what vanished. The report becomes their personal reference for compaction behaviour.

**Why this teaches the module concept:**
The "archaeology" framing makes the session feel like a discovery exercise rather than a test. The three-layer structure isolates the variable being studied (how the constraint was stated) from the content of the constraint, which is the most direct way to demonstrate the module's core principle: explicit beats implicit, standalone beats buried, named beats described.

**A3's pick:** Idea 3 — `context-archaeology`. The three-layer framing is the most conceptually elegant of the three options, and the archaeology metaphor is satisfying and memorable. It isolates the variable being studied (how something is stated) without confounding it with what is stated. The archaeology report turns the output of the exercise into a personal reference the learner will keep.

**Concerns:** This is the most cognitively demanding exercise in the track so far — three constraint layers, 8 turns of work, a checkpoint, and a report. It might need a "time estimate" note in the README: "This takes 20-30 minutes." Risk: learners might not have 2,500 words of working material. The `working-doc.txt` needs to be pre-written so the session has substance regardless.

---

## LOG — A3 — A-04

Initial instinct: this module is about something invisible becoming visible — the moment when context rot surfaces. The exercise needs to create conditions where that moment is predictable enough to observe. I considered a pure checkpoint exercise (useful but narrow), a "spot the rot" game (fun but synthetic), and the archaeology approach. The archaeology framing won because it's the most direct experimental design: isolate the variable, run the session, observe the outcome. The decision log is also strong — almost picked it — because it maps to real work (you actually make decisions in sessions). But the three-layer design is more systematic and teaches the principle more precisely.

---

## A-05: Session Hygiene

**Core concept:** Scope each session to one task; use /clear between unrelated tasks; front-load constraints before any work begins; clean sessions produce better output and cost less.

---

### Idea 1 — `the-daily-brief`

**Name:** the-daily-brief

**What the repo contains:**
```
the-daily-brief/
  CLAUDE.md               (instructions: this folder is for daily brief sessions — one task per session)
  incoming/
    meeting-notes.txt     (rough notes from a fictional meeting — 400 words)
    research-dump.txt     (unstructured research notes on a different topic — 300 words)
    email-thread.txt      (a three-message email thread on a third topic)
  outputs/
    (empty)
  sessions/
    session-01-scope.md   (annotated: scope this task before starting — meeting notes only)
    session-02-clear.md   (annotated: use /clear and start fresh for research task)
    session-03-scope.md   (annotated: scope the email task)
  templates/
    session-opener.md     (the session scope template from A-05 — annotated)
```

**What the learner does:**
Runs three separate scoped sessions on three separate pieces of incoming material. Uses `/clear` between each. Compares the output of each clean, scoped session. The contrast between a scoped session and what would have happened in one long contaminated session is made explicit in the annotation.

**Why this teaches the module concept:**
The three separate pieces of material force `/clear` to be used in a way that's natural rather than artificial. "I'm switching topics" is something the learner understands from their own experience — the session hygiene technique is the solution to a problem they recognise.

---

### Idea 2 — `the-work-queue`

**Name:** the-work-queue

**What the repo contains:**
```
the-work-queue/
  CLAUDE.md               (instructions: one task per session — check this file before every session)
  queue/
    task-01-draft.md      (scoped task: draft a response to a customer complaint)
    task-02-summarise.md  (scoped task: summarise a report into three bullets)
    task-03-research.md   (scoped task: research one specific question)
    task-04-edit.md       (scoped task: edit a paragraph for clarity)
  material/
    complaint.txt
    report.txt
    question.txt
    paragraph.txt
  outputs/
    (empty — one file per task, named by task number)
  prompts/
    front-load-template.md (the front-loading template from A-05, annotated)
```

**What the learner does:**
Treats the queue as a real work queue. Each session: pick a task, read the task file, write the front-loaded opening message, run the session, save the output. Use `/clear` before each new task. The queue is the discipline.

**Why this teaches the module concept:**
The "work queue" framing is immediately meaningful to anyone who has a job. Tasks pile up; you work through them one at a time. Claude Code is a tool in that workflow, not a conversation partner. Session hygiene is how you keep the tool working well as you move through the queue. The front-loading template is the key habit being installed.

---

### Idea 3 — `the-research-sprint`

**Name:** the-research-sprint

**What the repo contains:**
```
the-research-sprint/
  CLAUDE.md               (instructions: this is a focused research sprint — one question per session)
  questions/
    q-01.txt              (a specific research question — single-sentence, clear)
    q-02.txt              (a different research question — unrelated to q-01)
    q-03.txt              (a third question — related to q-02 but distinct)
  notes/
    q-01-notes.txt        (raw notes relevant to q-01 — not yet synthesised)
    q-02-notes.txt        (raw notes for q-02)
    q-03-notes.txt        (raw notes for q-03)
  outputs/
    (empty)
  prompts/
    sprint-opener.md      (annotated: scope your session before starting — one question only)
    when-to-clear.md      (annotated: q-01 and q-02 are unrelated — use /clear between them)
    when-not-to-clear.md  (annotated: q-02 and q-03 are related — keep context)
```

**What the learner does:**
Runs three sessions. The annotation explicitly discusses the /clear decision for each transition: use it between q-01 and q-02 (unrelated), skip it between q-02 and q-03 (related). This teaches the nuance that /clear is not always required — only when topics genuinely shift.

**Why this teaches the module concept:**
A-05 explicitly says: "You do not need to use /clear between closely related steps in the same task." Most repos teaching /clear will make learners use it every time. This one teaches the decision — when to clear and when not to — which is the higher-order skill.

**A3's pick:** Idea 3 — `the-research-sprint`. This is the only option that teaches the nuance in A-05's actual text: /clear is a decision, not a reflex. The annotated `when-to-clear.md` and `when-not-to-clear.md` files do something no other template repo in this set does — they make the decision explicit before the action. That's exactly the kind of annotated thinking that separates good template repos from scaffolded exercises.

**Concerns:** Three questions on three different topics requires more pre-written material than most repos here. The questions and notes need to be carefully written so q-02 and q-03 are genuinely related while q-01 is clearly separate. If this isn't done well, the "when not to clear" lesson is lost.

---

## LOG — A3 — A-05

Initial instinct: the key habit here is /clear, but the deeper lesson is that it's a judgment call. Every exercise that just says "use /clear here" is teaching the rule without the reasoning. I wanted to find a repo structure that would force the decision. The research sprint won because it creates natural conditions for both "clear" and "don't clear" decisions to arise from the same session structure. The work queue is genuinely good — almost a co-pick — because it maps to how people actually use Claude Code professionally.

---

## A-06: Output Engineering in Claude Code

**Core concept:** Separate the planning phase from the execution phase; control format, length, and structure explicitly; the plan/execute split is the highest-leverage habit for multi-step tasks.

---

### Idea 1 — `the-structure-lab`

**Name:** the-structure-lab

**What the repo contains:**
```
the-structure-lab/
  CLAUDE.md               (instructions: always separate plan from execute in this folder)
  subjects/
    case-study-brief.txt  (a detailed brief for a case study — 300 words)
    report-brief.txt      (a brief for a competitive analysis report — 300 words)
  prompts/
    01-no-plan.md         (annotated: run the case study with no plan step — observe structure choice)
    02-plan-first.md      (annotated: request two structures before writing)
    03-pick-and-execute.md (annotated: pick a structure, then execute)
    04-format-control.md  (annotated: specify exact format, length, audience, tone)
  output/
    (empty)
```

**What the learner does:**
Runs the case study task without a plan step. Observes the structure Claude Code chose. Then runs it again with an explicit plan request (two structures proposed, one picked). Compares the two outputs. Then does the report task with full format control.

**Why this teaches the module concept:**
The Before (no plan) and After (plan first) on the same brief makes the value of plan-before-execute immediate. The format control exercise on the report task builds the second skill. Both exercises on the same session day means the learner uses both techniques in one sitting.

---

### Idea 2 — `the-document-factory`

**Name:** the-document-factory

**What the repo contains:**
```
the-document-factory/
  CLAUDE.md               (instructions: plan before every execution in this folder)
  incoming/
    raw-notes-01.txt      (250 words of rough notes — to be shaped into a document)
    raw-notes-02.txt      (different topic — 300 words)
  formats/
    format-a.md           (description of one output format: structured brief with headers)
    format-b.md           (description of a second format: prose summary, no headers)
    format-c.md           (description of a third format: bullet executive summary)
  prompts/
    plan-message.md       (the planning prompt template from A-06, annotated)
    format-message.md     (the format control template from A-06, annotated)
  output/
    (empty)
```

**What the learner does:**
Takes `raw-notes-01.txt` and produces it in all three formats, using the plan step each time. Chooses which format best suits the content. The format files are the teaching: they describe what each format is and when to use it, so the learner is developing format literacy alongside output control.

**Why this teaches the module concept:**
Format control is about knowing what formats exist and which one fits the task — not just about specifying what you want. The format library makes that knowledge explicit. The plan step before each format exercise creates the habit of checking "is this the right structure?" before writing begins.

---

### Idea 3 — `the-pitch-builder`

**Name:** the-pitch-builder

**What the repo contains:**
```
the-pitch-builder/
  CLAUDE.md               (instructions: this folder is for building the pitch — plan before every step)
  brief/
    product-brief.txt     (a fictional product brief — something anyone can relate to, 400 words)
    audience-notes.txt    (who the pitch is for — two different audiences described)
  stages/
    stage-01-plan.md      (annotated: request plan for a 5-slide deck structure)
    stage-02-execute.md   (annotated: execute one slide, with format control)
    stage-03-adapt.md     (annotated: adapt the same slide for audience-02)
  output/
    deck/
      (empty — one file per slide as learner builds)
```

**What the learner does:**
Builds a 5-slide pitch deck one slide at a time, using the plan step before each slide. The adaptation step (same content, different audience) isolates the audience parameter in the format control template, making it concrete.

**Why this teaches the module concept:**
A pitch deck is a genuinely motivating project. It's multi-step (plan needed), it has a real format constraint (slides), and adapting it for two audiences makes the "audience" parameter in the format control template feel real rather than abstract. The staged annotation makes the plan-before-execute habit deliberate on every slide, so the learner does it six times (5 slides + adaptation) rather than once.

**A3's pick:** Idea 3 — `the-pitch-builder`. It's the most motivating project of the three — building something real is better than running the same brief twice or producing notes in three formats. The multi-step structure forces plan-before-execute to be used repeatedly, which is how habits form. The audience adaptation is the highest-leverage output engineering skill and it's embedded naturally.

**Concerns:** The product brief needs to be written for something generic enough that any learner can engage with it — not too technical, not too niche. Suggest a fictional B2B productivity tool or something similarly neutral. Risk: learners get absorbed in the pitch content and skip the plan step — the annotation on each stage needs to make skipping feel costly.

---

## LOG — A3 — A-06

Initial instinct: the plan-before-execute habit is the headline of this module and it's best taught by making the cost of skipping it visible. The before/after on the same brief is the direct route. I considered a pure format-control exercise (too narrow), a multi-document production task (good but less motivating), and the pitch builder. The pitch builder won because it's genuinely worth doing — a real output, not a demonstration. The structure lab was my second choice because the Before/After comparison is the clearest of the three.

---

## A-07: Tool Fluency

**Core concept:** Name the tool in your message (Read, Glob, Grep, Bash, WebSearch, Agent); explicit tool naming reduces cost and makes actions predictable; the cost hierarchy goes from file tools through Bash/WebSearch to Agent.

---

### Idea 1 — `the-codebase-explorer`

**Name:** the-codebase-explorer

**What the repo contains:**
```
the-codebase-explorer/
  CLAUDE.md               (instructions: name the tool in every message in this folder)
  project/
    README.md
    src/
      main.py             (a short, readable Python file — 80 lines)
      utils.py            (utility functions — 60 lines)
      config.py           (configuration — 40 lines)
    docs/
      architecture.md     (describes the project structure — 300 words)
      decisions.md        (design decisions — 200 words)
    logs/
      app.log             (50 lines of log output)
  missions/
    mission-01.md         (annotated: find where "deadline" appears — teaches Grep)
    mission-02.md         (annotated: find all .md files in docs/ — teaches Glob)
    mission-03.md         (annotated: read config.py — teaches Read)
    mission-04.md         (annotated: show the last 10 lines of app.log — teaches Bash)
  log/
    tool-log.md           (template: record which tool was used and why for each mission)
```

**What the learner does:**
Works through four missions, each designed to require a specific tool. Before sending each message, names the tool they plan to use. After, records what tool Claude Code actually used and whether it matched. Builds a personal tool reference log.

**Why this teaches the module concept:**
The "missions" framing turns tool selection into problem-solving rather than instruction-following. Each mission is designed so exactly one tool is correct — which forces the learner to reason about the tool hierarchy rather than guess. The tool log creates a reflective record that reinforces the hierarchy.

---

### Idea 2 — `the-research-toolkit`

**Name:** the-research-toolkit

**What the repo contains:**
```
the-research-toolkit/
  CLAUDE.md               (instructions: name the tool in every request — no vague searches)
  workspace/
    report-draft.md       (a half-built research report — 600 words, has gaps)
    notes/
      source-a.txt        (research notes — 200 words)
      source-b.txt        (different source — 200 words)
      source-c.txt        (third source — 200 words)
  tasks/
    task-01-find.md       (annotated: find all mentions of "methodology" across notes/ — Grep)
    task-02-read.md       (annotated: read source-a.txt in full — Read)
    task-03-locate.md     (annotated: find all .txt files in notes/ — Glob)
    task-04-current.md    (annotated: find current data on one specific question — WebSearch)
    task-05-compare.md    (annotated: run both free-choice and named-tool versions, compare tokens)
  output/
    (empty)
```

**What the learner does:**
Works through five tasks using the specific tool named in each task annotation. Task 05 is the module's own comparison exercise from A-07 — sending the same request free-choice then named-tool and comparing token counts.

**Why this teaches the module concept:**
The research context makes tool naming feel useful rather than artificial. Grep is for finding patterns in notes; Read is for reading a specific source; Glob is for locating files; WebSearch is for live data. Each tool has a natural fit. Task 05 replicates the module's own exercise, which is a nice structural echo.

---

### Idea 3 — `the-investigator`

**Name:** the-investigator

**What the repo contains:**
```
the-investigator/
  CLAUDE.md               (instructions: you are an investigator — name your tools like a professional names instruments)
  case-files/
    case-01/
      brief.txt           (a brief description of what needs to be found)
      evidence/
        doc-a.txt
        doc-b.txt
        doc-c.md
        notes.txt
      tools-available.md  (the tool hierarchy, written as an investigator's kit)
    case-02/
      brief.txt
      evidence/
        (different files)
      tools-available.md
  findings/
    (empty — learner writes up findings using the right tool for each step)
  log/
    investigation-log.md  (template: tool used, why chosen, result, cost)
```

**What the learner does:**
Works through two cases. For each: reads the brief, identifies what tools are needed, names them explicitly in every message, records the investigation in the log. The "investigator" framing makes the deliberateness of tool selection feel professional rather than pedantic.

**Why this teaches the module concept:**
The investigation framing changes how tool selection feels. An investigator doesn't reach for any instrument — they reach for the right one. This is the same discipline as A-07 but framed as professional competence rather than cost management. The log creates accountability: you named a tool, you used it, you recorded why.

**A3's pick:** Idea 3 — `the-investigator`. The framing is the most distinctive and the most likely to stick. "Name your tools like a professional names instruments" is a better mental model than "name tools to save tokens" — it reframes tool fluency as competence rather than penny-pinching. The case-file structure is clean and expandable. The investigation log creates the reflective habit.

**Concerns:** The "investigator" framing might feel a bit precious to some learners. The fallback is to just use the research toolkit (Idea 2) which is more directly practical. Also: the evidence files need to be written with enough complexity that using the wrong tool (e.g., Read instead of Grep) would visibly over-read. Otherwise the tool choice doesn't feel consequential.

---

## LOG — A3 — A-07

Initial instinct: tool fluency is about precision — knowing the right instrument for the job. The exercise needs to create situations where the wrong tool is visibly more expensive or less targeted than the right one. I considered a pure comparison exercise (send twice, compare tokens — this is what the module itself does), a tool hierarchy quiz (too didactic), and the investigator framing. The investigator framing won because it's memorable and reframes the skill as professional precision rather than cost control. The codebase explorer is also excellent — almost identical in quality — but requires a bit of coding comfort. The investigator is domain-agnostic.

---

## A-08: Agent Delegation and Briefing

**Core concept:** Delegation is powerful and expensive; the 5-part brief gives a subagent everything it needs; never delegate understanding, only production; the brief is the correction point, not the conversation.

---

### Idea 1 — `the-brief-factory`

**Name:** the-brief-factory

**What the repo contains:**
```
the-brief-factory/
  CLAUDE.md               (instructions: every delegation must use the 5-part brief template)
  template/
    brief-template.md     (the 5-part brief template, annotated — explains each section)
  tasks/
    task-a-delegate.txt   (research task: passes the delegation test — annotated)
    task-b-dont-delegate.txt (judgement task: fails the delegation test — annotated)
    task-c-delegate.txt   (production task: passes — annotated)
  material/
    background.txt        (context for the delegatable tasks — 300 words)
  briefs/
    brief-a-draft.md      (partially filled in — learner completes it)
    brief-c-empty.md      (completely empty — learner writes from scratch)
  outputs/
    (empty)
```

**What the learner does:**
Reads all three tasks, applies the delegation test to each, decides which to delegate. Completes `brief-a-draft.md` (lower barrier — some parts pre-filled). Writes `brief-c-empty.md` from scratch. Sends both. Evaluates results against the brief.

**Why this teaches the module concept:**
The two-level brief writing (partially filled vs. blank) is pedagogically smart — the first brief shows what good looks like, the second tests whether the learner absorbed the pattern. The pre-annotated tasks make the delegation decision explicit before the learner commits to either path.

---

### Idea 2 — `mission-control`

**Name:** mission-control

**What the repo contains:**
```
mission-control/
  CLAUDE.md               (instructions: you are mission control — subagents run tasks you define)
  missions/
    mission-01/
      scope.txt           (what the subagent should do — specific, bounded)
      brief-draft.md      (the 5-part brief, partially written — learner completes)
      evaluation-criteria.md (how to assess whether the brief succeeded)
    mission-02/
      scope.txt
      brief-draft.md      (completely empty this time)
      evaluation-criteria.md
  debrief/
    mission-01-debrief.md (template: did the subagent stay within scope? was output evaluable?)
    mission-02-debrief.md
  reference/
    delegation-test.md    (the three-question delegation test, annotated)
    brief-guide.md        (each of the 5 brief parts explained with examples)
```

**What the learner does:**
Runs both missions. Completes the brief for each. After each subagent returns, fills in the debrief template. Compares what the brief specified against what the subagent produced. Identifies any gaps in the brief.

**Why this teaches the module concept:**
The "mission control" framing makes delegation feel like architecture rather than offloading. The debrief template is the key element — it forces the learner to evaluate the output against the brief, which is the core skill of A-08: "the correction happens in the brief, not in the conversation." Filling in the debrief is what makes the loop close.

---

### Idea 3 — `the-parallel-desk`

**Name:** the-parallel-desk

**What the repo contains:**
```
the-parallel-desk/
  CLAUDE.md               (instructions: this folder is for parallel delegation — each task gets its own brief)
  tasks/
    task-01-research.txt  (one research task — independent of task-02)
    task-02-compile.txt   (a different research task — independent of task-01)
    task-03-judge.txt     (a task that requires judgement — explicitly NOT delegatable)
  briefs/
    brief-01.md           (5-part template — empty)
    brief-02.md           (5-part template — empty)
  decision-log/
    why-not-03.md         (template: write your reasoning for why task-03 fails the delegation test)
  outputs/
    (empty)
  reference/
    brief-template.md     (the template, annotated)
    delegation-test.md    (the three questions, annotated)
```

**What the learner does:**
Reads all three tasks. Decides to delegate 01 and 02, not 03. Writes their reasoning for rejecting 03 in `why-not-03.md`. Writes full briefs for 01 and 02. Sends both (parallel if possible). Evaluates results.

**Why this teaches the module concept:**
The explicit non-delegatable task (task-03) makes the delegation decision visible — you have to articulate why you're not delegating, which forces engagement with the "never delegate understanding" principle. Writing the reasoning is more valuable than just applying the test algorithmically. The parallel structure reinforces that delegation is about independence.

**A3's pick:** Idea 3 — `the-parallel-desk`. The non-delegatable task is the most distinctive element of this set — no other template pack for this module will have one. Making the learner write their rejection reasoning is the highest-leverage moment in any A-08 exercise. The parallel structure (two independent delegations) reinforces what makes delegation appropriate: independence. The explicit rejection write-up prevents learners from skimming the principle.

**Concerns:** Writing three briefs in one session is expensive. The README should include a cost estimate and suggest doing one brief per session, using the second and third as practice. The non-delegatable task needs to be written with enough nuance that it's not obviously a "trick" — if learners can tell from the first sentence that it requires judgement, they don't learn the test, they just confirm it.

---

## LOG — A3 — A-08

Initial instinct: delegation is the most consequential skill in the A-track because it's the most expensive to get wrong. The exercise needs to make the quality of the brief feel consequential — which means the learner has to evaluate what the subagent produced against what they specified. The debrief template (Idea 2) is the key mechanism for that. But the non-delegatable task (Idea 3) is the more distinctive teaching element. Chose Idea 3 because it includes both the rejection reasoning and the parallel delegation, making it the most complete exercise. The brief factory is close but the partially-filled brief (Idea 1) reduces the learning more than it reduces the barrier.

---

## A-09: Capstone — A Real Project

**Core concept:** Apply the full Advanced Practitioner toolkit to a real piece of work — CLAUDE.md, scoped sessions, compaction management, output engineering, tool naming, delegation — and reflect on which habits are now reflexes.

---

### Idea 1 — `the-personal-almanac`

**Name:** the-personal-almanac

**What the repo contains:**
```
the-personal-almanac/
  CLAUDE.md               (model CLAUDE.md — complete, well-written, serves as exemplar)
  vision.md               (what the almanac is: a structured annual review of your work, thinking, and decisions)
  sections/
    01-wins.txt           (empty — learner populates from their own notes/memory)
    02-lessons.txt        (empty)
    03-decisions.txt      (empty — key decisions made this year and what happened)
    04-next-year.txt      (empty — what you want to be different)
  raw/
    notes-dump.txt        (empty — learner dumps their own raw notes here)
  prompts/
    session-01-intake.md  (annotated: scope, front-load constraints, use Read on notes-dump)
    session-02-structure.md (annotated: plan before execute — propose structure)
    session-03-draft.md   (annotated: checkpoint before entering the longest section)
    session-04-delegate.md (annotated: delegate one section to a subagent with a full brief)
  output/
    almanac-draft.md      (empty — the final assembled document)
```

**What the learner does:**
Builds their own personal almanac — a structured reflection on the year — using the full toolkit. Each prompt file is annotated with which A-track technique is required for that session. The output is genuinely theirs.

**Why this teaches the module concept:**
The almanac is inherently personal, so the output has real value — this is the capstone condition ("you will use the output"). It spans multiple sessions naturally (four distinct phases), requires all the required techniques, and the subject matter is deeply personal enough that learners will care whether the output is good. A well-written almanac is something you keep.

---

### Idea 2 — `the-reading-year`

**Name:** the-reading-year

**What the repo contains:**
```
the-reading-year/
  CLAUDE.md               (instructions for the project — annotated as a model CLAUDE.md)
  books/
    (empty — learner adds their own book notes)
  source-notes/
    book-note-template.txt (how to format a book note — title, key ideas, quotes, reactions)
  prompts/
    session-01-intake.md  (annotated: read one book note, summarise — first scoped session)
    session-02-pattern.md (annotated: identify themes across multiple notes — plan before execute)
    session-03-essay.md   (annotated: delegate the essay research to a subagent)
    session-04-compile.md (annotated: checkpoint before final compilation)
  output/
    year-in-reading.md    (empty — the final document)
```

**What the learner does:**
Builds a "year in reading" document from their own book notes. Four sessions, each requiring a different technique from the toolkit. The output is a personal reading review they can share or keep.

**Why this teaches the module concept:**
Reading is universal enough that most learners have some notes to work with. The multi-session structure forces scoping and /clear usage. The thematic essay session requires delegation to a subagent (independent task, evaluable output). The final compilation requires a checkpoint before the longest session.

---

### Idea 3 — `the-workshop-materials`

**Name:** the-workshop-materials

**What the repo contains:**
```
the-workshop-materials/
  CLAUDE.md               (instructions — complete, annotated as a model)
  brief/
    workshop-brief.txt    (a real-feeling brief: build workshop materials on a topic you know)
    audience.txt          (who the workshop is for)
  raw/
    ideas-dump.txt        (empty — learner adds their own ideas)
    existing-notes.txt    (empty)
  sessions/
    session-01-plan.md    (annotated: scope the whole project — what sessions are needed?)
    session-02-research.md (annotated: delegate background research to subagent)
    session-03-structure.md (annotated: plan-before-execute for document structure)
    session-04-draft.md   (annotated: checkpoint before the longest drafting session)
    session-05-polish.md  (annotated: output engineering — format control for final document)
  output/
    materials/
      (empty — slides, handout, facilitator guide all built here)
```

**What the learner does:**
Builds a set of workshop materials on a topic they know. Five sessions, each annotated with the required technique. Produces something they can actually use or share.

**Why this teaches the module concept:**
Workshop materials are a real deliverable with a real use case. The five-session structure is longer than the other capstones, which is appropriate for the final module. Every required technique from the capstone checklist maps directly to a session: CLAUDE.md (active from session 1), /clear (between sessions), checkpoint (session 4), plan-before-execute (session 3), tool naming (all sessions), delegation (session 2). The output has genuine professional value.

**A3's pick:** Idea 1 — `the-personal-almanac`. This is the strongest capstone because it forces the learner to put themselves into the project. A workshop or reading year is personal, but an almanac — a structured reflection on your own decisions, wins, and lessons — is the most motivating possible output. The module says: "you will use the output." Nothing in this list is more likely to be used than a personal almanac. The four-session structure maps cleanly to the six required techniques. The CLAUDE.md in the repo is a model — the learner reads it and then writes their own, which is the perfect capstone for the CLAUDE.md module's lesson.

**Concerns:** The almanac requires learners to bring their own raw material. Some learners will find this freeing; others will find it daunting. The `notes-dump.txt` file and the `vision.md` framing need to be written with enough warmth that even a learner who doesn't keep notes feels invited to start. The four sessions might be too many for learners who are completing the course quickly — the annotation should make clear which sessions are essential and which are optional.

---

## LOG — A3 — A-09

Initial instinct: the capstone needs to produce something the learner actually uses. Every one of these ideas passes that test. The almanac won because it's the most personal — and the most motivating. I almost went with the workshop materials because they have clearer professional value, but workshop materials are produced for other people while an almanac is produced for yourself. Self-directed output has a different quality of motivation. The reading year is close — books are personal — but the almanac is deeper because it's about decisions and lessons, not just consumption.

I also noticed: the capstone's CLAUDE.md should be the best CLAUDE.md in the entire pack. It's the final module — the learner has read A-03, seen three other CLAUDE.md examples across the pack, and is now completing the course. The CLAUDE.md in the almanac repo should be good enough that learners want to steal it.

---

## Cross-Track Notes — For Other Agents

A few things I noticed that might affect the whole pack:

**1. The annotated prompts are the hidden work.** Across every module, the quality of the annotated prompts files determines whether the exercise works. A template repo with scaffolding but weak annotation teaches nothing. The prompts need to explain the "why" of each step, not just the "what." This is worth discussing across agents.

**2. The pre-written content is load-bearing.** Several repos require pre-written material (the meeting notes, the film list, the long document). If these are generic or dull, the session loses its grip. The creative angle here is: write the pre-written content as if it's from a real person with a real voice. This makes every session more engaging.

**3. Non-technical learners need domain-agnostic repos.** I've tried to keep most of these accessible to non-developers. The codebase explorer (A-07, Idea 1) is the most technical; the investigator is its domain-agnostic equivalent. Other agents should flag any ideas that would lose non-technical learners.

**4. Session cost estimates matter.** Several of these repos have sessions that could get expensive if learners run them carelessly (especially A-08). Each repo's README (or annotation) should include a rough cost estimate tied to the A-02 benchmarks.

**5. The CLAUDE.md files in each repo are double-duty.** They're both working instruction sets for the session AND teaching examples. The A-03 module is specifically about writing CLAUDE.md — every repo's CLAUDE.md should be good enough to use as an example in that module. Worth aligning on a CLAUDE.md quality standard across the pack.
