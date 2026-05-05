---
course-revision: 2026-05-05
---

# Claude Code — Best Practices

Grounded in Claude Code's published system-prompt behaviour and the v2.1.x harness surface (Skills, Plugins, Hooks, MCP, auto mode, managed settings). Internal symbol citations elsewhere in the course are corroborated by reverse-engineering write-ups; treat the externally-observable surfaces below — slash commands, settings files, plugin names, beta headers — as the durable anchors.

---

## 1. Be specific about scope before work starts

Claude is explicitly instructed *not* to add features, refactor surrounding code, or make improvements beyond what was asked. A vague request invites drift. A scoped request gets exactly what you asked for.

**Instead of:** "Clean up the auth module"
**Say:** "Extract the token validation logic from `auth.ts` into its own function — don't change the interface or anything else"

The verb carries most of the scope signal:
- `fix` → change the minimum to resolve the issue
- `refactor` → restructure without changing behaviour
- `add` → new capability, don't modify existing
- `explain` → read-only, no changes

Constraints work best before the task, not after. Corrections mid-task are expensive — they add turns, require rework, and have to survive context summarisation.

---

## 2. Use CLAUDE.md for anything you'd repeat

Claude loads `CLAUDE.md` files at session start, before your first message. Content there is cached — it doesn't cost you per-turn. Anything you find yourself saying repeatedly ("we use Bun not Node", "don't add type annotations to files you didn't change", "always run tests before marking done") belongs in CLAUDE.md, not the chat.

Putting standing instructions in chat means they're re-processed every turn and degraded through summarisation over long sessions.

---

## 3. Keep sessions short and single-purpose

Context summarisation (compaction) is lossy. The longer a session runs across multiple unrelated tasks, the more the summary degrades. A session that drifts through 5 problems produces a diluted context that the next task runs on.

**Rule of thumb:** if you can't summarise the session in one sentence, it's too broad.

Use `/clear` aggressively between unrelated tasks. Context from a previous problem is dead weight — it gets re-tokenised every turn and complicates summarisation.

---

## 4. Don't paste large files — reference them

When you paste code into the chat it enters the conversation history and gets re-processed on every subsequent turn. Claude has file-reading tools precisely to avoid this.

**Instead of:** pasting 200 lines of code
**Say:** "Read `src/auth.ts` and..."

The model reads it once, retains what's needed, and the raw content doesn't persist in the message history.

---

## 5. Understand what survives summarisation — and what doesn't

When a session fills up, Claude summarises the conversation to continue. What it's explicitly designed to preserve:

- Your exact requests (verbatim)
- File names, function signatures, and code snippets
- Errors encountered and how they were fixed
- Feedback you gave — especially corrections ("do it this way instead")
- What was being worked on immediately before summarisation

What degrades most:
- Implicit context ("you know what I meant")
- Reasoning chains and intermediate steps
- Raw tool output (file reads, bash results)

**Practical implication:** say the thing explicitly. The model is anchored to your literal words through summarisation. Loose phrasing, pronouns, and "fix that" accumulate as drift.

---

## 6. Give tasks a clear stopping condition

Without a natural completion boundary, Claude has to invent one. Open-ended prompts ("keep improving this until it's good") are expensive and unpredictable.

Include an explicit done-state:
- "until all tests pass"
- "for these 3 functions only, then stop"
- "one pass through the file, don't loop"

---

## 7. Checkpoint on long tasks

Midway through a long session, ask: *"summarise what's been done and what's left."*

This forces a clean context consolidation on your terms, before the system does it automatically. The next steps will be cleaner and you'll catch any drift in task interpretation before it compounds.

If you see a compaction notice, read the summary. If it missed something important, correct it in that turn before the next task starts. Errors in the summary become the model's ground truth for the rest of the session.

