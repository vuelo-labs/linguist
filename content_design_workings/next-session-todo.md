# Next Session — To Do
*Prepared: 2026-04-16*
*Pick this up after /clear*

---

## Status check before starting

**The v2 Cyborg agents did produce output — the files are not empty.** Despite hitting usage limits, the three Opus agents wrote to disk:

- `v2-cyborg/01-v1-audit.md` — 231 lines, exists
- `v2-cyborg/02-philosophy-and-product.md` — 175 lines, exists
- `v2-cyborg/03-architecture.md` — 438 lines, exists

Read all three before deciding whether they need to be relaunched or just reviewed. The most likely state: partial or truncated output that covers the main points but may be missing conclusions or recommendations sections. Judge depth before relaunching.

---

## Priority 1 — Review v2 Cyborg agent output

**Done when:** You've read all three files and made a call: complete, needs expansion, or needs full relaunch.

### What each file was supposed to cover

**`01-v1-audit.md`** — Honest post-mortem of v1:
- What was built (architecture, teaching method, progress system, platform scope)
- What worked (Copy → Personalise → Use, B-track sequencing B-01 to B-06, the quiz onboarding)
- What broke or never landed (Human Mode absent, specificity trap, monitoring load accumulation, commercial/targeting ambiguity, X-track never built, "never delegate understanding" buried in A-08)
- What v1 proved that v2 can build on

**`02-philosophy-and-product.md`** — The Cyborg thesis:
- Why "Cyborg" as the name — where the idea came from, what it signals
- Core thesis: "When thinking, use AI to expand. When ready to implement, switch to precision. The transition is the skill."
- Target audience: more defined than v1's "everyone" — who specifically
- Teaching philosophy: scenario-first, not instruction-first; editing as the taught skill
- Commercial architecture: what the product looks like, how it makes money, how it differs from v1

**`03-architecture.md`** — What v2 actually looks like:
- Micro-lesson anatomy (how a single lesson is structured)
- Profile system (how it routes learners differently based on what they already do)
- Curriculum spine (the module sequence and what each module teaches)
- Bullshit detection as an explicit module (name, placement, what it teaches)
- Automation layer (what the advanced section covers)
- First 5 lessons in enough detail to begin building them

### If relaunching is needed

Each agent needs the full course context. Key files to provide:
- `content_design_workings/mode-review/agent-1-cognitive-load.md`
- `content_design_workings/mode-review/agent-2-knowledge-path.md`
- `content_design_workings/mode-review/agent-3-mode-integration.md`
- `content_design_workings/journal.md` (entries 1-6 for v1 history)
- The existing partial output file they're completing

---

## Priority 2 — Push uncommitted work to origin

**Done when:** `git push` succeeds and remote is up to date.

Current local commits not yet pushed include the mode-review agent files, the journal, and the v2-cyborg outputs. Verify with `git status` and `git log --oneline origin/main..HEAD` before pushing.

---

## Priority 3 — v1 fixes from the mode review agents

These are specific, bounded changes to existing HTML modules. Work through them in order — each is self-contained.

### From Agent 1 (cognitive load)

**Specificity trap fix — surface "never delegate understanding" earlier**
- Current location: A-08, buried in the delegation/cost section
- Move to: B-09 or B-10, reframed as a mode statement not a delegation rule
- Draft language provided in agent-1-cognitive-load.md (Recommendation 3): "There are two modes of using AI. Machine Mode is for tasks you understand well enough to define clearly. Human Mode is for tasks you need to think through first."
- Done when: the principle appears in the B-track in its own named paragraph

**Monitoring load consolidation**
- Problem: four separate monitoring routines (B-07, E-04, E-06, A-04) are each presented as ongoing obligations; together they create permanent alert mode
- Fix: reframe as a tiered system — default (one question after every response), diagnostic (B-07 checklist when something feels off), advanced (compaction/spiral signals for long technical sessions)
- Done when: B-07's "keep this checklist, use it for every module" framing is changed to "reach for this when something feels off"

### From Agent 2 (knowledge path)

