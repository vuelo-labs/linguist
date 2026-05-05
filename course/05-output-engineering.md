---
course-revision: 2026-05-05
---

# Layer 5 — Output Engineering
## Skills 13–14

Output engineering in 2026 has two layers, and they are not equally powerful. The lower layer is API primitives — structured outputs, effort levels, per-task token budgets, `thinking.display` — that constrain shape and reasoning depth at decode time. The upper layer is prompt mechanics — separating plan from execution, asking for the format you want in prose. The API primitives are the canonical controls when you own the request; prompt mechanics are what you fall back to inside a harness like Claude Code where the API call belongs to someone else. Reach for the lower layer first when you can; reach for the upper layer always.

These two skills cover the prompt mechanics. The new section below them — **API-level output controls** — covers the lower layer. The order in this module reflects the priority: API first, prose second.

---

## API-level output controls

When you call the Claude API directly (or through the SDK, or via `ant`), four primitives shape output more reliably than any prompt instruction. None of them are visible from inside Claude Code, because Claude Code owns the request. All of them are first-class for an Advanced learner building on the API.

### Structured outputs (`output_config.format`)

As of Feb 5, 2026, structured outputs are GA and the parameter formerly known as `output_format` is now `output_config.format` (the rename shipped alongside fine-grained tool streaming GA). When you need a guaranteed shape — JSON conforming to a JSONSchema, a constrained enum, a typed field — `output_config.format` is the canonical mechanism. The model is constrained at decode time. Free-text deviation is impossible, not merely discouraged.

Reach for `output_config.format` when the consumer is a parser, validator, or another tool call. Stop writing "respond with valid JSON only, no preamble" — set the parameter and let the platform enforce it. Prompt-only schema instructions are an anti-pattern when the API can guarantee the shape.

### Effort levels (low / medium / high / `xhigh`)

The `effort` parameter (Feb 5, 2026, GA — replaced `budget_tokens` on new models) controls reasoning depth. On Opus 4.7 (Apr 16, 2026) there is a fourth level, `xhigh`, for long-horizon agentic coding and multi-step self-verification work. `xhigh` costs more thinking tokens and more wall-clock time; it is not a free upgrade.

Use `low` for classification, extraction, formatting passes — work where the answer is mostly retrieval. Use `medium` as a sane default. Use `high` when the model needs to plan multiple steps or weigh tradeoffs. Reserve `xhigh` for Opus 4.7 work where you have already seen `high` produce a wrong plan or stop short of self-verification — it is the right answer for a narrow band of problems and overkill for most.

### Per-task token budgets

Opus 4.7 also accepts per-task token budgets — a ceiling on output tokens scoped to a particular task within a longer agentic run, rather than the whole response. This is the budget control to reach for when you need a long-running agent to spend modestly on each sub-step but generously on the whole run. The older "set `max_tokens` and hope" pattern is a blunt instrument by comparison.

### `thinking.display: "omitted"`

Mar 16, 2026 introduced `thinking.display: "omitted"`. The model still reasons, the thinking signature is preserved for multi-turn continuity, billing is unchanged — but the thinking content is dropped from the streaming response. Use this when you want the latency and bandwidth wins of skipping thinking-token streaming without giving up the quality of extended thinking. It is a pure infrastructure switch; it does not change what the model does, only what it sends back.

### When to use which

| You want | Reach for |
|----------|-----------|
| Output shape guaranteed against a schema | `output_config.format` |
| Reasoning depth dial | `effort: low / medium / high / xhigh` |
| Per-sub-step output cap inside a longer agent run | Per-task token budgets (Opus 4.7) |
| Faster streaming without losing extended-thinking quality | `thinking.display: "omitted"` |
| Format constraints inside Claude Code (no API access) | Skill 14 (prose mechanics, below) |
| Catching a wrong plan before execution, anywhere | Skill 13 (below) — and auto mode's plan step when in Claude Code |