For long-running headless or SDK sessions, the **Compaction API** (Feb 2026 beta on Opus 4.6, beta header required) moves this work server-side: the API decides when and how to compact and returns the new working state, so you don't lose a turn writing the checkpoint prompt. In an interactive Claude Code session, `/compact` triggers the same behaviour on demand, and `/usage` (which replaced `/cost` and `/stats` in v2.1.118) tells you how close you are to the next automatic boundary. Layer 4 covers the decision tree — manual checkpoint vs `/compact` vs Compaction API vs Memory vs forked-skill context — in detail.

---

## 8. Use subagents for research and exploration

Subagent tool results — grep output, file reads, bash results — run in a separate context window and don't land in your main session. You get a summary back, not hundreds of lines of raw output.

If a task has two phases — *find out X*, then *do Y* — delegate the first phase:

**Instead of:** "Search the codebase for all places X is used, then refactor them all"
**Say:** "Use an agent to find all usages of X across the codebase, then we'll refactor"

This keeps your main context clean for the actual work.

In v2.1.x, subagents are configured rather than improvised. A frontmatter agent file declares a `name`, `description`, optional `tools` allowlist, and (since v2.1.117) a per-agent `mcpServers` block — so a research subagent can mount, say, only your read-only docs server while the main session keeps its full tool surface. Sub-agent progress summaries share the prompt cache as of v2.1.128 (~3× `cache_creation` reduction), so spinning up several short-lived research agents is cheaper than it used to be. For long-horizon work that needs to outlive the CLI session — Memory-backed state, hosted execution, audit logs — reach for **Managed Agents** instead; Layer 9 covers the substrate choice (in-CLI subagent vs Managed Agent vs Advisor pairing).

---

## 9. The model responds to your verbosity signal

Claude is instructed to be brief and direct by default — lead with the answer, skip preamble, don't restate what you said. If you write terse prompts, you get terse answers.

If you want reasoning, explanation, or walkthrough — ask for it explicitly. The model won't volunteer it unless prompted.

Conversely, if you're getting overly long responses, shorter and more direct prompts will naturally pull responses tighter.

---

## 10. Corrections are expensive — restate, don't patch

When the model misunderstands, the instinct is to add a correction on top: "no, I meant X not Y." But corrections layer onto existing misunderstandings and both versions have to survive summarisation.

It's cleaner to restate the whole request from scratch when direction changes significantly. Treat it as a new prompt, not an amendment.

---

## 11. Permissions are a layered system, not a vibe

Claude is designed to pause and confirm before irreversible or high-blast-radius actions (deleting files, pushing code, modifying shared infrastructure). The 2026 surface gives you three places to control that, with very different blast radii:

- **In-prompt nudge.** *"Proceed without checking in, I'll review the diff at the end."* One-time only — approving an action once doesn't approve it in all contexts.
- **Auto mode.** Started from the launcher or `/auto`, lets the model run without per-tool prompts within the permission scope you've configured. The classifier decides when to stop and ask; if it stalls, the spinner turns red (v2.1.126) and the failure message includes a hint (retry / `/compact` / `--debug`). Use it when you trust the scope, not when you want unconditional autonomy.
- **`--dangerously-skip-permissions`.** As of v2.1.126 this flag also bypasses prompts for writes to `.claude/`, `.git/`, `.vscode/`, and shell config files; the catastrophic-removal safety net stays on. Treat it the way you'd treat `rm -rf` — useful in scripted contexts you control end-to-end, hostile in shared ones.

For standing scope, work in **settings**, not CLAUDE.md: `/config` writes to `~/.claude/settings.json` (v2.1.119), and "Always allow" decisions on Bash permissions persist to `.claude/settings.local.json` (v2.1.128 for SDK hosts). Org-level guarantees use managed-settings allowlists — `allowManagedDomainsOnly` and `allowManagedReadPathsOnly` — which inherit through the managed-settings hierarchy (a v2.1.126 fix closed a bypass when a higher-priority source omitted the `sandbox` block). CLAUDE.md is still where standing *behavioural* preferences belong (*"always run tests before marking done"*); permissions belong in settings, where they can be audited and centrally administered.

