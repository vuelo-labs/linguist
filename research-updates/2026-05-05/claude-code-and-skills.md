# Claude Code & Skills Ecosystem Updates

Research date: **2026-05-05**

Note on dates: GitHub release timestamps (e.g. "May 4, 2024") returned by automated fetches reflect a year-rendering quirk. The version numbers (v2.1.114 → v2.1.128) and release cadence place these in **April–May 2026**. Day/month are accurate; year corrected to 2026 below to match current date.

---

## 1. Claude Code CLI — Recent Releases

Source: [anthropics/claude-code releases](https://github.com/anthropics/claude-code/releases) and [CHANGELOG.md](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md).

### v2.1.128 — May 4, 2026
- Bare `/color` (no args) picks a random session color.
- `/mcp` now shows tool count for connected servers and flags zero-tool connections.
- `--plugin-dir` now accepts `.zip` plugin archives in addition to directories.
- `--channels` works with console (API key) auth; managed-settings orgs must opt in via `channelsEnabled: true`.
- `/model` picker collapses duplicate Opus 4.7 entries; current Opus shows as just "Opus".
- Subprocesses (Bash, hooks, MCP, LSP) no longer inherit `OTEL_*` env vars (prevents OTEL endpoint leakage from CLI into instrumented child apps).
- `workspace` is now a reserved MCP server name.
- MCP reconnects no longer flood the conversation with full tool lists; re-announces are summarized by server prefix.
- SDK hosts get a persistent `localSettings` suggestion for Bash permission prompts; "Always allow" writes to `.claude/settings.local.json`.
- `EnterWorktree` now creates branches from local HEAD (was `origin/<default>`), preserving unpushed commits.
- Auto mode classifier failures now include actionable hint (retry / `/compact` / `--debug`).
- Sub-agent progress summaries now use prompt cache (~3× `cache_creation` reduction).
- Many fixes: parallel Bash sibling cancellation, vim NORMAL-mode space, OSC 9;4 progress flicker, MCP stdio arg corruption with `CLAUDE_CODE_SHELL_PREFIX`, 1M-context autocompact false-positive, `/plugin update` for npm plugins, and more.

### v2.1.126 — May 1, 2026
- `/model` picker pulls models from gateway `/v1/models` when `ANTHROPIC_BASE_URL` points at an Anthropic-compatible gateway.
- New `claude project purge [path]` deletes all Claude Code state for a project (transcripts, tasks, file history, config); supports `--dry-run`, `-y`, `-i`, `--all`.
- `--dangerously-skip-permissions` now bypasses prompts for writes to `.claude/`, `.git/`, `.vscode/`, shell config files (catastrophic-removal safety net remains).
- `claude auth login` supports OAuth code paste for terminal-only environments (WSL2, SSH, containers).
- `claude_code.skill_activated` OTEL event now fires for user-typed slash commands and adds `invocation_trigger` attribute (`user-slash` | `claude-proactive` | `nested-skill`).
- Auto mode spinner turns red when permission check stalls.
- Windows: PowerShell 7 detected via Microsoft Store / MSI / .NET global tool; PowerShell prioritized over Bash when its tool is enabled.
- Read tool: per-file malware-assessment reminder removed.
- **Security:** Fixed `allowManagedDomainsOnly`/`allowManagedReadPathsOnly` ignored when higher-priority managed-settings source lacked a `sandbox` block.
- Image paste >2000px auto-downscales (was breaking sessions).
- Many OAuth/refresh-token race fixes; deferred tools (WebSearch/WebFetch) now available to skills with `context: fork` on first turn.

### v2.1.123 — Apr 29, 2026
- Fixed OAuth 401 retry loop with `CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS=1`.

### v2.1.122 — Apr 28, 2026
- `ANTHROPIC_BEDROCK_SERVICE_TIER` env var for Bedrock tier selection.
- `/resume` accepts PR URLs (GitHub, GitLab, Bitbucket).
- `/mcp` shows claude.ai connectors hidden by manual duplicates.
- Image max size capped at 2000px (down from 2576px).

### v2.1.121 — Apr 28, 2026
- New `alwaysLoad` option for MCP servers (skips tool-search deferral).
- New `claude plugin prune` command for orphaned dependencies.
- Type-to-filter search in `/skills`.
- `PostToolUse` hooks can now replace tool output for **all** tools (previously limited).
- `CLAUDE_CODE_FORK_SUBAGENT=1` for SDK non-interactive sessions.

### v2.1.119 — Apr 23, 2026
- `/config` settings persist to `~/.claude/settings.json`.
- New `prUrlTemplate` setting for custom code-review URLs.
- `CLAUDE_CODE_HIDE_CWD` env var to hide working directory.
- `--from-pr` accepts GitLab/Bitbucket URLs.
- `--print` mode honors agent tool settings.
- Hooks now include `duration_ms` for tool execution time.

### v2.1.118 — Apr 23, 2026
- **Vim visual mode** (`v`) and visual-line (`V`).
- `/cost` and `/stats` merged into unified `/usage`.
- Custom theme creation/management in `/theme`.
- **MCP hooks via `type: "mcp_tool"`** — hooks can now target MCP tools directly.
- `DISABLE_UPDATES` env var.
- WSL inheritance of Windows-side managed settings.

### v2.1.117 — Apr 22, 2026
- `CLAUDE_CODE_FORK_SUBAGENT=1` enables forked subagents on external builds.
- Agent frontmatter `mcpServers` loading (subagents can declare per-agent MCP servers).
- Faster MCP startup with concurrent connections.
- Plugin dependency auto-installation.
- **Advisor Tool** experimental feature with startup notification.

### v2.1.116 — Apr 20, 2026
- 67% faster `/resume` on large (40MB+) sessions.
- Smoother fullscreen scrolling in VS Code, Cursor, Windsurf.
- Inline thinking progress indicators.
- `/doctor` openable while Claude responds.

---

## 2. Skills System

Source: [docs.claude.com/docs/en/skills](https://code.claude.com/docs/en/overview), [anthropics/skills repo](https://github.com/anthropics/skills).

### Authoring Skills
A skill is a folder containing a `SKILL.md` with YAML frontmatter:
```yaml
---
name: my-skill-name
description: Clear description of what this skill does and when to invoke it
---
```
The body is the instructions Claude follows when the skill activates. The `description` is what the model uses for proactive activation.

### Built-in / Anthropic-published Skills
The official [anthropics/skills](https://github.com/anthropics/skills) repo (128k stars, 15.1k forks as of May 2026) ships:

**Document Skills (production-grade, source-available):**
- `skills/docx` — Word docs
- `skills/pdf` — PDF generation/editing
- `skills/pptx` — PowerPoint
- `skills/xlsx` — Excel

Install in CLI: `/plugin install document-skills@anthropic-agent-skills`.

**Categories:** Creative & Design, Development & Technical, Enterprise & Communication, Document Skills.

**Spec:** Standard at [agentskills.io](http://agentskills.io); template lives in `./template`; plugin config in `./.claude-plugin`.

### Surface availability
- **Claude Code:** via plugin install.
- **Claude.ai:** paid plans; upload custom skills via settings.
- **Claude API:** [Skills API guide](https://docs.claude.com/en/api/skills-guide).

### Activation telemetry (v2.1.126)
`claude_code.skill_activated` OTEL event with `invocation_trigger` distinguishing user-slash vs proactive vs nested triggers — useful for understanding which skills the model picks autonomously.

### Skill-relevant CLI features
- `/skills` — type-to-filter (v2.1.121).
- Skills with `context: fork` get deferred tools (WebSearch, WebFetch) on first turn (fix in v2.1.126).

---

## 3. Plugins & Marketplace

Source: [plugins/README.md](https://github.com/anthropics/claude-code/blob/main/plugins/README.md).

### Official plugins shipped in `anthropics/claude-code/plugins/`

| Plugin | Purpose |
|--------|---------|
| `agent-sdk-dev` | Claude Agent SDK dev kit; `/new-sdk-app` interactive setup |
| `claude-opus-4-5-migration` | Auto-migrate code/prompts from Sonnet 4.x and Opus 4.1 → Opus 4.5 (model strings, beta headers, prompts) |
| `code-review` | `/code-review`; 5 parallel agents (compliance, bugs, context, history, comments) |
| `commit-commands` | `/commit`, `/commit-push-pr`, `/clean_gone` |
| `explanatory-output-style` | SessionStart hook injecting educational context |
| `feature-dev` | `/feature-dev`; 7-phase feature workflow with exploration, architecture, review agents |
| `frontend-design` | `frontend-design` skill for non-generic UI guidance |
| `hookify` | Build custom hooks: `/hookify`, `/hookify:list`, `/hookify:configure`, `/hookify:help` |
| `learning-output-style` | Interactive learning mode requesting code contributions at decision points |
| `plugin-dev` | Plugin development toolkit; `/plugin-dev:create-plugin`; 7 expert skills + 3 agents |
| `pr-review-toolkit` | `/pr-review-toolkit:review-pr`; 6 specialized review agents |
| `ralph-wiggum` | Self-referential AI loops; `/ralph-loop`, `/cancel-ralph` |
| `security-guidance` | PreToolUse hook monitoring 9 security patterns |

### Plugin system features (recent)
- `--plugin-dir` accepts `.zip` archives (v2.1.128).
- `claude plugin prune` removes orphaned deps (v2.1.121).
- Auto-install missing plugin dependencies (v2.1.116/117).
- `/plugin update` correctly detects new npm-sourced plugin versions (v2.1.128).
- Managed-settings enforcement on plugin operations (v2.1.117).
- Plugin error reporting in headless `--output-format stream-json` `init.plugin_errors` (v2.1.128).

---

## 4. Hooks

- **`PostToolUse` can replace tool output for all tools** (v2.1.121).
- **`type: "mcp_tool"` hooks** target MCP tools directly (v2.1.118).
- **`duration_ms`** field added to hook payloads (v2.1.119).
- **SessionStart hooks** widely adopted by official plugins (e.g. `explanatory-output-style`, `learning-output-style`).
- **PreToolUse pattern monitoring** showcased by `security-guidance` plugin (9 patterns).
- Authoring scaffolded by the `hookify` plugin (`/hookify`, `/hookify:configure`, etc.).

Reference: [docs.claude.com hooks](https://code.claude.com/docs/en/hooks).

---

## 5. Slash Commands

- `/usage` — replaces merged `/cost` + `/stats` (v2.1.118).
- `/skills` — searchable with type-to-filter (v2.1.121).
- `/color` (bare) — random session color (v2.1.128).
- `/model` — gateway model listing via `/v1/models` (v2.1.126); collapsed Opus duplicates (v2.1.128).
- `/mcp` — tool counts and zero-tool flagging (v2.1.128).
- `/config` — persists to `~/.claude/settings.json`; searchable by value (v2.1.116/119).
- `/theme` — custom theme creation (v2.1.118).
- `/plugin`, `/doctor`, `/resume` (with PR URLs), `claude project purge`, `claude plugin prune` — see release notes above.
- `/desktop`, `/schedule`, `/loop` — surface handoff and scheduled execution.

---

## 6. MCP Servers

- New `alwaysLoad` option (v2.1.121) — skip tool-search deferral, server's tools always pre-loaded.
- Concurrent MCP connection startup (v2.1.117).
- Per-subagent MCP servers via agent frontmatter `mcpServers` (v2.1.117).
- Reserved server name: `workspace` (v2.1.128).
- Reconnect tool-list summarization (v2.1.128).
- claude.ai connectors: no longer suppressed by needs-auth manual duplicates (v2.1.126); shown when hidden by manual duplicates (v2.1.122).
- MCP stdio arg corruption fix when `CLAUDE_CODE_SHELL_PREFIX` is set with shell metachars in args (v2.1.128).
- MCP tool-result image preservation when server returns both structured content and content blocks (v2.1.128).

---

## 7. Subagents / Agent Teams

- `CLAUDE_CODE_FORK_SUBAGENT=1` activates forked subagents on external builds and SDK non-interactive (v2.1.117/121).
- Agent frontmatter supports `mcpServers` declarations (v2.1.117).
- Sub-agent progress summaries now share prompt cache (~3× cache_creation reduction); summaries no longer re-fire on idle subagents (v2.1.128).
- Permission dialog crash fix for "agent team teammates" (v2.1.114) — implies team-of-agents UI surface.
- `/code-review` and `/pr-review-toolkit` ship as built-in plugins running 5–6 parallel specialized agents.

Reference: [docs.claude.com sub-agents](https://code.claude.com/docs/en/sub-agents).

---

## 8. IDE & Surface Integrations

Per [code.claude.com/docs/en/overview](https://code.claude.com/docs/en/overview):

- **VS Code / Cursor extension** — inline diffs, @-mentions, plan review, history. Install: `code --install-extension anthropic.claude-code` or [marketplace](https://marketplace.visualstudio.com/items?itemName=anthropic.claude-code).
- **JetBrains plugin (beta)** — IntelliJ, PyCharm, WebStorm; interactive diff viewer, selection context. [Marketplace](https://plugins.jetbrains.com/plugin/27310-claude-code-beta-).
- **Desktop app** — macOS (Intel + Apple Silicon), Windows x64, Windows ARM64. Visual diffs, parallel sessions, `/desktop` handoff from terminal.
- **Web** — [claude.ai/code](https://claude.ai/code); long-running tasks, parallel runs, no local setup; iOS app integration.
- **Remote Control** — continue local session from phone/browser.
- **Channels** — push events from Telegram, Discord, iMessage, custom webhooks into a session (`--channels` works with console API-key auth as of v2.1.128).
- **Slack** — `@Claude` in Slack to route bug reports → PRs.
- **Chrome** — debug live web applications.
- **GitHub Actions / GitLab CI/CD** — automated PR review, issue triage; "GitHub Code Review" auto-review on every PR.
- **Routines** — recurring tasks on Anthropic-managed infra (cron/API/GitHub triggers); created via `/schedule` or web/desktop.
- **Desktop scheduled tasks** — local-machine recurring runs.
- `/loop` — in-session repeating prompt for polling.
- **Dispatch** — message tasks from phone, opens Desktop session.

---

## 9. Settings

- `/config` persists to `~/.claude/settings.json` (v2.1.119).
- New settings: `prUrlTemplate`, `channelsEnabled` (managed-settings orgs).
- Env vars: `CLAUDE_CODE_HIDE_CWD`, `DISABLE_UPDATES`, `ANTHROPIC_BEDROCK_SERVICE_TIER`, `ANTHROPIC_BASE_URL` (gateway), `CLAUDE_CODE_FORK_SUBAGENT`, `CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS`, `CLAUDE_CODE_SHELL_PREFIX`, `CLAUDE_CODE_PROVIDER_MANAGED_BY_HOST`.
- Permission tiers: `allowManagedDomainsOnly`, `allowManagedReadPathsOnly` (security fix in v2.1.126 for inheritance through managed-settings sources).
- "Always allow" Bash permissions auto-write to `.claude/settings.local.json` for SDK hosts (v2.1.128).
- WSL inherits Windows-side managed settings (v2.1.118).

---

## 10. Providers / Backends

- Anthropic, Amazon Bedrock, Microsoft Foundry, Google Vertex AI all first-class.
- `ANTHROPIC_BASE_URL` enables Anthropic-compatible gateways with model listing.
- Bedrock: per-region model prefix fixes (v2.1.128); service tier env var (v2.1.122).

---

## 11. Installation Methods (current)

- macOS/Linux/WSL: `curl -fsSL https://claude.ai/install.sh | bash`
- Windows PowerShell: `irm https://claude.ai/install.ps1 | iex`
- Windows CMD: `curl -fsSL https://claude.ai/install.cmd -o install.cmd && install.cmd`
- Homebrew: `brew install --cask claude-code` (or `claude-code@latest`)
- WinGet: `winget install Anthropic.ClaudeCode`
- Linux package managers: apt / dnf / apk
- npm (deprecated): `npm install -g @anthropic-ai/claude-code`

Native installations auto-update; Homebrew/WinGet do not.

---

## 12. Notable Third-Party / Community

- The `anthropics/skills` repo (128k stars, 15.1k forks) accepts community contributions and acts as the de-facto skills marketplace; install bundles include `document-skills` and `example-skills`.
- The `anthropics/claude-code` repo (121k stars, 20k forks) is where official plugins live (see §3).
- `agentskills.io` — open spec for cross-vendor skill portability.
- `hookify` and `plugin-dev` first-party plugins lower the bar for community plugin authoring.
- Community Discord: [anthropic.com/discord](https://anthropic.com/discord).

---

## Sources

- [anthropics/claude-code releases](https://github.com/anthropics/claude-code/releases) — accessed 2026-05-05
- [anthropics/claude-code CHANGELOG.md](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md) — accessed 2026-05-05
- [anthropics/claude-code plugins/README.md](https://github.com/anthropics/claude-code/blob/main/plugins/README.md) — accessed 2026-05-05
- [anthropics/skills repo](https://github.com/anthropics/skills) — accessed 2026-05-05
- [Claude Code overview docs](https://code.claude.com/docs/en/overview) — accessed 2026-05-05
- [Skills API guide](https://docs.claude.com/en/api/skills-guide)
- [VS Code extension](https://marketplace.visualstudio.com/items?itemName=anthropic.claude-code)
- [JetBrains plugin (beta)](https://plugins.jetbrains.com/plugin/27310-claude-code-beta-)
- [agentskills.io](http://agentskills.io)

> WebSearch and direct fetches against `docs.anthropic.com` and `anthropic.com/news` were unavailable in this research session; sourcing relied on github.com, raw GitHub content, and `code.claude.com`. Coverage of marketing-blog-only announcements (e.g. items only posted at anthropic.com/news) is therefore incomplete.
