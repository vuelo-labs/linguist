# 03 -- Beginner-to-Enabled-User Gap Analysis

_Produced 2026-04-02. Reads all beginner-facing content, maps it on a complexity gradient, identifies gaps, and defines the "enabled user" threshold._

---

## 1. What Exists -- Inventory of Beginner-Facing Content

### 1.1 The /see Experience (fully built)

**URL:** `/see/index.html`

**Structure:** 5 screens -- Intro, See, Try (quiz), Know, Done.

**What it teaches:**
- Screen 0 (Intro): Frames the single skill -- "you've been talking to machines like they're people"
- Screen 1 (See): Displays two absurdities side-by-side (human talking to machine with social performance; human talking to friend in structured dispatch format). Labels both as wrong.
- Screen 2 (Try): 5-question recognition quiz. Learner reads a passage and picks "Human mode" or "Machine mode". Feedback explains why.
- Screen 3 (Know): Anchors the reframe with a split panel. "You can now recognise which mode you're in. That is the only skill."
- Screen 4 (Done): Pause messaging ("go be human"), share buttons, email signup, links to Booklet/Guide/Handbook. No link to /course.

**Complexity level:** Day 0. No jargon. No AI tool interaction required. Pure recognition.

**Strengths:** Emotionally calibrated. Warm. The two absurdities are immediately recognisable. Low barrier -- no signup, no AI account needed, no typing required.

**Weaknesses:** Done screen links to Booklet/Guide/Handbook but not to /course. Eight CTAs on Done screen (overwhelming). Quiz Q5 is a "trick question" -- casual tone labelled as machine mode, which can feel invalidating.

---

### 1.2 Course Hub (partially built)

**URL:** `/course/index.html`

**Structure:** 4 screens -- Orientation, Choose Platform, Setup, Exercises list.

**What it teaches:**
- Orientation: Human/Machine balance framing, waterfall-to-cycle model, terminology note, glossary access
- Choose Platform: Picker for Claude / ChatGPT / Gemini / Tines / Claude Code, with model selection
- Setup: Platform-specific persistent instruction setup (where to paste, what to configure)
- Exercises: Shows 7 exercises (only 2 unlocked)

**Complexity level:** Day 1-2. Requires having an AI account. Requires choosing a platform and model. Requires understanding "persistent instructions" as a concept.

**Strengths:** Platform picker is well-designed. Mode toggle (Human/Machine) switches all content dynamically. Glossary with 12 terms.

**Weaknesses:** No inbound links from any page on the site. Glossary includes terms too technical for entry (MCP, Temperature). Claims "7 exercises" but only 2 live -- could read as "course isn't ready".

---

### 1.3 Exercise 1 -- Your Two Projects (built)

**URL:** `/course/exercise-1.html`

**What it teaches:**
- The concept of "persistent instructions" -- project-level and profile-level context
- Create a Human Mode project (warm, descriptive defaults)
- Create a Machine Mode project (structured, precise defaults)
- 3 "bad prompting" examples with diagnosis
- Evaluation step: 4 self-assessment questions

**Complexity level:** Day 2-3. Multi-step, multi-concept. Learner must create two separate projects/conversations, paste prompts, compare outputs.

**Strengths:** Goal card with learning goal, outcome, watch-for. Platform-specific content for 5 platforms. Mode toggle changes prompt content.

**Weaknesses (from review findings):**
- Broken HTML (`data-machine"`) causes machine-mode text to leak into human mode -- confusing for nervous learners
- Doing too much at once: understand persistent instructions + platform implementation + create Human Mode project + create Machine Mode project + paste 2 prompts + evaluate
- The bracket-fill pattern `[your role]` is used but never explicitly taught
- Subtext paragraphs are 40-50 words where 15-20 would work
- "Note to reader" blocks inside copy-paste areas -- learners can't tell what to paste vs read

---

### 1.4 Exercise 2 -- The Opening Seed (built)

**URL:** `/course/exercise-2.html`

**What it teaches:**
- Four elements of an opening seed: Role, Task, Context, Done criteria
- How to write a first message to an AI that produces useful output
- Same task, two modes (Human Mode seed vs Machine Mode seed)
- Convergence: "from Exercise 3, one primary project"

