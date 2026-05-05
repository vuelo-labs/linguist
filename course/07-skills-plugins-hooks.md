---
course-revision: 2026-05-05
---

# Layer 7 — Skills, Plugins, and Hooks

This module sits between tool fluency (L6) and agent design (L8). L6 teaches you to read a request and pick the right tool from what's already loaded. L8 teaches you to design longer-horizon agents that decompose work across substrates. The layer between is about *extending* the harness: adding new instructions the model picks up on its own (Skills), bundling those plus commands and configuration into installable units (Plugins), and inserting deterministic side-effects around tool calls (Hooks). Each is a different mechanism with a different lifetime and a different activation surface, and most "how do I make Claude Code always X" questions resolve to one of the three. The wrong choice produces a Skill that should have been a Hook, or a Hook that should have been a Subagent.

---

## The three primitives at a glance

| Primitive | Mechanism | Lifetime | Activation surface |
|-----------|-----------|----------|--------------------|
| **Skill** | Markdown instructions (`SKILL.md`) the model reads when it decides the skill is relevant | Per-activation; lives in (or forks from) the conversation context | Model-driven via `description` field, or user-driven via `/skills` |
| **Plugin** | Bundle of skills, slash commands, agents, hooks, and MCP servers shipped as one unit | Installed at the user/project level; persists across sessions | Whatever its components activate on (skill descriptions, slash names, hook events, etc.) |
| **Hook** | Harness-executed shell command or MCP tool call fired on a defined event | Per-event, deterministic, runs every time the event fires | Event-driven by the harness (`PreToolUse`, `PostToolUse`, `SessionStart`, `mcp_tool`, …) |

Three different layers of the system are doing the work. Skills change *what the model knows when relevant*. Plugins change *what's installed*. Hooks change *what the harness does around model actions*, regardless of what the model decides.

---

## Skills

A skill is a folder containing a `SKILL.md` file with YAML frontmatter and a body. Frontmatter:

```yaml
---
name: my-skill-name
description: Clear description of what this skill does and when to invoke it
---
```

The body is plain markdown — instructions the model follows when the skill activates. The `description` field is doing more work than it looks: it's what the model uses to decide *on its own* whether to pull the skill into context. A vague description means the skill won't proactively activate. A concrete one ("use when the user asks to generate or edit `.docx` files; produces Word documents via the docx library") means the model recognises the trigger and reaches for the skill without being told.

**Activation paths.** Three ways a skill enters context:

1. **Proactive.** The model reads the available skill descriptions and decides one is relevant.
2. **User-typed.** The user invokes `/skills` (type-to-filter as of v2.1.121, 2026-05-05) and selects one.
3. **Nested.** A running skill invokes another skill.

The `claude_code.skill_activated` OTEL event distinguishes these via the `invocation_trigger` attribute (`user-slash` | `claude-proactive` | `nested-skill`), added in v2.1.126 (2026-05-05). If you're operating skills at scale this is the field to watch — it tells you which skills the model picks autonomously vs. which only fire when a human asks for them.

**`context: fork` semantics.** A skill can declare `context: fork` in its frontmatter. When it activates, it runs in a fresh sub-context rather than appending to the parent conversation. Two consequences:

- Deferred tools (`WebSearch`, `WebFetch`) become available on first turn (fix shipped in v2.1.126, 2026-05-05). In an unforked context they're deferred behind a search step.
- The skill's intermediate work doesn't pollute the parent thread. Only what the skill returns flows back.

Use `context: fork` when the sub-task is conceptually distinct enough that its working memory shouldn't survive into the main thread — research sweeps, document generation, anything that produces lots of intermediate tool output.

