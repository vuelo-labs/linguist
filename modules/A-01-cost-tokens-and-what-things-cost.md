# A-01: Cost, Tokens, and What Things Actually Cost

## Learning Objective

After this, you can estimate the cost of a Claude Code session before starting, read token usage after, and understand what makes sessions expensive.

---

## Before You Go Further

You have run your first session. You know what Claude Code can do -- it reads files, writes files, runs commands, and reports back. You have approved your first tool call and seen your first response.

Before you go further, know what it costs.

Claude Code is not free. Every session is metered. This module gives you the mental model to use it with intention, not surprises. It is not here to make you cautious. It is here to make you informed.

---

## What a Token Is

A token is roughly three-quarters of a word. "Hello world" is about 3 tokens. A short paragraph is about 75 tokens. A full page of text is about 400 tokens.

Everything you send and everything Claude Code responds with costs tokens. The files it reads become tokens. The commands it runs produce tokens. Token cost is what becomes your bill.

---

## How Billing Works

Claude Code uses the Anthropic API. You are billed based on how many tokens flow through each session.

There are two sides to every exchange:

- **Input tokens** -- what you send. This includes your messages and any file content Claude Code reads on your behalf. If you ask Claude Code to read a 10-page report, every word of that report becomes input tokens.
- **Output tokens** -- what Claude Code generates. Its responses, any files it writes, any plans it explains. Output tokens cost more per token than input tokens.

**Tool calls add up.** Every time Claude Code reads a file, searches your folders, or runs a command, the action and its result both contribute tokens. A session with 15 tool calls uses significantly more tokens than a session with 2.

**Different models, different costs.** Claude Code can use different models depending on the task:

- **claude-opus-4-6** -- the most capable model. Also the most expensive per token. Used for complex reasoning and difficult tasks.
- **claude-sonnet-4-6** -- the default for most Claude Code sessions. Strong capability at a moderate price.
- **claude-haiku-4-5** -- the fastest and cheapest model. Used for simpler tasks where speed matters more than depth.

Pricing changes over time. For current per-token rates, check anthropic.com/pricing.

---

## What Makes a Session Expensive

Four things drive cost. Each one is within your control.

### Long context

Sharing a 50-page report costs more than sharing one page. Every token of that document is processed as input.

You learned in E-03 that context is fuel -- the more relevant material you give Claude Code, the better the result. That remains true. The cost side is straightforward: give it what it needs, not everything you have. If you need a summary of chapter 3, share chapter 3, not the whole book.

### Many tool calls

Each file read, each command, each search adds tokens to the session. A session where Claude Code reads 20 files costs more than one where it reads 2.

This does not mean you should avoid tool calls. It means you should be specific. "Read the introduction of annual-report.pdf" costs less than "Look through all the documents in this folder and figure out what's relevant." Name the file. Name the section. Reduce the search space.

### Long sessions

Claude Code resends the conversation history with every message. The longer a session runs, the more context accumulates, and the more tokens are sent with each new exchange. Message 25 in a session costs more than message 3, even if both messages are the same length.

Keep sessions focused on one task. When you finish, start a new session for the next task. Use `/clear` to reset context when you change direction within a session. Fresh sessions are cheaper.

### Agent delegation

When Claude Code spawns a subagent -- a separate AI instance that handles part of the work -- that subagent runs its own context window. It reads its own files, generates its own responses, and costs its own tokens. Delegation multiplies cost because you are paying for two or more AI sessions at once.

A-08 covers agent delegation in detail. For now, know that it exists and that it is the single biggest cost multiplier in Claude Code. Do not use delegation until you reach that module.

---

## Reading Your Usage

Token counts appear in two places.

**In Claude Code:** at the end of each response, you will see the number of input tokens and output tokens used. This tells you what that exchange cost.

**In console.anthropic.com:** the usage dashboard shows your total usage over time, with per-session breakdowns. This is where you see the full picture -- which sessions used the most tokens, how your usage trends over days and weeks.

### What the numbers mean

The two numbers that matter are input tokens and output tokens. Input is everything you sent -- your messages plus every file Claude Code read. Output is everything Claude Code generated -- its responses plus any files it wrote.

Here is a worked example. Suppose a session shows:

- 15,000 input tokens
- 3,000 output tokens
- Model: claude-sonnet-4-6

At approximate current pricing (which may have changed since this was written), Sonnet input tokens cost around $3 per million and output tokens cost around $15 per million. That session would cost roughly:

- Input: 15,000 / 1,000,000 x $3 = $0.045
- Output: 3,000 / 1,000,000 x $15 = $0.045
- Total: approximately $0.09

Nine cents for a focused working session. That is a realistic number for a short-to-medium session with a few file reads and clear messages.

The numbers scale linearly. Double the tokens, double the cost. A session with 150,000 input tokens and 30,000 output tokens on the same model would cost roughly $0.90. A session on Opus with the same token counts would cost several times more.

---

## Setting a Mental Budget

Before starting a session, ask yourself:

1. **How many messages am I likely to send?** A focused 5-message session is cheap. A 30-message exploration costs more.
2. **Will Claude Code need to read large files?** Each file read adds tokens proportional to the file size.
3. **Will I be using agent delegation?** If yes, multiply your estimate.
4. **What is my limit for this task?** Set it before you start, not after.

### Rough benchmarks

These are honest approximations to build your intuition. Actual costs depend on the model, the length of your messages, and the size of files involved.

- **Short focused session** (5-10 messages, no large file reads, minimal tool calls): a few cents. This is your typical "summarise this document" or "rewrite this paragraph" session.
- **Medium working session** (20-30 messages, several file reads, back-and-forth iteration): tens of cents to low single-digit dollars. This is a realistic session where you are working through a task with some complexity.
- **Long session with many tool calls** (30+ messages, reading and writing across multiple files, running searches and commands): several dollars. This is a deep research or multi-file editing session.
- **Agent delegation on a complex task** (subagents reading and writing across many files, running their own tool chains): $5-20 depending on scope. This is the high end, and you will not reach it until A-08.

The pattern is simple: more tokens in, more tokens out, more cost. You now have the mental model to predict which sessions will be cheap and which will not.

---

## The Cost Gate

From here in the course, two modules carry a cost warning before their exercises:

- **A-07: Tool Fluency** -- where you learn to guide Claude Code's tool selection. Each tool call costs tokens, and some tools are more expensive than others.
- **A-08: Agent Delegation** -- where you learn to delegate tasks to subagents. Delegation multiplies cost because each subagent runs its own context window.

These are where cost can escalate quickly. You have the mental model to use them wisely.

---

## Next

You understand what tokens are, how billing works, what makes sessions expensive, and how to set a mental budget.

Continue to A-02: Mental Model Refresher for Claude Code.
