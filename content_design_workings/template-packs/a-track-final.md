# A-track Template Repository Pack — Final Brief
*Produced by Opus review agent from multi-agent brainstorm and consensus*
*Date: 2026-04-15*

---

## 1. Overview

The A-track template repository pack is a set of ten half-built repos — one per module, A-00 through A-09 — that learners clone and complete as the structured practice component of the Advanced Practitioner stage. It is aimed at learners who have just cleared the Enabled User (E-track) stage: people with prompt discipline but limited fluency with file systems, terminal sessions, and the mechanics of Claude Code. The pack assumes low general tech confidence, not just low AI knowledge.

Each repo contains pre-built scaffolding (folder structure, sample content, a working `CLAUDE.md`, annotated prompt files in a `prompts/` or similar folder) and deliberate gaps the learner closes using Claude Code. The learner navigates to the repo, opens a session, approves tool calls, and produces named outputs on disk. The annotated prompts follow the Copy → Personalise → Use pattern the course teaches throughout — editing prompts is a taught skill, not a given.

**Design principles that emerged from the consensus discussion:**

- **Files-on-disk over session comparison.** Wherever comparison is the teaching mechanism, both versions must be saved to named files. Comparisons that live in session output are not durable; comparisons the learner can hold open in two editor windows are. Applies to A-01, A-03, A-05, A-06.
- **Double-duty CLAUDE.md.** Every repo's CLAUDE.md is simultaneously (a) an operational instruction set for the learner's session and (b) a teaching artefact modelling what a good CLAUDE.md looks like. A-03 is the module that teaches CLAUDE.md writing; the CLAUDE.mds in every other repo are read as examples even when their module is not about CLAUDE.md.
- **"Make it yours" closing step.** Most repos should end with an invitation for the learner to replace the sample content with their own and run the session again. This converts a one-time exercise into a repeatable workflow. The tone is a warm, direct invitation, not a footnote.
- **Return value requirement.** Every repo should produce at least one artefact the learner takes with them — a template, a reference card, a prompt, or a habit named explicitly in the README. If the primary output is the habit, the README names the habit. If the output is nothing, the repo has a design problem.
- **Attribution section in A-08.** The brief-evaluation template in A-08 must include a section that traces evaluation failure back to the brief, not the subagent. This is the module's core principle made structural: "the correction happens in the brief, not in the conversation."

---

## 2. Chosen Content — Module by Module

### A-00 — `first-session-folder`

- **What it teaches:** First contact with Claude Code — the permission model made tangible through real Read and Write approvals.
- **Repo contents:** `notes/` containing three pre-written meeting note files; empty `outputs/` folder with `.gitkeep`; `CLAUDE.md` (includes the auto-approve warning); `README.md`; `annotated-prompts.md` with Copy → Personalise → Use prompts in a nervous-learner register.
- **Non-negotiable structural requirement:** The `outputs/` folder must ship empty; the auto-approve-mode warning must appear in both README and CLAUDE.md (not just README). Files either exist or they don't — that is the forcing function.
- **Confirmed secondary:** A required (not optional) "make it yours" closing step in the README, written as a motivating invitation: "Now replace `meeting-1.txt` with real notes of your own, and run the session again. This time the output is yours."
- **Rejected alternatives:** `reading-room` (sample docs with no personal return value); `film-log` (subject matter too discretionary — assumes learners connect with film as a life category); `daily-brief` (strong but meeting notes are more universally recognisable than the multi-input brief structure).

### A-01 — `intent-gap-lab`

