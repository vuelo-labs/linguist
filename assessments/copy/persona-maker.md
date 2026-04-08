# Persona Copy: The Product Manager / Experienced AI User

---

## 1. Profile selector card

**Label:** Daily AI User

**Description:** I use Claude and ChatGPT every day but feel like I'm missing a systematic approach.

**Detail:** You know how to write a decent message. You've set up custom instructions, you understand context windows, you've tried a few multi-step workflows. The results are inconsistent and you can't fully explain why. You're not missing the basics — you're missing the structure underneath them. You've heard about Claude Code and agentic workflows but every tutorial either assumes you're a developer or starts from "what is AI."

---

## 2. Course index recommendation

**Headline:** Skip ahead. Your foundation is already there.

**Body:** The A-track is not a more advanced version of the chat interface tutorials you've already read. It's a different mode entirely — Claude Code runs in your terminal, reads your actual files, and can delegate discrete tasks to separate sessions that run and report back without cluttering your main conversation. After this track you'll be able to control what tools Claude Code uses, write session briefs that produce evaluable outputs, and decide when delegation actually saves time versus when it just costs more. None of that requires you to be a developer.

**Start CTA label:** Start at A-00: Getting Started with Claude Code →

---

## 3. Module intro paragraphs

### E-01: The First Word Matters

You already know that vague prompts give vague outputs. This module makes that pattern precise. The verb you open with determines how much the AI decides for itself — not just the quality of the result, but the scope of what it thinks it has permission to change. If you've ever had Claude rewrite a doc in a way that felt right but wasn't quite what you asked for, the first word is usually why. Worth fifteen minutes even if you think you know this.

### A-00: Getting Started with Claude Code

The install is straightforward — Node.js, one command, an API key you probably already have. What matters here is the mental shift: this is not a faster chat interface. Claude Code can read files you point it at, write to them, and ask your permission before each action. If you're used to copy-pasting content into a chat window, this replaces most of that. The rest of the A-track only works if this session hygiene is in place from the start.

### A-07: Tool Fluency

Claude Code has a hierarchy of tools — Read, Glob, Grep, Bash, Agent — and left to itself it will use whichever feels most thorough. Thorough is not always right, and it's not always cheap. This module is about naming the tool you want in your message, so Claude Code does exactly what you asked rather than something more expansive. The difference between "find where we reference the deadline" and "use Grep to find the word deadline across all files in this folder, show me matching lines only" is not stylistic — it's a different tool, a different cost, and a result you can actually evaluate.

### A-08: Agent Delegation and Briefing

This is where the ceiling-hitting you've been experiencing comes from. You've been running everything through one session, which means every research task, every synthesis job, every "go look at these files and tell me" request is competing for the same context window and generating process noise you don't need. Delegation lets you hand off a specific, bounded task to a subagent that runs independently and reports back with conclusions. The catch: a poorly briefed subagent produces expensive noise. The five-part brief structure in this module is what turns delegation from a gamble into a repeatable pattern.

---

## 4. Exercise variants

### E-01 exercise variant

**The scenario:** You have a PRD draft — or a stakeholder update, or a brief for a design sprint — that you want to sharpen before sending. You send it to Claude with the instruction "improve this" and it comes back noticeably different: reorganised, some of your framing changed, a section that was intentionally brief now expanded. It feels right but it isn't what you asked for.

**Part 1: Side by side**

Take a piece of your own writing — a PRD section, a brief, a stakeholder summary. Something you actually care about keeping close to its original shape.

Send it twice.

**Version A (risky verb):**

> Improve this product brief.
>
> [Paste your text here.]

**Version B (safe verb + constraints):**

> Rewrite the executive summary section of this brief to be more direct. Cut it to under 80 words. Keep the decision framing in the second paragraph — don't restructure it.
>
> [Paste the same text here.]

Then compare:

- What did Version A change that you didn't ask it to change?
- Did Version B respect the constraints you set on the decision framing?
- Which version would you actually send?

You're not looking for better writing. You're looking for the gap between what you asked and what the first word gave the AI permission to do.

**Part 2: A real rewrite**

Think of the last time Claude or ChatGPT rewrote something in a way that lost your voice or restructured something you wanted left alone. If you have it, try it again now with a safe verb and explicit constraints on what to leave untouched. If not: take the same piece from Part 1, try it once with "Fix" (correct errors, nothing more) and once with "Summarise" (condense to key points, no new framing). Note what each one treats as its mandate.

---

### A-08 exercise variant

**The scenario:** A feature request has come in through multiple channels — a few support tickets, some interview notes from the research team, a Slack thread from sales, a comment in a recent retro. You need to know: is there a real pattern here, or is it noise from a vocal few? You could read through everything yourself, but the task is defined enough that you know what a good answer looks like.

**Part 1: The delegation decision**

Before you write the brief, answer the three questions:

1. Is this task independent enough to run without your main session's context? Yes — the documents exist, the question is defined, the subagent doesn't need to know what else you're working on.
2. Will you be able to tell whether the result is correct when you see it? Yes — you know the source material well enough to spot a wrong pattern or a missed signal.
3. Would the intermediate reading fill your main session with content you won't need again? Yes — the subagent needs to read through several files; you need the synthesis, not the process.

Delegate.

**Part 2: Write and send the brief**

Write the full 5-part brief. Use this structure:

> Task for subagent:
>
> **Goal:** A one-paragraph synthesis of the most frequently requested capability across the documents below, with a confidence signal: is this a consistent pattern or a cluster of outliers?
>
> **Context:** These documents are a mix of support tickets, interview notes, and internal Slack exports from the past quarter. We're evaluating whether [feature area] is worth prioritising in the next planning cycle. The question is frequency and consistency of the request, not urgency or sentiment.
>
> **Scope:** Read only the files in [folder or list of files]. Do not draw on any external knowledge about this feature area. Do not recommend a course of action — only report what the data shows.
>
> **Output format:** One paragraph stating the pattern (or lack of one), followed by a bullet list of the strongest supporting examples — file name, brief quote, relevance.
>
> **Length target:** Paragraph under 100 words. Bullet list no more than 6 items.

After the subagent returns, evaluate the output against the brief:

- Did it stay within the files you specified?
- Does the pattern it found match what you'd expect from your own knowledge of the source material?
- Is the bullet list evidence, or is it the subagent hedging?
- If the result is off, what part of the brief allowed the drift — the scope, the goal sentence, the output format?

Rewrite the flawed part. Don't retry with the same brief.

---

## 5. Skip note

B-01 through B-10 cover the foundations — first messages, context loading, recovery. You've done this. E-01 through E-06 are worth a fast read for the vocabulary and the verb reference; E-01 specifically takes twenty minutes and will earn its time back. Skip B entirely and skim E before going straight to A-00. The A-track is where this course starts earning your attention.
