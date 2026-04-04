# Claude Code Content Synthesis for Linguist Curriculum

Produced 2026-04-02. Source files: `claude-code-best-practices.md`, `claude-code-best-practices-deep.md`, `REVIEW_FINDINGS.md`, `LINGUIST_BUILD_CONTEXT.md`.

---

## 1. Core Transferable Principles

These principles apply to any AI tool (ChatGPT, Gemini, Copilot, Claude.ai, etc.) and should form the backbone of the beginner curriculum. They are listed here stripped of all Claude Code-specific framing.

### 1.1 Verb choice controls scope

The verb you lead with determines how much the AI does. "Fix" means minimal change. "Improve" means unlimited scope. "Explain" means read-only. This is true across every AI tool -- vague verbs produce vague, sprawling results.

**Source concept:** Verb taxonomy table (deep file, Part 1). Seven verbs graded by blast radius.

### 1.2 Constraints belong at the start, not the end

Tell the AI what NOT to do before it starts working. Corrections after the fact are expensive -- they cost extra turns, require rework, and the original misunderstanding may persist. Front-loading constraints ("don't change anything else", "only this section", "stop after one pass") is consistently more effective than correcting mid-task.

**Source concept:** "State constraints before work starts, not after" (deep file, Part 2, Rule 4; best-practices file, point 1).

### 1.3 One task per message

Multi-part requests split the AI's attention and cause cross-contamination between tasks. Sequential single-purpose messages with checkpoints between them produce better results and let you course-correct.

**Source concept:** Deep file, Part 2, Rule 3.

### 1.4 The AI mirrors your verbosity

Short prompts produce short answers. Detailed prompts produce detailed answers. This is a calibration signal, not a bug. If you want more depth, write more. If you want brevity, be brief.

**Source concept:** Both files, "The model mirrors your verbosity."

### 1.5 Be specific with references

Vague references ("that thing from before", "the report we discussed") force the AI to guess. Specific references (names, dates, exact descriptions) let it act immediately. Precision in input produces precision in output.

**Source concept:** Both files, "Reference files by path, not description" -- generalised here beyond file paths.

### 1.6 Give tasks a clear stopping condition

Without an explicit done-state, the AI has to invent one. Open-ended prompts ("keep improving until it's good") are expensive and unpredictable. Defining "done" up front -- "three bullet points", "under 100 words", "just the summary, no recommendations" -- produces bounded, predictable results.

**Source concept:** Best-practices file, point 6.

### 1.7 Restate, don't patch

When the AI misunderstands, layering corrections on top ("no, I meant X not Y") compounds confusion. It is cleaner to restate the full request from scratch when the direction needs to change significantly. Treat it as a new prompt, not an amendment.

**Source concept:** Best-practices file, point 10.

### 1.8 Ask for a plan before execution on complex tasks

For multi-step work, separate the planning turn from the execution turn. "Before doing anything, tell me what you plan to do" costs one extra message but prevents costly mid-task corrections.

**Source concept:** Deep file, Part 3.

### 1.9 New conversation for new direction

When you want to reframe, try a different angle, or change approach -- start a new conversation. Continuing in the same thread with conflicting framings degrades output quality ("context flooding" in the build context; "context rot" in the deep file).

**Source concept:** Deep file, Part 4; build context, "Context Flooding Rule."

---

## 2. Claude Code-Specific Content (Advanced/Tooling Track Only)

These concepts are tightly coupled to Claude Code's architecture and have no direct equivalent in consumer AI tools. They must NOT enter the beginner curriculum without being either (a) stripped of Claude Code specifics and generalised, or (b) explicitly scoped as "Claude Code only."

