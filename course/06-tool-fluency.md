---
course-revision: 2026-05-05
---

# Layer 6 — Tool Fluency
## Skill 15

Tool fluency in 2026 is no longer just "pick the cheapest read". The Claude Code surface has grown a real *taxonomy* — built-in tools, MCP tools, Skills, deferred tools, sub-agents-as-tools, the Advisor pairing, computer use, the new code execution sandbox — and each kind has a different cost shape, latency profile, cache impact, permission surface, and restartability. Token cost is one axis; the others matter just as much when the call is on a long-horizon agent or a hot prompt-cache.

This layer is where you stop letting the model pick its own tool strategy and start directing it: which *kind* of tool, which specific tool, in what order, in what scope.

---

### Skill 15: Guiding Tool Use

**What it is:** Explicitly directing which tools to use, in what order, and with what scope — rather than letting the model choose its own tool strategy.

**Why it matters:** The model's tool selection is heuristic, not optimal. For a given task, it may launch a sub-agent when a targeted Grep would suffice, or use Bash for a file read when Read is cheaper and more reviewable, or reach for WebSearch from a skill context where it isn't actually available on the first turn. The model's system prompt explicitly tells it to prefer dedicated tools over Bash — but ordering, scoping, and *kind* selection within tool use is still left to the model's judgment. Guiding tool use lets you take control of token cost, latency, cache impact, permission surface, and auditability. The source instruction (verified against `constants/prompts.ts`, v2.1.128, 2026-05-05; structure verified, exact wording may have drifted): "Do NOT use Bash when a relevant dedicated tool is provided. Using dedicated tools allows the user to better understand and review your work."

**The 2026 tool taxonomy:**

| Kind | Examples | Cost shape | Latency | Cache impact | Permission surface | Restartability |
|------|----------|------------|---------|--------------|--------------------|----------------|
| Built-in | Read, Glob, Grep, Bash, WebFetch, WebSearch, computer use, code execution v2 | Cheap-to-moderate; tokens scale with output | Low (local) to moderate (web) | Stable list; safe for cache | Tool-level allow/deny; Bash + computer use are the broad ones | Idempotent for read tools; Bash side-effects can't be undone |
| MCP tool | Anything served by an MCP server (per-agent `mcpServers`, v2.1.117) | Depends on server; tool-list size affects every turn | Network round-trip per call | Use `alwaysLoad` on stable servers to keep the tool list cache-stable; reconnects auto-summarise (v2.1.128) | Server-scoped; reserved `workspace` namespace; managed-settings allowlists | Server-side state — depends on the server |
| Skill | Anything declared in `SKILL.md`; covered in detail in the **Skills/Plugins/Hooks** module (see `07-skills-plugins-hooks.md`) | Proactive activation pulls in a SKILL.md + optionally forks context | One-shot activation cost; cheap thereafter | Activation can shift the prompt prefix — design the skill once, then it's cache-friendly | Skill-scoped; `context: fork` exposes deferred tools (WebSearch/WebFetch) on first turn | Forked context is disposable; parent session unaffected |
| Deferred tool | WebSearch, WebFetch (and other tools that require fork to be available on first turn) | Same as built-in once available | Web latency | Tool-list shape depends on whether the deferred tool is currently surfaced | Same as built-in; availability gated by skill / context | Read-only; safe to retry |
| Advisor | The Advisor pairing (executor + advisor; beta header `advisor-tool-2026-03-01` as of 2026-05-05) | One advisor call per pairing decision; usually a strong model advising a fast one | Higher per-call (strong model) but bounds the total call count | Advisor calls are typically uncached — design accordingly | Advisor sees what the executor sees | Advisory output is just text; no side effects |
| Sub-agent-as-tool | Frontmatter agents, Task / forked sub-agents (`CLAUDE_CODE_FORK_SUBAGENT=1`); covered in the Agent Design module | Whole sub-conversation; output returns to parent | Highest — full agent loop | Sub-agent prompt-cache sharing ~3× reduction vs uncached, v2.1.128 | Per-agent `mcpServers` + tool allowlist | Forked sub-agents are restartable; their context discards on return |

