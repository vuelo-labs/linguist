# Layer 5 — Output Engineering
## Skills 13–14

These skills are about getting the right output format, not just the right content — and separating the planning phase from the execution phase to catch misunderstandings before they require rework.

---

### Skill 13: Separating Plan from Execution

**What it is:** Asking the model to describe its intended approach before it takes action — reviewing the plan, then confirming before work begins.

**Why it matters:** The model's system prompt instructs it to "go straight to the point" and "try the simplest approach first". In practice, this means the model will often begin executing immediately. For multi-step tasks, catching a wrong approach in the plan costs one turn; catching it after execution costs as many turns as it takes to undo and redo the work. The model has a `/plan` mode built in for exactly this reason — but the same principle applies in any session via explicit instruction. The source also notes the model should "diagnose why before switching tactics" — a plan turn forces this reasoning to be visible before it drives action.

**When to separate plan from execution:**
- Any task touching more than 2–3 files
- Any architectural decision (storage approach, library choice, data structure)
- Any task in an unfamiliar codebase
- Any task where the wrong approach would require significant rework to reverse

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

The developer picks the Redis-backed approach. The model implements it. No rework.

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

**What it is:** Explicitly specifying the format, length, and structure of the output — the model defaults to brief and direct unless instructed otherwise.

**Why it matters:** Claude Code's system prompt includes: "Keep your text output brief and direct. Lead with the answer or action, not the reasoning." This is a default, not a fixed behaviour. When you need reasoning, structured output, a specific length, or a particular structure, you must ask for it. The model will not volunteer format choices that conflict with its default instructions. This also means the model mirrors your verbosity — terse prompts produce terse answers; detailed prompts produce detailed answers.

**Format controls available:**
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

---

**Example 3 — Content/Research (length control)**

*Scenario:* An executive needs a one-paragraph briefing on a market trend for an email they're sending today. They don't need a report.

*WITHOUT:* The executive writes `brief me on the AI infrastructure market`. The model produces 600 words across four sections with subheadings. The executive needs one paragraph.

*WITH:*
```
Write one paragraph, maximum 100 words, summarising the current state of
the AI infrastructure market. Focus on: what's growing fastest and who
the dominant players are. No subheadings, no bullet points, no caveats.
Write it as if I'm forwarding it in an email.
```
