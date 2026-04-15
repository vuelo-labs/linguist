# Agent A4 — A-track Template Repo Brainstorm
*Phase 1: Independent brainstorm — Critical/Systems lens*
*Date: 2026-04-15*

---

## Framing note

I read every module before writing this. My job as A4 is not to propose the most ideas — it is to propose the most structurally sound ones, name the failure modes, and kill weak ideas before they waste the other agents' time. Expect hard flags. A repo idea that can be completed without actually engaging with the module concept is not a teaching tool — it is a prop.

The core test I am running against every idea: **can a learner complete this repo while sidestepping the module's concept?** If yes, it fails. The concept must be unavoidable, not suggested.

A second test I am running: **does the CLAUDE.md in this repo model what the module teaches?** A CLAUDE.md that is just boilerplate is a missed teaching opportunity. The CLAUDE.md is part of the instructional design, not background furniture.

---

## A-00: Getting Started with Claude Code

**Core concept in one sentence:** Claude Code runs in your terminal, reads your file system with your permission, and makes real changes to real files — this is categorically different from chat AI, and the permission model is your only control layer.

---

### Idea 1: `first-session-folder`

**What the repo contains:**
```
first-session-folder/
  README.md              ← installation check + exercise instructions
  notes/
    meeting-1.txt        ← raw meeting notes (3 short meetings, ~150 words each)
    meeting-2.txt
    meeting-3.txt
  outputs/               ← empty folder; learner fills this via Claude Code
  CLAUDE.md              ← minimal: "You are helping me process meeting notes. Ask permission before writing any file."
  annotated-prompts.md   ← 3 prompts with full bracket annotation, one per meeting
```

**What the learner does:**
Navigates to the folder in their terminal, starts Claude Code, uses the annotated prompt to ask Claude Code to summarise `meeting-1.txt` and write the result to `outputs/summary-1.txt`. Approves the Read tool call, approves the Write tool call, sees the file appear. Repeats for meetings 2 and 3.

**Why this teaches the module concept:**
The permission model is unavoidable: the learner must type `y` for every Read and every Write. The empty `outputs/` folder is the evidence: nothing appears there until the learner approves the Write. The moment of seeing a real file created on their file system — not as a chat response, but as an actual `.txt` file they can open in their editor — is the conceptual break from chat AI.

**Critical flag:**
If the learner already has Claude Code configured in auto-approve mode (e.g. from prior experimentation), they will see no permission prompts at all and miss the teaching moment entirely. The README must include an explicit instruction: "If Claude Code asks about auto-approve settings, select manual approval for this exercise. The permission prompts are the point." This is easy to forget in production.

---

### Idea 2: `read-before-you-trust`

**What the repo contains:**
```
read-before-you-trust/
  README.md              ← exercise: deliberately reject one action, then approve the same one
  document.md            ← a 600-word document the learner will ask Claude Code to summarise
  instructions.txt       ← contains instructions that, if followed literally, produce a result the learner does not want
  CLAUDE.md              ← "Always describe what you plan to do before doing it. Wait for confirmation."
  annotated-prompts.md
```

**What the learner does:**
Sends a prompt asking Claude Code to "read `instructions.txt` and follow them." Watches Claude Code propose a Read of `instructions.txt`, then a series of actions based on its contents. Rejects one action. Asks Claude Code to explain what it was going to do. Approves a modified version. The exercise is about rejecting a proposed action, not just approving them.

**Why this teaches the module concept:**
The module says: "Never approve an action you do not understand. If you are not sure what an action will do, type n to reject it." This repo makes rejection practice structural — the exercise cannot be completed without one deliberate rejection and one explanation request. Most repos only teach approval. This one teaches the `n` path.

**Critical flag:**
`instructions.txt` needs to contain instructions that produce a plausible-looking but wrong action — something Claude Code would reasonably want to do but that the learner should stop. If the instructions are too obviously harmful, learners will reject them without thinking. If they are too subtle, learners may approve them reflexively. The file must be carefully written and tested.

---

### Idea 3: `what-just-happened`

**What the repo contains:**
```
what-just-happened/
  README.md              ← instructions: run a session. Then read this file and answer the questions.
  files/
    doc-a.md             ← a short document
    doc-b.md             ← a short document
  prompts/
    opener.md            ← an annotated first-session prompt
  reflection.md          ← fill-in questions: "What did Claude Code read? What did it write? What did you approve? What would have happened if you had typed n?"
  CLAUDE.md              ← minimal
```

**What the learner does:**
Runs a short Claude Code session using the opener prompt (summarising both documents, writing results). Then fills in `reflection.md` — a structured retrospective on what just happened mechanically. The reflection forces articulation of what the permission model actually is.

**Why this teaches the module concept:**
The reflection.md converts the experience into an explicit mental model. Learners who finish a first session often cannot articulate what just happened — the reflection forces them to. The question "what would have happened if you had typed n?" is the most important question in A-00 and cannot be skipped if the reflection is required.

**Critical flag:**
This is the weakest structural idea of the three. The reflection can be skipped or filled in superficially. There is no forcing function — the learner can write "I don't know" in every field and move on. The exercise works well for motivated learners and fails for everyone else. Not structurally sound.

---

### My reasoning

**Most structurally sound: Idea 1 (`first-session-folder`)**

The empty `outputs/` folder is the best forcing function: real files appearing on disk is the conceptual moment that distinguishes Claude Code from chat AI. The learner cannot fake this — the files are either there or they are not. The three meetings provide enough material for multiple Read/Write approvals, making the permission model a repeated practice rather than a one-time observation.

Idea 2 is pedagogically valuable — the `n` path deserves its own practice — but depends on the quality of `instructions.txt`, which requires careful production work. Idea 3 is too passive; the reflection is sidestepped too easily.

**Explicit rejection:** Idea 3 as a standalone repo. The reflection question format is worth including as an addendum to Idea 1's README, but not as the primary exercise.

---

## LOG — A4 — A-00

The core teaching moment for A-00 is the physical experience of approving tool calls. Any repo design that does not put that moment at the centre is wrong. The best indicator that the repo worked: the learner can open their file explorer and see files that were not there before they started.

The auto-approve risk is real and under-acknowledged. If learners arrive at this module having previously tinkered with Claude Code settings, the permission flow may be invisible to them. Infrastructure note: the sandbox CLAUDE.md should include a rule against auto-approve for A-00 specifically, not left to the README alone.

Structural tension I am noting: A-00's module content spends significant time on installation and terminal basics. The template repo assumes installation is already done (the learner is running Claude Code). The repo is not the installation guide — it is the first real session. These two things (installation, first session) should not be conflated in the repo design.

---

## A-01: Mental Model Refresher

**Core concept in one sentence:** Claude Code executes your text, not your intent — the context window is finite and degrades over time — and tools are how Claude Code acts in the world. Three facts that explain most failures.

---

### Idea 1: `intent-gap-lab`

**What the repo contains:**
```
intent-gap-lab/
  README.md              ← instructions: run vague first, precise second, compare
  task-brief.md          ← describes a research task with deliberate ambiguity: "Look into how [Company X] approaches [topic]"
  prompts/
    vague.md             ← the underspecified version (annotated: "what is left to Claude's judgement?")
    precise.md           ← the fully specified version (annotated: "what closed each gap?")
  outputs/
    vague-result.md      ← empty; learner fills after first run
    precise-result.md    ← empty; learner fills after second run
  CLAUDE.md              ← "This is a diagnostic exercise. Do not volunteer analysis beyond what is requested."
```

**What the learner does:**
Sends the vague prompt, saves the output to `outputs/vague-result.md`. Sends the precise prompt, saves to `outputs/precise-result.md`. Reads the annotations on both prompts. Writes one sentence in each output file: "What did I actually want vs. what did I get?"

**Why this teaches the module concept:**
Part 1 of the mental model — text, not intent — is demonstrated by the learner's own outputs. The gap between the two result files is the evidence. The annotations on the prompts explain what closed each gap, making the technique legible alongside the demonstration.

**Critical flag:**
The contrast depends on the vague prompt reliably misfiring. If Claude Code happens to produce a good response to the vague prompt on a given run, the gap disappears and the lesson is invisible. The vague prompt must be calibrated to produce a predictably off-target result — not just theoretically vague. This requires testing across multiple runs. Any vague prompt that relies on the model making a single ambiguous choice will not reliably misfire; it needs multiple ambiguities compounding.

