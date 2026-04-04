# Claude Code — Prescriptive Best Practices
## A beginner's guide grounded in the source

---

## How to read this guide

Every practice here is derived from Claude Code's actual internal system prompts and implementation logic — not speculation. Where a practice is sourced from specific model instructions, that's noted. The goal is to help you work with the system as it's designed, rather than against it.

---

## Part 1 — Verb-First, Deterministic Language

### Why verbs matter more than you think

Claude is explicitly trained to infer scope from the imperative verb in your request. The model uses the verb to determine how much it's allowed to do. This is not a suggestion — it's a design constraint baked into the system prompt.

These verbs carry different blast radii:

| Verb | What the model infers |
|---|---|
| `fix` | Change the minimum required to resolve the stated problem |
| `add` | New capability only — don't modify existing behaviour |
| `refactor` | Restructure without changing external behaviour |
| `update` | Modify existing functionality |
| `explain` | Read-only — no changes |
| `clean up` | **Ambiguous** — avoid this |
| `improve` | **Dangerous** — no ceiling on scope |

**The rule:** lead every request with a precise verb. The model is instructed *"don't add features, refactor code, or make improvements beyond what was asked."* It can only honour that if the verb is unambiguous.

### The full prompt structure

A well-formed request has three parts:

```
[VERB] [SPECIFIC TARGET] — [CONSTRAINT]
```

Examples:

```
Fix the off-by-one in paginate() — don't refactor anything around it.

Add a retry parameter to fetchUser() — same interface, new optional arg only.

Refactor the auth middleware to extract token validation into its own function
— don't change the function signatures or touch any callers.

Explain how the caching layer works in services/cache.ts — no changes needed.
```

Each of these has a verb (scope signal), a target (no searching required), and a constraint (ceiling on blast radius).

### What happens without constraints

Without a constraint, the model fills the gap with its own judgment. The source explicitly warns against this pattern internally — the model has been trained to be capable and thorough, which means it will expand scope when given permission to do so implicitly. "Clean this up" is implicit permission.

**The fix:** add "don't change anything else" or "leave everything else as-is" as a default trailer to any request where scope matters.

---

## Part 2 — Input Management

### Rule 1: Reference files, don't paste them

When you paste code into the chat it becomes part of the conversation history and gets re-processed every single turn until it's summarised away. Claude has file-reading tools specifically to avoid this — the model reads a file once, extracts what it needs, and the raw content doesn't accumulate in the history.

**Don't:**
> Here's the contents of auth.ts: [paste 300 lines]

**Do:**
> Read `src/auth.ts` and tell me why the token validation is failing.

The model is instructed to read files before proposing changes anyway — so pasting is redundant and expensive.

### Rule 2: Be specific with targets

Vague references require the model to search before it can act. Every search turn costs context and time.

**Don't:**
> That config file we were looking at

**Do:**
> `config/database.ts`

**Don't:**
> The function that handles user login

**Do:**
> `authenticateUser()` in `src/auth/handlers.ts:142`

When you reference by path:line, the model goes directly to work. When you reference by description, it has to orient first.

### Rule 3: One task per message

Multi-part requests split the model's attention and make it harder for it to apply constraints correctly. "Fix the bug AND add a test AND update the docs" often results in all three being done partially or with cross-contamination.

Break it into sequential messages:
1. Fix the bug
2. Confirm the fix is right
3. Now add a test for it

This also gives you a checkpoint between each step.

### Rule 4: State constraints before work starts, not after

Corrections mid-task are expensive. They add turns, require rework, and have to survive context summarisation intact. The source's compaction logic is specifically designed to preserve user corrections verbatim — because they're so commonly needed and so often lost.

Prevent the need for corrections by stating the constraint upfront:

> Refactor auth.ts — don't touch the test files, don't change any public interfaces.

vs.

> Refactor auth.ts.
> [model changes test files]
> Wait, don't change the test files.
> [model reverts test files, may have missed something]

The first version is one message. The second is three.

---

## Part 3 — Output Management

### The model is trained to be brief by default

Claude Code's system prompt explicitly instructs the model: *"Go straight to the point. Lead with the answer or action, not the reasoning. Skip filler words, preamble, and unnecessary transitions. Do not restate what the user said — just do it."*

This means you won't get explanation unless you ask for it. If you need reasoning, walkthrough, or tradeoff analysis, ask explicitly:

> Explain your reasoning before making any changes.

> Walk me through what you're planning to change and why before you do it.

> After fixing this, explain what was wrong and why your fix addresses it.

### The model mirrors your verbosity

