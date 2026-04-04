# Advanced Content Gaps Analysis

_Produced 2026-04-02. For use by downstream agents building the final curriculum plan._

---

## 1. What Exists -- Map of Current Advanced Content

### Source materials

The advanced track currently lives in three overlapping documents:

| Document | Content | Form |
|----------|---------|------|
| `course/01-mental-model.md` through `course/08-production-architecture.md` (8 modules) | 18 skills across 8 layers, from mental model to production prompt architecture | Structured skill definitions with 3 worked examples each (coding, data/analytics, content/research) |
| `course/prompting-ai-agent-skills-curriculum.md` | Same 18 skills in a single long-form document; near-identical text to the 8 modules | Planning artefact / master reference |
| `course/00-index.md` | Skill stack index with one-line summaries and layer map | Navigation / table of contents |

The content in `prompting-ai-agent-skills-curriculum.md` and the 8 individual module files is essentially the same material split two ways. The curriculum document is the master; the modules are its chapters.

### What each layer covers

| Layer | Module | Skills | What It Teaches | Assumed Level |
|-------|--------|--------|-----------------|---------------|
| 1 | `01-mental-model.md` | 1-3 | The model executes text, not intent. Context window is finite and degrades. Tools are the model's action layer. | Conceptual -- could work for any level if reframed. Currently assumes developer context (React, BigQuery, CLI tools). |
| 2 | `02-communication-primitives.md` | 4-6 | Verb choice as scope signal (blast radius). Target specificity (file paths, line numbers). Constraint setting (scope ceilings). | Intermediate -- requires understanding of what "the model decides for you" means in practice. All examples are developer/analyst tasks. |
| 3 | `03-session-hygiene.md` | 7-9 | CLAUDE.md as persistent instructions. Session scoping (`/clear`). Front-loading constraints before the model acts. | Claude Code-specific. Assumes daily use of an AI coding assistant. References `utils/claudemd.ts`, `autoCompact.ts`. |
| 4 | `04-context-awareness.md` | 10-12 | Context rot recognition (symptoms table). Writing for compaction survival. Manual checkpointing before auto-compaction fires. | Advanced -- requires understanding compaction mechanics. References `services/compact/prompt.ts` internals. |
| 5 | `05-output-engineering.md` | 13-14 | Separating plan from execution (plan then confirm). Output format control (structure, length, reasoning, audience, tone). | Intermediate-advanced. Principles are universal but examples lean technical. |
| 6 | `06-tool-fluency.md` | 15 | Guiding tool selection: Read vs Grep vs Bash vs Agent. Cost hierarchy. Naming the tool in your prompt. | Claude Code-specific. The tool names (Read, Glob, Grep, Agent) are Claude Code internals. |
| 7 | `07-agent-design.md` | 16-17 | Delegation decision (when to use a subagent vs do it in main session). Briefing a subagent with zero context. Context isolation as the core value. | Advanced. Requires understanding of context windows, token cost, and subagent architecture. All examples assume the Claude Code Agent tool. |
| 8 | `08-production-architecture.md` | 18 | Static/dynamic prompt boundary. `SYSTEM_PROMPT_DYNAMIC_BOUNDARY`. Cache economics at fleet scale. Tool description stability. | Expert / builder. Assumes the learner is deploying AI systems to multiple users. References Claude Code source constants. |

### What's strong

1. **The layer model is sound.** The 8-layer stack has a genuine pedagogical gradient -- each layer does build on the one below it. The claim "a person who hasn't internalised Layer 1 will make the same mistakes at Layer 4, just in a more expensive place" is accurate and well-demonstrated.

2. **The worked examples are high quality.** Every skill has three domain-specific examples (coding, data/analytics, content/research), each with a clear WITHOUT/WITH contrast. The failure modes are realistic, not strawmen.

3. **The verb taxonomy is the single strongest artefact.** The blast-radius table in Skill 4 (Layer 2) is immediately actionable. Both review agents flagged it as the most operationally useful thing the course could produce.

4. **Compaction awareness (Layer 4) is genuinely novel.** Most AI literacy content does not teach learners how to write messages that survive context summarisation. This is durable, practical knowledge with no equivalent in competing courses.

5. **The agent briefing framework (Layer 7) is excellent.** The 5-part brief structure (goal, context, scope, output format, length target) is actionable and memorable. The anti-pattern ("never delegate understanding") is a key insight.

6. **Production architecture (Layer 8) is rare content.** The static/dynamic boundary concept with concrete cache math is genuinely useful for builders and not available elsewhere in accessible form.

