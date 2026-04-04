# Claude Code — Best Practices

Sourced from internal Claude Code system prompts and implementation logic.

---

## 1. Be specific about scope before work starts

Claude is explicitly instructed *not* to add features, refactor surrounding code, or make improvements beyond what was asked. A vague request invites drift. A scoped request gets exactly what you asked for.

**Instead of:** "Clean up the auth module"
**Say:** "Extract the token validation logic from `auth.ts` into its own function — don't change the interface or anything else"

The verb carries most of the scope signal:
- `fix` → change the minimum to resolve the issue
- `refactor` → restructure without changing behaviour
- `add` → new capability, don't modify existing
- `explain` → read-only, no changes

Constraints work best before the task, not after. Corrections mid-task are expensive — they add turns, require rework, and have to survive context summarisation.

---

## 2. Use CLAUDE.md for anything you'd repeat

Claude loads `CLAUDE.md` files at session start, before your first message. Content there is cached — it doesn't cost you per-turn. Anything you find yourself saying repeatedly ("we use Bun not Node", "don't add type annotations to files you didn't change", "always run tests before marking done") belongs in CLAUDE.md, not the chat.

Putting standing instructions in chat means they're re-processed every turn and degraded through summarisation over long sessions.

---

## 3. Keep sessions short and single-purpose

Context summarisation (compaction) is lossy. The longer a session runs across multiple unrelated tasks, the more the summary degrades. A session that drifts through 5 problems produces a diluted context that the next task runs on.

**Rule of thumb:** if you can't summarise the session in one sentence, it's too broad.

Use `/clear` aggressively between unrelated tasks. Context from a previous problem is dead weight — it gets re-tokenised every turn and complicates summarisation.

---

## 4. Don't paste large files — reference them

When you paste code into the chat it enters the conversation history and gets re-processed on every subsequent turn. Claude has file-reading tools precisely to avoid this.

**Instead of:** pasting 200 lines of code
**Say:** "Read `src/auth.ts` and..."

The model reads it once, retains what's needed, and the raw content doesn't persist in the message history.

---

## 5. Understand what survives summarisation — and what doesn't

When a session fills up, Claude summarises the conversation to continue. What it's explicitly designed to preserve:

- Your exact requests (verbatim)
- File names, function signatures, and code snippets
- Errors encountered and how they were fixed
- Feedback you gave — especially corrections ("do it this way instead")
- What was being worked on immediately before summarisation

What degrades most:
- Implicit context ("you know what I meant")
- Reasoning chains and intermediate steps
- Raw tool output (file reads, bash results)

**Practical implication:** say the thing explicitly. The model is anchored to your literal words through summarisation. Loose phrasing, pronouns, and "fix that" accumulate as drift.

---

## 6. Give tasks a clear stopping condition

Without a natural completion boundary, Claude has to invent one. Open-ended prompts ("keep improving this until it's good") are expensive and unpredictable.

Include an explicit done-state:
- "until all tests pass"
- "for these 3 functions only, then stop"
- "one pass through the file, don't loop"

---

## 7. Checkpoint on long tasks

Midway through a long session, ask: *"summarise what's been done and what's left."*

This forces a clean context consolidation on your terms, before the system does it automatically. The next steps will be cleaner and you'll catch any drift in task interpretation before it compounds.

If you see a compaction notice, read the summary. If it missed something important, correct it in that turn before the next task starts. Errors in the summary become the model's ground truth for the rest of the session.

---

## 8. Use subagents for research and exploration

Subagent tool results — grep output, file reads, bash results — run in a separate context window and don't land in your main session. You get a summary back, not hundreds of lines of raw output.

If a task has two phases — *find out X*, then *do Y* — delegate the first phase:

**Instead of:** "Search the codebase for all places X is used, then refactor them all"
**Say:** "Use an agent to find all usages of X across the codebase, then we'll refactor"

This keeps your main context clean for the actual work.

---

## 9. The model responds to your verbosity signal

Claude is instructed to be brief and direct by default — lead with the answer, skip preamble, don't restate what you said. If you write terse prompts, you get terse answers.

If you want reasoning, explanation, or walkthrough — ask for it explicitly. The model won't volunteer it unless prompted.

Conversely, if you're getting overly long responses, shorter and more direct prompts will naturally pull responses tighter.

---

## 10. Corrections are expensive — restate, don't patch

When the model misunderstands, the instinct is to add a correction on top: "no, I meant X not Y." But corrections layer onto existing misunderstandings and both versions have to survive summarisation.

It's cleaner to restate the whole request from scratch when direction changes significantly. Treat it as a new prompt, not an amendment.

---

## 11. Explicit permission changes behaviour

Claude is designed to pause and confirm before irreversible or high-blast-radius actions (deleting files, pushing code, modifying shared infrastructure). This default is intentional.

If you want it to operate more autonomously on a task, say so explicitly: *"proceed without checking in, I'll review the diff at the end."* A one-time approval doesn't carry over — the model is instructed that approving an action once doesn't mean approving it in all contexts.

For standing permissions, CLAUDE.md is the right place: *"you can run tests and commit directly, always ask before pushing."*

---

## 12. Reference files by path, not description

Vague references require the model to search before it can act — burning turns and context on orientation. Precise references let it go straight to work.

**Instead of:** "that config file we were looking at earlier"
**Say:** "`config/database.ts`"

The same applies to functions, errors, and test names. The more specific the reference, the less inference required.
