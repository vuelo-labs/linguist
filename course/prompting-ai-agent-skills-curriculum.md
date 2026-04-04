# Prompting and AI Agent Skills: A Curriculum Framework

---

## How to Use This Document

This framework covers eighteen skills that build on each other, from first contact with an AI coding assistant to designing multi-agent production systems. Each skill is grounded in how Claude Code actually works — its system prompt architecture, compaction logic, tool execution model, and agent delegation primitives — rather than in folk wisdom about "better prompts."

The skills are organised as a stack. Each layer assumes fluency in the one below it. A person who hasn't internalised Layer 1 will make the same mistakes at Layer 4 that they would have at Layer 1, just in a more expensive place.

Each skill follows the same structure:

- **What it is** — one sentence definition
- **Why it matters** — the mechanical reason, not the motivational one
- **Three worked examples** — each with a domain (coding, data/analytics, content/research), a WITHOUT version showing the failure mode, and a WITH version showing actual prompt text or approach

---

## LAYER 1 — THE MENTAL MODEL

The three skills in this layer correct the most fundamental and costly misconception users bring to AI assistants: that the model is reading their mind. It isn't. It is executing text.

---

### Skill 1: Claude Is a System Following Instructions, Not a Mind Reader

**What it is:** The model executes what is written in the prompt, not what you meant when you wrote it. Where your instruction is ambiguous, the model fills the gap with its own judgment — which may or may not match yours.

**Why it matters:** The model has no access to your intent, history, or preferences outside the current context window. Ambiguity is not an error — it is an invitation for the model to decide. Every decision the model makes on your behalf is one you didn't control.

---

**Example 1 — Coding (bug fix)**

*Scenario:* A developer has a React component where the modal doesn't close when clicking the overlay. They want a targeted fix.

*WITHOUT:* The developer types `fix the modal` and hits enter. The model reads the component, decides the whole thing is poorly structured, rewrites the close logic, extracts an `useModalState` hook, adds keyboard escape handling, and reformats the JSX. The actual bug — a missing `onClick` handler on the overlay div — is fixed, but it's buried in a 200-line diff the developer didn't ask for.

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

The model issues a single `Read` tool call. 80 tokens, 3 seconds.

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

---

## LAYER 2 — COMMUNICATION PRIMITIVES

With the mental model in place, these three skills cover the mechanics of well-formed requests. They are not about being polite or being specific for its own sake — each one addresses a specific mechanical failure mode.

---

### Skill 4: Verb-First Deterministic Requests

**What it is:** The imperative verb at the start of a request signals scope. `Fix`, `add`, `refactor`, `explain`, and `extract` have different blast radii. Vague verbs like `improve`, `clean up`, and `look at` have no defined ceiling.

**Why it matters:** The model interprets the verb as a constraint on what it's allowed to do. `Fix` bounds the model to the specific problem. `Improve` authorises the model to decide what an improvement looks like — and it will. The system prompt in `prompts.ts` explicitly instructs the model: "Don't add features, refactor code, or make improvements beyond what was asked."

---

**Example 1 — Coding (targeted repair)**

*Scenario:* A TypeScript function is returning `undefined` when it should return `0` for empty arrays.

*WITHOUT:* The developer writes `improve the calculateTotal function`. The model decides the function has other issues — no input validation, inconsistent variable naming, a missed edge case for negative numbers — and rewrites it substantially. The original `undefined` vs `0` bug is fixed but the diff is 40 lines.

*WITH:*
```
Fix the calculateTotal function in src/cart/totals.ts so that it returns 0
instead of undefined when the items array is empty. Change only that logic.
```

Verb: `Fix`. Scope: one return value. Constraint: `change only that logic`. The model has one job.

---

**Example 2 — Data/Analytics (schema documentation)**

*Scenario:* A data analyst needs to document a warehouse table's column descriptions in a YAML schema file.

*WITHOUT:* The analyst writes `look at the orders table and help me with the schema`. The model reads the table, might suggest restructuring, might add data quality notes, might reorder columns, might generate sample queries. "Help me with" is not a verb that resolves to an action.

*WITH:*
```
Extract the column names and data types from the CREATE TABLE statement in
sql/schema/orders.sql and write them as a YAML file at docs/schema/orders.yaml
in this format:

columns:
  - name: order_id
    type: STRING
    description: ""

Leave the description field blank for each column. Do not modify orders.sql.
```

Verb: `Extract`. Output: specific file format. Constraint: no modification to source.

---

**Example 3 — Content/Research (document editing)**

*Scenario:* A writer has a 1,200-word product brief that is too long. They need to cut it to under 800 words.

*WITHOUT:* The writer writes `clean up this product brief`. The model reformats headings, changes passive voice to active, adds a bullet list where there was prose, and cuts some sentences — but doesn't bring it under 800 words because "clean up" never specified length.

*WITH:*
```
Edit the product brief below to under 800 words. Cut by removing sentences and
sections, not by summarising or rewriting. Preserve all specific numbers, feature
names, and customer quotes. Do not add new content.

[brief text]
```

Verb: `Edit`. Metric: word count. Method: cutting, not rewriting. Preservations: named explicitly.

---

### Skill 5: Target Specificity

**What it is:** Vague references — "the function", "the error", "that file" — require the model to search before it can act. Precise references (file paths, line numbers, function names, error messages) let it act immediately.

**Why it matters:** When the model doesn't have a precise target, it uses Glob, Grep, or multi-file reads to find candidates. This is not just slower — it introduces interpretation errors. If the search finds two functions with similar names, the model chooses one, and it may be the wrong one.

---

**Example 1 — Coding (targeted edit)**

*Scenario:* A developer wants to change the timeout value in an API client.

*WITHOUT:* The developer writes `change the API timeout to 30 seconds`. The model searches for timeout-related code across the codebase, finds three locations (`src/api/client.ts`, `src/api/retry.ts`, and `config/defaults.json`), and asks which one to change, or silently changes all three.

