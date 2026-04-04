# Layer 1 — The Mental Model
## Skills 1–3

The three skills in this layer correct the most fundamental and costly misconception users bring to AI assistants: that the model is reading their mind. It isn't. It is executing text.

---

### Skill 1: Claude Is a System Following Instructions, Not a Mind Reader

**What it is:** The model executes what is written in the prompt, not what you meant when you wrote it. Where your instruction is ambiguous, the model fills the gap with its own judgment — which may or may not match yours.

**Why it matters:** The model has no access to your intent, history, or preferences outside the current context window. Ambiguity is not an error — it is an invitation for the model to decide. Every decision the model makes on your behalf is one you didn't control.

---

**Example 1 — Coding (bug fix)**

*Scenario:* A developer has a React component where the modal doesn't close when clicking the overlay. They want a targeted fix.

*WITHOUT:* The developer types `fix the modal` and hits enter. The model reads the component, decides the whole thing is poorly structured, rewrites the close logic, extracts a `useModalState` hook, adds keyboard escape handling, and reformats the JSX. The actual bug — a missing `onClick` handler on the overlay div — is fixed, but it's buried in a 200-line diff the developer didn't ask for.

*WITH:*
```
The overlay div in src/components/Modal.tsx is missing an onClick handler.
Add onClick={onClose} to the overlay div at line 34. Do not change anything else.
```

The model makes exactly one edit. The instruction left no room for interpretation.

---

**Example 2 — Data/Analytics (SQL query)**

*Scenario:* An analyst needs to check whether a new user cohort from last quarter is activating at a different rate than the previous cohort.

*WITHOUT:* The analyst writes `write me a query to compare cohorts`. The model picks a date granularity (weekly), chooses activation event (`page_view`), defines cohort membership by signup date, and returns a query. The analyst's definition of "activation" is actually completing onboarding step 3, and the cohort window is calendar quarter not rolling 90 days. The query answers a different question than the one in the analyst's head.

*WITH:*
```
Write a BigQuery SQL query that compares 30-day activation rates between two cohorts:
- Q3 2025 cohort: users who signed up between 2025-07-01 and 2025-09-30
- Q4 2025 cohort: users who signed up between 2025-10-01 and 2025-12-31

Activation = a row in the events table where event_name = 'onboarding_step_3_complete'
within 30 days of the user's created_at timestamp.

Return: cohort_label, total_users, activated_users, activation_rate as a percentage.
```

The model has no decisions left to make. Every term is defined.

---

**Example 3 — Content/Research (competitive analysis)**

*Scenario:* A product manager wants to understand how a competitor positions their enterprise tier.

*WITHOUT:* The PM writes `research how Notion positions their product`. The model produces a general overview of Notion's product, brand voice, pricing philosophy, and feature set. The PM wanted specifically how Notion's enterprise tier is differentiated in sales collateral — what it emphasises over Teams tier, what objections it addresses. The general research is accurate but useless for the task.

*WITH:*
```
Research how Notion positions their Enterprise tier specifically compared to their
Business tier. I want to understand:
1. What features or capabilities are exclusive to Enterprise in their public marketing
2. What pain points or buyer personas their Enterprise messaging addresses
3. What language they use to justify the price premium

Use their pricing page, help docs, and any public case studies. Do not summarise
their general product — only what differentiates Enterprise.
```

The constraint ("only what differentiates Enterprise") eliminates the failure mode before it starts.

---

### Skill 2: The Context Window Is a Finite, Degrading Resource

**What it is:** Everything the model knows about your task is in the context window. What isn't there doesn't exist. As the window fills, Claude Code automatically compacts the conversation into a summary, and the fidelity of that summary determines what survives.

**Why it matters:** The compaction logic (visible in `services/compact/prompt.ts`) asks the model to summarise the full conversation into nine structured sections. Raw tool output, intermediate reasoning steps, and implicit context that was never stated are the most likely things to be lost or degraded. Once compacted, you cannot recover what was dropped.

---

**Example 1 — Coding (long refactor session)**

*Scenario:* A developer is refactoring a payment processing module across multiple files over the course of a long session. They established early in the session that the project uses a specific error handling pattern: all payment errors must be wrapped in `PaymentError` before bubbling up.

*WITHOUT:* The developer never restates the constraint. Forty turns in, the context compacts. The compaction summary captures the files edited and the high-level goal, but the `PaymentError` wrapping convention was only ever implicit — it showed up in passing in one tool result. After compaction, the model starts writing bare `throw new Error()` calls and the developer doesn't notice until code review.