**Complexity level:** Day 3-4. Requires Exercise 1 to have worked. Introduces the Role/Task/Context/Done framework.

**Strengths:** Task callout asks learner to "use something real from your work this week". Convergence section transitions to single-project work.

**Weaknesses:**
- Machine Mode opening seed is the most jargon-dense prompt in the course: "load-bearing", "[verb] [object]", "Done when" -- all undefined
- Human Mode seed asks "What would make this conversation useful?" -- a metacognitive question that assumes experience the learner does not have
- Assumes Exercise 1 worked perfectly (unlikely on first attempt)
- Same broken HTML issue as Exercise 1

---

### 1.5 Daily Cards (built -- 40 cards)

**URL:** Content defined in `/cards/content.js`

**What they teach:**
- Cards 1-10 (human_to_machine): The absurdity of social performance with machines
- Cards 11-20 (machine_to_human): The absurdity of dispatching humans like machines
- Cards 21-30 (same_intent): Same message written for a person vs a machine -- the teaching sweet spot
- Cards 31-40 (practical_tip): Concrete prompting habits

**Complexity level:** Mixed. Cards 1-30 are Day 0 -- pure recognition, no AI use required. Cards 31-40 are Day 5+ -- they assume someone is already using AI regularly ("paste this at the top of every new chat", "context document", "migration template").

**Strengths:** Cards 1-30 are the single best piece of beginner content in the project. Dry captions ("The machine did not notice the three exclamation marks") are memorable and non-preachy.

**Weaknesses:** Cards 31-40 assume an established AI workflow. Card 36 ("context document") presupposes regular use. These are mid-course cards mispositioned as pre-course social content.

---

### 1.6 Practical Guide (built)

**URL:** `/guide/index.html`

**What it teaches:**
- The Think/Collab/Dispatch/Iterate framework (4-step workflow)
- Before/after prompt pairs for realistic tasks
- 8 principles (e.g. "define done before you start", "one task at a time")

**Complexity level:** Day 3-5. Readable without an AI account, but the content assumes you will try these techniques. ~2,500 words as a single scroll with heavy redundancy.

**Strengths:** Framework cards are clear. Prompt pairs show the same intent in two modes. Pause callout is well-placed.

**Weaknesses:** Principles grid repeats lessons from both the /see experience and the /pdf booklet. No interactive component. Heavy redundancy -- same lessons appear 3 different ways.

---

### 1.7 PDF Booklet (built)

**URL:** `/pdf/index.html`

**What it teaches:**
- Eight principles, one framework (Think/Collab/Dispatch/Iterate)
- Printable reference format
- Sine wave motif, mode distinction

**Complexity level:** Day 2-4. Reference document. Repeats core content from Guide.

**Strengths:** Printable. Clean layout. Good as a take-home artefact after the /see experience.

**Weaknesses:** "Define done before you start" and "One task at a time" appear as both principles and tips -- repetitive. Overlaps heavily with Guide and Handbook.

---

### 1.8 Prompt Starter (built)

**URL:** `/prompt-starter.html`

**What it teaches:**
- A copy-paste guided walkthrough prompt for each platform
- The AI walks the learner through: persistent instructions, opening seed, Think/Collab/Dispatch/Iterate, tone calibration, token efficiency, migration, re-seed
- 6 steps, 10-15 minutes, AI-guided

**Complexity level:** Day 1-3. The closest thing to a true beginner onramp. The AI does the teaching. The learner just answers questions.

**Strengths:** Plain language. Co-creation model ("build a seed with me -- not for me"). Platform-specific prompts for all 5 platforms. AI-guided means the learner does not need to already understand the concepts.

**Weaknesses:**
- Completely different design system (system fonts, black/white, dark mode) -- looks like a different product
- Dispatch note paragraph uses "agents," "agentic dispatch," "scope locking," "models executing" -- no explanation
- Step 5 references "token efficiency," "re-seeding," "migration" -- none defined before use
- No inbound links from any page
- Footer uses absolute URLs that break on staging

---

### 1.9 Exercises 3-8 (not built)

