# A-06: Output Engineering in Claude Code

## Learning objective

After this, you can separate the planning phase from the execution phase in Claude Code sessions, and specify the format, length, and structure of Claude Code's responses to get exactly what you need — not what the defaults produce.

---

## What you already know

In E-05 you learned the habit of reading Claude Code's full response before acting on it — treating the first response as a draft, not a final product.

That habit assumes the response is worth reading critically. This module is about the step before: making sure Claude Code produces the right kind of response in the first place.

Two skills here. The first is separating plan from execution. The second is controlling output format. They are related: both are about taking deliberate control of what Claude Code produces before it starts, rather than correcting it after.

---

## Skill 13: Plan before execute

Asking Claude Code to describe its intended approach before it acts — and reviewing that plan before confirming — is the single highest-leverage habit in Claude Code work involving multiple steps or file changes.

The reason: catching a wrong approach in the plan costs one turn. Catching it after execution costs as many turns as it takes to undo, correct, and redo the work. For tasks that touch multiple files or make irreversible changes, the difference is significant.

Claude Code has a built-in planning mode activated with `/plan`. This mode instructs Claude Code to describe what it will do rather than doing it immediately. You can also achieve the same result without a mode switch by adding explicit planning instructions to your message: "Before doing anything, tell me what you plan to do. Wait for my approval."

Both approaches work. The key is making planning a deliberate step, not an optional one.

**When to separate plan from execution:**
- Any task touching more than two or three files
- Any architectural choice — storage approach, structural change, tool or library selection
- Any task in an unfamiliar area of the project
- Any task where the wrong approach would require significant effort to reverse

**When it is fine to skip the plan step:**
- Single, clearly bounded changes you have done before
- Tasks where the entire scope is stated in the message and there is no room for interpretation

### Without / With: Coding

Without: "Add rate limiting to the API."

Claude Code picks an in-memory approach. The team's infrastructure runs multiple servers — in-memory rate limiting does not work across them. Significant rework required.

With:

> Before implementing: describe two or three approaches to adding rate limiting to this API. For each approach, state what method or library, where the state lives, and whether it works across multiple servers.
>
> Do not write any code yet. I will pick the approach, then we will implement it.

The developer picks the right approach. Claude Code implements it. No rework.

### Without / With: Content and research

Without: "Write a case study about the customer's deployment."

Claude Code picks a structure — problem, solution, results — and writes the full draft. The writer wanted results first, in an inverted-pyramid style. The full draft needs to be restructured.

With:

> Before drafting: propose two structures for this case study:
> 1. A traditional problem-solution-results structure
> 2. An inverted-pyramid structure (results first, then how we got there)
>
> For each, give me a one-sentence description of the opening paragraph and the section order. Do not write the full draft yet. I will choose the structure.

One turn to choose. No rework.

---

## Connecting to E-05

In E-05 you learned the two-message pattern for planning: first ask the AI to plan, then confirm before it acts. In Claude Code, `/plan` activates a dedicated planning mode that formalises this into the session. The same principle — see the approach before it becomes action — is now a built-in feature, not just a prompting technique.

If you use `/plan`, Claude Code will present its intended approach and wait. You review. You either approve or redirect. Then it acts.

If you prefer not to use `/plan`, add "Before you do anything, tell me what you plan to do. Wait for my approval before starting." to any message. The effect is the same.

---

## Skill 14: Output format control

Claude Code's default behaviour is to be brief and direct. It leads with the answer and keeps text short. This is a sensible default for many tasks — but it is a default, not a fixed behaviour. When you need reasoning shown, a specific structure, a particular length, or a different register, you must ask for it.

Claude Code also mirrors your verbosity: a short message tends to produce a short response; a detailed message tends to produce a detailed response. Format control is about going beyond the mirror — specifying exactly what you want.

**Format controls you can use:**
- Structure: headers, bullet lists, tables, numbered sections, continuous prose
- Length: word count, paragraph count, number of items
- Reasoning: "walk me through your reasoning before the answer", "explain why, not just what"
- Audience: "write for someone who has not seen this codebase before", "write for a non-technical manager"
- Tone: "formal", "plain language", "concise like a status update"
- Negative constraints: "no subheadings", "no bullet points", "no caveats or disclaimers"

### Without / With: Coding

Without: "Explain this async code."

Claude Code gives a two-sentence summary of what the code does. A junior developer needs to understand why these choices were made, not just what they produce.

With:

> Explain this async function to a developer who understands the language but has not worked with parallel execution before.
>
> Structure your explanation as:
> 1. What the code does (one paragraph)
> 2. Why parallel execution is used here instead of sequential calls (one paragraph)
> 3. What would break if you removed the error handling (one paragraph)
>
> Write for understanding, not brevity. Each section should be three to five sentences.

### Without / With: Content and research (structured findings)

Without: "Summarise what we found about the revenue discrepancy."

Claude Code returns a paragraph. The manager receiving this needs a structured document they can forward to the finance team.

With:

> Write a structured findings summary for a non-technical manager. Use this format:
>
> ## Summary
> [2–3 sentence plain-language summary of the finding]
>
> ## Root Cause
> [One clear sentence identifying what caused the discrepancy]
>
> ## Impact
> [Quantify the discrepancy and the date range affected]
>
> ## Recommended Action
> [One specific action to resolve it]
>
> Write in plain language. Avoid technical terms in the Summary and Root Cause sections.

### Without / With: Content and research (length control)

Without: "Brief me on the AI infrastructure market."

Claude Code produces 600 words across four sections with subheadings. The person asking needed one paragraph for an email they are writing right now.

With:

> Write one paragraph, maximum 100 words, summarising the current state of the AI infrastructure market. Focus on: what is growing fastest and who the dominant players are. No subheadings, no bullet points, no caveats. Write it as if I am forwarding it in an email.

---

## Copy, Personalise, Use

### Starter 1: Planning message

Use this before any multi-step task.

> I want to [describe the task in one sentence].
>
> Before you do anything: tell me
> 1. What you will need to read or review to do this
> 2. What changes you plan to make
> 3. What order you will work in
>
> Do not start working until I confirm the plan.

How to edit this:

- [describe the task in one sentence]: Be specific. "Restructure the research report's argument" rather than "work on the report."
- The three numbered items are the standard planning questions for most tasks. For simple tasks, reduce to one question: "What do you plan to do?" For very complex tasks, add: "What are the main risks or decision points in this approach?"
- "Do not start working until I confirm the plan" is load-bearing. Without it, Claude Code may begin executing while describing the plan.

### Starter 2: Format control message

Use this to specify exactly what form you want the response to take.

> [Verb] [the specific thing].
>
> Format:
> - Structure: [bullet points / numbered list / headers / prose / table]
> - Length: [word count or item count]
> - Audience: [who will read this — their background, what they care about]
> - Tone: [formal / plain / concise / explanatory]
>
> Do not include: [what to leave out — caveats, recommendations, introductions, conclusions, anything that would appear by default that you do not want]

How to edit this:

- [Verb] [the specific thing]: The format control section only works if the task itself is clearly stated first. Verb and target, then format.
- You do not need to fill in every format field. Use only the ones where the default is not what you want. If the default length is fine, skip the length line.
- "Do not include" is often the most useful line. Claude Code adds introductions, closing summaries, and unsolicited suggestions by default. If you want clean output, name what to cut.

---

## Next

A-07 covers tool fluency — naming specific tools in your message, understanding the cost hierarchy, and taking control of which tool Claude Code uses for a given task.
