# A-04: Session Hygiene

## Learning objective

After this, you can scope a Claude Code session to a single task, use `/clear` when changing direction, and recognise when a session has accumulated enough unrelated context that starting fresh will produce better results.

---

## What you already know

In E-06 you learned that conversations have a useful lifespan. When the AI starts repeating itself, forgetting your instructions, or drifting from your topic, it is faster to start fresh than to keep correcting. You learned to write a re-seed — a clean opening message that carries forward what was valuable from the old conversation.

In B-08 you learned that the AI mirrors your session's accumulated style and context. The longer a conversation runs, the more its earlier content shapes later responses — sometimes helpfully, sometimes not.

Session hygiene in Claude Code is the same principle, applied more deliberately. Claude Code sessions accumulate context from tool calls, file reads, and multiple turns. When you switch tasks without clearing that context, the earlier task's details become background noise that affects the new task's output. The `/clear` command is how you reset without leaving the terminal. The session scoping habit is how you avoid needing to clear in the first place.

---

## The three practices

### Practice 1: Scope the session before you start

Decide what one task this session is for before you open it. Not "work on the project" — a specific task with a clear done state.

Good scopes: "Draft the introduction section of the report." "Fix the null pointer error in the payment flow." "Build the weekly metrics summary for the Monday email."

Vague scopes create sessions that drift. Drifting sessions compound context from unrelated work. Compounded context degrades output.

This is the same discipline as "one task per message" from B-09, applied at the session level.

### Practice 2: Use /clear between tasks

`/clear` resets Claude Code's memory within the current session. It is like starting a new conversation without closing the terminal. Your CLAUDE.md instructions stay active (they are reloaded at the start of every context). The accumulated conversation history goes away.

Use `/clear` when:
- You have finished one task and are starting a different, unrelated task
- The current session has gone in a direction you want to abandon
- You want a fresh read on something without the earlier conversation influencing the response

You do not need to use `/clear` between closely related steps in the same task. If you are drafting section 3 of a report and just finished section 2 in the same session, the context from section 2 is useful — keep it.

### Practice 3: Front-load your constraints

State everything Claude Code needs to know about a task before it starts working. Not during. Not after.

This is the same principle as E-02 (constraints), but in Claude Code it has a cost dimension: when Claude Code makes a wrong choice because a constraint was missing, correcting it requires rework. Rework means more tool calls. More tool calls means more tokens. Stating the constraint upfront costs nothing extra.

Front-loading also protects your constraints through compaction. Constraints stated before the model begins work are stated in early, prominent user messages — exactly the messages that compaction preserves. Constraints added mid-task as conversational corrections are far more likely to be compressed or lost.

---

## Without / With

### Session scoping: Coding

Without: A developer debugs a Redis connection issue, then in the same session switches to building a new API endpoint. The session grows long and compacts. The summary now contains extensive context about Redis connection strings, retry logic, and environment variables — none of which is relevant to the API endpoint. The model's response to the new task is subtly contaminated: it adds unnecessary connection error handling to the endpoint code because it is "aware" of connectivity problems that were already resolved.

With: After the Redis issue is resolved, the developer types `/clear`. The new session starts with only the endpoint task in context. The output is clean.

### Session scoping: Content and research

Without: A researcher investigates two separate competitive topics in one session — first a competitor's new product, then a second competitor's pricing changes. By the time they reach the second topic, the model's context is full of details about the first competitor. The compaction blends the two. The model draws comparisons between the two competitors that were not requested, and occasionally attributes features to the wrong company.

With: Two sessions. One per topic. Each starts with a clean brief. The research stays separate.

### Front-loading constraints: Coding

Without: A developer writes "add date formatting to the new feature." The project is mid-migration from one date library to another. The model picks the old library because it appears throughout the existing code. The developer has to correct it. Two turns instead of one.

With:

> Add a date formatting function to the utilities file. Use the new date library we are migrating to — not the old one you will see in the existing files. Format: "January 5, 2026" (full month name, day, four-digit year).

The constraint is present before the model writes a single line.

### Front-loading constraints: Content and research

Without: A product manager asks for help preparing for a difficult stakeholder meeting. The model produces a full preparation document: context summary, stakeholder profiles, recommended framing, complete question-and-answer prep, and talking points. The PM wanted three bullet points addressing one specific objection.

With:

> Give me three bullet points — one to two sentences each — addressing the most likely objection from finance to a six-week roadmap delay: that the team underestimated the work.
>
> Do not give me background context, a prep document, or framing advice. Just the three bullets.

---

## Connecting to B-08 and E-06

The session hygiene skills in this module are Claude Code versions of two things you already know.

**B-08 (Recovery)** taught you what to do when output goes wrong. `/clear` and session scoping are how you prevent the conditions that make recovery necessary in the first place. Clean sessions produce cleaner output; you recover less often.

**E-06 (Migration and Re-seed)** taught you to recognise when a conversation has run its useful course and to start fresh with a re-seed. In Claude Code, `/clear` gives you a faster version of the same reset — you do not need to open a new conversation, just type `/clear` and write your opening message for the new task as a re-seed would.

The re-seed format from E-06 works here:

> I've been working on [previous task]. That work is done. The new task is: [new task, with constraints].

---

## Copy, Personalise, Use

Use this starter at the opening of any Claude Code session. It front-loads your task scope and constraints before any work begins.

> Session scope: [one-sentence description of the single task for this session]
>
> What I need:
> [Verb] [the specific thing]. [Stopping condition — format, length, scope].
>
> Constraints:
> - [What to leave alone or not change]
> - [Any tool, method, or boundary restriction]
> - [What not to add, suggest, or include]
>
> Done when: [specific description of the finished output]

How to edit this:

- [one-sentence description]: One task. If it takes more than one sentence to describe, you are probably scoping more than one session's worth of work. Split it.
- [Verb]: Start with a precise verb. Fix, draft, summarise, research, read, compare. Not "help me with" or "look at."
- [Stopping condition]: Tell Claude Code when to stop. Word count, number of items, a specific format, or an explicit "stop here and wait for my feedback."
- [What to leave alone]: Any constraint that protects something you want preserved. Anything Claude Code might change by default that you do not want changed.
- [Done when]: Describe the finished state specifically enough that you will know when you have arrived. "A draft" is not specific. "A 150-word draft email, professional tone, no sign-off" is specific.

---

## Next

A-05 covers context awareness and compaction in depth — what happens when a session gets long, what survives the automatic summarisation, and how to write messages that preserve what matters.