*WITH:*
```
In src/api/client.ts at line 47, change the `timeout` parameter default value
from 10000 to 30000. Change only that line.
```

Zero ambiguity. One tool call. One edit.

---

**Example 2 — Data/Analytics (error investigation)**

*Scenario:* A data engineer is debugging a failing dbt model and needs the model to investigate the error.

*WITHOUT:* The engineer writes `my dbt model is failing, can you help?`. The model asks what error, what model, what environment. Three turns of clarification before any useful work happens.

*WITH:*
```
The dbt model models/marts/revenue/mrr_by_segment.sql is failing in production
with this error:

  Runtime Error in model mrr_by_segment (models/marts/revenue/mrr_by_segment.sql)
  Column 'segment_id' does not exist in table 'stg_accounts'

Read the model file and read models/staging/stg_accounts.sql to find what column
to use instead of segment_id.
```

The model has the exact error text, the exact file paths, and the exact question. It can start investigating immediately.

---

**Example 3 — Content/Research (citation)**

*Scenario:* A researcher needs a specific claim in a report verified against its cited source.

*WITHOUT:* The researcher writes `check if the statistic in my report is accurate`. The model doesn't know which statistic, which report, or which source.

*WITH:*
```
The report at docs/market-analysis-2025.md, in the "TAM Sizing" section, contains
this claim: "The global HR software market was valued at $16.4B in 2024."

The cited source is: https://www.grandviewresearch.com/industry-analysis/hr-software-market

Use WebFetch to read that page and verify whether the $16.4B figure for 2024 appears
in the source. If not, report what figure the source does give.
```

One claim. One source URL. One verification question.

---

### Skill 6: Constraint Setting

**What it is:** Constraints are scope ceilings. Without explicit limits, the model fills the gap with its own judgment about how much is appropriate to do.

**Why it matters:** The model's system prompt instructs it to be helpful and capable. "Helpful" in the absence of constraints means the model self-assigns scope. Constraints don't limit quality — they prevent unasked-for additions that create diff noise, introduce new bugs, or change things outside your review.

---

**Example 1 — Coding (dependency upgrade)**

*Scenario:* A developer needs to upgrade `axios` from 0.27 to 1.6 in a Node project.

*WITHOUT:* The developer writes `upgrade axios to version 1.6`. The model updates `package.json`, runs npm install, finds that the API changed in v1.0, and proactively updates all the call sites it can find — changing `axios.get` calls, rewriting interceptor setup, and updating type imports. Some of the "fixed" call sites were correct usages that just happened to look similar to the breaking change pattern.

*WITH:*
```
Update the axios version in package.json from "^0.27.2" to "^1.6.8".
Do not change any source files. Do not run npm install.
I will handle the migration separately.
```

The constraint `do not change any source files` prevents the cascade.

---

**Example 2 — Data/Analytics (query optimisation)**

*Scenario:* An analyst has a slow BigQuery query and wants it to run faster.

*WITHOUT:* The analyst writes `optimise this SQL query`. The model rewrites the query structure, changes the join order, adds a subquery, and renames some columns for "clarity". The query is faster but the analyst now has to re-verify correctness and explain the structural changes to their team.

*WITH:*
```
The query below is running slowly on BigQuery. Add a partition filter to the
WHERE clause so it only scans dates in 2024. Do not change the SELECT columns,
the JOIN structure, or the column aliases. The partition column is event_date.

[query]
```

One change authorised. Everything else locked.

---

**Example 3 — Content/Research (editing pass)**

*Scenario:* A content strategist has a landing page written by a salesperson. They want the grammar fixed but the voice preserved.

*WITHOUT:* The strategist writes `edit this for grammar`. The model, in correcting grammar, also standardises sentence structure, changes the informal register to something more polished, and removes a colloquialism that was intentional brand voice. The page no longer sounds like the brand.

*WITH:*
```
Correct grammar and punctuation errors in the copy below. Do not:
- Change sentence structure or word order beyond what grammar requires
- Replace words with synonyms
- Change the register or formality level
- Add or remove sentences

Fix only clear errors (subject-verb agreement, comma splices, apostrophes).
```

The do-not list eliminates all the adjacent things the model might otherwise decide to "improve".

---

## LAYER 3 — SESSION HYGIENE

These skills are about managing the structure of working sessions — where instructions live, how sessions are bounded, and the cost of corrections that arrive too late.

---

### Skill 7: Persistent Instructions (CLAUDE.md)

**What it is:** CLAUDE.md is a markdown file loaded into the system prompt at session start. Instructions written there are available in every session without taking up conversation history. Anything you would say in every session belongs in CLAUDE.md, not in chat.

**Why it matters:** As confirmed by `claudemd.ts`, CLAUDE.md files are loaded in a defined hierarchy — managed (system-wide), user (`~/.claude/CLAUDE.md`), project (repo-level `CLAUDE.md` and `.claude/rules/*.md`), and local (`CLAUDE.local.md`). They are read once at session start. Unlike conversation messages, they don't accumulate in history or affect compaction — they're loaded fresh each time.

---

**Example 1 — Coding (project conventions)**

*Scenario:* A team's codebase uses a specific test file naming convention (`*.spec.ts` not `*.test.ts`), a specific import order enforced by ESLint, and a rule that database queries must never appear outside repository files.

*WITHOUT:* A new team member types these constraints into the chat each time they start a session. By session three, they've stopped bothering, and the model starts creating `*.test.ts` files and writing queries in service files. The violations get caught in code review.

*WITH:* A `.claude/CLAUDE.md` file at the project root contains:

```markdown
## Project Conventions

**Test files:** Use *.spec.ts naming convention, never *.test.ts.

**Imports:** Follow the order enforced by .eslintrc (external packages,
then internal absolute, then relative). Do not suggest disabling ESLint rules.

**Database access:** All SQL queries and ORM calls must be in files under
src/repositories/. Never write database queries in service, controller,
or utility files.
```

These rules are present in every session without being typed.

---

**Example 2 — Data/Analytics (warehouse conventions)**

*Scenario:* A data team's warehouse has strict conventions: all staging models must be prefixed `stg_`, all mart models must include a `surrogate_key` column, and all CTEs must be named in snake_case.

*WITHOUT:* Each analyst states these rules at the start of their session. Some forget. The model generates models that violate one convention or another, and the team's dbt CI catches it after the fact.

*WITH:* A `CLAUDE.md` in the analytics repo root:

```markdown
## dbt Conventions

**Model naming:**
- Staging models: prefix stg_ (e.g. stg_orders, stg_users)
- Mart models: no prefix (e.g. orders, revenue_by_segment)

**Mart models must include a surrogate_key column** generated with
dbt_utils.generate_surrogate_key().

**CTE naming:** all CTEs must use snake_case. No camelCase or PascalCase in CTEs.

Raise an error and ask for clarification if a request would violate these
conventions.
```

---

**Example 3 — Content/Research (editorial voice)**

*Scenario:* A content team produces articles in a consistent brand voice: second-person address, active voice only, no jargon, maximum 20-word sentences, Oxford comma always.

*WITHOUT:* An editor pastes the style guide into every chat session. On long sessions it compacts and gets lost. Articles drift in register.

*WITH:* A `~/.claude/CLAUDE.md` for the editor's personal Claude sessions:

```markdown
## Writing Style (apply to all content work)

- Address the reader as "you" (second person)
- Active voice only — flag passive voice to me rather than using it
- No jargon: if a word needs explaining, replace it with a simpler one
- Maximum sentence length: 20 words. Split longer sentences.
- Oxford comma always
- Em dashes are fine; semicolons should be rare
```

Because it's in the user-level CLAUDE.md (`~/.claude/CLAUDE.md`), these rules apply to every project the editor works on.

---

### Skill 8: Session Scoping

**What it is:** Starting a new session (or clearing context with `/clear`) for each distinct task, rather than accumulating tasks in a single long session. One session, one purpose.

**Why it matters:** Context from unrelated previous tasks is dead weight that accumulates in the context window and affects compaction. The compaction summary has to account for everything in the session — unrelated content degrades the signal-to-noise ratio of what gets preserved. From the compaction prompt in `services/compact/prompt.ts`: the model is asked to summarise "primary requests and intent", "current work", and "pending tasks". If a session contains three unrelated tasks, the summary will try to hold all three, which dilutes focus on the active one.

---

**Example 1 — Coding (context pollution)**

*Scenario:* A developer spends the first half of a session debugging a Redis connection issue, then switches to building a new API endpoint. The session runs long and compacts.

*WITHOUT:* The compaction happens mid-endpoint-build. The summary includes extensive context about Redis connection strings, retry logic, and environment variables — none of which is relevant to the API endpoint. The model's next response is subtly contaminated by the prior context: it adds unnecessary error handling for connection failures in the endpoint code because it's "aware" of connectivity problems even though they were resolved.

*WITH:* After resolving the Redis issue, the developer runs `/clear` before starting the endpoint work. The new session starts with only the endpoint task in context. The model's focus is clean.

---

**Example 2 — Data/Analytics (mixed analytical tasks)**

*Scenario:* An analyst investigates a data quality issue in the `payments` table, then later in the same session starts building a new retention analysis.

*WITHOUT:* The session compacts during the retention analysis. The summary carries detailed context about payment data anomalies, the investigation approach, and interim findings. The model occasionally references payment context when writing the retention queries, suggesting joins or filters that made sense in the payment investigation but are irrelevant to retention.

*WITH:* The analyst runs `/clear` between the payment investigation and the retention analysis, then starts the new task with a clean brief. The model has zero payment context and cannot contaminate the retention work.

---

**Example 3 — Content/Research (multi-topic research)**

*Scenario:* A researcher investigates two separate competitive threats in one session: first Competitor A's new product, then Competitor B's pricing changes.

*WITHOUT:* By the time the researcher reaches Competitor B, the model's context is full of Competitor A details. The compaction blends the two. The model starts drawing comparisons between A and B that weren't asked for, and occasionally attributes features to the wrong company.

*WITH:* Two sessions. One per competitor. Each starts with a clean brief. The research is kept separate.

---

### Skill 9: Front-Loading Constraints

**What it is:** Stating all constraints, exclusions, and preferences before the model begins work — not during or after.

**Why it matters:** Corrections mid-task are expensive in multiple ways. They add turns to the conversation, require rework of already-completed output, and must survive compaction to be effective later in the same session. The model's system prompt notes: "Go straight to the point. Try the simplest approach first." Once the model has taken an approach, redirecting it costs more than specifying upfront.

---

**Example 1 — Coding (tech stack constraint)**

*Scenario:* A team is migrating from moment.js to date-fns. A developer needs to add date formatting to a new feature.

*WITHOUT:* The developer writes `add a function that formats a date as "January 5, 2025"`. The model writes the function using moment.js because that's what it sees in the existing codebase. The developer then has to say "use date-fns not moment.js" and the model rewrites it. Two turns instead of one.

*WITH:*
```
Add a function to src/utils/dates.ts that formats a Date object as "January 5, 2025"
(long month name, day, 4-digit year). Use date-fns (already installed), not moment.js.
Import from date-fns, not moment.
```

The constraint is present before the model writes a single line.

---

**Example 2 — Data/Analytics (output format)**

*Scenario:* A data scientist is asking the model to help build a Python script to process a CSV. They need the output as a class, not a collection of functions.

