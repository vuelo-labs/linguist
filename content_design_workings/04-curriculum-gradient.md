# 04 -- Master Curriculum Gradient

_Produced 2026-04-02. Synthesises 01-claude-code-synthesis.md, 02-advanced-content-gaps.md, 03-beginner-enabled-gaps.md, REVIEW_FINDINGS.md, and LINGUIST_BUILD_CONTEXT.md into the complete track map._

---

## Executive Summary

The Linguist curriculum runs from Day 0 (never used AI, low tech confidence) to Day X (building independently with Claude Code or Workbench/API). It is organised into four named stages: Beginner (recognition and first contact), Enabled User (reliable independent use), Advanced Practitioner (Claude Code mastery), and Builder (designing AI systems for others). The gradient contains 28 units across these four stages, with a shared foundation preceding a tooling fork at the Advanced Practitioner / Builder boundary. The beginner stage prioritises emotional safety and explicit hand-holding, assuming low general tech confidence -- not just low AI knowledge. Every exercise follows the Copy-Personalise-Use pattern, treating prompt editing as a taught skill. The course is framed as communication mode-switching, never as prompt engineering. "Context is fuel" is the beginner framing; "context is finite and degrades" arrives only after the learner has experienced long sessions. The Advanced Practitioner track targets Claude Code; the Builder track targets Workbench and API. Both tracks share a platform-agnostic foundation (units B01-E08) and a cost/token economics gate before any agentic content. Existing content covers roughly 40% of the total curriculum -- the /see experience, exercises 1-2, daily cards, guide, PDF booklet, prompt-starter, and advanced modules 01-08 all have salvageable material, though most needs adaptation. The single biggest gap is the Day 0 to Day 1 bridge: a "Your First Message" exercise that does not yet exist.

---

## 1. Stage Definitions and Boundaries

### Stage 1: BEGINNER

**Capability definition:** Can recognise the difference between human and machine communication modes. Can open an AI tool, send a message, read the response, and adapt a template prompt to their own task. Understands that word choice shapes AI output.

**Entry signal:** Has never used AI, or has used it casually without structured technique. Low general tech confidence.

**Exit signal / transition to Enabled User:** Can write a prompt from a template without guidance on which parts to change. Can identify when a response is off-target. Chooses verbs deliberately. Has sent at least 10-15 messages to an AI tool across multiple sessions.

**Emotional posture:** Permission-giving. "Nothing will break. The machine does not mind. You are already enough."

---

### Stage 2: ENABLED USER

**Capability definition:** Can open any AI tool and start a useful conversation without a tutorial. Can write prompts that produce usable first drafts. Can recognise when output needs correction and knows how to ask for changes. Can start fresh when a conversation degrades. Can adapt any prompt template to a new context without being told which parts to change.

**Entry signal:** Has completed the Beginner stage or equivalent experience. Uses AI for real work tasks, not just experimentation.

**Exit signal / transition to Advanced Practitioner or Builder:** Feels limited by the consumer AI interface. Wants more control, more consistency, or wants to build something. Can articulate what they wish the AI tool could do differently.

**Emotional posture:** Confidence-building. "You have the fundamentals. Now refine them."

---

### Stage 3: ADVANCED PRACTITIONER (Claude Code track)

**Capability definition:** Can install and configure Claude Code. Can write and maintain CLAUDE.md files. Can manage sessions, recognise context degradation, and checkpoint before compaction. Can guide Claude Code's tool selection. Can delegate to subagents with proper briefings. Can estimate token cost before starting a task.

**Entry signal:** Has completed Enabled User stage. Has decided they want CLI-based AI tooling for daily work. Comfortable with a terminal (or willing to learn).

**Exit signal / transition to Builder:** Wants to design AI experiences for other people, not just use AI for themselves. Interested in system prompts, API access, or building products.

**Emotional posture:** Practitioner respect. "You know the principles. Now apply them in a more powerful tool."

---

### Stage 4: BUILDER (Workbench / API / Agentic track)

**Capability definition:** Can design system prompts from scratch. Can define tools and function calling for the API. Can build and debug agentic loops with stop conditions and error handling. Can evaluate prompt quality systematically. Can estimate and budget token costs for a use case. Understands safety, guardrails, and prompt injection risks.

**Entry signal:** Has completed Enabled User stage (the shared foundation). May or may not have completed the Advanced Practitioner track. Has a specific build goal in mind.

**Exit signal:** Can ship an AI-powered feature, product, or internal tool that works reliably for other people.

**Emotional posture:** Builder pragmatism. "You are designing the loop, not just operating within it."

---

## 2. Full Track Map

### STAGE 1: BEGINNER (Units B01-B06)

#### B01 -- See the Absurdity
- **Description:** Recognise the two communication modes through two side-by-side absurdities -- talking to a machine like a human, and talking to a human like a machine.
- **Prerequisite:** None. No AI account required. No typing required.
- **After completing:** Learner can identify whether a given message is human-mode or machine-mode. Has experienced the "aha" of recognition. Cannot unsee it.
- **Format:** /see experience (5 screens: Intro, See, Try quiz, Know, Done).

#### B02 -- Your First Message
- **Description:** Open an AI tool for the first time, send one simple message, read the response. Zero stakes, single task, emotional decompression.
- **Prerequisite:** B01 (recognition). Needs an AI account on any supported platform.
- **After completing:** Learner has sent their first message to an AI. Knows what the interface looks like. Knows nothing broke. Knows the AI responded without judging their question.
- **Format:** New content. Platform-specific orientation (annotated descriptions of each interface). Single guided task: "Ask a question you already know the answer to."

