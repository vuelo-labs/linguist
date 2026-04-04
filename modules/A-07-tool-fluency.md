# A-07: Tool Fluency

## Learning Objective

After this, you can name the right tool for a given task in your message, understand why tool choice affects both quality and cost, and guide Claude Code away from expensive tools when cheaper ones will do the job.

---

## What You Already Know

In A-06, you learned to separate planning from execution — asking Claude Code to describe its approach before it acts. That module was about when Claude Code starts work. This one is about how it works once it does.

When Claude Code takes on a task, it chooses from a set of tools: reading files, searching for patterns, running commands, or launching a separate session. Left to its own judgment, it will make a reasonable choice. But reasonable is not always the right choice for your task, and it is not always the cheapest one.

Naming the tool in your message is how you close that gap.

---

## Core Concept: The Tool Hierarchy

Claude Code has five main tools it can use to do work. Each one is suited to different tasks, and each one has a different cost.

**Read** — opens a specific file and reads its full contents. Use this when you know exactly which file you need. It reads one file, costs a predictable amount, and gives you exactly what you asked for.

**Glob** — finds files matching a pattern across your project. Think of it as a file name search: "find every file called config.json" or "find all files ending in .md". Use this when you need to locate files, not read them.

**Grep** — searches inside files for specific text or patterns. Use this when you need to find where something appears across multiple files. "Find every file that mentions the word 'deadline'" is a Grep task.

**Bash** — runs a terminal command. This is powerful and flexible, but it is also more expensive than the dedicated tools above, and some commands are irreversible. Only reach for Bash when Read, Glob, and Grep genuinely cannot do what you need.

**Agent** — starts an entirely separate Claude Code session to handle a subtask, then reports the result back to your main session. This is the most expensive tool by a significant margin. It is covered in full in A-08.

The cost hierarchy, from cheapest to most expensive:

Read / Glob / Grep → Bash → Agent

The dedicated tools (Read, Glob, Grep) are in the same cost bracket: targeted, reviewable, predictable. Bash costs more because it runs shell execution. Agent costs the most because it opens a second full session with its own context window.

---

## The Key Technique: Name the Tool

Claude Code's default tool selection is based on what it thinks the task requires. It is not trying to be expensive — it is trying to be thorough. But thorough often means reaching for a larger tool than the task needs.

When you name the tool in your message, you give Claude Code a more precise instruction than the task description alone provides. "Use Grep to find every file containing the word 'deadline'" is more precise than "find files with the word deadline." The first tells Claude Code both what to find and how to find it. The second leaves the how open.

Claude Code will still make the final decision. But explicit tool naming reduces unnecessary escalation to more expensive tools and makes the action you are about to approve more predictable.

### Without / With: Searching a project

Without: "Find where we reference the project deadline across all documents."

Claude Code might launch an Agent to survey the project broadly, reading multiple files and generating its own summary. Large, unpredictable, expensive.

With:

> Use Grep to search all files in this folder for the word "deadline". Show me the file name and the matching line for each result. Don't read the full files — just the matching lines.

One Grep call. Bounded output. You see exactly what tool ran before you approve it.

### Without / With: Researching the current landscape

Without: "Tell me about the main competitors in this space."

Claude Code may reach for WebSearch with multiple queries or launch an Agent for each competitor, generating a large volume of intermediate results in your main session.

With:

> Use WebSearch twice — once for [Competitor A] and once for [Competitor B] — with these specific queries:
> 1. "[Competitor A] pricing 2025"
> 2. "[Competitor B] pricing 2025"
>
> For each: report what you find in one paragraph. Note whether the source is the company's own website or a third party. Don't read beyond the search results.

Two bounded searches. Predictable scope. Source reliability visible.

---

## Cost Warning

Each tool call costs tokens. Before running these exercises, check your session budget from A-01. Tool calls on large files or directories can add up quickly. The exercises below are designed to be targeted — follow the scope instructions and you will keep costs low.

---

## Exercise: Guided Tool Selection

### Part 1 — Name the tool before you send

For each of the three tasks below, decide which tool is appropriate and name it in your message before sending. The goal is to think about the tool first, not after.

**Task A:** Find all files in this project that contain the word "deadline."

The right tool here is Grep. It searches inside files for matching text, which is exactly what this task requires. Your message might be: "Use Grep to find every file in this project that contains the word 'deadline'. Show me the file name and matching line for each result."

**Task B:** Read the contents of README.md.

The right tool is Read. You know the exact file you want. Name it directly. Your message might be: "Use Read to open README.md and tell me what it contains."

**Task C:** Show me the last 10 lines of a log file.

This one needs Bash. Read opens the full file. There is no dedicated "read the tail of a file" tool. The right message: "Use Bash to run: tail -n 10 [logfile name]. Show me the output."

After sending each message, observe whether Claude Code used the tool you named. The tool call will appear in the output before Claude Code asks for your approval. You can confirm before allowing it to proceed.

### Part 2 — Compare tool choice and cost

Send the same request twice:

**Version 1 (free choice):**
> Look through the files in this project and find all mentions of [a word or phrase from your own project]. Tell me where it appears.

**Version 2 (named tool):**
> Use Grep to find every mention of [the same word or phrase] across files in this project. Show me the file name and matching line. Don't read any full files.

After both, compare the token counts shown at the end of each response. The second version will typically be equal or cheaper, and the scope of the result will be more predictable.

---

## Copy, Personalise, Use

Use this starter whenever you want to guide Claude Code to a specific tool:

> Use [tool name: Read / Glob / Grep / Bash] to [specific action]. [What to look for / what to find / what to run]. Report what you find before doing anything else.

How to edit this:

- [tool name] — choose the right tool using the hierarchy. If you know the file, use Read. If you need to find files by name, use Glob. If you need to find text inside files, use Grep. If you need a terminal command, use Bash. If none of these apply, see A-08 for Agent.
- [specific action] — be as precise as possible. "Open README.md" is better than "look at the readme." "Search for the word 'deadline'" is better than "find mentions of deadlines."
- [what to look for / what to find / what to run] — the content of the task. This is where you tell Claude Code what it is actually looking for.
- "Report what you find before doing anything else" — keeps Claude Code from reading one file and immediately going to read three more. It forces a pause where you can see what was found and decide what to do next.

---

## What Good Looks Like

Claude Code uses the tool you named. The tool call appears in the output before you approve it — you can see that it is using Grep, not Agent, before anything happens. The result is scoped to what you asked for: matching lines from Grep, not a full file read; the specific file from Read, not a sweep of the folder.

You are not guessing what Claude Code did. You can see it.

---

## Recovery Path

If Claude Code ignores your tool name and uses a more expensive tool instead, do not approve the action. Reject it and ask:

> Why did you use [X] instead of [Y]?

The answer will tell you one of two things: either your instruction was ambiguous and the task description pulled Claude Code toward a different interpretation, or the task genuinely required the more expensive tool — Grep cannot do what you asked for, or Read would have missed something. Both answers are useful. The first tells you how to rewrite the message. The second tells you the task is bigger than you thought.

---

## Next

A-08 covers the Agent tool — the final and most expensive tool in the hierarchy. Delegation is not just about naming a tool. It is about deciding whether a task belongs in your main session at all, and writing a brief that gives a separate session everything it needs to do the job.

Continue to A-08: Agent Delegation and Briefing.
