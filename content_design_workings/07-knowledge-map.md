# 07 — Course Knowledge Map

## Purpose

This document is a living reference for anyone adding, editing, or resequencing Linguist course content. It captures the seven load-bearing concepts the course depends on, the full concept-dependency chain for every module across all three tracks, sequencing decisions that have already been resolved, and open questions that remain unresolved.

Read this document before adding any new module, moving an existing module, or introducing a new concept into an existing module. The stacking tables and dependency graph make it possible to verify that no module assumes knowledge the learner has not yet been given.

---

## The 7 load-bearing concepts

These are the concepts the course cannot function without. Every module either introduces one, reinforces one, or assumes one. They are listed in dependency order — each concept builds on or extends the ones above it.

| # | Concept | Introduced | First depended on by |
|---|---------|-----------|---------------------|
| 1 | Stopping condition | B-06 | Every module from B-06 onward |
| 2 | Copy-Personalise-Use (CPU) | B-02 | Every exercise across all three tracks |
| 3 | Opening Seed (Role, Task, Context, Done) | B-10 | All E-track work; A-track entry |
| 4 | New conversation as reset | B-01 | B-08 recovery; E-06 re-seeding; A-04 session hygiene |
| 5 | Verb choice / safe verbs | B-02 (partial); E-01 (formalised) | Every message template from E-01 onward |
| 6 | Load-bearing context / load-bearing test | B-10 (context slot); E-03 (formalised) | E-04 through E-07; throughout A-track |
| 7 | Compaction | A-01 (introduced); A-05 (detailed) | A-03, A-04, A-05, A-06 practices |

### 1. Stopping condition

Introduced formally in B-06. A stopping condition is an explicit constraint that tells the model when to stop or how much to produce — word counts, item counts, format requirements, exclusions, or combinations of these. Before B-06, the learner gets results that are vaguely right in substance but uncontrolled in shape. After B-06, every template and exercise includes at least one stopping condition. This concept is depended on by every subsequent module in the course.

### 2. Copy-Personalise-Use (CPU)

Introduced in B-02 and used in every exercise across all three tracks. CPU is the pedagogical backbone of Linguist. The learner is never asked to write a prompt from scratch — they copy a template, personalise the bracketed placeholders for their own context, and use it. This pattern lowers the barrier to entry and teaches prompt editing as a transferable skill. Without CPU, the exercises do not work.

### 3. Opening Seed (Role, Task, Context, Done)

Introduced in B-10 as the capstone of the B-track. The Opening Seed is a four-slot scaffold: Role (who the AI is acting as), Task (what it should do), Context (load-bearing facts), and Done (stopping conditions and success criteria). This structure is the scaffold for all E-track work and the entry point into A-track. It is the first time the learner assembles a complete, structured prompt rather than a single-line message.

### 4. New conversation as reset

Introduced in B-01 as one of the earliest concepts — the AI has no memory across conversations. This seemingly simple idea underpins three later systems: recovery (B-08, where starting a new conversation is one of three recovery tools), re-seeding (E-06, where the learner learns when and how to start fresh with carried-forward context), and session hygiene (A-04, where one-task-per-session becomes a discipline).

### 5. Verb choice / safe verbs

Partially introduced in B-02 with four starter verbs (summarise, explain, draft, list) and formalised in E-01 with the full safe-verb / risky-verb distinction. The first word of every message template is a verb. Between B-02 and E-01, learners use verbs without reflecting on them — this is an intentional simplification that the E-track resolves, but the gap (8 modules) is noted as an open sequencing decision below.

### 6. Load-bearing context / load-bearing test

The concept of load-bearing context is seeded in B-10's context slot of the Opening Seed, then formalised in E-03 with a five-type taxonomy and a context audit method. The load-bearing test asks: "If I removed this piece of context, would the output change in a way that matters?" This concept is used from E-04 through E-07 and throughout the A-track, particularly in CLAUDE.md authoring (A-03) and delegation briefs (A-08).

### 7. Compaction

Introduced in A-01 as part of the three-part mental model (the context window is finite and degrades via compaction) and detailed in A-05. Compaction is the process by which Claude Code summarises earlier conversation turns to free up context space. Understanding what survives compaction and what is lost provides the rationale for session hygiene (A-04), writing style choices (A-05), manual checkpointing (A-05), and plan-before-execute discipline (A-06).

---

## Concept dependency graph

The graph below shows how concepts unlock each other, from zero knowledge (B-01) through to agent delegation (A-08). The two trunk concepts — **Stopping condition** and **CPU** — are marked. Everything branches from them.