Cost is still a hierarchy *within* the built-in row — Read < Glob < Grep < Bash < sub-agent — but across rows you're trading different things. A cheap MCP call can be more expensive than a sub-agent if its tool list churns the cache on every turn. A Skill activation costs nothing on the hot path but reshapes the prefix the first time it fires. An Advisor call is dear in raw tokens but can save a dozen wasted executor turns. Pick the *kind* first, then the specific tool.

**The default trap:** Without guidance, the model often reaches for a sub-agent or Bash when Read or Grep would suffice — or for WebSearch from a context where it isn't yet available. Naming the kind *and* the specific tool prevents this.

**The day-to-day controls** (verify with `claude --version` against v2.1.128, 2026-05-05):
- `/usage` — replaces `/cost` + `/stats` as of v2.1.118; the canonical token + cost view.
- `/skills` — list active skills and their activation triggers.
- `/mcp` — show connected MCP servers and tool count; quick way to spot a tool-list bloat.
- Hooks — `type: "mcp_tool"`, `PostToolUse` (replace), `duration_ms`, `SessionStart`, `PreToolUse` pattern monitoring; the harness-level intervention surface. Covered in detail in the **Skills/Plugins/Hooks** module.

---

**Example 1 — Coding (targeted investigation)**

*Scenario:* A developer wants to find all places in the codebase where a specific utility function (`debounce`) is called, to understand its usage before modifying it.

*WITHOUT:* The developer writes `find all uses of the debounce function`. The model might launch a sub-agent to do a codebase survey, or use Bash with a grep command, or use Glob followed by multiple Reads. The path is unpredictable and often more expensive than needed.

*WITH:*
```
Use the Grep tool (built-in, not a sub-agent) to find all files that import
or call `debounce` from src/utils/debounce.ts. Search pattern: "debounce" in
*.ts and *.tsx files.

For each file found, show me just the matching line and the file path.
Do not read the full files — just the grep results.
```

One Grep call. Bounded output. No downstream file reads unless the developer asks. No sub-agent overhead.

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

Explicit sequence. Conditional logic stated upfront. One Bash call per step. No sub-agent, no MCP server in the loop.

---

**Example 3 — Content/Research (deferred web tool with forked context)**

*Scenario:* A researcher needs to find the current CEO of three specific companies for a contact list, and wants the lookup to run in a clean sub-context so it doesn't pollute the main session's prompt cache.

*WITHOUT:* The researcher writes `find the CEOs of Figma, Linear, and Notion`. The model might hallucinate from training data, or call WebSearch from the main context (busting the cache for the rest of the session), or launch a sub-agent for each company. If the call is happening inside a skill that hasn't declared `context: fork`, WebSearch may not even be available on the first turn (v2.1.126 deferred-tool semantics, as of 2026-05-05).

*WITH:*
```
This research task should run in a forked context (skill with `context: fork`
in SKILL.md, or an explicitly forked sub-agent) so that WebSearch is available
as a deferred tool on the first turn and the main session prompt cache stays
clean.

Inside that forked context, call WebSearch three times — once per company —
with these specific queries:

1. "Figma CEO 2026"
2. "Linear CEO 2026"
3. "Notion CEO 2026"

For each: report the CEO name, the source URL, and whether the result is from
the company's own website or a third-party source. Mark third-party results
as "unverified".

Return only the three-row result table to the parent context. Do not bring
the raw WebSearch transcripts back.
```

Three bounded searches in a disposable context. Deferred-tool semantics handled explicitly. Output format specified. Source reliability signaled. Parent session's cache is untouched.

---

## Next: Layer 7 — Skills, Plugins, Hooks

The taxonomy above tells you which kind of tool to call. The next layer tells you how to *add* new kinds (Skills), how to bundle them for distribution (Plugins), and how to wrap any tool call with deterministic behaviour the model doesn't choose (Hooks). Same axes — mechanism, lifetime, activation surface — applied one level up the stack.

See `07-skills-plugins-hooks.md`.
