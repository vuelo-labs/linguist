---
course-revision: 2026-05-05
---

# Layer 7 — Agent Design
## Skills 16–17

This layer is about designing **in-CLI subagents** — the delegated sub-loops you spawn from inside a Claude Code session. The shift from L6 is mechanical: instead of picking the right tool for the next turn, you are architecting a delegation that runs its own multi-turn loop, returns a summary, and discards everything else. The shift in 2026 is also one of cost shape: forked subagents share the parent's prompt cache, declare their own MCP servers, and run inside `CLAUDE_CODE_FORK_SUBAGENT=1` semantics that didn't exist a year ago.

The fundamental value of subagents is **context isolation**. A subagent's tool outputs — file reads, grep results, bash output, web fetches — run in their own context window and never land in yours. You receive a summary. This protects your main session from being filled with intermediate output you won't need again.

What this layer does **not** cover: hosted Managed Agents, the Memory store, and the Advisor pairing pattern. Those are different substrates — sandboxed harnesses, persistent state, fast-executor/strong-advisor pairings — and they live in the parallel module `managed-agents-memory-advisor.md`. When the in-CLI design decision below bumps into "should this be a hosted agent?" or "should the executor have an advisor?", the answer is in that module, not this one.

---

### Skill 16: The Delegation Decision

**What it is:** Deciding what belongs in the main session versus delegated to a subagent. The criterion from the Agent tool's own source prompt: will you need the raw output again? If no, delegate.

**Why it matters:** The Agent tool's prompt (`tools/AgentTool/prompt.ts` — internal module path inside the shipped Claude Code npm bundle, not a file in the public `anthropics/claude-code` repo; corroborated by independent reverse-engineering write-ups; structure verified against v2.1.128, 2026-05-05; exact wording may have drifted) frames it directly: *fork yourself when the intermediate tool output isn't worth keeping in your context*. Subagent output that returns to the main session adds to its context. If you only need the conclusion, not the tool calls and intermediate results that produced it, delegating protects the main context window from noise.

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
- Anything where the right substrate is *not* an in-CLI subagent at all (long-horizon work that should live in a hosted Managed Agent; advisory pairings that should use the Advisor pattern; persistent state that belongs in Memory) — see `managed-agents-memory-advisor.md`.

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

**Why it matters:** The Agent tool's documentation is explicit (sourced from `tools/AgentTool/prompt.ts`; provenance hedge per Skill 16): *brief the agent like a smart colleague who just walked into the room — it hasn't seen this conversation, doesn't know what you've tried, doesn't understand why this task matters*. A terse directive produces shallow work because the agent has to guess at context it doesn't have.

The same source warns against a specific failure pattern: *never delegate understanding. Don't write "based on your findings, fix the bug" or "based on the research, implement it" — those phrases push synthesis onto the agent instead of doing it yourself*. The agent does research. You synthesise it. You write the implementation prompt with the specific file, the specific line, what specifically to change.

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

---

## Subagent cost shape

Briefing tells you *what* the subagent does. Cost shape tells you *what each delegation actually charges* against tokens, latency, and the parent session's prompt cache. In 2026 Claude Code three mechanisms dominate.

### Fork semantics (`CLAUDE_CODE_FORK_SUBAGENT=1`)

The `CLAUDE_CODE_FORK_SUBAGENT=1` environment variable enables forked subagents on external builds and SDK non-interactive sessions (v2.1.117, 2026-05-05; coverage extended in v2.1.121). A *forked* subagent inherits the parent's conversation prefix as a starting state but runs its own loop from there; the parent context isn't appended to during the sub-run. When the subagent returns, only its summary lands in the parent.

Practical consequence: forked subagents are restartable. Their context is disposable on return. If the work is exploratory or potentially wasted (a research sweep that may turn up nothing), fork it — the failure mode costs you a summary line, not a polluted main context.

### Sub-agent prompt-cache sharing (~3× `cache_creation` reduction)

As of v2.1.128 (2026-05-05), sub-agent progress summaries share the parent's prompt cache, which produces approximately a 3× reduction in `cache_creation` tokens vs. the pre-v2.1.128 behaviour. The same release fixed a separate issue where idle subagent summaries would re-fire on every parent turn; they no longer do.

Practical consequence: the per-subagent fixed cost dropped meaningfully in May 2026. Designs that previously rejected delegation as "too expensive for a small task" deserve a second look. The cost-of-delegation dial moved.

This matters most when you're spawning multiple subagents in a single session — parallel investigation, multi-reviewer patterns, the kind of fan-out that the `code-review` (5 agents) and `pr-review-toolkit` (6 agents) first-party plugins ship out of the box. Cache sharing is what makes those parallel-team designs economical.

### Per-agent MCP servers (frontmatter `mcpServers`)

Agent frontmatter supports `mcpServers` declarations as of v2.1.117 (2026-05-05). A subagent can declare exactly the MCP servers it needs — no more, no less — instead of inheriting the parent's full server list. Per-agent MCP scoping has two effects:

- **Tool-list cache hygiene.** A subagent that only needs one MCP server doesn't carry the parent's twelve. The tool list it ships to the model is smaller, more stable, and cheaper to cache.
- **Permission surface.** If the subagent shouldn't have access to (say) the production database MCP, don't declare it in the frontmatter. Scoping is mechanical, not advisory.

Combine with `alwaysLoad` on the parent's stable servers (L6) and you get a system where the parent has a hot, stable tool-list cache and each subagent narrows that further to just what its task needs.

### Designing for cost shape

Three rules of thumb:

1. **If you're going to delegate at all, fork.** The disposable-context property is almost always what you want; the parent-pollution failure mode of un-forked delegation is the bigger risk.
2. **Match the MCP server set to the brief.** A "research the EU AI Act" subagent doesn't need your database MCP. Strip the frontmatter `mcpServers` to what the task uses.
3. **Don't over-fan-out small tasks.** Cache sharing made fan-out cheaper, not free. Six agents reviewing a PR makes sense (different facets, real parallelism); six agents each reading one file does not (one Grep would do).

---

## Where this layer ends

This layer ends at the boundary of the in-CLI session. Three substrates take over from here:

- **Hosted Managed Agents** — sandboxed, server-side agents with their own beta header, SSE streaming, and audit semantics. The right substrate when the work outlives a CLI session, needs to run unattended, or needs an isolation boundary the in-CLI subagent can't provide. Covered in `managed-agents-memory-advisor.md`.
- **Memory** — the persistent state primitive (file-backed, scoped, audited, exportable; public beta from 2026-04-23). The right answer when "this should survive across sessions" — the question CLAUDE.md and `~/.claude/settings.json` answer differently. Covered in `managed-agents-memory-advisor.md`.
- **The Advisor pattern** — fast executor + strong advisor pairing (beta header `advisor-tool-2026-03-01` as of 2026-05-05). The right answer when a long-horizon executor needs occasional strong-model judgement without paying the strong-model price on every turn. Covered in `managed-agents-memory-advisor.md`.

The decision rule: stay in this layer when the work fits inside one CLI session and the substrate is a delegated sub-loop. Cross into the sibling module when the substrate is hosted, persistent, or paired.

---

## Next

L8 (Production Architecture) takes the same machinery to scale: automatic prompt caching, cache-bust hygiene around MCP and tool lists, data residency, model selection across the 2026 lineup. Where L7 is about the *shape of one delegation*, L8 is about what changes when you run thousands of them per day.

The hosted-substrate sibling module — `managed-agents-memory-advisor.md` — extends this layer rather than continuing it. Read both before designing anything that spans more than a single CLI session.