---

### Idea 2: `context-decay-watch`

**What the repo contains:**
```
context-decay-watch/
  README.md              ← a structured session script (message 1–15 in sequence)
  CLAUDE.md              ← minimal
  session-script.md      ← explicit messages to send, with two constraints stated in different ways:
                           - Constraint A: standalone explicit message early in session
                           - Constraint B: buried conversationally in message 5
  documents/             ← 12 short documents to process (enough to build context length)
  checkpoint-prompt.md   ← the checkpoint from A-04, included here as preview
  outputs/
    checkpoint-response.md  ← empty; learner pastes checkpoint result here
    analysis.md             ← two questions: "Which constraint survived? Which didn't? Why?"
```

**What the learner does:**
Follows the session script. Sets both constraints in the specified ways. Works through the documents. At message 15, sends the checkpoint. Pastes the response. Fills in the analysis. The analysis forces articulation of the explicit/implicit survival gap.

**Why this teaches the module concept:**
Part 2 of the mental model — context window degrades — is demonstrated in the learner's own session. The analysis questions prevent the learner from observing the result without naming the pattern.

**Critical flag:**
This requires a genuinely long session, and the compaction event may or may not fire within 15 messages depending on document length and message length. If compaction doesn't fire, the constraint-survival test becomes trivial (both survive) and the lesson disappears. The documents need to be long enough to push the session toward real compaction, which means this is one of the more expensive exercises before A-07/A-08. Cost warning required.

---

### Idea 3: `tool-call-visible`

**What the repo contains:**
```
tool-call-visible/
  README.md              ← three tasks, three tool call predictions
  CLAUDE.md              ← "Before every action, state the tool name you are about to use."
  project/               ← ~10 files of varied types
  tasks/
    task-a.md            ← "What does config.json contain?" — expected: Read
    task-b.md            ← "Find all files mentioning [word]" — expected: Grep
    task-c.md            ← "List .md files" — expected: Glob
  prediction-log.md      ← template: task, expected tool, actual tool, match?
  README.md
```

**What the learner does:**
For each task, writes down their expected tool in `prediction-log.md` before sending. Watches the tool call appear in Claude Code's output before approval. Records whether their prediction matched. After all three: reflects on what the tool choice reveals about how Claude Code "acts in the world."

**Why this teaches the module concept:**
Part 3 of the mental model — tools are the action layer — is made concrete through prediction and verification. The learner internalises the connection between task type and tool type by making a testable prediction before each action.

**Critical flag:**
This overlaps significantly with A-07 (Tool Fluency). Including this exercise in A-01 risks making A-07 feel like review. The A-01 version should be intentionally shallower — "tools exist and you can see them" rather than "here is how to choose and name them." The depth difference must be explicit in the repo design, or A-07 will feel redundant.

---

### My reasoning

**Most structurally sound: Idea 1 (`intent-gap-lab`)**

The side-by-side comparison of vague vs. precise outputs in the learner's own files is the cleanest structural demonstration of Part 1. The outputs are saved to disk, making the comparison durable — not just a chat transcript they will scroll past. The learner must produce two files and acknowledge the gap between them.

Idea 2 is pedagogically correct but operationally fragile (compaction timing). Idea 3 belongs in A-07 at depth, not A-01 as a primary exercise.

**Explicit rejection:** Idea 3 as the main repo for A-01. A shallow tool-awareness exercise at A-01 sets up either a shallow A-07 or a repetitive one. Tools should be gestured at in A-01's CLAUDE.md or README, not given their own repo.

**Note for other agents:** The calibration problem in Idea 1 is genuine and not solvable at the design stage. The vague prompt must be field-tested across multiple model runs before the repo ships. This is a production requirement, not a brainstorm issue.

---

## LOG — A4 — A-01

A-01 is a conceptual module with three distinct parts. Template repos are execution tools. The fit is weakest here of all ten modules. Any single repo can only demonstrate one part cleanly.

My honest assessment: Part 1 (text not intent) is demonstrable via repo. Part 2 (context degrades) is demonstrable but requires session length that is hard to engineer reliably. Part 3 (tools as action layer) is better taught in A-07 at full depth.

A repo that tries to demonstrate all three parts in one session will be too long, too fragile, or too shallow. The honest answer for A-01 is one repo, one part. Accept this and make Part 1 excellent rather than making all three mediocre.

---

## A-02: Cost, Tokens, and What Things Actually Cost

**Core concept in one sentence:** Every token costs money — four things drive cost (long context, many tool calls, long sessions, delegation) — knowing which ones apply before you start lets you make deliberate spend decisions.

---

### Idea 1: `scope-vs-sweep`

**What the repo contains:**
```
scope-vs-sweep/
  README.md              ← instructions: run Version A, record cost. Run Version B, record cost. Compare.
  documents/             ← 15 documents of varied length (~5,000 tokens total)
  tasks/
    version-a.md         ← "Look through these documents and find anything relevant to [topic]"
    version-b.md         ← "Read documents 4, 9, and 13. Find mentions of [topic] in each. Stop when done."
  outputs/
    cost-comparison.md   ← template: Version A tokens, Version B tokens, what drove the difference
  CLAUDE.md              ← "After each response, report: total input tokens, total output tokens."
```

**What the learner does:**
Runs Version A (sweep), notes the token counts, saves them. Runs Version B (scoped), notes the token counts, saves them. Fills in `cost-comparison.md`. The comparison question: what drove the difference?

**Why this teaches the module concept:**
The module's core claim — "be specific, name the file, reduce the search space" — is demonstrated by the learner's own token numbers. The comparison is controlled (same documents, same topic, different scope), so the cost driver is isolated as scope specificity alone.

**Critical flag:**
The sweep version needs to reliably trigger more tool calls than the scoped version. If Claude Code makes sensible choices on Version A and only reads the three most relevant documents anyway, the cost difference is minimal and the lesson evaporates. The topic in `version-a.md` must be ambiguous enough to trigger a broad search. This requires testing. The documents must contain the topic in unexpected places (not just the obvious files) to force the sweep.

---

### Idea 2: `cost-before-after`

**What the repo contains:**
```
cost-before-after/
  README.md              ← three rounds: estimate first, then run, then compare
  estimator.md           ← fill-in template: "How many messages? Files to read? Delegation? Mental budget?"
  tasks/
    task-light.md        ← a short, targeted task (read one file, 3 bullet points)
    task-medium.md       ← a medium task (read 4 files, structured summary)
    task-heavy.md        ← a deliberately open-ended, vague task designed to trigger many tool calls
  outputs/
    estimates.md         ← learner fills before each run
    actuals.md           ← learner fills after each run
    reflection.md        ← "Which task did you estimate most accurately? Which variable were you wrong about?"
  CLAUDE.md              ← minimal
```

**What the learner does:**
Before each task: fills in the estimator (expected messages, files, delegation: yes/no, mental budget). After each task: records actual token counts. After all three: fills in the reflection — which estimates were accurate, which weren't, and which cost driver they underestimated most.

**Why this teaches the module concept:**
The module's explicit goal is: "estimate cost before starting, not after." This repo makes the estimation a required step, not an option. The estimation error is the learning — the learner discovers which cost driver they miscalibrate, not which drivers exist in theory.

**Critical flag:**
The task-heavy prompt needs to be calibrated to reliably trigger many tool calls. The same problem as Idea 1. Additionally: asking learners to estimate tokens before they have any intuition for what a token is (this is A-02, not A-07) may produce estimates so far off as to feel demoralising rather than instructive. The estimator template needs to guide estimation without requiring precision — "roughly how many exchanges?" rather than "how many tokens?"

---

### Idea 3: `the-delegation-multiplier`

**What the repo contains:**
```
the-delegation-multiplier/
  README.md              ← instructions: complete the same research task in two ways
  research-task.md       ← a defined research task requiring reading 5 documents and producing a summary
  documents/             ← the 5 documents
  approach-a-prompt.md   ← do it in the main session, reading files directly
  approach-b-prompt.md   ← delegate it to a subagent
  outputs/
    approach-a-tokens.md ← empty; learner records cost of main-session approach
    approach-b-tokens.md ← empty; learner records cost of delegation approach
    reflection.md        ← "What was the cost multiplier? When is the extra cost justified?"
  CLAUDE.md              ← minimal, with a note: "This exercise demonstrates cost. Both approaches produce similar output."
```

