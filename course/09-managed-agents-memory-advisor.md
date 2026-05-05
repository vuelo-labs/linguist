---
course-revision: 2026-05-05
---

# Layer 9 — Managed Agents, Memory, and the Advisor Pattern

L8 taught you to design agents inside the Claude Code CLI: subagents declared in frontmatter, `mcpServers` scoped per-agent, cache-sharing across siblings, fork semantics. That's the in-process model. It assumes one user, one machine, one conversation tree, and a session that lives until you close the terminal.

This module covers the three primitives Anthropic shipped in spring 2026 for agents that live *outside* that model — hosted on Anthropic's infrastructure, persistent across sessions, or paired with a stronger reasoner mid-flight. Concretely:

- **Claude Managed Agents** — a hosted agent harness with sandboxes, built-in tools, and SSE streaming (public beta as of 2026-05-05; beta header `managed-agents-2026-04-01`).
- **Memory** — a file-backed cross-session state store inside Managed Agents (public beta as of 2026-05-05; same beta header).
- **The Advisor pattern** — a fast executor model paired with a stronger advisor for mid-generation strategic guidance (public beta as of 2026-05-05; beta header `advisor-tool-2026-03-01`).

Each is a substrate shift, not just new tactics. They change *where the agent runs*, *what it remembers between runs*, and *who decides its strategy at each step*. The earlier layers of the course spine are about prompting and orchestrating one model in one session well; this layer is about agents that escape both of those frames.

It sits between L8 and L10 (production architecture) because the decision is no longer "how do I shape a subagent prompt" (L8) but also not yet "how do I run a fleet of these in production with residency, rate limits, and observability" (L10). It's the substrate-selection layer.

---

## 1. The three hosted primitives at a glance

| Primitive | Mechanism | Lifetime | Reach for it when |
|-----------|-----------|----------|-------------------|
| **Managed Agent** | Hosted, sandboxed agent loop on Anthropic infra; built-in tools; SSE streaming via API or `ant` CLI | Per-session, but the session can be picked up later (hours, days) and is auditable end-to-end | Long-horizon work, multi-tenant hosting, audit-required workflows, anything that shouldn't run on a developer laptop |
| **Memory** | File-backed cross-session store written by the agent, scoped + audited; portable via API export | Persists across sessions; survives across agents on the same store; revoked by deleting entries | The agent needs to *learn* something across sessions that no human will keep in CLAUDE.md (preferences, dead-end sources, runbook actuals) |
| **Advisor** | Two models on one task: cheap/fast executor + stronger advisor invoked at strategic checkpoints | Per-call (advisor is invoked mid-generation); not stateful on its own | Long-horizon agentic work where the executor is good enough tactically but loses the plot strategically |

Three different failure modes are being addressed. Managed Agents fix *where it runs* — a subagent in your terminal isn't a thing you can audit, hand off, or scale to ten thousand users. Memory fixes *what it remembers* — CLAUDE.md is human-authored and stable; some knowledge needs to be model-authored and accumulating. Advisor fixes *who decides* — long agentic loops drift, and a periodic strong-model review costs less than running the strong model end-to-end.

---

## 2. Claude Managed Agents

**What it is.** An agent harness Anthropic runs for you. You configure an agent (system prompt, tools, model, optional Memory store), open a session via API or `ant` CLI, and the harness executes the agent loop in a sandboxed environment with built-in tools available. Output streams back over SSE.