```
B-01: Sending a message; new conversation as reset; platform choice
├── B-02: CPU pattern [TRUNK]; bracket placeholders; 4 starter verbs; stopping condition preview
│   ├── B-03: Platform UI navigation (depends on B-01 account)
│   ├── B-04: Input mirroring; comparison exercises; role context
│   │   └── B-05: One-task-per-message; multi-step decomposition
│   │       └── B-06: Stopping condition (formal) [TRUNK]
│   │           └── B-07: Output review checklist; hallucination risk; response-as-draft
│   │               └── B-08: Recovery tools (correction, restate, new conversation)
│   │                   └── B-09: Persistent instructions; Machine Mode defaults
│   │                       └── B-10: Opening Seed (Role, Task, Context, Done); load-bearing facts
│   │                           │
│   │                           ├─── E-track ──────────────────────────────────────
│   │                           │
│   │                           ├── E-01: Verb ceiling; safe vs risky verbs
│   │                           │   └── E-02: Constraints (formal); 5 constraint types
│   │                           │       └── E-03: Load-bearing test; context audit
│   │                           │           └── E-04: Correction spiral signals; restate template
│   │                           │               └── E-05: Two-message pattern (plan → execute)
│   │                           │                   └── E-06: Re-seed concept; conversation lifespan
│   │                           │                       └── E-07: Personal reference card (synthesis)
│   │                           │
│   │                           ├─── A-track ──────────────────────────────────────
│   │                           │
│   │                           └── A-00: Terminal; Claude Code; tool calls; permission model
│   │                               └── A-01: Mental model (text not intent; compaction; tools)
│   │                                   └── A-02: Tokens; billing; cost drivers
│   │                                       ├── A-03: CLAUDE.md (project + user level)
│   │                                       ├── A-04: Session scoping; /clear
│   │                                       │   └── A-05: Compaction detailed; context rot; checkpointing
│   │                                       │       └── A-06: Plan-before-execute; /plan; verbosity
│   │                                       │           └── A-07: Tool hierarchy (Read → Agent); cost order
│   │                                       │               └── A-08: Delegation decision; 5-part brief
│   │                                       │                   └── A-09: Integration and reflection
│   │                                       └── (A-03 also feeds A-04 via working directory concept)
```

**Two trunk concepts:**

- **CPU (B-02)** → every exercise in the course uses Copy-Personalise-Use. If CPU breaks, the entire exercise layer breaks.
- **Stopping condition (B-06)** → every template from B-06 onward includes at least one stopping condition. Without it, output quality is uncontrolled and the E-track refinements have nothing to constrain against.

**Cross-track dependency flow:**

- B-10 (Opening Seed) → unlocks both E-01 and A-00
- E-03 (load-bearing context) → assumed by A-01, A-02, A-03, A-08  *(unchanged — both A-01 and A-02 use context concepts)*
- E-05 (plan-before-execute) → assumed by A-06, A-08
- E-06 (re-seed) → assumed by A-04 (session scoping)
- B-09 (persistent instructions) → assumed by A-03 (CLAUDE.md)

---

## B-track stacking table

The B-track comprises 10 modules taking the learner from zero knowledge to the Opening Seed. All exercises use web or desktop chat platforms (Claude, ChatGPT, Gemini). Each module introduces one or two new concepts, assumes specific prior knowledge, and reinforces earlier concepts through use.

| Module | Introduces | Assumes | Reinforces |
|--------|-----------|---------|------------|
| B-01 | Sending a message; stateless AI ("no memory across conversations"); platform choice (Claude, ChatGPT, Gemini); CPU preview; data policy awareness | Nothing — zero-knowledge start | — |
| B-02 | CPU pattern; bracket placeholders; 4 starter verbs (summarise, explain, draft, list); stopping condition preview | B-01: can send a message | B-01: sending |
| B-03 | Platform UI navigation; sidebar, new chat, projects/custom instructions/gems; forward ref to B-09 | B-01: has an account | B-01: platform choice |
| B-04 | Input mirroring (detail in = detail out); comparison exercise pattern; role context; new conversation to isolate variables | B-02: CPU; B-01: sending | B-02: brackets; B-01: new conversations |
| B-05 | One-task-per-message; multi-step decomposition; building on prior responses within a conversation | B-02: CPU; B-04: input shapes output | B-02: verbs; B-04: detail level |
| B-06 | Stopping condition (formal introduction); types (word count, item count, format, exclusion, combination); front-loading | B-02: verbs; B-05: one-task messages | B-04: input shapes output; B-05: single-purpose |
| B-07 | Output review checklist (4 questions); hallucination/outdated info risk; response-as-draft mindset; targeted change requests | B-06: stopping conditions; B-02: CPU | B-06; B-04: specificity; B-02: personalisation |
| B-08 | Three recovery tools: correction, restate, new conversation; correction spiral; restate template | B-07: output review; B-06: stopping conditions; B-02: role context | B-07; B-06; B-04; B-01: new conversations |
| B-09 | Persistent instructions; Machine Mode defaults; platform setup (Projects, Custom Instructions, Gems) | B-03: platform orientation; B-02: CPU | B-03; B-08: why new conversations matter; B-06 |
| B-10 | Opening Seed (Role, Task, Context, Done); load-bearing facts concept; blank template card | B-09: persistent instructions; B-07: checklist; B-06: stopping conditions; B-05; B-02: CPU | Everything B-02 through B-09 |