Short terse prompts produce short terse answers. Detailed prompts produce detailed answers. This is not accidental — it's a calibration signal. If you're getting too much output, shorten your prompts. If you're getting too little, add more context and ask for more depth.

### Ask for a plan before execution on complex tasks

For multi-step work, separate the planning turn from the execution turn:

> Before making any changes, tell me your plan: what you'll modify, in what order, and what you'll leave alone.

This costs one extra turn but saves you from mid-task corrections. The model has a plan mode (`/plan`) designed exactly for this — it proposes an approach, waits for your approval, then executes.

### Know that tool results are ephemeral

The source contains this explicit instruction to the model: *"When working with tool results, write down any important information you might need later in your response, as the original tool result may be cleared later."*

What this means for you: the model has been told that its own tool outputs (file reads, bash results, search results) may disappear before it finishes a task. It handles this by narrating key findings into its response. You should work with this pattern — if you see the model stating what it found, that's it building a durable record for itself, not padding.

---

## Part 4 — Context Management and Spotting Rot

### What context rot is

Context rot is the gradual degradation of a session's usefulness as it grows longer. It has two causes:
1. **Accumulation** — old tool results, irrelevant history, and resolved tasks occupying space that active work needs
2. **Summarisation drift** — compaction produces a summary, not a copy; fine details are lost and the model reasons from increasingly abstract state

You can't eliminate summarisation — it's automatic. But you can manage the conditions that make it worse.

### The 9 things compaction is designed to preserve

The source shows exactly what the compaction prompt asks the summarising model to capture:

1. Your explicit requests and intents
2. Key technical concepts and frameworks
3. Specific file names, code snippets, and function signatures
4. Errors encountered and how they were fixed
5. **Your feedback** — especially corrections where you said "do it differently"
6. All of your messages verbatim
7. Pending tasks
8. What was being worked on immediately before summarisation
9. The next step, with a direct quote from the conversation to prevent drift

What's *not* on this list: raw tool output, intermediate reasoning, the model's thought process, tangential context from earlier in the session. All of that is lost.

**The implication:** anything important that exists only in a tool result or in the model's reasoning — and that you haven't explicitly confirmed or referenced in a user message — may not survive compaction. If something matters, say it back in your own words.

### Signs of context rot

| Signal | What it means |
|---|---|
| Model repeats something it already did | It's lost track of completed work |
| Model re-asks something you already answered | That answer didn't survive compaction |
| Model changes approach on a constraint you set earlier | The constraint drifted out of active context |
| Model uses a different name for something than you established | Terminology anchor was lost in summarisation |
| Responses start being less specific | Model is reasoning from a summary rather than the source |

### How to address rot

**Prevention (before it starts):**
- Use `/clear` between unrelated tasks — old context from a different problem is pure noise
- Keep sessions single-purpose — one session, one goal
- State constraints in writing so they survive as user messages (compaction preserves those verbatim)

**Mitigation (once it's started):**
- Ask for an explicit checkpoint: *"Summarise what's been done, what's pending, and what constraints are in place"*
- Read the compaction summary when you see it — correct it immediately if something is wrong or missing
- Restate key constraints if you notice the model drifting away from them

**Recovery:**
- `/clear` and restate the task fresh with the relevant constraints
- Starting clean is almost always cheaper than trying to correct a badly drifted session

### The session length heuristic

A well-scoped session should be describable in one sentence. When you can no longer do that, the session has grown beyond its useful scope. This is the point to either `/clear` or explicitly checkpoint before continuing.

---

## Part 5 — Using Agents Strategically

### What agents actually do

Subagents run in their own context window. Their tool outputs — file reads, grep results, bash output — are processed in that window and never land in yours. You receive a summary. This is the fundamental reason to use them: **context isolation**.

The source describes this directly: *"Subagents are valuable for parallelizing independent queries or for protecting the main context window from excessive results."*

### The decision rule: will I need this output again?

This is the exact criterion the source uses for deciding whether to fork to a subagent. If the raw output from a task (search results, file reads, test output) would fill your context but you only need the conclusion — delegate it.

**Use an agent when:**
- The task is a research question ("find all usages of X across the codebase")
- The task generates large intermediate output you won't need again
- The task is genuinely independent of what you're currently doing
- You want an isolated, unbiased second opinion on something

**Don't use an agent when:**
- You're searching for a specific known file or function (use Glob/Grep directly — it's faster)
- The task is 2-3 files of reading (read them directly)
- The agent's findings need to feed directly into your next step (you'd be reading the output anyway)

### How to brief an agent properly

The source contains explicit instructions for writing agent prompts: *"Brief the agent like a smart colleague who just walked into the room — it hasn't seen this conversation, doesn't know what you've tried, doesn't understand why this task matters."*