*WITHOUT:* The data scientist writes `write a Python script to clean the customer CSV file`. The model returns a procedural script with standalone functions. The scientist says "wrap this in a class". The model rewrites. Two turns of output generation.

*WITH:*
```
Write a Python class called CustomerCleaner in scripts/clean_customers.py.

The class should:
- Accept a file path in __init__
- Have a method clean() that returns a pandas DataFrame
- Have a method to_csv(output_path) that saves the result

Do not write standalone functions. Structure everything as class methods.

The cleaning steps are: [steps]
```

---

**Example 3 — Content/Research (output scope)**

*Scenario:* A PM needs talking points for a difficult stakeholder meeting, but only wants the key objections addressed — not a full prep document.

*WITHOUT:* The PM writes `help me prepare for my meeting with finance about the roadmap delay`. The model produces a comprehensive prep document: context summary, stakeholder profiles, recommended framing, full Q&A prep, and talking points. The PM wanted three bullet points.

*WITH:*
```
Give me three bullet points — one to two sentences each — addressing the most
likely objection from finance to a six-week roadmap delay: that engineering
underestimated the work.

Do not give me background context, framing advice, or a full prep document.
Just the three bullets.
```

---

## LAYER 4 — CONTEXT AWARENESS

These skills require understanding the compaction cycle — what it preserves, what it loses, and how to intervene before it degrades your working state.

---

### Skill 10: Recognising Context Rot

**What it is:** Context rot is the gradual degradation of the model's working state as the session runs long — surfacing as re-asked questions, constraint drift, incorrect terminology, or vague responses that were precise earlier.

**Why it matters:** Compaction (`services/compact/prompt.ts`) produces a structured summary, but that summary is generated by the model and inherits the model's limitations. Implicit context, naming conventions established by example rather than stated explicitly, and nuanced constraints that were expressed conversationally are the most likely things to be lossy. Recognising the symptoms lets you intervene before they compound.

---

**Example 1 — Coding (constraint drift)**

*Scenario:* A developer is building a form validation library. They established early in the session that all validation errors should use error codes (e.g., `REQUIRED_FIELD`, `INVALID_EMAIL`) not human-readable strings. After a long session and compaction, the model starts returning `{ error: "This field is required" }` instead of `{ code: "REQUIRED_FIELD" }`.

*WITHOUT:* The developer doesn't notice until they're writing tests. They accept the change, and the inconsistency is now in the codebase.

*WITH:* The developer notices the output changed format. They recognise this as context rot and respond:

```
Stop — I notice you're using human-readable error strings like "This field is required".
We established at the start of this session that all validation errors use error codes
(REQUIRED_FIELD, INVALID_EMAIL, etc.), not strings. Please rewrite the last output
to use the code format.

Reminder: all validation errors throughout this session must use the code format.
```

They restate the constraint and continue.

---

**Example 2 — Data/Analytics (terminology drift)**

*Scenario:* An analyst is building a revenue model. Early in the session they established that "MRR" means monthly recurring revenue from subscription plans only — not one-time purchases. After compaction, the model starts including one-time purchases in MRR calculations.

*WITHOUT:* The analyst doesn't catch it. The MRR figure in the final model is wrong.

*WITH:* The analyst catches that a calculated figure is higher than expected, investigates, and finds the model has changed the MRR definition. They respond:

```
The MRR figure here seems too high. Are you including one-time purchases?

Reminder: in this project, MRR = recurring subscription revenue only.
One-time purchases, setup fees, and professional services revenue must
be excluded from MRR and tracked separately as "non-recurring revenue".

Please recalculate excluding those categories.
```

---

**Example 3 — Content/Research (vagueness signal)**

*Scenario:* A researcher has been building a detailed competitive intelligence report. Early in the session the model was producing precise, sourced claims. After compaction, responses become more hedged and general: "it appears that", "generally speaking", "their strategy seems to focus on".

*WITHOUT:* The researcher accepts the vaguer output, not recognising it as a symptom of context rot.

*WITH:* The researcher recognises the hedging as a signal. They respond:

```
Your last three responses have been significantly more vague than earlier in this
session — using phrases like "it appears" and "seems to". 

We have access to the source material via WebFetch. Please re-read the specific
pages before making claims. Don't hedge on claims that can be verified from the
sources. If something can't be verified, say so explicitly — don't soften it
with language that implies speculation about a verifiable fact.
```

---

### Skill 11: Writing for Compaction

**What it is:** Structuring your messages to survive the compaction process — knowing what the compaction prompt preserves (user messages verbatim, explicit constraints, file names, code snippets) and writing to maximise what survives.

**Why it matters:** The compaction prompt in `services/compact/prompt.ts` explicitly instructs the model: "List ALL user messages that are not tool results." User messages are the most durable element. Tool results, intermediate model reasoning, and implicit context established through example are the most volatile. Writing for compaction means putting your important context in user messages, not relying on the model's tool output or intermediate thinking to carry it forward.

---

**Example 1 — Coding (constraint durability)**

*Scenario:* A developer is implementing a caching layer. The business rule is that cache TTLs must be configurable per-environment and must never be hardcoded.

*WITHOUT:* The developer establishes this rule by commenting on the model's first output: "Don't hardcode that — it should be configurable". This is a conversational reply, and during compaction the model's summary may not capture the nuance. Later the rule is violated.

*WITH:* The developer writes the constraint as a standalone user message, structured for durability:

```
Architecture constraint for this entire session:

Cache TTLs must NEVER be hardcoded in source files.
All TTL values must be read from environment variables or config files at runtime.

This applies to every cache implementation we build today. If you're about to
hardcode a TTL value, stop and ask me for the config key name instead.
```

A standalone message with clear structure and emphasis. The compaction prompt's "all user messages" section will capture this.

---

**Example 2 — Data/Analytics (state preservation)**