---

## 2. What's Missing

### 2.1 Gaps relative to "building independently with Claude Code"

| Gap | Description | Why It Matters |
|-----|-------------|----------------|
| **No onboarding to Claude Code itself** | The modules assume the learner is already using Claude Code. There is no content covering: what Claude Code is, how to install it, what happens when you first run it, what the permission model looks like, how to approve/reject tool calls. | A learner entering the advanced track from the beginner course has used ChatGPT/Claude web/Gemini. They have never seen a CLI-based AI tool. The jump is enormous. |
| **No CLAUDE.md tutorial** | Skill 7 explains what CLAUDE.md is and shows examples, but there is no exercise where the learner writes their first CLAUDE.md, tests it, and observes the effect. | CLAUDE.md is the single most impactful thing a Claude Code user can set up. Teaching it declaratively without a hands-on exercise wastes the opportunity. |
| **No cost awareness content** | Token cost, billing, metered usage, and the relationship between prompt length and cost are never discussed. The modules reference "expensive" tool chains but never quantify what "expensive" means in dollars or tokens. | The brief for the advanced track explicitly flags that "agents can become very costly." Learners need a concrete mental model of cost before entering agentic territory. |
| **No error recovery / debugging content** | No skill covers what to do when the model produces wrong output, gets stuck in a loop, or makes a change you didn't want. No content on `git diff` review, undo patterns, or how to recover from a bad agent run. | This is the number one anxiety for new Claude Code users: "what if it breaks something?" Not addressing it leaves the learner without a safety net. |
| **No multi-file workflow content** | Skills teach individual prompt craft but never cover a realistic multi-step workflow: start a feature, iterate across files, test, commit. The gap between "write a good prompt" and "use Claude Code to build a feature end-to-end" is unaddressed. | The goal is "capable independent use." Independent use means multi-step workflows, not isolated prompts. |
| **No MCP (Model Context Protocol) content** | MCP is mentioned in the beginner course glossary and setup screen but never explained. The advanced modules don't cover it at all. | MCP is increasingly how Claude Code connects to external tools and data sources. Advanced users will encounter it. |
| **No Workbench content** | The Anthropic Workbench (console.anthropic.com) is not mentioned anywhere in the advanced modules. | The brief specifies Workbench as part of the advanced track. There is zero content. |
| **No evaluation / testing content** | Layer 8 mentions "evaluation and instrumentation" as "beyond this course" but it is essential for anyone building with the API or Workbench. | A builder who cannot evaluate prompt quality will not improve systematically. |
| **No prompt versioning or iteration content** | No skill covers how to iterate on a prompt systematically -- A/B testing system prompts, tracking what changed and why, managing prompt versions. | This is the core workflow in Workbench and essential for any production use. |

### 2.2 Gaps relative to "building independently with Workbench / agentic use cases"

| Gap | Description |
|-----|-------------|
| **No API fundamentals** | No content on API keys, request structure, response format, streaming, or the difference between system/user/assistant messages at the API level. |
| **No system prompt design** | Layer 8 covers the static/dynamic boundary but not how to write a good system prompt from scratch -- persona design, instruction ordering, behaviour specification. |
| **No tool definition / function calling** | The modules teach how to guide existing tools but not how to define your own tools for the API. Tool definition is the core of Workbench-based agentic design. |
| **No agentic loop design** | Layer 7 covers delegation within Claude Code's built-in Agent tool. It does not cover designing your own agentic loops: tool use cycles, stop conditions, error handling, human-in-the-loop patterns. |
| **No safety and guardrails content** | No content on prompt injection, output validation, content filtering, or rate limiting for production systems. |
| **No cost estimation / budgeting** | Layer 8 gives cache math but no content on estimating total cost for a use case, setting token budgets, or monitoring spend. |

---

## 3. Gradient Assessment

### The current gradient

```
Layer 1 (Mental Model)        -- Conceptual, could be any level
    |
    v  [smooth step]
Layer 2 (Communication)       -- Practical prompt mechanics
    |
    v  [STEEP JUMP: suddenly Claude Code-specific]
Layer 3 (Session Hygiene)     -- CLAUDE.md, /clear, compaction buffers
    |
    v  [smooth step, but technical]
Layer 4 (Context Awareness)   -- Compaction internals, writing for summarisation
    |
    v  [moderate step back to practical]
Layer 5 (Output Engineering)  -- Plan before execute, format control
    |
    v  [STEEP JUMP: tool internals]
Layer 6 (Tool Fluency)        -- Claude Code tool chain specifics
    |
    v  [smooth step]
Layer 7 (Agent Design)        -- Subagent delegation and briefing
    |
    v  [STEEP JUMP: production systems engineering]
Layer 8 (Production)          -- Fleet-scale cache economics, system prompt architecture
```