**The `anthropics/skills` repo.** [github.com/anthropics/skills](https://github.com/anthropics/skills) (128k stars, 15.1k forks as of 2026-05-05) is the de-facto skills marketplace. The production-grade `document-skills` bundle ships `docx`, `pdf`, `pptx`, and `xlsx` skills — install with `/plugin install document-skills@anthropic-agent-skills`. The repo also hosts `example-skills` and the `template/` directory for new authoring. Cross-vendor portability is specified at [agentskills.io](http://agentskills.io).

**When a Skill is the right primitive.** When the behaviour you want is *instructions the model should follow when it recognises the situation*. Skills are model-driven and proactive. They don't run unless the model decides to engage them (or the user picks one). They can't enforce — only inform.

---

## Plugins

A plugin is a packaging format. It bundles any combination of skills, slash commands, subagents, hooks, MCP servers, and output styles into a single installable unit, with its own `.claude-plugin/` config directory. Plugins live in `anthropics/claude-code/plugins/` (the official set) or third-party marketplaces.

**The 13 first-party plugins** (as of v2.1.128, 2026-05-05; see [plugins/README.md](https://github.com/anthropics/claude-code/blob/main/plugins/README.md)):

| Plugin | What it ships |
|--------|---------------|
| `agent-sdk-dev` | `/new-sdk-app` interactive setup for Claude Agent SDK |
| `claude-opus-4-5-migration` | Auto-migrates code/prompts from Sonnet 4.x and Opus 4.1 to Opus 4.5 (model strings, beta headers, prompts) |
| `code-review` | `/code-review`; 5 parallel agents (compliance, bugs, context, history, comments) |
| `commit-commands` | `/commit`, `/commit-push-pr`, `/clean_gone` |
| `explanatory-output-style` | SessionStart hook injecting educational context |
| `feature-dev` | `/feature-dev`; 7-phase feature workflow with exploration, architecture, review agents |
| `frontend-design` | `frontend-design` skill for non-generic UI guidance |
| `hookify` | `/hookify`, `/hookify:list`, `/hookify:configure`, `/hookify:help` for authoring hooks |
| `learning-output-style` | Interactive learning mode requesting code contributions at decision points |
| `plugin-dev` | Plugin development toolkit; `/plugin-dev:create-plugin`; 7 expert skills + 3 agents |
| `pr-review-toolkit` | `/pr-review-toolkit:review-pr`; 6 specialized review agents |
| `ralph-wiggum` | `/ralph-loop`, `/cancel-ralph` for self-referential AI loops |
| `security-guidance` | PreToolUse hook monitoring 9 security patterns |

The pattern across that table: plugins are how Anthropic ships *cross-cutting* features that are themselves combinations of the other primitives. `code-review` is six parallel subagents plus a slash command. `security-guidance` is one PreToolUse hook plus its rule set. `hookify` is the meta-plugin for authoring hooks. The plugin layer doesn't introduce new model behaviour — it introduces *bundling*.

**Plugin system features (recent):**

- `--plugin-dir` accepts `.zip` archives in addition to directories (v2.1.128, 2026-05-05). You can ship a plugin as a single file.
- `claude plugin prune` removes orphaned dependencies (v2.1.121, 2026-05-05).
- Auto-install missing plugin dependencies (v2.1.116/117, 2026-05-05).
- `/plugin update` correctly detects new npm-sourced plugin versions (v2.1.128).
- Headless `--output-format stream-json` exposes `init.plugin_errors` for plugin loading failures (v2.1.128).

**When a Plugin is the right primitive.** When you want to *distribute* a coherent feature set — to your team, to your org, or publicly — rather than ship loose files. A single skill belongs in `~/.claude/skills/`. A skill plus the slash command that drives it plus the hook that captures its output belongs in a plugin.

---

## Hooks

Hooks are harness-executed side-effects, not model actions. The harness fires events at well-defined points in a session — before a tool call, after a tool call, when a session starts — and configured hooks run on those events. The model doesn't decide whether they fire. Configuration lives in `settings.json`.

**Hook events worth knowing:**

- `SessionStart` — fires once when a session opens. Used by `explanatory-output-style` and `learning-output-style` to inject framing into the system context.
- `PreToolUse` — fires before a tool call executes. Can block the call. Used by `security-guidance` to monitor 9 security patterns and refuse risky shell commands.
- `PostToolUse` — fires after a tool call returns. As of v2.1.121 (2026-05-05) it can replace tool output for *all* tools (previously limited to a subset). This is how you transform what the model sees from a Bash run, an MCP tool, or a Read.
- `type: "mcp_tool"` — added v2.1.118 (2026-05-05). Hooks can target MCP tools directly without matching by name pattern.

**Useful payload fields:**

- `duration_ms` — added v2.1.119 (2026-05-05). Tool execution time on the hook payload, so a `PostToolUse` hook can act on slow calls (log them, summarise them, warn).

**What hooks can do:**

- Run a shell command, capture stdout/stderr, optionally feed it back into the conversation.
- Block a tool call by exiting non-zero from `PreToolUse`.
- Replace what the model sees as the tool result via `PostToolUse`.
- Inject context at session start.

**What hooks can't do:**

- Reason. They run the same script every time. If you need a decision, the decision belongs in a skill or a subagent the hook *invokes*.
- Activate selectively based on conversational context. The matcher is event + tool name (or MCP type), not "what the user is trying to do".

**When a Hook is the right primitive.** When the behaviour must run *every time* a given event fires, regardless of what the model would have chosen. Linting on every file write. Refusing dangerous shell patterns. Feeding compile errors back into context. Hooks are deterministic by design; that's the whole point.

Authoring is scaffolded by the `hookify` first-party plugin (`/hookify`, `/hookify:configure`, `/hookify:list`, `/hookify:help`).

Reference: [docs.claude.com hooks](https://docs.claude.com/en/docs/claude-code/hooks).

---

## Decision tree: Skill vs Subagent vs Hook

The three are the most-confused trio in the 2026 Claude Code surface. They cover overlapping ground — all three can "make Claude do X in situation Y" — but they trade off differently on three axes: **who decides it runs**, **whether it can reason**, and **whether it costs context tokens**.

| | Decides it runs | Can reason | Costs main-context tokens |
|--|-----------------|-----------|---------------------------|
| **Skill** | Model (or user via `/skills`) | Yes (it's instructions for the model) | Yes, unless `context: fork` |
| **Subagent** | Model (delegated explicitly) | Yes (it's a separate model loop) | Summary returned to parent; intermediate work isolated |
| **Hook** | Harness (event-driven) | No — runs the same script every time | Only the captured output, if any, lands in context |

**Pick a Skill when:**

- The behaviour is *advisory* — instructions the model should *consider applying* when relevant.
- Recognising the situation is itself a model judgement (you can't write a regex for "the user is asking about Word docs").
- You want the option to user-invoke via `/skills` as well as let the model self-trigger.

**Pick a Subagent when:**

- The work is a sub-task that needs its own multi-turn loop (research, parallel review, exploration).
- You want the parent conversation to see only a summary, not the intermediate tool calls.
- You're delegating something heavy enough that prompt-cache sharing across sub-agents (~3× `cache_creation` reduction, v2.1.128) actually matters.

**Pick a Hook when:**

- The behaviour must run *every time* — no model judgement involved.
- It's defensive or instrumentation (block dangerous calls, log durations, lint on write).
- It needs to fire even if the model would never have asked for it.

The fast test: *"Does the model need to decide whether this runs?"* If yes, Skill or Subagent. If no, Hook.

---

## Worked example: ruff on Python edits

The task: when a Python file is edited, run `ruff check` on it and feed any warnings back into the conversation so the model can address them next turn.

**As a Skill.** You'd write a `SKILL.md` describing "when you've just edited a Python file, run ruff and surface warnings". The model reads the description, decides whether the situation matches, and *might* run it. Some turns it would; others it would forget — especially under context pressure. There's no enforcement.

**As a Subagent.** You'd define a `python-linter` subagent the model could delegate to after edits. Same problem: the parent loop has to remember to delegate. And you've introduced a multi-turn sub-loop for what is fundamentally a one-shot shell command. Wasted machinery.

**As a Hook.** A `PostToolUse` hook matched on `Edit`/`Write` for `*.py` paths, running `ruff check $FILE_PATH` and emitting any warnings as the replacement output. The harness fires it every time. The model sees the warnings the turn after the edit. No forgetting, no delegation overhead, deterministic. With `duration_ms` on the payload (v2.1.119, 2026-05-05) you also get free latency telemetry.

Conclusion: use a hook. The decision-test fired correctly — the model doesn't need to decide whether to lint after every Python edit; that's exactly what the harness should enforce. A skill is the wrong tool because skills are advisory; the failure mode of "the model forgot to run it" is unacceptable for a linter. A subagent is the wrong tool because there's no sub-loop to run.

The same rubric flips on a different task: *"summarise the changes in this PR"*. That one needs reasoning, parallel review, multi-turn exploration — Subagent (and exactly what the `pr-review-toolkit` plugin ships).

---

## How this composes with L6 and L8

L6 (Tool Fluency) gives you the cost hierarchy and taxonomy of tools available *right now* in a given session. This module sits one level up: the primitives that *change what's available* and *change what happens around tool calls*. A skill adds new instructions when the model needs them. A plugin adds skills, commands, agents, and hooks together. A hook wraps tool calls with deterministic behaviour the model doesn't choose.

L8 (Agent Design) goes one level further again — designing longer-horizon agents that span in-CLI subagents, hosted Managed Agents, and the Advisor pairing pattern. The decision tree in this module (Skill vs Subagent vs Hook) is this layer's version of the question L8 asks at agent scale: *what substrate does this work belong on?* Same shape of question, different altitude.

Cross-references:

- Skills as a context-management primitive (`context: fork` for clean working memory): see Layer 4.
- Plugins as a configuration-distribution mechanism (vs. CLAUDE.md and settings.json): see Layer 3.
- Subagent design depth (frontmatter, `mcpServers`, prompt-cache sharing, fork): see Layer 8.

Canonical references:

- [anthropics/claude-code releases](https://github.com/anthropics/claude-code/releases) — the changelog of record.
- [anthropics/skills](https://github.com/anthropics/skills) — the skills marketplace.
- [agentskills.io](http://agentskills.io) — the cross-vendor skill spec.
- [plugins/README.md](https://github.com/anthropics/claude-code/blob/main/plugins/README.md) — official plugin index.
- [docs.claude.com hooks](https://docs.claude.com/en/docs/claude-code/hooks) — hook reference.
