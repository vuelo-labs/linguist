# B-11: Build In the Check

## Learning Objective

After this, you treat AI output as a first draft that needs a second look — and you know how to use the AI itself to provide that second look.

---

## Intro

B-10 covered how to open a conversation in a way that gives the AI a clear direction. This module covers what to do once the AI has produced something: how to check it before you use it.

The instinct most people have is to read the output, think "looks fine," and move on. Sometimes that is right. For short, low-stakes tasks — a quick summary, a one-paragraph reply — a fast read is enough.

But for anything you are going to send to someone, publish, act on, or build on top of, "looks fine" is not a sufficient check. This module gives you a simple habit that catches more problems without taking much longer.

---

## The concept: first drafts need a second look

AI output is a first draft. It is often a very good first draft. But it is still a draft — written quickly, without the judgment you bring, without the knowledge of what will happen next with this piece of work.

The most common way people check AI output is to read it once and decide whether it seems right. This catches obvious problems. It misses subtler ones: a claim that sounds plausible but is wrong, a tone that is slightly off for your audience, a gap in the logic that you only notice when someone else points it out.

A more reliable check is to ask the AI to review its own output — or to ask it to take the role of a critical reader.

This is not foolproof. The AI may miss things it also missed the first time. But it catches a different class of errors than reading once yourself, and it takes only one additional message.

---

## Real world

A software engineer named Wes built a system where one AI writes code, and a completely separate AI reviews that code before anything gets used. He called it RoboRev. The reviewing AI's job is adversarial — its instructions are to find problems, not to approve the work.

His observation: without that second pass, the code coming out of the first AI is, in his words, "hot garbage." Not because the AI is bad at its job — but because a single pass, without any challenge, produces output that looks complete but has problems a second set of eyes catches immediately.

The principle scales to any work. One pass produces something plausible. A second pass — from a different angle, with a different brief — catches what the first pass missed.

You do not need to build a system like Wes did. You need one extra message.

---

## If you want to go further: RoboRev

Wes did not stop at one extra message. He built a system called **RoboRev** where one agent writes code and a completely separate agent reviews every commit — automatically, with an adversarial brief. The reviewer's job is to find problems, not approve the work. When it finds them, the writer fixes and commits again.

This is the same habit from this module, scaled into a continuous loop. One pass produces something. A second pass — from a different agent, with a different brief — catches what the first missed. The principle is identical. The system just runs it without you having to prompt it manually.

You do not need RoboRev. The one-message habit is enough. But it is worth knowing that the practitioners pushing hardest on this work have concluded that building the check in is not optional — it is the difference between output that looks complete and output that holds up.

---

## Without / With

**Without:**

> Write a short summary of [document] that I can send to my manager.

You receive the summary, read it quickly, decide it looks fine, send it.

**With:**

> Write a short summary of [document] that I can send to my manager.

You receive the summary. Then you send one more message:

> Read this back as if you are my manager seeing it for the first time. What is missing, unclear, or potentially off-putting?

You get a list of things to tighten. You decide which ones matter. You ask for a revised version.

The second message does not mean the first output was bad. It means you are using the AI to do something a human second reader would do — look at the work with fresh eyes and a critical brief.

---

## The habit

For anything you are going to act on, add one check message after you receive the output.

The check message always has the same shape:

> Read this as [someone who would use or judge this]. What is missing, unclear, or wrong?

You fill in the bracket with whoever will receive or evaluate the piece of work: your manager, a client, a colleague who is sceptical, a student who does not know the background. The more specifically you name the reader, the more useful the check is.

---

## When to skip it

Not every piece of work needs this. Skip the check when:

- The task is small and low-stakes: a quick summary just for you, a rough list you are going to rewrite anyway
- You are still drafting and know you will check later
- You have a real human to review the work before it goes anywhere

Use it when:

- You are about to send something to another person
- You are relying on the output being accurate, not just plausible
- You do not have a human reviewer available and the output matters

---

## Copy, Personalise, Use

Copy this check message and use it after any output you want to test:

> Read this as [the person who will receive or judge this work]. What is missing, unclear, or wrong?

### How to edit this

**[the person who will receive or judge this work]**

Name the reader as specifically as you can. The more context you give, the sharper the check:

- "a client who does not know our internal jargon"
- "my manager, who is sceptical about this proposal"
- "a student seeing this topic for the first time"
- "someone who will argue the opposite position"

The bracket is not asking you to name a real person. It is asking you to make the reading position concrete. "A reader" is too vague. "A busy colleague who will skim this in 30 seconds" gives the AI a clear brief.

**What is missing, unclear, or wrong?**

You can replace or add to this depending on what matters most:

- "What sounds confident but might not be accurate?" — useful when checking facts
- "What would make someone push back on this?" — useful for proposals or arguments
- "What would a non-specialist find confusing?" — useful when checking explanations

Keep the instruction to one question. Multiple questions produce a scattered response.

---

## Exercise

Pick a piece of work you have already asked the AI to help with. It does not need to be from this session — use anything you produced in the last few days.

**Step 1:** Send the check message. Use the template above and name the reader specifically for your situation.

**Step 2:** Read what comes back. Do not accept every suggestion automatically. Ask yourself: is this a real problem, or is the AI being overcautious? Your judgment about what matters is not something the AI can supply.

**Step 3:** For any problem that looks real, ask for a revised version — or make the change yourself if it is small enough.

After you have done this once, note how much the second pass changed versus the first output. That gap is what "looks fine" was missing.

---

## What good looks like

The check message surfaces at least one thing worth changing. You decide which changes matter. The revised version goes out, or gets used, with more confidence than the first draft would have given you.

The check is not about distrust. It is about using the AI for something it is genuinely good at: taking a critical reading position and reporting what it sees. That is different from generating the content in the first place — and it is a useful complement to it.

---

## Tools worth knowing

A few tools that support this kind of work:

**Claude.ai and ChatGPT** are the two main places most people do this kind of work. Both let you have a back-and-forth conversation with an AI. Either works for the check message habit in this module.

**Claude Code and Codex** are coding-focused agents — versions of Claude and ChatGPT that can read files, run commands, and build software. They are what developers like Wes use to do the kind of multi-step work described in the Real World section. You do not need these to use the habit in this module, but it helps to know they exist.

**Agents View** is a tool Wes built himself to browse and search his past agent conversations. It is a good example of the kind of personal tooling that becomes possible when you have AI doing the building: a dashboard of everything your agents have worked on, searchable and organised. There is no single equivalent most people use — but knowing this kind of tool exists is useful context for where AI-assisted work is heading.

---

## Next

B-11 covered how to check a single output before using it. The E series covers more advanced habits for the whole shape of an AI conversation: how to stay in control as the work gets more complex, how to recognise when a conversation has run its course, and how to carry what matters into a fresh start.

If you want a reference for the tools mentioned in this module and across the course, see the [Tool Landscape appendix](appendix-tool-landscape.md).
