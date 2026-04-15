# Agent A2 — A-track Template Repo Brainstorm
*Phase 1: Independent brainstorm — Pragmatist lens*
*Date: 2026-04-14*

---

## Overview: My Filter

As the pragmatist, my one question for every idea is: would someone keep using this after the exercise ends? Not "would they finish it" — would they actually open it on a Tuesday morning six weeks later because it helps them get something done? That filter killed a lot of ideas before I wrote them down. I also paid close attention to what the modules actually say — not the topic label, but the specific exercises and starters the learner is given. A good template repo should make those prompts feel natural, not forced.

The A-track audience has just cleared the Enabled User stage. They are not beginners. They have prompt discipline from the E-track. What they do not have is the habit of working with a file system, thinking about sessions as bounded things, or knowing what a tool call actually is. The best repos will meet them where they are: real work they already have, made significantly better through what the module teaches.

One constraint I flagged early: none of the repos should require paid APIs beyond Anthropic. This cuts out ideas that depend on GitHub integrations, Slack APIs, or external data services. Everything here is file-based.

---

## A-00: Getting Started with Claude Code

**Core concept:** First session — file reading/writing, permission model. The learner installs Claude Code, navigates to a folder, and approves their first tool calls.

---

### Idea 1: `reading-room`

**What the repo contains:**
```
reading-room/
  README.md         ← explains the repo purpose
  to-read/          ← 5–8 lightly varied sample documents (PDFs, .txt, .md)
  notes/            ← empty folder with a .gitkeep
  prompts/
    00-first-read.md    ← annotated starter prompt
    00-summarise.md     ← annotated format-control prompt
```
The documents are plausible but generic — a meeting transcript, a short research brief, two articles, a project update. Real-feeling content without being from any specific domain.

**What the learner does:**
Navigate to the repo, start Claude Code, approve a Read tool call on one document, and ask for a summary written into `notes/`. The annotated prompts walk them through the Copy-Personalise-Use structure from the module.

**Why this teaches the concept:**
To get any output, the learner must approve at least one Read call and one Write call — the two most fundamental permission interactions in Claude Code. There is no way to complete the exercise without engaging with the permission model. The empty `notes/` folder makes the outcome concrete and visible: they can see a file appeared.

---

### Idea 2: `inbox-triage`

**What the repo contains:**
```
inbox-triage/
  README.md
  emails/           ← 8–10 realistic synthetic email .txt files (varied: requests, updates, FYIs, urgent)
  triage/           ← empty
  prompts/
    00-first-pass.md    ← annotated first session prompt
```

**What the learner does:**
Ask Claude Code to read the emails folder, categorise each email into one of three buckets (Action Required / FYI / Can Ignore), and write a triage summary file into `triage/`. They approve each Read call.

**Why this teaches the concept:**
Multiple sequential Read approvals make the permission model visceral. The learner also learns early that Claude Code is working on their behalf across multiple files — the "what it means" of agentic operation lands through the approval sequence.

---

### Idea 3: `notes-audit`

**What the repo contains:**
```
notes-audit/
  README.md
  notes/            ← 10–15 rough markdown notes (varied dates, topics, levels of completeness)
  audit/            ← empty
  prompts/
    00-scan.md          ← prompt: read notes, list what's there
    00-first-write.md   ← prompt: write a single index file to audit/
```

**What the learner does:**
Ask Claude Code to read the notes folder and write a simple index — title, date, one-line summary — into `audit/index.md`. First session, first write, first real output.

**Why this teaches the concept:**
The notes folder is something many people already have (a Notion export, an Obsidian dump, a folder of saved documents). The exercise is immediately relatable. The Read-then-Write sequence covers both sides of the permission model in a single natural task.

---

### My Pick: `reading-room`