- **What it teaches:** Part 1 of the mental model — Claude Code executes your text, not your intent — made visceral through durable before/after comparison.
- **Repo contents:** `task-brief.md`; `prompts/vague.md` and `prompts/precise.md` (with annotation explaining which phrase closed which gap); `outputs/vague-result.md` and `outputs/precise-result.md` as the named targets; `CLAUDE.md`.
- **Non-negotiable structural requirement:** Both outputs save to named disk files. The comparison lives on disk, not in the session scrollback. Part 1 only — no tool-awareness or context-degradation exercises (those belong to A-07 and A-04).
- **Confirmed secondary:** README note inviting substitution of a real brief the learner actually wants researched, and a fallback framing in the README for the case where both outputs look similar ("If the outputs look similar, read the annotation on what closed the gaps — that is information too.").
- **Rejected alternatives:** `recipe-for-a-good-session` (dilutes all three mental model parts into one fragile session); `spec-sharpener` (comparison lives in session, not on disk); `constraint-drift-lab` / `tool-awareness-starter` (bleed into A-04 and A-07 territory).

### A-02 — `cost-before-after`

- **What it teaches:** Estimation discipline — learning to estimate session cost before starting, not to observe cost after.
- **Repo contents:** `estimator.md` (pre-session form); `tasks/task-light.md`, `task-medium.md`, `task-heavy.md`; `outputs/estimates.md`, `outputs/actuals.md`, `outputs/reflection.md`; `CLAUDE.md`.
- **Non-negotiable structural requirement:** The estimation step is required before each run — the learner cannot run the task until the estimate field is filled in. The first estimate is framed in the README as a baseline, not a test ("Your first estimate will be wrong. The interesting question is which variable you misread.").
- **Confirmed secondary:** Detective framing preserved in the `task-heavy` exercise (A3's cost-detective puzzle orientation survives to keep learners engaged through the admin-heavy session). `estimates.md` and `actuals.md` positioned in README as portable templates the learner copies into future project repos.
- **Rejected alternatives:** `the-delegation-multiplier` (subagent at A-02 contradicts the module's explicit sequencing); `cost-diary` (tracks after spending, not estimates before); `token-almanac` (requires multi-week commitment that can't be engineered into a single exercise).

### A-03 — `before-and-after`

- **What it teaches:** Writing a CLAUDE.md that actually changes Claude Code's behaviour — via a forced before/after comparison on the same task.
- **Repo contents:** `templates/CLAUDE-template.md` (annotated with inline guidance); `examples/writer-in-residence-CLAUDE.md` (a full, beautifully written worked example — not a template); `task.md`; `outputs/session-a.md` (no CLAUDE.md active), `outputs/session-b.md` (CLAUDE.md active), `outputs/difference-note.md`.
- **Non-negotiable structural requirement:** The task and the CLAUDE.md template must be co-designed. The task must surface the specific behaviours the rules target — otherwise session-a and session-b look identical and the lesson is invisible. Draft the CLAUDE.md template first, then design the task to surface each rule.
- **Confirmed secondary:** The worked example (`writer-in-residence-CLAUDE.md`) ships as finished prose for a real-feeling persona — three to five specific, testable rules, no placeholders. It teaches format by demonstration, not by annotation. Optional closing compliance-check prompt reframed as a rule-quality diagnostic ("If Claude Code's answer is vague, your rule is probably vague too").
- **Rejected alternatives:** `newsletter-studio` (domain too narrow for an infrastructure module whose output feeds five downstream repos); `writing-style-guide` (high personal value but no structural before/after forcing function); `project-brief-builder` / `research-project` (fictional project context fails if learner doesn't engage).

### A-04 — `checkpoint-habit`

- **What it teaches:** The checkpoint habit — recognising and managing context rot — built around the habit, not around a compaction event that may not fire.
- **Repo contents:** `work-materials/draft-section-1.md` through `draft-section-4.md`; `CLAUDE.md` engineered for differential survival (one rule stated as an explicit standalone, one stated conversationally); `checkpoint-prompt.md` (ready-to-copy template); `outputs/checkpoint-response.md`, `outputs/what-i-corrected.md`.
- **Non-negotiable structural requirement:** The CLAUDE.md uses the three-constraint design (explicit standalone / conversational / implied). Differential survival must be engineered, not accidental — if both rules survive trivially, the checkpoint feels like a formality and the lesson evaporates.
- **Confirmed secondary:** Archaeology framing in the README and checkpoint prompt — "What survived the session?" rather than "Verify your rules persisted." The `checkpoint-prompt.md` is named explicitly as a transferable tool the learner copies into every future long session.
- **Rejected alternatives:** `constraint-survival-test` / `long-document-build` (engineer the compaction event rather than the habit); `context-archaeology` (most conceptually elegant but same event-dependency problem); `report-builder` (complex scaffolding without habit focus).

### A-05 — `session-hygiene-sprint`

- **What it teaches:** The /clear decision — when to clear between tasks and when not to — as a judgment call, not a reflex.
- **Repo contents:** `questions/q-01.txt`, `q-02.txt`, `q-03.txt` (q-02 and q-03 thematically related, q-01 clearly separate); `notes/q-01-notes.txt` through `q-03-notes.txt`; `prompts/when-to-clear.md`, `prompts/when-not-to-clear.md`, `prompts/sprint-opener.md`; `session-log.md`; `outputs/`; `CLAUDE.md`.
- **Non-negotiable structural requirement:** `when-to-clear.md` and `when-not-to-clear.md` are named, findable, annotated files — not a README note. They are the module's argument made structural. The /clear decision must be the explicit object of the exercise, not the background.
- **Confirmed secondary:** The contamination demo (`clear-or-contaminate` logic) ships as an optional, clearly labelled fourth-session extension in the README: "If you want to see what contamination looks like, try this." Weekly-work-stack-style session-log format folds in as the session-log.md scaffold.
- **Rejected alternatives:** `clear-or-contaminate` as primary (contamination may not reliably materialise; a broken negative demo actively misleads); `weekly-work-stack` (habit without engagement with the /clear decision — can be completed without understanding the module); `multi-project-hub` (realistic but no negative demonstration).

### A-06 — `plan-then-build`

- **What it teaches:** Plan-before-execute as an active, not passive, habit — via a modification requirement that forces real engagement with the plan.
- **Repo contents:** `source-doc.md` (with genuine structural ambiguity); `plan-prompt.md` template; `outputs/` (empty); `CLAUDE.md` with the standing instruction to present a plan and wait for explicit approval before any action.
- **Non-negotiable structural requirement:** The learner must modify at least one element of the plan before approving it. A plan step that allows reflexive approval has not taught the module. The source document must have multiple defensible structures — the production team cannot write a document with one obvious correct answer.
- **Confirmed secondary:** Condensed format-library-style secondary exercise producing at least one portable format-spec template as takeaway. A3's audience-adaptation extension lives as a single additional CLAUDE.md standing instruction ("Once you have built the primary version, identify one thing about your audience that would change the output, and modify the format spec accordingly.") — one sentence, not a second session.
- **Rejected alternatives:** `right-tool-wrong-scope` (CLAUDE.md contradicts exercise instructions); `the-pitch-builder` (motivating but return value is task-specific, not transferable); `draft-review-cycle` (complex to scaffold without clear forcing function).

### A-07 — `tool-decision-tree`

- **What it teaches:** Tool fluency — Read / Glob / Grep / Edit / Write / Bash / WebSearch — framed as professional precision rather than cost control.
- **Repo contents:** `project/` (~15 files, domain-neutral, non-technical default); `tasks/task-a.md` through `task-e.md` (one per tool, WebSearch included); `prediction-log.md` (with reasoning column); `decision-guide.md` (one-page reference card); `CLAUDE.md` with "Name the tool you intend to use before every message" in professional-precision register.
- **Non-negotiable structural requirement:** WebSearch must be one of the five tasks (module requirement, covers full cost hierarchy). The prediction-log must include a "why did I choose this tool?" column — the reasoning is the learning, not the match/no-match check.
- **Confirmed secondary:** One cost-race-pairs comparison (free-choice vs. named-tool, token log) as the final exercise, framed with lower-ambition wording: "Record the difference, however small, and explain what you see." The `decision-guide.md` ships as an explicit takeaway reference card.
- **Rejected alternatives:** `codebase-explorer` (technical-audience default — offer as variant, not default); `the-investigator` (framing survives in CLAUDE.md and README voice, but five-task prediction structure is cleaner than two-case investigation); `document-search-toolkit` (six-task sequence too long).

### A-08 — `brief-writer`

- **What it teaches:** Agent delegation — making the delegation decision, writing a 5-part brief, and evaluating subagent output against the brief, not against the subagent.
- **Repo contents:** `step-01-decide/` (three candidates — one delegatable, two not for different reasons; decision-guide; `decision-log.md`; `why-not-delegate.md`); `step-02-brief/` (brief-template, `brief.md`); `step-03-evaluate/` (`brief-evaluation.md` with three sections); `CLAUDE.md` in architect/operator register, with rule preventing subagent spawn before decision log and brief are complete.
- **Non-negotiable structural requirement:** `brief-evaluation.md` must include three sections — scope check, evaluability check, and attribution section. The attribution section (tracing evaluation failure to brief quality, not subagent capability) is the module's core principle made structural and is the single most important design contribution the discussion produced.
- **Confirmed secondary:** Standalone `why-not-delegate.md` file for rejection reasoning on the non-delegatable candidates (isolates rejection reasoning as a named artefact rather than burying it in a general decision log). Physical folder scaffolding (step-01 / step-02 / step-03) visible as repo structure, not just via CLAUDE.md enforcement.
- **Rejected alternatives:** `parallel-research-pack` / `the-parallel-desk` (too expensive; parallel delegation belongs later); `brief-autopsy` (two subagent calls; high cost, unreliable brief failure); `content-commission` / `mission-control` (good structural elements absorbed into `brief-writer`, but weaker as primaries).

### A-09 — `capstone-kit`

- **What it teaches:** The full A-track toolkit applied to the learner's own real work. Scaffolding, not content.
- **Repo contents:** `CLAUDE.md` (the best CLAUDE.md in the entire pack — annotated, high-quality); `session-plan.md`; `technique-checklist.md`; `checkpoint-prompt.md`; `brief-template.md`; `source-material/` (empty on ship); `outputs/` (empty); `reflection.md`; `examples/personal-almanac/` (complete worked example with its own high-quality CLAUDE.md, four annotated session prompts, outputs structure).
- **Non-negotiable structural requirement:** `source-material/` ships empty. Any capstone repo that provides fictional source content fails the capstone's primary condition ("you will use the output") — learners who complete the capstone on fake content have not completed the capstone.
- **Confirmed secondary:** `personal-almanac` as worked example inside `examples/` — the most compelling completed-project reference, showing what one learner's capstone might look like without prescribing the project. The capstone CLAUDE.md (inside both the kit and the almanac example) is a first-class deliverable, written by the course team collaboratively. Reflection questions must include "Which techniques are not yet automatic?"
- **Rejected alternatives:** `research-brief-capstone` / `research-to-brief` / `research-brief-builder` / `project-documentation-sprint` (all provide fake source content — exercises in disguise); `the-reading-year` / `the-workshop-materials` (good projects but too specific to be the primary capstone; worked-example territory).

---

## 3. Rejected Ideas Worth Revisiting

These ideas did not win primary or secondary slots but carry genuine value that should be remembered.

- **`the-investigator` framing (A-07).** The "name your tools like a professional names instruments" mental model is stronger than cost-anxiety framing. Lost because five-task prediction structure is cleaner. **Survives as:** CLAUDE.md and README voice in `tool-decision-tree`. **Worth revisiting if:** a supplementary narrative-led repo is ever produced for motivational reinforcement.

- **`personal-almanac` / `the-personal-almanac` as primary capstone (A-09).** Most emotionally compelling capstone — a structured reflection on decisions, wins, and lessons that learners will likely reuse annually. Lost the universality test. **Survives as:** worked example inside `capstone-kit/examples/`. **Worth revisiting if:** a second "capstone variant" is ever produced for learners who respond to prescribed projects.

- **`newsletter-studio` (A-03).** The `voice-notes.txt` / `dont-do-this.txt` structure — giving learners something to react against — solves the blank-template problem elegantly. Lost because domain is too narrow for infrastructure. **Survives as:** the design thinking behind the worked example inside `before-and-after`. **Worth revisiting if:** a domain-specific companion pack is ever produced.

- **`the-pitch-builder` audience adaptation (A-06).** Same content / different audience is the highest-leverage output-engineering exercise. Lost because return value is task-specific. **Survives as:** a single CLAUDE.md standing instruction inside `plan-then-build`. **Worth revisiting if:** a dedicated audience-adaptation exercise is added to a later track.

- **`use Claude Code to write your CLAUDE.md rules` prompt (A-03, from A1's `writing-style-guide`).** The "translate informal preferences into testable rules" technique is the bridge for learners who know what they want but can't articulate it. **Survives as:** optional closing prompt in `before-and-after`. **Worth revisiting if:** it proves popular and deserves its own mini-exercise.

- **`cost-detective` framing (A-02).** Puzzle orientation keeps learners curious during admin-heavy token counting. Lost because module goal is estimation, not observation. **Survives as:** framing for the `task-heavy` exercise. **Worth revisiting if:** a supplementary "cost investigation" exercise is ever added for learners who want deeper calibration.

- **`weekly-work-stack` three-session structure (A-05).** Best repetition-for-habit structure in the set. Lost because it allows completion without engagement with the /clear decision. **Survives as:** session-log format inside `session-hygiene-sprint`. **Worth revisiting if:** a supplementary "build the workflow" repo is ever added for learners who already understand /clear and need pattern practice.

- **Compliance-check prompt (A-03, from A2's `research-project`).** Asking Claude Code which rules it applied is unreliable as an audit but useful as a rule-quality diagnostic. **Survives as:** optional closing step in `before-and-after`. **Worth revisiting if:** further rule-quality tooling is built.

---

## 4. Production Risks

The pre-written content register, ordered by sensitivity.

### Highest risk — calibration-dependent content

- **`intent-gap-lab/task-brief.md` (A-01).** The vague prompt must reliably misfire across multiple model runs. If the model produces a plausible answer to the vague version, the gap disappears and the exercise teaches nothing. **Required:** test across at least 5–8 runs on the current model before shipping. The task must contain multiple compounding ambiguities, not one resolvable one. Ship with a fallback README note if calibration proves soft.
- **`before-and-after/task.md` plus CLAUDE.md template (A-03).** Task and template must be co-designed. If the task does not surface the behaviours the rules target, session-a and session-b look identical and the lesson is invisible. **Required:** draft the template first; design the task to surface each rule.
- **`cost-before-after/task-heavy.md` (A-02).** The heavy task must reliably trigger meaningfully more tool calls than light and medium. **Required:** token-count testing across multiple runs before finalising the task text.

### High risk — sustain-ability content

- **`checkpoint-habit` work sections 1–4 (A-04).** Learners work 8+ turns. Boring material produces abandoned sessions. **Required:** draft sections written with a real voice and perspective — a fictional strategy brief about something actually interesting, not placeholder text.
- **`session-hygiene-sprint` questions and notes (A-05).** q-02 and q-03 must be obviously related; q-01 obviously unrelated — otherwise the `when-not-to-clear` lesson evaporates. **Required:** shared terminology and thematic ground across q-02 and q-03 notes; q-01 in a clearly different domain.

### Moderate risk — quality-dependent content

- **`first-session-folder` meeting notes (A-00).** Must feel like real meeting notes, not Lorem Ipsum. The emotional register of the first session depends on the learner finding the content worth summarising.
- **`capstone-kit/examples/personal-almanac/` CLAUDE.md (A-09).** This is the exemplar CLAUDE.md for the whole track. Placeholder quality produces the wrong lesson. **Required:** the course team writes this collaboratively as a first-class deliverable.
- **`before-and-after/examples/writer-in-residence-CLAUDE.md` (A-03).** Must be finished prose for a real-feeling persona, not a template. If it ships with placeholder markers, the blank-template problem recurs.

### Cross-cutting production risk

The calibration problem affects five repos in the same way (A-01, A-02, A-04 stochastic compaction, A-05 contamination as optional extension, A-07 cost-race). Each must be tested across multiple model runs before shipping, with a calibration-failure fallback framing in each README. The production team should not treat any "vague produces worse output than precise" assumption as given — it must be verified per repo.

---

## 5. Suggested Execution Order

Ordered by a combination of content risk, dependency, and pattern-establishing value. Repos earlier in the list should be built first to establish production conventions; repos later have dependencies or higher content risk and should be finalised closer to recording week but not during it.

1. **A-00 `first-session-folder`.** Lowest content risk, simplest structure, establishes the pattern for: annotated-prompts.md style, CLAUDE.md tone, README conventions, "make it yours" closing step. Build first to set the template every other repo inherits from.

2. **A-07 `tool-decision-tree`.** Second-simplest. Clean five-task structure, no calibration dependency, produces the most reusable artefact (decision-guide reference card). Establishes the prediction-log convention and the reusable-artefact pattern.

3. **A-02 `cost-before-after`.** Lower calibration sensitivity than A-01 but requires some token-count testing on `task-heavy`. Establishes the portable-template pattern (`estimates.md` / `actuals.md` as copy-into-future-projects).

4. **A-03 `before-and-after`.** Must come before A-04 through A-09 because they all inherit the CLAUDE.md the learner writes here. Highest production effort on the worked example (`writer-in-residence-CLAUDE.md`). The task-template co-design work starts here and cannot be rushed.

5. **A-06 `plan-then-build`.** Moderate complexity. Source document needs genuine structural ambiguity. Benefits from patterns established in A-00/A-07.

6. **A-08 `brief-writer`.** High structural complexity (three-step folder scaffolding, three-candidate calibration, three-section evaluation template). The three non-delegatable candidates require careful writing. Build after A-03 is settled so the CLAUDE.md inheritance pattern is known.

7. **A-04 `checkpoint-habit`.** High content risk (8+ turns of sustain-ability, three-constraint CLAUDE.md engineered for differential survival). Needs A-03's CLAUDE.md conventions established first.

8. **A-01 `intent-gap-lab`.** Highest single-file calibration risk. The vague-prompt misfire test must happen across multiple model runs. Build the scaffolding early but finalise the `task-brief.md` wording last, after testing.

9. **A-05 `session-hygiene-sprint`.** Flagged by A4 as "the hardest to write well and the most load-bearing in the pack." The `when-to-clear.md` and `when-not-to-clear.md` files carry the module's argument — they cannot be produced in a rush. The three research questions (q-01 clearly unrelated; q-02 and q-03 genuinely related) require careful writing. Build the structure early but treat the annotation files as content-team deliverables.

10. **A-09 `capstone-kit`.** Last, because: (a) `capstone-kit`'s CLAUDE.md is the best CLAUDE.md in the pack and must reflect lessons from A-03 through A-08; (b) the `personal-almanac` worked example inside it needs the same CLAUDE.md quality; (c) the reflection questions should be written with the whole pack in mind. All scaffolding outside the CLAUDE.md is simple, but the CLAUDE.md is a first-class collaborative deliverable.

**Before recording week (A4's priorities):** finalise A-05 annotation files; finalise A-03 worked example; complete A-01 calibration testing; complete A-09 capstone CLAUDE.md. Do not leave these for recording week — they are the four items most likely to underperform if treated as placeholder content.

---

## 6. Cross-cutting Design Principles

Pack-level architecture decisions that apply across the whole A-track, above and beyond per-module rules.

### The CLAUDE.md inheritance chain

A-03 does not just teach CLAUDE.md — it produces infrastructure that A-04 through A-09 all depend on. A learner progressing through the track in sequence should bring their A-03 CLAUDE.md into each subsequent repo's root. **Production requirement:** the READMEs for A-04 through A-09 should each include the instruction "If you have been working through the track in sequence, bring your CLAUDE.md from A-03 into this repo's root." This creates continuity and makes the track feel like a building project rather than a sequence of isolated exercises. It also raises the stakes on A-03's template quality: a weak A-03 CLAUDE.md degrades every downstream module.

### Double-duty CLAUDE.md

Every CLAUDE.md in the pack does two jobs simultaneously: it configures the learner's session AND it serves as a teaching example of what a well-written CLAUDE.md looks like. This means no CLAUDE.md can be a stub. Each one should be a production-quality demonstration of the format — specific rules, testable constraints, inline reasoning where appropriate. The capstone (A-09) CLAUDE.md is the best in the pack by design; but even A-00's CLAUDE.md is read by learners as an example.

### Files-on-disk over session comparison

Wherever comparison is the teaching mechanism (A-01, A-03, A-05, A-06), both versions must be saved as named files the learner can hold open side by side. Session-only comparisons do not persist after the terminal closes. This is a production standard, not a design preference.

### Return-value per repo

Every repo should produce at least one artefact the learner takes with them: a template, a reference card, a reusable prompt, or an explicitly named habit. If the output is the habit (A-00, A-01, A-02, A-05), the README must name the habit explicitly and frame what the learner is carrying away. If no such artefact exists, the repo has a design problem.

### "Make it yours" is a design pattern, not a nice-to-have

The A-00 closing step — "now replace the sample content with your own" — is a design pattern applicable wherever sample content caps the lifespan of a repo. It converts a one-time exercise into a repeatable workflow at the cost of one sentence in the README. Consider this pattern for any repo where the sample content is the only barrier to ongoing use.

### Non-technical default, technical variant

Every repo should work for a writer, researcher, or analyst by default. Codebase-style content (e.g., `codebase-explorer`) is offered as a technical variant in module docs, not shipped as the default. This decision must be made explicitly in production, not left to whichever author writes the README.

### Annotated prompts are instructional design, not scaffolding

Prompt files (`annotated-prompts.md` and equivalents) carry the teaching weight across the pack. For A-00 specifically, they are written at a nervous-learner pace. For A-01 through A-09, they follow the Copy → Personalise → Use structure with bracketed substitutions and annotations that explain the reasoning, not just the action. The prompt annotations in every repo should explain **which phrase closed which gap** or **which substitution controls which decision** — not just "what to do next."

### Pre-written content is instructional design, not filler

Sample documents that feel generic produce sessions that feel like chores. Every piece of pre-written content in the pack should be written with a voice, a perspective, and a reason to read it. The meeting notes in A-00, the task brief in A-01, the draft sections in A-04, the research notes in A-05, the worked example in A-03, the almanac in A-09 — these are load-bearing for the emotional register of the exercise. They should be written last, with the same care as the annotated prompts, not treated as placeholder text.

### The calibration-fallback README pattern

Any repo whose teaching depends on a vague-produces-worse-output assumption (A-01, A-02, A-04, A-05 optional extension, A-07) must ship with a calibration-failure fallback in the README. Something like: "If the outputs look similar, that is information too — read the annotation on what closed the gaps in the precise version." This converts a broken demonstration into an alternate teaching moment rather than a failed exercise.

### The module concept must be engaged, not just completable

A4's ruling test for every repo: "can the learner complete this without engaging the module concept?" If yes, the repo is an exercise in disguise. `weekly-work-stack` was rejected at A-05 on this basis (three scoped sessions can be completed without ever confronting the /clear decision). Every repo in the final pack is engineered so the central skill is the unavoidable mechanism of completion, not a side effect.