Public beta as of 2026-05-05 (announced 2026-04-08). Beta header on the API: `managed-agents-2026-04-01`. Reference: [platform.claude.com/docs/en/managed-agents/overview](https://platform.claude.com/docs/en/managed-agents/overview); engineering background in *Scaling Managed Agents: Decoupling the brain from the hands* on [anthropic.com/engineering](https://www.anthropic.com/engineering).

**Sandbox model.** Each session runs in an isolated environment. Filesystem, network, and tool access are scoped per-agent rather than per-user. This is the part that matters for enterprise: a subagent on a developer's laptop has whatever filesystem access the developer has; a Managed Agent has only what it was provisioned. The blast radius collapses by orders of magnitude.

**Built-in tools.** The hosted environment ships standard tools (file ops, code execution, web fetch, web search) without the operator wiring them. You can layer additional MCP servers on top per agent. This makes a freshly minted Managed Agent useful in roughly the time it takes to write a system prompt — the L8 question of "which tools does my subagent need" is partially pre-answered.

**Session lifecycle.** Sessions are addressable, resumable, and auditable. A session ID outlives the SSE stream that opened it; you can disconnect, reconnect, hand off to another operator, or (with Memory attached) continue across days. Every tool call is logged. This is the property that makes Managed Agents *the* substrate for anything that needs a paper trail — compliance reviews, customer-facing automations, anything where "what did the agent actually do" must be answerable later.

**SSE streaming.** Output streams in real time over Server-Sent Events. Same shape as the Messages API streaming surface, with agent-specific event types layered on (tool calls, sub-step progress, advisor invocations if paired). For UI integration this is the path of least resistance.

**When this beats an in-CLI subagent.**

- *Long-horizon* — the work spans days, not turns. A CLI session ends when the developer closes the terminal; a Managed Agent session doesn't.
- *Multi-tenant* — many users hitting the same agent definition. Distributing a CLI subagent means distributing a CLI; a Managed Agent has one definition and N sessions.
- *Audit-required* — regulators, security teams, or your own postmortems need a session log. Managed Agents log centrally; CLI subagents leave traces in the developer's `~/.claude` and nowhere else.
- *Untrusted operator* — the human in front of the agent shouldn't have raw filesystem or network access. Sandboxing is the point.

**When an in-CLI subagent still wins.**

- *Tight feedback loop* — you're iterating on prompts, tools, behaviour. The CLI's edit-rerun cycle is faster than redeploying a hosted agent.
- *Local context required* — the agent must read the developer's local repo, a database that lives behind a corporate VPN with no API gateway, etc.
- *Cost-sensitive throwaway work* — a one-off subagent has no provisioning overhead.

**The day-to-day surface: the `ant` CLI.** `ant` (launched 2026-04-08) is the CLI client for the Claude API and the day-to-day way to interact with Managed Agents from a terminal: YAML-versioned agent definitions, native streaming, native Claude Code integration. The deep treatment lives in [`claude-code-best-practices-deep.md`](./claude-code-best-practices-deep.md) (Wave 4 will add a dedicated `ant` CLI section there). For this layer, know that `ant` is what most developers will type when they want to talk to a Managed Agent.

Reference: [`claude-code-best-practices-deep.md`](./claude-code-best-practices-deep.md), [platform.claude.com/docs/en/api/sdks/cli](https://platform.claude.com/docs/en/api/sdks/cli).

---

## 3. Memory

**What it is.** A filesystem-backed key-document store attached to a Managed Agent (or shared between agents). The agent reads from Memory at session start and writes to it during execution. Entries persist across sessions, are scoped by permission, are logged for audit, and can be exported via API.

Public beta as of 2026-05-05 (announced 2026-04-23). Beta header: same `managed-agents-2026-04-01`. Reference: [platform.claude.com/docs/en/managed-agents/memory](https://platform.claude.com/docs/en/managed-agents/memory).

**File-backed.** Memory entries are files. The agent treats them as a small, structured filesystem: list, read, write, delete. This shape matters — anything the agent could do with a real filesystem (organise by topic, version, archive) it can do here, with all of it surviving the session.

**Scoped permissions.** Read and write scopes attach per-store. An agent can be granted read-only access to one Memory store and read-write to another. This is how a "shared knowledge base" becomes safe — many agents read from a curated store; a smaller subset writes to it; an even smaller subset can delete.

**Audit logs.** Every read and write is logged centrally. The audit trail is queryable: *which agent wrote this entry, in which session, on which prompt*. This is what makes Memory acceptable in regulated environments — model-authored state with no audit trail would be a liability; with one, it's an asset.

**Portable / exportable.** Memory stores export via API. You can snapshot a store, replicate it, hand it to another agent, or pull it into an offline review. This solves the "what does the agent know about us" question that tends to be unanswerable in less hosted setups.

**Concurrent multi-agent stores.** Multiple agents can attach to the same store simultaneously. The store itself coordinates writes (the spec is still evolving on conflict semantics — date-stamp anything you build on it). Useful when a team of specialised agents shares a knowledge base — one writes runbook updates, another reads them.

**When Memory replaces CLAUDE.md.** Layer 3 already drew this line: CLAUDE.md is for *stated* rules; Memory is for *learned* ones. To recap and sharpen: if a human can write the rule once and have it be true forever, it goes in CLAUDE.md. If the rule must accumulate from observation across many sessions ("user prefers reviews grouped by file", "this runbook step is actually skipped in practice", "these three sources have been dead ends three times"), it's a Memory candidate.

The inversion of authorship is the whole point. CLAUDE.md is human-authored, model-consumed. Memory is model-authored, human-audited. They are not interchangeable, and using one where the other belongs is a category error: human-stated standing rules in Memory get drowned by accumulated observations; model-learned preferences in CLAUDE.md never get written down because no human knows to write them. (See L3 for the three-surface table covering CLAUDE.md, settings.json, and Memory together.)

**When Memory replaces nothing.** Permissions and harness configuration belong in `settings.json`, not Memory. Project conventions belong in `CLAUDE.md`, not Memory. In-session scratch belongs in the conversation, not Memory. The temptation when a new state primitive ships is to migrate everything onto it; resist.

**Enterprise constraints.** The audit log + scoped permissions + API export combination is what Anthropic is leaning on for the enterprise framing. Treat the public-beta posture as: opt-in per agent, not a default; review the audit logs; don't build production policy on top of Memory until the spec stabilises. The L10 module will pick up the residency and rate-limit dimensions.

References: [platform.claude.com/docs/en/managed-agents/memory](https://platform.claude.com/docs/en/managed-agents/memory); [anthropic.com/news](https://www.anthropic.com/news); enterprise framing in *An update on Memory in Claude Agents* coverage.

---

## 4. The Advisor pattern

**What it is.** A pairing pattern. One model — fast, cheap — runs the agent loop turn-to-turn (the *executor*). At configurable checkpoints, a second, stronger model (the *advisor*) is invoked to review state, redirect strategy, or unblock the executor. The advisor's output flows back into the executor's context as guidance for the next stretch of work.

Public beta as of 2026-05-05 (announced 2026-04-09). Beta header: `advisor-tool-2026-03-01`. The headline economic claim from the announcement: on long-horizon agentic workloads, *executor + advisor* approaches the quality of *advisor-solo* at something close to *executor-solo* pricing.

**Why the cost shape pays.** A naive cost model says "use the strongest model end-to-end and pay the bill". Long agentic loops break this in two ways. First, most turns are tactical — the executor doesn't need Opus 4.7 to read a file or make a tool call. Second, the strong model spends its strength on tactical work and loses focus on the strategic thread. Advisor pairing addresses both: the executor handles the tactics; the advisor is summoned only when strategy actually matters.

A useful intuition: imagine an analyst doing a week of grunt work, with a senior every Friday. Friday-only seniority costs a fifth as much as a senior all week and produces better outcomes than five days of unsupervised junior work. The Advisor tool is the same shape, at a finer time-grain.

**Composes with structured outputs.** When the advisor must hand back something the executor can act on mechanically — a JSON plan, a redacted task list, a scored ranking of options — `output_config.format` makes the handoff deterministic. Free-text advisor output works, but pairing Advisor with structured outputs (L5) is where the pattern earns its keep at scale.

**Composes with `xhigh` effort.** Opus 4.7's `xhigh` effort level is the natural advisor-side configuration for the highest-stakes strategic checkpoints. The asymmetry pays: the executor runs at ordinary effort on (say) Haiku 4.5 or Sonnet 4.6; the advisor wakes up on Opus 4.7 `xhigh` for the few moments per session that warrant it. See L5 for effort-level mechanics.

**When Advisor is overkill.** Short tasks. Tasks where the executor is *already* the strongest model (you can't advise Opus 4.7 with anything stronger; pair it with Opus 4.7 `xhigh` only if the strategic-vs-tactical split materially differs). Tasks where strategy doesn't drift — a one-shot translation, a scoped refactor, anything bounded enough that the executor stays on-thread.

**When Advisor is the right pattern.** Multi-day analyses where the executor must keep its eye on a moving research question. Long-horizon coding agents where strategy ("are we still solving the right problem") matters more than tactics ("does this function compile"). Multi-tenant agents where you want the cheapest possible per-turn cost without sacrificing the few key strategic decisions per session.

References: [anthropic.com/news](https://www.anthropic.com/news) (Apr 9, 2026 advisor announcement); beta-header changelog at [platform.claude.com/docs/en/release-notes/api](https://platform.claude.com/docs/en/release-notes/api).

---

## 5. Decision tree: in-CLI subagent vs Managed Agent vs Advisor

The load-bearing teaching of this module. Three substrates, three different questions to ask in order.

**Question 1 — Where does this agent need to run?**

- *Developer's terminal, with full local context, fast iteration loop.* → in-CLI subagent (L8).
- *Anthropic's infra, sandboxed, hosted, auditable, addressable across days.* → Managed Agent.

If the answer is "I don't know yet", default to in-CLI for prototyping. Promote to Managed Agent when one of the four triggers fires: long-horizon work, multi-tenant distribution, audit requirement, untrusted operator.

**Question 2 — What does it need to remember between runs?**

- *Nothing. Each session starts fresh.* → No Memory.
- *Stated rules from a human.* → CLAUDE.md (L3). Not Memory.
- *Learned observations from across many sessions.* → Memory store attached to the Managed Agent.

If the agent is in-CLI and you need cross-session learned state, you don't really have a clean answer today — that pull alone is often enough to migrate to a Managed Agent.

**Question 3 — How is its strategy decided?**

- *The executor is strong enough end-to-end (or the task is short).* → Single model.
- *The task is long-horizon and strategy drifts under a cheap executor.* → Advisor pattern; pair the cheap executor with a stronger advisor model invoked at checkpoints.

These three questions compose, not exclude. A production research agent hits *all three*: it runs as a Managed Agent (audit + multi-tenant), with Memory attached (cross-session learning), under an Advisor pairing (Sonnet 4.6 executor + Opus 4.7 `xhigh` advisor).

**Anti-patterns to flag:**

- *In-CLI subagent + ad-hoc CLAUDE.md as memory.* The subagent rewrites CLAUDE.md to "remember" things across sessions. Stop. Either it's a stated rule (humans own it) or it's learned state (Memory + Managed Agent owns it).
- *Managed Agent for a 30-second task.* Provisioning overhead doesn't pay back. Use the Messages API directly, or an in-CLI tool.
- *Advisor on a single-turn generation.* The advisor checkpoint never fires. You're paying for nothing.
- *Memory store with no audit log review cadence.* Model-authored state with no human review window will surprise you. Pick a cadence; calendar it.

---

## 6. Worked example: a year of GitHub issues, classified, weekly digest

**The task.** "Ingest a year of issues from a busy public repo, classify each by theme, surface duplicates, and produce a weekly digest of new patterns. Run it ongoing."

This is the canonical long-horizon analysis task: bounded data per week, unbounded over time, requires consistent classification (so it must remember its taxonomy), benefits from periodic strategic review (the taxonomy evolves), and is exactly the kind of workload that doesn't belong on one developer's laptop.

**Implementation A — in-CLI subagent.** A Claude Code subagent declared in `.claude/agents/issue-triage.md`, given GitHub MCP access, run weekly by a developer who types `/agents issue-triage` and reviews output.

*What works:* fast to prototype; uses local repo context; humane review loop.

*What breaks:* the developer is the persistence layer. CLAUDE.md grows hand-edited classification rules every week. If the developer is on holiday, the digest doesn't run. The taxonomy lives in the developer's head plus CLAUDE.md, not in any auditable surface. Multi-team adoption means cloning the developer.

This is the right substrate for *prototyping the prompt and the taxonomy* — not for running it.

**Implementation B — Managed Agent + Memory.** Same prompt logic, but as a Managed Agent with a Memory store attached. The store holds the evolving taxonomy, examples per class, known-duplicate pairs. Sessions are scheduled (weekly) and addressable (any operator can resume).

*What works:* the agent owns its taxonomy; it grows over time without a human editing CLAUDE.md; sessions are auditable; multi-team is trivial because there's one agent definition with N callers.

*What still breaks:* the executor model drifts on long sessions. Three months in, the taxonomy starts to fragment because the agent forgets why it had certain classes; new classes proliferate; the digest gets noisy. Symptom of strategy drift in a long agentic loop.

**Implementation C — Managed Agent + Memory + Advisor.** Same as B, plus an advisor checkpoint at the end of each weekly session: "review the taxonomy as it stands; consolidate or split classes if warranted; flag any drift". Executor is Sonnet 4.6 (or Haiku 4.5 for the bulk classification). Advisor is Opus 4.7 at `xhigh` effort, invoked once per weekly run.

*What works:* the executor handles the volume cheaply; the advisor handles the taxonomy hygiene; Memory carries the consolidated taxonomy forward; audit log shows every advisor decision; cost stays close to executor-only because the advisor wakes up once per week, not once per issue.

*Conclusion.* The right substrate for this task is C. A is the prototype. B is what you ship. C is what you ship when you've watched B run for three months and seen the drift.

The lesson generalises: most production long-horizon agents land at Managed Agent + Memory + Advisor, not because all three are always needed at once, but because the failure modes the three primitives address (where it runs, what it remembers, who keeps it on-thread) all compound at scale.

---

## 7. How this composes with the rest of the course

Layer 9 doesn't introduce new prompting mechanics. It introduces new *substrates* on which the prompting mechanics from earlier layers run. The composition map:

- **Layer 3 (Session Hygiene).** The three-surface state model (CLAUDE.md / settings.json / Memory) is introduced there and deepened here. If you haven't internalised L3's authorship inversion (CLAUDE.md is human-authored; Memory is model-authored), §3 of this module won't land.
- **Layer 5 (Output Engineering).** Structured outputs and effort levels are the L5 primitives that make Advisor handoffs deterministic and the executor/advisor effort split economical. Advisor without structured outputs is workable; with them, it's robust.
- **Layer 6 (Tool Fluency).** The tool taxonomy applies inside Managed Agents too. Built-in tools, MCP, deferred tools — same vocabulary, different sandbox.
- **Layer 7 (Skills, Plugins, Hooks).** A Managed Agent can ship as a plugin's worth of skills + agent definitions. The "what's installed where" question scales up rather than disappearing.
- **Layer 8 (in-CLI Agent Design).** The first two substrates in §5's decision tree are L8 and L9 respectively. L8 designs the in-CLI peer; this layer designs the hosted and paired peers. The decision tree here is the canonical "which substrate" reference; L8 should cross-link back to it rather than re-deriving.
- **Layer 10 (Production Architecture).** Memory, Compaction API, residency (`inference_geo`), Rate Limits API, and the Models capabilities API together define the production surface. This module hands off there; everything from "but how do I run a fleet of these in two regions under a per-org rate limit" lives in L10.

**Pointers forward.** When the L10 module goes deep on residency and observability, return to §3 of this module — the audit-log + scoped-permission framing is what makes Memory residency-compliant in the first place. When L10 covers model selection across Opus 4.7 / Sonnet 4.6 / Haiku 4.5, the executor/advisor pairing in §4 is the natural application.

---

## 8. References

- Managed Agents announcement and docs: [anthropic.com/news](https://www.anthropic.com/news) (Apr 8, 2026); [platform.claude.com/docs/en/managed-agents/overview](https://platform.claude.com/docs/en/managed-agents/overview).
- Memory announcement and docs: [anthropic.com/news](https://www.anthropic.com/news) (Apr 23, 2026); [platform.claude.com/docs/en/managed-agents/memory](https://platform.claude.com/docs/en/managed-agents/memory).
- Advisor announcement: [anthropic.com/news](https://www.anthropic.com/news) (Apr 9, 2026); beta-header reference at [platform.claude.com/docs/en/release-notes/api](https://platform.claude.com/docs/en/release-notes/api).
- *Scaling Managed Agents: Decoupling the brain from the hands* — engineering background at [anthropic.com/engineering](https://www.anthropic.com/engineering) (Apr 8, 2026).
- `ant` CLI reference: [platform.claude.com/docs/en/api/sdks/cli](https://platform.claude.com/docs/en/api/sdks/cli).
- Claude Agent SDK (Python): [github.com/anthropics/claude-agent-sdk-python](https://github.com/anthropics/claude-agent-sdk-python).
- Opus 4.7 announcement and migration guide: [anthropic.com/news/claude-opus-4-7](https://www.anthropic.com/news/claude-opus-4-7); [platform.claude.com/docs/en/about-claude/models/migration-guide](https://platform.claude.com/docs/en/about-claude/models/migration-guide).
- Layer 3 (Session Hygiene), Layer 5 (Output Engineering), Layer 8 (Agent Design), Layer 10 (Production Architecture) in this course.