**What the learner does:**
Runs the research task in the main session, records token counts. Runs the same task via a subagent brief, records token counts. Compares. The reflection forces them to articulate when the multiplier is worth paying.

**Why this teaches the module concept:**
The module specifically identifies delegation as "the single biggest cost multiplier in Claude Code." This repo makes that multiplier empirically visible — not as a theoretical claim but as a number the learner produced themselves.

**Critical flag:**
This exercise involves a subagent call, which A-02 is explicitly designed to precede. Running a subagent at A-02 before A-08 may confuse learners about what they are doing and why. The module content says "Do not use delegation until you reach [A-08]." Putting a delegation exercise in the A-02 repo contradicts the module's own sequencing advice. This is a structural problem, not a calibration one.

**Verdict on Idea 3:** Reject.

---

### My reasoning

**Most structurally sound: Idea 2 (`cost-before-after`)**

The estimation requirement makes cost awareness an active practice, not a passive observation. The learner produces three estimates and three actuals — the gap between them is the real learning. The reflection question ("which variable were you wrong about?") turns the error into personalised insight. Idea 1 is valid but only teaches one cost driver (scope specificity). Idea 3 is structurally contradicted by the module's own sequence.

**Explicit rejection:** Idea 3. Running a subagent exercise at A-02, before A-08, contradicts the module's explicit sequencing instruction and creates confusion about the cost of delegation without the context to use it well.

**Note on Idea 1:** The `scope-vs-sweep` structure is the clearest demonstration of one specific cost driver and should survive as an exercise within Idea 2's medium/heavy tasks — not as a standalone repo.

---

## LOG — A4 — A-02

Cost is hard to teach experientially because the numbers are small (cents) and vary by model and date. Any repo that depends on a specific dollar figure being meaningful will age badly. The right design is comparative and relative — "A costs more than B" — not absolute.

The deeper risk: learners who are already cost-anxious (the module warns them at the start of A-00) may run very short sessions to avoid spending money, which means they never see the cost drivers the module is teaching. The repo needs tasks long enough to produce visible differentiation without being so long they feel punishing. This requires testing with real API usage.

Structural note: the module skips A-05 in its sequence (goes A-00 → A-01 → A-02 → A-03, then jumps A-04 → A-06 skipping A-05 in pagination, but A-05 exists). The cost module must be read before the tool and delegation modules. The repo design reflects this correctly — no tool naming or delegation in the exercises.

---

## A-03: CLAUDE.md — Your Persistent Instructions

**Core concept in one sentence:** CLAUDE.md stores standing rules that apply to every session in a project — rules must be specific and testable to work — and the quality of those rules determines whether Claude Code behaves consistently or drifts.

---

### Idea 1: `before-and-after`

**What the repo contains:**
```
before-and-after/
  README.md              ← instructions: run session-a (no CLAUDE.md at root), then session-b (with CLAUDE.md)
  CLAUDE.md              ← intentionally absent from repo root; lives only in /templates until learner moves it
  templates/
    CLAUDE-template.md   ← annotated template with [FILL IN] markers and inline notes on what makes each section strong vs. weak
  task.md                ← a writing/editing task that will surface the CLAUDE.md rules
  outputs/
    session-a.md         ← empty; learner saves first session output here
    session-b.md         ← empty; learner saves second session output here
    difference-note.md   ← "What changed between sessions? Which rule caused it?"
  README.md
```

**What the learner does:**
Runs the task without a CLAUDE.md (root has none — they experience the default behaviour). Saves the output. Fills in the template. Moves it to the root as `CLAUDE.md`. Runs the same task. Saves the new output. Fills in `difference-note.md`.

**Why this teaches the module concept:**
The before/after structure is the only design that makes CLAUDE.md's effect empirically visible. The learner cannot claim it made a difference without having experienced the without state first. The template's inline annotations teach good rule writing (specific, testable) while the learner is filling it in — not as abstract advice but as applied guidance.

**Critical flag:**
The task in `task.md` and the rules in the CLAUDE.md template must be co-designed. If the task does not surface the behaviours the rules target, the two sessions will look identical and the lesson is invisible. For example: the task must reliably trigger "default preamble" behaviour in Session A that the CLAUDE.md suppresses in Session B. Generic tasks will not reliably surface specific rules. The task and rules must be designed together.

---

### Idea 2: `rules-surgery`

**What the repo contains:**
```
rules-surgery/
  README.md              ← instructions: run the task. Identify which rules worked, which didn't, why. Fix the weak rules. Run again.
  CLAUDE.md              ← a fully written CLAUDE.md with six rules — 3 strong (specific, testable), 3 weak (vague, unteachable)
  weak-rules-annotated.md ← the same CLAUDE.md with annotations explaining what makes each weak rule fail
  task.md                ← a task that exercises all six rules
  outputs/
    first-run.md         ← empty; learner fills after first run
    fixed-CLAUDE.md      ← empty; learner rewrites the three weak rules
    second-run.md        ← empty; learner fills after rerunning with improved rules
  README.md
```

**What the learner does:**
Runs the task with the pre-built CLAUDE.md. Identifies which rules produced visible behaviour and which didn't. Reads the annotations on the weak rules. Rewrites them in `outputs/fixed-CLAUDE.md`. Replaces the root CLAUDE.md. Runs the task again.

**Why this teaches the module concept:**
The module distinguishes specific-testable rules from vague ones ("be careful" is not a rule). This repo makes the learner fix vague rules, not just read about them. The three weak rules are the instructional content — they must be weak in instructive ways, not accidentally.

**Critical flag:**
The pre-built CLAUDE.md's weak rules must be weak in ways that are interesting and non-obvious. If the weak rules are obviously bad (e.g., "respond nicely"), the exercise is trivial and the learner learns nothing they didn't already know. The weak rules must look plausible but fail in specific, detectable ways — which requires expertise to write. This is a harder production problem than it appears.

---

### Idea 3: `three-session-test`

**What the repo contains:**
```
three-session-test/
  README.md              ← instructions: run all three tasks. Check your CLAUDE.md holds across all three.
  CLAUDE.md              ← empty, with section headers and fill-in annotations
  project-context/
    brief.md             ← description of a realistic project (content strategy for a small brand)
    task-1.md            ← a writing task
    task-2.md            ← a research task
    task-3.md            ← an editing task
  outputs/               ← empty; one file per task result
  rule-check.md          ← after each task: "Did the CLAUDE.md rules hold? What drifted?"
```

**What the learner does:**
Writes the CLAUDE.md for the project. Runs all three tasks. After each task, fills in `rule-check.md` noting whether each rule held. Identifies which rules generalise across task types and which only work for one.

**Why this teaches the module concept:**
Three tasks test rule generalisability — a CLAUDE.md that holds for task-1 but drifts on task-3 has rules that are task-specific, not project-level. This is a real failure mode that a single-task exercise cannot reveal.

**Critical flag:**
Three tasks in one session is a significant time investment. Learners may complete only the first task and declare victory, missing the generalisability test entirely. The repo cannot structurally force the learner to run all three. The three-session structure also assumes the learner has already written a decent CLAUDE.md from A-03's template exercise — if they write weak rules here, all three tasks will produce weak results and the generalisability test cannot be distinguished from "the rules just don't work."

---

### My reasoning

**Most structurally sound: Idea 1 (`before-and-after`)**

The before/after structure makes the CLAUDE.md's effect visible through the learner's own output. Without the before state, the learner takes the module's word for it that CLAUDE.md changes behaviour. With it, they have evidence. The inline template annotations embed the good-rule-writing lesson at the moment of application, not as abstract theory.

Idea 2 is clever and teaches rule quality well, but depends on expertly crafted weak rules. Idea 3 is thorough but too long and depends on strong prior CLAUDE.md work from A-03.

**Explicit rejection:** Any version of this module that pre-fills the CLAUDE.md rules for the learner. The learner must write the rules themselves — testing someone else's preferences is not the same as writing your own.

