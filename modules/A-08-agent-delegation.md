# A-08: Agent Delegation and Briefing

## Learning Objective

After this, you can decide when to delegate a task to a subagent, write a 5-part brief that gives the subagent everything it needs, and evaluate whether the result matched what you asked for.

---

## Cost Warning

Agent delegation is the most expensive Claude Code operation. A subagent runs its own context window — every file it reads, every search it runs, every response it generates adds to your total cost on top of the main session. A complex delegation can cost $5–20, as noted in A-01's benchmarks.

Set a budget before delegating. If you are unsure whether to delegate, do the task in the main session first. You can always delegate a second attempt once you understand what the task actually requires.

---

## What You Already Know

In E-05 you learned the habit of asking the AI to plan before it acts. In A-06 you formalised that into a deliberate planning step within Claude Code.

Delegation takes this further. You are not asking Claude Code to plan a task and then execute it in front of you. You are asking it to hand that task off to an entirely separate session — a subagent — which will run its own tool calls, produce its own results, and report back with a summary. You receive conclusions, not process.

This is powerful. It is also the most expensive thing you can do in Claude Code. Understanding when to use it — and when not to — is the final skill in the Advanced Practitioner track.

---

## Core Concept: The Delegation Decision

Not every task benefits from delegation. The decision has two sides.

**When to delegate:**
- The task is genuinely independent — it does not require context from what you are currently working on in the main session
- The task has a clear, specific output that you can evaluate once it arrives
- The task is complex enough that the tool calls and intermediate results would fill your main session with content you will not need again
- Multiple independent subtasks can run without depending on each other

**When not to delegate:**
- The task requires your direct judgement — you need to be in the room as the thinking happens, not handed a summary
- The task is simple enough for the main session: reading two or three files, searching for a known pattern, summarising a document you have in front of you
- You do not yet understand the task well enough to evaluate the output
- Cost is a concern and the main session can handle it

The clearest principle is this: never delegate understanding. If you need to understand something — to learn it, to develop a view on it, to make a decision based on it — do it in your main session. If you need something produced — researched, compiled, checked, summarised — and you know enough to evaluate the result, delegation is worth considering.

Delegation done well gives you conclusions without the noise of the process. Delegation done poorly gives you an expensive result you cannot assess.

### The delegation test

Before delegating, ask yourself three questions:

1. Is this task independent enough to run without my main session's context?
2. Will I be able to tell whether the result is correct when I see it?
3. Would the intermediate tool calls and results fill my main session with content I will not need again?

If the answer to all three is yes, delegation is likely worth it. If the answer to question 2 is no — you cannot evaluate the output — do the task in the main session so you can follow the reasoning.

### Without / With: The delegation decision in practice

**Task A — Research the three most common objections to [your product or service] and summarise how each one is typically handled.**

This is a good candidate for delegation. It is independent of your current work. The output is specific and bounded. You will be able to tell whether the summaries are accurate. The intermediate web searches and source reading would generate a large volume of content you would not need in your main session. Delegate.

**Task B — Review my draft email to a client and tell me whether the tone is right.**

This is not a good candidate for delegation. The question — is the tone right? — requires your judgement, not the subagent's. You know this client. You know what the relationship requires. A subagent will give you an opinion, but you cannot evaluate it without doing the same thinking yourself. Do this in the main session.

---

## The 5-Part Brief

A subagent starts every task with zero context. It has not seen your main session. It does not know what you have tried, what you have decided, or why this task matters. Brief it the way you would brief a capable colleague who has just walked into the room with no background.

A good brief has five parts:

**1. Goal** — one sentence. What do you need the subagent to produce? Not what you want it to do — what you need to have in your hands when it is done.

**2. Context** — what the subagent needs to know that it cannot see from the files alone. Background on the project. Decisions already made. Things already tried. Why this task exists. This is what the subagent cannot infer and will get wrong without you telling it.

**3. Scope** — what is in and what is explicitly out. If you want three competitors researched, name them and exclude everything else. If you want one section of a document reviewed, name it. Scope protects against the subagent doing more — or less — than you intended.

**4. Output format** — the structure, headings, and form of the response. If you want three sections, say so. If you want a table, describe it. If you want bullet points, name it. The subagent will default to its own format if you do not specify.

**5. Length target** — a word count or item count. "Under 300 words total." "One paragraph per topic." "A list of no more than 10 items." Without this, the subagent will produce whatever length feels complete to it — which may be much more than you need.

These five parts are not bureaucratic. They are the minimum information a capable person would need to do the job without coming back to ask questions. Write a brief that could be handed to someone with no other context and still produce exactly what you need.

---

## Without / With: The Brief in Practice

### Coding example — security review

Without:

> Review the auth changes for security issues.

The subagent does not know which files, which changes, what has already been checked, or what format to report in.

With:

> Goal: Identify any security issues in the recent authentication changes.
>
> Context: We are migrating from tokens stored in the browser to httpOnly cookies. The relevant files are src/auth/token.ts and src/middleware/auth.ts. CSRF protection and token expiry have already been checked. This review is specifically about JavaScript exposure and the Secure cookie flag.
>
> Scope: Read only src/auth/token.ts and src/middleware/auth.ts. Do not look at other files.
>
> Output format: A bulleted list of issues found. If no issues are found, say "No issues found." Do not summarise the changes — only report problems.
>
> Length target: Under 200 words.

### Content and research example — competitor objections

Without:

> Research how competitors handle objections to their product.

The subagent does not know which competitors, which objections, what the research is for, or how to format the result.

With:

> Goal: Research the three most common objections to [product/service] and summarise how competitors address each one.
>
> Context: I am preparing a sales presentation for [audience]. The competitors to focus on are [names]. I need to understand how they position themselves, not to copy them, but to anticipate what the audience may have already heard.
>
> Scope: Only these three competitors. Do not recommend a response strategy — just summarise what they do.
>
> Output format: Three sections, one per competitor. Each section: competitor name, the objection they address most prominently, and how they address it.
>
> Length target: Under 300 words total.

---

## Exercise: Write and Send a Brief

### Part 1 — The delegation decision

Read these two tasks. Before moving on, decide for each: delegate or do in the main session? Write down your reasoning.

**Task A:** Research what the top 3 project management methodologies are and write two sentences summarising each one.

This is a good candidate for delegation. It is independent, the output is specific and bounded, you can evaluate whether the summaries are accurate, and the intermediate research would fill your main session with content you will not need again.

**Task B:** Read through my draft proposal and tell me whether the argument is persuasive.

This is not a good candidate for delegation. Whether the argument is persuasive depends on your judgement, your knowledge of the audience, and your sense of what counts as persuasive in this context. A subagent's opinion is not the opinion you need. Do this in the main session.

### Part 2 — Write and send a brief

Choose a task from your own work that is genuinely delegatable. It should pass the three-question test: independent, evaluable output, would generate noise in the main session.

Write the full 5-part brief using the template below. Do not skip parts. If you find yourself unable to write one of the parts, that is a signal: the task may not be as clear as you thought, or it may not be delegatable after all.

Send the brief. When the subagent returns, evaluate the output against your brief:
- Did it stay within the scope you defined?
- Is the output in the format you specified?
- Is the length within your target?
- Can you tell whether the result is correct?

If the answer to any of these is no, note what the brief got wrong. You will use that in the recovery path.

---

## Copy, Personalise, Use

Use this brief template for every delegation:

> Task for subagent:
>
> Goal: [one sentence — what you need produced]
>
> Context: [what the subagent needs to know that it cannot see from the files alone]
>
> Scope: [what is in / what is explicitly out]
>
> Output format: [structure, headings, form of the response]
>
> Length target: [word count or item count]

How to edit this:

- Goal — one sentence, starting with a noun or verb: "A summary of...", "A list of...", "An analysis of...". If it takes more than one sentence to state the goal, the task may need to be broken into two delegations.
- Context — everything the subagent needs to do the job without coming back to ask. If you find yourself writing "as you know" or "as we discussed" — delete it. The subagent knows nothing. Start from scratch.
- Scope — name what is in and name what is out. "Only these three documents" or "any files in the research/ folder" or "do not include recommendations — only findings."
- Output format — be specific. If you want a table, describe its columns. If you want three sections, name them. If you want plain prose, say so.
- Length target — a ceiling, not a target. "Under 300 words" means the subagent should stop at 300 even if it has more to say. That constraint forces prioritisation.

---

## What Good Looks Like

The subagent produces exactly what the brief specified — no more, no less. The output fits within the length target. The format matches what you asked for. When you read it, you can evaluate whether it is correct, because you gave the subagent a precise enough scope that you know what correct looks like.

You do not need to understand how the subagent got there. You specified the output. The subagent handled the process. That is the point of delegation.

---

## Recovery Path

If the subagent output misses the brief — wrong scope, wrong format, wrong length, or an answer to a question you did not ask — do not re-delegate immediately.

Bring the output back to your main session and ask: what did the brief fail to make clear? Was the scope too broad? Did the goal sentence allow more than one interpretation? Was the format underspecified?

Identify the flaw in the brief. Rewrite the affected part. Then, if the task still warrants delegation, send the corrected brief.

Do not try to correct the subagent's output by continuing to send it messages. Once the brief fails, the session is over. The correction happens in the brief, not in the conversation.

---

## You Have Completed the Advanced Practitioner Track

You now have the full Claude Code workflow: cost awareness, mental models, persistent instructions, session hygiene, context management, planning before execution, tool selection, and delegation.

These are not steps in a sequence to be done once. They are habits that compound. The practitioner who names tools in every message, separates planning from execution, and delegates only what genuinely warrants isolation will get consistently better results at consistently lower cost than one who relies on Claude Code's defaults.

The next stage — the Builder track — is for those who want to design AI systems for others: building workflows, writing system prompts, defining tools, and architecting multi-agent pipelines via the API or Workbench. If that is where you are headed, continue to X-01: API Fundamentals.