*Scenario:* A data engineer has spent several turns exploring a data quality issue and has identified that the root cause is duplicate `user_id` rows in the `stg_users` model caused by a specific ETL job. They need this finding to survive compaction.

*WITHOUT:* The finding exists in the model's tool output and in the engineer's conversational responses. It might survive compaction, or it might be compressed to "investigated data quality issue".

*WITH:* The engineer writes a consolidating message:

```
Checkpoint — confirmed finding for this session:

Root cause identified: duplicate user_id rows in stg_users are caused by the
Salesforce ETL job (dbt/models/staging/stg_users.sql) not deduplicating on
import. The ETL runs twice daily and the second run inserts duplicates when
Salesforce records are updated.

Next step: add a QUALIFY ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY
updated_at DESC) = 1 filter to stg_users.sql.

This is the confirmed cause — no need to re-investigate.
```

This message is a user message, it's explicit, it references specific file names, and it states the next step. It will survive compaction in a useful form.

---

**Example 3 — Content/Research (decision preservation)**

*Scenario:* A writer and model have gone through several rounds deciding to frame a report around three themes rather than five. The decision was reached through dialogue and exists in the conversation flow but was never stated as a clean decision.

*WITHOUT:* The framing decision exists implicitly in the dialogue. After compaction the model might return to suggesting the five-theme structure it initially proposed.

*WITH:* The writer writes a consolidating message:

```
Decision for this document — confirmed:

We are using three themes, not five:
1. Speed to value
2. Integration simplicity  
3. Compliance without complexity

The original five-theme structure has been rejected. Do not propose adding
"cost efficiency" or "scalability" back as themes. If you think a point
belongs in the document, fit it into one of the three existing themes.
```

---

### Skill 12: Checkpointing

**What it is:** Forcing a context consolidation on your own terms — before the system does it automatically — by explicitly asking the model to summarise the current state, then verifying the summary is accurate before continuing.

**Why it matters:** Auto-compaction happens when the context window hits a threshold (approximately `contextWindowSize - AUTOCOMPACT_BUFFER_TOKENS`, as defined in `autoCompact.ts`). You have no control over when it fires or what it preserves. Manual checkpointing gives you both control over timing and the ability to verify the summary — you can correct drift before it's baked into the continued session context.

---

**Example 1 — Coding (mid-refactor checkpoint)**

*Scenario:* A developer is halfway through a multi-file refactor. They've completed five files and are about to start on the most complex one. They want to verify the model's state before continuing.

*WITHOUT:* The developer continues. The session eventually compacts. The compaction summary gets the completed files right but misses a constraint established in turn 12: that all event names must be prefixed with the module name. The remaining files are written without the prefix.

*WITH:* Before starting the complex file, the developer asks:

```
Before we continue, give me a checkpoint summary:
1. Which files have we completed in this refactor, and what was changed in each?
2. What constraints are we working under for this refactor?
3. What's left to do?

I'll confirm the summary is correct before we continue.
```

The model produces the summary. The developer checks it. If the event naming constraint is missing, they add it now:

```
Good summary, but you've missed one constraint: all event names must be prefixed
with the module name (e.g., cart.item_added, not item_added). Add that to the
constraints and continue.
```

---

**Example 2 — Data/Analytics (pipeline build checkpoint)**

*Scenario:* A data engineer has been building a complex dbt pipeline. They're about to start the final mart layer models and want to confirm the model's understanding of the staging layer structure before building on top of it.

*WITHOUT:* The engineer continues. The model builds the mart layer with slightly wrong assumptions about the staging layer's grain (order line level vs order level) because the grain was established through a tool output that compacted lossy.

*WITH:*

```
Checkpoint before we build the mart layer. Summarise:
1. The grain of each staging model we've built (what one row represents)
2. The key columns available for joining between staging models
3. The business rules we've established for how to handle returns and cancellations

If any of these are unclear from our conversation, say so rather than guessing.
```

The engineer reviews and corrects before proceeding.

---

**Example 3 — Content/Research (document checkpoint)**

*Scenario:* A researcher and model have been building a long report. They're at section 4 of 7 and the session is running long.

*WITHOUT:* They continue into section 5. The context compacts during section 5. The summary loses the specific framing decision made in section 2 and the model continues section 5 with inconsistent framing.

*WITH:* Before starting section 5, the researcher asks:

```
Checkpoint before section 5:
1. Summarise the core argument of each completed section (1-4) in one sentence each
2. What is the agreed-upon framing for this report (we discussed this early on)?
3. Are there any style rules or constraints we established that I should re-confirm?
```

The researcher verifies, corrects if needed, then continues.

---

## LAYER 5 — OUTPUT ENGINEERING

These skills are about getting the right output format, not just the right content — and separating the planning phase from the execution phase.

---

### Skill 13: Separating Plan from Execution

**What it is:** Asking the model to describe its intended approach before it takes action — reviewing the plan, then confirming before work begins.

**Why it matters:** The model's system prompt instructs it to "go straight to the point" and "try the simplest approach first". In practice, this means the model will often begin executing immediately. For multi-step tasks, catching a wrong approach in the plan costs one turn; catching it after execution costs as many turns as it takes to undo and redo the work. The model's `EnterPlanMode` tool exists specifically for this — but the principle applies in any session via explicit instruction.

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

*WITHOUT:* The writer says `write a case study about Acme Corp's deployment of our platform`. The model picks a structure (problem-solution-results) and writes the full draft. The writer wanted the results up front in an "inverted pyramid" style.

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

**Why it matters:** Claude Code's system prompt includes: "Keep your text output brief and direct. Lead with the answer or action, not the reasoning." This is a default, not a fixed behaviour. When you need reasoning, structured output, a specific length, or a particular structure, you must ask for it. The model will not volunteer format choices that conflict with its default instructions.

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

**Example 2 — Data/Analytics (structured output)**