| Concept | Why it is tool-specific |
|---------|------------------------|
| `CLAUDE.md` persistent instructions | No equivalent in ChatGPT, Gemini, or most consumer tools. The general principle (reusable instructions) can be taught, but the mechanism is Claude Code only. |
| `/clear` command | CLI-specific session management. The transferable principle (start fresh for new tasks) can be taught without it. |
| Compaction / summarisation internals | The 9-item preservation list, compaction notices, and summary correction are implementation details of Claude Code's context window management. |
| Subagent delegation | Multi-agent orchestration is a Claude Code (and similar developer tool) pattern. "Use a separate conversation for research" is the transferable version. |
| Subagent briefing format | Entirely developer workflow. |
| Context rot signals table | The specific signals (model re-asks, terminology drift) are universal in spirit but the table is framed around long coding sessions. Needs reframing for general use. |
| Token economics, caching architecture | Advanced track only. |
| Tool results being ephemeral | Internal architecture detail. |
| Plan mode (`/plan`) | Claude Code CLI feature. |

### What can be extracted and generalised

- **CLAUDE.md** generalises to: "If you find yourself repeating the same instruction, save it somewhere reusable" -- this maps to ChatGPT Custom Instructions, Gemini Gems, Claude.ai Projects, etc. Teachable in intermediate track as "persistent preferences."
- **Context rot signals** generalise to: "If the AI starts forgetting things you told it, repeating itself, or drifting from your instructions, start a new conversation." Teachable at beginner level.
- **Subagent delegation** generalises to: "Do your research in one conversation, then start a clean conversation for the actual task." This maps directly to the build context's Dump vs. Dispatch distinction.

---

## 3. Beginner Suitability Assessment

### Immediately suitable for beginners (with plain-language rewrite)

| Principle | Why it works for beginners | Teaching vehicle |
|-----------|---------------------------|------------------|
| Verb choice controls scope | Intuitive once shown with examples. Does not require any AI experience -- just the insight that word choice matters. | Side-by-side comparison: "improve this report" vs. "summarise this report in 3 bullet points." Show different outputs. |
| Constraints at the start | Directly addresses the most common beginner frustration ("it did too much / the wrong thing"). | Before/after exercise: same task, with and without constraints. |
| Verbosity mirroring | Immediately testable. Write a short prompt, get a short answer. Write a detailed prompt, get a detailed answer. | Live exercise: try both, see the difference. |
| Clear stopping condition | Prevents the "it just keeps going" experience that overwhelms beginners. | Template with a "done when" slot: "Write me [X]. Stop after [Y]." |
| One task per message | Simple rule, easy to follow, immediately improves results. | Exercise: send a 3-part request, then send the same 3 parts as separate messages. Compare. |

### Suitable after one or two exercises of AI use

| Principle | Why it needs a bit of experience first |
|-----------|----------------------------------------|
| Restate, don't patch | Requires having experienced the "correction spiral" at least once. |
| Ask for a plan first | Requires understanding what a multi-step task looks like with AI. |
| New conversation for new direction | Requires having experienced context flooding / degradation. |
| Specific references | Requires having a task complex enough that vague references cause problems. |

### Not suitable for beginners

| Principle | Why |
|-----------|-----|
| Context rot signals | Too abstract without sustained AI use. Belongs in intermediate. |
| Persistent instructions | Assumes a regular AI workflow that beginners don't have yet. |
| Agent delegation patterns | Developer workflow only. |
| Compaction / summarisation mechanics | Implementation detail. |

---

## 4. Teaching Sequence

The transferable principles have clear dependencies. The following sequence respects what must be understood before what.

### Layer 1: First contact (Exercises 1-2)

**Prerequisites:** None. Learner may never have used AI before.

1. **Verbosity mirroring** -- "The AI responds to how you write." Lowest-stakes entry point. Immediately testable. Teaches that your input style shapes the output, without requiring any structured prompting.
2. **One task per message** -- "Ask for one thing at a time." Simple behavioural rule. Prevents the overwhelm of getting a 2000-word response to a 5-part question.

**Why this order:** Verbosity mirroring is pure observation ("try this, notice that"). One-task-per-message is the first behavioural rule. Together they establish: you are in control of what the AI does, and the way you write is the control mechanism.

### Layer 2: Shaping output (Exercises 3-4)