### Where the gradient breaks

**Break 1: Layer 2 to Layer 3.** Layers 1-2 teach principles that apply to any AI tool. Layer 3 suddenly requires Claude Code (CLAUDE.md, `/clear`, compaction buffers). A learner coming from the beginner course (which is platform-agnostic across Claude, ChatGPT, Gemini, Tines, Claude Code) hits a wall. There is no bridge content that says: "You've been using [platform]. Here's what changes when you move to Claude Code, and why."

**Break 2: Layer 5 to Layer 6.** Layer 5 (plan before execute, format control) is a universally applicable skill. Layer 6 immediately drops into Claude Code's specific tool hierarchy (Read, Glob, Grep, Bash, Agent). The learner goes from "ask the model to plan before acting" to "name the specific internal tool you want Claude Code to use." This requires knowledge of Claude Code's tool architecture that is never explicitly taught.

**Break 3: Layer 7 to Layer 8.** Layer 7 teaches how to delegate to a subagent within a Claude Code session. Layer 8 jumps to designing system prompt architecture for multi-user deployments with cache economics. The audience shifts from "individual practitioner" to "systems builder deploying AI at scale." There is no transition content. The learner who can brief a subagent well is not necessarily ready to design a fleet-scale prompt architecture.

### Gradient within layers -- generally smooth

Within each layer, the gradient is well-managed. Skills within a layer build on each other logically. The problem is exclusively at the layer boundaries.

### Missing intermediate layers

The gradient would benefit from content between the current layers:

- **Between Layer 2 and Layer 3:** "Getting started with Claude Code" -- installation, first session, permission model, basic commands
- **Between Layer 5 and Layer 6:** "Understanding how Claude Code works" -- what tools are, how the model selects them, reading tool call output
- **Between Layer 7 and Layer 8:** "From personal use to building for others" -- the conceptual shift from prompting to system design, introduction to the API and Workbench

---

## 4. Tooling Split: Claude Code vs Workbench/Agentic

### Recommended split

| Track | Tool | Audience | Core Question |
|-------|------|----------|---------------|
| **Advanced Practitioner** | Claude Code | Someone who has completed the beginner course and wants to use AI tools more powerfully in their daily work | "How do I get reliably good results from an AI assistant?" |
| **Builder** | Workbench + API | Someone who wants to build AI-powered features, products, or internal tools | "How do I design AI systems that work for other people?" |

### Why they should be separate tracks, not sequential

Claude Code is a power-user tool for individual productivity. Workbench is a builder tool for creating AI systems. The skills overlap (prompt craft, context management, understanding model behaviour) but the application is fundamentally different:

- A Claude Code advanced user writes better prompts, manages sessions, delegates to agents, and reviews output. They are the human in the loop.
- A Workbench builder designs system prompts, defines tools, builds agentic loops, and evaluates output quality at scale. They are designing the loop itself.

Forcing every advanced learner through the builder track wastes their time. Forcing every builder through the full Claude Code practitioner track is unnecessary -- they need the principles (Layers 1-2, 5) but not the Claude Code-specific mechanics (Layers 3-4, 6).

### Shared foundation

Both tracks should share:
- Layer 1 (Mental Model) -- principles, not Claude Code-specific
- Layer 2 (Communication Primitives) -- verb taxonomy, target specificity, constraints
- Layer 5 (Output Engineering) -- plan before execute, format control

These are the platform-agnostic skills that apply everywhere.

### Claude Code track should include

- Layers 3-4 (Session Hygiene, Context Awareness) -- rewritten to include onboarding
- Layer 6 (Tool Fluency) -- with prerequisite orientation to Claude Code's tool model
- Layer 7 (Agent Design) -- with cost awareness gate

### Builder track should include

- System prompt design (not currently in the course)
- API fundamentals (not currently in the course)
- Tool definition / function calling (not currently in the course)
- Agentic loop design (not currently in the course)
- Layer 8 (Production Architecture) -- the only existing module that fits
- Evaluation and iteration (not currently in the course)
- Safety and guardrails (not currently in the course)

### Cost gate for agentic content