**Verb gap fix — B-02 through B-10**
- Problem: B-02 introduces four safe verbs and explicitly promises "you will learn the full set of safe verbs in B-05" — but B-05 never delivers this. The promise isn't fulfilled until E-01, eight modules later. Learners use unvetted verbs (improve, help me with, make better) for the entire beginner track with no warning.
- Fix: either fulfil the promise in B-05 (add the risky verb list as a brief reference), or remove the forward reference from B-02 and acknowledge in E-01 that this is new territory
- Done when: the promise in B-02 matches what B-05 actually teaches

**B→E→A connective tissue**
- B-to-E: add a paragraph at B-10 naming what the learner has been building as Machine Mode — not as a new concept but as a retrospective label. Draft language in agent-3-mode-integration.md (Section 4, B-10 recommendation).
- E-to-A: add a sentence at the start of A-00 framing why a capable E-track completer would want to move to a terminal tool — "Claude Code can act in the world; it doesn't just produce text you then act on yourself." Currently the transition is environmental (new tool, same principles) when it needs to be motivational.
- Done when: B-10 names Machine Mode, A-00 answers the motivational "why bother" question

### From Agent 3 (mode integration)

**New module between B-09 and B-10: "Think First, Then Instruct"**
- This is the highest-leverage single addition to v1. B-09 introduces the Human Mode / Machine Mode frame; this module teaches Human Mode as a skill (not just names it).
- Exercise structure: (1) start a conversation with a genuinely open question about something real — no template, no stopping condition, no verb constraint; (2) at the end, write a Machine Mode Opening Seed based on what the exploration clarified
- Module objective: after this, the learner can identify when they are in thinking mode vs execution mode and has used AI productively in both
- Done when: the module exists as HTML, follows the Copy → Personalise → Use pattern where possible, and is linked from B-09's "Next" and into B-10's "Prev"

**B-09 rewrite — make the mode frame central**
- Currently: "Machine Mode" appears once as a template label; Human Mode gets one sentence in the troubleshooting section
- Required: expand the B-09 introduction to make the frame its central concept. Full draft language available in agent-3-mode-integration.md (Section 4, Primary introduction point). The 4-paragraph "Since B-01..." block is ready to insert — approximately 250 words.
- Done when: B-09 introduces both modes by name, explains the difference, and positions the persistent instruction template as a deliberate mode choice

---

## Priority 4 — Journal Entry 7

**Done when:** Entry 7 is written in `content_design_workings/journal.md` following the established format.

Entry 7 should cover the Cyborg concept decisions — specifically:
- What happened: launched three Opus agents to write v2 documents; what the files contain
- What was surprising: [fill in after reading the v2 files]
- What changed: the project has a name (Cyborg) and a thesis it didn't have before
- The moment: something about the point where v1 stopped being the project and v2 became the project

Write this after reading the v2 agent outputs so the "what was surprising" section reflects what was actually in them.

---

## Priority 5 — Template packs: choose one and start scaffolding

**Done when:** One pack is chosen, a repo directory structure exists, and at least one template file has real content (not just a placeholder).

Three final briefs exist in `content_design_workings/`:
- Check the template pack brainstorm files for which pack the consensus agents recommended starting with
- The choice criteria from the swarm: pedagogical safety (no contaminated-run risk), direct connection to a B/E/A-track module, low setup friction for learners
- Scaffolding means: create the repo directory, write the README (if the brief calls for one), and draft the first actual template file with proper Copy → Personalise → Use structure

---

## Reference: key files for this session

- `/Users/liam/Projects/vuelo-labs/linguist/content_design_workings/v2-cyborg/01-v1-audit.md`
- `/Users/liam/Projects/vuelo-labs/linguist/content_design_workings/v2-cyborg/02-philosophy-and-product.md`
- `/Users/liam/Projects/vuelo-labs/linguist/content_design_workings/v2-cyborg/03-architecture.md`
- `/Users/liam/Projects/vuelo-labs/linguist/content_design_workings/mode-review/agent-1-cognitive-load.md`
- `/Users/liam/Projects/vuelo-labs/linguist/content_design_workings/mode-review/agent-2-knowledge-path.md`
- `/Users/liam/Projects/vuelo-labs/linguist/content_design_workings/mode-review/agent-3-mode-integration.md`
- `/Users/liam/Projects/vuelo-labs/linguist/content_design_workings/journal.md`
