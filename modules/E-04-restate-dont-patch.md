# E-04: Restate, Don't Patch

## Learning objective

After this, you can identify when a correction spiral has started, stop it, and restate from scratch — faster and with better results than continuing to patch.

---

## Intro

In E-03 you learned to load context before the AI starts — giving it what it needs so the first response is specific, not generic. E-04 is what to do when, despite that, a conversation still goes wrong. Not every wrong response means starting over. Small corrections in the same conversation work fine. The skill is recognising the moment when patching has stopped working and restating has become the faster path.

---

## The concept

Small corrections work. If the response is close to what you wanted but needs a specific change — shorter, different tone, swap out one section — you can ask for that in the same conversation. The AI has what it needs, and the adjustment is straightforward.

What does not work is layering corrections when the original direction was wrong.

"No, I meant more analytical." Then: "Actually, can you make it less formal?" Then: "It's still not quite right — can you try focusing on the practical side rather than the theory?" Each message is trying to fix the previous response, but the previous response was already built on a misunderstanding. Each new correction inherits that misunderstanding and adds another layer on top of it.

The signal is simple: **you are spending more words correcting than you would spend rewriting from scratch.**

At that point, the conversation is working against you. The efficient path is to start fresh. Take everything you learned from the failed attempt — what did not work, what you actually needed — and write a new first message that incorporates it.

This is not failure. The AI has no memory of your effort. It does not register that you tried. Every new conversation is clean. Use that.

---

## Recognising the spiral

Three signals that a correction spiral has started:

1. You have sent more than two corrections in a row and the response is still not what you wanted.
2. The AI keeps circling back to something you already corrected — it has lost track of what you asked it to change.
3. Your messages are getting longer, not shorter, as you try to explain what you mean.

Any one of these is enough. When you notice one, stop. Do not send another correction. Restate.

---

## The exercise

### Part 1 — Find the spiral

Think back through your recent conversations with an AI. Find one where you sent three or more correction messages — "no, I meant...", "actually, can you change...", "try it again but..."

Look at the final response in that conversation. How similar is it to the first response? How similar is it to what you actually wanted? How many messages did it take to get there?

You are not grading yourself. You are recognising the pattern so you can spot it faster next time.

If you do not have a recent conversation to look at, that is fine — move straight to Part 2.

### Part 2 — Restate it

Take the same task from that conversation — or any task where you suspect a single well-formed message would do better than a back-and-forth.

Write a new first message from scratch. Use what you have learned across the course:

- Opening seed from B-10 (role, task, context, done-when)
- Verb from E-01 (safe verb, defined ceiling)
- Constraint from E-02 (what to leave alone)
- Context from E-03 (load-bearing facts only)

Send it. Compare the first response to what you got after three rounds of correction in the original.

---

## Copy-Personalise-Use

### The restate starter

> Starting over. I'm a [role] working on [specific task]. I need you to [verb] [specific thing]. [One load-bearing fact]. [Stopping condition]. [Constraint: what to leave alone].

### How to edit this

The phrase "Starting over" is optional — you do not need to announce that you are beginning fresh, especially in a new conversation. It is there to break the habit of treating the new message as a continuation.

- **[role]** — who you are, for context.
- **[specific task]** — what you are working on, in one sentence.
- **[verb]** — from E-01. Pick the one with the right ceiling for this task.
- **[specific thing]** — what you want the verb applied to. Be more specific than you were the first time.
- **[one load-bearing fact]** — the context that most changes the output. You probably know what this is now, because the first attempt showed you what the AI assumed when you did not tell it.
- **[stopping condition]** — what done looks like.
- **[constraint]** — what to leave alone.

The difference between this and your first attempt is usually specificity. You now know what the AI will do if you leave something vague. Fill that gap.

---

## What good looks like

The first response to your restate is closer to what you wanted than the fifth response in the original conversation. You used one message instead of six. The AI did not need to be corrected — it had what it needed from the start.

---

## If the restate also goes wrong

This is less common, but it happens. If it does: look at the restate message itself and run the load-bearing test from E-03. What is the AI still having to guess? Add that, and try once more. Three clear attempts — each one a full restate, not a patch — is usually enough to identify what the task actually needs.

---

## Next

Restating is the reactive skill — what to do when a conversation has already gone wrong. E-05 is the proactive equivalent: for multi-step tasks, how to get the AI to show you its plan before it starts, so you can redirect before any work has been done.