#### B03 -- How to Edit a Prompt (Copy-Personalise-Use)
- **Description:** Learn the bracket-fill pattern. Take a template prompt, identify the editable parts, replace them with your own content, and send it.
- **Prerequisite:** B02 (has sent at least one message).
- **After completing:** Learner can take any template prompt in the course and personalise it. Understands that `[your role]` means "replace this with your actual role." Knows how to copy, edit, and paste.
- **Format:** New content. Worked example with highlighted editable fields. Before/after showing template and personalised version. Learner does it themselves with a simple task.

#### B04 -- Your Input Shapes the Output
- **Description:** Discover that the AI mirrors your communication style. Short prompt = short answer. Detailed prompt = detailed answer. This is calibration, not a bug.
- **Prerequisite:** B03 (can edit and send a prompt).
- **After completing:** Learner understands that they control the AI's output through their input style. Has tested this by sending the same request two ways.
- **Format:** Live exercise. Send the same request as (a) a one-line question and (b) a detailed paragraph. Compare responses. Observe the pattern.

#### B05 -- One Thing at a Time
- **Description:** Multi-part requests split the AI's attention. Sequential single-purpose messages produce better results and let you course-correct between steps.
- **Prerequisite:** B04 (understands input shapes output).
- **After completing:** Learner defaults to one task per message. Can break a multi-part request into sequential messages.
- **Format:** Exercise. Send a 3-part request as one message. Then send the same 3 parts as separate messages. Compare quality, length, and accuracy.

#### B06 -- Tell It When to Stop
- **Description:** Without an explicit stopping condition, the AI invents one. "Three bullet points," "under 100 words," "just the summary" -- defining "done" produces bounded, predictable output.
- **Prerequisite:** B05 (one task per message).
- **After completing:** Learner includes a stopping condition in every prompt. Can use the template slot: "[Verb] [what you want]. Stop after [condition]."
- **Format:** Exercise with Copy-Personalise-Use. Same task with and without stopping condition. Observe the difference in output scope.

---

### STAGE 1 continued / STAGE 2: ENABLED USER (Units E01-E08)

The transition from Beginner to Enabled User happens between B06 and E01. The learner has the fundamentals of input control and is now ready to shape output deliberately.

#### E01 -- The First Word Matters (Verb Choice)
- **Description:** The verb you lead with determines how much the AI does. "Fix" = minimal change. "Improve" = unlimited scope. "Explain" = read-only. Introduces the verb taxonomy and the concept of blast radius (taught as "how much the AI decides to do on its own").
- **Prerequisite:** B06 (stopping conditions).
- **After completing:** Learner can pick a verb from the taxonomy that matches their intent. Can explain why "improve" is risky and "fix" is safe. Has the verb reference as a take-home.
- **Format:** Exercise with Copy-Personalise-Use. Side-by-side comparison: same task with different verbs, showing wildly different outputs. Verb reference card (non-technical version: summarise, explain, rewrite, list, fix, draft, compare, improve).

#### E02 -- Tell It What to Leave Alone (Constraints)
- **Description:** Front-load constraints before the AI starts working. "Don't change anything else," "only this section," "stop after one pass." Corrections after the fact are expensive; prevention is cheaper.
- **Prerequisite:** E01 (verb choice).
- **After completing:** Learner includes at least one constraint in complex prompts. Uses the template: "[Verb] [what you want] -- [what to leave alone / where to stop / what not to change]."
- **Format:** Exercise with Copy-Personalise-Use. Before/after: same request with and without upfront constraints. The constrained version produces a bounded result; the unconstrained version drifts.

#### E03 -- Your Two Projects (Persistent Instructions)
- **Description:** Set up platform-level persistent instructions -- a Human Mode project and a Machine Mode project. Understand that reusable instructions save repetition.
- **Prerequisite:** E02 (constraints). Learner has sent enough messages to understand what "default behaviour" means.
- **After completing:** Learner has persistent instructions configured on their platform. Understands project-level vs. profile-level context. Can switch between Human and Machine mode projects.
- **Format:** Adapted from existing Exercise 1. Split into sub-steps. HTML bugs fixed. Bracket-fill syntax uses the B03 pattern. Recovery path included. Platform-specific content for Claude, ChatGPT, Gemini, Tines, Claude Code.

#### E04 -- The Opening Seed (Role-Task-Context-Done)
- **Description:** Write a structured first message that gives the AI everything it needs: your role, the task, the relevant context, and the done condition.
- **Prerequisite:** E03 (persistent instructions set up).
- **After completing:** Learner can write a Role-Task-Context-Done opening for a real work task. Understands that context is fuel -- more relevant detail produces better output.
- **Format:** Adapted from existing Exercise 2. Worked example next to Machine Mode template. "What would make this conversation useful?" replaced with a concrete prompt. Copy-Personalise-Use walkthrough added. Recovery path included.