**Planned content from COURSE_STATUS.md:**

| # | Title | Concept | Artefact |
|---|-------|---------|----------|
| 3 | Specificity as Scope Control | Verb taxonomy, blast radius | Verb reference (5 tiers) |
| 4 | Context is Fuel | Context window as workspace, load-bearing test | Context loading technique |
| 5 | Read the Whole Thing | Output review, critical reading | Output review checklist |
| 6 | Migration & Re-seed | Thread health, fresh starts | Re-seed template (3-line) |
| 7 | Summarisation Granularity | Output formats, specificity of request | Output ladder (3 formats) |
| 8 | Your Reference Card | Personal synthesis | Personal prompt cheat sheet |

---

### 1.10 Advanced Modules 00-08 (built, wrong audience)

**What they are:** 8 markdown modules written for software engineers and technical power users. All 54 worked examples assume developers/data engineers (React, TypeScript, BigQuery, dbt, SQL).

**Decision on record:** Designated as the advanced course track. Not beginner content.

**Modules with beginner potential (with full rewrite):** 01 (core prompting), 02 (task decomposition), 05 (output review).

---

## 2. Gradient Map -- Existing Content on a Complexity Axis

```
DAY 0          DAY 1          DAY 2          DAY 3          DAY 4          DAY 5+         ENABLED USER
Never used AI  Has account    First message   Regular use    Independent    Reliable use   Self-directed
               ready          sent            with support   problem-solve  across tasks   across contexts

|-- /see ---|               |--- Ex 1 ---|--- Ex 2 ---|                                    |
|  Cards    |               |            |            |                                    |
|  1-30     |               |            |            |                                    |
                                                                                           |
             |-- prompt- ---|------ prompt-starter (AI-guided) continues ---------|         |
             |  starter     |                                                     |         |
             |  (start)     |                                                     |         |
                                                                                           |
                            |-- Guide ---|                                                  |
                            |-- PDF -----|                                                  |
                                                                                           |
                                                      |--- Ex 3-8 (not built) ---|         |
                                                                                           |
                                                                     |- Cards 31-40 -|     |
                                                                                           |
                                                                                   |--- Advanced modules ---|
```

### Where the gaps are

**GAP A -- "I finished /see, now what?" (Day 0 to Day 1)**
The /see Done screen links to Booklet, Guide, and Handbook -- all reading material. There is no path to "now open an AI tool and try." The /course hub is unreachable from any page. The prompt-starter (the best Day 1 onramp) is also unreachable.

**GAP B -- "I've never sent a message to an AI" (Day 0.5 to Day 1)**
No content anywhere addresses: how to create an account, what the interface looks like, what happens when you press send, what to expect from the response. The course jumps from "I can recognise the two modes" directly to "set up persistent instructions for two projects." This is the steepest cliff in the entire gradient.

**GAP C -- "How do I edit this prompt to fit my situation?" (throughout)**
The Copy-Personalise-Use pattern is a project requirement but is not implemented in any exercise. Bracket-fill syntax `[your role]` appears everywhere but is never taught. Nervous learners will either paste the brackets literally or freeze.

**GAP D -- "What do I do with the AI's response?" (Day 2 to Day 3)**
Nothing between Exercise 2 (write your opening seed) and Exercise 5 (Read the Whole Thing, not built) addresses what to do after the AI responds. The learner writes a prompt, gets output, and... then what? No guidance on: reading the response, deciding if it's good, asking for changes, or knowing when to stop.

**GAP E -- "I tried it and it didn't work" (Day 1 to Day 2)**
Exercise 2 assumes Exercise 1 worked perfectly. No recovery path. No "if your output doesn't look right, here's what to check." Nervous beginners who hit a wall at Exercise 1 have no way forward.

**GAP F -- "Exercises 3-8 don't exist" (Day 3 to Day 5+)**
The entire middle of the gradient is unbuilt. Even with the prompt-starter filling some of this, the structured course path stops at Exercise 2.

---

## 3. Missing Steps -- What a Nervous Beginner Needs That Doesn't Exist

### 3.1 Pre-Exercise 1: "Your First Message" (Priority: Critical)

