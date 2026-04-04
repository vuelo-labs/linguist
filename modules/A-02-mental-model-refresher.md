# A-02: Mental Model Refresher for Claude Code

## Learning objective

After this, you can explain what Claude Code is actually doing when it responds — and use that understanding to write messages that produce the result you intended, not the result the AI guessed at.

---

## What you already know

In the Enabled User stage you learned that context is fuel: the more relevant information you give the AI, the better its response. That is true, and it stays true here.

In Claude Code you will encounter a second truth that sits alongside the first. The container for all that fuel is finite. As your session runs longer, earlier content gets compressed to make room for new content. Both things are true — context is fuel, and the tank has a size limit. They operate at different scales. Context is fuel describes what happens within a message. The finite container describes what happens across a long session. You will learn to manage both.

This module covers the three-part mental model that underpins everything in the advanced track. Get these three ideas solid and every subsequent module will make sense immediately.

---

## Part 1: Claude Code executes your message, not your intent

Claude Code processes the text you send and produces a response. It has no access to what you meant, what you assumed, or what you left unstated. Where your message is ambiguous, Claude Code fills the gap with its own judgement — which may or may not match what you had in mind.

Every decision Claude Code makes on your behalf is one you did not control. The way to control the output is to reduce the decisions left to Claude Code's judgement.

This is the same principle you learned in E-01 when you studied verb choice. In Claude Code, it applies across every dimension of your message: the verb, the scope, the format, the constraints, and the target.

### Without / With: Coding

Without: "Fix the modal."

Claude Code reads the component, decides the whole structure is outdated, rewrites the close logic, extracts a new hook, adds keyboard handling, and reformats the layout. The original bug — a missing click handler — is fixed somewhere in a 200-line change you did not ask for.

With: "Add onClick={onClose} to the overlay div. Do not change anything else."

One edit. The instruction left no room for interpretation.

### Without / With: Content and research

Without: "Research how Notion positions their product."

Claude Code produces a general overview of Notion's product, brand voice, pricing philosophy, and feature set. You wanted specifically how their enterprise tier is differentiated from their standard tier — what it emphasises, what objections it addresses. The general research is accurate but it answers the wrong question.

With:

> Research how Notion positions their Enterprise tier compared to their Business tier. I want to understand:
> 1. What features are exclusive to Enterprise in their public marketing
> 2. What pain points their Enterprise messaging addresses
> 3. What language they use to justify the price premium
>
> Do not summarise their general product — only what differentiates Enterprise.

The constraint ("only what differentiates Enterprise") eliminates the failure mode before it starts.

---

## Part 2: The context window is finite and degrades over time

Everything Claude Code knows about your task lives in the context window. What is not there does not exist. As your session grows longer, Claude Code automatically compacts the earlier parts of the conversation into a summary to make room for new content. That summary replaces the original messages — some details may not survive.

What tends to survive compaction: things you stated explicitly as standalone facts, named constraints, specific decisions you confirmed.

What tends to be lost: details you established only through example, constraints expressed conversationally, tool output and intermediate reasoning.

This is why the way you state things matters as much as what you state. A constraint buried in casual conversation may vanish. The same constraint written as a clear, standalone statement is far more likely to persist.

### Without / With: Coding

Without: A developer establishes early in a long session that all payment errors must be wrapped in a specific error class before they surface. They never restate this. Forty turns later, after compaction, Claude Code starts writing bare error calls. The developer does not notice until code review.

With: The developer states the constraint as a clean, standalone message at the start of the session:

> Important constraint for this entire session: all errors thrown in the payment module must be wrapped in PaymentError. Never throw a bare error. This rule applies to every file we touch.

Explicit standalone messages are preserved verbatim during compaction. The constraint survives.

### Without / With: Content and research

Without: A writer starts a long document production session with style rules — no first-person voice, Oxford comma always, maximum 20-word sentences. They state these once in passing at the start. By the third section the model has started using "we" and writing longer sentences.

With: The writer front-loads the rules as a message written to survive the session:

> Style rules for this entire document — apply to every section:
> - No first-person voice (no "we", "our", "I")
> - Oxford comma always
> - Maximum sentence length: 20 words. Split any sentence that runs longer.
> - Tone: formal but not academic
>
> I will be building this in sections. Remind me if I drift from these rules.

The standalone format and explicit instruction to monitor for drift both help the constraint persist.

---

## Part 3: Tools are how Claude Code acts in the world

Claude Code cannot read your files, search your codebase, run commands, or launch a subagent without tools. Each of those actions is a tool call. Understanding which tools exist and what they cost lets you guide Claude Code toward the right approach rather than letting it choose the most expensive path by default.

A vague request triggers expensive tool chains. A targeted request may need only one tool call. The difference is how precisely you frame the task.

The full tool hierarchy and cost comparison are covered in A-07. For now, the key insight: if you name the tool and the target explicitly, Claude Code uses exactly what you named. If you describe a vague goal, Claude Code decides how to get there — and may take a longer route than necessary.

### Without / With: Coding

Without: "How does currency formatting work in this codebase?"

Claude Code does not know the function name. It searches multiple files to find candidates, reads several of them, and eventually finds the right one. More time, more tokens.

With: "Read the formatCurrency function and explain how it works. Don't look at any other files."

One read. Immediate result.

### Without / With: Content and research

Without: "Find out how many employees Stripe has."

Claude Code may use training data (which may be outdated), or run a vague web search that returns a blog post with a stale figure, or launch an extended research process. The path and the reliability vary.

With:

> Use WebSearch to find Stripe's current employee count. Search for "Stripe employees 2026" and prioritise results from LinkedIn, Crunchbase, or Stripe's own website.
>
> Report the number, the source URL, and the date of the source.

The instruction specifies the tool, the query, the sources to prefer, and the output format. Claude Code cannot take a shortcut.

---

## The three parts, together

These three things describe the same underlying reality from three angles:

| Part | The core idea |
|------|---------------|
| Claude Code executes text, not intent | Say what you mean, explicitly |
| The context window is finite and degrades | State important things durably |
| Tools are the action layer | Name the tool and the target |

Every module in the advanced track is an application of one or more of these. When something goes wrong in a Claude Code session, the cause is almost always traceable to one of these three.

---

## Copy, Personalise, Use

Use this starter to test your own mental model on any task. Fill in the brackets with your real situation.

> I'm working on [brief description of the task]. Here's what you need to know:
>
> [1-3 specific facts that change the output — not everything you know, just what's load-bearing]
>
> Constraints:
> - [What you want preserved or left alone]
> - [Any tool or method preference, if you have one]
>
> Done when: [specific description of what the finished response looks like — format, length, scope]

How to edit this:

- [brief description of the task]: One sentence. Start with a verb. "Draft", "Summarise", "Fix", "Research" — not "Help me with" or "Look at."
- [1-3 specific facts]: Only include facts that would change the response if you removed them. If removing a fact wouldn't change anything, leave it out.
- [What you want preserved]: Any constraint that protects something you don't want changed. "Don't change the structure." "Keep it under 200 words." "Don't add recommendations I didn't ask for."
- [specific description of done]: Format and length. "A single paragraph." "Three bullet points, each under 20 words." "A draft email ready to send."

---

## Next

A-03 covers CLAUDE.md — the file where you store the standing instructions that should apply to every Claude Code session, so you do not have to write them again each time.