---

## LOG — A4 — A-03

CLAUDE.md is one of the highest-leverage modules in the track, and the repo design problem is clean: make the CLAUDE.md's effect visible by showing the before state. The structural risk is task-rule co-design. This is not a design problem that can be solved in a brainstorm — it is a production problem requiring testing with specific task/rule combinations.

Deeper issue with Idea 1: the "before" session produces real output that the learner then discards. For this not to feel wasteful, the before output must be visibly flawed in an interesting way — not just inferior, but specifically wrong in a way that names the problem. The task needs to produce a preamble that no one wants, or a length that is obviously excessive. The wrongness must be legible.

---

## A-04: Context Awareness and Compaction

**Core concept in one sentence:** Compaction automatically replaces long session history with a summary — explicit standalone messages survive, conversational and implicit context does not — and a manual checkpoint lets you verify what survived before the loss costs you.

---

### Idea 1: `checkpoint-habit`

**What the repo contains:**
```
checkpoint-habit/
  README.md              ← instructions for the structured exercise
  CLAUDE.md              ← two explicit rules written as standalone statements (not buried)
  work-materials/
    draft-section-1.md   ← a draft section for editing (~400 words)
    draft-section-2.md
    draft-section-3.md
    draft-section-4.md
  checkpoint-prompt.md   ← the module's checkpoint template, annotated with explanation of each phrase
  outputs/
    checkpoint-response.md   ← empty; learner pastes Claude Code's checkpoint response
    what-i-corrected.md      ← empty; learner writes what was missing or changed
  README.md
```

**What the learner does:**
Works through editing sections 1 and 2. Before starting section 3, sends the checkpoint prompt. Pastes the response into `checkpoint-response.md`. Reads it: did both CLAUDE.md rules appear? Were they paraphrased? Fills in `what-i-corrected.md` with any corrections made before continuing to section 3 and 4.

**Why this teaches the module concept:**
The checkpoint is the module's primary deliverable, and this repo builds the exercise around the checkpoint as a turning point — not an optional step, not a demonstration to watch, but a thing the learner sends at a defined moment in real work. The two output files make the verification and correction steps structural.

**Critical flag:**
The exercise depends on the CLAUDE.md rules being subtle enough to degrade or be paraphrased in the checkpoint summary, but not so obscure that they disappear completely. Rules that always survive trivially (checkpoint confirms both perfectly) produce a "nothing to do" outcome that feels anticlimactic. Rules that disappear entirely feel like the exercise failed. The rules must be calibrated for instructive partial survival — which requires testing. This is a hard calibration problem.

---

### Idea 2: `explicit-vs-conversational`

**What the repo contains:**
```
explicit-vs-conversational/
  README.md              ← a structured session script
  CLAUDE.md              ← minimal
  session-script.md      ← messages to send in sequence:
                           - Message 1: explicit constraint as standalone (format rule)
                           - Message 4: same constraint stated conversationally within a longer reply
                           - Messages 5–18: processing included documents
                           - Message 19: checkpoint prompt
  documents/             ← 14 short documents to process
  checkpoint-prompt.md   ← ready to copy
  outputs/
    checkpoint-response.md ← empty
    survival-analysis.md   ← template: "Constraint A (explicit): survived as [X]. Constraint B (conversational): survived as [X]."
  README.md
```

**What the learner does:**
Follows the session script exactly. Sets both constraints in the specified message positions. Works through the documents. At message 19, sends the checkpoint. Fills in `survival-analysis.md` — which constraint survived verbatim, which was paraphrased, which was lost?

**Why this teaches the module concept:**
The explicit/conversational contrast is the module's central claim. This repo engineers the conditions for that contrast to be observable in one session. The learner is not told what will happen — they find out in their own session data.

**Critical flag:**
Compaction timing is not deterministic. If the session does not push to real compaction, both constraints will survive and the contrast disappears. The 14 documents must be long enough to push toward compaction territory. This is the same fundamental problem as A-01 Idea 2. Additionally, following a 19-message script verbatim is cognitively demanding; if the learner paraphrases even one message the controlled experiment breaks.

---

### Idea 3: `writing-for-compaction`

**What the repo contains:**
```
writing-for-compaction/
  README.md              ← instructions
  CLAUDE.md              ← "Confirm any constraint I state before we proceed. Do not let constraints be implicit."
  task-context.md        ← a realistic research/writing task spanning 8+ turns
  three-constraints.md   ← three constraints provided to the learner in three different formats:
                           - Version A: as a standalone message (correct format)
                           - Version B: buried in a paragraph (risky format)
                           - Version C: expressed as a casual conversational aside (fragile format)
  checkpoint-prompt.md   ← ready to copy
  outputs/
    which-survived.md    ← learner fills: which constraint survived the checkpoint?
```

**What the learner does:**
States all three constraints using the provided formats at the start of the session. Runs the task for 8+ turns. Sends the checkpoint. Fills in `which-survived.md`. Rewrites the surviving constraint as a standalone message and notes what the format change would have looked like.

**Why this teaches the module concept:**
The "write for compaction" technique is the module's second skill alongside checkpointing. This repo teaches the format discipline directly — the three provided constraint versions show the spectrum from durable to fragile, and the checkpoint reveals which survived.

**Critical flag:**
Same compaction timing problem. If all three constraints survive (session not long enough for compaction to fire), the exercise loses its point. The "CLAUDE.md confirms each constraint before proceeding" rule helps — it creates a verification step regardless of compaction timing — but it doesn't solve the underlying problem.

---

### My reasoning

**Most structurally sound: Idea 1 (`checkpoint-habit`)**

The module's primary deliverable is the checkpoint habit. Building the repo around the checkpoint as a turning point — not a script to follow or a phenomenon to observe — is the cleanest structural design. The four sections provide natural workflow rhythm, the checkpoint fires in the middle, and the two output files make verification and correction structural steps.

Idea 2 is more controlled as an experiment but requires a very long scripted session that is fragile to deviation. Idea 3 is conceptually solid but suffers from the same compaction timing problem.

**Explicit rejection:** Any A-04 repo that requires CLAUDE.md writing from scratch. The learner should arrive at A-04 with a CLAUDE.md already written from A-03. A-04 is about protecting that CLAUDE.md through compaction, not writing it again.

---

## LOG — A4 — A-04

Compaction is the most technically demanding module to demonstrate because it requires session length that cannot be reliably controlled. The honest tension: any repo designed to demonstrate compaction may or may not trigger real compaction during the learner's session. I cannot design around stochastic compaction timing — only around making the checkpoint technique useful regardless of whether compaction has actually fired.

This is the right framing: the checkpoint habit has value before compaction fires (pre-emptive verification) and after (damage control). The repo should teach the habit, not engineer the phenomenon. Idea 1 does this. Ideas 2 and 3 try to demonstrate the phenomenon, which is harder to guarantee.

The calibration of CLAUDE.md rules that degrade "instructively" (visible degradation, not disappearance) remains a production problem requiring testing.

---

## A-05: Session Hygiene

**Core concept in one sentence:** A session scoped to one task, started with front-loaded constraints, and cleared between tasks with `/clear`, produces cleaner output at lower cost than an unfocused accumulating session.

---

### Idea 1: `clear-or-contaminate`

**What the repo contains:**
```
clear-or-contaminate/
  README.md              ← three-round structure: contaminated, cleared, compare
  CLAUDE.md              ← minimal, consistent across all rounds
  task-a/
    brief.md             ← Task A: competitive analysis for Product X (tech domain)
    sources/             ← 4 source documents about Product X competitors
  task-b/
    brief.md             ← Task B: draft a customer onboarding email for Product Y (completely different context)
  outputs/
    task-b-contaminated.md  ← empty; Task B output WITHOUT /clear before it
    task-b-clean.md         ← empty; Task B output WITH /clear before it
    comparison-note.md      ← "What bled through? What was cleaner?"
  README.md
```

**What the learner does:**
Round 1: runs Task A in full. Immediately starts Task B in the same session (no `/clear`). Saves Task B output. Round 2: uses `/clear`. Re-runs Task B. Saves the new output. Fills in `comparison-note.md`.