**What it is:** A zero-stakes, single-task exercise where the learner opens an AI tool and sends one message. Not a project setup. Not persistent instructions. Just: open the tool, type a sentence, press send, read what comes back.

**Why it's needed:** The jump from /see (recognition, no interaction) to Exercise 1 (create two projects with persistent instructions across platform-specific menus) is the biggest barrier in the course. A nervous beginner who has never typed a prompt will abandon at Exercise 1's complexity.

**What it should teach:**
- This is what the interface looks like (screenshot or orientation for each platform)
- Type something simple (a question you already know the answer to)
- Press send. Read the response.
- Notice: the AI answered. It did not judge your question. It did not remember you. Nothing broke.
- Emotional decompression: "That's it. You just used AI. Everything after this is just getting better at it."

### 3.2 The Copy-Personalise-Use Walkthrough (Priority: Critical)

**What it is:** An explicit, step-by-step guide embedded in every exercise showing how to take a template prompt and make it your own.

**Why it's needed:** Project requirement (documented in design decisions). Not implemented anywhere. The bracket-fill pattern `[your role]` is used across both exercises, the prompt-starter, and the cards, but never explained.

**What it should teach:**
- Here is a prompt template
- Here are the parts you change (highlighted, with examples of what to put there)
- Here is what it looks like after you've personalised it (worked example)
- Now do it yourself

### 3.3 "What Just Happened?" -- Reading AI Output (Priority: High)

**What it is:** Guidance on what to do after sending a prompt and receiving a response.

**Why it's needed:** Gap D. The course teaches how to write prompts but not how to read, evaluate, or act on responses. Exercise 5 (Read the Whole Thing) addresses this but is not built and is positioned at the midpoint, not the beginning.

**What it should teach:**
- Read the whole response before reacting
- The first output is a draft, not a final product
- How to spot when the AI misunderstood you (signals: generic language, wrong framing, invented details)
- What to do next: ask for changes, start over, or take what's useful

### 3.4 Recovery Paths / "It Didn't Work" (Priority: High)

**What it is:** Inline guidance for when the exercise doesn't produce the expected result.

**Why it's needed:** Exercise 2 assumes Exercise 1 worked perfectly. Nervous learners who get a bad result will blame themselves and stop. No current content addresses failure gracefully.

**What it should include:**
- "If your output looks different from the example, that's normal"
- Common reasons the output might not match: model version differences, platform differences, ambiguity in the prompt
- "Try changing X" -- one specific thing to adjust
- Permission to start over without it being a failure

### 3.5 Platform Orientation -- "What Am I Looking At?" (Priority: Medium)

**What it is:** A visual orientation to each supported platform's interface before asking the learner to configure anything.

**Why it's needed:** Exercise 1 immediately asks learners to find platform-specific settings (Claude's Project Instructions, ChatGPT's Custom Instructions, etc.) without showing them what the interface looks like. A learner with low general tech confidence may not know what "Settings" means in this context.

**What it should include:**
- Annotated screenshots or simple descriptions of each platform's main interface
- "Here is where you type. Here is where the response appears. Here is where settings live."
- Updated per platform, kept minimal

### 3.6 The Verb Taxonomy as a Taught Concept (Priority: High, partially drafted)

**What it is:** Exercise 3 content. Draft verb taxonomy exists in `claude-code-best-practices-deep.md` but needs to be stripped of developer framing and built as a page.

**Why it's needed:** Verb choice is the highest-leverage single prompting habit. "Fix" vs "rewrite" vs "edit" produce dramatically different outputs. Currently no content teaches this.

### 3.7 Emotional Permission to Be Bad at This (Priority: Medium, partially present)

**What it is:** Explicit messaging throughout the course that it's OK to write bad prompts, get bad results, and need multiple tries.

**Why it's partially present:** The /see experience handles this well ("the machine will wait. It does not mind"). But the exercises drop this tone entirely -- they present structured tasks with evaluation criteria that can feel test-like.

**What it should include:**
- Reframe evaluation steps from "did you get this right?" to "what did you notice?"
- Explicit acknowledgement that first attempts are always rough
- Encourage experimentation over perfection

---