#### E05 -- What Just Happened? (Reading AI Output)
- **Description:** Read the whole response before reacting. The first output is a draft, not a final product. Learn to spot when the AI misunderstood you (generic language, wrong framing, invented details) and what to do next.
- **Prerequisite:** E04 (has written an opening seed and received a substantial response).
- **After completing:** Learner reads and evaluates AI output before using it. Can identify the three main signals of misunderstanding. Knows the three response options: ask for changes, start over, or take what is useful.
- **Format:** New content (was planned as Exercise 5 "Read the Whole Thing" but repositioned earlier). Output review checklist as take-home artefact.

#### E06 -- When It Goes Wrong, Start Over (Restate, Don't Patch)
- **Description:** Layering corrections ("no, I meant X not Y") compounds confusion. When the direction needs to change significantly, restate the full request from scratch. Start a new conversation when the current one degrades.
- **Prerequisite:** E05 (has experienced receiving off-target output and trying to correct it).
- **After completing:** Learner knows when to restate vs. when to start a new conversation. Can write a re-seed (a fresh opening that carries forward the essential context from a degraded session). Understands the context flooding rule.
- **Format:** Combines planned Exercise 6 (Migration & Re-seed) with the "restate, don't patch" principle. Re-seed template as take-home artefact.

#### E07 -- Get the Plan First (Plan Before Execute)
- **Description:** For multi-step work, separate planning from execution. "Before doing anything, tell me what you plan to do" costs one extra message but prevents costly mid-task corrections.
- **Prerequisite:** E06 (understands restating and fresh starts).
- **After completing:** Learner asks for a plan before execution on any task longer than 2-3 steps. Can evaluate a plan and redirect before work begins.
- **Format:** Exercise with Copy-Personalise-Use. Multi-step task: first without asking for a plan (observe the drift), then with a planning turn first. Compare effort and quality.

#### E08 -- Your Reference Card (Personal Synthesis)
- **Description:** Synthesise everything learned into a personal prompt reference card. Not a course-provided template -- the learner builds their own from what they have internalised.
- **Prerequisite:** E07 (all prior units).
- **After completing:** Learner has a personal, portable reference card with their own language for the principles they use most. This is the artefact that confirms they have crossed the Enabled User threshold.
- **Format:** Adapted from planned Exercise 8. Guided synthesis: "Which 3-5 principles do you actually use? Write them in your own words." Output ladder exercise (3 formats for the same content) from planned Exercise 7 folded in here.

---

**=== ENABLED USER THRESHOLD ===**

_The learner can now use AI reliably for their own work across platforms. They can write effective prompts, read output critically, recover from problems, and adapt templates independently. Everything above this line is platform-agnostic._

---

### TOOLING FORK

At this point the curriculum splits. Both tracks share units B01-E08 as their foundation. The learner chooses based on their goal:

- **"I want to use AI more powerfully in my daily work"** --> Advanced Practitioner (Claude Code)
- **"I want to build AI-powered features or tools for others"** --> Builder (Workbench / API)

A learner may complete one track and then do the other. They are parallel, not sequential.

---

### STAGE 3: ADVANCED PRACTITIONER -- Claude Code Track (Units AP01-AP10)

#### Cost / Capability Warning (Gate)

_Before entering this track, the learner must understand: Claude Code is a paid, metered tool. Every prompt, every tool call, every agent delegation costs tokens, which cost money. The course will teach cost awareness before any agentic content. Typical daily use during learning may cost $5-20/day depending on usage patterns. This track assumes comfort with (or willingness to learn) a command-line interface._

#### AP01 -- What Is Claude Code?
- **Description:** Orientation to Claude Code: what it is, how it differs from consumer AI chat, why someone would use it. Not installation yet -- just the mental model.
- **Prerequisite:** E08 (Enabled User threshold).
- **After completing:** Learner understands that Claude Code is a CLI-based AI assistant that can read files, write code, run commands, and use tools. Understands the permission model conceptually. Knows this is a different kind of AI interaction from ChatGPT/Claude.ai.
- **Format:** New content. The beginner-to-advanced bridge (flagged as the single most important missing piece in 02-advanced-content-gaps.md).

#### AP02 -- Installation and First Session
- **Description:** Install Claude Code, authenticate, run a first session. Complete one familiar task (something from the Enabled User stage) in Claude Code to see the difference.
- **Prerequisite:** AP01.
- **After completing:** Claude Code is installed and working. Learner has completed one task and seen the tool call / permission model in action. Has approved and rejected at least one tool call.
- **Format:** New content. Step-by-step walkthrough with recovery paths for common installation issues.

#### AP03 -- Cost and Token Economics
- **Description:** What tokens are (conceptually). How prompt length relates to cost. How tool calls add to cost. How to read a session's token usage. How to set a mental budget before starting a task. Concrete examples: "this 5-minute session cost $X because Y."
- **Prerequisite:** AP02 (has run at least one Claude Code session).
- **After completing:** Learner can estimate rough cost before starting a task. Can read token usage output. Has a mental model of what makes sessions expensive (long context, many tool calls, agent delegation).
- **Format:** New content. The cost gate -- prerequisite for all agentic content in both tracks.

#### AP04 -- CLAUDE.md: Your Persistent Instructions
- **Description:** Write your first CLAUDE.md file, test it, observe the effect. The Claude Code equivalent of persistent instructions, but more powerful: project-level, workspace-level, and user-level.
- **Prerequisite:** AP03.
- **After completing:** Learner has a working CLAUDE.md with at least 3 project-specific instructions. Has tested with and without to see the difference.
- **Format:** Adapted from existing Layer 3 (Session Hygiene) content. Declarative content exists; hands-on exercise is new. Copy-Personalise-Use walkthrough for the CLAUDE.md template.

