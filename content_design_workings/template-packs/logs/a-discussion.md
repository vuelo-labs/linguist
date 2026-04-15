# A-track Consensus Discussion

## Entry 1 — Agent A1
*Reading all four brainstorm logs before writing*
*Date: 2026-04-15*

---

## A-00: Getting Started with Claude Code

**Strongest idea across all four agents: A4's `first-session-folder`**

Not my own pick, and I want to be precise about why. My `daily-brief` is the most personally motivating repo in the set. A2's `reading-room` is the most universally transferable. A3's `film-log` has the sharpest before/after satisfaction loop. But A4's `first-session-folder` is the most structurally sound for the specific learning objective — and A4's reasoning for picking it is the most rigorous: the empty `outputs/` folder is a real forcing function. Files are either there or they are not. You cannot fake that moment.

The meeting notes content is generic, but meeting notes are about as universally recognisable as any document type. The three-meeting structure also creates multiple sequential Read/Write approvals, which means the permission model is repeated enough to become a learned thing rather than a one-time observation.

**What I'm defending from my own brainstorm: the annotated prompt design in `daily-brief`**

My `daily-brief` has the most thoughtfully constructed prompt file for this module — a Copy-Personalise-Use prompt with `[role]`, `[filename]`, `[format]` substitutions already laid out. A4's `first-session-folder` uses `annotated-prompts.md` but does not describe the annotation structure in detail. Whatever repo is selected, the annotated prompt model from my brainstorm should inform how the prompt files are written across A-00. This is not about repo identity — it is about the instructional design of the prompts folder.

**What I'm conceding to A4: the auto-approve flag**

This is the thing I missed entirely. If a learner arrives at A-00 having already tinkered with Claude Code settings and has auto-approve active, the permission model demonstrations are invisible. I did not flag this. A4 did, and it is a real production requirement: the README must instruct learners to confirm they are in manual approval mode before starting. This needs to be in the CLAUDE.md for A-00 too, not just the README, because CLAUDE.md survives where READMEs are skimmed.

**What changed my thinking: A3's point about the annotated prompts being load-bearing**

A3 writes: "the annotated prompts are load-bearing here. For A-00, these aren't just 'try this prompt' — they're the first time the learner is navigating a terminal session with an AI. The prompts need to be written at the pace of someone who is a bit nervous."

This is correct and I had not framed it this way. My own design instinct was to make the prompts instructive but I was thinking about them as content scaffolding, not as pacing tools. For A-00 specifically, the prompts need to read like a quiet narrator guiding someone who is genuinely uncertain. That is a writing register I was not explicitly targeting.

---

### LOG — A1 — A-00

What shifted: A4's auto-approve flag genuinely surprised me. I have been thinking about learners who are nervous about terminals and permissions — I did not think about learners who have already bypassed permissions without understanding what they did. That is a real cohort.

Surprised by: A3 picking `film-log`. The personal subject matter argument is strong and I have sympathy for it, but the film log is also the most discretionary choice in the set — it assumes the learner relates to films as a significant life category. A3 writes "non-technical learners will love this" and that may be true for many, but the meeting notes in A4's repo are harder to dismiss as irrelevant. Everyone has been in a meeting.

Standing firm on: the prompt file design. Specifically the Copy-Personalise-Use structure with bracketed substitutions. A3 is right that the prompts are load-bearing and need pacing. My design gives them structure. These two insights should be combined.

---

## A-01: Mental Model Refresher

**Strongest idea across all four agents: A4's `intent-gap-lab`**

My `spec-sharpener` and A4's `intent-gap-lab` are closely related — both are comparative exercises where the learner writes or runs a vague instruction and then a precise one. The critical difference is what A4 adds: the outputs are saved to disk as named files (`vague-result.md`, `precise-result.md`). The learner must produce two files and acknowledge the gap between them. In my version, the comparison is visible in the session. In A4's version, the comparison is durable — files on disk, side by side.

A4's critical flag is also honest and important: the vague prompt must be calibrated to reliably misfire. If the model produces a good response to the vague prompt anyway, the gap disappears. A4 names this as a production requirement, not a design-stage problem. That framing is exactly right.

A2's `brief-builder` is genuinely strong — the vague/precise distinction on a brief-building task is highly practical and the annotated side-by-side prompt format is a good teaching structure. But A4's structural argument (outputs saved to disk, gap made durable) is the tightest.

**What I'm defending: rejecting the multi-part mental model approach**

A3 proposes `recipe-for-a-good-session` — running the same task three times at three levels of quality to demonstrate all three parts of the mental model. A4 explicitly rejects this framing: "a repo that tries to demonstrate all three parts in one session will be too long, too fragile, or too shallow." I agree with A4 here. A-01 should focus on Part 1 (text not intent) and do it well. Parts 2 and 3 get their own dedicated modules (A-04 for context degradation, A-07 for tool fluency). Trying to hit all three in A-01 dilutes the focus. My `spec-sharpener` stayed on Part 1 from the start — that was the right instinct.

**What I'm conceding to A4: the files-on-disk principle**

My `spec-sharpener` asks learners to write sharpened instructions into `sharp` files. The comparison happens when you run both and compare in the session. A4's `intent-gap-lab` asks learners to save outputs to named files, making the comparison something you can hold open in two editor windows simultaneously. That physical comparison — two files open, not a scrolling session — is more powerful than session comparison. I should have designed for files-on-disk more deliberately. I am conceding this framing to A4.

**What changed my thinking: A4's distinction between Parts 2 and 3**

A4 writes explicitly: "Part 3 (tools as action layer) is better taught in A-07 at full depth" and explicitly rejects Idea 3 (tool-call-visible) as the main repo for A-01 because it "overlaps significantly with A-07 and risks making A-07 feel like review." I had the same instinct but did not state it this cleanly. Having A4 name it directly clarifies the module scope for all of us. A-01's repo should not contain tool exercises. Tools get gestured at in the CLAUDE.md or README, but the repo exercises stay on Part 1.

---

### LOG — A1 — A-01

What shifted: the files-on-disk principle. My design instinct was correct but the execution was slightly off — I had learners writing sharpened instructions into files rather than saving outputs. Saving outputs is the stronger move because the comparison is between what came out of the model, not between what I wrote as input.

Surprised by: A3's `recipe-for-a-good-session` being dismissed more thoroughly than I expected. I had it as a reasonable third-place idea but A4's structural argument against the three-part approach is compelling enough that I would not surface it at all in the discussion. The risk of diluting all three parts is real.

Standing firm on: Part 1 only. No tool-awareness exercises in A-01's repo. This needs to be a clear consensus.

---

## A-02: Cost, Tokens, and What Things Actually Cost

**Strongest idea across all four agents: A4's `cost-before-after`**

This is the most contested module across all four agents. Every agent has a different pick:
- A1: `cost-diary` (habit via ongoing recording)
- A2: `session-anatomy` (vague vs. precise on same task, log the difference)
- A3: `cost-detective` (three-case isolation of cost drivers)
- A4: `cost-before-after` (estimate before, record after, identify the error)

A4's argument is the strongest for one specific reason: the module's explicit goal is to teach learners to estimate cost before starting a session, not to observe cost after. The estimation error is where the learning happens — "which variable were you wrong about?" is a better question than "what was the cost difference?" The `cost-before-after` structure makes the estimation step unavoidable rather than optional.

A4 also explicitly rejects their own Idea 3 (`the-delegation-multiplier`) on sequencing grounds — it introduces a subagent call at A-02, which the module explicitly says to defer to A-08. This is exactly the kind of self-critique that makes A4's analysis trustworthy. If A4 is willing to kill their own idea on structural grounds, their picks deserve extra weight.

**What I'm defending: the session log habit**

My `cost-diary` builds a repeatable habit: record your own sessions over multiple weeks. A3's `token-almanac` (their near-pick) does the same thing differently. The problem is that template repos are used in a bounded exercise context, and "build this habit over weeks" is a hard thing to design into a single repo. I am not defending `cost-diary` as the primary pick, but I am defending the session log element. Whatever repo is selected, there should be a session log template that carries forward as a living document across the track. A4's `cost-before-after` has `estimates.md` and `actuals.md` — this is the right structure but it should be described as a template the learner keeps, not just a one-time exercise sheet.

**What I'm conceding to A4: the calibration flag for vague runs**

A4 flags that the `task-heavy` prompt in `cost-before-after` needs to be calibrated to reliably trigger many tool calls. This is the same calibration problem that appears across multiple modules — I noted it for `token-weight-test` but not as a cross-module pattern. A4 is right that any repo that depends on a vague task costing more than a precise one needs to be tested. This is a production requirement for at least three repos: A-01, A-02, and A-07.

**What changed my thinking: A4's explicit rejection of Idea 3**

A4 kills `the-delegation-multiplier` outright because it "contradicts the module's explicit sequencing instruction." I had not cross-checked my ideas against the module's own sequence warnings. I was building repos that felt educationally coherent but I was not checking whether the module itself had sequencing constraints that ruled out certain exercises. This is a rigour gap I need to apply across all my picks. The lesson: before picking a repo idea, check whether the module says "do not do X until Y." If it does, any idea involving X is eliminated.

---

### LOG — A1 — A-02

What shifted: I moved from defending `cost-diary` to accepting `cost-before-after` as the stronger pick, primarily because the module's goal is estimation before spending, not tracking after spending. Tracking is a good habit but it is downstream of the skill being taught.

Surprised by: all four agents converging on different picks for this module. This is the most genuinely contested module so far. The disagreement is not random — it reflects genuine ambiguity in the module itself about which behaviour it is trying to install.

Standing firm on: the session log format should be standardised across A-track repos. A2 made this same point. It should be on the production checklist.

---

## A-03: CLAUDE.md — Your Persistent Instructions

**Strongest idea across all four agents: A4's `before-and-after`**

This is a case where two agents (A3 and A4) independently arrived at the same structural logic — the before/after comparison with and without CLAUDE.md active. A4's version is more rigorous because it adds the inline template annotations (guidance embedded in the template while the learner fills it in) and because it treats the task-rule co-design as an explicit production problem rather than leaving it implicit.

My `writing-style-guide` is the most personally engaging idea in this module set. A2's `my-workspace` is the most durable in terms of reuse. But A4's critical flag is the most important design insight: "the task in task.md and the rules in the CLAUDE.md template must be co-designed. If the task does not surface the behaviours the rules target, the two sessions will look identical and the lesson is invisible." This is not a brainstorm observation — it is a production constraint that needs to be solved before the repo ships, not after.

**What I'm defending: the writing-style-guide structure**

My `writing-style-guide` solves a problem that none of the other repos solve: most learners know what they want from Claude Code's writing output but do not know how to express that as a testable rule. The `translate-style-to-rules.md` prompt — which asks Claude Code itself to help turn informal style preferences into formal CLAUDE.md rules — is the most pedagogically distinctive element in my brainstorm. I am defending this prompt's concept. It does not have to live in a `writing-style-guide` repo specifically, but the "use Claude Code to help you write better Claude Code rules" technique is worth keeping. It could live in `before-and-after` as an optional next step after the template is filled in.

**What I'm conceding to A4: task-rule co-design as a production constraint**

I noted in my brainstorm that `project-brief-builder` works "only if the learner cares about the fictional project." I was thinking about motivation. A4 is thinking about structural soundness: if the task does not trigger the rules, the before/after comparison is empty. These are different concerns and A4's is more fundamental. I concede the task-rule co-design framing and accept it as a production requirement that applies to my ideas too.

**What changed my thinking: A4's point about the CLAUDE.md inheritance chain**

A4's cross-module note: "A-03 is higher-stakes than it might appear: it is not just one module's learning, it is infrastructure for five others." This reframes the whole module. A-03's repo is not just a CLAUDE.md writing exercise — it is producing the CLAUDE.md that the learner will use for the rest of the track. If A-03's repo produces a weak CLAUDE.md, downstream repos that depend on it fail. This means the CLAUDE.md template in A-03's repo needs to be excellent — not a minimal stub, but a full-featured template with strong examples and inline guidance. The production requirement is correspondingly higher.

---

### LOG — A1 — A-03

What shifted: I thought of A-03 as a standalone writing exercise. A4's point about the inheritance chain changes that. A-03 is infrastructure for A-04 through A-09. The repo needs to be designed with that downstream dependency in mind.

Surprised by: A3 picking `the-newsletter-studio` over `the-writer-in-residence`. The newsletter studio is more accessible but `writer-in-residence` — which provides a beautifully written example CLAUDE.md as the primary teaching artifact — is the most elegant design in A3's set. An excellent example CLAUDE.md may teach the format better than an annotated template does.

Standing firm on: the "use Claude Code to help you write CLAUDE.md rules" technique. This is not prominent in any other agent's brainstorm and it is genuinely useful. It should surface somewhere in A-03's exercise design.

---

## A-04: Context Awareness and Compaction

**Strongest idea across all four agents: A4's `checkpoint-habit`**

This is the module where structural fragility is most acute, and A4 names it most honestly: "any repo designed to demonstrate compaction may or may not trigger real compaction during the learner's session." A4's resolution is the right one — build the repo around the checkpoint habit, not around the compaction event itself. The checkpoint has value before compaction fires (pre-emptive verification) and after (damage control). A repo that teaches the habit regardless of whether compaction actually fires is more reliable than a repo that depends on the event.

A4's `checkpoint-habit` is built around the checkpoint as a turning point in real work: four draft sections, checkpoint before section three, verify, correct if needed, continue. The two output files (`checkpoint-response.md`, `what-i-corrected.md`) make verification and correction structural steps rather than optional reflection.

A1's `long-document-build` and A3's `constraint-stress-test` are both good but they try to demonstrate compaction rather than teach the checkpoint habit. A4 has convinced me that this distinction matters.

**What I'm defending: the three-constraint design**

A3's `constraint-stress-test` and A3's `context-archaeology` both use a three-constraint design — one stated well, one stated badly, one not stated at all (or all three in different forms). This is the most direct experimental design for teaching why how you state something matters. I had a version of this in `constraint-survival-test`. The three-constraint structure should be incorporated into whichever repo is selected — specifically into the CLAUDE.md for the repo, which should model exactly how to write constraints that survive compaction. A4's `checkpoint-habit` repo has two CLAUDE.md rules but does not explicitly design them for differential survival. The three-constraint approach should be the CLAUDE.md design choice.

**What I'm conceding to A4: the habit vs. event framing**

I built my `long-document-build` around the premise that compaction will reliably fire during a five-section document build. A4 flags that compaction timing is stochastic. I was over-relying on a predictable trigger. A4's resolution — teach the habit regardless of trigger — is correct, and I should have reached that framing myself. The checkpoint habit is valuable even in a session that never compacts. I concede this framing change entirely.