## 4. The "Enabled User" Threshold

### Definition

An **enabled user** is someone who can:

1. **Open any AI tool and start a useful conversation** without following a tutorial
2. **Write a prompt that produces a usable first draft** for their own work tasks
3. **Recognise when AI output needs correction** and know how to ask for changes
4. **Start a new conversation when the current one degrades** (migration/re-seed)
5. **Adapt a prompt template to a new context** without being told which parts to change
6. **Self-correct** -- notice when they're over-performing socially, being too vague, or over-iterating

### Where the Threshold Falls

Based on the planned content map, the enabled user threshold falls at the completion of Exercise 8 (Your Reference Card). At that point, the learner has:

- Built persistent instructions for their platform (Ex 1)
- Written effective opening seeds (Ex 2)
- Learned verb precision and scope control (Ex 3)
- Understood context loading (Ex 4)
- Developed output review habits (Ex 5)
- Learned migration and re-seeding (Ex 6)
- Controlled output format and granularity (Ex 7)
- Synthesised everything into a personal reference card (Ex 8)

### The Transition to "More Capable"

The enabled user threshold is also where the advanced track (Modules 00-08) becomes appropriate. The transition looks like:

| Beginner track ends | Advanced track begins |
|---------------------|----------------------|
| Personal reference card in hand | Session hygiene, context architecture |
| One platform, one workflow | Multi-platform, multi-agent |
| "How do I prompt well?" | "How do I design systems that prompt well?" |
| Copy-personalise-use | Write from scratch, debug, iterate on system prompts |
| Single-task dispatch | Multi-step orchestration |
| Human/Machine as a communication skill | Human/Machine as a system design principle |

The beginner track produces someone who can use AI reliably for their own work. The advanced track produces someone who can design AI-assisted workflows for others.

---

## 5. Content That Can Be Salvaged vs Started Fresh

### 5.1 Keep and Adapt (high-value, needs revision)

| Content | What's good | What needs work |
|---------|-------------|-----------------|
| `/see` experience | Best piece of beginner content. Emotional calibration is right. Recognition quiz works. | Fix quiz Q5 (trick question). Reduce Done screen CTAs to 1 primary. Add link to /course from Done. |
| Cards 1-30 | Perfect Day 0 content. Memorable, shareable, on-brand. | No changes needed to content. Cards 31-40 need to be repositioned as mid-course, not pre-course. |
| Exercise 1 | Goal card, platform picker, mode toggle, evaluation step all work as design patterns. | Fix HTML bugs. Split into 2 sub-exercises (understand persistent instructions, then create projects). Add bracket-fill tutorial. Add recovery path. Trim subtext. |
| Exercise 2 | Role/Task/Context/Done framework is correct. Task callout ("use your real work") is good. | Fix HTML bugs. Add worked example next to Machine Mode template. Replace metacognitive Human Mode question. Add Copy-Personalise-Use walkthrough. |
| Prompt-starter | Best onramp for Day 1. AI-guided, co-creation model, platform-specific. | Restyle to match Linguist design system. Remove jargon from dispatch note and Step 5. Switch to relative URLs. Add inbound links from /see Done and /course. |
| Guide | Framework cards (Think/Collab/Dispatch/Iterate) are clear. Prompt pairs are effective. | Cut by ~40%. Remove redundancy with PDF and Handbook. Could become a reference page rather than a standalone experience. |
| PDF Booklet | Printable take-home. Good as a post-/see artefact. | Remove duplicated tips. Deduplicate with Guide. |
| Verb taxonomy draft (in `claude-code-best-practices-deep.md`) | 7 verbs with explicit ambiguity and danger labels. "Blast radius" framing is memorable. | Strip all Claude Code / developer framing. Build as `/course/reference/verbs`. Add non-technical examples for every verb. |
| Verbosity mirroring insight (in best-practices files) | Simple, immediately useful: "the model mirrors your verbosity." | Extract and present as a standalone practical tip. One sentence, one example. |

### 5.2 Start Fresh (wrong audience or too far gone)