**Prerequisites:** Has sent at least a few messages to an AI. Knows the AI responds to their input style.

3. **Clear stopping condition** -- "Tell it when to stop." Directly builds on the verbosity insight: you can control not just tone but scope.
4. **Verb choice controls scope** -- "The first word matters." Introduces the verb taxonomy. This is where "blast radius" enters the curriculum (see Section 5).

**Why this order:** Stopping conditions are simpler (append "stop after X"). Verb choice requires understanding that different words produce structurally different outputs -- which the learner now has context for from Layers 1-2.

### Layer 3: Preventing problems (Exercises 5-6)

**Prerequisites:** Has experienced the AI doing too much, going off track, or producing something unexpected.

5. **Constraints at the start** -- "Say what you don't want before it starts." Builds directly on verb choice: verbs set the scope, constraints set the ceiling.
6. **Restate, don't patch** -- "If it went wrong, start the instruction over." Requires having tried (and failed) to correct the AI mid-task.

**Why this order:** Constraints prevent the problem. Restating solves it when prevention fails. Teach prevention first.

### Layer 4: Working with longer tasks (Exercises 7-8)

**Prerequisites:** Has used AI for a task that took more than 2-3 messages.

7. **Ask for a plan before execution** -- "Get the AI to tell you what it will do before it does it."
8. **New conversation for new direction** -- "When you change your mind, start fresh."
9. **Specific references** -- "Name exactly what you mean."

**Why this order:** Planning is the proactive version of constraint-setting (learned in Layer 3). New-conversation is the recovery strategy when a session has drifted. Specific references become important as tasks get complex enough to have multiple possible referents.

### Layer 5: Intermediate (post-course or advanced track)

10. **Context rot awareness** -- recognising when the AI has lost track.
11. **Persistent preferences** -- platform-specific reusable instructions.
12. **Research/execution separation** -- using one conversation to think, another to execute (maps to Dump/Dispatch in the Linguist framework).

---

## 5. Placement of Key Concepts in the Gradient

### Blast radius

**Definition (for the course):** The amount of unintended change an instruction can cause. A high blast-radius instruction changes things you did not mean to change. A low blast-radius instruction changes only what you specified.

**Placement:** Layer 2, Exercise 4 (verb choice). This is where the concept is introduced. It does NOT need the term "blast radius" at beginner level -- the concept can be taught as "how much the AI decides to do on its own." The label "blast radius" can appear as an optional aside or in the reference material, but the teaching should lead with the observable effect, not the jargon.

**Teaching vehicle:** Show the same task with different verbs. "Clean up this email" vs. "shorten this email to under 100 words." Show the wildly different outputs. The blast radius concept emerges from the comparison, not from a definition.

**Copy-Personalise-Use application:** Provide a template prompt with a deliberate verb choice. The "How to edit this" section teaches the learner to choose a different verb for their own task, explicitly listing which verbs are safe (fix, explain, summarise) and which are risky (improve, clean up, make better).

### Verb taxonomy

**Placement:** Layer 2, Exercise 4. Introduced as a practical reference, not an academic table.

**Adaptation for beginners:** The Claude Code verb table (fix / add / refactor / update / explain / clean up / improve) is developer-oriented. For the beginner course, the verbs need to be mapped to non-technical tasks:

| Verb | What it means for a beginner |
|------|------------------------------|
| Summarise | Shorten this, keep the key points |
| Explain | Help me understand this, don't change anything |
| Rewrite | Same content, different style or format |
| List | Give me options, bullet points, structured output |
| Fix | Find and correct the specific error |
| Draft | Create a first version of something new |
| Compare | Show me the differences between these things |
| Improve | **Risky** -- no ceiling on what changes. Be more specific. |

This table replaces the developer verb table in the beginner track. The developer version belongs in the advanced track.

**Copy-Personalise-Use application:** Each verb gets a worked example with a "How to edit this" walkthrough. The learner picks the verb that matches their intent, slots in their content, adds a stopping condition, and sends.