*Scenario:* A data analyst needs to present findings from a query investigation to their manager. They need a structured report, not a conversational summary.

*WITHOUT:* The analyst writes `summarise what we found about the revenue discrepancy`. The model returns a paragraph. The manager wants a structured document.

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

---

## LAYER 6 — TOOL FLUENCY

---

### Skill 15: Guiding Tool Use

**What it is:** Explicitly directing which tools to use, in what order, and with what scope — rather than letting the model choose its own tool strategy.

**Why it matters:** The model's tool selection is heuristic, not optimal. For a given task, it may choose the Agent tool when a targeted Grep would suffice, or use Bash for a file read when the Read tool is cheaper and more reviewable. The model's system prompt explicitly instructs it to prefer dedicated tools over Bash — but the ordering and strategy within tool selection is still left to the model's judgment. Guiding tool use lets you take control of token cost, latency, and auditability.

---

**Example 1 — Coding (targeted investigation)**

*Scenario:* A developer wants to find all places in the codebase where a specific utility function (`debounce`) is called, to understand its usage before modifying it.

*WITHOUT:* The developer writes `find all uses of the debounce function`. The model might launch an Agent to do a codebase survey, or use Bash with a grep command, or use Glob followed by multiple Reads. The path is unpredictable.

*WITH:*
```
Use the Grep tool to find all files that import or call `debounce` from
src/utils/debounce.ts. Search pattern: "debounce" in *.ts and *.tsx files.

For each file found, show me just the matching line and the file path.
Do not read the full files — just the grep results.
```

One Grep call. Bounded output. No downstream file reads unless the developer asks.

---

**Example 2 — Data/Analytics (sequential tool use)**

*Scenario:* An analyst needs to verify that a specific dbt model compiles correctly before running it.

*WITHOUT:* The analyst writes `check if the revenue_by_segment model will compile`. The model may try to read the model file, infer dependencies, and reason about whether it would compile — a guess rather than a verification.

*WITH:*
```
Run these two shell commands in sequence and show me the output of each:

1. dbt compile --models revenue_by_segment --profiles-dir .
2. If the compile succeeds, run: dbt run --models revenue_by_segment --profiles-dir . --limit 10

Stop after step 1 if compile fails and show me the error.
```

Explicit sequence. Conditional logic stated upfront. One Bash call per step.

---

**Example 3 — Content/Research (web research with boundaries)**

*Scenario:* A researcher needs to find the current CEO of three specific companies for a contact list.

*WITHOUT:* The researcher writes `find the CEOs of Figma, Linear, and Notion`. The model might hallucinate from training data, or use WebSearch with vague queries that return old results, or launch an Agent for each company.

*WITH:*
```
Use WebSearch three times — once for each company — with these specific queries:
1. "Figma CEO 2025"
2. "Linear CEO 2025"
3. "Notion CEO 2025"

For each: report the CEO name, the source URL, and whether the result is from
the company's own website or a third-party source. Mark results from third-party
sources as "unverified".
```

Three bounded searches. Output format specified. Reliability signaled.

---

## LAYER 7 — AGENT DESIGN

These skills apply when the task is large enough to warrant delegation to a subagent. The key shift is moving from "how do I prompt the model?" to "how do I architect a delegation?"

---

### Skill 16: The Delegation Decision

**What it is:** Deciding what belongs in the main session versus delegated to a subagent. The criterion from the Agent tool's own system prompt: will you need the raw output again? If no, delegate.

**Why it matters:** The Agent tool's prompt (`tools/AgentTool/prompt.ts`) states this directly: "Fork yourself when the intermediate tool output isn't worth keeping in your context." Subagent output that returns to the main session adds to its context. If you only need the conclusion, not the tool calls and intermediate results that produced it, delegating protects the main context window from noise. The fork mechanism inherits parent context; a fresh subagent starts clean.

---

**Example 1 — Coding (parallel investigation)**

*Scenario:* Before starting a migration, a developer needs to know: (a) which files import from the module being migrated, and (b) which of those files have associated test files. These are independent questions.

*WITHOUT:* The developer runs both investigations in the main session. The grep results and file lists from the investigation accumulate in context. By the time they start the actual migration work, the context contains extensive tool output that will never be needed again.

*WITH:*

The developer delegates: "Research which files import from `src/auth/session.ts` and which of those have test files. Return a summary list only — file names and yes/no for test coverage. Don't return the raw grep output."

The subagent does the investigation, returns a clean summary. The main session receives a list of 12 file names with yes/no test flags. Zero raw tool output in context.

---

**Example 2 — Data/Analytics (data quality audit)**

*Scenario:* Before building a new dashboard, an analyst needs to know which of 20 tables in their warehouse have null rate problems. This requires running a COUNT/COUNT check across 20 tables.

*WITHOUT:* The analyst runs the checks in the main session. 20 SQL queries, 20 result sets, all now in context. By the time they start the dashboard work, the context is mostly audit noise.

*WITH:*

The analyst delegates: "Audit the null rates on the primary key column of each table in this list. Return a single summary table: table name, row count, null count, null percentage. Flag any table with >1% nulls. Do not return the individual query results."

The subagent runs 20 queries, returns one summary table. The main session gets the conclusions, not the process.

---

**Example 3 — Content/Research (background research)**

*Scenario:* A writer is producing a report on supply chain resilience. Before drafting, they need background on three recent disruptions: the 2024 Red Sea shipping disruption, the Taiwan semiconductor capacity constraints, and the US-China tariff changes. This research involves multiple web fetches and reading.

*WITHOUT:* The writer does the research in the main session. Dozens of web fetch results accumulate in context. By the time they start writing, the context is 60% research material they won't reference directly.

*WITH:*

The writer delegates: "Research these three supply chain events: [list]. For each, return: what happened, dates, scale of impact, and current status. Under 150 words per event. Cite your sources. Return only the summaries, not the web fetch results."