Inbox triage is the most emotionally resonant (who doesn't want email triage?) but it requires believing in the synthetic emails. `notes-audit` is closest to real life but risks learners not finding meaning in someone else's notes. `reading-room` works because the task is universal — read a document, write a summary — and the empty `notes/` folder is a clean, visible success condition. The learner ends their first session with a real file they did not have before. That is the most important first impression.

**Concern:** The documents need to feel genuinely interesting, not like Lorem Ipsum in disguise. If the content is bland, the exercise feels mechanical. Someone needs to write good sample content.

---

## LOG — A2 — A-00

**Initial instinct:** A-00 is about the permission model more than anything else. The exercise in the module is simple: summarise a file, approve the Read call. A template repo can make that feel more purposeful by giving the learner a reason to want the output.

**Considered and rejected:** A code review repo (too developer-specific for the audience), a recipe collection (too trivial), a folder of meeting recordings (requires audio transcription outside scope).

**What swayed me:** The module says "navigate to a folder that has a file you would like to work with." The repo replaces the friction of finding that folder with a curated set of realistic documents. The key is "realistic" — the documents must feel like something worth reading. That is the design challenge for whoever builds the repo, not a flaw in the concept.

---

## A-01: Mental Model Refresher

**Core concept:** Claude Code executes text (not intent), context window is finite and degrades, tools are the action layer. The three-part mental model underpinning everything.

---

### Idea 1: `brief-builder`

**What the repo contains:**
```
brief-builder/
  README.md
  raw/
    situation.md        ← an intentionally vague one-paragraph brief
    background.md       ← supporting context with implicit assumptions
    notes.md            ← scattered observations with no structure
  output/               ← empty
  prompts/
    01-vague.md         ← the bad version of the prompt (intentionally)
    01-precise.md       ← the constrained version
    01-annotated.md     ← side-by-side with explanation of what changed
```

**What the learner does:**
Run the vague prompt first, observe the result. Then run the precise version. Write both outputs to `output/`. Compare them. The annotated prompt explains exactly why each element of the precise version controls a different decision Claude Code would otherwise make on its own.

**Why this teaches the concept:**
Part 1 of the mental model ("executes text, not intent") is best learned by seeing the gap between vague and precise output side by side in real files. The learner generates the evidence themselves rather than reading examples in a module.

---

### Idea 2: `constraint-drift-lab`

**What the repo contains:**
```
constraint-drift-lab/
  README.md
  session-notes/
    project-rules.md    ← 3 explicit style/content rules written in different ways (one casual, one standalone, one buried in prose)
  prompts/
    01-buried-constraint.md     ← prompt that embeds the rule conversationally
    01-standalone-constraint.md ← prompt that states the rule as a standalone message
    01-observe.md               ← what to look for in the outputs
```

**What the learner does:**
Run both prompt versions across a task (draft a short document), then compare outputs to see whether the constraint survived. The repo's written commentary explains why standalone messages are more durable.

**Why this teaches the concept:**
Part 2 of the mental model (context window degrades, standalone beats buried). This is the hardest of the three concepts to make visceral — it usually only reveals itself in long sessions. The repo creates a controlled experiment that shows it quickly.

---

### Idea 3: `tool-awareness-starter`

**What the repo contains:**
```
tool-awareness-starter/
  README.md
  project/
    docs/           ← 5 markdown files with interconnected content
    data/           ← 2 CSV-style text files
  prompts/
    01-vague-task.md    ← "find out how X relates to Y" — triggers expensive tool path
    01-named-task.md    ← same task with specific tool named and target identified
    01-compare.md       ← reflection questions about what happened
```

**What the learner does:**
Run both versions of the same task and compare token counts. Read the reflection questions. Notice that the named version was cheaper and produced a more predictable result.

**Why this teaches the concept:**
Part 3 (tools are the action layer). Tool naming is introduced properly in A-07, but the module explicitly says the insight is available now: "if you name the tool and the target explicitly, Claude Code uses exactly what you named." Giving the learner a controlled comparison early builds the habit before they need it.

---

### My Pick: `brief-builder`

`constraint-drift-lab` requires a long enough session to observe drift, which may not happen naturally in a short exercise. `tool-awareness-starter` is better suited to A-07 (which has the full treatment). `brief-builder` hits the most immediate, teachable point: the gap between vague and precise prompt output. The learner writes both prompts themselves, gets both outputs, and can hold them side by side. That experience is genuinely useful beyond the exercise — they will use this "vague vs precise" thinking on every real task they bring to Claude Code.

**Concern:** The vague prompt needs to fail in an interesting way — not produce something obviously wrong, but produce something plausible-but-wrong. Finding the right balance in the sample documents is a content design challenge.

---

## LOG — A2 — A-01

**Initial instinct:** A-01 teaches three things. I had to pick which one to make unavoidable. I initially thought the context degradation concept was the most important (it is the one practitioners most underestimate), but it is hard to manufacture the conditions for it in a short exercise.

**Considered and rejected:** A "mental model journal" (too abstract, not practical enough), a "session transcript analysis" repo (would require the learner to have existing sessions to analyse), a tool call counter (requires scripting).

**What swayed me:** The module's own Without/With examples all centre on Part 1 — the gap between vague and precise instruction. That is where the module puts its pedagogical weight. The template repo should reinforce the same emphasis.

---

## A-02: Cost, Tokens, and What Things Actually Cost

**Core concept:** Token counting, cost estimation, reading usage, understanding what makes sessions expensive.

---

### Idea 1: `cost-estimator-notebook`

**What the repo contains:**
```
cost-estimator-notebook/
  README.md
  docs/
    short-doc.md        ← ~500 words
    medium-doc.md       ← ~2,000 words
    long-doc.md         ← ~8,000 words
  prompts/
    02-estimate-first.md    ← ask Claude Code to estimate tokens before reading each doc
    02-then-read.md         ← then actually read each doc and compare estimate to actual
    02-cost-calc.md         ← calculate actual cost using the worked formula from the module
  tracker/
    estimates.md        ← template table: Estimated / Actual / Difference
```

**What the learner does:**
For each document: first estimate the token count, then read it and check actual token usage, then calculate cost using the module's formula. Fill in the tracker table. Build intuition through comparison.

**Why this teaches the concept:**
The module's core goal is "estimate the cost of a Claude Code session before starting." The only way to build that skill is to estimate and then verify. This repo creates the conditions for that cycle in three sizes of document.

---

### Idea 2: `session-anatomy`

**What the repo contains:**
```
session-anatomy/
  README.md
  task/
    research-brief.md   ← a single task described in three ways: vague, medium, precise
  prompts/
    02-vague-run.md         ← run the vague version, record token usage
    02-medium-run.md        ← run the medium version, record token usage  
    02-precise-run.md       ← run the precise version, record token usage
    02-compare.md           ← reflection prompts + cost calculation
  log/
    usage-log.md        ← blank table to fill in: version / input tokens / output tokens / tool calls / cost
```

**What the learner does:**
Run three versions of the same task — vague, medium, precise — and log the token usage each time. The log table makes the cost difference visible across all three. The final reflection prompt asks: what made the expensive run expensive?

**Why this teaches the concept:**
The module says "a targeted request may need only one tool call; a vague request triggers expensive tool chains." This repo creates that comparison directly, with the learner logging real numbers from their own session.

---

### Idea 3: `budget-planner`

**What the repo contains:**
```
budget-planner/
  README.md
  worklog/
    tasks.md        ← 10 described tasks of varying complexity
  prompts/
    02-classify.md      ← classify each task by likely session type (short/medium/long/agent)
    02-estimate.md      ← estimate cost bracket for each using the module's benchmarks
    02-check.md         ← run one of the tasks and compare estimate to actual
  output/
    budget-plan.md  ← template to fill in
```

**What the learner does:**
Work through the 10 tasks, classify each one, estimate a cost bracket, then run one to check. The output is a reference sheet they can use to budget future sessions before starting them.

**Why this teaches the concept:**
The module ends with four pre-session questions: how many messages, will large files be read, delegation, what is my limit? The budget planner operationalises those questions as a repeatable practice with a reference sheet the learner actually keeps.

---

### My Pick: `session-anatomy`

`cost-estimator-notebook` teaches estimation but the comparison to actual involves extra steps that can confuse new learners. `budget-planner` produces something reusable but the 10-task classification could feel like busywork. `session-anatomy` is the strongest because it creates the most direct evidence of the module's core claim — vague sessions cost more — in the learner's own terminal with their own numbers. The usage-log table is the exercise and the artifact.

**Concern:** The "vague run" needs to reliably cost noticeably more than the "precise run" or the lesson does not land. The sample task needs to be calibrated so the vague version triggers enough extra tool calls to show a meaningful difference. This requires testing.

---

## LOG — A2 — A-02

**Initial instinct:** Cost is abstract until you see your own numbers. Every idea I considered had to result in the learner seeing actual token counts from their own sessions.

**Considered and rejected:** A token counter script (requires Bash expertise, not available yet), a "cheapest way to do X" comparison series (too technical), a spending tracker that queries the Anthropic API (paid API dependency — excluded by constraint).

**What swayed me:** The module itself provides a worked example with real numbers ($0.09 for a focused session). The best repo creates the conditions to repeat that worked example with real data from the learner's own runs. `session-anatomy` does that most cleanly.

---

## A-03: CLAUDE.md — Your Persistent Instructions

**Core concept:** Writing good project briefs and context docs; CLAUDE.md as standing instructions that travel with the project.

---

### Idea 1: `my-workspace`

**What the repo contains:**
```
my-workspace/
  README.md
  CLAUDE.md           ← a template CLAUDE.md with bracketed placeholders
  work/               ← empty folder for the learner's own documents
  prompts/
    03-test-rules.md      ← prompt designed to trigger each rule in CLAUDE.md
    03-verify.md          ← prompt: ask Claude Code to state which rules are active
    03-iterate.md         ← prompt: update a rule based on what you observed
```

**What the learner does:**
Fill in the CLAUDE.md template with their own rules (role, working style, output preferences, what to avoid). Then run the test prompts to observe whether Claude Code's behaviour changed. This is their personal workspace — they keep it after the exercise.

**Why this teaches the concept:**
The module's exercise is exactly this: write a minimal CLAUDE.md, start a session with it active, observe the effect. The repo provides the scaffold but the learner fills it with real preferences. Because it is their own workspace, they will actually keep using it.

---

### Idea 2: `writing-project`

**What the repo contains:**
```
writing-project/
  README.md
  CLAUDE.md           ← template with writing-specific sections: style rules, voice, what to avoid
  drafts/             ← 2 rough draft documents needing different kinds of work
  output/             ← empty
  prompts/
    03-without-rules.md   ← edit drafts/01.md with NO CLAUDE.md active (rename it first)
    03-with-rules.md      ← edit drafts/01.md WITH CLAUDE.md active
    03-compare.md         ← observe what changed
```

**What the learner does:**
Run the same editing task twice — once with CLAUDE.md renamed/removed so it is not active, once with it in place. Compare the outputs. The difference demonstrates the file's effect directly.

**Why this teaches the concept:**
The module's "Without/With" framing is its entire pedagogical structure. This repo recreates the without/with comparison as a first-person experience rather than a case study.

---

### Idea 3: `research-project`

**What the repo contains:**
```
research-project/
  README.md
  CLAUDE.md           ← template focused on research constraints: source requirements, format, what not to add
  sources/            ← 4–5 markdown files of research material
  output/             ← empty
  prompts/
    03-brief-claude.md    ← prompt that refers Claude Code to CLAUDE.md for standing rules
    03-synthesise.md      ← synthesis task
    03-check-compliance.md ← ask Claude Code to list which CLAUDE.md rules it applied and how
```

**What the learner does:**
Fill in the CLAUDE.md with research-specific preferences. Run a synthesis task. Then ask Claude Code explicitly which rules it applied and how. The compliance check is the teaching moment — it makes the CLAUDE.md's effect legible.

**Why this teaches the concept:**
The compliance check prompt ("list which CLAUDE.md rules you applied and how") forces a direct confrontation with whether the file is actually doing what the learner intended. This is a habit that transfers to every future project.

---

### My Pick: `my-workspace`

`writing-project` is excellent for writers but too domain-specific. `research-project`'s compliance check prompt is genuinely smart but relies on Claude Code being accurate about which rules it followed (it may not be). `my-workspace` is the strongest because it is genuinely general — it can accommodate any learner's real work — and the repo they build becomes their actual personal workspace. The learner ends this exercise with something they will open again.

**Concern:** The CLAUDE.md template needs to be carefully calibrated. Too prescriptive and learners just fill in blanks without thinking. Too open and they stall. The placeholders should ask specific enough questions that filling them in requires real reflection.

---

## LOG — A2 — A-03

**Initial instinct:** The module says "add rules as you notice patterns." The best repo creates conditions where patterns emerge immediately, so the learner has something real to codify.

**Considered and rejected:** A code project CLAUDE.md (too developer-centric), a team project template (too complex for solo learner), a CLAUDE.md quality checker (requires the learner to have existing CLAUDE.md files to evaluate).

**What swayed me:** The module explicitly says CLAUDE.md should travel with the project and be reused. `my-workspace` is the only idea where reuse is baked in from the start. The learner does not build a demo; they build their workspace.

---

## A-04: Context Awareness and Compaction

**Core concept:** What fits in context, what compaction preserves and loses, manual checkpointing, recognising context rot.

---

### Idea 1: `long-session-project`

**What the repo contains:**
```
long-session-project/
  README.md
  CLAUDE.md           ← minimal, pre-filled
  material/
    chapter-01.md through chapter-06.md  ← ~1,000 words each; a nonfiction topic broken into sections
  output/             ← empty
  prompts/
    04-constraints-first.md  ← prompt: set two standalone constraints before starting work
    04-work-sequence.md      ← 6 sequential work prompts, one per chapter
    04-checkpoint.md         ← the checkpoint prompt from the module, ready to personalise
    04-verify.md             ← what to check in the checkpoint response
```

**What the learner does:**
Front-load two constraints as standalone messages. Work through the chapter sequence (6+ turns — enough to potentially trigger compaction). Send the checkpoint. Verify whether both constraints appear in the summary. Correct if missing.

**Why this teaches the concept:**
The only way to learn checkpointing is to do it on a session long enough to matter. Six chapters of ~1,000 words each creates enough material to fill context meaningfully and make the checkpoint exercise real. The learner either confirms their constraints survived or catches a gap — both outcomes teach the lesson.

---

### Idea 2: `constraint-survival-test`

**What the repo contains:**
```
constraint-survival-test/
  README.md
  content/
    brief.md            ← a project brief with embedded implicit constraints
    styles.md           ← style rules written in two ways: conversational and standalone
  prompts/
    04-bury-constraint.md      ← embed a constraint in prose, work for 5 turns, checkpoint
    04-standalone-constraint.md ← state same constraint as standalone, work for 5 turns, checkpoint
    04-compare.md              ← reflection: what appeared in each checkpoint summary?
  output/
    session-a/
    session-b/
```

**What the learner does:**
Run two controlled sessions — same task, same constraint, two different ways of stating it. Checkpoint each session at the same point. Compare what appears in each summary.

**Why this teaches the concept:**
The module's central claim — "explicit beats implicit, standalone beats buried" — becomes the learner's own experimental result rather than a statement to believe. This is the most direct test of the concept.

---

### Idea 3: `report-builder`

**What the repo contains:**
```
report-builder/
  README.md
  CLAUDE.md
  research/
    topic-01.md through topic-04.md  ← source material for a structured report
  output/
    report.md       ← shell with section headings only
  prompts/
    04-session-start.md   ← front-load constraints, state structure decisions
    04-build-sections.md  ← one prompt per section
    04-checkpoint.md      ← checkpoint template personalised for this report
    04-decisions.md       ← "confirmed decision" prompt template for structural choices
```

**What the learner does:**
Build a multi-section report across multiple turns, practicing all five items in the module's compaction survival checklist as they go. Front-load constraints, name things explicitly, confirm decisions as standalone messages, checkpoint before the most complex section.

**Why this teaches the concept:**
The module teaches compaction management as a checklist. This repo turns the checklist into a project flow. The learner does not study the checklist; they practise it on real work.

---

### My Pick: `constraint-survival-test`

`long-session-project` is good but depends on compaction actually firing (which is not guaranteed for all learners — it depends on their session length and model context limits). `report-builder` is strong but complex to set up. `constraint-survival-test` is the strongest because it creates the comparison directly and does not depend on luck. Two sessions, same constraint, different framing, compare the checkpoints. The lesson either arrives as confirmation ("standalone survived, buried did not") or as a surprise ("both survived" — which is itself useful: then discuss why).

**Concern:** This requires the learner to run two separate sessions, which is more setup than single-session exercises. The README needs to make that explicit and explain why the comparison is worth the effort.

---

## LOG — A2 — A-04

**Initial instinct:** Context degradation is invisible until you deliberately look for it. The exercise has to create a moment where the learner specifically checks whether something survived.

**Considered and rejected:** A "context rot detector" script (too technical), a very long document exercise (boring, and compaction timing is unpredictable), a "rescue a degraded session" exercise (would require manufacturing a degraded state the learner didn't create themselves, which feels artificial).

**What swayed me:** The module's own exercise is explicit: "set two constraints, do work, checkpoint, check whether they appear." The template repo just needs to create the conditions for that exercise to happen with material interesting enough to work through. The two-session comparison is a bonus insight layer on top of the module's core exercise.

---

## A-05: Session Hygiene

**Core concept:** Starting and ending sessions well, scoping to one task, /clear between tasks, front-loading constraints, what to carry forward.

---

### Idea 1: `weekly-work-stack`

**What the repo contains:**
```
weekly-work-stack/
  README.md
  CLAUDE.md
  tasks/
    task-01-research.md   ← describe a research task with clear done state
    task-02-draft.md      ← describe a writing/drafting task
    task-03-review.md     ← describe a review task
  prompts/
    05-session-scope.md   ← the scoping starter from the module, pre-filled for each task
    05-reseed.md          ← re-seed template for after /clear
    05-log.md             ← prompt: write a session-end summary to log/
  log/                    ← empty
```

**What the learner does:**
Work through three tasks, each in its own scoped session. Use `/clear` between tasks. Write a session-end log after each one. The log records what was done, what the next step is, and what context to carry forward.

**Why this teaches the concept:**
Session hygiene is a habit, not a technique. The only way to build it is to practice the complete ritual: scope the session, do the work, log the outcome, clear before the next one. This repo provides three consecutive sessions to do that with.

---

### Idea 2: `task-brief-templates`

**What the repo contains:**
```
task-brief-templates/
  README.md
  CLAUDE.md
  briefs/
    brief-template.md       ← blank session scope template (from module's Copy-Personalise-Use)
    brief-example-01.md     ← completed example: research task
    brief-example-02.md     ← completed example: editing task
    brief-example-03.md     ← completed example: analysis task
  work/                     ← empty
  prompts/
    05-write-your-brief.md      ← instructions for writing a brief for YOUR actual task
    05-front-load.md            ← prompt: send constraints before any work begins
```

**What the learner does:**
Use the template to write a session brief for something they actually need to do. This is not a provided task — they bring their own. The three examples show what a well-formed brief looks like. Then they run the session using the brief.

**Why this teaches the concept:**
The module says "decide what one task this session is for before you open it." A blank template with three examples is the most direct way to teach that discipline. The learner does this with their real work, so the output has value beyond the exercise.

---

### Idea 3: `project-handoff`

**What the repo contains:**
```
project-handoff/
  README.md
  CLAUDE.md
  draft/
    content.md      ← a partially completed document with obvious next steps
  session-logs/     ← empty
  prompts/
    05-start-session.md     ← scoped session opener
    05-end-session.md       ← session closer: write handoff note for next session
    05-resume-session.md    ← how to re-open the project from a cold start using the handoff note
```

**What the learner does:**
Work on the draft in a scoped session. End the session by writing a handoff note (what was done, what is next, what constraints were active). Close. Reopen the project in a fresh session using only the handoff note as context. Notice how much cleaner the second session starts.

**Why this teaches the concept:**
Session hygiene is about controlling what transfers between sessions. The handoff note is the mechanism. This repo makes that mechanism the centre of the exercise rather than a side practice.

---

### My Pick: `weekly-work-stack`

`task-brief-templates` is excellent but too passive — the learner writes a brief but the exercise ends there. `project-handoff` is clever but the "resume with handoff note" structure is a level of sophistication beyond where A-05 sits in the track. `weekly-work-stack` wins because it creates the complete ritual three times. Session hygiene is a habit and habits require repetition. Three scoped sessions with `/clear` between them, each ending in a log entry, gives the learner three instances of the complete practice.

**Concern:** The three tasks need to be chosen carefully — they should feel like a realistic week's work, not random. The risk is they feel too generic and learners skip the log step. The README needs to make the log step mandatory and explain why.

---

## LOG — A2 — A-05

**Initial instinct:** Hygiene habits are built by doing them repeatedly, not by reading about them once. Every repo idea I had that was a single exercise felt insufficient.

**Considered and rejected:** A "session cost tracker" (covers A-02 ground), a "contamination detector" exercise (too abstract), a "re-seed practice" standalone (too focused on one technique).

**What swayed me:** The module connects explicitly to E-06 (re-seed) and B-08 (recovery). The best repo creates the conditions for all three practices — scope, /clear, log — to be used in sequence. Three tasks in one repo does that naturally.

---

## A-06: Output Engineering in Claude Code

**Core concept:** Plan-before-execute pattern, controlling format/structure/length of output, separating planning from doing.

---

### Idea 1: `structured-brief`

**What the repo contains:**
```
structured-brief/
  README.md
  CLAUDE.md
  input/
    raw-notes.md        ← disorganised notes on a topic (research, meeting, project)
    requirements.md     ← what the final brief should contain (but no format specified)
  output/               ← empty
  prompts/
    06-plan-first.md        ← ask for plan before writing; specify what to surface in plan
    06-approve-plan.md      ← template for approving/modifying the plan response
    06-execute.md           ← execute the approved plan
    06-format-control.md    ← same task with explicit format specification
```

**What the learner does:**
First run the plan-first prompt. Read the plan. Approve or redirect. Then execute. Then run the format-control version and compare the outputs to see how explicit format specification changed the structure.

**Why this teaches the concept:**
The module's two techniques — plan-before-execute and output format control — are both exercised in sequence. The learner experiences the plan-then-execute flow on a task with real structure requirements, which makes the value of the planning step concrete.

---

### Idea 2: `format-library`

**What the repo contains:**
```
format-library/
  README.md
  source/
    topic.md            ← a single medium-length document (~1,500 words)
  formats/
    brief.md            ← format spec: 100-word summary, no subheadings
    presentation.md     ← format spec: 5 slides with header and 3 bullets each
    email.md            ← format spec: 3-paragraph email for non-specialist reader
    table.md            ← format spec: comparison table, 4 columns
  output/               ← empty
  prompts/
    06-run-each-format.md   ← run the same source through each format spec
    06-plan-before-table.md ← table specifically requires planning first; show why
```

**What the learner does:**
Run the same source document through four different format specs. Observe how the same material is restructured differently for each output. The table format specifically requires a plan step first to decide on columns — this is where the plan-before-execute lesson arrives naturally.

**Why this teaches the concept:**
Format control is the key skill of A-06. Running one source through four formats makes the power of explicit format specification undeniable — the learner has four different outputs from the same input and can see exactly how format instructions drove each one.

---

### Idea 3: `draft-review-cycle`

**What the repo contains:**
```
draft-review-cycle/
  README.md
  CLAUDE.md
  drafts/
    draft-01.md         ← rough first draft of something real (a report, an argument, a proposal)
  prompts/
    06-plan-revisions.md    ← plan approach to revision before making changes
    06-format-spec.md       ← write format spec for the revised output
    06-execute-revision.md  ← execute against the plan + format spec
    06-compare.md           ← compare original draft to revised output
  output/               ← empty
```

**What the learner does:**
Work through a full revision cycle: plan the revision approach, specify the output format, execute. The plan step prevents Claude Code from just rewriting everything at once. The comparison prompt makes the planning step's value visible.

**Why this teaches the concept:**
Revision is where the plan-before-execute habit pays off most clearly — without it, Claude Code will rewrite entire drafts when a targeted revision was requested. This repo creates that specific scenario.

---

### My Pick: `format-library`

`structured-brief` is close but the "plan then execute" sequence can feel forced when the task is a brief. `draft-review-cycle` is strong but complex to scaffold well. `format-library` is the strongest because it creates unambiguous evidence for the module's core teaching: format specification controls the output. Four versions of the same source, each shaped by a different format spec, is a collection the learner can reference long after the exercise. They keep the format specs as reusable templates.

**Concern:** The source document needs to be rich enough that each format transformation is genuinely interesting. A dry technical document will produce boring outputs in every format. The sample content needs care.

---

## LOG — A2 — A-06

**Initial instinct:** Output engineering is about control. The best exercise is one where lack of control produces a noticeably bad output and explicit control produces a noticeably good one.

**Considered and rejected:** A "code documentation formatter" (too developer-specific), a "slide deck generator" (requires external tools), a "multi-author consistency checker" (too complex for this stage).

**What swayed me:** The module provides two Copy-Personalise-Use starters — one for planning, one for format control. A repo that exercises both, but makes format control the centrepiece, aligns with where the module puts its teaching weight. `format-library` also produces immediately reusable artifacts: four format specs the learner can apply to their own work.

---

## A-07: Tool Fluency

**Core concept:** Read/Glob/Grep/Edit/Write/Bash — understanding the tool hierarchy, choosing the right tool, naming tools explicitly to control cost and precision.

---

### Idea 1: `knowledge-base-audit`

**What the repo contains:**
```
knowledge-base-audit/
  README.md
  CLAUDE.md
  kb/
    (15–20 markdown files on a common domain — project management, productivity, etc.)
  prompts/
    07-grep-task.md     ← find all mentions of X across kb/ — name Grep
    07-glob-task.md     ← find all files matching *.md in a specific subfolder — name Glob
    07-read-task.md     ← read a specific named file — name Read
    07-bash-task.md     ← show the last-modified date of all files — name Bash
    07-compare.md       ← run same tasks without naming tools; compare token counts
  output/
    audit-results.md    ← template for recording results
```

**What the learner does:**
Work through four tasks — each designed for a specific tool — first naming the tool explicitly, then repeating one task without naming the tool, comparing token counts and result quality.

**Why this teaches the concept:**
The module's exercise has two parts: name the tool, then compare named vs unnamed. This repo provides the material for both parts with four tool types covered in sequence. Each task is designed so that the named tool is clearly the right choice, building recognition of which tasks belong to which tools.

---

### Idea 2: `codebase-explorer`

**What the repo contains:**
```
codebase-explorer/
  README.md
  CLAUDE.md
  project/
    src/
      (a small, non-trivial set of markdown + config files simulating a real project structure)
    docs/
    config/
  prompts/
    07-find-files.md    ← Glob task: find all config files
    07-search-content.md ← Grep task: find all mentions of a key term
    07-read-specific.md  ← Read task: read one named file
    07-run-command.md    ← Bash task: list all files modified in the last 7 days
    07-recovery.md       ← what to do if Claude Code uses the wrong tool
  output/               ← empty
```

**What the learner does:**
Navigate a project structure using each tool in sequence. The tasks escalate from simple (Read one file) to more complex (Grep across folders). The recovery prompt practices the "why did you use X instead of Y?" technique from the module.

**Why this teaches the concept:**
The module explicitly says the learner should see each tool call before approving it. This repo creates multiple approval moments — one per tool — so the learner practices recognising tool calls in the terminal output and approving or rejecting them.

---

### Idea 3: `document-search-toolkit`

**What the repo contains:**
```
document-search-toolkit/
  README.md
  CLAUDE.md
  documents/
    (12 documents: mix of markdown, plain text, covering 2–3 related topics)
  prompts/
    07-tool-picker.md       ← 6 task descriptions; learner must identify the right tool before running
    07-run-all.md           ← run all 6 tasks in sequence, one per message
    07-cost-log.md          ← template: task / tool used / tokens / notes
  log/                  ← empty
```

**What the learner does:**
Read six task descriptions. For each, decide which tool is appropriate (no prompting — this is a test). Write the tool choice in the cost log before running. Then run each task. Compare what they predicted vs what happened. Log the token count.

**Why this teaches the concept:**
The tool selection decision is the skill being taught. Making the learner predict before acting tests whether they have actually internalised the hierarchy. The cost log creates the comparison dataset that proves the lesson.

---

### My Pick: `knowledge-base-audit`

`codebase-explorer` is strong but the project structure feels more developer-oriented than the Linguist audience expects. `document-search-toolkit` is the best pedagogical design (predict then verify) but the six-task sequence is long for a single exercise. `knowledge-base-audit` wins because it covers all four tool types cleanly, creates the direct named vs unnamed comparison the module calls for, and results in an audit document the learner actually keeps. A knowledge base of 15–20 markdown files is also the kind of thing many Linguist learners already have (Obsidian, Notion exports, research folders).

**Concern:** The Bash task (last-modified dates) is the most technical task in any of these repos. It should be the last one attempted and the prompt should make the command explicit rather than asking the learner to invent it.

---

## LOG — A2 — A-07

**Initial instinct:** Tool fluency is fundamentally about recognition — knowing which tool the task calls for before you write the message. The exercise has to test that recognition, not just demonstrate it.

**Considered and rejected:** A "tool cost calculator" spreadsheet (not Claude Code native), a "refactoring assistant" repo (too developer-specific), a web research comparison task (WebSearch is covered but the module focuses on file tools first).

**What swayed me:** The module's own exercise is explicit: "name the tool before you send" and "compare tool choice and cost." The best repo creates the conditions for both of those exactly. A knowledge base of markdown files is the most universally relatable project structure for the Linguist audience.

---

## A-08: Agent Delegation and Briefing

**Core concept:** Sub-agents, parallel work, writing delegation briefs, knowing when to delegate vs do in the main session.

---

### Idea 1: `research-pipeline`

**What the repo contains:**
```
research-pipeline/
  README.md
  CLAUDE.md
  topics/
    topic-a.md      ← research question + background context
    topic-b.md      ← research question + background context
    topic-c.md      ← research question + background context
  briefs/
    brief-template.md   ← the 5-part brief template from the module
    brief-example.md    ← a completed example for topic-a (filled in well)
  delegation-test/
    delegate-this.md    ← a task that passes the 3-question delegation test
    dont-delegate.md    ← a task that fails the test (requires direct judgement)
  output/               ← empty
  prompts/
    08-delegation-decision.md  ← run through the 3-question test on both tasks
    08-write-brief.md          ← write the 5-part brief for topic-b
    08-evaluate.md             ← evaluate the subagent output against the brief
```

**What the learner does:**
Work through the delegation decision for two tasks (one delegatable, one not). Write a 5-part brief for the delegatable one. Send it. Evaluate the output against the brief using the four evaluation questions from the module.

**Why this teaches the concept:**
The module's two skills are the delegation decision and the brief. This repo exercises both in sequence. The `dont-delegate.md` task is as important as the delegatable one — the learner must articulate why they would not delegate it.

---

### Idea 2: `content-commission`

**What the repo contains:**
```
content-commission/
  README.md
  CLAUDE.md
  commissions/
    commission-01.md    ← a vague research task (bad delegation candidate — intentionally)
    commission-02.md    ← a well-scoped research task (good delegation candidate)
    commission-03.md    ← a judgement task (should not be delegated)
  briefs/
    bad-brief.md        ← an example brief missing two of the five parts
    good-brief.md       ← a completed 5-part brief
  prompts/
    08-spot-the-gap.md      ← what is missing from the bad brief?
    08-write-your-brief.md  ← write a brief for commission-02
    08-brief-evaluation.md  ← post-delegation evaluation checklist
  output/               ← empty
```

**What the learner does:**
First: identify what is wrong with the bad brief. Second: write a brief for commission-02. Third: delegate and evaluate. The spot-the-gap exercise builds the vocabulary for what makes a brief fail before they write their own.

**Why this teaches the concept:**
The module says "when the brief fails, the session is over — the correction happens in the brief, not in the conversation." Understanding what makes a brief fail is as important as knowing how to write one. The bad brief example creates that understanding through recognition rather than instruction.

---

### Idea 3: `parallel-research-pack`

**What the repo contains:**
```
parallel-research-pack/
  README.md
  CLAUDE.md
  questions/
    q-01.md through q-04.md     ← four independent research questions
  briefs/
    brief-template.md
  prompts/
    08-independence-check.md    ← assess: do these questions depend on each other?
    08-write-four-briefs.md     ← write briefs for all four
    08-parallel-vs-sequential.md ← when to run in parallel vs one at a time
    08-evaluate-all.md          ← evaluate all four outputs against briefs
  output/               ← empty
```

**What the learner does:**
Assess whether the four questions are genuinely independent (if not, identify the dependency). Write briefs for all four. Run them. Evaluate each output. Discuss parallel vs sequential.

**Why this teaches the concept:**
Parallel delegation is mentioned in the module as a benefit of properly scoped tasks. This repo creates that scenario directly. But the independence check first ensures the learner has thought through the dependency question before running anything.

---

### My Pick: `content-commission`

`research-pipeline` is solid but the two-task structure does not build the vocabulary for brief failure the way the bad-brief exercise does. `parallel-research-pack` is more advanced than A-08 requires and risks costing too much (four parallel subagents). `content-commission`'s spot-the-gap exercise is the strongest unique element: the learner identifies brief failure before they write their own brief, which builds a quality filter they carry forward. The progression from bad brief to good brief to their own brief is a teaching sequence that genuinely sticks.

**Concern:** The `bad-brief.md` needs to fail in a specific, recognisable way — not obviously broken, but genuinely missing something that a learner at this stage would also miss. Finding the right failure mode requires careful writing.

---

## LOG — A2 — A-08

**Initial instinct:** The most common failure mode in delegation is a brief that fails because it did not specify scope clearly enough. The best exercise creates that failure mode in a controlled setting where the learner can see it and name it.

**Considered and rejected:** A "parallel product research" task (risks excessive cost), a "self-briefing" exercise where the learner briefs a subagent to do work they would normally do themselves (confusing distinction), a "multi-agent pipeline" design exercise (that is builder-track territory).

**What swayed me:** The module's recovery path is explicit: "when the brief fails, identify the flaw." `content-commission` creates the conditions for that identification exercise before the learner's own brief fails. That is better pedagogy than learning it from their own mistakes alone.

---

## A-09: Capstone — A Real Project

**Core concept:** Full project lifecycle — CLAUDE.md, scoped sessions, compaction management, output engineering, tool naming, delegation — all applied to real work.

---

### Idea 1: `research-to-brief`

**What the repo contains:**
```
research-to-brief/
  README.md
  CLAUDE.md               ← substantial template (not blanks — real choices to make)
  research/
    source-01.md through source-05.md   ← real-feeling research material (~2k words each)
  sessions/
    session-plan.md       ← template: define 3 sessions before starting
    session-log.md        ← log template: task / constraints / next step / tool notes
  output/
    brief.md              ← shell with defined structure
  prompts/
    09-session-01.md      ← scoped session: plan the brief structure
    09-session-02.md      ← scoped session: build sections 1–3
    09-session-03.md      ← scoped session: build sections 4–5 + delegate one research task
    09-checkpoint.md      ← checkpoint template
    09-delegation-brief.md ← 5-part brief template for the research sub-task
```

**What the learner does:**
Complete a full research brief using all six required techniques from A-09's checklist. Three scoped sessions, each with a `/clear` between them. Manual checkpoint in the longest session. Planning before execution in at least one session. Named tools throughout. One subagent delegation. The session logs carry state forward between sessions.

**Why this teaches the concept:**
This is the capstone exercise from the module, templated. All six required techniques from the A-09 checklist are forced by the repo's structure — the learner cannot complete the brief without using each one.

---

### Idea 2: `personal-knowledge-system`

**What the repo contains:**
```
personal-knowledge-system/
  README.md
  CLAUDE.md               ← pre-written with strong conventions for this project
  inbox/
    (10–15 varied notes, clippings, and rough documents)
  structured/             ← empty
  archive/                ← empty
  sessions/
    session-plan.md
    session-log.md
  prompts/
    09-setup-session.md         ← session 1: CLAUDE.md + plan the system
    09-process-inbox-session.md ← session 2: process inbox into structured/
    09-synthesise-session.md    ← session 3: synthesise key themes into a master brief
    09-delegate-research.md     ← delegate one synthesis task to a subagent
```

**What the learner does:**
Build a personal knowledge system from a messy inbox: plan the structure, process documents into categorised files, synthesise key themes. The three-session structure forces `/clear`, checkpointing, and delegation naturally.

**Why this teaches the concept:**
This is the most universally applicable capstone — almost every learner has a folder of notes they have been meaning to make sense of. The output is something they will actually keep using: a structured knowledge base with a synthesised brief. The CLAUDE.md for this project also becomes a model for future knowledge management sessions.

---

### Idea 3: `project-documentation-sprint`

**What the repo contains:**
```
project-documentation-sprint/
  README.md
  CLAUDE.md               ← project-specific template
  source/
    notes.md              ← rough project notes
    decisions.md          ← a log of key decisions (sparse)
    meeting-notes.md through meeting-notes-04.md  ← 4 meeting logs
  output/
    project-brief.md      ← shell
    decision-log.md       ← shell
    onboarding.md         ← shell (for someone new joining the project)
  sessions/
    session-plan.md
    session-log.md
  prompts/
    09-session-plan.md        ← plan three sessions before starting
    09-build-brief.md         ← session 1
    09-build-decision-log.md  ← session 2
    09-build-onboarding.md    ← session 3: delegate onboarding doc synthesis to subagent
```

**What the learner does:**
Document a project from scratch using three output formats: brief, decision log, onboarding guide. The onboarding guide is delegated. Each session uses the full toolkit.

**Why this teaches the concept:**
Documentation is the most universally applicable project type for the Linguist audience. Everyone has a project that needs documenting. The three output types create natural session scoping and force the learner to think about audience and format for each one.

---

### My Pick: `personal-knowledge-system`

`research-to-brief` is the most structured and checklist-aligned, but it can feel like a test rather than a real project. `project-documentation-sprint` is excellent for people with active projects but presupposes the learner has meeting notes and decision logs (many learners at this stage are solo or early-stage). `personal-knowledge-system` is the strongest because everyone has an inbox of unprocessed notes, the output is something they will actually use long after the course, and the three-session structure naturally invites all six required techniques from the checklist. It is the most pragmatist answer to "would someone keep using this?"

**Concern:** The 10–15 inbox items need to be varied and realistic enough that processing them feels worthwhile, not like processing someone else's spam. The sample content is the single biggest design risk for this repo.

---

## LOG — A2 — A-09

**Initial instinct:** The capstone has to be something the learner genuinely needs — not a manufactured scenario. The module itself says "pick something you actually need to do." The repo's job is to provide a project structure for learners who cannot identify their own, and to model the session-planning ritual for learners who would otherwise skip it.

**Considered and rejected:** A "build a team playbook" repo (too team-focused for solo learners), a "competitive analysis" task (requires web research — cost concern), a "course notes processor" meta-exercise where learners process their own Linguist notes (too recursive and potentially confusing).

**What swayed me:** The capstone module says the output must be something the learner actually uses. A personal knowledge system made from their own (or simulated) notes is the only idea where the output is intrinsically valuable regardless of the learner's specific role or domain. The pragmatist test: would they open this folder six weeks later? Yes. That is the answer.

---

## Summary: My Strongest Picks

| Module | Repo | Why it survives the pragmatist test |
|--------|------|-------------------------------------|
| A-00 | `reading-room` | Ends the session with a real file; zero abstraction |
| A-01 | `brief-builder` | Side-by-side outputs show the gap between vague and precise; applies to every future task |
| A-02 | `session-anatomy` | Learner's own token counts; usage-log they can reference |
| A-03 | `my-workspace` | Becomes their actual workspace; reused after the exercise |
| A-04 | `constraint-survival-test` | Creates the experimental result themselves; proves the lesson rather than asserting it |
| A-05 | `weekly-work-stack` | Three complete sessions; habit repetition built in |
| A-06 | `format-library` | Four reusable format specs; library they keep |
| A-07 | `knowledge-base-audit` | Covers all four tools; audit output has real value |
| A-08 | `content-commission` | Bad-brief exercise builds quality filter before they write their own |
| A-09 | `personal-knowledge-system` | Output is something they actually use indefinitely |

---

## Cross-Module Concerns for A1, A3, A4 to Challenge

1. **Sample content quality is the hidden design risk across all repos.** The template structure is straightforward to build; the sample documents that make the exercises feel real are harder. Every module's strongest idea depends on content that is realistic and domain-neutral but not boring. This needs dedicated attention in production.

2. **A-04 and A-07 repos depend on observable differences.** `constraint-survival-test` works only if the two sessions produce meaningfully different checkpoint summaries. `knowledge-base-audit` works only if the named-tool vs unnamed-tool comparison produces visible cost difference. Both need to be tested on actual sessions before being shipped.

3. **A-08's cost warning is serious.** The module has an explicit cost warning. The capstone `content-commission` repo asks the learner to run a subagent. The repo's README needs to echo the module's cost guidance very directly. This is the highest-cost exercise in the pack.

4. **A-05 and A-09 both have session logs.** This is intentional — the log habit is foundational at both stages. But the format should be consistent across repos to avoid confusion. A shared `session-log.md` template should be standardised across A-track repos.

5. **None of these repos assume any technical background.** This is correct for the Linguist audience but it means some learners will have no context for why folder structure matters, what a working directory is, etc. The READMEs need to address this without condescending.

---

*End of A2 Phase 1 output. Ready for A1, A3, A4 challenge round.*