**What changed my thinking: A4's explicit rejection of the from-scratch CLAUDE.md approach**

A4: "Any A-04 repo that requires CLAUDE.md writing from scratch is wrong. The learner should arrive at A-04 with a CLAUDE.md already written from A-03." I had not thought through the cross-module dependency this clearly. My `long-document-build` has a CLAUDE.md stub — the learner writes it. But A-04 is not the CLAUDE.md writing module. A-04 is the module where you learn to protect the CLAUDE.md you already have. This reframes what the CLAUDE.md in any A-04 repo should look like: it should be partly pre-filled, ideally based on what a typical A-03 output looks like, so the learner can use their own A-03 CLAUDE.md or the repo's model.

---

### LOG — A1 — A-04

What shifted: the habit vs. event framing. I was trying to engineer compaction as a demonstrable event. A4 is right that this is wrong. Build around the habit.

Surprised by: A3's `context-archaeology` is the most conceptually elegant idea in the A-04 set. The three-layer design (explicit, conversational, implied) and the "archaeology" framing are genuinely distinctive. A4 would likely critique it as fragile (same compaction timing problem), but the conceptual structure is worth preserving. The three-layer constraint design should inform the CLAUDE.md for whichever A-04 repo is selected.

Standing firm on: the checkpoint prompt itself must be in the repo as a ready-to-copy template. All four agents included this — good, because the checkpoint prompt is precise and learners should not have to construct it from memory.

---

## A-05: Session Hygiene

**Strongest idea across all four agents: A4's `clear-or-contaminate`**

This is the most genuinely close decision in the set. A4's `clear-or-contaminate` is structurally sound — it runs the same task with and without `/clear` and saves both outputs, forcing comparison. But A4 also identifies its own critical flag: context contamination may not be predictably visible. The model is often good at ignoring irrelevant context. If contamination is subtle or absent, the lesson evaporates.

A3's `the-research-sprint` is the most pedagogically sophisticated idea in the A-05 set because it teaches the `/clear` decision rather than just the `/clear` technique. The `when-to-clear.md` and `when-not-to-clear.md` annotation files are the most distinctive structural element across all four agents' A-05 proposals. A-05 explicitly says "you do not need to use /clear between closely related steps in the same task" — and A3's design is the only one that teaches this nuance.

I am going to call a split here: `clear-or-contaminate` for the primary repo (structural soundness), but `the-research-sprint` 's `when-to-clear` / `when-not-to-clear` annotation concept must be included. If A4's contamination calibration fails — which it might — A3's positive demonstration (clean session produces clean output) is the right fallback.

**What I'm defending: the multi-session structure**

My `multi-project-hub` and A2's `weekly-work-stack` both build habit through repetition — multiple sessions, multiple projects, `/clear` practiced three or more times rather than once. Hygiene is a habit. A4's `clear-or-contaminate` does the comparison once. The comparison is powerful but it only runs the habit once. Whatever primary repo is selected, the exercise design should explicitly encourage the learner to return to the repo for additional tasks rather than treating it as complete after one round.

**What I'm conceding to A4: the negative demonstration first**

A4's argument for running the contaminated version before the clean version is sound: "demonstrating prevention requires first demonstrating the problem." My `multi-project-hub` only demonstrates the positive (clean sessions are good). It does not show what contamination looks like. A4's `clear-or-contaminate` shows the wrong-way-first, which is a more convincing teach. I concede this design principle.

**What changed my thinking: A4's meta-level point about the model's intelligence**

A4: "if contamination is subtle in real Claude Code behaviour (the model is often good at ignoring irrelevant context), the learner may not see a meaningful difference between the two outputs." This is a real risk and it is a deeper problem than just calibration. It is possible that `/clear` hygiene is less consequential than the module presents it as, at least for the task types in the A-track. If the model can cleanly context-switch within a session on document-level tasks, the contamination demonstration may never produce a visible result. A4 is right to flag this. The repo needs a fallback framing: if contamination is not visible, the module's value is still about cost and focus, not just quality. The repo's README should address both cases.

---

### LOG — A1 — A-05

What shifted: I moved from pure positive demonstration (multi-project-hub, build the habit) to accepting the negative-first approach. The contamination demonstration is worth attempting even with the calibration risk.

Surprised by: no agent strongly defending A2's `weekly-work-stack` as the best option. A2 picked it, I picked `multi-project-hub`, but A4's `clear-or-contaminate` and A3's `research-sprint` are both structurally more interesting. A2's strength is repetition-for-habit; the other options sacrifice repetition for demonstration. This is a genuine design tension without a clean resolution.

Standing firm on: the `when-to-clear` / `when-not-to-clear` annotation concept from A3's `research-sprint` must appear somewhere in the A-05 repo design. This is the one element not replicated by any other agent.

---

## A-06: Output Engineering in Claude Code

**Strongest idea across all four agents: A4's `plan-then-build` with A4's "modify at least one thing" mechanic**

A4's structural innovation — "send the plan request; modify at least one thing in the plan before approving; then execute" — is the most distinctive design element across all A-06 proposals. It converts plan-before-execute from passive approval (glance at the plan, say yes) into active engagement (read the plan closely enough to find something worth changing). The learner cannot complete the exercise without reading the plan critically.

A2's `format-library` and my `format-control-library` are almost identical in concept — running the same source through multiple format specs. Both are strong. But A4's modification mechanic addresses a failure mode that both our format libraries ignore: learners will approve plans reflexively without engaging with them. The modification requirement breaks that reflex.

A4 also explicitly rejects their own Idea 3 (`right-tool-wrong-scope`) on structural grounds — the CLAUDE.md conflicts with the exercise instructions. This self-critique is consistent and reliable. A4's picks are trustworthy in this brainstorm set.

**What I'm defending: the format cards as reusable artifacts**

My `format-control-library` produces format cards that the learner keeps and uses on their own documents indefinitely. A2's `format-library` produces four format specs. Both are strong on reusability. A4's `plan-then-build` does not explicitly produce format artifacts — it is primarily about the planning habit. I am defending the principle that A-06's repo should produce something the learner will reuse after the exercise: either format cards or a plan approval template. This should be a design requirement for the winning repo, not just a nice-to-have.

**What I'm conceding to A4: the modification requirement**

The "modify at least one thing" instruction solves a problem I was not designing against. I assumed learners would engage with plans because the plans were interesting. A4 does not make that assumption — it makes engagement a structural requirement. This is a better design philosophy. I concede it entirely. Any A-06 repo that includes a plan step should require modification of the plan before execution, not just approval.

**What changed my thinking: A4's honest assessment of the two-repo problem**

A4 writes: "Output engineering has two skills (plan-before-execute, format control) and most obvious repo designs teach only one. One repo teaching plan-then-build plus one teaching format-control would be cleaner than trying to pack both into one exercise." This is honest and I think it is correct. For a multi-module course, having a lighter supplementary format-control exercise alongside the primary `plan-then-build` repo is the right design. A condensed version of A2's `format-library` (or my `format-control-library`) as a secondary exercise would cover format control without trying to stretch a single repo across both skills.

---

### LOG — A1 — A-06

What shifted: I moved from `format-control-library` as my primary pick to accepting `plan-then-build` with the modification mechanic as the primary, with format-control as secondary. The modification requirement is a genuinely better teaching mechanism than format card production.

Surprised by: A3's `the-pitch-builder`. A motivating multi-step project with audience adaptation built in is appealing. But A4 would critique it: "the format here is three options per module, not two repos." The pitch builder as a capstone-adjacent exercise for A-06 is interesting but it is not the right primary repo.

Standing firm on: the reusable artifacts principle. Whatever ships as A-06's repo should produce something the learner keeps.

---

## A-07: Tool Fluency

**Strongest idea across all four agents: A4's `tool-decision-tree`**

Five tasks, five tools, one prediction per task, one verification per task. A4's `tool-decision-tree` is the cleanest structure for A-07 across all proposals. The prediction-log (write your expected tool before sending) is the defining structural element — it makes the tool selection decision the explicit skill being tested rather than a side effect of completing a task.

A1's `codebase-explorer` and A2's `knowledge-base-audit` are both strong. The difference is that `tool-decision-tree` includes WebSearch explicitly as one of the five tools, making the cost hierarchy visible across all five tiers, while A1's `codebase-explorer` and A2's `knowledge-base-audit` both focus primarily on the file tools. A-07 explicitly includes WebSearch in the hierarchy. The repo should cover all five.

A4 also flags a critical problem for A-07 repos in general: "Claude Code may not always use the tool the learner named — for vague tasks it may escalate anyway." A4's resolution is also correct: the module covers this in the "recovery path" section. The README should frame tool-name non-compliance as expected sometimes, not as a failure.

**What I'm defending: the comparison exercise**

My `codebase-explorer` includes Exercise 5 — run the same search vague vs. named tool and compare token counts. This is the module's own exercise ("send the same request twice — once vague, once with named tool — and compare token counts"). A4's `tool-decision-tree` does not include this comparison as a structured exercise. I am defending the inclusion of at least one free-vs-named comparison in whatever repo is selected. A4's Idea 2 (`cost-race-pairs`) is the most fully developed version of this comparison structure. If `tool-decision-tree` is the primary repo, `cost-race-pairs` should be incorporated as the final exercise within it.

**What I'm conceding to A4: the technical-audience default problem**

A4's cross-module note: "repos that require understanding a codebase should be flagged as technical variants, not defaults." My `codebase-explorer` uses a project structure with `.js` components, utility files, and config files. This is more technical than necessary for the A-track audience. A2's `knowledge-base-audit` (15-20 markdown files on a common domain) and A4's `tool-decision-tree` (varied file types, no code required) are both better defaults. I concede that my `codebase-explorer` should be offered as a technical variant, not the default repo.

**What changed my thinking: A3's `the-investigator` framing**

A3's observation: "'name your tools like a professional names instruments' is a better mental model than 'name tools to save tokens' — it reframes tool fluency as competence rather than penny-pinching." This is a genuine insight about how the skill should be framed for the learner. The `tool-decision-tree` teaches the same skill but without this framing. The README for whatever A-07 repo is selected should adopt A3's framing: professional precision, not cost anxiety. The framing changes the learner's relationship to the exercise.

---

### LOG — A1 — A-07

What shifted: I accepted that my codebase-explorer should be a technical variant. The default repo must work for a writer, researcher, or analyst without requiring any familiarity with code structure.

Surprised by: A3 picking `the-investigator` over `the-research-toolkit`. Both are non-technical. The investigator framing is more distinctive and memorable, but the research toolkit maps more directly to the module's exercises. Both could be offered — the investigator as the motivating first intro, the research toolkit as the structured exercise version.

Standing firm on: the prediction-log mechanic. Whether it lives in `tool-decision-tree` or elsewhere, the predict-before-send structure should be in the A-07 repo.

---

## A-08: Agent Delegation and Briefing

**Strongest idea across all four agents: A4's `brief-writer`**

A4's `brief-writer` is the most structurally honest design for A-08 because it forces the delegation decision before allowing any brief writing. Three candidates — one delegatable, two not (for different reasons) — require the learner to apply the test and document reasoning in a decision log before they can proceed. The CLAUDE.md rule ("Do not spawn any subagent until the learner has completed the decision log and written a full brief") is the best CLAUDE.md design in the entire A-08 set: it models the module's primary principle as a standing instruction.

A4's explicit rejection is also essential: "any A-08 repo that does not include non-delegatable candidates is teaching brief-writing, not the delegation decision." This is correct. A1's `research-pipeline` and A2's `content-commission` both include non-delegatable tasks or bad-brief examples, but A4's version makes the decision log and non-delegatable reasoning most structural.

A2's `content-commission` has the strongest unique element: the spot-the-gap exercise on a bad brief before writing your own. A4's `brief-autopsy` covers similar ground more rigorously. These two ideas should be combined: start with brief diagnosis (A2/A4), then write your own brief from the decision log (A4).

**What I'm defending: the three-step pipeline structure**

My `research-pipeline` sequences all three skills (decide, brief, evaluate) as locked pipeline steps. The learner cannot skip to the brief without completing the decision step, and cannot skip to evaluation without sending the brief. A4's `brief-writer` has the same structure via CLAUDE.md enforcement. But my pipeline makes the three steps visible as three separate folders with templates at each stage. This physical scaffolding — step-01-decide, step-02-brief, step-03-evaluate — is the clearest way to make the module's three-skill structure visible to a learner who is about to do it for the first time. I am defending this physical folder scaffolding as a production requirement, not just an A1 design preference.

**What I'm conceding to A3: the explicit non-delegatable reasoning write-up**

A3's `the-parallel-desk` includes `why-not-03.md` — a template specifically for writing the rejection reasoning for a non-delegatable task. My `research-pipeline` has `my-decisions.md` for the same purpose, but A3's is more pointed: it isolates the rejection reasoning as a named artefact, not a general decision document. Writing the rejection reasoning explicitly — not just applying the test but explaining why each question fails — is the highest-leverage moment in A-08 pedagogy. A3 is right that this should be a standalone file, not buried in a general decisions template.

**What changed my thinking: A4's evaluation quality flag**

A4: "teaching learners to evaluate subagent output rigorously is as important as teaching them to write briefs. None of the three repos fully solves this." This is an honest self-assessment that applies to all four agents' proposals. The evaluation step in every A-08 repo is currently a fill-in template. None of us have designed the evaluation step with enough rigor. A4's `brief-evaluation.md` is better than nothing, but the evaluation criteria — "can you tell whether the result is correct?" — is the module's core evaluability principle and it should be scaffolded more carefully. This is a production gap that needs to be addressed regardless of which repo is selected.

---

### LOG — A1 — A-08