The subagent reads, synthesises, and returns 450 words of clean summary. The writer has what they need without the raw research material in their context.

---

### Skill 17: Briefing an Agent

**What it is:** Writing the subagent prompt with the understanding that the subagent has zero context from the main session. A good brief includes: goal, what's been tried, relevant constraints, expected output format, and length target.

**Why it matters:** The Agent tool's own documentation is explicit: "Brief the agent like a smart colleague who just walked into the room — it hasn't seen this conversation, doesn't know what you've tried, doesn't understand why this task matters." A terse directive produces shallow work because the agent has to guess at context it doesn't have. The documentation also warns: "Never delegate understanding. Don't write 'based on your findings, fix the bug' — those phrases push synthesis onto the agent."

---

**Example 1 — Coding (code review subagent)**

*Scenario:* A developer wants an independent review of a security-sensitive authentication change before merging.

*WITHOUT brief:*
```
Review the auth changes in pr/1247 for security issues.
```
The subagent doesn't know what the change does, what the security concern is, or what format the review should take.

*WITH brief:*
```
You are reviewing a security-sensitive change to the authentication system.
Context: we are migrating from JWT stored in localStorage to httpOnly cookies.
The change is in src/auth/token.ts and src/middleware/auth.ts.

What we have already checked:
- CSRF protection (SameSite=Strict is set)
- Token expiry (15-minute access tokens)
- Refresh token rotation

What I need from you:
Read src/auth/token.ts and src/middleware/auth.ts. Look specifically for:
1. Any path where a token could be read by JavaScript (XSS exposure)
2. Any endpoint that sets the cookie without Secure flag
3. Any case where the old localStorage token path is still reachable

Return: a bulleted list of issues found, or "No issues found" if clean.
Under 200 words. Do not summarise the changes — only report problems.
```

The subagent knows what's already been checked, what to look for, and the exact output format.

---

**Example 2 — Data/Analytics (data investigation subagent)**

*Scenario:* An analyst needs a subagent to investigate why the monthly revenue figure in two different reports disagrees by $47,000.

*WITHOUT brief:*
```
Find out why the revenue reports disagree.
```
The subagent doesn't know which reports, which figures, which time period, or what to check.

*WITH brief:*
```
Investigate a revenue discrepancy between two reports for October 2025.

The discrepancy:
- Report A (finance_summary dashboard, BigQuery table: reporting.finance_summary):
  shows October 2025 MRR as $1,247,000
- Report B (revenue_ops dashboard, BigQuery table: reporting.revenue_mrr):
  shows October 2025 MRR as $1,200,000
- Difference: $47,000

What we already know:
- Both reports pull from the same upstream tables (billing.subscriptions, billing.charges)
- The difference appeared after a dbt model change was deployed on 2025-10-15
- The discrepancy is only in October — September matches

What to investigate:
1. Read the SQL definitions for both reporting tables (in dbt/models/reporting/)
2. Find where the definitions diverge for MRR calculation
3. Check whether the 2025-10-15 dbt deploy touched either model

Return: the specific line(s) in the SQL where the definitions differ, and your
hypothesis for which figure is correct. Under 300 words. Include the relevant
SQL snippets.
```

---

**Example 3 — Content/Research (research subagent)**

*Scenario:* A writer needs a subagent to research the regulatory landscape for AI hiring tools in the EU for a policy brief.

*WITHOUT brief:*
```
Research EU regulations on AI in hiring.
```
The subagent returns a general overview of EU AI Act provisions, GDPR, and some commentary — but not what the writer needs.

*WITH brief:*
```
Research the current regulatory landscape for AI-powered hiring tools in the EU.
This is for a policy brief aimed at HR technology vendors.

Scope — cover only:
1. EU AI Act requirements that apply specifically to AI used in hiring/recruitment
   (high-risk AI systems classification, obligations for providers and deployers)
2. GDPR provisions most relevant to automated CV screening and candidate scoring
3. Any member-state-level regulations that go beyond the EU AI Act
   (e.g. France's algorithmic transparency requirements)

Do not cover: US regulations, general AI ethics principles, or non-binding guidelines.

Sources to prioritise: EUR-Lex, European Data Protection Board, official government
publications. Avoid citing blog posts or law firm marketing content.

Return format:
- One paragraph per topic area (3 paragraphs total)
- Each paragraph: what the regulation requires, when it takes effect, what the
  penalty exposure is
- List your sources (URLs) at the end
- Total length: under 500 words
```

---

## LAYER 8 — PRODUCTION ARCHITECTURE

---

### Skill 18: Prompt Architecture for Scale

**What it is:** Structuring system prompts with a deliberate static/dynamic boundary. Static instructions (your core persona, tool guidance, behaviour rules) are cached globally and shared across all users. Dynamic context (user state, session data, per-user instructions) is injected after the boundary. Tool descriptions must remain stable to avoid breaking the cache.

**Why it matters:** The source code makes this explicit. In `constants/prompts.ts`, `SYSTEM_PROMPT_DYNAMIC_BOUNDARY` is defined as a literal marker string (`'__SYSTEM_PROMPT_DYNAMIC_BOUNDARY__'`). Everything before it in the prompt array receives `cacheScope: 'global'` — cached across the entire fleet. Everything after receives `cacheScope: null` — no cache. In `utils/api.ts`, `splitSysPromptPrefix` splits the system prompt at this boundary. The comment in the code: "The dynamic agent list was ~10.2% of fleet cache_creation tokens: MCP async connect, /reload-plugins, or permission-mode changes mutate the list → description changes → full tool-schema cache bust." Designing prompts without this awareness wastes significant token budget on cache creation.

---

**Example 1 — Coding (internal tool deployment)**

