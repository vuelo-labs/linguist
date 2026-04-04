# Layer 7 — Agent Design
## Skills 16–17

These skills apply when the task is large enough to warrant delegation to a subagent. The key shift is moving from "how do I prompt the model?" to "how do I architect a delegation?"

The fundamental value of subagents is **context isolation**. A subagent's tool outputs — file reads, grep results, bash output, web fetches — run in their own context window and never land in yours. You receive a summary. This protects your main session from being filled with intermediate output you won't need again.

---

### Skill 16: The Delegation Decision

**What it is:** Deciding what belongs in the main session versus delegated to a subagent. The criterion from the Agent tool's own source prompt: will you need the raw output again? If no, delegate.

**Why it matters:** The Agent tool's prompt (`tools/AgentTool/prompt.ts`) states this directly: "Fork yourself when the intermediate tool output isn't worth keeping in your context." Subagent output that returns to the main session adds to its context. If you only need the conclusion, not the tool calls and intermediate results that produced it, delegating protects the main context window from noise.

**The decision framework:**

| Delegate when... | Keep in main session when... |
|-----------------|------------------------------|
| The task is a research question | The task requires your direct judgment |
| The output will be large (100+ lines of tool results) | The output is small and needed for next steps |
| The task is independent of what you're doing | The agent's findings drive your immediate next action |
| You want an isolated, unbiased second opinion | You need the model's full context to do the task |
| Multiple independent sub-tasks can run in parallel | The sub-tasks are sequential and dependent |

**When NOT to delegate:**
- Searching for a specific known file or function (use Glob/Grep directly — faster)
- Reading 2–3 files (read them directly)
- Anything where you'll need to refer to the raw output in your next prompt

---

**Example 1 — Coding (parallel investigation)**

*Scenario:* Before starting a migration, a developer needs to know: (a) which files import from the module being migrated, and (b) which of those files have associated test files. These are independent questions.

*WITHOUT:* The developer runs both investigations in the main session. The grep results and file lists accumulate in context. By the time they start the actual migration work, the context contains extensive tool output that will never be needed again.

*WITH:* The developer delegates:

```
Use an Agent to research which files import from src/auth/session.ts and which
of those have test files.

Return a summary list only — file names and yes/no for test coverage.
Do not return the raw grep output or any tool call results.
```

The subagent does the investigation, returns a clean list of 12 file names with yes/no test flags. Zero raw tool output in the main context.

---

**Example 2 — Data/Analytics (data quality audit)**

*Scenario:* Before building a new dashboard, an analyst needs to know which of 20 tables in their warehouse have null rate problems.

*WITHOUT:* The analyst runs the checks in the main session. 20 SQL queries, 20 result sets, all now in context. By the time they start the dashboard work, the context is mostly audit noise.

*WITH:* The analyst delegates:

```
Use an Agent to audit the null rates on the primary key column of each table
in this list: [table list].

Return a single summary table: table name, row count, null count, null percentage.
Flag any table with >1% nulls.

Do not return the individual query results — only the summary table.
```

The subagent runs 20 queries, returns one summary table. The main session gets conclusions, not process.

---

**Example 3 — Content/Research (background research)**

*Scenario:* A writer is producing a report on supply chain resilience. Before drafting, they need background on three recent disruptions. This research involves multiple web fetches.

*WITHOUT:* The writer does the research in the main session. Dozens of web fetch results accumulate. By the time they start writing, the context is 60% research material they won't reference directly.

*WITH:* The writer delegates:

```
Use an Agent to research these three supply chain events: [list].

For each event, return: what happened, dates, scale of impact, and current status.
Under 150 words per event. Cite your sources with URLs.

Return only the summaries — not the web fetch results or intermediate research.
```

The subagent reads, synthesises, and returns 450 words of clean summary.

---

### Skill 17: Briefing an Agent

**What it is:** Writing the subagent prompt with the understanding that the subagent has zero context from the main session. A good brief includes: goal, what's been tried, relevant constraints, expected output format, and length target.

**Why it matters:** The Agent tool's documentation is explicit (sourced from `tools/AgentTool/prompt.ts`): *"Brief the agent like a smart colleague who just walked into the room — it hasn't seen this conversation, doesn't know what you've tried, doesn't understand why this task matters."* A terse directive produces shallow work because the agent has to guess at context it doesn't have.

The same source warns against a specific failure pattern: *"Never delegate understanding. Don't write 'based on your findings, fix the bug' or 'based on the research, implement it.' Those phrases push synthesis onto the agent instead of doing it yourself."* The agent does research. You synthesise it. You write the implementation prompt with the specific file, the specific line, what specifically to change.

**A good brief contains:**
1. **Goal** — what you're trying to accomplish and why
2. **Context** — what you already know, what you've already tried, what to rule out
3. **Scope** — what's in, what's out, what another agent is handling in parallel
4. **Output format** — what to return and what not to return
5. **Length target** — "under 200 words", "a bullet list", "one paragraph per topic"

---

**Example 1 — Coding (security review subagent)**

*Scenario:* A developer wants an independent review of a security-sensitive authentication change before merging.

*WITHOUT brief:*
```
Review the auth changes in pr/1247 for security issues.
```
The subagent doesn't know what the change does, what security concern to focus on, or what format the review should take.

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

**Example 2 — Data/Analytics (discrepancy investigation subagent)**

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
- Report A (reporting.finance_summary): shows October 2025 MRR as $1,247,000
- Report B (reporting.revenue_mrr): shows October 2025 MRR as $1,200,000
- Difference: $47,000

What we already know:
- Both reports pull from the same upstream tables (billing.subscriptions, billing.charges)
- The difference appeared after a dbt model change deployed on 2025-10-15
- The discrepancy is only in October — September matches

What to investigate:
1. Read the SQL definitions for both reporting tables (in dbt/models/reporting/)
2. Find where the definitions diverge for MRR calculation
3. Check whether the 2025-10-15 dbt deploy touched either model

Return: the specific SQL lines where the definitions differ, and your hypothesis
for which figure is correct. Under 300 words. Include the relevant SQL snippets.
```

---

**Example 3 — Content/Research (regulatory research subagent)**

*Scenario:* A writer needs a subagent to research the regulatory landscape for AI hiring tools in the EU for a policy brief.

*WITHOUT brief:*
```
Research EU regulations on AI in hiring.
```
The subagent returns a general overview — not what the writer needs.

*WITH brief:*
```
Research the current regulatory landscape for AI-powered hiring tools in the EU.
This is for a policy brief aimed at HR technology vendors.

Scope — cover only:
1. EU AI Act requirements that apply specifically to AI used in hiring/recruitment
   (high-risk AI systems classification, obligations for providers and deployers)
2. GDPR provisions most relevant to automated CV screening and candidate scoring
3. Any member-state-level regulations that go beyond the EU AI Act

Do not cover: US regulations, general AI ethics principles, or non-binding guidelines.

Sources to prioritise: EUR-Lex, European Data Protection Board, official government
publications. Avoid citing blog posts or law firm marketing content.

Return format:
- One paragraph per topic area (3 paragraphs total)
- Each paragraph: what the regulation requires, when it takes effect, penalty exposure
- List your sources (URLs) at the end
- Total length: under 500 words
```