An agent prompt needs:
- What you're trying to accomplish and why
- What you've already tried or ruled out
- Enough surrounding context for the agent to make judgment calls
- Whether you want it to write code or just research
- The desired output format and length

The source is direct about the failure mode: *"Terse command-style prompts produce shallow, generic work."*

**Poor agent prompt:**
> Find where the bug is.

**Good agent prompt:**
> Investigate why `calculateTotals()` in `src/cart/pricing.ts` returns incorrect values for items with multiple discounts applied. I've checked that individual discount calculations are correct in isolation. Look at how discounts are composed when multiple apply to the same item — I suspect an ordering issue. Report what you find and where the problem is. Don't fix anything. Under 200 words.

### Never delegate understanding

The source flags this explicitly as a failure pattern: *"Don't write 'based on your findings, fix the bug' or 'based on the research, implement it.' Those phrases push synthesis onto the agent instead of doing it yourself."*

The agent does research. You synthesise it. You write the implementation prompt that includes the specific file, the specific line, and what specifically to change. The agent that does the fix gets a directive, not an open question.

---

## Part 6 — Persistent Instructions (CLAUDE.md)

### What CLAUDE.md is

Claude loads `CLAUDE.md` files at session start, before your first message. This content is treated as standing instructions — the equivalent of a briefing that's always there, without costing you per-turn.

The source loads CLAUDE.md via `getMemoryFiles()` into the user context, which is memoised for the session. It's processed once and cached. Anything you put there doesn't accumulate in conversation history or get summarised away.

### What belongs in CLAUDE.md

Standing instructions that apply to every session:
- Project-specific tech stack constraints ("we use Bun, not Node")
- Code style rules ("don't add type annotations to files you didn't change")
- Workflow rules ("always run tests before marking a task done")
- Permissions you've pre-authorised ("you can commit directly, always ask before pushing")
- Terminology ("we call it a 'workspace', not a 'project'")

**The test:** if you've said something more than once in a session, it belongs in CLAUDE.md.

### What doesn't belong in CLAUDE.md

Task-specific context, in-progress work, or session state. CLAUDE.md is for standing rules, not notes. The model reads it at start and caches it — it's not a scratchpad.

---

## Part 7 — Working with the Model's Behaviour, Not Against It

### The model won't push back unless you give it permission to

The external system prompt instructs the model to defer to user judgment. By default it executes. If you want it to flag problems, identify alternatives, or push back on approach, say so:

> If you think my approach has a problem, tell me before starting.

> If you notice anything unexpected while doing this, flag it.

> I want your honest assessment of this design, not just execution.

Without these, you get execution. With them, you get collaboration.

### The model won't verify unless you ask it to

The source includes an internal-only instruction to verify work before marking it done. The external version doesn't include this. For code tasks, explicitly ask for verification:

> After making the change, run the tests and confirm they pass.

> Once you've made the edit, check that nothing else in the file references the old interface.

### Explicit permission changes the default safety gates

Claude is designed to pause before irreversible actions: deleting files, pushing code, modifying shared infrastructure. The cost-of-pausing logic is built in: *"the cost of pausing to confirm is low, while the cost of an unwanted action can be very high."*

If you want it to operate without these pauses, say so explicitly for that task:

> Proceed without checking in — I'll review the diff at the end.

A one-time confirmation doesn't carry over. The source explicitly states: *"A user approving an action once does NOT mean that they approve it in all contexts."* For standing permissions, put them in CLAUDE.md.

### The model won't re-ask what it already knows

If the model asks you something it should know from earlier in the session, that's a context rot signal — the answer didn't survive compaction. Don't just answer it again; restate any other context from that conversation that might also have been lost.

---

## Quick Reference

### Before starting a task
- [ ] Do I have a CLAUDE.md with standing rules?
- [ ] Is my verb specific? (fix / add / refactor / explain — not improve / clean up)
- [ ] Have I stated the constraint ceiling?
- [ ] Am I referencing by path, not by description?
- [ ] Is this task single-purpose?

### During a task
- [ ] Am I pasting files instead of referencing them?
- [ ] Is this a research phase that should be delegated to an agent?
- [ ] Have I asked for a plan before execution on anything complex?

### Spotting rot
- [ ] Is the model re-asking things I already answered?
- [ ] Is it drifting from constraints I set earlier?
- [ ] Can I still describe this session in one sentence?
- [ ] Did I read the last compaction summary?

### Closing a task
- [ ] Did the model verify the change, or just make it?
- [ ] Should I `/clear` before the next task?
- [ ] Are there standing rules from this session that should go into CLAUDE.md?
