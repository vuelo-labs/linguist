---
course-revision: 2026-05-05
---

# Layer 3 — Session Hygiene
## Skills 7–9

These skills are about managing the structure of working sessions — where instructions live, how sessions are bounded, and the cost of corrections that arrive too late.

Persistent state in 2026 Claude Code lives in three places, with three different lifetimes and audit profiles: **CLAUDE.md** (instructions loaded fresh into every session's system prompt), **settings.json** (configuration and permissions, persisted by the harness), and **Memory** (file-backed cross-session state in Managed Agents, public beta as of 2026-05-05). This module covers all three, plus the bounding mechanics — `/clear`, `/compact`, `/usage`, `claude project purge` — that decide what survives between sessions and what doesn't.

---

### Skill 7: Persistent Instructions (CLAUDE.md)

**What it is:** CLAUDE.md is a markdown file loaded into the system prompt at session start. Instructions written there are available in every session without taking up conversation history. Anything you would say in every session belongs in CLAUDE.md, not in chat.

**Why it matters:** CLAUDE.md files are loaded in a defined hierarchy — managed (system-wide), user (`~/.claude/CLAUDE.md`), project (repo-level `CLAUDE.md` and `.claude/rules/*.md`), and local (`CLAUDE.local.md`) (as of v2.1.128, 2026-05-05). They are read once at session start and cached. Unlike conversation messages, they don't accumulate in history or degrade through compaction — they're loaded fresh every time.

**CLAUDE.md vs. settings.json.** CLAUDE.md is for *instructions to the model*. `settings.json` is for *configuration of the harness*: permissions, hooks (covered in Layer 7), env vars, MCP servers, allowed tools. Since v2.1.119 (Apr 23, 2026), `/config` changes persist to `~/.claude/settings.json`, and managed-settings inheritance gives admins a way to ship policy down to user and project scopes. The two files coexist: a Bun-only project might pin `bun` in `package.json`, declare its style rules in `CLAUDE.md`, and allowlist `bun test` in `.claude/settings.json`. Permission tiers `allowManagedDomainsOnly` and `allowManagedReadPathsOnly` (security inheritance fix in v2.1.126) let an org constrain network and read access without trusting the project to do it. If a rule is "what the model should do", it goes in CLAUDE.md; if it's "what the harness should permit, run, or log", it goes in settings.json.

**What belongs in CLAUDE.md:**
- Tech stack constraints ("we use Bun, not Node")
- Code style rules ("don't add type annotations to files you didn't change")
- Workflow rules ("always run tests before marking a task done")
- Pre-authorised permissions ("you can commit directly, always ask before pushing")
- Terminology definitions ("we call it a 'workspace', not a 'project'")

**What doesn't belong:**
- Task-specific context, in-progress work, session state. CLAUDE.md is for standing rules, not notes.

---

**Example 1 — Coding (project conventions)**

*Scenario:* A team's codebase uses a specific test file naming convention (`*.spec.ts` not `*.test.ts`), a specific import order enforced by ESLint, and a rule that database queries must never appear outside repository files.

*WITHOUT:* A new team member types these constraints into the chat each time they start a session. By session three, they've stopped bothering, and the model starts creating `*.test.ts` files and writing queries in service files. The violations get caught in code review.

*WITH:* A `.claude/CLAUDE.md` file at the project root:

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

**CTE naming:** all CTEs must use snake_case. No camelCase or PascalCase.

Raise an error and ask for clarification if a request would violate these
conventions.
```

---

**Example 3 — Content/Research (editorial voice)**

*Scenario:* A content team produces articles in a consistent brand voice: second-person address, active voice only, no jargon, maximum 20-word sentences, Oxford comma always.

*WITHOUT:* An editor pastes the style guide into every chat session. On long sessions it compacts and gets lost. Articles drift in register.

*WITH:* A `~/.claude/CLAUDE.md` for the editor's personal sessions:

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

**Why it matters:** Context from unrelated previous tasks is dead weight that accumulates in the context window and affects compaction. The compaction model is asked to summarise primary intent, current work, and pending tasks; if a session contains three unrelated tasks, the summary tries to hold all three, which dilutes focus on the active one. Auto-compaction also fires before the window is fully full — a built-in buffer in the harness means the cost of dead context arrives earlier than users expect (as of v2.1.128, 2026-05-05; the v2.1.128 release also fixed a 1M-context auto-compact false-positive).

**The toolkit.** Four primitives, in increasing order of force:

- `/clear` — drop the current conversation; start the next turn fresh. Use between unrelated tasks in the same working day.
- `/compact` — manually trigger compaction now, rather than waiting for the buffer. Useful when you're about to start a long sub-task and want a clean summary as the new baseline.
- `/usage` — inspect token spend and session shape (replaces the old `/cost` and `/stats`, merged in v2.1.118). Treat it as the speedometer: if you're seeing compaction fire every few turns, the session is too broad.
- `claude project purge [path]` — wipe all Claude Code state for a project: transcripts, tasks, file history, config (v2.1.126; supports `--dry-run`, `-y`, `-i`, `--all`). The nuclear option, for when a project's accumulated state has become a liability rather than an asset.

---

**Example 1 — Coding (context pollution)**

*Scenario:* A developer spends the first half of a session debugging a Redis connection issue, then switches to building a new API endpoint.

*WITHOUT:* The session runs long and compacts. The summary includes extensive context about Redis connection strings, retry logic, and environment variables — none of which is relevant to the API endpoint. The model's next response is subtly contaminated: it adds unnecessary error handling for connection failures in the endpoint code because it's "aware" of connectivity problems even though they were resolved.

*WITH:* After resolving the Redis issue, the developer runs `/clear` before starting the endpoint work. The new session starts with only the endpoint task in context.

---

**Example 2 — Data/Analytics (mixed analytical tasks)**

*Scenario:* An analyst investigates a data quality issue in the `payments` table, then later in the same session starts building a new retention analysis.

*WITHOUT:* The session compacts during the retention analysis. The summary carries detailed context about payment data anomalies and the investigation approach. The model occasionally references payment context when writing the retention queries, suggesting filters that made sense in the payment investigation but are irrelevant to retention.

*WITH:* The analyst runs `/clear` between the payment investigation and the retention analysis, then starts the new task with a clean brief.

---

**Example 3 — Content/Research (multi-topic research)**

*Scenario:* A researcher investigates two separate competitive threats in one session: first Competitor A's new product, then Competitor B's pricing changes.

*WITHOUT:* By the time the researcher reaches Competitor B, the model's context is full of Competitor A details. The compaction blends the two. The model starts drawing comparisons between A and B that weren't asked for, and occasionally attributes features to the wrong company.

*WITH:* Two sessions. One per competitor. Each starts with a clean brief. The research is kept separate.

---

### Skill 9: Front-Loading Constraints

**What it is:** Stating all constraints, exclusions, and preferences before the model begins work — not during or after.

**Why it matters:** Corrections mid-task are expensive in multiple ways: they add turns to the conversation, require rework of already-completed output, and must survive compaction to be effective later in the same session. The model's system prompt notes: "Go straight to the point. Try the simplest approach first." Once the model has taken an approach, redirecting it costs more than specifying upfront. Each correction is also a new user message that the compaction system has to carry forward — adding to the weight of the session rather than reducing it.

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

**Example 2 — Data/Analytics (output structure)**

*Scenario:* A data scientist is asking the model to help build a Python script to process a CSV. They need the output as a class, not a collection of functions.

*WITHOUT:* The data scientist writes `write a Python script to clean the customer CSV file`. The model returns a procedural script with standalone functions. The scientist says "wrap this in a class". The model rewrites. Two turns of full output generation.

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

### Memory (Managed Agents) — public beta as of 2026-05-05

**What it is:** Memory is a file-backed, cross-session state store that lives inside Claude Managed Agents (the hosted agent harness, public beta Apr 8, 2026; Memory itself entered public beta Apr 23, 2026 under the beta header `managed-agents-2026-04-01`). An agent can read and write memory entries during one session and find them again in the next, without the user re-supplying them. Memory has scoped permissions, audit logs, API export, and supports concurrent multi-agent stores.

**Why it's in this module:** Memory is the third place persistent state can live, alongside CLAUDE.md and settings.json. The three are not interchangeable:

| Surface | Lifetime | Audience | Audit profile |
|---|---|---|---|
| **CLAUDE.md** | Loaded fresh every session (at any level — managed/user/project/local); edited deliberately by humans | The model | Tracked in version control; diff-reviewable |
| **settings.json** | Persisted by the harness; edited deliberately by humans (or admins via managed settings) | The harness (permissions, hooks, env) | Tracked in version control or org policy; diff-reviewable |
| **Memory** | Persisted by the agent itself across sessions; written *by the model* during execution | The model (next session's self) | API export + audit logs; reviewable but not git-shaped |

The headline distinction is *who writes it*. CLAUDE.md and settings.json are human-authored artifacts the model and harness consume. Memory is model-authored — the agent decides what to retain. That's powerful for long-horizon work (a research agent that remembers which sources were dead ends, an ops agent that remembers which runbooks the team actually follows) and risky for everything else: anything written into Memory is a future input the user did not explicitly approve, which is why the Memory beta ships with scoped permissions and audit logs as first-class controls.

**When Memory replaces CLAUDE.md:** when the rule is *learned* rather than *stated*. "We use Bun, not Node" is a CLAUDE.md rule — it's known up front, it's stable, and a human should own it. "Liam prefers code review comments grouped by file rather than by severity" is a Memory candidate — an agent could discover it from feedback over several sessions and retain it without the user maintaining a preferences file. Treat Memory as cumulative observation, CLAUDE.md as deliberate instruction.

**When Memory replaces settings.json:** rarely. Permissions, hooks, and env vars are policy, and policy belongs in a reviewable file. If an agent is making per-session permission decisions, that's an `allowManagedDomainsOnly`-style problem, not a Memory problem.

**Practical posture for now (public beta):** treat Memory as opt-in for individual long-running agents, not as a default for every session. Read the audit logs. Date-stamp anything you build on top of it — the spec is still moving.

---

**Layer 3 thesis:** persistent state across sessions is not one thing. CLAUDE.md (human-authored instructions, loaded fresh every session), settings.json (human-authored harness configuration, persisted by the tool), and Memory (model-authored cross-session state, in beta) cover three different lifetimes and three different audit profiles. Session hygiene is choosing the right surface for each piece of state — and using `/clear`, `/compact`, `/usage`, and `claude project purge` to keep the parts that don't belong out of the working session.