*(All four primitives verified against the 2026-05-05 platform notes. Inside Claude Code the harness owns the request, so this section is most directly actionable when you're calling the API yourself or via `ant`.)*

---

### Skill 13: Separating Plan from Execution

**What it is:** Asking the model to describe its intended approach before it takes action — reviewing the plan, then confirming before work begins.

**Why it matters:** The model is biased toward action. For multi-step tasks, catching a wrong approach in the plan costs one turn; catching it after execution costs as many turns as it takes to undo and redo the work. The same principle is now wired into Claude Code's permission model — and the right framing is no longer "use `/plan`" but "pick the right operating mode for the work".

**The 2026 Claude Code permission model** (per the Mar 25, 2026 engineering blog *Claude Code auto mode: a safer way to skip permissions*, and v2.1.x changes through 2026-05-05):

| Mode | Behavior | When to use |
|------|----------|-------------|
| Default | Pause and confirm before mutating actions | Unfamiliar codebases, sensitive paths, anything you can't roll back cheaply |
| Plan mode (`/plan`) | Model produces a plan; no tool execution until you approve | Architectural decisions, multi-file refactors, anything where a wrong approach costs significant rework |
| Auto mode | Model classifies each action and skips prompts for low-risk ones; classifier failures surface an actionable hint (retry / `/compact` / `--debug`); spinner turns red on stalled checks | Long-horizon work in a codebase you trust, where prompt fatigue is itself a risk |
| `--dangerously-skip-permissions` | Bypass prompts including writes to `.claude/`, `.git/`, `.vscode/`, shell config files (v2.1.126 expanded scope; catastrophic-removal safety net remains) | Sandboxes, scratch repos, never on a working tree you care about |

The skill is choosing — and announcing — the mode that matches the work. Plan mode is the right move for the tasks below. Auto mode is the right move when you have already de-risked the approach and want to remove friction from the execution. Default is the right move when you're not sure.

**When to separate plan from execution:**
- Any task touching more than 2–3 files
- Any architectural decision (storage approach, library choice, data structure)
- Any task in an unfamiliar codebase
- Any task where the wrong approach would require significant rework to reverse

The principle generalizes beyond Claude Code. On the API, the same discipline shows up as a planning turn before the execution turn — same shape, no harness affordance. The model's bias toward action is a property of the model, not of the CLI.

---

**Example 1 — Coding (architectural decision)**

*Scenario:* A developer wants to add rate limiting to a Node.js Express API. There are several valid approaches (middleware, Redis-backed, in-memory, per-route vs global) and the wrong one for the team's infrastructure would require significant rework.

*WITHOUT:* The developer writes `add rate limiting to the API`. The model picks an in-memory approach using `express-rate-limit` and implements it. The team's infrastructure is Kubernetes with multiple replicas, so in-memory rate limiting doesn't work across pods. Significant rework required.

*WITH:*
```
Before implementing: describe three approaches to adding rate limiting to this
Express API. For each approach, note: what package or method, where the state
is stored, and whether it works across multiple instances.

Do not write any code yet. I'll pick the approach, then we'll implement it.
```

The developer picks the Redis-backed approach. The model implements it. No rework. Inside Claude Code, dropping into `/plan` mode achieves the same separation through the harness rather than through the prompt — pick whichever fits the session.

---

**Example 2 — Data/Analytics (pipeline design)**

*Scenario:* A data engineer needs to restructure how a metrics pipeline handles late-arriving data. Several approaches are valid: window functions, incremental materialization with lookback, or a separate correction table.

*WITHOUT:* The engineer writes `fix the late data problem in the metrics pipeline`. The model chooses an approach and starts rewriting SQL. The chosen approach doesn't match the team's dbt materialization strategy.

*WITH:*
```
The metrics pipeline in models/marts/daily_metrics.sql doesn't handle
late-arriving events correctly. Before making any changes:

Describe two or three approaches to handling late data in this dbt model.
For each: what the approach is, what it changes in the model, and what
the tradeoffs are in terms of query cost and accuracy.

Do not modify any files yet.
```

---

**Example 3 — Content/Research (structural planning)**

*Scenario:* A content writer needs a case study written about a customer, but isn't sure whether it should lead with the problem, the solution, or the results.

*WITHOUT:* The writer says `write a case study about Acme Corp's deployment of our platform`. The model picks a structure (problem-solution-results) and writes the full draft. The writer wanted the results up front in an inverted pyramid style.

*WITH:*
```
Before drafting: propose two different structures for this case study:
1. A traditional problem-solution-results structure
2. An inverted pyramid structure (results first, then how we got there)

For each, give me a sentence describing the opening paragraph and the
section order. Do not write the full draft yet. I'll choose the structure.
```

---

### Skill 14: Output Format Control

**What it is:** Explicitly specifying the format, length, and structure of the output — when the API-level controls above aren't available to you, or when the shape is illustrative rather than contractual.

**Why it matters:** The model defaults to brief and direct. Inside Claude Code, the harness's own system prompt biases output toward action over reasoning and answer over explanation (capability-level summary; the exact wording in `constants/prompts.ts` has not been re-verified line-by-line against v2.1.128 as of 2026-05-05). When you need reasoning, structured output, a specific length, or a particular structure, you must ask for it. The model also mirrors your verbosity — terse prompts produce terse answers; detailed prompts produce detailed answers.

**Decide first whether you should be in prose at all.** If you control the API call and the consumer is a parser, use `output_config.format`. If the output is human-read and the structure is illustrative, the prose mechanics below are correct. The mistake to avoid is using prose to *enforce* a schema the API can guarantee.

**Format controls available in prose:**
- **Structure:** headers, bullet lists, tables, numbered sections, prose
- **Length:** word count, paragraph count, sentence count
- **Reasoning:** ask explicitly for "explain your reasoning", "walk me through your approach"
- **Audience:** "write for a non-technical manager", "write for a senior engineer"
- **Tone:** "formal", "conversational", "like a McKinsey brief"
- **Negative constraints:** "no subheadings", "no bullet points", "no caveats"

---

**Example 1 — Coding (explanation with reasoning)**

*Scenario:* A junior developer needs to understand why a complex piece of async code works the way it does, not just what it does.

*WITHOUT:* The developer writes `explain this async code`. The model gives a two-sentence summary: "This function fetches user data asynchronously and handles errors with a try/catch. It uses Promise.all to run the requests in parallel." The explanation is accurate but teaches nothing about why these choices were made.

*WITH:*
```
Explain the async code in src/api/userBatch.ts to a developer who understands
JavaScript but hasn't worked with Promise.all before.

Structure your explanation as:
1. What the code does (one paragraph)
2. Why Promise.all is used here instead of sequential awaits (one paragraph)
3. What would break if you removed the try/catch (one paragraph)

Write for understanding, not brevity. Each section should be 3-5 sentences.
```

---

**Example 2 — Data/Analytics (structured report output)**

*Scenario:* A data analyst needs to present findings from a query investigation to their manager. They need a structured report, not a conversational summary.

*WITHOUT:* The analyst writes `summarise what we found about the revenue discrepancy`. The model returns a paragraph. The manager wants a structured document they can forward.

*WITH:*
```
Write a structured findings summary for a non-technical manager. Use this format:

## Summary
[2-3 sentence plain-language summary of the finding]

## Root Cause
[One clear sentence identifying what caused the discrepancy]

## Impact
[Quantify the discrepancy in dollars and the date range affected]

## Recommended Action
[One specific action to resolve it]

## Data Sources Checked
[Bullet list of tables/models examined]

Write in plain language. Avoid SQL or technical jargon in the Summary,
Root Cause, and Recommended Action sections.
```

If this report were going into a downstream system rather than to a human manager, the right tool would be `output_config.format` with a JSONSchema for the five sections — not a prose template. The prose template here is correct *because* the consumer is a person.

---

**Example 3 — Content/Research (length control + Advisor pairing)**

*Scenario:* An executive needs a one-paragraph briefing on a market trend for an email they're sending today. They don't need a report.

*WITHOUT:* The executive writes `brief me on the AI infrastructure market`. The model produces 600 words across four sections with subheadings. The executive needs one paragraph.

*WITH (prose only):*
```
Write one paragraph, maximum 100 words, summarising the current state of
the AI infrastructure market. Focus on: what's growing fastest and who
the dominant players are. No subheadings, no bullet points, no caveats.
Write it as if I'm forwarding it in an email.
```

*WITH (Advisor pattern, when calling the API directly):* For long-horizon or high-stakes briefings — analyst notes, board memos, customer-facing positioning — pair a fast executor model (Haiku 4.5 or Sonnet 4.6) with a stronger advisor (Opus 4.7) using the Advisor tool (beta header `advisor-tool-2026-03-01`, beta as of 2026-05-05). The executor drafts; the advisor weighs in mid-generation on framing, claim strength, and what to cut. You pay executor pricing for most of the tokens and get close to advisor-solo quality on the parts that matter. The Advisor pattern is the right primitive when the output is short but the *judgment* behind it is the expensive part — exactly the shape of "one-paragraph briefing for an executive".

The Advisor pattern is not available inside Claude Code as a single command surface (it ships as an experimental feature with a startup notification, beta as of 2026-05-05); use it from the API or via `ant` when the work warrants it.