*WITH:* The developer states the constraint explicitly at the start of the session:

```
Important constraint for this entire session: all errors thrown in the payment
module must be instances of PaymentError from src/errors/payment.ts. Never throw
a bare Error. This rule applies to every file we touch.
```

Explicit user messages are preserved verbatim in compaction. The constraint survives.

---

**Example 2 — Data/Analytics (iterative dashboard build)**

*Scenario:* A data engineer is building a metrics dashboard over a long session. Early in the session they established that all date columns in the warehouse use UTC+0 and that the business displays times in UTC+8 for their Singapore team.

*WITHOUT:* The engineer describes the timezone context once, early in the session, and then asks the model to build each chart in turn. By chart 6, after the context has compacted, the model reverts to UTC+0 in its SQL without the +8 offset. The dashboard silently shows wrong times.

*WITH:* The engineer puts the invariant in a checkpoint message before moving to each new chart:

```
Continuing constraint (in case of summary): all timestamps must be converted from
UTC+0 storage to UTC+8 display using CONVERT_TZ(ts, '+00:00', '+08:00'). Apply
this to every date/time expression in every query we write today.
```

Restating constraints in new user messages gives the compaction system something durable to summarise from.

---

**Example 3 — Content/Research (long document production)**

*Scenario:* A writer is producing a 3,000-word technical white paper in a single session. The brief specifies that the paper must avoid first-person voice, use Oxford commas, and never use the word "leverage" as a verb.

*WITHOUT:* The writer states the style rules once at the start. The session runs long, the context compacts, and by the third section the model has started using "leverage" and switched to a slightly more colloquial register. The writer has to do a full edit pass.

*WITH:* The writer front-loads the rules in a message that is written to survive compaction:

```
Style rules for this entire document — apply to every section:
- No first-person voice (no "we", "our", "I")
- Oxford comma always
- Never use "leverage" as a verb (use "use", "apply", or "draw on" instead)
- Tone: formal but not academic; think McKinsey brief, not journal article

I will be building this in sections. Remind me if I drift from these rules.
```

---

### Skill 3: Tools Are How the Model Acts in the World

**What it is:** The model cannot read files, run code, browse the web, or create agents without tools. Understanding which tools exist, when they fire, and what they cost lets you guide the workflow rather than letting the model choose the most expensive path by default.

**Why it matters:** The tool list in Claude Code's system prompt is visible and deterministic. The model chooses tools based on how you frame the task. Vague requests trigger expensive tool chains (Agent tool, multi-file reads, bash commands) when a targeted request might need only one read. Every unnecessary tool call costs tokens and time.

---

**Example 1 — Coding (finding a function definition)**

*Scenario:* A developer wants to understand how the `formatCurrency` function works before modifying it.

*WITHOUT:* The developer writes `how does currency formatting work in this codebase?`. The model doesn't know the function name, so it spawns a search across the entire codebase using Glob and Grep, reads four candidate files, and eventually finds the right one. 800 tokens spent, 40 seconds elapsed.

*WITH:*
```
Read src/utils/currency.ts and explain the formatCurrency function.
```

The model issues a single Read tool call. 80 tokens, 3 seconds.

---

**Example 2 — Data/Analytics (running a query)**

*Scenario:* An analyst wants to check the row count of a BigQuery table they're about to join against.

*WITHOUT:* The analyst writes `how big is the events table?`. Depending on the tools available, the model might try to write Python to query BigQuery, or might ask clarifying questions, or might attempt to read a schema file. The path is unpredictable.

*WITH:*
```
Run this shell command and show me the output:
bq query --nouse_legacy_sql 'SELECT COUNT(*) as row_count FROM analytics.events'
```

The model uses the Bash tool with the exact command. One tool call, deterministic result.

---

**Example 3 — Content/Research (web research)**

*Scenario:* A researcher needs the current number of employees at a specific company for a market sizing model.

*WITHOUT:* The researcher writes `find out how many employees Stripe has`. The model may hallucinate a number from training data, or use WebSearch with a vague query that returns a blog post with a stale figure, or launch an Agent to do extended research. The path and reliability vary.

*WITH:*
```
Use WebSearch to find Stripe's current employee count. Search for:
"Stripe employees 2025" site:linkedin.com OR site:crunchbase.com OR site:stripe.com

Report the number, the source URL, and the date of the source.
```

The instruction specifies the tool, the query, the sources to prefer, and the output format. The model cannot take a shortcut.