*Scenario:* An engineering team is deploying Claude as a code review assistant accessible to their entire engineering team of 200 people. The system prompt includes both general code review instructions and per-user context (which team the user is on, their preferred language, their recent PR history).

*WITHOUT:* The system prompt is built as a single block that includes both the general instructions and the user-specific context. Every user request invalidates the cache because the user-specific section changes. All 200 engineers effectively share no cache. Token cost scales linearly with usage.

*WITH:* The system prompt is split:

```
# Static section (before boundary — cached globally)

You are a code review assistant for engineering teams. Your role is to:
[core instructions that never change per user]

# Code review standards
[stable rules that apply to all users]

# Available tools
[tool descriptions — never change between users]

__SYSTEM_PROMPT_DYNAMIC_BOUNDARY__

# Session context

User: {user_name}
Team: {team_name}
Language preference: {preferred_language}
Current PR under review: {pr_url}
```

The static section is computed once and cached globally. The dynamic section (user-specific) is injected per-request without busting the global cache. 200 engineers share the same cached static prefix.

---

**Example 2 — Data/Analytics (analytics assistant deployment)**

*Scenario:* A data platform team is deploying a warehouse query assistant to 50 analysts. The assistant needs to know the company's data dictionary, table schemas, and metric definitions — all stable — and also needs to know which projects the current analyst has access to and their team's specific metrics — which vary per analyst.

*WITHOUT:* The entire context (schemas + analyst-specific access) is built into one system prompt per user. Schema documentation alone is 8,000 tokens. Every analyst request rebuilds from scratch — 50 analysts × 8,000 tokens × N requests = massive cache creation cost.

*WITH:*

Static section (cached globally):
```
You are a data warehouse assistant. You help analysts write SQL queries
against our BigQuery warehouse.

## Data Dictionary
[complete stable schema documentation — 8,000 tokens]

## Standard Metric Definitions
[stable metric definitions]

## Query Conventions
[always-true SQL style rules]

__SYSTEM_PROMPT_DYNAMIC_BOUNDARY__
```

Dynamic section (per-analyst, injected at request time):
```
## Analyst Context

Analyst: {analyst_name}
Team: {team}
Accessible datasets: {dataset_list}
Default project: {gcp_project_id}
Current task: {current_task_description}
```

The 8,000 tokens of schema documentation are cached globally. Only the 200-token analyst context varies per user.

---

**Example 3 — Content/Research (content generation platform)**

*Scenario:* A content platform deploys Claude as a writing assistant for 1,000 creators. The assistant has a stable set of writing guidance, tone rules, and content policy instructions. Each creator has their own brand voice, posting schedule, and audience description.

*WITHOUT:* The writing guidance (stable, 3,000 tokens) and creator profile (per-user, 500 tokens) are both in every system prompt. The tool descriptions also include creator-specific tool configurations that change when creators update their connected platforms. Every creator update triggers a full cache bust across all tool definitions.

*WITH:*

Static section:
```
You are a content creation assistant. You help creators write posts,
captions, and long-form content.

## Writing Standards
[stable guidance — never creator-specific]

## Content Policy
[stable rules]

## Tool Descriptions
[descriptions that NEVER reference creator-specific state]

__SYSTEM_PROMPT_DYNAMIC_BOUNDARY__
```

Dynamic section (per-creator, per-session):
```
## Creator Profile

Creator: {creator_name}
Brand voice: {brand_voice_description}
Audience: {audience_description}
Platform focus: {primary_platform}
Current campaign: {campaign_brief}
```

The key discipline: tool descriptions remain stable. Creator-specific platform configurations (which platforms are connected, what posting limits apply) are injected only in the dynamic section, never embedded in tool descriptions. This prevents tool-schema changes from busting the global cache — the source code comment identifying this as "~10.2% of fleet cache_creation tokens" makes clear how expensive this mistake is at scale.

---

## Skill Stack Summary

| Layer | Skill | Core Discipline |
|-------|-------|----------------|
| 1 — Mental Model | 1. System not mind reader | Write what you mean, not what you assume will be inferred |
| | 2. Context window is finite | What isn't explicit doesn't survive |
| | 3. Tools are how the model acts | Understand the tool layer to control the workflow |
| 2 — Communication | 4. Verb-first requests | Pick verbs with defined blast radii |
| | 5. Target specificity | Precise references prevent search overhead |
| | 6. Constraint setting | Constraints are scope ceilings, not limitations |
| 3 — Session Hygiene | 7. CLAUDE.md | Standing rules in memory, not chat |
| | 8. Session scoping | One session, one purpose |
| | 9. Front-loading | Corrections are expensive; specify upfront |
| 4 — Context Awareness | 10. Context rot recognition | Catch degradation before it compounds |
| | 11. Writing for compaction | User messages survive; implicit context doesn't |
| | 12. Checkpointing | Intervene in compaction on your own terms |
| 5 — Output Engineering | 13. Plan before execution | One turn to catch misunderstanding vs many to fix it |
| | 14. Format control | Defaults are for brevity; specify when you need more |
| 6 — Tool Fluency | 15. Guiding tool use | Control path, cost, and auditability |
| 7 — Agent Design | 16. Delegation decision | Delegate when you don't need the raw process |
| | 17. Briefing an agent | Zero context assumed; brief accordingly |
| 8 — Production Architecture | 18. Prompt architecture for scale | Static/dynamic split controls cache economics |

---

*This document is grounded in the Claude Code source code: `services/compact/prompt.ts` (compaction logic), `constants/prompts.ts` (system prompt structure and the `SYSTEM_PROMPT_DYNAMIC_BOUNDARY` marker), `utils/api.ts` (cache scope splitting), `utils/claudemd.ts` (CLAUDE.md loading hierarchy), `services/compact/autoCompact.ts` (compaction thresholds), and `tools/AgentTool/prompt.ts` (agent delegation and briefing guidance).*