---

## E-track stacking table

The E-track comprises 7 modules. It assumes full B-track completion and refines message craft from good to precise. All exercises still use web or desktop chat platforms. The track ends with a personal reference card that synthesises everything the learner has built.

| Module | Introduces | Assumes | Reinforces |
|--------|-----------|---------|------------|
| E-01 | Verb ceiling; safe vs risky verbs (full 7-verb list); risky verbs (improve, enhance, optimise etc.); verb reference doc | B-10: Opening Seed; B-06: stopping conditions; B-02: 4 starter verbs | B-10; B-06; B-02 verbs (now expanded) |
| E-02 | Constraints as formal concept; 5 constraint types; "Don't..." slot | E-01: verb choice; B-10: Opening Seed; B-08: recovery; B-06 | E-01; B-10; B-08; B-06 |
| E-03 | Load-bearing test; 5 types of load-bearing context; context audit method | E-02: constraints; E-01: verbs; B-10: Opening Seed context slot; B-07 | E-02; E-01; B-10; B-07; B-04 |
| E-04 | Correction spiral (3 signals); restate starter template; combining all message components | E-03: load-bearing test; E-02: constraints; E-01: verbs; B-10; B-08: recovery basics | E-03; E-02; E-01; B-10; B-08 |
| E-05 | Two-message pattern (plan then execute); plan review; checkpoint concept | E-04: restate; E-03: context; E-01: verbs; B-10 | E-04; E-03; B-05: one thing at a time |
| E-06 | Re-seed concept; conversation lifespan; 5 re-seed signals; re-seed template (3 parts: role/context, carry-forward, new task) | E-05: planning; E-03: load-bearing test; E-02: constraints; E-01: verbs; B-10; B-08 | All E-01 through E-05; B-10; B-08 |
| E-07 | Personal reference card (5 sections); synthesis of all prior concepts; self-assessment | All prior modules explicitly | Every major concept |

---

## A-track stacking table

The A-track comprises 10 modules. It assumes full B-track and E-track completion. The A-track covers Claude Code — a terminal-based, API-billed, file-aware mode of working. This is a fundamentally different mode from chat: the learner is delegating tasks to a tool that can read, write, and execute, not conversing with a chatbot. The concepts shift from message craft to session management, cost awareness, and delegation discipline.

| Module | Introduces | Assumes (B/E) | Assumes (A-track) | Reinforces |
|--------|-----------|---------------|-------------------|------------|
| A-00 | Terminal; working directory; Claude Code install; tool calls; permission model | Opening Seed (B-10); CPU (B-02); all B/E prompting principles | — | Opening Seed; E-track constraints/verbs/context |
| A-01 | Three-part mental model: (1) executes text not intent; (2) context window finite/degrades via compaction; (3) tools are action layer | Verb choice (E-01); constraints (E-02); context as fuel (E-03) | A-00/basics | E-01; E-02; E-03 |
| A-02 | Tokens; billing; model tiers; 4 cost drivers; cost benchmarks; mental budget | Context is fuel (E-03) | A-00: API-metered sessions; A-01: mental model | E-03 |
| A-03 | CLAUDE.md (project-level + user-level ~/.claude/CLAUDE.md); what belongs vs doesn't; iterating over time | Persistent instructions (B-09) | A-00: working directory; A-01: mental model | B-09; B-10 |
| A-04 | Context Awareness and Compaction (what fits in context, summarisation, /compact) | Re-seed (E-06); B-08 recovery; B-05 one-thing-at-a-time; constraints (E-02) | A-01: compaction introduced; A-02: cost awareness | E-06; B-08; B-05; E-02 |
| A-05 | Session Hygiene; starting/ending sessions well; what to carry forward | — | A-01: compaction introduced in mental model; A-04: context awareness | A-01 Part 2; A-04 |
| A-06 | Plan-before-execute in Claude Code; /plan command; output format control; verbosity mirroring | Get the Plan First (E-05) | A-05: wrong approach costs tokens via rework | E-05; E-02 constraints |
| A-07 | Tool hierarchy: Read, Glob, Grep, Bash, WebSearch, Agent; cost order (Read/Glob/Grep → Bash/WebSearch → Agent); naming tool explicitly | — | A-01 Part 3: tools are the action layer; A-02: cost awareness; A-06: plan-before-execute | A-01 Part 3; A-02 |
| A-08 | Delegation decision (3-question test); 5-part brief (Goal, Context, Scope, Output format, Length); "never delegate understanding" | E-05: plan-before-execute | A-02: cost warning; A-06: plan-before-execute; A-07: Agent at top of hierarchy | A-02; A-06; A-07 |
| A-09 | Nothing new — integration and reflection across all A-track techniques | — | All A-00 through A-08 | Full A-track |