### Constraint front-loading

**Placement:** Layer 3, Exercise 5. Requires verb choice as a prerequisite (you need to know what verbs do before you can constrain them).

**Teaching vehicle:** The "before and after" pattern. Show the same request with and without upfront constraints. The version with constraints produces a bounded result. The version without produces drift, over-delivery, or unwanted changes.

**Beginner framing:** "Tell the AI what to leave alone." This is more intuitive than "front-load constraints" -- it frames the constraint as protection of something the learner values, not as a technical parameter.

**Copy-Personalise-Use application:** The prompt template has a dedicated constraint slot: "[Verb] [what you want] -- [what to leave alone / where to stop / what not to change]." The "How to edit this" section walks through filling in the constraint slot with examples from the learner's own context.

---

## 6. Contradictions with Existing Linguist Framing

### 6.1 "Context is fuel" vs. "context is finite and degrades"

**The contradiction:** The Linguist build context (Section 1, principle 3) says "Context is fuel for machines, not a burden. Give them more input, not more politeness." The Claude Code deep file (Part 4) says context degrades over time through summarisation, and that long sessions produce diluted, drifting responses.

**Resolution:** Both are true at different scales. For a beginner sending a single message, context IS fuel -- more relevant detail produces better output. For a sustained multi-message session, context accumulates and degrades. The course should teach them in sequence:

- **Layer 1-2 (beginner):** Context is fuel. Give the AI everything it needs to do the job well. Don't hold back relevant detail out of politeness or brevity-for-its-own-sake.
- **Layer 4 (longer tasks):** Context accumulates. When a conversation gets long or changes direction, start a new one. The AI does not have feelings about abandoned conversations.

The transition between these is natural and does not require acknowledging a "contradiction" -- it is simply a refinement that arrives when the learner's usage pattern becomes complex enough to encounter the problem.

### 6.2 Human mode / machine mode vs. the deep file's collaborative patterns

**The contradiction:** Linguist's core framework is a clean binary: Human Mode (warm, messy, emotional) and Machine Mode (precise, structured, direct). The Claude Code deep file describes collaborative patterns that blur this line: asking the AI to push back, requesting honest assessment, treating the AI as a thinking partner. These sit uncomfortably in the binary -- they are machine-directed communication with a human-like relational quality.

**Resolution:** This is not a true contradiction but a maturity gradient. The binary is the right entry point for beginners -- it creates the initial "aha" of recognising mode confusion. As learners progress, the binary softens into a spectrum:

- **Beginner:** Two modes. Clean switch. Machine mode = direct, structured, no social performance.
- **Intermediate:** Machine mode has sub-modes. Sometimes you are dispatching (pure instruction). Sometimes you are collaborating (structured but conversational). The common thread is: you are never performing social pleasantries for the machine's benefit.
- **Advanced:** The modes are less about the AI and more about you. Noticing which mode you are in is the skill. The specific communication style varies by task, tool, and context.

The build context's Talk-Dump-Dispatch framework already contains this gradient (Dump is the bridge mode). The course should use Dump as the transitional teaching moment: "You can think out loud with the AI. That is not the same as performing politeness at it."

### 6.3 "Not a prompt engineering course" vs. teaching prompt structure

**The contradiction:** The build context explicitly states Linguist is "NOT a prompt engineering course." The Claude Code files are, in substance, prompt engineering guides. Teaching verb taxonomy, constraint front-loading, and blast radius is teaching prompt engineering by another name.

**Resolution:** The distinction is framing, not content. Prompt engineering courses teach: "here is how to write optimal prompts to extract maximum performance from AI." Linguist teaches: "here is how to communicate clearly with a machine so you get what you need and stop burning yourself out."

The content overlap is real. The difference is:
- Prompt engineering centres the AI's capabilities. Linguist centres the human's experience.
- Prompt engineering optimises for output quality. Linguist optimises for sustainable communication.
- Prompt engineering is a technical skill. Linguist is a communication mode.