The brief flags that agents are costly. The following content should be gated behind explicit cost awareness:

| Content | Gate |
|---------|------|
| Layer 6 (Tool Fluency) | Learner must understand that tool calls cost tokens and that different tools have different costs |
| Layer 7 (Agent Design) | Learner must understand that a subagent runs its own context window and that delegation multiplies cost |
| Layer 8 (Production Architecture) | Learner must understand cache economics at a conceptual level (what caching is, why misses are expensive) |
| Builder track: Agentic loops | Learner must be able to estimate the token cost of a loop iteration and set a budget |

**Recommendation:** Create a dedicated "Cost and Token Economics" module as a prerequisite for any agentic content. This module should cover:
- What tokens are (conceptually, not technically)
- How prompt length relates to cost
- How tool calls add to cost
- How agent delegation multiplies cost
- How to read a Claude Code session's token usage
- How to set a mental budget before starting a task
- Concrete examples: "this 5-minute session cost $X because Y"

---

## 5. Prerequisite Map

### What "ready for advanced" looks like

A learner entering the advanced track should have internalised these from the beginner course:

| Prerequisite | Where It's Taught (Beginner) | How to Verify |
|--------------|------------------------------|---------------|
| **Human/Machine mode distinction** | Exercise 1 (Two Projects) | Learner can identify whether a given message is human-mode or machine-mode and explain why |
| **Opening seed structure** | Exercise 2 (Opening Seed) | Learner can write a Role-Task-Context-Done opening for a real task |
| **Verb choice matters** | Exercise 3 (Specificity as Scope Control) | Learner can pick a verb from the taxonomy and explain its blast radius |
| **Context is fuel, not chat** | Exercise 4 (Context is Fuel) | Learner can identify what context to include and what to exclude for a given task |
| **Output review habit** | Exercise 5 (Read the Whole Thing) | Learner reads and evaluates AI output before using it |
| **Session freshness** | Exercise 6 (Migration & Re-seed) | Learner knows when to start a new conversation and can write a re-seed |
| **Format control** | Exercise 7 (Summarisation Granularity) | Learner can specify output format, length, and structure |
| **Prompt editing as a skill** | All exercises (Copy-Personalise-Use) | Learner can take a template prompt, identify the editable fields, and adapt it to their own task |

### The beginner-to-advanced bridge problem

The beginner course is platform-agnostic (Claude, ChatGPT, Gemini, Tines, Claude Code). The advanced track is Claude Code-specific. The bridge needs to:

1. Acknowledge that the learner has been using a different tool
2. Introduce Claude Code: what it is, why it's different, what it's good at
3. Walk through first-time setup (installation, authentication, permissions)
4. Run one familiar task (something from the beginner course) in Claude Code so the learner sees the difference
5. Introduce the cost model before the learner starts using an expensive tool

**This bridge does not exist.** It is the single most important piece of missing content for the advanced track.

### Prerequisite map for specific advanced content

```
BEGINNER COURSE (Exercises 1-8)
    |
    v
BRIDGE: "Getting Started with Claude Code"
  - What Claude Code is
  - Installation + setup
  - First session walkthrough
  - Permission model
  - Cost awareness introduction
    |
    +---> ADVANCED PRACTITIONER TRACK
    |       |
    |       v
    |     Layer 1-2 (Mental Model + Communication) -- reframed for Claude Code
    |       |
    |       v
    |     Layer 3 (Session Hygiene) -- CLAUDE.md tutorial + session scoping
    |       |
    |       v
    |     Layer 4 (Context Awareness) -- compaction, checkpointing
    |       |
    |       v
    |     Layer 5 (Output Engineering) -- plan mode, format control
    |       |
    |       v
    |     [COST GATE: Token economics module]
    |       |
    |       v
    |     Layer 6 (Tool Fluency) -- guiding tool selection
    |       |
    |       v
    |     Layer 7 (Agent Design) -- delegation + briefing
    |
    +---> BUILDER TRACK
            |
            v
          API Fundamentals (new content)
            |
            v
          System Prompt Design (new content)
            |
            v
          Tool Definition / Function Calling (new content)
            |
            v
          [COST GATE: Token economics + budgeting]
            |
            v
          Agentic Loop Design (new content)
            |
            v
          Layer 8 (Production Architecture) -- existing content
            |
            v
          Evaluation + Safety (new content)
```

---

## 6. Summary of Recommendations

### Content to create (priority order)

