# E-05: Get the Plan First

## Learning objective

After this, you ask for a plan before execution on any multi-step task, evaluate it, redirect if needed, and only then let the AI proceed.

---

## Intro

E-04 covered what to do when a conversation has already gone wrong: stop patching, restate. E-05 is the earlier intervention — for tasks that have more than a couple of steps, how to catch a wrong direction before the AI has done any work, rather than after.

---

## The concept

For a single-step task — summarise this, draft that, fix this error — send it and read what comes back. One message, one result.

For a multi-step task, there is a better pattern. Ask for the plan first.

"Before doing anything, tell me how you would approach this" costs one extra message. What it buys is a checkpoint before any work begins. You can see exactly what the AI intends to do, step by step. You can spot a wrong turn before it produces several pages of output you cannot use.

The plan is not the output. It is a proposal. You read it. You adjust it if something is off. You approve it. Then the AI executes.

This is the two-message pattern:

**Message 1:** Before you start, tell me how you would approach [task]. List the steps. Don't do any of them yet.

**Message 2 (after reviewing the plan):** Go ahead — or — Change step 3 to [adjustment], then proceed.

The second message is short because the first one did the work. You are either confirming or making one targeted change. You are not rewriting everything mid-task.

---

## When to use this

Not every task needs a plan. The rule of thumb: if the task has more than two steps, or if you would be frustrated to receive the wrong thing after the AI has done a lot of work, ask for the plan first.

Examples of tasks where this pays off:

- Restructuring a long document
- Writing a report from a brief
- Creating a set of instructions or training materials
- Drafting a sequence of communications (emails, announcements, updates)
- Analysing something and making recommendations

Examples where it is not necessary:

- Summarising a paragraph
- Fixing a specific error
- Rewriting a sentence
- Answering a direct question

---

## The exercise

Pick a task from your own work that has more than two steps. A document to restructure, a report to draft, a set of instructions to write, a plan to create. Something where getting the structure wrong would mean starting over.

**Send Message 1:**

> Before you start, tell me how you would approach [your task]. List the steps. Don't do any of them yet.

Read the plan. Check each step:

- Does this match what you actually need?
- Is anything in the wrong order?
- Is there a step that would go wrong if done the way the AI described it?
- Is anything missing that matters?

Find one thing to adjust. It does not need to be a large change — even a small redirect at this stage prevents a larger correction later.

**Send Message 2:**

> Good. Change [step X] to [your adjustment]. Now proceed.

Or if the plan is right as written:

> Good. Go ahead.

Compare the result to what you would have received if you had sent the full task directly without asking for the plan.

---

## Copy-Personalise-Use

### Message 1 starter

> Before you start, tell me how you would approach [task]. List the steps. Don't do any of them yet.

### Message 2 starters

> Good. Change [step X] to [adjustment]. Now proceed.

> Good. Go ahead.

### How to edit these

**Message 1:** Replace [task] with a clear description of what you want done. Be specific enough that the plan will reflect your actual situation — if the task involves a particular audience, format, or constraint, include it here. The AI needs enough information to propose a sensible plan.

**Message 2:** You will usually have one adjustment. Name the step by its number or a short description ("step 3", "the research step"), then describe the change. If the whole plan is wrong, that is a signal to restate the task more clearly with Message 1 — not to fix it step by step in Message 2.

---

## What good looks like

The plan matches what you actually needed. Your adjustment in Message 2 is small — one line. The output that follows reflects that adjustment without you having to mention it again. You did not have to undo any work.

---

## If the plan is completely wrong

This usually means Message 1 did not give the AI enough information to propose a sensible approach. Go back to Message 1 and add context: who is the audience, what format does the output need to be in, what is the specific goal. The plan is the AI's translation of your brief — if the translation is wrong, the brief needs more in it.

---

## Next

E-05 covered how to manage the start of a conversation well. E-06 covers the other end: how to recognise when a conversation has run its course, how to close it without losing what was valuable, and how to carry forward only what matters into a fresh start.