What shifted: I accepted that the explicit rejection reasoning write-up (A3's `why-not-03.md` concept) should be a standalone file, not merged into a general decisions template. The isolation of the rejection reasoning is pedagogically important.

Surprised by: A4 explicitly rejecting their own Idea 3 (`delegation-decision-gate`) on "bring your own task" grounds while defending `brief-writer` for similar reasons. The inconsistency is noted but not fatal — `brief-writer` provides three candidates with the right quality calibration, while `delegation-decision-gate` depends entirely on the learner arriving with suitable work.

Standing firm on: the three-step pipeline folder structure. It should be visible as physical scaffolding in the repo, even if the enforcement is via CLAUDE.md.

---

## A-09: Capstone — A Real Project

**Strongest idea across all four agents: A4's `capstone-kit`**

A4's `capstone-kit` is the most honest resolution of the fundamental tension in a capstone repo: "a template repo is an exercise scaffold, and the capstone is anti-exercise." The kit provides scaffolding (CLAUDE.md template, session-plan template, technique checklist, checkpoint prompt, brief template) without providing fake content. The empty `source-material/` folder is the correct signal: you are the content.

A4 also explicitly rejects their own Idea 2 (`research-brief-capstone`) because "completing a pre-defined project will check the techniques off without testing whether the tools work under real conditions with real stakes." This is the right call and it rules out my `research-brief-builder` for the same reason. Any A-09 repo that provides source documents is failing the capstone's primary condition.

A3's `the-personal-almanac` is the most emotionally compelling capstone option. A3 is right that an almanac — structured reflection on your own decisions and lessons — is likely to be used after the course ends. But A4's `capstone-kit` is more universal: the almanac works for people who value self-reflection, the kit works for anyone.

**What I'm defending: the six-technique checklist**

My `personal-knowledge-base` and `research-brief-builder` both include a `checklist.md` with the six required techniques as checkboxes. A4's `capstone-kit` has `technique-checklist.md` — same idea. A3's `the-personal-almanac` does not have a standalone checklist; the techniques are embedded in the session annotation files. I am defending the explicit standalone checklist. It is the self-assessment mechanism from the module and it should be prominent, not buried in prompts.

**What I'm conceding to A4: fake source content fails the capstone test**

My `research-brief-builder` provides four source documents with a word count. I was trying to give learners who have nothing to work with a fallback. A4's argument against this is definitive: "if a learner completes the capstone on fake content, they have not completed the capstone." The fallback for learners without their own work should be the module's own suggestion — "a folder of notes you have been meaning to make sense of" — not a provided set of fictional research documents. I concede this entirely and withdraw `research-brief-builder` from consideration.

**What changed my thinking: A3's note about the capstone CLAUDE.md**

A3: "the CLAUDE.md in the almanac repo should be good enough that learners want to steal it." And: "the capstone's CLAUDE.md should be the best CLAUDE.md in the entire pack." This reframes the A-09 CLAUDE.md as the summary artefact of the entire track's CLAUDE.md journey — A-03 introduced it, A-04 protected it, A-09 produces the final exemplar. A4's `capstone-kit` has an annotated CLAUDE.md template that serves this purpose. The production team should treat the capstone CLAUDE.md as a first-class deliverable that reflects everything A-03 taught.

---

### LOG — A1 — A-09

What shifted: I accepted A4's rejection of fake source content as definitive. `research-brief-builder` is withdrawn.

Surprised by: how much consensus there is at A-09 despite different picks. All four agents' picks (A1 `personal-knowledge-base`, A2 `personal-knowledge-system`, A3 `the-personal-almanac`, A4 `capstone-kit`) agree on the core principle: the learner brings their own work. The disagreement is on how much scaffolding to provide. A4's scaffolding-without-fake-content is the strongest framing for resolving that disagreement.

Standing firm on: the reflection questions must have space for real answers. A4 says this too. The `reflection.md` is not a formality. It is where the track's learning is consolidated.

---

## Cross-module observations

**Pattern 1: The calibration problem is the biggest shared risk.**

Five modules depend on a vague prompt reliably producing a worse or more expensive result than a precise one: A-01, A-02, A-04 (stochastic compaction), A-05 (context contamination), A-07 (cost-race). A4 flags this explicitly. None of us have a design-stage solution. The production requirement is: each repo in this category must be tested across multiple model runs before shipping, with a calibration note in the README explaining what to do if the expected contrast does not materialise. If the contrast is not reliably visible, the teaching depends on assertion rather than evidence. That is a weaker repo.

**Pattern 2: The CLAUDE.md inheritance chain is underserved.**

A4 raised this; I am amplifying it. A-03 produces CLAUDE.md infrastructure that A-04, A-05, A-07, A-08, and A-09 all depend on. None of the A-track repos explicitly tell the learner to bring their A-03 CLAUDE.md forward. This is a cross-repo design gap. The READMEs for A-04 through A-09 should each include: "If you have been working through the track in sequence, bring your CLAUDE.md from A-03 into this repo's root." This creates continuity and makes the module sequence feel like a building project rather than a sequence of isolated exercises.

**Pattern 3: Files-on-disk is consistently better than session-only comparison.**

This emerged across A-01 (A4's saved outputs), A-03 (A4's before/after outputs), A-05 (A4's two named output files), A-06 (saved plans). Comparisons that live in named files are more durable than comparisons that live in session output. Every repo where comparison is the teaching mechanism should save both versions to named files as a structural requirement.

**Pattern 4: The audience split between technical and non-technical learners recurs in A-07 specifically and in every module that offers a codebase-style repo.**

A4 flags this as a cross-module concern. The default repo for each module should work for a writer, researcher, or analyst. Codebase-style repos should be offered as technical variants in the module docs but should not be the default shipped experience. This decision needs to be made explicitly in production, not left to whoever writes the README.

**Pattern 5: No strong consensus candidate at A-05.**

This is the module with the most genuine design uncertainty. A4's `clear-or-contaminate` is structurally sound but the contamination calibration problem is real and possibly unresolvable for document-level tasks. A3's `the-research-sprint` teaches more nuance but may not be the right primary exercise for learners who have not yet used `/clear` at all. A2's `weekly-work-stack` offers repetition-for-habit but no demonstration of why the habit matters. A1's `multi-project-hub` is the most realistic simulation of ongoing work but does not show the wrong-way-first.

The A2 discussion should specifically address A-05 as a contested module. A2 and A3 should advocate for their picks here more than in any other module. A4 may want to flag whether the contamination calibration risk is disqualifying for `clear-or-contaminate`, or whether A3's positive-demonstration fallback should be the primary choice.

**Pattern 6: A-08's evaluation step is underdeveloped across all agents.**

All four brainstorms include a brief-evaluation template, but none of us has designed the evaluation step with sufficient rigor. The module's core evaluability principle — "can you tell whether the result is correct?" — should be scaffolded as a structured decision rather than a fill-in field. This is a production gap that the consensus should flag explicitly.

---

*Entry 1 closed. A2 writes next.*

---

## Entry 2 — Agent A2
*Pragmatist lens — reading A1's entry and all four brainstorm logs*
*Date: 2026-04-15*

---

## A-00: Getting Started with Claude Code

**Position: Agree with A1 on `first-session-folder`, with one real-use test concern**

A1 is right that `first-session-folder` is the strongest structural choice. The empty `outputs/` folder is the best forcing function in the set. I agree with A1's concession on the auto-approve flag — A4 caught something the rest of us missed, and it belongs in the CLAUDE.md, not just the README.

But I want to apply the keep-using-this test to all four options here, because this is the module where first impressions define retention.

- `first-session-folder`: meeting notes are universal, the outputs appear, the exercise is done. Would anyone return? Maybe not. The meeting notes are provided — they are not the learner's meeting notes. Once the three summaries exist in `outputs/`, the folder's purpose is exhausted.
- `reading-room` (my pick): same problem. The documents are samples. No one opens a reading room of other people's documents twice.
- `daily-brief` (A1's own pick): has genuine return value. If the inputs folder were genuinely editable — meaning the learner drops their real notes in before each session — this becomes a recurring tool, not a one-time exercise.
- `film-log` (A3): high personal resonance for those who connect with it, low for those who do not. But A3 is right that the satisfaction loop is the tightest.

**My resolution:** `first-session-folder` is correct for structural soundness and forcing function. But the keep-using-this test reveals a design gap: none of the A-00 options, as designed, are sticky beyond the exercise. The fix is not to change the repo choice — it is to add a short "make it yours" step at the end. After completing the three meeting summaries, the learner replaces `notes/meeting-1.txt` with a real meeting note of their own and runs the session again. This converts a one-time exercise into a repeatable workflow in two minutes. It belongs in the README as the final step, not as an optional extension.

**I am defending: the return-value step as a production requirement for A-00.** Whatever repo is selected, it should end with an explicit invitation to replace the sample content with the learner's own. This is not gold-plating — it is the difference between a demo and a tool.

### LOG — A2 — A-00

What shifted: reading A1's discussion clarified that `first-session-folder` is the right structural choice. My original `reading-room` pick was strong on universal accessibility but the keep-using-this test kills it — sample documents have zero ongoing value.

What the keep-using-this test revealed: every A-00 option has the same problem. The sample content creates the exercise but also caps its lifespan. The "make it yours" step is the pragmatic fix — not redesign the repo, add one closing instruction that unlocks repeat use.

Standing firm on: the sample content must be well-written enough to seem worth summarising. A1 and I both flagged this. If `meeting-1.txt` reads like a Lorem Ipsum meeting, the first approval moment is hollow. The content quality is not incidental — it is load-bearing for the emotional register of a learner's very first session.

---

## A-01: Mental Model Refresher

**Position: Agree with A1 on `intent-gap-lab`. The keep-using-this test actually favours it.**

A1's endorsement of A4's `intent-gap-lab` is correct. The files-on-disk comparison is more durable than session comparison. I concede this completely — my `brief-builder` was doing the same thing but storing outputs in the session rather than in named files.

Keep-using-this test: does `intent-gap-lab` have return value?

Yes, actually — more than it might appear. The `tasks/task-brief.md` is reusable in the same way `spec-sharpener` is: the learner can swap in their own brief and run the vague/precise cycle on something they actually care about. The difference is that `intent-gap-lab` explicitly asks the learner to save both outputs, which means they build a personal library of before/after examples from their real work. That is stickier than a provided task.

The calibration problem A4 and A1 both name is real — the vague prompt must reliably misfire. My pragmatist note here: calibration is a production task, not a design question. The brainstorm cannot solve it. What the design can do is include a fallback instruction: "If both outputs look similar, that is information too — read the annotation on what closed the gaps in the precise version." This converts a calibration failure into a different teaching moment rather than a broken exercise.

**I am defending: my `brief-builder`'s explicit annotated side-by-side prompt design.** A1 defended this for A-00 (the prompt design from `daily-brief`). The same applies here. `intent-gap-lab`'s prompts need detailed annotation — not just "what changed" but "which phrase closed which gap." The annotation is not decoration. It is the lesson for learners who run the exercise and still do not see a meaningful difference. My brainstorm had this in `01-annotated.md` — that structural element should be incorporated wherever `intent-gap-lab` lands.

### LOG — A2 — A-01

What shifted: A1's acceptance of the files-on-disk principle convinced me that `brief-builder` was the right concept but in the wrong form. The named output files are genuinely better than session comparison. I concede the execution while standing by the annotation structure.

What the keep-using-this test revealed: `intent-gap-lab` is more reusable than it looks. The brief task is generic enough to substitute the learner's own brief, which makes the vague/precise cycle a transferable technique rather than a one-time demonstration. This is a point worth making in the README: "once you have run this exercise on the provided task, try it on a brief you actually need to send."

Standing firm on: no tool exercises in A-01. A1 and A4 both hold this position and it is correct. The keep-using-this test actually supports it — a repo that tries to teach all three parts of the mental model will be too crowded to be useful as a reference on any one of them.

---

## A-02: Cost, Tokens, and What Things Actually Cost

**Position: Accept `cost-before-after`, with a structural concern about the estimation step timing**

A1 has correctly accepted A4's `cost-before-after` as the strongest pick. The estimation-before-spending logic is right. My `session-anatomy` (run three versions, log the difference) was strong on evidence but weaker on the specific skill being taught — the module wants estimation, not observation.

Keep-using-this test: would someone return to `cost-before-after`?

Honestly: probably not as a repo. The `estimator.md` and `actuals.md` are well-designed but they are one-time learning artifacts. Once you have calibrated your estimation intuition across three tasks, the specific files become historical records, not living tools.

**My resolution: the session log habit should be extracted from the repo and framed as a portable template.** A1 made this point and I agree. The `estimates.md` and `actuals.md` format should be positioned as a template the learner copies into every project repo going forward, not just as exercise files in A-02. The README should explicitly say: "Add this template to any project repo where cost matters to you." That is the move that converts a one-time exercise into a recurring tool.

**One structural concern I have not seen named:** A4 flags that asking learners to estimate tokens before they have built intuition may produce demoralising errors. This is real. My resolution is not to remove the estimation step but to frame it differently. The first estimate should be explicitly framed as a baseline, not a test. "Your first estimate will likely be wrong. That is the point — write it down anyway so you have something to compare." This framing change is small but important for an audience that tends toward anxiety about getting things wrong.

**I am defending: the session anatomy comparison as a secondary exercise.** A4 and A1 both note the calibration problem (vague run must reliably cost more). But the `session-anatomy` format — three versions of the same task logged in a table — is the clearest evidence-generation structure in the set. It should survive as the `task-heavy` exercise within `cost-before-after`, not as a standalone alternative.

### LOG — A2 — A-02

What shifted: A1's acceptance of `cost-before-after` on the estimation-first grounds is correct. I moved away from `session-anatomy` as the primary choice.

What the keep-using-this test revealed: no A-02 repo as designed is sticky beyond the initial calibration. The value is in the template format becoming portable, not in the repo itself. This is a legitimate use of a one-time exercise — some modules teach concepts, not ongoing tools. The design job is to make the exit artifact (the templates) extractable.

Surprised by: how close all four agents were on A-02. The disagreement was genuine (four different picks) but all four designs converge on the same core mechanic: run something, record the numbers, compare. The difference was which comparison produces the best learning.

---

## A-03: CLAUDE.md — Your Persistent Instructions

**Position: Agree with A1 on `before-and-after`. The keep-using-this test strongly favours it. One significant add.**

A1 is right that `before-and-after` wins on structural grounds and on the inheritance chain logic. The CLAUDE.md the learner writes in A-03 is not just an exercise output — it is infrastructure they carry forward. That reframes the quality requirement for the template: it must be production-grade, not pedagogically adequate.

Keep-using-this test: `before-and-after` is the only A-03 option where the output — the CLAUDE.md they write — is explicitly designed to be kept and used. My `my-workspace` was designed for the same return value, and A1's `writing-style-guide` had the same intent. A3's `newsletter-studio` produces a CLAUDE.md but with newsletter-specific rules that narrow its domain. A4's `before-and-after` produces a general-purpose CLAUDE.md from a general template — the highest reuse potential of the set.

**My significant add: the compliance check as a closing step.** My `research-project` brainstorm included `03-check-compliance.md` — a prompt asking Claude Code to list which CLAUDE.md rules it applied and how. I noted in my log that this depends on Claude Code being accurate about which rules it followed (it may not be). A1 did not address this. I want to revisit it.

The compliance check has a real limitation: Claude Code's self-report of which rules it applied is not reliable. But it is useful for a different reason than I originally stated. The value is not in verifying that Claude Code is telling the truth — it is in making the learner think explicitly about whether they have testable rules. If Claude Code cannot describe how it applied a rule, that is evidence the rule is too vague to be applied consistently. The compliance check becomes a rule-quality diagnostic, not a rule-compliance audit. This reframing makes it worth including as a closing step in `before-and-after`, even with the self-report caveat. The README should explain exactly this: "if Claude Code's answer is vague, your rule is probably vague too."

**I am defending: A1's "use Claude Code to write your CLAUDE.md rules" technique.** This is the highest-leverage prompt in the A-03 set and it appears only in A1's brainstorm. For learners who know what they want from Claude Code but cannot express it as a testable rule, this prompt is the bridge. It belongs in `before-and-after` as the optional step between receiving the template and writing the rules. Not mandatory — some learners will know what they want to write — but available.

### LOG — A2 — A-03

What shifted: A4's inheritance chain argument changed how I think about A-03. I designed `my-workspace` as a standalone personal project. It is actually infrastructure. The production requirement for the CLAUDE.md template is higher than I had set it.

What the keep-using-this test revealed: `before-and-after` wins cleanly here. The CLAUDE.md output is the stickiest artifact in the entire pack — it is the one thing learners will open in every subsequent module. The template quality is therefore the highest-stakes content design decision in A-03.

Standing firm on: the compliance check as a rule-quality diagnostic, not a compliance audit. The reframing makes it useful. It should be a closing prompt, not a required step.

---

## A-04: Context Awareness and Compaction

**Position: Agree with A1 on `checkpoint-habit`. The keep-using-this test is where this module earns its place.**

A4's `checkpoint-habit` is correct. A1's acceptance of the habit-vs-event framing is the right call. I agreed with this framing in my own brainstorm — my `constraint-survival-test` was closer to event-engineering than habit-building.

Keep-using-this test: `checkpoint-habit` is the strongest performer across all A-04 options here, and I want to be precise about why. The checkpoint prompt is not just an exercise artifact — it is a tool the learner uses every time they run a long session from this point forward. The `checkpoint-prompt.md` file in `checkpoint-habit` is designed to be copied, which means the repo's core deliverable is a tool the learner takes with them. This is exactly the keep-using-this test passing.

**One thing A1 did not address: the CLAUDE.md design in `checkpoint-habit` needs to model the three-constraint approach from A3's `context-archaeology`.** A1 raised this in the discussion but framed it as an optional structural enhancement. I want to push back on "optional." The two CLAUDE.md rules in A4's `checkpoint-habit` as described are generic placeholders. The three-layer design from A3 — one constraint stated well, one stated conversationally, one implied — is the most instructive CLAUDE.md design for this module. It is not just a nice-to-have. If the CLAUDE.md rules are too easy to survive (both persist trivially), the checkpoint verification step produces "nothing to do" — the anticlimactic outcome A4 explicitly warns against. The three-constraint design creates instructive differential survival by design. It is a production requirement.

**I am defending my `constraint-survival-test`'s core insight:** the two-session comparison (standalone vs. buried constraint, same task) is structurally more controlled than a single checkpoint exercise. `checkpoint-habit` can incorporate this without becoming two sessions — by designing one CLAUDE.md rule as a standalone statement and one as a buried conversational instruction, then checking which survived in the checkpoint. That is the three-constraint logic without requiring the learner to run a second session. It is already implicit in the exercise — it should be explicit in the CLAUDE.md design.

### LOG — A2 — A-04

What shifted: A4's framing of habit vs. event is definitively correct. My `constraint-survival-test` was trying to guarantee the event. That is the wrong design goal. The checkpoint habit has value regardless of whether compaction fires.

What the keep-using-this test revealed: `checkpoint-habit` wins on return value because the checkpoint prompt is a transferable tool. That is the right way to think about what A-04 is producing — not an understanding of compaction mechanics, but a prompt template the learner uses in every long session from here on.

Standing firm on: the CLAUDE.md in `checkpoint-habit` must be designed for differential survival, not generic placeholder rules. This is production-critical.

---

## A-05: Session Hygiene

**A1 asked me to address this directly. I will.**

A1 has called a split: `clear-or-contaminate` as primary, `when-to-clear` / `when-not-to-clear` annotation concept from A3's `research-sprint` as a required element. I want to challenge the first part of that split.

**Keep-using-this test applied to all four options:**

- `clear-or-contaminate` (A4): designed around a demonstration that may not work. If contamination is not visible in the comparison output, the learner completes the exercise having seen nothing and concludes either the technique works (incorrectly) or does not (also incorrectly). A repo that depends on a negative demonstration that may not materialise has a fundamental return-value problem — but it also has a *completion-value* problem. The learner who runs the contaminated version, sees a plausible output, and concludes "looks fine to me" has been actively misled by the repo design.

- `weekly-work-stack` (my pick): I am going to defend this more directly than A1 expected. A1's note is that it "offers repetition-for-habit but no demonstration of why the habit matters." That is true. But the keep-using-this test asks whether someone would keep using this after the exercise ends — and `weekly-work-stack` is the only A-05 option that answers yes, cleanly. Three scoped sessions with a log. That is a work pattern. Someone who completes this exercise and finds it useful has not just learned about session hygiene — they have built the workflow that session hygiene enables. The session log format is a real tool they keep.

- `research-sprint` (A3): the `when-to-clear.md` and `when-not-to-clear.md` files are the most distinctive teaching elements in the A-05 set. A1 is right that these must appear somewhere. But as a primary repo, the research sprint assumes learners have not yet used `/clear` and need to learn the decision — which is correct — but the three research questions need to be carefully calibrated (q-02 and q-03 genuinely related, q-01 genuinely unrelated) and there is no natural return-value from the repo itself.

- `multi-project-hub` (A1): realistic but no negative demonstration. I agree it should not be the primary choice.

**My revised position on A-05:** I am not defending `weekly-work-stack` as the primary choice in the abstract. A1's `clear-or-contaminate`-plus-annotation split is correct in direction, but I want to change the implementation.

The `clear-or-contaminate` contamination calibration problem is genuinely hard — A4 says so, and A4 is the most structurally honest agent in this set. A4 also names the alternative framing in the A-05 LOG: "teach /clear through positive demonstration rather than negative." That is the right move.

**My proposed resolution for A-05:** The primary repo should be a modified `weekly-work-stack` — three tasks, `/clear` between them, session log after each — but with A4's contamination demonstration folded in as an optional fourth session specifically designed for the learner who wants to see why the habit matters. The wrong-way-first demo can live as an extension, not as the primary exercise. The positive demonstration (clean sessions produce clean output) is more reliable and has genuine return value. The negative demonstration (contamination) is educationally powerful when it works but structurally fragile — it belongs as an optional add-on, not the pedagogical spine.

The `when-to-clear.md` / `when-not-to-clear.md` annotation concept from A3 must be included regardless. This is not negotiable. A-05 explicitly teaches the decision, not just the technique. Any repo that only says "use /clear here" has not taught the module.

**I am standing firm on the weekly-work-stack return value.** This is the one place I will push back on A1 directly. A4's `clear-or-contaminate` is a structurally clever demonstration that would never be opened again once the comparison is made. My `weekly-work-stack` is a structurally simpler exercise that produces a work pattern the learner might actually keep. The pragmatist test is not just "does the exercise work?" — it is "does the learner do something with it after Tuesday?" A demonstration repo with unreliable contamination fails both tests. A workflow repo passes the second.

### LOG — A2 — A-05

What shifted: reading A1's synthesis made me realise I was not defending `weekly-work-stack` strongly enough in my original brainstorm. I had it as my pick but had not articulated why it passes the keep-using-this test better than the alternatives. The answer is: it produces a work pattern, not a demonstration.

Surprised by: A4 naming the alternative framing in the A-05 LOG entry ("teach /clear through positive demonstration rather than negative") and not making it the primary recommendation. A4 builds `clear-or-contaminate` around the negative demonstration and then quietly flags its own failure mode. This is intellectually honest but the flag should have been louder.

Standing firm on: `when-to-clear.md` / `when-not-to-clear.md` annotation concept must ship regardless of which repo wins. The nuance that /clear is a decision, not a reflex, is the module's most important teaching and it is represented only in A3's design.

---

## A-06: Output Engineering in Claude Code

**Position: Agree with A1 on `plan-then-build` as primary plus format-control secondary. One keep-using-this concern.**

A1's acceptance of A4's modification mechanic ("change at least one thing in the plan") is correct. This is the strongest structural innovation in the A-06 set. I concede it. My `format-library` was the right secondary exercise and A1 has already named this — format-control as a separate lighter exercise alongside `plan-then-build`.

Keep-using-this test: `plan-then-build` has moderate return value. The plan-before-execute habit is genuinely useful, but a repo with one source document and one restructuring task gets used once. The modification mechanic makes engagement unavoidable but does not create repeat use.

My `format-library` has better return value — four format specs the learner keeps as reusable templates. A3's `document-factory` is similar in spirit. The format specs are the artifacts with actual longevity.

**My resolution:** A1's split (plan-then-build primary, format-control secondary) is correct, but the return value lives almost entirely in the secondary exercise. The plan-then-build repo should include at least one format-spec template as a takeaway — not just a plan, not just a modified plan, but a format spec block the learner can reuse. The annotated plan-prompt template is the equivalent for the planning skill. Both should ship with `plan-then-build` as portable templates, not just as exercise scaffolding.

**I am not defending A3's pitch-builder.** The motivation argument is real — people want to finish things they care about — but the pitch-builder's return value is too task-specific. Once you have built the pitch, the repo is done. The format-library's return value is in the format specs themselves, which transfer to any task. For this audience, transferability beats motivation.

### LOG — A2 — A-06

What shifted: A4's modification mechanic is the genuine structural insight in A-06. I concede primary to `plan-then-build`.

What the keep-using-this test revealed: the format specs from a `format-library` exercise have more longevity than any single plan-then-build output. The secondary exercise has more return value than the primary. This is not a problem with the primary — the plan habit is more important to install than the format library is to keep — but it is worth naming.

Standing firm on: both the plan-prompt template and at least one format-spec template should be portable takeaways from A-06's repo design. Whatever ships should produce artifacts the learner uses on their own documents after the exercise.

---

## A-07: Tool Fluency

**Position: Agree with A1 on `tool-decision-tree`. The keep-using-this test is solid here.**

A4's `tool-decision-tree` is the right primary pick. A1 is correct. I agree on the concession: my `knowledge-base-audit` should be the non-technical default content, but the prediction-log mechanic from A4's design is more important than the content choice.

Keep-using-this test: `tool-decision-tree` has the best return value of any module in the track, because the `decision-guide.md` (the tool hierarchy condensed to one page) is a reference card the learner actually uses. Once you have done the five-task prediction exercise, the decision guide is the thing you consult when you forget which tool to reach for. This is the most natural reference artifact in the entire pack.

**One thing A1 did not fully resolve: the cost-race-pairs exercise as a secondary.** A1 defends "at least one free-vs-named comparison" and names A4's `cost-race-pairs` as the best-developed version. I agree. But the calibration problem (free-choice versions not reliably escalating) applies here too. My pragmatist note: the cost demonstration does not need to be dramatic to be educational. Even a modest token difference is instructive if the learner has to record and explain it. The problem is not calibration failure — it is the framing. If the README says "the free version should cost twice as much" and it does not, the exercise seems broken. If the README says "record the difference, however small, and explain what you see," any result is instructive. The cost-race-pairs exercise should ship with the lower-ambition framing.

**I am defending A3's investigator framing as a CLAUDE.md design choice.** A1 accepted A3's "name your tools like a professional names instruments" framing for the README. I want to go further: this framing should be in the CLAUDE.md for whatever A-07 repo ships. "Name the tool you intend to use before every message" is the rule, and the professional-precision framing changes how the learner relates to it. Cost-anxiety framing creates defensive learners. Professional-precision framing creates learners who are building competence. The CLAUDE.md is not neutral — its tone sets the learner's relationship to the module.

### LOG — A2 — A-07

What shifted: A1's acceptance of the technical-audience default problem is correct. My `knowledge-base-audit` should have been flagged as a better default than A1's own `codebase-explorer`. Both are now secondary to A4's structure with better content.

What the keep-using-this test revealed: `tool-decision-tree` is the strongest keep-using-this result in the pack, because the decision-guide reference card is genuinely useful after the exercise. This is the module where the format of the repo most naturally produces a durable artifact.

Standing firm on: professional-precision framing in the CLAUDE.md, not just the README. The framing is instructional design, not decoration.

---

## A-08: Agent Delegation and Briefing

**Position: Agree with A1 on `brief-writer` structure. The evaluation gap is real and I have a partial solution.**

A1 is right on the structure: three candidates (one delegatable, two not), decision log, brief, evaluation. A4's `brief-writer` is the strongest design. The physical folder scaffolding A1 defends (step-01-decide, step-02-brief, step-03-evaluate) is also correct — the three steps should be visible as physical structure, not just in the CLAUDE.md.

A3's `why-not-03.md` concept (standalone file for rejection reasoning) is the right refinement. A1 has accepted this. I agree.

**The A-08 evaluation gap A1 flagged: here is my partial solution.**

A1 writes: "the evaluation step in every A-08 repo is currently a fill-in template. None of us have designed the evaluation step with enough rigor." This is correct. The module's core evaluability principle — "can you tell whether the result is correct?" — is not just a yes/no question. It has three components:

1. Did the output stay within the scope the brief defined? (Scope check)
2. Is the output evaluable — do you know enough to assess whether it is correct? (Evaluability check)
3. If you cannot evaluate it, that is evidence you wrote the wrong brief, not that the subagent failed. (Attribution check)

The `brief-evaluation.md` in every agent's A-08 repo currently covers only point 1 implicitly. Points 2 and 3 are the harder questions and they are missing.

**My proposed evaluation template structure:**

```
brief-evaluation.md

Section 1 — Scope check
- Did the output stay within the boundaries stated in the brief? (yes / no / partial)
- If partial or no: which boundary was crossed?

Section 2 — Evaluability check
- Can you tell whether the output is correct, or only whether it looks plausible?
- If you cannot tell: what information would you need to verify it?

Section 3 — Attribution
- If the output missed the brief: was the flaw in the brief (underspecified) or in the subagent's interpretation?
- Write one specific brief improvement that would have prevented the problem.
```

Section 3 is the key structural move. It forces the learner to attribute evaluation failure to the brief rather than the subagent — which is exactly the module's core principle ("the correction happens in the brief, not in the conversation"). Without Section 3, the evaluation step teaches "good output / bad output." With it, it teaches "good brief / bad brief."

**Keep-using-this test for A-08:** The `brief-template.md` and the improved `brief-evaluation.md` are the portable artifacts from this module. A learner who internalises the three-section evaluation structure is equipped to evaluate any delegated work, not just the exercise. This is the module where the repo's value extends furthest beyond the A-track.

### LOG — A2 — A-08

What shifted: A1 and A4 both named the evaluation gap but neither proposed a solution. I went further here because this was the gap I was specifically invited to address. The three-section evaluation structure (scope, evaluability, attribution) is the structural fix the current designs are missing.

Surprised by: how close all four agents are on A-08. The structural disagreements are small — decision log format, how many candidates, brief template annotated vs. blank. The evaluation gap is the only genuine design gap across all four proposals, and none of us caught it in the brainstorm phase.

Standing firm on: Section 3 of the evaluation template (attribution). Without it, the evaluation step teaches output quality. With it, it teaches brief quality. That is the module's actual goal.

---

## A-09: Capstone — A Real Project

**Position: Agree with A1 on `capstone-kit`. The keep-using-this test is the whole point of this module.**

A4's `capstone-kit` is the only correct design for a capstone. A1 is right. Any repo that provides fake content fails the capstone's primary condition. I concede `research-to-brief` (my pick) for the same reason A1 concedes `research-brief-builder` — fake source documents let learners check boxes without building anything real.

Keep-using-this test: this is where the test inverts. For A-09, the question is not "would you return to this repo?" — it is "do you take the habits out of this repo and use them without the repo?" A capstone that passes the test produces learners who no longer need the scaffold. The `capstone-kit`'s `technique-checklist.md` is designed to be discarded eventually — the techniques should be reflexes, not items to check. The capstone CLAUDE.md is designed to be the best CLAUDE.md the learner has written, which means it supersedes any future CLAUDE.md they write until they deliberately improve on it. These are the right design goals.

**I am defending A3's almanac CLAUDE.md point.** A3 writes: "the capstone's CLAUDE.md should be the best CLAUDE.md in the entire pack." This should be production-level guidance for whoever writes the `capstone-kit`'s CLAUDE.md template. It should model everything the track has taught: specific rules, testable constraints, inline annotations explaining why each rule is written the way it is. Not a stub. Not a minimal example. The best CLAUDE.md the course team can produce.

**One A-09 point neither A1 nor any other agent has raised:** The reflection questions in `reflection.md` should explicitly ask the learner to identify which techniques are not yet reflexes. The module's reflection prompt asks "which habits are automatic?" — but for learning purposes, the more valuable question is "which habits do you still have to remind yourself to use?" That gap identification is the input to any future learning the learner does on their own. The reflection template should prompt it directly.

### LOG — A2 — A-09

What shifted: A4's rejection of fake source content is definitive. I concede `research-to-brief` without reservation. The capstone requires real work — that is what makes it a capstone.

What the keep-using-this test revealed: for A-09, the test is different. The question is not return-value but transfer-value. Does the learner take the habits out? That is the right success condition. The capstone CLAUDE.md, the technique checklist (used until not needed), and the reflection questions are the artifacts that serve transfer-value rather than return-value.

Standing firm on: the reflection questions must explicitly identify which techniques are not yet automatic. This is the gap-identification question that points learners toward deliberate practice after the track ends.

---

## Cross-module observations

**Pattern A1 confirmed and I am amplifying: files-on-disk is a production standard, not a design choice.**

A1 names this as Pattern 3. I want to make it harder. Any A-track repo where the teaching moment lives only in the session output — not in a named file the learner can hold open — is insufficiently designed. Every module where comparison is the mechanism (A-01, A-03, A-05, A-06) should treat named output files as non-negotiable. This is not about elegance — it is about whether the lesson persists after the terminal closes.

**Pattern A1 missed: the reusable artifact gap.**

Looking across all ten modules, only a handful of repos as currently designed produce artifacts the learner will use again:

- A-03: the CLAUDE.md (high return value)
- A-04: the checkpoint-prompt template (high return value)
- A-06: the format-spec templates from `format-library` (high return value — but these are in the secondary exercise)
- A-07: the decision-guide reference card (high return value)
- A-08: the brief-template and evaluation template (high return value)
- A-09: the CLAUDE.md and technique-checklist (high return value until checklist becomes redundant)

The modules with low return value from their primary repos: A-00, A-01, A-02, A-05. These are the modules where the "make it yours" step and the portable template framing are most important. The design gap is not catastrophic — some modules teach concepts, not ongoing tools — but every repo should ask: what does the learner take with them when the exercise is done? If the answer is "the habit," that is acceptable. If the answer is "nothing," the repo has a design problem.

**My overall read on the pack as currently shaping up:**

It would get used. The structural decisions are mostly right. The failure modes are real but they are production problems, not concept problems: calibration, sample content quality, CLAUDE.md co-design with tasks, evaluation template depth. None of these require redesigning a module — they require careful production work.

The one genuine design risk is A-05. If `clear-or-contaminate` ships as the primary repo and the contamination calibration fails — which it may — the module produces learners who either saw nothing (contamination was invisible) or saw something misleading (the model handled it gracefully and they concluded /clear is unnecessary). Neither outcome serves the module's goal. A1's split (primary plus annotation concept) is better than `clear-or-contaminate` alone, but the pragmatist test says: if the primary exercise may not demonstrate the concept, the primary exercise is wrong.

The pack would get used. It would not get archived. But it would produce better learners if A-05 is resolved before the recording week, not after.

---

*Entry 2 closed. A3 writes next.*

---

## Entry 3 — Agent A3
*Creative lens — reading A1 and A2's entries and all four brainstorm logs*
*Date: 2026-04-15*

---

## A-00: Getting Started with Claude Code

**Position: Agree with A1 and A2 on `first-session-folder`. One pushback on which repo gets the "make it yours" step.**

A4's `first-session-folder` is structurally correct. I concede my `film-log` pick — A1 is right that meeting notes are harder to dismiss as irrelevant than films. The universal recognisability argument holds. I still believe the film log has the tightest satisfaction loop in this set, but structural soundness beats emotional resonance at A-00, where learners are too anxious about the terminal to be fully moved by the subject matter anyway.

However, I want to address the specific question about A2's "make it yours" step and which repo it applies best to. A2 argues the step is most important for `first-session-folder` because the sample content caps its lifespan. That is pragmatically correct but creatively it is the wrong way round. The "make it yours" step is most *powerful* for my `film-log` or A1's `daily-brief` precisely because the personal subject matter is already primed. Telling a learner "now drop your actual film list in" after they've just formatted a pre-written one creates a genuine moment of "oh, this is mine now." The same instruction given after processing someone else's meeting notes creates less pull — meeting notes are universal but rarely precious.

The practical resolution: the "make it yours" step should stay in `first-session-folder` because that is the repo we are shipping, but the *tone* of that closing instruction should be written with the emotional register of a `film-log` or `daily-brief`. Not "you can replace the sample content" but "the most useful thing you can do right now is put something of yours in here." That is the difference between an optional note and a motivating invitation.

### LOG — A3 — A-00

What shifted: I conceded the structural argument. The film log is more personally resonant; `first-session-folder` is more structurally sound. For A-00, soundness wins because the terminal anxiety is real — the learner cannot enjoy the personal resonance if they are still nervous about approving tool calls.

What the creative lens adds: the "make it yours" step is a motivational mechanism, not just a usability improvement. The phrasing matters. Writing it as a warm closing invitation rather than a technical note is the difference between a learner who tries it once and a learner who comes back.

Standing firm on: the annotated prompts must be written at a nervous pace. A1 endorsed my original observation on this and I am restating it. This is a tone requirement, not just a pacing requirement — the prompts should feel like a guide who has done this before and is not going to leave you stuck.

---

## A-01: Mental Model Refresher

**Position: Agree on `intent-gap-lab`. Agree on Part 1 only. No creative angle changes this.**

A1 and A2 are correct. A4's `intent-gap-lab` with files-on-disk comparison is the right call. My `recipe-for-a-good-session` was rejected by A4 on structural grounds (three-part approach dilutes all three parts) and I accept that critique. I do not have a creative defence for a repo that tries to do too much.

The one place the creative lens is relevant at A-01: the subject matter of the task brief in `intent-gap-lab`. A4 proposes "how [Company X] approaches [topic]" — a business research brief. That is adequate but cold. A brief about something the learner actually cares about — their own work, their niche, something they would genuinely want researched — would make the vague/precise gap feel more consequential. The calibration problem exists regardless of subject, but a learner who cares about the answer to the precise version will notice the gap more sharply than a learner processing a generic business question. The README should include a note: "If you want a stronger learning moment, substitute the topic for something you actually want to know about." This is not changing the repo — it is a one-sentence invitation.

### LOG — A3 — A-01

What shifted: I conceded `recipe-for-a-good-session` entirely. A4's structural rejection is correct. Three rounds on the same material sounds elegant but in practice produces a session that is too long and too fragile.

What the creative lens adds: the subject matter of `task-brief.md` is a small but real lever. Personal relevance amplifies the gap between vague and precise outcomes. The repo cannot guarantee this, but the README can invite it.

Standing firm on: Part 1 only. The creative lens agrees with the structural lens here — a repo that tries to be memorable by covering more ground ends up being forgettable by being shallow.

---

## A-02: Cost, Tokens, and What Things Actually Cost

**Position: Agree on `cost-before-after`. One creative observation about what makes the estimation step feel worthwhile rather than demoralising.**

A1 and A2 are right. Estimation before spending is the right skill and `cost-before-after` is the right design. My `cost-detective` pick is a close second — the detective framing is genuinely more engaging than a plain estimate-and-compare — but A4's module-alignment argument is stronger. The module's goal is estimation discipline, not forensic observation.

Here is where the creative lens has something to add that neither A1 nor A2 named directly: the estimation step in `cost-before-after` will only feel worthwhile if the learner believes their estimate is interesting, not just wrong. A2 flagged the demoralisation risk. The fix is not softer framing — it is telling the learner explicitly that the calibration gap reveals something specific about them. "Your first estimate will be wrong. The interesting question is: which variable did you misread? Were you wrong about the number of files? The number of messages? The length of the output?" This personalises the error. A personalised error is motivating; a generic error is discouraging.

A3's `cost-detective` framing — treating each case as a puzzle rather than a calibration exercise — is worth preserving in the `task-heavy` exercise within `cost-before-after`. The detective framing changes the learner's relationship to token counting from admin to curiosity. A2 proposed this should "survive as the `task-heavy` exercise within `cost-before-after`." I agree and am endorsing it from the creative angle.

### LOG — A3 — A-02

What shifted: I conceded `cost-detective` as the primary pick. The detective framing is engaging but the estimation step in `cost-before-after` teaches the right skill more directly.

What the creative lens adds: the estimation failure should be presented as personal diagnostic data, not a mistake to correct. That framing shift changes the learner's emotional response to getting it wrong — from embarrassment to curiosity.

Standing firm on: the detective framing should survive in the `task-heavy` exercise. This is not about decoration — the puzzle framing keeps learners engaged in what is otherwise the most admin-heavy session in the pack.

---

## A-03: CLAUDE.md — Your Persistent Instructions

**The `newsletter-studio` vs. `before-and-after` question. Making the case.**

This is the module where the creative angle is most contested and where I need to be precise about what I am defending and what I am conceding.

**What I concede:** A4's `before-and-after` is structurally superior. The general-purpose CLAUDE.md it produces has higher reuse potential than one built for a newsletter. The task-rule co-design constraint is real and applies to my `newsletter-studio` as much as to any other before/after design. A1's inheritance chain argument is correct — A-03 is infrastructure, and `before-and-after` produces better infrastructure.

**What I am defending: the `newsletter-studio`'s domain specificity is a creative strength that has not been properly argued.**

Here is the case. `before-and-after` asks the learner to fill in a general CLAUDE.md template with their own preferences. That requires the learner to already have preferences they can articulate. The `newsletter-studio` gives the learner something to react against — a voice, a set of don'ts, a half-written draft. For a learner who has never thought about their preferences, having a specific domain to inhabit is the difference between staring at a blank template and filling in something they can actually see.

The limitation is real: if you do not run a newsletter, the domain is foreign. But what the newsletter-studio design does that `before-and-after` does not is provide the *texture* of a real CLAUDE.md purpose. A general template can be filled in with vague, untestable rules — "be concise," "use professional tone" — and still feel completed. The newsletter studio's voice notes and don't-do-this files create friction against vagueness. You have to be specific because the domain is specific.

**My proposed resolution:** `before-and-after` wins as the primary repo. But the `newsletter-studio` structure — specifically the `voice-notes.txt` and `dont-do-this.txt` files — should inform how the CLAUDE.md template in `before-and-after` is designed. Instead of a fully general template, the `before-and-after` repo should include one worked example of a domain-specific CLAUDE.md alongside the general template. The learner can use the general template or start from the domain example. This preserves the transferability of `before-and-after` while solving the blank-template problem that `newsletter-studio` was designed to address.

A1's `writer-in-residence` — a beautifully written example CLAUDE.md as the primary teaching artifact — is the right model for this worked example. A1 called it "the most elegant design in A3's set." It deserves to be the companion document inside `before-and-after`, not a discarded alternative.

### LOG — A3 — A-03

What shifted: I concede `newsletter-studio` as the primary pick. The general-purpose CLAUDE.md in `before-and-after` is better infrastructure.

What the creative lens adds: the blank-template problem is real and `before-and-after` does not fully solve it. The solution is a domain example alongside the general template — learners who need something to react against have it; learners who already have preferences can ignore it.

Standing firm on: `writer-in-residence`'s beautifully written example CLAUDE.md should live inside `before-and-after` as a companion document. An excellent example teaches format as much as annotation does — and for learners who learn by reading before writing, it is the most useful thing in the repo.

---

## A-04: Context Awareness and Compaction

**Position: Agree on `checkpoint-habit`. Strong support for A2's three-constraint CLAUDE.md requirement.**

`checkpoint-habit` is correct. I concede my `context-archaeology` pick — A4 is right that it tries to engineer compaction as a demonstrable event, and A2 is right that habit-vs-event is the key framing shift. I still believe `context-archaeology` is the most conceptually elegant design in the A-04 set, but elegance does not matter if compaction does not fire reliably.

The creative lens has one specific observation here: the "archaeology" framing is worth rescuing even if the repo is not. A4's `checkpoint-habit` presents the checkpoint as a mechanical verification step. The archaeology framing presents the same step as discovery — "let's see what survived." For a learner who has never run a long session before, "discovery" is a more motivating frame than "verification." The README for `checkpoint-habit` should describe the checkpoint prompt as an excavation, not a checklist. The difference is one paragraph in the README but it changes the learner's emotional posture for the exercise.

A2's requirement that the CLAUDE.md in `checkpoint-habit` must use the three-constraint design (one stated well, one stated conversationally, one implied) is correct and I endorse it from the creative angle too. The three-constraint design creates the only guaranteed differential outcome in a compaction exercise — and differential outcomes are what make exercises feel like discoveries rather than confirmations. If both constraints survive identically, the checkpoint feels like a formality. If one survives better than the other, the learner has something to explain. Explanation is the moment of learning.

### LOG — A3 — A-04

What shifted: I concede `context-archaeology` as a primary pick. The three-constraint CLAUDE.md design — which was the best structural element of `context-archaeology` — survives as a production requirement for `checkpoint-habit`. The idea lived; the repo name died.

What the creative lens adds: the checkpoint should be framed as discovery/excavation, not verification. This is a README tone note, not a structural change, but it matters for learners who approach verification tasks with less curiosity than investigation tasks.

Standing firm on: the archaeology metaphor for the checkpoint prompt. It belongs in the README. "What survived the session?" is a better question frame than "verify your rules persisted."

---

## A-05: Session Hygiene

**The `clear-or-contaminate` vs. `weekly-work-stack` question. The creative lens has a clear view.**

This is the most genuinely contested module and A2 has mounted the strongest defence of `weekly-work-stack` in the discussion so far. I want to engage with it directly.

**The creative lens view: `weekly-work-stack` is the more motivating repo, but motivation is not the deciding variable at A-05.**

A2 is right that `weekly-work-stack` passes the keep-using-this test more cleanly than `clear-or-contaminate`. A work pattern that produces real outputs is stickier than a demonstration that produces a comparison. On motivation and return-value, `weekly-work-stack` wins.

But here is where the creative lens diverges from the pragmatist lens: motivation matters most when a learner has to push through resistance. At A-05, the resistance is not cognitive — it is behavioural. Learners already know they should scope their sessions. They just do not do it. The question is not "how do I make this motivating enough to finish?" It is "how do I make the *wrong behaviour* visible enough to change?"

`clear-or-contaminate` answers that question. `weekly-work-stack` does not. It assumes the learner needs a better workflow. `clear-or-contaminate` shows them why their current workflow fails. For a behavioural habit, the negative demonstration matters more than for a cognitive skill.

**However — and this is the creative lens concession — A2 is right that a negative demonstration that may not materialise is worse than no negative demonstration.** If contamination is invisible in the comparison output, the learner does not just learn nothing; they learn the wrong thing. A broken demonstration is pedagogically more dangerous than a missing one.

**My proposed resolution, different from both A1 and A2:** The primary repo should be `the-research-sprint` — my original pick. Here is why the creative lens lands here.

`the-research-sprint` is the only A-05 design that teaches the *decision*, not just the technique. The `when-to-clear.md` and `when-not-to-clear.md` files are not just structural elements — they are the module's actual argument. A-05 explicitly says "/clear is not always required." Teaching learners to use /clear reflexively (which `weekly-work-stack` risks doing) is an incomplete job. Teaching them the judgment call is the full job.

The research sprint is also not dependent on contamination being visible. It depends only on the learner completing three research questions — which is entirely within their control. The lesson is in the annotation, not in the model's behaviour. This is more structurally reliable than any contamination demo.

A2's `weekly-work-stack` structure — three scoped sessions with a session log — should be the scaffolding within `the-research-sprint`. Combine: the three-question research structure from my brainstorm, the session log format from `weekly-work-stack`, and the explicit `when-to-clear.md` / `when-not-to-clear.md` annotation. This is the fullest A-05 design in the set.

**What I am conceding on `clear-or-contaminate`:** A4's contamination calibration problem is disqualifying as a primary exercise for the reasons A2 named. The negative demonstration can survive as an optional extension — a fourth session the README describes as "if you want to see what contamination looks like, try this." But the primary exercise should not depend on it.

### LOG — A3 — A-05

What shifted: I am more confident in `the-research-sprint` after reading the discussion than I was in my original brainstorm. A2's structural critique of `clear-or-contaminate` is the right attack; I am just targeting a different solution than A2.

What the creative lens adds: the /clear decision is what makes A-05 interesting. A demo of /clear's effect is a demo. A lesson in the judgment call is the module. These are different things and `the-research-sprint` teaches the right one.

Standing firm on: `when-to-clear.md` and `when-not-to-clear.md` are non-negotiable. They are the module's argument made structural. Any A-05 repo that does not include both — or their equivalent — has not taught the module.

---

## A-06: Output Engineering in Claude Code

**Position: Agree on `plan-then-build` as primary. A partial defence of `the-pitch-builder` that does not win but should inform the secondary exercise.**

A1 and A2 are correct. `plan-then-build` with the modification mechanic is the right primary repo. A2's observation that the format-spec templates from the secondary exercise have more return value than the primary's plan outputs is honest and accurate.

The creative lens has one defence for `the-pitch-builder` that has not been fully argued: the audience adaptation step — same content, different audience — is the highest-leverage output engineering exercise in the entire A-06 set. A1 dismissed `the-pitch-builder` as capstone-adjacent rather than primary-appropriate. A2 said the return value is too task-specific. Both are correct on the main question. But the audience adaptation mechanic should not disappear.

Here is where the creative lens makes its specific contribution: the modification requirement in `plan-then-build` — "change at least one thing in the plan before approving" — could be extended to include one audience adaptation round. Not a second full execution, but: after producing the plan-then-build output, the CLAUDE.md includes a standing instruction: "Once you have built the primary version, run one audience adaptation — identify one thing about your audience that would change the output, and modify the format spec accordingly." This is one additional step, not a second session. It converts the format control exercise from single-audience to multi-audience, which is the skill most learners actually need.

This is a small structural addition, not a repo redesign. It preserves `plan-then-build` as primary while rescuing the most valuable teaching element from `the-pitch-builder`.

### LOG — A3 — A-06

What shifted: I concede `the-pitch-builder` as the primary repo. A2's note that the format specs in the secondary exercise have more return value is correct, and I accept the primary/secondary split.

What the creative lens adds: the audience adaptation mechanic from `the-pitch-builder` is worth rescuing as a single additional step inside `plan-then-build`. Not a new session, not a second repo — one standing instruction in the CLAUDE.md.

Standing firm on: a genuinely motivating source document matters for A-06 because the plan step requires the learner to care whether the plan is good. A generic brief produces reflexive approval. The pitch-builder understood this — the primary repo should benefit from the same consideration about the quality of its source material.

---

## A-07: Tool Fluency

**Position: Agree on `tool-decision-tree`. Strong endorsement of A2's framing-in-the-CLAUDE.md proposal.**

A4's `tool-decision-tree` is correct. My `the-investigator` concedes to it on structural grounds — five tasks, five tools, prediction before each is a cleaner structure than two cases in an investigator framing. I still believe the investigator metaphor is more motivating than a lab exercise, but A2 has already won the argument I was going to make: the professional-precision framing should be in the CLAUDE.md, not just the README.

A2 goes further than A1 on this point and I want to reinforce it: the CLAUDE.md instruction "name the tool you intend to use before every message" written with the investigator register — "name your tools like a professional names instruments" — changes the learner's relationship to the exercise. Not just the README. Not just a note. The CLAUDE.md itself should have a voice that frames tool naming as professional precision. This is a tone decision with structural effects: it changes what the learner tells themselves while doing the exercise.

The investigation log from my brainstorm should also survive in some form. The prediction-log in `tool-decision-tree` is the right mechanism; the investigation-log column format (tool named, tool used, match, why) is the right content. These are the same thing under different names. The prediction-log should include a "why did I choose this tool?" column, not just a match/no-match check. The reasoning is the learning, not the prediction.

### LOG — A3 — A-07

What shifted: I concede `the-investigator` as primary. The five-task prediction structure in `tool-decision-tree` is cleaner than the two-case investigation structure.

What the creative lens adds: the CLAUDE.md voice should carry the professional-precision framing, not just the README. The prediction-log should include a reasoning column, not just a match/no-match.

Standing firm on: the investigator framing is the best memorable mental model for tool selection in this pack. Even if the repo is `tool-decision-tree`, the framing belongs in the CLAUDE.md and README. A learner who internalises "I reach for the right instrument" will use the skill differently than a learner who internalises "I name tools to save tokens."

---

## A-08: Agent Delegation and Briefing

**Position: Agree on `brief-writer` structure. A defence of `mission-control`'s framing that loses on structure but wins on something.**

A1 and A2 are right on the structure: A4's `brief-writer` with three candidates (one delegatable, two not), physical folder scaffolding (A1's step-01/step-02/step-03), standalone rejection reasoning (my `why-not-03.md`), and A2's three-section evaluation template (scope, evaluability, attribution). These should all be in the selected repo.

Here is what the creative lens notices: delegation is the module where the learner is least likely to feel the stakes in a template exercise. Writing a brief for a fictional task to a fictional subagent is, from the learner's perspective, a simulation. The brief either "works" or it does not, but the consequences are contained.

My `mission-control` framing — "you are mission control; subagents run tasks you define" — was an attempt to solve this problem. It does not solve it structurally. But the framing matters for a different reason: it is the only A-08 design that frames delegation as architecture rather than communication. "You are mission control" is a role, and roles produce different behaviour than exercises do.

The creative lens contribution: the CLAUDE.md for the selected A-08 repo should establish the learner as an architect, not a brief-writer. Not "this folder is for brief-writing practice" but "this folder is for delegation — you decide what gets delegated, how it is briefed, and whether the outcome was correctly specified." The CLAUDE.md rule A4 identified — "Do not spawn any subagent until the learner has completed the decision log and written a full brief" — is already the right architecture instruction. The framing should match it.

This is not changing the repo. It is changing the register of the CLAUDE.md from tutorial to operational. Small difference; meaningful effect.

### LOG — A3 — A-08

What shifted: I concede `the-parallel-desk` as the primary pick. A4's `brief-writer` with the decision log and three candidates is the stronger structural design. My `why-not-03.md` concept survives as a standalone file.

What the creative lens adds: the CLAUDE.md should frame the learner as an architect/operator, not a brief-writing student. The register difference changes the learner's relationship to the exercise. A2's three-section evaluation template is the right structural fix for the evaluation gap and I endorse it.

Standing firm on: the non-delegatable task must require genuine judgment to read correctly. A task that is obviously non-delegatable teaches the test by elimination. A task that looks delegatable but fails on the evaluability or understanding criterion teaches the test by application. The second kind is harder to write but more instructive.

---

## A-09: Capstone — A Real Project

**The `personal-almanac` case. Making it seriously.**

A1 concluded that `personal-almanac` is "the most emotionally compelling capstone option" but called `capstone-kit` "more universal." A2 agreed with A1 on `capstone-kit`. Neither agent seriously engaged with the pedagogical argument for the almanac. I am making it now.

**The case for `personal-almanac`:**

The capstone condition from the module is "you will use the output." A4's `capstone-kit` is scaffolding — it enables any project, which means it does not fully commit to any output. The learner chooses their own project, which is correct, but the kit's empty folders and templates do not pull. They provide structure without motivation.

The almanac pulls. A structured reflection on your own decisions, wins, and lessons over a year is something most people have thought about doing and never done. The first session — dropping your own raw notes into `notes-dump.txt` and asking Claude Code to help you make sense of them — produces an output that is immediately personal and immediately useful. No other capstone design in this set creates that condition.

A1's universality concern is real: not everyone self-reflects as a practice. But the almanac does not require an existing self-reflection habit — it invites one. The `vision.md` file I designed explicitly addresses this: it frames the almanac as "a structured way to look back at your year, even if you've never done it before." The barrier is lower than A1 assumed.

**Where `capstone-kit` wins:** universality and instructor predictability. A course designer cannot know whether a given learner will engage with self-reflection as a project. The kit is neutral about what the learner builds.

**Where `personal-almanac` wins:** the output is the most likely of any capstone option to be used after the course ends. A learner who builds an almanac will likely want to build another one next year. A learner who uses `capstone-kit` on a newsletter project may not return to the kit.

**My proposed resolution:** `capstone-kit` should be the primary shipped repo because it is the most universally applicable. But the `personal-almanac` design should be the worked example included in `capstone-kit`'s documentation — the "here is what a completed capstone project looks like" reference. The almanac is the most motivating example, even if it is not the only option.

The four-session annotation from my brainstorm (session-01-intake, session-02-structure, session-03-draft, session-04-delegate) should be the annotation model for `capstone-kit`'s session prompts. The almanac lost the primary slot but its design thinking should live in the kit.

**On the CLAUDE.md point:** A1 and A2 both endorsed my observation that the capstone CLAUDE.md should be the best CLAUDE.md in the entire pack. I am restating it with specificity. The capstone CLAUDE.md should explicitly reference what the learner has learned across the track. Not as annotations — as actual rules written at the level of precision A-03 was trying to install. If A-03's template produces draft rules, A-09's CLAUDE.md should be the final versions of those rules, matured by everything the track taught. The capstone CLAUDE.md is the learner's A-03 work product at full maturity.

### LOG — A3 — A-09

What shifted: I accept `capstone-kit` as the primary repo on universality grounds. The almanac is the best single-project capstone option; the kit is the best scaffolding for unknown learners.

What the creative lens adds: the almanac should be the worked example inside the kit, not a discarded alternative. The kit without an example of what a completed project looks like is abstract. The almanac is the most compelling example.

Standing firm on: the CLAUDE.md in A-09 is the capstone of the CLAUDE.md journey, not just an instruction file. It should be written to exemplify everything A-03 taught — specific rules, testable constraints, inline reasoning. If the course team produces it as a stub, the module's own lesson is contradicted by its own deliverable.

---

## Cross-module observations

**Where the pack currently feels like exercises rather than real projects — and what the difference is.**

A1 named the structural patterns. A2 applied the keep-using-this test. The creative lens asks a different question: after completing this module, does the learner feel like someone who has built something, or someone who has completed a task?

The distinction matters because the course is trying to produce practitioners, not certificate holders. Here is where the current pack draws the line:

**Modules that currently feel like exercises:**
- A-00: the meeting notes are someone else's. The permission model is demonstrated but nothing personal is produced. A2's "make it yours" step is exactly the right fix — without it, A-00 is a demo.
- A-01: the task brief is fictional. The vague/precise comparison is educational but the output has no life outside the exercise. The README note about substituting a real brief helps but is framed as optional.
- A-02: the estimation exercise is explicitly calibration, not production. This is appropriate — A-02 is a concept module, not a tool module. Some exercises are meant to be exercises. This is one of them.
- A-05 (if `clear-or-contaminate` wins): the comparison output has no value beyond proving the lesson. Completed and discarded.

**Modules that currently feel like real projects:**
- A-03: the CLAUDE.md the learner writes is infrastructure they keep.
- A-04: the checkpoint prompt is a tool they copy into every future long session.
- A-07: the decision-guide reference card is a thing they consult.
- A-08: the brief template and evaluation template transfer to any future delegation.
- A-09: by design — the whole point is real output.

**The modules in between:**
- A-05 (if `the-research-sprint` wins): the session log starts to feel like a real work pattern. Not as sticky as A-03 or A-07, but stickier than a demo.
- A-06: the plan-then-build habit is a real skill; the plan output for one fictional document is not a real artifact. The format-spec templates from the secondary exercise have return value. The primary's return value is the habit, not the output.

**What makes the difference between exercise and real project, applied to the A-track:**

It is not personal subject matter — though that helps. It is whether the output has a use case outside the exercise context. The checkpoint prompt has a use case: every long session from A-04 onwards. The CLAUDE.md has a use case: every project after A-03. The brief template has a use case: every delegation after A-08. These outputs are general-purpose tools built during a specific exercise.

The exercise modules (A-00, A-01) produce outputs that are specific to the exercise — summaries of provided documents, comparisons of provided prompts. The way to close this gap is not to redesign the repos — A1 and A2 are right that structural soundness comes first — but to ensure that every repo explicitly names the transferable habit or template the learner takes with them. If the output is specific to the exercise, the habit is the artifact. The README should name it.

**The one thing the discussion has not resolved that the creative lens wants to flag:**

The pre-written content quality across the pack. I raised this in my brainstorm cross-track notes and it has not been addressed in the discussion. The meeting notes in `first-session-folder`, the task brief in `intent-gap-lab`, the draft in `before-and-after`, the working sections in `checkpoint-habit` — these are all described in structural terms (word count, topic, document type) but not in qualitative terms. Pre-written content that is boring to read produces sessions that feel like chores. Pre-written content with a voice, a perspective, a surprising detail — produces sessions that feel like real work.

This is not aesthetic preference. A learner who is bored by the source material will skim the permission approvals, rush the comparison, and miss the lesson. A learner who finds the source material interesting will read it, engage with the output, and notice the gap between vague and precise. The pre-written content is instructional design, not filler. It should be written last, with the same care as the annotated prompts.

**Specific request for A4:** flag in the consensus which repos have the most sensitive pre-written content requirements. A-01's `task-brief.md` (needs to produce a reliably poor vague output), A-03's `task.md` (must surface the before/after contrast), and A-04's working sections (must be interesting enough to sustain 8 turns of work) are the highest-risk content items. If the production team treats them as placeholder text, the modules will underperform regardless of structural soundness.

---

*Entry 3 closed. A4 writes the final consensus next.*

---

## Entry 4 — Agent A4 (Final Consensus)
*Critical/Systems lens — reading all three entries and all four brainstorm logs*
*Date: 2026-04-15*

---

I have read all four brainstorm logs in full and all three prior discussion entries. The discussion has produced genuine convergence on most modules. Four remain contested or unresolved. I will settle them first, then confirm the rest, then publish the final table.

My frame throughout: a repo is sound when the learner cannot complete it without engaging the module concept, when it is completable in one session (or clearly scoped across named sessions), when it produces something with return value, and when it is not an exercise in disguise. These four tests are my ruling criteria wherever the agents have not reached consensus.

---

## Contested Modules

---

### A-05: Session Hygiene — RULING

**Three positions on the table:**
- A1: `clear-or-contaminate` as primary, `when-to-clear`/`when-not-to-clear` annotation concept from A3 as required element
- A2: `weekly-work-stack` as primary (positive demonstration, habit via repetition), contamination demo as optional extension
- A3: `the-research-sprint` as primary (teaches the decision, not just the technique; annotation-driven; does not depend on contamination being visible)

**My ruling: A3's `the-research-sprint` wins. Rename to `session-hygiene-sprint` to make it easier to locate in a module context.**

Here is the decision logic.

A1's contamination-first framing depends on a demonstration that the discussion has established is structurally fragile. A4's own brainstorm named this risk most clearly, A2 named the pedagogical danger (a broken contamination demo actively misleads), and A3 connected the risk to the positive alternative. The negative demonstration cannot be the spine of the primary exercise when its reliability is genuinely in question across the range of tasks and learners this repo will serve.

A2's `weekly-work-stack` passes the keep-using-this test but does not require engagement with the module concept. A learner can complete three scoped sessions and write three log entries without ever confronting the /clear decision or understanding what they are preventing. The habit is there; the understanding is not. That is the definition of an exercise in disguise — it produces the behaviour without the reasoning.

A3's `the-research-sprint` is the only design that makes the /clear decision the explicit object of the exercise. The `when-to-clear.md` and `when-not-to-clear.md` annotation files are the module's argument made structural. The three-question structure (q-01 and q-02 unrelated; q-02 and q-03 related) creates the conditions for both the /clear case and the keep-context case to arise from the same repo, which is what the module explicitly teaches. It does not depend on contamination being visible. It depends only on the learner completing three research questions — which is entirely in their control.

A2's session log format from `weekly-work-stack` should be incorporated. A2's `when-to-clear` framing is already in A3's design. The contamination demo from `clear-or-contaminate` can live as the README's optional extension, exactly as A2 and A3 both proposed.

**What I am overriding:** My own brainstorm pick (`clear-or-contaminate`). I stand by the structural logic — the two named output files, the contamination-first pedagogy — but A2 correctly identified that a primary exercise whose teaching moment depends on the model behaving in a predictably sub-optimal way is not defensible for this audience. A2's attack on my own pick is the most precise structural critique in the discussion. I accept it.

**What I am not overriding:** The contamination demo as an optional extension. It should ship in the README as a clearly labelled fourth session: "If you want to see what contamination looks like, try this." The pedagogical value is real when it works. The extension framing removes the structural risk.

**Structural requirement for `session-hygiene-sprint`:** The `when-to-clear.md` and `when-not-to-clear.md` annotation files are non-negotiable. They are the module's primary argument. Any version of this repo that omits them — or folds them into a general README note — has not taught A-05. These files must exist as named, findable, annotated documents. The annotation must explain the reasoning, not just state the rule.

---

### A-03: CLAUDE.md — the blank-template problem — RULING

**A3's position:** `before-and-after` has a blank-template problem — learners without existing preferences stall. A3 proposes including a domain-specific worked example (the `newsletter-studio`'s `voice-notes.txt` and `dont-do-this.txt` structure, or A1's `writer-in-residence` exemplar CLAUDE.md) alongside the general template.

**Does this resolve the issue or is it a production risk?**

It resolves the issue, with one condition.

A3's diagnosis is correct. A general template with [FILL IN] markers and learners who have never thought about what they want from Claude Code is a setup for either stalling or vagueness ("be professional," "be concise"). The newsletter-studio identified the right solution: give learners something to react against, not just a blank space to fill. A domain example provides texture — specificity they can borrow and adapt rather than invent.

The condition: the worked example must be domain-neutral enough to be useful across learner types, and it must be presented as an example to read before writing, not a template to fill in. If it becomes a second fill-in template, learners will produce two generic CLAUDE.mds instead of one, and both will be vague.

A1's `writer-in-residence` exemplar CLAUDE.md — a complete, beautifully written example for a writer — is the right content model for this worked example. The production instruction is: write this CLAUDE.md at the highest quality the team can manage. It is read before the learner writes their own. It is not a template; it is a demonstration. The learner's CLAUDE.md is expected to be different, not identical. The example teaches format, specificity, and testability by showing them, not by explaining them.

**This does not add production risk if the team treats it correctly.** The risk is that the production team writes the worked example as a template with placeholders. If they do, the problem recurs. The worked example must be produced as finished prose — a real, specific, usable CLAUDE.md for a real-feeling persona. Three to five strong rules, each specific and testable, with no placeholder markers. That is the production requirement. It is not additional scope; it is a quality bar for one file.

---

### A-09: `personal-almanac` as worked example inside `capstone-kit` — RULING

**A3's position:** `capstone-kit` should be the primary shipped repo; `personal-almanac` should be the worked example inside it. The almanac is the most motivating example of what a completed capstone project looks like.

**Does this strengthen the capstone or add scope?**

It strengthens the capstone. Accept it.

A4's `capstone-kit` is correct as the primary design — empty `source-material/`, scaffolding without fake content, the learner is the content. But A3 identifies a real gap: scaffolding without an example of what a completed project looks like is abstract. Learners who are unsure whether their own project qualifies, or who are uncertain about what a well-run three-session project looks like, have nothing to orient against.

The `personal-almanac` design — four annotated session prompts, a well-written CLAUDE.md, a clear output structure — is the most compelling completed-project example in the brainstorm set. A3 is right that it is likely to be used after the course ends, which is the capstone's primary condition. As an example inside the kit (not the kit itself), it serves a different purpose: not "here is the project you must do" but "here is what one learner's completed project looked like."

The scope question is: does adding the almanac as a worked example require writing an additional repo? No. It requires writing one complete `personal-almanac/` folder with session prompts, a CLAUDE.md, an outputs structure, and a brief vision file — and placing it inside `capstone-kit/examples/`. That is approximately the same writing work as one repo's annotated prompts, which the production team is already doing for every module. The scope addition is real but bounded.

The production instruction: the almanac worked example should include a complete CLAUDE.md written at the highest quality the team can produce. A3's claim that the capstone CLAUDE.md should be the best in the pack is correct. The almanac example is where that CLAUDE.md lives.

---

### A-00: "make it yours" step — RULING

**A2's position:** add a closing step to `first-session-folder` where the learner replaces sample content with their own and runs the session again. This converts a one-time exercise into a repeatable workflow.

**A3's position:** the step should stay in `first-session-folder` but the tone matters. Not "you can replace the sample content" but a warm motivating invitation that pulls the learner toward repeat use.

**Does A2's closing step change which repo ships?** No. `first-session-folder` is still the primary repo. A2's step is a required closing instruction in the README, not a repo-design change.

**Does A3's tone argument change anything?** Yes — it changes the writing register of one specific instruction. A3 is correct that the framing difference between "you can replace the sample content" (optional note) and "now put something of yours in here" (motivating invitation) is not cosmetic. For A-00, which is explicitly about first impressions, the emotional register of the final instruction matters. The production team should write this instruction in A3's register, not A2's.

**What I am confirming:** The "make it yours" step is a required closing instruction in A-00's README — not optional, not a note, not an extension. It is the final step of the exercise. The phrasing should be warm and direct: "Now replace `meeting-1.txt` with a real set of notes from your own work — a recent meeting, a project update, anything you have. Run the session again. This time, the output is yours."

---

### A-08: evaluation gap and CLAUDE.md framing — RULING

**A2's position:** add a three-section `brief-evaluation.md` structure (scope check, evaluability check, attribution section).

**A3's position:** the CLAUDE.md should frame the learner as architect/operator, not brief-writing student.

**Do both survive or does one replace the other?**

Both survive. They are not in tension.

A2's three-section evaluation template is the structural fix for the evaluation gap — the gap that all four agents identified but none solved in the brainstorm. The scope/evaluability/attribution structure converts the evaluation step from "was the output good?" to "was the brief correct?" which is the module's actual teaching target. Section 3 (attribution) is the non-negotiable element: it forces the learner to trace evaluation failure back to brief quality rather than subagent capability. This belongs in the repo as a named file: `brief-evaluation.md` with the three-section structure in place.

A3's CLAUDE.md framing — architect/operator, not brief-writing student — is a tone instruction for one file. It is compatible with A2's structural proposal. The CLAUDE.md rule A4's brainstorm already specified ("Do not spawn any subagent until the learner has completed the decision log and written a full brief") is already an architect instruction. The production team should write the CLAUDE.md in that register throughout — not tutorial phrasing but operational phrasing. "You are the architect" not "in this exercise, you will practice."

**What I am confirming:** A4's `brief-writer` structure with A1's physical folder scaffolding (step-01-decide, step-02-brief, step-03-evaluate), A2's three-section evaluation template, A3's rejection-reasoning file (`why-not-delegate.md`), and A3's CLAUDE.md register. These are the four production requirements for A-08.

---

## Confirmed Modules

---

### A-00: Getting Started with Claude Code

**Confirmed: `first-session-folder`** (A4 brainstorm, endorsed by all three discussion agents)

The empty `outputs/` folder is the right forcing function. Meeting notes are the right content type — universal, undeniable, not domain-specific. The auto-approve risk A4 flagged must appear in both the README and the CLAUDE.md, not the README alone. A2's "make it yours" step is a required closing instruction (see ruling above). A3's annotated prompt pace requirement stands: write the prompts for a nervous learner, not a confident one.

**Secondary confirmed:** The annotated prompt structure from A1's `daily-brief` (bracketed substitutions, Copy-Personalise-Use format) should inform the `annotated-prompts.md` file in `first-session-folder`. This is a production instruction for whoever writes the prompt file, not a structural change to the repo.

---

### A-01: Mental Model Refresher

**Confirmed: `intent-gap-lab`** (A4 brainstorm, endorsed by all three discussion agents)

Files-on-disk comparison (`vague-result.md`, `precise-result.md`) is the right structural choice — durable comparison, not session-only. Part 1 of the mental model only; no tool-awareness exercises in this repo. A2's annotated side-by-side prompt (from `brief-builder`) should inform the annotation structure in the prompt files. A3's suggestion to include a README note inviting the learner to substitute a real brief is correct and should ship.

The calibration problem is a production requirement: the vague prompt must be field-tested across multiple runs to confirm reliable misfiring before the repo ships. The README should include a fallback framing for the case where both outputs look similar.

**What I am rejecting without reservation:** any design that tries to cover all three parts of the mental model in one repo. A4's brainstorm and A1's discussion entry both name this as dilution. It is. A-01's repo teaches one thing. That is correct.

---

### A-02: Cost, Tokens, and What Things Actually Cost

**Confirmed: `cost-before-after`** (A4 brainstorm, endorsed by A1 and A2; A3 conceded)

Estimation before spending is the right skill; `cost-before-after` is the right design. A2's framing note stands: the first estimate is explicitly a baseline, not a test — the README should say so. A3's detective framing should survive in the `task-heavy` exercise: the puzzle orientation keeps learners engaged during what is otherwise the most admin-heavy exercise in the pack.

The session log format (`estimates.md`, `actuals.md`) should be described in the README as a portable template — the learner copies it into any future project repo where cost tracking matters. This converts a one-time exercise into a transferable tool.

**What I am rejecting:** `the-delegation-multiplier` (A4's own Idea 3), for the sequencing reason named in the brainstorm. Any subagent call at A-02 contradicts the module's own sequencing guidance. This rejection is final.

---

### A-04: Context Awareness and Compaction

**Confirmed: `checkpoint-habit`** (A4 brainstorm, endorsed by all three discussion agents)

Habit not event. The checkpoint has value whether or not compaction fires. A2's three-constraint CLAUDE.md requirement is a production requirement, not an option: one rule stated as a standalone explicit message, one stated conversationally. The differential survival design creates the instructive checkpoint outcome. A3's "archaeology" framing for the checkpoint prompt should appear in the README: "What survived the session?" is a better prompt frame than "verify your rules persisted."

The checkpoint-prompt.md template is a transferable tool. This must be described as such in the README — the learner copies it into every future long session. It is the primary artifact the module produces.

---

### A-06: Output Engineering in Claude Code

**Confirmed: `plan-then-build` as primary** (A4 brainstorm, endorsed by A1; A2 and A3 conceded)

The "modify at least one thing in the plan" instruction is the structural innovation. It is non-negotiable: any plan step that allows reflexive approval has not taught the module. The source document must have genuine structural ambiguity that makes real plan choices available — the production team should not write a document with one obvious correct structure.

Format-control as secondary exercise is confirmed. The format-spec templates from a condensed `format-library`-style exercise are the portable artifacts. Both the plan-prompt template and at least one format-spec template should be explicitly positioned as takeaways in the README.

A3's audience-adaptation extension (one additional step inside the primary exercise, not a second session) is accepted. The CLAUDE.md standing instruction: "Once you have built the primary version, identify one thing about your audience that would change the output, and modify the format spec accordingly." This is one sentence in the CLAUDE.md, not a structural change.

---

### A-07: Tool Fluency

**Confirmed: `tool-decision-tree`** (A4 brainstorm, endorsed by all three discussion agents)

Five tasks, five tools, prediction-log before each. The prediction-log must include a "why did I choose this tool?" column, not just a match/no-match check — A3 is correct that the reasoning is the learning. The decision-guide reference card is the primary portable artifact; it should be explicit about being a reference card the learner keeps.

The CLAUDE.md should carry the professional-precision framing A3 and A2 both endorsed: "Name the tool you intend to use before every message." The framing changes the learner's relationship to the exercise from cost-anxiety management to professional competence building.

A4's `cost-race-pairs` comparison structure should survive as the final exercise within `tool-decision-tree` — one free-vs-named comparison with token logging, framed as "record the difference, however small, and explain what you see." Lower-ambition framing, per A2's note. The comparison does not need to be dramatic to be instructive.

WebSearch must be one of the five tasks. This is a module requirement, not a design preference.

---

### A-08: Agent Delegation and Briefing

**Confirmed: `brief-writer`** (A4 brainstorm, endorsed by all three discussion agents)

Three candidates (one delegatable, two not — for different reasons), decision log, brief, evaluation. Physical folder scaffolding: step-01-decide, step-02-brief, step-03-evaluate. CLAUDE.md rule preventing subagent spawn before decision log and brief are complete. A3's standalone rejection-reasoning file: `why-not-delegate.md`. A2's three-section evaluation template. A3's CLAUDE.md register (architect/operator, not tutorial).

The non-delegatable candidates must be calibrated carefully. One should fail on the evaluability question (the output would be unevaluable), one on the understanding question (requires direct judgment). Neither should be obviously non-delegatable from the first sentence — the test must be applied, not confirmed.

---

### A-09: Capstone — A Real Project

**Confirmed: `capstone-kit`** (A4 brainstorm, endorsed by all three discussion agents)

Empty `source-material/` folder. Scaffolding without fake content. CLAUDE.md template, session-plan template, technique checklist, checkpoint prompt, brief template. `personal-almanac` as worked example inside `capstone-kit/examples/` (see ruling above).

The capstone CLAUDE.md is the best CLAUDE.md in the pack. This is a production requirement. It should model everything A-03 taught: specific rules, testable constraints, no placeholders.

The technique checklist is a self-assessment mechanism, not a box-checking ritual. The README should frame it as: "At the end of each session, mark which techniques you used. At the end of the project, identify which ones you still had to remind yourself to use — those are the habits that need more practice." A2's point about gap-identification stands.

The reflection questions must include: "Which techniques are not yet automatic?" This is the most actionable question in the module.

---

## Final Consensus Table

| Module | Repo name | Folder structure (brief) | Structural requirement | Confirmed secondary | Rejected alternatives |
|--------|-----------|--------------------------|------------------------|--------------------|-----------------------|
| **A-00** | `first-session-folder` | `notes/` (3 meeting files), `outputs/` (empty), `CLAUDE.md`, `annotated-prompts.md` | Auto-approve warning in both README and CLAUDE.md; `outputs/` empty on ship | "Make it yours" closing step in README (required, not optional) | `reading-room` (sample docs, no personal return value), `film-log` (discretionary subject matter) |
| **A-01** | `intent-gap-lab` | `task-brief.md`, `prompts/vague.md`, `prompts/precise.md`, `outputs/vague-result.md`, `outputs/precise-result.md`, `CLAUDE.md` | Both outputs saved to named disk files; comparison is durable, not session-only | README note inviting substitution of learner's own brief | `recipe-for-a-good-session` (dilutes all three mental model parts); `spec-sharpener` (comparison lives in session, not on disk) |
| **A-02** | `cost-before-after` | `estimator.md`, `tasks/task-light.md`, `tasks/task-medium.md`, `tasks/task-heavy.md`, `outputs/estimates.md`, `outputs/actuals.md`, `outputs/reflection.md` | Estimation step required before each run; `estimates.md` framed as portable template in README | Detective framing in `task-heavy` exercise | `the-delegation-multiplier` (subagent at A-02 contradicts module sequencing); `cost-diary` (tracking after spending, not estimating before) |
| **A-03** | `before-and-after` | `templates/CLAUDE-template.md`, `examples/writer-in-residence-CLAUDE.md` (worked example), `task.md`, `outputs/session-a.md`, `outputs/session-b.md`, `outputs/difference-note.md` | Task and CLAUDE.md template must be co-designed so session-a and session-b produce visibly different outputs | Compliance-check prompt as closing step (rule-quality diagnostic, not compliance audit) | `newsletter-studio` (domain too narrow for infrastructure module); `writing-style-guide` (high personal value but no before/after forcing function) |
| **A-04** | `checkpoint-habit` | `work-materials/draft-section-1.md` through `4.md`, `CLAUDE.md` (differential-survival rules), `checkpoint-prompt.md`, `outputs/checkpoint-response.md`, `outputs/what-i-corrected.md` | CLAUDE.md uses three-constraint design (explicit standalone, conversational, implied); differential survival is engineered, not accidental | Archaeology framing in README: "What survived?" not "Verify your rules" | `constraint-survival-test` (engineers the event, not the habit); `context-archaeology` (same problem, more elaborate) |
| **A-05** | `session-hygiene-sprint` | `questions/q-01.txt`, `q-02.txt`, `q-03.txt`, `notes/q-01-notes.txt` through `q-03-notes.txt`, `prompts/when-to-clear.md`, `prompts/when-not-to-clear.md`, `prompts/sprint-opener.md`, `session-log.md`, `outputs/` | `when-to-clear.md` and `when-not-to-clear.md` are named files with annotation; the /clear decision must be the explicit object of the exercise, not the background | Contamination demo (`clear-or-contaminate` logic) as optional README extension | `clear-or-contaminate` as primary (contamination may not materialise; structurally fragile); `weekly-work-stack` (habit without understanding of the decision) |
| **A-06** | `plan-then-build` | `source-doc.md`, `plan-prompt.md`, `outputs/` (empty), `CLAUDE.md` ("present a plan before any action; wait for explicit approval") | Learner must modify at least one element of the plan before approving; plan is not a formality | Condensed `format-library` secondary exercise (one format-spec template as portable takeaway) | `right-tool-wrong-scope` (CLAUDE.md contradicts exercise instruction); `the-pitch-builder` (return value is task-specific, not transferable) |
| **A-07** | `tool-decision-tree` | `project/` (~15 files), `tasks/task-a.md` through `task-e.md`, `prediction-log.md`, `decision-guide.md`, `CLAUDE.md` ("name the tool before every message") | WebSearch included as one of five tools; prediction-log includes reasoning column ("why did I choose this tool?") | One cost-race-pairs comparison (free vs. named, token log) as final exercise | `codebase-explorer` (technical-audience default, not general); `the-investigator` (investigator framing survives in CLAUDE.md and README voice, not as primary repo) |
| **A-08** | `brief-writer` | `step-01-decide/` (candidates, decision-guide, `decision-log.md`), `step-02-brief/` (brief-template, `brief.md`), `step-03-evaluate/` (`brief-evaluation.md` with three sections), `CLAUDE.md` | `brief-evaluation.md` must include scope check, evaluability check, and attribution section; attribution section is non-negotiable | Standalone `why-not-delegate.md` file for rejection reasoning | `parallel-research-pack` (too expensive; parallel delegation before A-09); `brief-autopsy` (two subagent calls; high cost, unreliable brief failure) |
| **A-09** | `capstone-kit` | `CLAUDE.md` (annotated, high-quality), `session-plan.md`, `technique-checklist.md`, `checkpoint-prompt.md`, `brief-template.md`, `source-material/` (empty), `outputs/` (empty), `reflection.md`, `examples/personal-almanac/` | `source-material/` must be empty on ship; worked example in `examples/` must be complete and high-quality | `personal-almanac` as worked example in `examples/` with complete CLAUDE.md | `research-brief-capstone` (fake source content; exercise in disguise); any repo that provides fictional source material for a capstone |

---

## Pre-Written Content Risk Register

A3 asked me to flag the repos with the most sensitive pre-written content requirements. Here is the register.

**Highest risk — calibration-dependent content:**
- `intent-gap-lab` (`task-brief.md`): the vague prompt must produce a reliably off-target result. The task must contain multiple compounding ambiguities, not one resolvable one. Production requirement: test across at least 5–8 runs with the current model before shipping.
- `before-and-after` (`task.md`): the task must surface the CLAUDE.md rules in a way that makes session-a and session-b visibly different. Task and template must be co-designed. Production requirement: draft the CLAUDE.md template first, then design the task to surface each rule.
- `cost-before-after` (`task-heavy.md`): the heavy task must reliably trigger meaningfully more tool calls than the light task. Production requirement: test token counts across multiple runs before finalising the task text.

**High risk — sustain-ability content:**
- `checkpoint-habit` (work sections 1–4): the learner must work through 4 sections across 8+ turns. If the material is boring, the session is abandoned. Production requirement: write the draft sections with a real voice and a real perspective. A fictional strategy brief with no specificity will not sustain 8 turns. A fictional brief about something actually interesting will.
- `session-hygiene-sprint` (research questions and notes): q-02 and q-03 must be genuinely related; q-01 must be genuinely unrelated. The `when-not-to-clear` lesson disappears if the connection between q-02 and q-03 is not clear to a reasonable reader. Production requirement: the notes for q-02 and q-03 should share terminology and thematic ground; the notes for q-01 should be obviously different in domain.

**Moderate risk — quality-dependent content:**
- `first-session-folder` (meeting notes): must read like real meeting notes, not Lorem Ipsum. A good test: would someone actually find it useful to have these summarised?
- `capstone-kit/examples/personal-almanac/` (the almanac CLAUDE.md): this is the exemplar CLAUDE.md for the whole track. Placeholder quality produces the wrong lesson. Production requirement: the course team writes this CLAUDE.md collaboratively as a first-class deliverable.

---

### LOG — A4 — Final

The hardest decisions, in honest order:

**1. A-05.** My own brainstorm pick (`clear-or-contaminate`) was the one I had to override most completely. The contamination calibration problem is real, and A2's structural attack on it — that a primary exercise whose teaching moment depends on model behaviour it cannot guarantee is not defensible — is correct. The hardest part was accepting that my own critical flag was already the argument against my own pick. I wrote the flag in the brainstorm and did not follow it to its conclusion. A2 followed it for me.

The `weekly-work-stack` temptation was also real. It is genuinely the most pragmatist answer. But the test I apply — can a learner complete this without engaging the module concept? — disqualifies it. You can log three sessions without once thinking about the /clear decision. That is the test failing.

`the-research-sprint` passes the test. The `when-to-clear.md` and `when-not-to-clear.md` files force the decision into the learner's hands. The exercise is not completable without reading them. I land on A3's pick not because A3 argued hardest but because it passes the structural test the other two options fail.

**2. A-03's blank-template problem.** A3's critique is correct. A general template with [FILL IN] markers and learners who have never articulated preferences is a real failure mode. The worked example is the right solution. My hesitation was scope — does this add a second repo? No. It adds one high-quality file to an existing repo. That is the right scope for the right problem. A3's persistence on this point throughout the discussion moved me from "useful enhancement" to "production requirement."

**3. A-09's personal-almanac question.** A3's case for the almanac as worked example inside the kit is genuinely compelling and I accepted it. My earlier brainstorm rejected all repos that provide fake source content, and I briefly considered whether the almanac example creates fake content pressure. It does not — it models what one real project looked like, not what the learner's project should be. The distinction holds.

**4. A-08's evaluation template.** A2's three-section structure is the design insight that should have been in every agent's brainstorm and was not. The attribution section — tracing evaluation failure back to brief quality, not subagent capability — is the module's core principle made structural. I am endorsing it fully and flagging it as the single most important design contribution the discussion produced.

**What I did not override:** A1's advocacy for the annotated prompt structure and prompt pacing across A-00. A3's claim that pre-written content is instructional design, not filler. A2's keep-using-this test as a production lens. These are all correct and survive into the consensus.

**One note on the discussion as a whole:** A3's A-09 argument was the weakest in my reading — the almanac failed the universality test A4 named in the brainstorm ("capstone-kit is more universal") — but A3 found the right resolution without prompting. Using the almanac as a worked example rather than the primary repo is the creative solution that preserves both the universality of the kit and the motivational pull of the almanac. That move is worth noting: it is the one place in this discussion where the creative lens produced a synthesis neither the structural nor pragmatist lenses had reached.

**What the production team should prioritise before the recording week:**
1. The A-05 `when-to-clear.md` and `when-not-to-clear.md` files — these are the hardest to write well and the most load-bearing in the pack
2. The A-03 worked example CLAUDE.md (`writer-in-residence` model) — quality here determines quality of every learner's downstream CLAUDE.md
3. The A-01 `task-brief.md` calibration — test across multiple model runs before shipping; if the vague prompt does not reliably misfire, rebuild the task
4. The A-09 `capstone-kit` CLAUDE.md — the best CLAUDE.md in the pack; do not stub it

---

*Entry 4 closed. Final consensus published.*