**Why this teaches the module concept:**
The module's core technique — `/clear` between tasks — cannot be taught without the learner first experiencing what happens without it. The wrong-way-first structure forces context contamination before the clean version. Task A and Task B must be calibrated to share surface vocabulary that creates plausible interference in Task B.

**Critical flag:**
The contamination must be predictably visible. Task A (competitive tech analysis) and Task B (customer onboarding email) share a professional domain but not vocabulary — contamination may be subtle or absent. For contamination to show up, the two tasks need surface-level vocabulary overlap: for example, if Task A is about pricing strategy and Task B is about price objections in an onboarding context, the contamination is predictable. Designing for predictable contamination requires extensive testing. This is the hardest calibration problem in the full module set.

---

### Idea 2: `session-opener-kit`

**What the repo contains:**
```
session-opener-kit/
  README.md              ← instructions
  CLAUDE.md              ← "You are receiving a session opener. Evaluate it against the module's scope-and-constraint criteria before starting work."
  examples/
    opener-a.md          ← a well-scoped opener (annotated: what makes it work)
    opener-b.md          ← an over-scoped opener (annotated: "this is two sessions, not one")
    opener-c.md          ← an underspecified opener (annotated: what will go wrong without front-loaded constraints)
  practice-task.md       ← a real-ish task for the learner to write their own opener for
  outputs/
    my-opener.md         ← empty; learner writes their own session opener here
    session-result.md    ← empty; learner saves Claude Code's response
    evaluation.md        ← "Did Claude Code stay within scope? Which constraints held? What would you front-load differently?"
  README.md
```

**What the learner does:**
Reads the three annotated examples. Writes their own session opener for `practice-task.md` in `outputs/my-opener.md`. Runs it. Saves the result. Fills in `evaluation.md`.

**Why this teaches the module concept:**
Front-loading constraints is one of the three practices. The three annotated examples make the difference between scoped and unscoped openers visible before the learner writes their own — they are reading against real examples, not abstract descriptions.

**Critical flag:**
This is primarily a writing exercise. The Claude Code execution is secondary — the core skill (writing a scoped opener) can be evaluated without running a session at all. A learner could write a perfect opener and never verify it against real Claude Code behaviour. The `evaluation.md` requires a session, but the learner could fill it in speculatively. Not structurally sound as a solo exercise.

---

### Idea 3: `phase-boundary`

**What the repo contains:**
```
phase-boundary/
  README.md              ← two-phase structure with explicit /clear instruction between phases
  CLAUDE.md              ← rules appropriate to a content project
  phase-1/
    brief.md             ← draft an outline for a 3-section report (different structure/tone than phase 2)
    source.md            ← source material
  phase-2/
    brief.md             ← write the executive summary only (tighter scope, different register)
  outputs/
    outline.md           ← empty; Phase 1 output
    exec-summary-no-clear.md  ← empty; Phase 2 output WITHOUT /clear
    exec-summary-clear.md     ← empty; Phase 2 output WITH /clear after a fresh start
  comparison.md          ← fill-in: "What was different? Which version would you actually use?"
```

**What the learner does:**
Completes Phase 1. Immediately starts Phase 2 in the same session (no `/clear`). Saves to `exec-summary-no-clear.md`. Clears and re-runs Phase 2. Saves to `exec-summary-clear.md`. Fills in `comparison.md`.

**Why this teaches the module concept:**
Three named output slots force the learner to actually run both versions. The comparison question is practical — "which would you actually use?" — which makes the evaluation grounded rather than abstract.

**Critical flag:**
Outline → executive summary is related work. The without-clear version may actually be acceptable (the context from Phase 1 might helpfully inform Phase 2). If the clean version is not clearly superior, the case for `/clear` is unconvincing. Phase 1 and Phase 2 need to be further apart in style and purpose than outline/exec-summary to make contamination visible. Two tasks on different topics (not two phases of the same project) would produce a cleaner contrast — but that is Idea 1's design.

---

### My reasoning

**Most structurally sound: Idea 1 (`clear-or-contaminate`)**

The two named output files (`task-b-contaminated.md`, `task-b-clean.md`) force both versions to be run and compared. The contamination demonstration is more convincing with genuinely different tasks than with two phases of the same project. Idea 3 has the weaker contamination premise. Idea 2 is structurally soft — the session execution can be bypassed.

**Explicit rejection:** Idea 1 as currently specified if the contamination calibration fails. The task pair must be tested for visible contamination before this repo ships. If no reliable task pair can be found, Idea 3 is the fallback — it is weaker conceptually but more tractable to calibrate.

---

## LOG — A4 — A-05

Session hygiene's three practices are all preventive. Demonstrating prevention requires first demonstrating the problem. Demonstrating the problem (contamination, accumulated context) requires engineering it reliably — which is the hardest design challenge in the module set.

The meta-issue: if contamination is subtle in real Claude Code behaviour (the model is often good at ignoring irrelevant context), the learner may not see a meaningful difference between the two outputs. The module's teaching depends on contamination being detectable. If the model is smarter than the module gives it credit for, the whole negative-demonstration approach collapses.

Alternative framing: teach /clear through positive demonstration (clean session produces clean output) rather than negative (uncleared session produces contamination). Idea 3 and a modified Idea 1 both permit this framing. Worth flagging for other agents.

---

## A-06: Output Engineering in Claude Code

**Core concept in one sentence:** Separating the plan from execution, and specifying output format before Claude Code starts, eliminates rework by catching wrong approaches before they become actions.

---

### Idea 1: `plan-then-build`

**What the repo contains:**
```
plan-then-build/
  README.md              ← instructions: send plan request. Modify something in the plan. Then approve. Then execute.
  CLAUDE.md              ← "Always present a plan before any action. List: what you will read, what you will change, what order. Wait for explicit approval before starting."
  source-doc.md          ← a research document with clear structural problems (~1,200 words, awkward section order)
  plan-prompt.md         ← annotated prompt for requesting a plan (the three planning questions from A-06)
  outputs/               ← empty
  README.md
```

**What the learner does:**
Sends the plan prompt. Receives the plan. The README instructs them to change at least one thing in the plan — not because it is necessarily wrong, but to practice critical engagement with the plan rather than reflexive approval. Approves the modified plan. Executes.

**Why this teaches the module concept:**
The "modify at least one thing" instruction is structurally important: it forces genuine engagement with the plan rather than treating it as a formality to dismiss. The learner must read the plan closely enough to identify something to modify. This converts plan-before-execute from passive approval into active control.

**Critical flag:**
The "modify at least one thing" instruction can create an artificial situation: the learner makes a worse change just to fulfil the requirement. If the plan is genuinely good and the modification introduces a problem, execution suffers — which teaches the wrong lesson. The source document must have enough genuine structural ambiguity that real plan choices are available without forcing fabricated changes.

---

### Idea 2: `format-control-pairs`

**What the repo contains:**
```
format-control-pairs/
  README.md              ← run pair A, compare results. Run pair B, compare.
  CLAUDE.md              ← "Apply exactly the format specified in the task. Do not add structure that was not requested."
  pairs/
    pair-a-no-format.md      ← "Brief me on the state of remote work." (no format spec)
    pair-a-with-format.md    ← same request with complete format block (structure, length, audience, tone, exclusions)
    pair-b-no-format.md      ← "Explain what happened in this meeting." (pointing to a meeting notes file)
    pair-b-with-format.md    ← same request with full format block
  source-files/
    meeting-notes.md         ← for pair B
  outputs/                   ← 4 empty files, one per prompt
  README.md
```

**What the learner does:**
Runs all four prompts in order, saves outputs. Compares Pair A no-format vs. with-format. Compares Pair B no-format vs. with-format. Fills in a short analysis: what did the format block suppress, add, or redirect?

**Why this teaches the module concept:**
Two pairs, same source, format as the only variable. The learner has their own evidence from two tasks, not one — which means they can separate task-specific variation from the format control effect itself. Two pairs is more convincing than one.

**Critical flag:**
The with-format prompts must be genuinely good — they need to visibly improve the output in ways that are immediately legible. If the formatted output is only marginally different, the comparison is unpersuasive and the learner concludes format control is not worth the effort. The format blocks must suppress Claude Code's strongest default behaviours (introductions, caveats, unsolicited subheadings) in ways that are strikingly visible in the no-format output.

---