---

## Late-track prerequisite flags

The following cross-track dependencies are the most likely to be violated when content is added or moved. They are called out here as flags for content authors.

| Downstream module | Assumes from earlier track | Risk if missed |
|-------------------|--------------------------|----------------|
| E-01 | B-10 Opening Seed (all four slots) | Learner cannot structure the verb-choice exercises without the Role/Task/Context/Done scaffold |
| E-03 | B-10 context slot specifically | Load-bearing test operates on the Context slot; without it the concept is abstract |
| E-06 | B-08 recovery + B-01 new conversation as reset | Re-seed is a structured version of "start a new conversation with carried-forward context" — needs both concepts |
| A-00 | B-10 + all E-track prompting principles | A-00 assumes the learner can already write a full Opening Seed and apply constraints/verbs/context |
| A-03 | B-09 persistent instructions | CLAUDE.md is the Claude Code equivalent of Projects/Custom Instructions/Gems |
| A-04 | E-06 re-seed + E-02 constraints | Session scoping is re-seed applied to a terminal environment with cost pressure |
| A-06 | E-05 plan-before-execute | /plan command is the Claude Code implementation of the two-message pattern |
| A-08 | E-05 plan-before-execute + A-07 tool hierarchy | Delegation requires both the planning discipline and the tool cost model |

---

## Fixed violations (record)

The following four sequencing violations were found during the course audit and have been resolved.

1. **[B-05] Stopping condition bracket appeared before B-06 taught the concept.** The template in B-05 had a bracket labelled `[Stopping condition]` two modules before B-06 formally introduces stopping conditions. **Fix:** renamed to `[how much you want back — e.g. "Keep it under 100 words" or "Give me 3 options"]`. B-04 was clean — both its mentions already had `(B-06 covers this)` deferral notes.

2. **[A-01] /clear command used before A-05 teaches it.** A-01 (Mental Model) told learners to "use /clear to reset context" with no explanation of what it does. **Fix:** a deferral note was added: "(A-05 covers this in full.)"  *(Note: after A-04/A-05 swap, session hygiene is now A-05.)*

3. **[A-06] Wrong module attribution.** A-06 credited "treating the first response as a draft" to E-05. That habit was introduced in B-07 (output review checklist / response-as-draft mindset). E-05 covers plan-before-execute, which is a different concept. **Fix:** attribution changed to B-07. The separate E-05 mention in A-06 (correctly describing plan-before-execute) was left untouched.

4. **[A-02 / A-07] WebSearch dangling reference.** A-02's CPU example named `WebSearch` as a tool, but A-07's tool hierarchy (Read, Glob, Grep, Bash, Agent) did not include it. **Fix:** WebSearch added to A-07's tool hierarchy with a one-sentence description and cost tier (same bracket as Bash, cheaper than Agent). Cost order updated to: `Read / Glob / Grep → Bash / WebSearch → Agent`.

---

## Open sequencing decisions

The following nine decisions are unresolved. Each documents a tension in the current module order. No recommendation is made — the decision is recorded here so it can be made deliberately.

### 1. B-03 placement

B-03 (platform UI navigation) breaks the hands-on momentum between B-02 (CPU pattern) and B-04 (input mirroring). The learner goes from writing their first prompt to a tour of sidebar menus, then back to prompt craft. **Options:** (a) move B-03 to after B-09 as a reference companion to the persistent-instructions module, or (b) keep it as module 3 but mark it as optional/skippable for learners who already know their platform.

### 2. B-09 before or after B-08

