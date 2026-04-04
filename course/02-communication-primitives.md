# Layer 2 — Communication Primitives
## Skills 4–6

With the mental model in place, these three skills cover the mechanics of well-formed requests. Each one addresses a specific mechanical failure mode — not a preference for clarity, but a predictable way the model breaks without it.

---

### Skill 4: Verb-First Deterministic Requests

**What it is:** The imperative verb at the start of a request signals scope. `Fix`, `add`, `refactor`, `explain`, and `extract` have different blast radii. Vague verbs like `improve`, `clean up`, and `look at` have no defined ceiling.

**Why it matters:** The model interprets the verb as a constraint on what it's allowed to do. `Fix` bounds the model to the specific problem. `Improve` authorises the model to decide what an improvement looks like — and it will. The system prompt in `constants/prompts.ts` explicitly instructs the model: "Don't add features, refactor code, or make improvements beyond what was asked." It can only honour that if the verb is unambiguous.

**Verb reference:**

| Verb | Blast radius |
|------|-------------|
| `fix` | Minimum change to resolve the stated problem |
| `add` | New capability only — don't modify existing |
| `refactor` | Restructure without changing external behaviour |
| `extract` | Move existing code, don't rewrite |
| `explain` | Read-only, no changes |
| `update` | Modify existing functionality as specified |
| `clean up` | ⚠ Ambiguous — avoid |
| `improve` | ⚠ No ceiling — avoid unless constrained |
| `look at` | ⚠ Not a verb — produces no defined action |

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

**Why it matters:** When the model doesn't have a precise target, it uses Glob, Grep, or multi-file reads to find candidates. This is not just slower — it introduces interpretation errors. If the search finds two functions with similar names, the model chooses one, and it may be the wrong one. Every search turn is a turn that could have been work.

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

**Example 3 — Content/Research (citation verification)**

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

**Why it matters:** The model's system prompt instructs it to be helpful and capable. "Helpful" in the absence of constraints means the model self-assigns scope. Constraints don't limit quality — they prevent unasked-for additions that create diff noise, introduce new bugs, or change things outside your review. The source instruction: "The right amount of complexity is what the task actually requires — no speculative abstractions, but no half-finished implementations either."

**Common constraint patterns:**

- Scope ceiling: `Do not change anything else`
- File boundary: `Only modify src/auth/token.ts`
- Interface lock: `Same public interface — internal changes only`
- Tool restriction: `Do not run any commands`
- Method constraint: `Cut only, do not rewrite`

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
