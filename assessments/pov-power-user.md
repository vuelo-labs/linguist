---
persona: 35-year-old product manager, daily Claude/ChatGPT user, wants to go deeper into Claude Code and agentic workflows
date: 2026-04-08
---

## My Assessment of Linguist

### 1. The homepage — does it self-select correctly?

The "You apologised to the chatbot, didn't you" hook almost bounced me. My first reaction: yes, I did that once, eight months ago, and I stopped doing it within a week. It is aimed at someone earlier in the journey than me.

But then: "The skill isn't learning to prompt better. It's just noticing which mode you're in." That gave me a half-second pause. It is framing AI use as a cognitive skill, not a hack. That is different from most of what I see. I kept scrolling — with skepticism, not excitement. The homepage earns a click-through but does not earn trust yet.

### 2. The course index — three stages

The Beginner track (B-01 through B-10) is not for me. "Your First Message," "Copy, Personalise, Use," "One Thing at a Time" — well-structured for a ChatGPT newcomer, but I would not open a single module.

The Enabled User track (E-01 through E-07) is more interesting. "The First Word Matters" (verb choice and its effect on AI autonomy), "Context Is Fuel," "Restate, Don't Patch," "Get the Plan First" — the titles suggest someone has actually thought about the failure modes of real usage, not just the happy path.

The Advanced Practitioner track is what I actually want to evaluate. Nine modules focused on Claude Code: cost awareness, session hygiene, context management, tool selection, agent delegation. That is not "advanced for beginners." That is a real skill progression.

One signal that tells me this is closer to genuinely advanced: the A-series callout explicitly says "This track requires Claude Code, Anthropic's command-line tool." That is a real gate. They are not pretending that advanced means "slightly harder chat prompts."

### 3. E-01 — signal-to-noise for someone at my level

I read E-01, "The First Word Matters," carefully. The concept: the verb you choose determines how much latitude the AI takes — "Improve" is open-ended (the AI decides what improvement means), while "Rewrite to be more direct, keep it under 150 words, don't change the opening" is bounded. The module calls the former "risky verbs" and the latter "safe verbs."

Do I know this? Yes, intuitively. I already write constrained prompts most of the time. But I have never thought about it as a verb taxonomy — risky verbs vs. safe verbs, with the specific prediction that a risky verb delegates a *judgement* rather than a *task*. "When you use a risky verb, you are not asking for a result. You are delegating a judgement" is a sharper articulation of something I do by feel.

Signal-to-noise ratio: maybe 40/60. I know the underlying principle, but the framework is tighter than what I have in my head. Two or three E-series modules would genuinely sharpen my practice. The rest I would skim.

### 4. A-07 and A-08 — does the advanced track deliver?

**A-07 (Tool Fluency)** teaches you to name the specific tool (Read, Glob, Grep, Bash, Agent) in your Claude Code messages. The key insight: Claude Code defaults to thoroughness, not efficiency — it will reach for a bigger tool than the task needs unless you name the right one.

This is genuinely useful. I have used Claude Code a few times and I did not know I could name tools explicitly to control cost and predictability. The "Without / With" examples are practical. The exercise compares token costs between free-choice and named-tool versions of the same request. That is a real lesson.

**A-08 (Agent Delegation and Briefing)** is solid. The delegation decision framework: delegate when the task is independent, the output is evaluable, and the intermediate steps would clutter your main session. "Never delegate understanding" — if you need to learn something, follow the reasoning yourself. That principle is the kind of thing that sounds obvious once someone says it but I would not have articulated on my own.

The 5-part brief template (Goal, Context, Scope, Output format, Length target) is immediately usable. The cost warning ($5–20 for a complex delegation) is honest.

What works: real operational skills with a real tool. What it is not doing: deep multi-agent architectures, custom tool definitions, system prompt engineering. It gets you to "competent Claude Code user who can delegate tasks to subagents" and stops there. The closing paragraph names a future "Builder track" for API work, system prompts, and multi-agent pipelines — but that track does not exist yet.

### 5. What is missing for me

I sit between "competent chat user" and "developer using the API." Linguist addresses my gap partially. The A-series gets me from "I have tried Claude Code a few times" to "I use Claude Code with intention, cost awareness, and delegation." Real value.

But the gap between where A-08 ends and where I want to be:

- **CLAUDE.md at depth.** A-03 is one module. I want to know how to write project-specific instructions that actually change behaviour in measurable ways — patterns, anti-patterns, what works and what gets ignored.
- **Multi-session orchestration.** A-08 covers single delegation. I want to know how to structure a morning where I spin up three subagents for different aspects of a product spec and synthesise results.
- **The bridge to the API.** The Builder track is mentioned but does not exist. For someone who wants to build lightweight internal tools without being a full developer, the gap between A-08 and "build something with the API" is exactly where I need help.
- **Real-world cost benchmarks.** A-01 covers cost awareness but I want to know what a realistic monthly spend looks like for someone using Claude Code 2–3 hours per day as a PM.

Linguist maxes out at the upper end of "competent practitioner" and does not cross into "builder." Legitimate scope choice, but the product runs out before I do.

### 6. Would I pay for the video walkthroughs?

I am on the fence.

What I would pay for: the A-series specifically. If I could buy just the Advanced Practitioner track for €10, done. Tool Fluency and Agent Delegation alone are worth it for someone who wants to use Claude Code seriously but does not have a developer's background.

What gives me pause: I would skip 60% of the course. Paying €10 for a course where I skip 60% feels wrong, even if the 40% I use is genuinely good. Either a tiered price or a placement test that lets experienced users jump ahead.

What would earn it without hesitation: the Builder track. If A-08 led into modules on API fundamentals, system prompt design, and lightweight tool-building — even at beginner-developer level — I would pay €25–30 for the full course.

### 7. What I'd say in Slack

"The beginner stuff is genuinely well-done but it's not for you. Skip straight to the Advanced Practitioner track — the modules on Claude Code tool selection and agent delegation are the first practical, non-developer-oriented content I've seen on that topic, and they're worth the read even if you skip everything else."