Currently recovery (B-08) comes before prevention (B-09 persistent instructions). **Argument for current order:** the learner appreciates prevention more after experiencing the need for recovery. **Argument against:** learners do B-07 and B-08 exercises without the benefit of standing instructions, making the exercises harder than they need to be and potentially reinforcing bad habits.

### 3. Verb gap B-05 to E-01

There are 8 modules (B-05 through B-10, then the track transition) where learners use verbs without reflecting on verb choice. The 4 starter verbs from B-02 are sufficient for B-track work, but the gap means verb choice is not reinforced before E-01 formalises it. **Option:** add a brief reinforcement moment in B-07 or B-08 — e.g., "Notice which verb you chose and why" — without introducing the full safe/risky distinction.

### 4. E-04 vs B-08 distinction

Both E-04 and B-08 cover restate and recovery. The intended distinction is: B-08 teaches what your options are (correction, restate, new conversation); E-04 teaches how to recognise the moment to switch strategies (the 3 correction-spiral signals). In practice, the execution of the two modules is too similar. **Option:** sharpen the framing so B-08 is clearly "here are three tools" and E-04 is clearly "here is the diagnostic skill for choosing between them."

### 5. B to E readiness bridge

There is no mechanism to verify that learners have completed B-08 and B-09 before entering E-01. The "already done this" button on Substack enables learners to skip modules, which means the two most load-bearing late-B modules (recovery and persistent instructions) can be bypassed. **Options:** (a) add a readiness check at E-01 entry, (b) add a note at E-01 listing what it assumes, or (c) accept the risk.

### 6. A-01 vs A-02 order

The mental model (A-01) now comes before the cost model (A-02). **Resolved:** A-01 and A-02 were swapped so that A-01 introduces the three-part framework (text not intent; context window finite/degrades; tools are action layer) and A-02 grounds the cost model in that framework. *(This decision was implemented in the HTML; the knowledge map has been updated to match.)*

### 7. A-04 vs A-05 order

Context Awareness and Compaction (A-04) is taught before Session Hygiene is fully elaborated (A-05). A-04 introduces compaction and context management; A-05 covers session-level hygiene practices. A-01 introduces compaction as a concept in the mental model. **Resolved:** A-04 teaches context awareness first; A-05 builds session habits on top of that foundation. The current order is intentional.

### 8. E-07 as A-track entry

E-07 (personal reference card) is the natural bridge document into the A-track — it synthesises every prompting concept the learner has built and could serve as the reference they carry into Claude Code work. However, A-00 never points back to E-07 or suggests the learner bring their reference card. **Option:** add a line in A-00 that says "Have your E-07 reference card open — you will use it."

### 9. A-01 delegation benchmarks

The figure "$5-20 for agent delegation" appears in A-01, seven modules before A-08 provides the delegation guardrails (the 3-question test, the 5-part brief, "never delegate understanding"). A deferral note is present, but the dollar figure carries psychological weight: learners may either avoid delegation entirely or attempt it without the framework. **Options:** (a) remove the figure from A-01 and introduce it in A-08 where the framework exists, (b) keep it but add stronger framing ("this number will make more sense after A-08"), or (c) accept that the early scare serves a purpose.

---

## How to use this document when adding new content

### When adding a new module

1. Decide which track and position the module will occupy.
2. Fill in the stacking table row: what does the module **introduce**, what does it **assume**, what does it **reinforce**?
3. Check every module that comes *after* the new module in the same track. Ask: "Does anything in a later module now assume something I haven't introduced yet?"
4. Check the **Late-track prerequisite flags** table. If the new module sits between a flag pair, verify the dependency chain is intact.
5. Check cross-track dependencies. If the new module introduces a concept used in another track, add it to the prerequisite flags table.
6. Add the module to the **concept dependency graph**.

### When moving a module

1. Remove the module from its current position in the stacking table and dependency graph.
2. Re-insert it at the new position.
3. For every module that previously came *after* the moved module: verify that what they assume is still introduced before them.
4. For every module that previously came *before* the moved module: verify that what they reinforce still exists in the new sequence before that reinforcement point.
5. Check: "Did I create a new forward reference that now needs a deferral note?"

### When adding a new concept to an existing module

1. Add the concept to the module's **Introduces** cell in the stacking table.
2. Check: does any *earlier* module already use this concept informally? If so, that earlier module now needs a deferral note or the concept needs to move to the earlier module.
3. Check: does any *later* module now assume this concept? If so, add it to that module's **Assumes** cell.
4. If the concept is cross-track (used in a different track), add it to the **Late-track prerequisite flags** table.

### The key question

Every content change must answer:

> "What does this assume? What does this introduce? Does anything in a later module now assume something I haven't introduced yet?"
