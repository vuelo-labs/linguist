# A-03: CLAUDE.md — Your Persistent Instructions

## Learning objective

After this, you will have created a CLAUDE.md file, started a Claude Code session with it active, and observed the difference it makes to Claude Code's default behaviour.

---

## What you already know

In B-04 you set up persistent instructions inside a Claude.ai Project. Those instructions told the AI how to behave in every conversation you started in that project — your preferred length, your working style, what to skip.

CLAUDE.md is the Claude Code equivalent. But instead of living in a platform's settings panel, it lives as a plain text file in your project folder. This means it travels with the project. Anyone who opens that project in Claude Code inherits the same instructions automatically.

The connection between B-04 and CLAUDE.md is exact: same idea, different location. If you understood persistent instructions on Claude.ai, you already understand what CLAUDE.md does. This module is about where it lives, what goes in it, and how to write your first one.

---

## What CLAUDE.md is

CLAUDE.md is a plain text file named CLAUDE.md that Claude Code reads at the start of every session. Whatever you write in it is treated as standing instructions — active in every conversation, without you having to repeat them.

Claude Code loads CLAUDE.md files from a defined hierarchy. You have two main options:

**Project-level CLAUDE.md** — a file in your project's root folder. Applies only to that project. The right place for project-specific rules: the tools your project uses, the file structure, the naming conventions, what to leave alone.

**User-level CLAUDE.md** — a file at `~/.claude/CLAUDE.md` on your computer. Applies to every project you open in Claude Code. The right place for personal preferences that should follow you everywhere: your preferred response style, your working habits, how you like feedback given.

---

## What belongs in CLAUDE.md

Standing rules that you would otherwise repeat in every session.

**For a project-level file:**
- The technologies the project uses ("we use Bun, not Node")
- Naming conventions ("test files use the .spec.ts suffix")
- File boundaries ("never modify files outside the src/ directory")
- Workflow rules ("always tell me what you plan to do before making changes")
- Terminology ("we call it a workspace, not a project")

**For a user-level file:**
- Your preferred response length
- Your preferred format (bullet points vs prose vs structured headers)
- What you want Claude Code to skip (no preamble, no "great question", no unsolicited suggestions)
- How you want uncertainty handled ("if you're not sure, ask rather than guessing")
- Your working style ("explain your reasoning, don't just give me the answer")

**What does not belong in CLAUDE.md:**
Task-specific context, notes about work in progress, or session state. CLAUDE.md is for standing rules, not for information that changes between tasks. Put that kind of context in your opening message for each session.

---

## Without / With

### Without CLAUDE.md: Coding project

A developer starts a new Claude Code session each day and types the same constraints at the start of every conversation: "We use TypeScript strict mode. All errors must be typed, no `any`. Tests must be in `.spec.ts` files, not `.test.ts`. Don't modify files outside of `src/`."

By the third week they stop remembering to type all of them. The model starts generating `.test.ts` files. The violations reach code review before anyone catches them.

### With CLAUDE.md: Coding project

A CLAUDE.md in the project root:

> ## Project conventions
>
> - TypeScript strict mode is on. All types must be explicit. No `any`.
> - Test files: use .spec.ts naming only. Never .test.ts.
> - File boundaries: only modify files inside src/. Never touch configuration files unless I explicitly ask.
> - Before making any change, tell me what you plan to do and wait for my confirmation.

These rules are present in every session without being typed.

### Without CLAUDE.md: Content and research work

An editor starts each Claude Code session by pasting their style guide into the chat: second-person address, active voice only, no jargon, maximum 20-word sentences, Oxford comma. On long sessions this context gets compressed and lost. Articles drift in register over the course of a session.

### With CLAUDE.md: Content and research work

A user-level CLAUDE.md at `~/.claude/CLAUDE.md`:

> ## Writing style — apply to all content work
>
> - Address the reader as "you" (second person)
> - Active voice only. Flag passive voice rather than using it.
> - No jargon: if a word needs explaining, replace it with a simpler one
> - Maximum sentence length: 20 words. Split longer sentences.
> - Oxford comma always
> - Em dashes are fine; semicolons should be rare

Because it is in the user-level file, these rules apply to every project the editor opens in Claude Code.

---

## The exercise: write your first CLAUDE.md

This takes about ten minutes. You will write a minimal CLAUDE.md, start a Claude Code session with it active, and observe its effect.

### Step 1: Decide where your CLAUDE.md lives

If you are working on a specific project: create the file in that project's root folder.

If you want rules that apply to everything you do in Claude Code: create the file at `~/.claude/CLAUDE.md`. The `~/.claude/` folder is in your home directory. If it does not exist yet, create it.

### Step 2: Write three to five rules

Start small. Ask yourself: what do I find myself repeating in every Claude Code session? What does Claude Code do by default that I consistently want changed?

Good rules are specific and testable. "Be careful" is not a rule — it tells Claude Code nothing it can act on. "Never modify files outside the src/ directory" is a rule — Claude Code can check every action against it.

### Step 3: Test it

Start a Claude Code session in the project (or from any directory, if you wrote a user-level file). Give Claude Code a task that your rules should affect — something that would normally trigger the behaviour you wanted to change.

Observe whether the behaviour changed. If it did not, check that you saved the file, that it is in the right location, and that you are using it in a new session (CLAUDE.md is read at session start; opening a new session is required for changes to take effect).

### Step 4: Iterate

Your first CLAUDE.md will be incomplete. That is expected. Add rules as you notice patterns — each time you find yourself saying the same thing to Claude Code that you have said before, consider whether it belongs in CLAUDE.md.

---

## Copy, Personalise, Use

This template gives you a starting CLAUDE.md. Replace every bracket with your own preferences.

> # Instructions for [this project / all my Claude Code work]
>
> ## Role
> I am a [your role or description of your work]. The tasks I bring to Claude Code are mainly [brief description of typical work — e.g. "writing and editing long-form content", "maintaining a data pipeline", "building internal tools"].
>
> ## Working style
> - Before making any changes, tell me what you plan to do and wait for my confirmation.
> - Ask a clarifying question if my instruction is ambiguous. Don't guess.
> - [Any other working style preference]
>
> ## Output preferences
> - Keep responses [brief / at whatever length the task requires / under X words by default].
> - Format: [bullet points / prose / structured with headers — state your preference].
> - Skip preambles and sign-offs. Start with the answer.
>
> ## What to avoid
> - [Something Claude Code does by default that you do not want — e.g. "Don't suggest next steps unless I ask", "Don't reformat content I did not ask you to reformat", "Don't add caveats or disclaimers unless they are critical"]
> - [A second thing to avoid]

How to edit this:

- [this project / all my Claude Code work]: Pick one. Project-level or user-level. Different placement, different scope.
- [your role]: What you do. "Content strategist", "data analyst", "software developer", "researcher". One phrase.
- [brief description of typical work]: Two or three words about the kind of tasks you bring to Claude Code. This helps Claude Code calibrate its behaviour for your domain.
- [Any other working style preference]: Think about what frustrates you in current Claude Code sessions. State the opposite as a rule.
- [Output preferences]: These are your most personal rules. Most people want shorter responses and cleaner formatting than the defaults. State specifically what you want.
- [Something to avoid]: The most useful rules are often negative constraints. What does Claude Code add that you consistently remove?

---

## Next

A-04 covers session hygiene — what to do within a session to keep Claude Code focused, and when to use `/clear` to start fresh without closing your terminal.