1. **Claude Code bridge module** -- the single most important gap. Without it, no beginner graduate can enter the advanced track.
2. **Cost and token economics module** -- prerequisite for all agentic content. The cost gate.
3. **CLAUDE.md hands-on exercise** -- Layer 3 has the declarative content but no exercise.
4. **Error recovery and debugging module** -- "what to do when it goes wrong" for Claude Code users.
5. **Multi-file workflow module** -- realistic end-to-end Claude Code usage, not isolated prompts.
6. **Workbench / API fundamentals module** -- entry point for the builder track (currently zero content).
7. **System prompt design module** -- the core builder skill (currently zero content).
8. **Tool definition module** -- function calling for the API (currently zero content).
9. **Agentic loop design module** -- building your own agents, not just using Claude Code's (currently zero content).

### Content to rewrite

- **Layers 1-2**: Strip Claude Code source code references (`services/compact/prompt.ts`, `constants/prompts.ts`). Keep the principles. Add non-developer examples alongside the existing developer examples. These layers should serve as shared foundation for both tracks.
- **Layer 5**: Already mostly platform-agnostic. Minor edits to remove Claude Code assumptions.

### Content that works as-is for the advanced practitioner track

- **Layer 3** (Session Hygiene) -- needs an exercise added but the declarative content is strong
- **Layer 4** (Context Awareness) -- the compaction survival skills are genuinely novel and well-taught
- **Layer 6** (Tool Fluency) -- needs a prerequisite orientation but the content is sound
- **Layer 7** (Agent Design) -- excellent as written, needs cost gate before entry

### Content that works as-is for the builder track

- **Layer 8** (Production Architecture) -- the only existing builder-track content, and it's strong

### Structural decisions needed

1. **Are the two tracks (Practitioner and Builder) sequential or parallel?** This analysis recommends parallel with a shared foundation. A learner who wants to build with the API does not need to master Claude Code session hygiene first.
2. **Where does the cost gate live?** Recommendation: a standalone module that both tracks pass through before any agentic content.
3. **Should Layers 1-2 be rewritten for a general audience or kept developer-focused?** Recommendation: rewrite with dual examples (general + developer) so they serve as shared foundation. The beginner course already teaches the same principles in general language -- the advanced version should build on that, not restart.
4. **What is the minimum viable advanced track?** Bridge + Layers 1-5 (reframed) + cost gate + Layer 6-7. This covers "capable, confident use of Claude Code" without requiring builder-track content.

---

## 7. Existing Content Cross-Reference

### What the beginner course teaches that the advanced track assumes

| Beginner Concept | Advanced Assumption | Gap |
|------------------|---------------------|-----|
| Human/Machine mode | Not referenced -- advanced modules don't use this framing | The advanced track should build on this framing, not ignore it. Machine mode is essentially what the advanced track teaches in depth. |
| Opening seed (Role-Task-Context-Done) | Skill 4-6 teach the components individually but don't reference the opening seed framework | Should be explicitly connected: "You learned the opening seed. Now we break down each component." |
| Platform-agnostic design | Advanced modules are Claude Code-only | The bridge module must handle this transition explicitly. |
| Copy-Personalise-Use pattern | Advanced modules have no prompt editing walkthrough | Per project spec, every exercise must include this. The advanced modules currently violate this requirement. |
| Guided/Standard difficulty levels | Not present in advanced modules | Should the advanced track offer guidance levels? Probably not -- advanced learners should be past the guided tier. But this is a design decision. |

### Review findings that affect the advanced track

From `REVIEW_FINDINGS.md`:

- **Round 2, Agent 2**: "The 8 course modules (00-08) are written for software engineers and technical power users, not for people with low general tech confidence." Decision: modules designated as the advanced course track. This is correct but the advanced track still needs non-developer pathways for data analysts, content professionals, and researchers -- the three domains already represented in the examples.
- **Round 3**: "Context is fuel" (beginner framing) vs "context is finite" (advanced framing, Layer 2 Skill 2). Both true at different levels. The advanced track should explicitly acknowledge and resolve this: "In the beginner course you learned context is fuel. That's true -- more context produces better output. But the container is finite, and here's what happens when it fills up."
- **Round 3**: Claude Code-specific mechanics (CLAUDE.md, `/clear`, compaction, subagents) have no equivalent on other platforms. The advanced track must either scope itself explicitly to Claude Code or provide platform-agnostic alternatives. Recommendation: scope to Claude Code for the practitioner track, scope to API/Workbench for the builder track, and be explicit about it.