### Idea 3: `right-tool-wrong-scope`

**What the repo contains:**
```
right-tool-wrong-scope/
  README.md              ← instructions: two tasks, two scope approaches, one lesson
  CLAUDE.md              ← "This is a planning exercise. Propose a plan, wait for approval, then execute."
  tasks/
    task-a.md            ← a broad, multi-file restructuring task (plan is necessary — wrong approach = rework)
    task-b.md            ← a single bounded edit (plan is overhead — no real choices to make)
  source-materials/      ← files referenced in both tasks
  outputs/               ← empty; one output per task
  reflection.md          ← "For which task was the plan step genuinely useful? Which could have skipped it? Why?"
```

**What the learner does:**
Runs Task A with the plan step (sends plan, reviews, approves, executes). Runs Task B with the plan step (same process). Fills in `reflection.md`. The goal: recognise when the plan step adds value and when it is overhead.

**Why this teaches the module concept:**
The module explicitly addresses when to skip planning: "single, clearly bounded changes you have done before." Most repos teach the rule without the exception. This teaches both, making the module's nuance visible rather than its simplified message only.

**Critical flag:**
The "skip the plan step" instruction for Task B requires the learner to override their CLAUDE.md, which says to always plan. This creates a contradiction: the CLAUDE.md enforces plan-before-execute, but the exercise tells the learner not to do it for Task B. The CLAUDE.md would need a more nuanced rule ("propose a plan for multi-step tasks; for single bounded changes, you may proceed directly"). This is a design problem, not a calibration one.

---

### My reasoning

**Most structurally sound: Idea 1 (`plan-then-build`)**

The "modify at least one thing in the plan" instruction is the structural innovation: it converts plan-before-execute from a passive observation into an active engagement requirement. The concept is unavoidable because the learner cannot complete the exercise without modifying the plan, which means they cannot complete it without reading and evaluating it. Idea 2 is solid but is essentially the same design as the A-02 `scope-vs-sweep` — same task, different variable, compare outputs. Idea 3 is intellectually richer but has the CLAUDE.md contradiction problem.

**Explicit rejection:** Idea 3 as currently specified. The CLAUDE.md/exercise contradiction is a structural problem. If A-06's repo is going to teach the nuance of when to skip planning, it needs a CLAUDE.md that reflects that nuance — which requires the repo author to solve a subtle design problem that should not be passed to the learner.

---

## LOG — A4 — A-06

Output engineering has two skills (plan-before-execute, format control) and most obvious repo designs teach only one. Idea 1 covers planning. Idea 2 covers format. Idea 3 tries to add nuance to planning but introduces a structural contradiction.

The honest answer: one repo teaching plan-then-build plus one teaching format-control would be cleaner than trying to pack both into one exercise. But the format here is three options per module, not two repos. I have treated them as distinct options — the winning repo should be deployed alongside a lighter format-control exercise (Idea 2 condensed to a single pair) rather than replacing it.

The "modify at least one thing" mechanic has real pedagogical value that survives any choice. It should ship in whatever planning repo is selected.

---

## A-07: Tool Fluency

**Core concept in one sentence:** Naming the specific tool in your message gives Claude Code a more precise instruction than the task description alone — it prevents escalation to more expensive tools and makes the action you approve predictable before it happens.

---

### Idea 1: `tool-decision-tree`

**What the repo contains:**
```
tool-decision-tree/
  README.md              ← five tasks, five tools; predict before you send
  CLAUDE.md              ← "Before any action, state the tool name you plan to use. Wait for confirmation before proceeding."
  project/               ← ~15 files of varied types (markdown, json, csv, txt, a log file)
  tasks/
    task-a.md            ← "What does config.json say about the timeout setting?" — Read
    task-b.md            ← "Find every file that mentions the word 'budget'" — Grep
    task-c.md            ← "List all .md files in this project" — Glob
    task-d.md            ← "Show me the last 10 lines of app.log" — Bash
    task-e.md            ← "What is the current API pricing for [service]?" — WebSearch
  prediction-log.md      ← template: task, expected tool, actual tool, match? notes.
  decision-guide.md      ← the tool hierarchy from A-07 condensed to one page
  README.md
```

**What the learner does:**
For each task: writes predicted tool in `prediction-log.md`. Sends the message with the named tool. Observes which tool call appears in Claude Code's output (before approving). Records whether the prediction matched. After all five: identifies which task type was hardest to predict and why.

**Why this teaches the module concept:**
The pre-decision step is the whole skill — not just naming the tool, but knowing which one to name. Five tasks cover all five tools. The prediction-log closes the feedback loop: predict, name, verify, record. The CLAUDE.md rule ("state the tool name before any action") models what the learner should be doing in their own messages.

**Critical flag:**
Claude Code may not always use the tool the learner named — for vague tasks it may escalate to a more expensive tool anyway. This can confuse learners who expect their named tool to always be honoured. But the A-07 module actually covers this explicitly (the "recovery path" section says: ask why). The repo README should frame tool-name non-compliance as expected sometimes, not as a failure — and direct the learner to the recovery path.

---

### Idea 2: `cost-race-pairs`

**What the repo contains:**
```
cost-race-pairs/
  README.md              ← three pairs, free vs. named tool; record tokens for each
  CLAUDE.md              ← minimal
  project/               ← same project structure as Idea 1
  pairs/
    pair-a-free.md       ← "Look through the project and find all mentions of [word]"
    pair-a-named.md      ← "Use Grep to find all mentions of [word]. Show file name and line only. Stop."
    pair-b-free.md       ← "Tell me what the config file says about [setting]"
    pair-b-named.md      ← "Use Read to open config.json. Tell me only what it says about [setting]."
    pair-c-free.md       ← "Find the most recent error in the logs"
    pair-c-named.md      ← "Use Bash to run: tail -n 50 app.log | grep ERROR. Show the last result."
  outputs/
    token-log.md         ← template: pair, free-choice tokens, named-tool tokens, difference, what drove it
  README.md
```

**What the learner does:**
Runs each pair, records token counts in `token-log.md`. After all three: identifies which pair showed the biggest cost difference and what made the free-choice version more expensive.

**Why this teaches the module concept:**
The cost case for tool naming is empirically demonstrated from the learner's own session data. The comparison is controlled within each pair (same task, tool naming as the only variable). The token-log requires the learner to produce and record evidence, not just observe it.

**Critical flag:**
The free-choice versions need to reliably trigger more expensive tool choices. If Claude Code makes sensible targeted choices on its own (as it often does for clearly bounded tasks), the cost difference is negligible and the lesson evaporates. The free-choice prompts must be genuinely vague enough to trigger escalation. This requires testing — specifically, running each free-choice prompt multiple times to confirm it reliably escalates.

---

### Idea 3: `tool-audit-retrospective`

**What the repo contains:**
```
tool-audit-retrospective/
  README.md              ← instructions: run the task. Do not name any tools. Then audit every tool call.
  CLAUDE.md              ← "After each tool call, before proceeding, state: what tool was used, why it was the right choice, whether a cheaper alternative existed."
  project/               ← a project folder with 20 files — realistic mix
  audit-task.md          ← "Understand the structure of this project and produce a one-page summary of what it does and how it's organised."
  audit-log-template.md  ← template: tool name, was this the right choice, cheaper alternative?
  outputs/
    session-summary.md   ← the final project summary
    tool-audit.md        ← the completed audit log
  README.md
```

**What the learner does:**
Runs the open-ended task without naming any tools. Approves each tool call as it comes. After the session, fills in the audit log for every tool call — was it necessary, was it the right tool, what cheaper alternative existed?

**Why this teaches the module concept:**
This is the inverse approach: instead of naming tools upfront, the learner audits Claude Code's free choices and builds tool intuition from retrospective analysis. Understanding why each tool was chosen (and whether a cheaper one would have worked) is a different cognitive skill from naming tools in advance — and arguably more transferable.

**Critical flag:**
Auditing 10–15 tool calls after a session is cognitively demanding and depends entirely on the learner being thorough and honest. Learners who skip or abbreviate the audit learn nothing. The exercise rewards diligent learners and fails everyone else. For an audience that includes non-technical people who may not have strong analytical patience, this is a high-friction design. Not the right primary repo for this audience, but potentially valuable as an advanced extension.