**Practical implication for content design:** Never frame a lesson as "how to prompt AI better." Always frame it as "how to say what you mean to a machine." The verb taxonomy is not "prompt optimisation" -- it is "choosing the right word so the machine does what you actually wanted." The constraint is not "prompt engineering technique" -- it is "telling the machine where to stop so you don't have to clean up after it."

This framing distinction must be maintained consistently. The moment the course starts sounding like "prompting tips and tricks," it has lost the Linguist identity.

### 6.4 Developer examples vs. low-tech-confidence audience

**The contradiction:** Every worked example in the Claude Code files involves software development (React, TypeScript, auth modules, test files). The Linguist audience has low general tech confidence.

**Resolution:** Already flagged in REVIEW_FINDINGS.md (Round 2, Agent 2). Every example must be rewritten for the target audience. The underlying principle is preserved; the surface is replaced.

Example translations:
- "Fix the off-by-one in paginate()" becomes "Fix the spelling errors in this email -- don't rewrite anything else."
- "Refactor auth.ts" becomes "Reorganise this meeting agenda so the urgent items are first -- don't remove any items."
- "Extract token validation into its own function" becomes "Pull out the budget numbers from this report into a separate table."

The pattern is consistent: [verb] [specific target] -- [constraint]. The structure transfers. The examples must not.

---

## 7. Summary Recommendations for Curriculum Design

### Use from the Claude Code files

1. **Verb taxonomy** -- rewrite for non-technical tasks, place in Layer 2.
2. **Blast radius concept** -- teach through examples, not jargon. Place in Layer 2.
3. **Constraint front-loading** -- "tell the AI what to leave alone." Place in Layer 3.
4. **Verbosity mirroring** -- immediate, testable, zero prerequisites. Place in Layer 1.
5. **Restate don't patch** -- teach as recovery strategy. Place in Layer 3.
6. **One task per message** -- simple rule. Place in Layer 1.
7. **Stopping conditions** -- "tell it when to stop." Place in Layer 2.
8. **Plan before execution** -- Place in Layer 4.
9. **New conversation for new direction** -- Place in Layer 4.

### Defer to advanced track

1. All CLAUDE.md / persistent instruction mechanics.
2. All compaction / summarisation internals.
3. All subagent / multi-agent patterns.
4. All context rot signal tables (general awareness of "start fresh when it drifts" can enter Layer 4).
5. All developer-specific examples and tooling.

### Content design rules (from this synthesis + project memory)

1. Every exercise uses Copy-Personalise-Use. No prompt block without a "How to edit this" section.
2. Every example must be non-technical. If a principle came from a developer context, the example must be translated.
3. Never frame as "prompt engineering." Always frame as "communicating clearly with a machine."
4. Assume low general tech confidence. Explain copy/paste, text editing, browser behaviour where needed.
5. The human mode / machine mode binary is the entry point. Complexity (Dump mode, collaboration, spectrum) arrives in Layers 3-4.
6. "Context is fuel" is the beginner framing. "Context accumulates" is the Layer 4 refinement. Do not present both simultaneously to beginners.

---

## Appendix: Principle-to-Exercise Mapping (Draft)

This is a suggested mapping, not a final curriculum plan. Exercise numbers are placeholders.

| Exercise | Layer | Principle taught | Builds on |
|----------|-------|-----------------|-----------|
| 1 | 1 | Verbosity mirroring: your style shapes the output | Nothing (first contact) |
| 2 | 1 | One task per message | Exercise 1 |
| 3 | 2 | Clear stopping condition | Exercises 1-2 |
| 4 | 2 | Verb choice + blast radius (verb taxonomy) | Exercise 3 |
| 5 | 3 | Constraint front-loading | Exercise 4 |
| 6 | 3 | Restate, don't patch | Exercise 5 |
| 7 | 4 | Plan before execution | Exercises 5-6 |
| 8 | 4 | New conversation for new direction; specific references | Exercise 7 |
