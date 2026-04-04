# Linguist Course — Status & Priority

_Last updated: 2026-04-02_

---

## What's been built

### Infrastructure
- Deployed on Cloudflare Pages at `linguist-5u9.pages.dev` (custom domain `linguist.vuelolabs.com` pending DNS propagation)
- All routes handled via `_redirects` — `/course/*` → `course/index.html`
- Cloudflare Functions for `/functions/analyse` and `/functions/subscribe` (migrated from Netlify)

### Course shell (`course/index.html`)
- **Orientation screen** (default landing): Human/Machine balance framing, waterfall→cycle model, terminology note, Glossary link
- **Choose platform screen**: picks Claude / ChatGPT / Gemini / Tines / Claude Code, model selection (auto-selects recommended), Human/Machine mode switches all content
- **Setup screen**: platform + model-specific setup instructions, MCP callout
- **Exercises screen**: 7 exercises, Ex 1 + Ex 2 unlocked, Ex 3–7 locked
- **Glossary modal**: 12 terms, full Human/Machine toggle (descriptive vs precise definitions), accessible from nav

### Exercise 1 (`course/exercise-1.html`) — Your Two Projects
- Goal card: learning goal, outcome, watch-for
- Platform picker (5 platforms)
- Concept section (platform-specific, mode-aware)
- 3 bad prompting examples with diagnosis
- Part 1: Human Mode project — where to create it + self-describing prompt (switches with mode)
- Part 2: Machine Mode project — same structure
- Tines caveat (one global instruction set, workaround provided)
- Evaluation step: 4 questions to assess both outputs before moving on
- Links to Exercise 2

### Exercise 2 (`course/exercise-2.html`) — The Opening Seed
- Goal card: learning goal, outcome, watch-for
- Platform picker (5 platforms)
- Concept: four elements of an opening seed (Role → Task → Context → Done criteria)
- Task callout: "use something real from your work this week"
- Part 1: Human Mode project opening — platform-specific where + mode-aware self-describing prompt
- Part 2: Machine Mode project opening — same task, different opening
- Tines note: how to simulate two modes with one instruction set
- Convergence section: 3 evaluation questions + explicit "from Exercise 3, one primary project" transition
- Links back to Exercise 1

---

## Content map (agreed)

| Chapter | # | Title | Status |
|---------|---|-------|--------|
| 1 — Foundation | 1 | Your Two Projects | ✅ Built |
| 1 — Foundation | 2 | The Opening Seed | ✅ Built |
| 2 — Build | 3 | Specificity as Scope Control | 🔲 Not built |
| 2 — Build | 4 | Context is Fuel | 🔲 Not built |
| 3 — Refine | 5 | Read the Whole Thing | 🔲 Not built |
| 3 — Refine | 6 | Migration & Re-seed | 🔲 Not built |
| 4 — Deliver | 7 | Summarisation Granularity | 🔲 Not built |
| 4 — Deliver | 8 | Your Reference Card | 🔲 Not built |

---

## Priority list