---

### My reasoning

**Most structurally sound: Idea 1 (`tool-decision-tree`)**

Five tasks, five tools, one prediction per task, one verification per task. The structure is clean, bounded, and the pre-decision habit is exactly the skill being taught. The feedback loop is tight. The CLAUDE.md's "state the tool name before any action" rule models the learner's task back to them every time Claude Code responds. Idea 2 has the calibration problem (free-choice reliably escalating). Idea 3 is pedagogically interesting but audience-mismatched.

**Explicit rejection:** Idea 3 as a primary exercise. The audit-after-the-fact design belongs in a practitioner retrospective or an optional extension, not the main A-07 repo.

---

## LOG — A4 — A-07

Tool fluency is one of the most tractable modules to teach via repo. The concept is concrete (name the tool, verify it runs, check cost), the skills are discrete, and the feedback loop is tight. This is the module where the template repo format works best.

The one structural risk: the module promises cost savings from tool naming. That promise needs to be visible in the learner's session, not just asserted. If Claude Code makes sensible tool choices by default for the learner's five tasks, the cost case is absent. The token-cost demonstration in Idea 2 is worth including as a secondary exercise within Idea 1's repo — not a replacement for it, but a cost-awareness layer built on top.

---

## A-08: Agent Delegation and Briefing

**Core concept in one sentence:** Delegation to a subagent is only worth the cost when the task is independent, produces evaluable output, and would generate noise in the main session — and the 5-part brief determines whether the subagent produces what you need or something adjacent to it.

---

### Idea 1: `brief-writer`

**What the repo contains:**
```
brief-writer/
  README.md              ← instructions: apply the delegation test to all three candidates first
  CLAUDE.md              ← "This is a delegation exercise. Do not spawn any subagent until the learner has completed the decision log and written a full brief."
  candidates/
    candidate-a.md       ← task description: research task — clearly delegatable (passes all three questions)
    candidate-b.md       ← task description: judgement/evaluation task — not delegatable (fails question 2)
    candidate-c.md       ← task description: simple, bounded task — not worth delegating (fails question 3)
  decision-guide.md      ← the 3-question delegation test from A-08
  brief-template.md      ← the 5-part brief template, annotated
  outputs/
    decision-log.md      ← empty; learner records delegation decision + reasoning for each candidate
    brief.md             ← empty; learner writes the 5-part brief for the one delegatable task
    brief-evaluation.md  ← empty; after subagent returns: did the output match the brief?
  README.md
```

**What the learner does:**
Applies the 3-question test to all three candidates. Documents the decision and reasoning for each in `decision-log.md`. Writes the 5-part brief for the delegatable task in `outputs/brief.md`. Sends it. Evaluates the result in `brief-evaluation.md`.

**Why this teaches the module concept:**
The decision test and brief writing are the module's two skills. Including non-delegatable candidates — and requiring the learner to articulate why — makes the "when not to delegate" case as concrete as the "when to" case. The decision-log forces reasoning, not just right/wrong answers.

**Critical flag:**
The learner may delegate the wrong candidate (candidate-b or candidate-c) despite the decision guide. The CLAUDE.md instruction helps but cannot prevent a learner from skipping the decision log and going straight to the brief. The exercise depends on the learner engaging with the decision process. The README needs to make clear: "delegating the wrong candidate is the module's most common mistake — and the most expensive one."

---

### Idea 2: `brief-autopsy`

**What the repo contains:**
```
brief-autopsy/
  README.md              ← instructions: run bad-brief-a. Read the output. Identify what failed. Then run good-brief.
  CLAUDE.md              ← minimal
  task-context.md        ← background on the task being briefed (same for all briefs)
  briefs/
    bad-brief-a.md       ← vague goal: "research how our competitors communicate value" (underspecified)
    bad-brief-b.md       ← scope creep: "any files that seem relevant" (unbounded)
    bad-brief-c.md       ← no output format: goal and context stated but no format or length specified
    good-brief.md        ← a well-formed 5-part brief for the same underlying task
  annotated-failures.md  ← explains exactly what each bad brief fails to specify and what the subagent will do instead
  outputs/               ← empty; one output file per brief run
  README.md
```

**What the learner does:**
Picks one bad brief. Runs it. Reads the subagent output. Reads `annotated-failures.md` to understand where the brief failed. Then runs the good brief. Compares the two outputs.

**Why this teaches the module concept:**
A-08 says: "once the brief fails, the session is over — the correction happens in the brief, not in the conversation." This repo demonstrates that principle by showing a failed brief's output and tracing the failure back to the brief's flaw, not the subagent's capability.

**Critical flag:**
Running even one bad brief plus one good brief means two subagent calls — the most expensive exercise type in the track. The README must include a cost warning with a realistic estimate. Additionally: a vague brief can still produce a usable result if the subagent makes good assumptions. The bad briefs must fail in ways that are reliably visible in the output, not just theoretically bad. If the vague brief accidentally succeeds, the lesson is undermined.

---

### Idea 3: `delegation-decision-gate`

**What the repo contains:**
```
delegation-decision-gate/
  README.md              ← instructions
  CLAUDE.md              ← "Before any delegation, the learner must complete the decision gate. Do not run a subagent without a completed gate."
  decision-gate.md       ← the 3-question test as a fill-in form: question, answer, delegate or not?
  my-work/               ← the learner's own project (README tells them to bring their own or use the provided placeholder)
  placeholder-work/      ← a provided half-started project if the learner has nothing to bring
  brief-template.md      ← the 5-part template
  outputs/
    completed-gate.md    ← empty; learner fills before delegating anything
    my-brief.md          ← empty; learner writes their own brief for a task from their own work
    brief-result.md      ← empty; subagent output
    brief-evaluation.md  ← empty; does the output match the brief?
  README.md
```

**What the learner does:**
Identifies a real task from their own work that might be delegatable. Fills in the decision gate. If it passes, writes the 5-part brief. Sends it. Evaluates.

**Why this teaches the module concept:**
The decision gate is a forcing function — the learner must articulate the delegation decision before any action, not after. Using the learner's own work makes the delegation meaningful rather than contrived. The brief evaluation question ("can you tell whether the result is correct?") applies the module's core evaluability test in real conditions.

**Critical flag:**
"Bring your own task" is the right design for a practical module but creates a failure mode: learners who have no suitable task will either skip the exercise or invent a fake one. The placeholder-work folder is a fallback, but fake work produces the same problem as in A-09 — the learner is not testing whether the result is actually correct, because they don't know the correct answer.

---

### My reasoning

**Most structurally sound: Idea 1 (`brief-writer`)**

The three candidates — one delegatable, two not — force the learner to apply the delegation decision test, not just read it. The decision-log requirement externalises the reasoning so the learner cannot skip it. The brief is written with genuine purpose (a real delegatable task with a clear evaluation standard). Idea 2 is pedagogically smart (failure-trace analysis) but expensive to run and depends on bad briefs failing reliably. Idea 3 is the most real-world but has the "bring your own task" failure mode.

**Explicit rejection:** Any A-08 repo that does not include non-delegatable candidates. The module's most important skill is deciding when NOT to delegate. A repo that only asks the learner to write a brief for a pre-approved delegatable task is teaching brief-writing, not the delegation decision.

---

## LOG — A4 — A-08

A-08 is the most expensive module to run — every subagent call costs significantly more than a standard exchange. The repo design must be more parsimonious than earlier modules. Running more than one or two subagent calls as learning exercises requires explicit cost warnings with realistic estimates.

The deeper structural issue: delegation is the module where the concept is most easily sidestepped. If the learner writes a brief and the subagent returns something vaguely useful, they may conclude the brief was fine. The quality gate for delegation is that the output is both evaluable and correct — not just plausible-looking. Teaching learners to evaluate subagent output rigorously is as important as teaching them to write briefs. None of the three repos fully solves this — it is worth flagging for the other agents.

---

## A-09: Capstone — A Real Project

**Core concept in one sentence:** Applying the full A-track toolkit — CLAUDE.md, scoped sessions, checkpoints, plan-before-execute, tool naming, delegation — to a real project you will actually use, with reflection on which habits have become automatic and which still need deliberate practice.

---

### Idea 1: `capstone-kit`