#### AP05 -- Session Hygiene
- **Description:** Session scoping with `/clear`. Front-loading constraints before the model acts. When to start a new session vs. continue. The advanced version of E06 (restate, don't patch) applied to Claude Code's session model.
- **Prerequisite:** AP04.
- **After completing:** Learner uses `/clear` between unrelated tasks. Front-loads constraints in Claude Code's context. Knows when a session has gone stale.
- **Format:** Adapted from existing Layer 3 content. Examples rewritten to include non-developer tasks alongside developer tasks.

#### AP06 -- Context Awareness and Compaction
- **Description:** How Claude Code's context window fills up, what happens when it compacts (summarises), and how to write messages that survive compaction. Manual checkpointing before auto-compaction fires. Recognising context rot signals.
- **Prerequisite:** AP05 (session hygiene). This is the advanced version of "context is fuel" -- here the learner discovers context is also finite and degrades.
- **After completing:** Learner can recognise the symptoms of context degradation (model re-asks questions, terminology drift, forgotten constraints). Can write messages that preserve critical information through compaction. Can checkpoint manually.
- **Format:** Adapted from existing Layer 4 content. Strip source code references (`services/compact/prompt.ts`). Keep the principles and symptom tables. This is genuinely novel content with no equivalent elsewhere.

#### AP07 -- Output Engineering in Claude Code
- **Description:** Plan mode (`/plan`). Separating plan from execution at the tool level. Format control for code, documentation, and structured output. The Claude Code-specific application of E07 (plan before execute).
- **Prerequisite:** AP06.
- **After completing:** Learner uses plan mode for complex tasks. Can specify output format for different output types. Understands when to let the model choose format vs. when to dictate it.
- **Format:** Adapted from existing Layer 5 content. Minor edits to remove assumptions; mostly platform-agnostic already.

#### AP08 -- Tool Fluency
- **Description:** Understanding Claude Code's tool hierarchy: Read, Glob, Grep, Bash, Agent. How the model selects tools. How to guide tool selection by naming the tool in your prompt. Cost hierarchy of tool calls.
- **Prerequisite:** AP07. Requires AP03 (cost awareness) as conceptual foundation.
- **After completing:** Learner can name the appropriate tool in their prompt. Understands why `Read` is cheaper than `Bash`. Can read tool call output and decide whether to approve.
- **Format:** Adapted from existing Layer 6 content. Prerequisite orientation to Claude Code's tool model is new.

#### AP09 -- Agent Delegation and Briefing
- **Description:** When to delegate to a subagent vs. do it in the main session. How to brief a subagent with zero context (the 5-part brief: goal, context, scope, output format, length target). Context isolation as the core value. The anti-pattern: "never delegate understanding."
- **Prerequisite:** AP08 (tool fluency) + AP03 (cost awareness -- delegation multiplies cost).
- **After completing:** Learner can decide when delegation is worth the cost. Can write a subagent brief that produces good results without leaking main-session context. Understands that a subagent runs its own context window.
- **Format:** Adapted from existing Layer 7 content. Excellent as written; needs cost gate before entry. Add non-developer example alongside existing developer examples.

#### AP10 -- Multi-File Workflows (End-to-End)
- **Description:** A realistic multi-step workflow: start a feature or project, iterate across files, test, commit. Bridges the gap between "write a good prompt" and "use Claude Code to build something end-to-end." Includes error recovery and debugging -- what to do when the model produces wrong output, gets stuck in a loop, or makes a change you did not want.
- **Prerequisite:** AP09 (all prior Claude Code units).
- **After completing:** Learner can complete a multi-step project in Claude Code from start to finish. Can recover from bad output using git diff review and undo patterns. Has completed at least one end-to-end workflow independently.
- **Format:** New content. Realistic project exercise with checkpoints. Error recovery patterns as take-home reference.

---

### STAGE 4: BUILDER -- Workbench / API / Agentic Track (Units BU01-BU10)

#### Cost / Capability Warning (Gate)

_Before entering this track, the learner must understand: API usage is billed per token. Agentic loops can multiply cost rapidly -- a single loop iteration may cost more than a full consumer chat session. This track teaches cost estimation and budgeting before any agentic design. The learner should have a specific build goal in mind before starting._

#### BU01 -- The Shift: From User to Designer
- **Description:** The conceptual transition from prompting for yourself to designing AI experiences for others. What changes: you are no longer the human in the loop -- you are designing the loop itself. Introduction to the API and Workbench as builder tools.
- **Prerequisite:** E08 (Enabled User threshold). May optionally have completed AP01-AP10.
- **After completing:** Learner understands the difference between using AI and building with AI. Knows what the API is and why it exists. Has opened the Anthropic Workbench.
- **Format:** New content. The bridge module for the Builder track.

#### BU02 -- API Fundamentals
- **Description:** API keys, request structure, response format, streaming. The difference between system/user/assistant messages at the API level. Making your first API call.
- **Prerequisite:** BU01.
- **After completing:** Learner can make an API call and receive a response. Understands the message structure. Has an API key set up safely.
- **Format:** New content.

#### BU03 -- System Prompt Design
- **Description:** How to write a system prompt from scratch. Persona design, instruction ordering, behaviour specification. The difference between a good system prompt and a conversation opener.
- **Prerequisite:** BU02.
- **After completing:** Learner can write a system prompt that produces consistent, persona-appropriate responses. Can iterate on system prompts in the Workbench.
- **Format:** New content.

#### BU04 -- Cost Estimation and Budgeting
- **Description:** Estimating total token cost for a use case. Setting token budgets. Monitoring spend. The relationship between prompt length, response length, and cost. Cache economics at a conceptual level.
- **Prerequisite:** BU03.
- **After completing:** Learner can estimate the per-request cost of their system prompt + expected user input + expected response. Can set a budget and monitor against it.
- **Format:** New content. The Builder track's cost gate. Can reference AP03 content for learners who did both tracks.

#### BU05 -- Tool Definition and Function Calling
- **Description:** How to define tools (functions) for the API. Tool schemas, parameter types, descriptions. How the model decides which tool to call. Testing tools in the Workbench.
- **Prerequisite:** BU04.
- **After completing:** Learner can define a tool, test it in the Workbench, and see the model call it correctly. Understands that tool descriptions are part of the prompt and affect cost.
- **Format:** New content.

#### BU06 -- The Static/Dynamic Prompt Boundary
- **Description:** What stays the same across all users (static) vs. what changes per request (dynamic). Cache economics: static content is cached and cheap; dynamic content is computed and expensive. Designing the boundary deliberately.
- **Prerequisite:** BU05.
- **After completing:** Learner can identify the static vs. dynamic boundary in their own system. Can design for cache efficiency. Understands `SYSTEM_PROMPT_DYNAMIC_BOUNDARY` conceptually.
- **Format:** Adapted from existing Layer 8 (Production Architecture) content. The strongest existing builder-track material.

#### BU07 -- Agentic Loop Design
- **Description:** Building your own agentic loops: tool use cycles, stop conditions, error handling, human-in-the-loop patterns. Not using someone else's agent tool -- designing the loop yourself.
- **Prerequisite:** BU06 + BU04 (cost gate -- loops multiply cost).
- **After completing:** Learner can design a simple agentic loop with a clear stop condition and error handling. Can estimate the cost of a loop iteration. Knows when a loop needs a human checkpoint.
- **Format:** New content.

#### BU08 -- Evaluation and Iteration
- **Description:** How to evaluate prompt quality systematically. A/B testing system prompts. Tracking what changed and why. Managing prompt versions. Building evaluation sets.
- **Prerequisite:** BU07.
- **After completing:** Learner can create an evaluation set for their use case. Can run A/B comparisons in the Workbench. Has a prompt versioning workflow.
- **Format:** New content.

#### BU09 -- Safety and Guardrails
- **Description:** Prompt injection: what it is, how it works, how to mitigate it. Output validation. Content filtering. Rate limiting. What to do when users try to break your system.
- **Prerequisite:** BU08.
- **After completing:** Learner can identify prompt injection risks in their system. Has implemented at least one guardrail. Understands that safety is ongoing, not a one-time setup.
- **Format:** New content.

#### BU10 -- Ship It (Production Readiness)
- **Description:** From Workbench prototype to deployed system. Monitoring, logging, error handling in production. When to optimise and when to ship. The production architecture checklist.
- **Prerequisite:** BU09.
- **After completing:** Learner has a checklist for production readiness. Has deployed or is ready to deploy their first AI-powered feature.
- **Format:** New content, incorporating relevant parts of existing Layer 8 content.

---

## 3. Gradient Health Check

### Transition analysis: every adjacent pair

| Transition | Cognitive leap | Risk | Bridge needed? |
|------------|---------------|------|----------------|
| B01 to B02 | Low-moderate | Learner goes from passive recognition (no AI tool needed) to active use (needs an account, needs to type). This is the single steepest cliff for nervous beginners. | **Yes -- B02 must include platform orientation: "here is what the interface looks like, here is where you type, here is what happens when you press send."** |
| B02 to B03 | Low | Learner has sent a message; now they learn the bracket-fill pattern. Natural progression. | No. |
| B03 to B04 | Low | Both are observation exercises. B03 teaches editing; B04 teaches noticing input/output relationship. | No. |
| B04 to B05 | Low | From "your style shapes output" to "one thing at a time." Simple behavioural rule. | No. |
| B05 to B06 | Low | From "one thing at a time" to "tell it when to stop." Same category: output boundary control. | No. |
| B06 to E01 | Low-moderate | From simple stopping conditions to verb taxonomy. The verb table is more conceptual than prior units. | **Smooth if E01 leads with concrete examples before introducing the table. Do not open with the taxonomy -- open with two prompts using different verbs and let the pattern emerge.** |
| E01 to E02 | Low | Verb choice sets scope; constraints set the ceiling. Natural progression. | No. |
| E02 to E03 | Moderate | From individual prompt techniques to platform configuration (persistent instructions). This is a complexity jump -- the learner is now configuring their tool, not just writing prompts. | **E03 must explicitly frame the transition: "You now know how to write good prompts. Let's save your best instructions so you don't have to repeat them." Keep the focus on "saving yourself repetition," not on "platform configuration."** |
| E03 to E04 | Low | Persistent instructions are set up; now write a structured opening message. Natural next step. | No. |
| E04 to E05 | Low-moderate | From writing prompts to reading output. Different cognitive skill (production vs. evaluation). | **Smooth if E05 opens with: "You've learned to write good prompts. But the prompt is only half the skill. Now: what do you do with what comes back?"** |
| E05 to E06 | Low | From reading output to deciding when to start over. Natural: you read the output, it's wrong, now what? | No. |
| E06 to E07 | Low | From recovery (starting over) to prevention (planning). Logical sequence. | No. |
| E07 to E08 | Low | Synthesis exercise. Consolidates everything prior. | No. |
| E08 to AP01 | **High** | From platform-agnostic consumer AI to CLI-based developer tool. This is the biggest leap in the entire curriculum. Different interface paradigm, different cost model, different mental model. | **AP01 (the bridge module) must do heavy lifting: (1) acknowledge the learner has been using a different tool, (2) explain why Claude Code is different, (3) show what it can do that consumer tools cannot, (4) be honest about the cost, (5) give explicit permission to decide this track is not for them.** |
| AP01 to AP02 | Low | Orientation to installation. Natural next step after deciding to proceed. | No. |
| AP02 to AP03 | Low | From first session to understanding what it cost. Natural curiosity after seeing tool calls. | No. |
| AP03 to AP04 | Low | From cost awareness to CLAUDE.md. Setting up the tool's persistent instructions -- mirrors E03 in the consumer track. | No. |
| AP04 to AP05 | Low | CLAUDE.md to session hygiene. Same domain: managing your Claude Code environment. | No. |
| AP05 to AP06 | Moderate | From session management to compaction internals. More abstract -- the learner needs to understand what happens "under the hood." | **AP06 should open with an observable symptom ("the AI started repeating itself / forgot what I told it") before explaining the mechanism. Lead with the experience, then explain why it happened.** |
| AP06 to AP07 | Low | Context awareness to output engineering. Both are about controlling what the AI does. | No. |
| AP07 to AP08 | Moderate | From output control to tool hierarchy. Requires understanding that Claude Code uses internal tools -- a new concept. | **AP08 needs a prerequisite paragraph: "Every time Claude Code reads a file, searches for something, or runs a command, it's using a tool. You've been approving these tool calls since AP02. Now you'll learn to guide which tool it picks."** |
| AP08 to AP09 | Low-moderate | From guiding tool selection to delegating to subagents. Subagents are a new concept but build naturally on tool fluency. | **Ensure AP09 opens with: "Sometimes the best tool is another Claude Code session." Frame delegation as a tool selection decision, not a new paradigm.** |
| AP09 to AP10 | Low | From individual techniques to an end-to-end workflow. Capstone exercise. | No. |
| E08 to BU01 | **High** | From consumer AI user to API/system designer. Similar magnitude to E08-to-AP01 but in a different direction -- less about interface change, more about role change (user to builder). | **BU01 must frame the shift explicitly: "Until now, you've been the person talking to the AI. Now you'll design the conversation that other people have with the AI." Use a concrete example the learner has already experienced (e.g., the prompt-starter) as a case study: "Someone designed this experience for you. Now you'll learn to design experiences like this."** |
| BU01 to BU02 | Moderate | From conceptual orientation to making an API call. Technical jump. | **BU02 should start with the simplest possible API call (curl or a 5-line script) before introducing the full request structure. Let the learner see a response before explaining the anatomy.** |
| BU02 to BU03 | Low | From API basics to system prompts. Natural: "you can send messages; now design the instructions that shape every response." | No. |
| BU03 to BU04 | Low | System prompts to cost estimation. Natural: "you've written a system prompt; now how much does it cost to run?" | No. |
| BU04 to BU05 | Moderate | From cost awareness to tool definition. New concept (function calling). | **BU05 should start with: "You've been using tools as a Claude Code user (AP track) or you've seen the AI take actions (consumer track). Now you'll define your own tools." Use a very simple tool (e.g., get_weather) before anything complex.** |
| BU05 to BU06 | Low | From tool definition to cache boundary design. Both are system architecture. | No. |
| BU06 to BU07 | Moderate | From static architecture to dynamic agentic loops. Significant complexity increase. | **BU07 should start with the simplest possible loop (one tool, one stop condition, no branching) before introducing complex patterns. Frame it as: "A loop is just: call a tool, check the result, decide whether to continue."** |
| BU07 to BU08 | Low | From building to evaluating. Natural: "you built it; now how do you know if it's good?" | No. |
| BU08 to BU09 | Low | From evaluation to safety. Natural: "it works; now how do you keep it safe?" | No. |
| BU09 to BU10 | Low | From safety to shipping. Capstone. | No. |

---

## 4. Tooling Fork

### Where the fork happens

The fork occurs at the **Enabled User threshold** (after unit E08). Everything before E08 is platform-agnostic and shared by both tracks. Everything after E08 is tool-specific.

```
B01 ── B02 ── B03 ── B04 ── B05 ── B06 ── E01 ── E02 ── E03 ── E04 ── E05 ── E06 ── E07 ── E08
                                                                                                  |
                                                                                          ┌───────┴───────┐
                                                                                          |               |
                                                                                     AP01-AP10       BU01-BU10
                                                                                    Claude Code     Workbench/API
                                                                                   (Practitioner)     (Builder)
```

### Shared foundation (B01-E08): 14 units

These 14 units teach principles that apply to any AI tool: verbosity mirroring, one-task-per-message, stopping conditions, verb choice, constraints, persistent instructions, opening seeds, output review, recovery, planning, and personal synthesis. No tool-specific content. Works with Claude.ai, ChatGPT, Gemini, Tines, or Claude Code in consumer mode.

### Claude Code track (AP01-AP10): 10 units

Requires: terminal comfort (or willingness to learn), Claude Code subscription/billing, the Enabled User foundation.

### Builder track (BU01-BU10): 10 units

Requires: Anthropic API access (billing), a build goal, the Enabled User foundation. Does NOT require the Claude Code track -- a builder can go directly from E08 to BU01.

### Cost / capability warning content

The following warning should appear at the entry point to each post-fork track and be reiterated before specific high-cost content:

**For the Advanced Practitioner track (AP01):**
> Claude Code is a paid, metered tool. It is not free like ChatGPT's basic tier or Claude.ai's free tier. Every prompt you send, every file Claude Code reads, every command it runs costs tokens, and tokens cost money. During this course, expect to spend approximately $5-20 per day of active use. You can monitor your spending in your Anthropic dashboard. If cost is a concern, the Enabled User skills you already have work on free-tier tools -- this track is for people who want more power and are willing to pay for it.

**For the Builder track (BU01):**
> API usage is billed per token. A single API call costs fractions of a cent. An agentic loop that runs 50 iterations can cost dollars. A production system serving 1,000 users can cost hundreds of dollars per day. This track teaches you to estimate and control these costs before you build. You will need an Anthropic API key with billing enabled. Start with a small budget ($10-20) and increase as you learn to estimate costs accurately.

**Before agentic content specifically (AP09, BU07):**
> Agent delegation multiplies cost. A subagent or agentic loop runs its own context window -- it is a separate billing event. Before delegating or building a loop, estimate: "How many iterations will this take? What is each iteration's approximate cost? Am I OK with that total?" If you cannot answer these questions, return to the cost awareness unit (AP03 or BU04) before proceeding.

---

## 5. Salvage Map

### Content that slots directly into a unit

| Existing content | Target unit | Adaptation needed |
|-----------------|-------------|-------------------|
| `/see` experience (5 screens) | **B01** | Fix quiz Q5 (trick question). Reduce Done screen CTAs to 1 primary. Add link to /course from Done screen. |
| Daily cards 1-30 | **B01** (companion content) | No changes to content. Reposition as companion to B01, not standalone social content. |
| Daily cards 31-40 | **E06-E08** (companion content) | Reposition from pre-course to mid-course. They assume an established AI workflow. |
| Exercise 1 (Your Two Projects) | **E03** | Fix HTML bugs. Split into sub-steps. Add bracket-fill tutorial (using B03 pattern). Add recovery path. Trim subtext. Remove "Note to reader" blocks from copy-paste areas. |
| Exercise 2 (The Opening Seed) | **E04** | Fix HTML bugs. Add worked example next to Machine Mode template. Replace metacognitive Human Mode question. Add Copy-Personalise-Use walkthrough. Add recovery path. |
| Prompt-starter (`/prompt-starter.html`) | **B02 / E03-E04** (reference) | Restyle to match Linguist design system. Remove jargon from dispatch note and Step 5. Switch to relative URLs. Add inbound links. Could serve as an AI-guided companion to B02-E04 rather than a standalone experience. |
| Guide (`/guide/index.html`) | **Reference material** | Cut by ~40%. Remove redundancy with PDF and Handbook. Reposition as a reference page, not a standalone experience. Framework cards (Think/Collab/Dispatch/Iterate) can support E07. |
| PDF Booklet (`/pdf/index.html`) | **E08** (take-home companion) | Deduplicate with Guide. Good as a printable post-course artefact after E08 completion. |
| Verb taxonomy from `claude-code-best-practices-deep.md` | **E01** | Strip all developer framing. Replace 7 developer verbs with 8 non-technical verbs (summarise, explain, rewrite, list, fix, draft, compare, improve). Build as verb reference page. Keep "blast radius" concept but teach through examples, not jargon. |
| Verbosity mirroring from best-practices files | **B04** | Extract and present as a standalone principle. One sentence, one example. Already stripped of Claude Code framing in 01-claude-code-synthesis.md. |
| Constraint front-loading from best-practices files | **E02** | Already generalised in 01-claude-code-synthesis.md as "tell the AI what to leave alone." Needs exercise built around it. |
| Layer 3 content (Session Hygiene) from `course/03-session-hygiene.md` | **AP04, AP05** | Keep declarative content. Add hands-on exercises. Add non-developer examples. Strip source code references. |
| Layer 4 content (Context Awareness) from `course/04-context-awareness.md` | **AP06** | Keep compaction survival content (genuinely novel). Strip `services/compact/prompt.ts` references. Add observable symptom framing before mechanism explanation. |
| Layer 5 content (Output Engineering) from `course/05-output-engineering.md` | **AP07** | Minor edits. Already mostly platform-agnostic. |
| Layer 6 content (Tool Fluency) from `course/06-tool-fluency.md` | **AP08** | Add prerequisite orientation paragraph. Content is sound for its audience. |
| Layer 7 content (Agent Design) from `course/07-agent-design.md` | **AP09** | Excellent as written. Add cost gate before entry. Add one non-developer example. |
| Layer 8 content (Production Architecture) from `course/08-production-architecture.md` | **BU06, BU10** | Split between static/dynamic boundary (BU06) and production readiness (BU10). Strong content for its audience. |
| Layers 1-2 content (Mental Model, Communication) from `course/01-mental-model.md`, `course/02-communication-primitives.md` | **Shared foundation principles** (inform B04-E02) | Strip Claude Code source code references. Keep principles. These layers' content is already covered by the generalised principles in the shared foundation, but can serve as deeper reading for advanced learners. |
| Handbook (`/handbook/index.html`) | **Discard or heavily rework** | Part 5 rehashes all 8 principles with heavy overlap with PDF and Guide. "Third layer" reference unexplained. Jargon throughout. Not worth adapting -- the same content is better served by E08 (personal reference card) and the Guide (trimmed). |

### Content to build from scratch

| Unit | Priority | Notes |
|------|----------|-------|
| **B02** -- Your First Message | **Critical** | The single most important gap. Without this, nervous beginners cannot reach E01. |
| **B03** -- Copy-Personalise-Use walkthrough | **Critical** | Project requirement, not implemented anywhere. Needs to be a repeatable component pattern used in every subsequent exercise. |
| **E05** -- What Just Happened? (Reading output) | **High** | Was planned as Exercise 5 but repositioned earlier. No existing content addresses what to do after the AI responds. |
| **AP01** -- What Is Claude Code? | **Critical** for advanced track | The beginner-to-advanced bridge. Without it, no Enabled User graduate can enter the Claude Code track. |
| **AP02** -- Installation and First Session | **High** | Step-by-step walkthrough. |
| **AP03** -- Cost and Token Economics | **High** | The cost gate. Required before any agentic content. |
| **AP10** -- Multi-File Workflows | **High** | Bridges "write a good prompt" to "build something end-to-end." |
| **BU01-BU05, BU07-BU10** -- Entire Builder track except BU06 | **Medium** (future) | Currently zero Workbench/API content exists. All new. |

### Summary counts

| Category | Count |
|----------|-------|
| Total units in curriculum | 28 |
| Units with existing content that can be adapted | 12 |
| Units requiring new content from scratch | 14 |
| Units that are a mix (existing content + new exercise/bridge) | 2 |

---

## Appendix A: Unit Dependency Graph

```
B01 (See the Absurdity)
 └─> B02 (Your First Message)
      └─> B03 (Copy-Personalise-Use)
           └─> B04 (Input Shapes Output)
                └─> B05 (One Thing at a Time)
                     └─> B06 (Tell It When to Stop)
                          └─> E01 (Verb Choice)
                               └─> E02 (Constraints)
                                    └─> E03 (Persistent Instructions)
                                         └─> E04 (Opening Seed)
                                              └─> E05 (Reading Output)
                                                   └─> E06 (Restate / Start Over)
                                                        └─> E07 (Plan Before Execute)
                                                             └─> E08 (Reference Card)
                                                                  |
                                                          ┌───────┴────────┐
                                                          |                |
                                                        AP01             BU01
                                                          |                |
                                                        AP02             BU02
                                                          |                |
                                                        AP03             BU03
                                                          |                |
                                                        AP04             BU04
                                                          |                |
                                                        AP05             BU05
                                                          |                |
                                                        AP06             BU06
                                                          |                |
                                                        AP07             BU07
                                                          |                |
                                                        AP08             BU08
                                                          |                |
                                                        AP09             BU09
                                                          |                |
                                                        AP10             BU10
```

All dependencies are strictly linear within each track. No cross-track dependencies. A learner who completes E08 can enter either track without the other.

---

## Appendix B: Content Design Rules (Binding)

These rules apply to every unit in the curriculum. They are compiled from the build context, review findings, project memory, and synthesis documents.

1. **Copy-Personalise-Use in every exercise.** No prompt block without a "How to edit this" section. Treat editing as a taught skill. (Source: project memory, review findings.)
2. **Non-technical examples only in B01-E08.** If a principle came from a developer context, the example must be translated. (Source: 01-synthesis, Section 6.4.)
3. **Never frame as prompt engineering.** Always frame as "communicating clearly with a machine." (Source: build context, 01-synthesis, Section 6.3.)
4. **Assume low general tech confidence.** Explain copy/paste, text editing, browser behaviour where needed. Not just low AI knowledge. (Source: project memory.)
5. **Human/Machine binary is the entry point.** Complexity (Dump mode, collaboration, spectrum) arrives in E06-E08. (Source: 01-synthesis, Section 6.2.)
6. **"Context is fuel" is the beginner framing.** "Context accumulates and degrades" arrives in AP06. Do not present both simultaneously to beginners. (Source: 01-synthesis, Section 6.1.)
7. **Recovery paths in every exercise.** "If your output doesn't look right, here's what to check." Permission to start over without it being a failure. (Source: 03-beginner-gaps, Section 3.4.)
8. **Emotional permission throughout.** "Nothing will break. The machine does not mind." Reframe evaluation steps from "did you get this right?" to "what did you notice?" (Source: 03-beginner-gaps, Section 3.7.)
9. **AP track: dual examples.** Every AP unit should include both a non-developer example and a developer example where applicable. The audience includes data analysts, content professionals, and researchers, not only developers. (Source: 02-advanced-gaps, Section 7.)
10. **Cost warnings before cost.** No unit that involves token expenditure should proceed without the learner having completed the relevant cost awareness unit (AP03 or BU04). (Source: 02-advanced-gaps, Section 4.)