| Content | Why start fresh |
|---------|----------------|
| Advanced modules 00-08 | Written for software engineers. All 54 examples are developer-only. No worked examples for non-technical users. Designated as advanced track -- keep as-is for that purpose, do not attempt to adapt for beginners. |
| Handbook | Part 5 rehashes all 8 principles with ~2,400 words, heavily overlapping PDF and Guide. "This is the third layer" with no explanation of layers 1 and 2. Jargon throughout. |
| Manifesto time claim | Says "Eight minutes" in one place and "(2-3 min)" in another. Needs a single, honest number. |

### 5.3 New Content Required (does not exist in any form)

| Content | Priority | Notes |
|---------|----------|-------|
| "Your First Message" exercise (pre-Ex 1) | Critical | The single most important missing piece. Without this, nervous beginners will not reach Exercise 1. |
| Copy-Personalise-Use walkthrough pattern | Critical | Project requirement, not implemented anywhere. Needs to be a repeatable component in every exercise. |
| Platform orientation (visual guide to each tool's interface) | Medium | Screenshots or descriptions. Could be a modal or inline expansion in Exercise 1. |
| "What Just Happened?" response-reading guidance | High | Could be a mini-exercise between Ex 2 and Ex 3, or embedded in Ex 2. |
| Recovery paths / troubleshooting | High | Inline in every exercise. "If this didn't work, try X." |
| Navigation fix -- link /course from homepage and /see | Critical | Bug, not content. But without it, the course is undiscoverable. |
| Exercises 3-8 | High (3-4), Medium (5-8) | Ex 3 (verb taxonomy) and Ex 4 (context) are the highest-leverage skills after the foundation. |

---

## 6. Summary -- The Gradient as It Should Be

The complete beginner-to-enabled-user arc, incorporating existing content and identified gaps:

```
PHASE 0: RECOGNITION (Day 0)
  /see experience                    [EXISTS, needs minor fixes]
  Daily cards 1-30                   [EXISTS, no changes needed]

PHASE 1: FIRST CONTACT (Day 0.5-1)
  Navigation to /course              [MISSING -- critical bug]
  "Your First Message" exercise      [MISSING -- critical gap]
  Platform orientation               [MISSING -- medium priority]

PHASE 2: FOUNDATION (Day 1-2)
  Prompt-starter (AI-guided)         [EXISTS, needs restyle + jargon removal]
  Exercise 1 (simplified)            [EXISTS, needs split + bracket-fill tutorial]
  Copy-Personalise-Use pattern       [MISSING -- critical, needed in every exercise]

PHASE 3: FIRST REAL USE (Day 2-3)
  Exercise 2                         [EXISTS, needs fixes from review]
  "What Just Happened?" guidance     [MISSING -- high priority]
  Recovery paths                     [MISSING -- high priority]

PHASE 4: BUILD SKILL (Day 3-5)
  Exercise 3 (verb taxonomy)         [NOT BUILT -- P1]
  Exercise 4 (context is fuel)       [NOT BUILT -- P3]
  Verb reference page                [NOT BUILT -- P2]

PHASE 5: REFINE (Day 5-7)
  Exercise 5 (read the whole thing)  [NOT BUILT]
  Exercise 6 (migration & re-seed)   [NOT BUILT]
  Daily cards 31-40                  [EXISTS, reposition as mid-course]

PHASE 6: DELIVER (Day 7-8)
  Exercise 7 (output granularity)    [NOT BUILT]
  Exercise 8 (reference card)        [NOT BUILT]

=== ENABLED USER THRESHOLD ===

ADVANCED TRACK (separate, future)
  Modules 00-08                      [EXISTS, developer audience only]
```

### Critical path items (blocking the gradient)

1. **Navigation fix** -- link /course from homepage and /see Done screen
2. **"Your First Message" exercise** -- the single biggest gap
3. **Copy-Personalise-Use pattern** -- project requirement, unimplemented
4. **Exercise 1 HTML bugs + simplification** -- currently too complex for Day 1
5. **Exercise 3 + verb taxonomy** -- the first real skill-building exercise after foundation

Without items 1-3, the gradient has a cliff at the Day 0 to Day 1 boundary that will lose the majority of nervous beginners. They will complete /see, feel inspired, and have nowhere to go.