**What the repo contains:**
```
capstone-kit/
  README.md              ← "This is your project. Bring your own work. Use these tools."
  CLAUDE.md              ← annotated template: sections for project identity, working style, output preferences, what to avoid. Each section has inline guidance on what makes a rule strong vs. weak.
  session-plan.md        ← fill-in template: "Session 1: [task and done-state]. Session 2: [task and done-state]. Delegation candidate: [sub-task and why it qualifies]."
  technique-checklist.md ← the module's six required techniques as checkboxes with one-line reminders of what each means
  checkpoint-prompt.md   ← the checkpoint template from A-04, ready to copy
  brief-template.md      ← the 5-part delegation brief template from A-08
  source-material/       ← empty; learner adds their own files
  outputs/               ← empty
  reflection.md          ← the module's three reflection questions, slightly expanded with space to write answers
```

**What the learner does:**
Adds their own source material to `source-material/`. Fills in the CLAUDE.md template. Fills in the session plan. Works through their real project across multiple sessions. Checks off each required technique as they use it. Produces real output in `outputs/`. Answers the three reflection questions.

**Why this teaches the module concept:**
The capstone requires real work. This repo provides scaffolding for that real work without substituting fake content. The CLAUDE.md template, session plan, checklist, brief template, and checkpoint prompt are all tools the learner was taught to use in A-03–A-08. Using them in a real project — not an exercise — tests whether the habits have transferred.

**Critical flag:**
Learners who have no real work to bring will be stuck at the `source-material/` folder. The README needs the module's own fallback: "if nothing comes to mind, take a folder of notes or documents you have been meaning to make sense of." This must be explicit, not left to inference. The fallback also needs to meet the module's three conditions (multiple sessions, files present, output you will use).

---

### Idea 2: `research-brief-capstone`

**What the repo contains:**
```
research-brief-capstone/
  README.md              ← instructions requiring all six techniques to be applied
  CLAUDE.md              ← pre-written project CLAUDE.md for a research project (learner can modify)
  raw-research/
    source-1.md          ← 5 realistic research documents on a topic (~800 words each)
    source-2.md
    source-3.md
    source-4.md
    source-5.md
  session-plan.md        ← 3 pre-defined sessions: (1) read and extract, (2) structure and draft, (3) polish and review
  delegation-candidate.md ← one defined research sub-task for delegation
  technique-checklist.md ← six required techniques as checkboxes
  outputs/               ← empty
```

**What the learner does:**
Works through the three defined sessions. Applies all six required techniques to the defined project. Produces a structured research brief as the final output.

**Why this teaches the module concept:**
The pre-defined project removes the "I don't know what to bring" problem. The three sessions are completable in a real afternoon.

**Critical flag:**
This fails the capstone's core test: "something you actually need." A fictional AI-in-education research brief is work someone else cares about, not work the learner will actually use. Completing a pre-defined project will check the techniques off without testing whether the tools work under real conditions with real stakes. The capstone becomes an exercise in disguise — exactly what the module explicitly rejects.

**Verdict on Idea 2:** Reject.

---

### Idea 3: `my-project-setup`

**What the repo contains:**
```
my-project-setup/
  README.md              ← concise setup instructions; links back to A-03–A-08 for reference
  CLAUDE.md              ← empty, with commented section headers and brief guidance
  session-map.md         ← empty template for planning sessions (scope → tasks → delegation candidate)
  technique-log.md       ← a running log: "Date | Session | Technique used | What happened | What to improve"
```

**What the learner does:**
Sets up the project structure for their own real work. Writes the CLAUDE.md. Maps the sessions. Uses the technique log to record what techniques they applied and what happened. Keeps this repo as an ongoing working environment, adding sessions over time.

**Why this teaches the module concept:**
This is the lightest-touch repo — almost nothing pre-provided. The technique log is the structural innovation: it converts the six required techniques into a reflective practice with a running record, not a one-time checklist. Learners can return to this repo across weeks.

**Critical flag:**
This is so light it may feel like no repo at all. Learners who need scaffolding to start will be paralysed by the empty CLAUDE.md and blank session map. The repo depends entirely on the learner arriving with work and motivation to document it. For a capstone this may be exactly right — but it is the highest-friction option.

---

### My reasoning

**Most structurally sound: Idea 1 (`capstone-kit`)**

The capstone should not provide fake content, and it should not be so empty it fails to scaffold. Idea 1 hits the balance: scaffolding without fake work. The CLAUDE.md template, session plan, checklist, and prompt templates are what the learner needs to hit the ground running. The empty `source-material/` folder is what makes real work unavoidable.

Idea 2 fails the capstone's core test: it is an exercise in disguise. Idea 3 is structurally honest but may leave learners without enough scaffolding to start.

**Explicit rejection:** Idea 2. Any repo that provides fake source material for A-09 has missed the point. If a learner completes the capstone on fake content, they have not completed the capstone.

---

## LOG — A4 — A-09

The capstone is structurally the most honest module in the track — it asks you to do real work, and the only valid evaluation is whether you produced something you will actually use. Template repos are inherently in tension with this premise: a template repo is an exercise scaffold, and the capstone is anti-exercise.

The resolution is correct: the capstone repo should be scaffolding for real work, not a substitute for it. `capstone-kit` does this. The empty source-material folder is the most important design choice in the repo — it signals to the learner that they are the content.

Reflection questions note: the module's reflection questions are genuinely good ("which habit did you reach for without thinking?"). They should appear in the repo's `reflection.md` with enough space and framing to encourage honest answers. The reflection is not a formality — it is where the track's learning is consolidated. Treat it accordingly.

---

## Cross-module structural notes

Patterns I am flagging for the other agents:

**1. The calibration problem recurs across five modules.**
Five of the ten module repos depend on either (a) a vague prompt reliably triggering an off-target result, or (b) a session running long enough for compaction to fire. Neither is reliably engineerable without testing. A-01 (intent-gap), A-02 (scope-vs-sweep), A-04 (compaction), A-05 (contamination), and A-07 (cost-race) all have this dependency. Any repo using this mechanism needs a calibration note in the README and a fallback for sessions where the intended contrast doesn't materialise. This is a production requirement, not a design-stage problem — but it needs to be flagged now.

**2. The cost gate is a live design constraint.**
A-02 explicitly warns that A-07 and A-08 are expensive. Repos for those modules need cost warnings in the README with realistic estimates. Learners who arrive at A-07 with a cautious cost mindset from A-02 may avoid the token-race exercise or refuse to run a subagent at A-08. The repos need to acknowledge this, not pretend cost anxiety doesn't exist.

**3. The CLAUDE.md inheritance chain matters.**
A-03 teaches CLAUDE.md writing. A-04, A-05, and A-09 all depend on the learner having a CLAUDE.md they care about and have invested in. If A-03's repo produces a weak CLAUDE.md, every downstream repo that depends on it suffers. Repos after A-03 should instruct the learner to bring their A-03 CLAUDE.md — not write a new one from scratch. This also means A-03 is a higher-stakes module than it might appear: it is not just one module's learning, it is infrastructure for five others.

**4. Audience split: technical vs. non-technical.**
Several repo ideas work better for technical learners (coders) than for content/research learners. A-07's Bash exercise and any repo using a realistic codebase (e.g., A-06 Idea 3) are technical-only. The A-track serves both audiences. Repos that require understanding a codebase or writing shell commands should be flagged as technical variants, not defaults. The default repo for each module should work for a researcher, writer, or analyst as the primary audience.

**5. Real vs. fake content: a sliding scale, not a binary.**
A-00–A-03 repos can justifiably provide fake/placeholder content — the learner is learning mechanics, not producing work. A-04–A-08 should increasingly encourage or require real content from the learner's own work. A-09 must use real content. The gradation matters: providing fake content in A-08 undermines the delegation decision (the learner cannot evaluate the result if they don't know what "correct" looks like). Repos in the later modules should have prominent "bring your own content" prompts.

**6. The auto-approve risk is a cross-module problem.**
If any learner has Claude Code configured to auto-approve tool calls, the permission model demonstrations in A-00, A-07, and A-08 are invisible. The A-00 repo's README should address this, but it should also be flagged in the CLAUDE.md for any module where tool call visibility is part of the learning.