### Priority 1 — Exercise 3: Specificity as Scope Control
**Why first:** This is the first exercise after the two-project phase ends. The learner now has one primary project and needs a practical skill to use immediately. Specificity as scope control is the highest-leverage single habit — it addresses the verb taxonomy (agreed key artefact), connects directly to the Claude Code insights (models are trained to under-scope; vague prompts invite behaviour they'll resist but still attempt), and sets up everything in Chapter 2.

**Expected impact:** Most learners have never thought about verb choice as a scope signal. This exercise produces an immediate, visible improvement in first-draft quality. High chance of "aha" moment. Also produces the verb taxonomy as a take-home artefact — the resource both Opus agents flagged as the single most useful thing the course could give someone.

**Key content to include:**
- The verb taxonomy (5 tiers, Surgical → Analytical) as a copyable reference
- Before/after: same task, vague verb vs precise verb
- Platform-specific: where verb choice matters most per tool (Claude Code is the sharpest example — "fix" vs "refactor" has concrete consequences; Tines automation similarly)
- Self-describing prompt: the prompt itself uses deliberate verb choices and calls them out

---

### Priority 2 — The verb taxonomy as a standalone reference page
**Why:** Both Opus agents called this the single most operationally useful artefact the course could produce. It's needed for Exercise 3 and will be referenced from the glossary and the Reference Card (Exercise 8). Building it as a standalone page means it can be linked from anywhere and used outside the course.

**Expected impact:** A learner who internalises the verb taxonomy will write tighter prompts immediately, across every platform and every task type. It's tool-agnostic, durable, and printable.

---

### Priority 3 — Exercise 4: Context is Fuel
**Why:** Follows naturally from Exercise 3. Once you have the right verb (scope control), you need the right context (signal-to-noise). The load-bearing test is the key technique. Challenge: bring in a real document and search it — this is the "context as self-google" concept that differentiates this course.

**Expected impact:** Teaches learners to treat the context window as a workspace they load, not a chat they narrate into. Changes how they think about what to include vs. exclude. High practical value for knowledge workers.

---

### Priority 4 — Orientation updates
**Two specific changes agreed during planning:**
1. Replace "the model parses, it doesn't understand" with the more precise and durable framing: "The model has no persistent state, no goals, and no social contract with you. Its behaviour is a function of your input."
2. Update Human/Machine framing from "modes you're in" to "properties of each sentence you write" — resolves the binary/switch problem and is more accurate.

**Expected impact:** Sets a more durable conceptual foundation. Reduces the risk of learners treating Human/Machine as an on/off switch rather than a dial.

---

### Priority 5 — Exercises 5–8
Build in chapter order once 3 and 4 are done. Each has a defined concept and artefact:
- Ex 5: Read the Whole Thing → output review checklist
- Ex 6: Migration & Re-seed → re-seed template (3-line format)
- Ex 7: Summarisation Granularity → 3-format output ladder (one-liner / exec summary / full brief)
- Ex 8: Your Reference Card → personal prompt cheat sheet synthesising both projects

---

## Key artefacts to produce (course take-homes)

| Artefact | Needed for | Status |
|----------|-----------|--------|
| Verb taxonomy (5 tiers, blast radius) | Ex 3, Glossary, Reference Card | 🔲 Draft exists, not built as page |
| Prompt anatomy template (Role→Task→Context→Done) | Ex 2 (partial), Ex 3 | ✅ Embedded in Ex 2 |
| Thread health checklist | Ex 6 | 🔲 Not built |
| Re-seed template | Ex 6 | 🔲 Not built |
| Output ladder (3 formats) | Ex 7 | 🔲 Not built |
| Personal context doc template | Ex 8 | 🔲 Not built |

---

## Design decisions on record

- **Option C (two projects → one primary):** Ex 1 creates both, Ex 2 runs both and compares, Ex 3 onwards uses one primary. Ex 8 synthesises both into Reference Card.
- **Tool-specificity rule:** Every exercise has platform-specific content for Claude, ChatGPT, Gemini, Tines, Claude Code. No advice that only applies to one tool in the core content.
- **Beginner-first rule:** Foundational principles only. No chain-of-thought, no temperature, no API. Power-user content deferred to future track.
- **Target audience:** Young professionals, students, and upskilling older professionals who are new to AI. Assume low general technology confidence — not just low AI knowledge.
- **Prompt editing walkthrough:** Every exercise must include a step-by-step guide on how to edit the prompt to fit the learner's own task. Don't just show a copyable prompt — walk through each field, explain what to change and why. "Copy → personalise → use" is the pattern, not "copy → use."
- **Self-describing prompts:** Every copyable prompt includes a "Note" section that makes the meta-lesson explicit — reading the prompt teaches you what good prompting looks like.
- **Mode switches the prompt content:** Toggling Human/Machine changes what's inside the prompt boxes, not just the surrounding copy. The toggle IS the exercise.
- **Claude Code insights as illustrative, not universal:** Framed as "here's what this looks like in one real system — here's the durable principle it points at."
- **Guidance level picker:** Two options — Guided and Standard. Displayed as a SaaS-style side-by-side card picker, last step in orientation before entering the course. Nudge copy steers beginners toward Guided. Learner can switch at any time via a toggle on the exercises page. Concise tier deferred — reserved for a future "daily challenges" track aimed at experienced users.

---

## Outstanding questions

1. ~~Should the verb taxonomy be a modal (like the glossary) or a dedicated page at `/course/reference/verbs`?~~ **Decided:** Dedicated page at `/course/reference/verbs` with a search-based modal (modal links to / embeds the page).
2. ~~Should Exercise 8 (Reference Card) be a printable/downloadable format, or just a web page?~~ **Decided:** Web page with PDF export.
3. DNS for `linguist.vuelolabs.com` — still pending propagation from Squarespace → Cloudflare nameserver transfer.