---

## 12. Reference files by path, not description

Vague references require the model to search before it can act — burning turns and context on orientation. Precise references let it go straight to work.

**Instead of:** "that config file we were looking at earlier"
**Say:** "`config/database.ts`"

The same applies to functions, errors, and test names. The more specific the reference, the less inference required.

---

## 13. Skills, Plugins, Hooks, MCP — pick the right primitive

Most "how do I make Claude Code always do X" questions resolve to one of four mechanisms, and reaching for the wrong one is a common waste. Layer 7 covers each in depth; the decision shape is:

- **Skill.** A `SKILL.md` folder the model pulls into context when its `description` matches the task (proactive activation), or that you invoke via `/skills` (type-to-filter as of v2.1.121). Use it for *knowledge the model should reach for when relevant* — domain workflows, file-format expertise, project conventions that don't apply to every turn. Skills with `context: fork` get deferred tools (WebSearch/WebFetch) on the first turn (v2.1.126).
- **Plugin.** A bundle of skills, slash commands, agents, hooks, and MCP servers shipped as one installable unit. Use it to distribute a coherent capability across a team. Official plugins live in `anthropics/claude-code/plugins/`.
- **Hook.** A shell command or MCP tool call the harness fires on a defined event (`PreToolUse`, `PostToolUse`, `SessionStart`, `mcp_tool`). Deterministic; runs every time. Use it for *what the harness should do around model actions, regardless of what the model decides* — formatting, logging, security gates. `PostToolUse` can replace tool output for all tools (v2.1.121); hook payloads include `duration_ms` (v2.1.119).
- **MCP server.** External tools the model can call. The `alwaysLoad` option (v2.1.121) skips tool-search deferral for servers whose tools should be in the foreground; `/mcp` shows tool counts and flags zero-tool connections (v2.1.128).

Rule of thumb: Skill is *what the model knows*, Plugin is *what's installed*, Hook is *what the harness does around the model*, MCP is *what the model can act on*. Different layers, different lifetimes, different audit profiles.

---

## 14. Plugins to install on day one

The first-party plugins in `anthropics/claude-code/plugins/` (as of 2026-05-05) cover most workflows you'd otherwise hand-build. The five worth installing immediately:

- **`code-review`.** `/code-review` runs five parallel agents (compliance, bugs, context, history, comments). Cheaper than a single deep pass because the agents share prompt cache (v2.1.128) and produce structured findings rather than prose.
- **`pr-review-toolkit`.** `/pr-review-toolkit:review-pr` runs six specialised review agents over a PR URL. Pairs with `/resume` accepting PR URLs (v2.1.122) for easy hand-off.
- **`hookify`.** `/hookify`, `/hookify:list`, `/hookify:configure`, `/hookify:help` — scaffolding for authoring your own hooks without hand-writing the JSON. Shortest path from "I want this to happen every time X" to a working hook.
- **`plugin-dev`.** Plugin development toolkit with seven expert skills and three agents; `/plugin-dev:create-plugin`. Use it the moment you find yourself wanting to share a workflow across machines or teammates.
- **`security-guidance`.** PreToolUse hook monitoring nine security patterns. The least intrusive plugin on this list — it just sits in front of tool calls and flags risky shapes.

Two more worth knowing about: `feature-dev` (a seven-phase feature workflow if you want a structured pipeline rather than ad-hoc prompting) and `commit-commands` (`/commit`, `/commit-push-pr`, `/clean_gone`).

Install via `/plugin install <name>`; managed-settings orgs can require allowlisted plugin sources. `claude plugin prune` (v2.1.121) cleans up orphaned dependencies; `--plugin-dir` accepts `.zip` archives as of v2.1.128 for air-gapped distribution.
