# Wave-4 A — claude-code-best-practices.md summary

Edited `/Users/liam/Projects/vuelo-labs/linguist/course/claude-code-best-practices.md` per Plan §2 and audit lines 96–102.

## Changes
- **Frontmatter.** Added `course-revision: 2026-05-05`. Replaced the "internal Claude Code system prompts" header line with a provenance hedge that anchors on externally-observable v2.1.x surfaces (CC-1 alignment).
- **F-CCBP-3 — §7.** Appended Compaction-API option (Feb 2026 beta on Opus 4.6), `/compact`, and `/usage` (replacing `/cost` + `/stats` in v2.1.118). Cross-ref to L4's decision tree.
- **F-CCBP-4 — §8.** Reframed around frontmatter subagents with `tools` allowlist + per-agent `mcpServers` (v2.1.117), prompt-cache sharing (v2.1.128). Cross-ref to L9 for Managed Agents.
- **F-CCBP-2 — §11.** Rewrote as a layered system: in-prompt nudge, auto mode (with v2.1.126 spinner-stall behaviour), `--dangerously-skip-permissions` v2.1.126 expanded scope, settings.json + managed-settings allowlists (`allowManagedDomainsOnly`, `allowManagedReadPathsOnly`).
- **F-CCBP-1 — new §13.** "Skills, Plugins, Hooks, MCP — pick the right primitive": four-mechanism decision shape with cross-ref to L7.
- **New §14.** "Plugins to install on day one": `code-review`, `pr-review-toolkit`, `hookify`, `plugin-dev`, `security-guidance`, plus `feature-dev` and `commit-commands` as honourable mentions.

Voice matched against post-Wave-3 L1, L7, L9, L10. Date stamps applied to v2.1.x and beta features. No other sections altered.
