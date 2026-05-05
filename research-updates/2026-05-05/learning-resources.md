# Free Claude / Anthropic Learning Resources

Compiled 2026-05-05.

Note on methodology: WebSearch was unavailable in this environment, and several
target hosts (anthropic.com/learn, anthropic.skilljar.com, docs.claude.com,
deeplearning.ai) blocked WebFetch. Items below were verified directly via
WebFetch where possible (GitHub org, modelcontextprotocol.io, Claude Code docs);
other items are listed with their canonical URLs based on prior knowledge and
should be re-confirmed in-browser. Each entry notes verification status.

## Official Anthropic — GitHub (all free, MIT)

### anthropics/courses
- Provider: Anthropic
- Link: https://github.com/anthropics/courses
- Format: Jupyter notebook courses
- Covers (5 courses, recommended order):
  1. Anthropic API Fundamentals — API key, model params, multimodal prompts, streaming
  2. Prompt Engineering Interactive Tutorial
  3. Real World Prompting — applying techniques to complex prompts (also has a
     Google Vertex variant on the `vertex` branch)
  4. Prompt Evaluations — production eval writing
  5. Tool Use — implementing tool use end-to-end
- Default model: Claude 3 Haiku (to keep student costs low; substitutable)
- Freshness: repo last updated 2026-05-05 (verified)

### anthropics/prompt-eng-interactive-tutorial
- Provider: Anthropic
- Link: https://github.com/anthropics/prompt-eng-interactive-tutorial
- Format: 9-chapter interactive Jupyter tutorial + Example Playgrounds
- Covers: Beginner (basic structure, clarity, roles) → Intermediate (separating
  data/instructions, output formatting, step-by-step, examples) → Advanced
  (avoiding hallucinations, complex prompts: chatbot, legal, finance, coding) +
  Appendix (chaining, tool use, search/retrieval)
- Also available: AWS Workshop port, Google Sheets port (Claude for Sheets)
- Freshness: last updated 2026-05-05 (verified)

### anthropics/claude-cookbooks
- Provider: Anthropic
- Link: https://github.com/anthropics/claude-cookbooks
- Format: Jupyter notebook recipes
- Covers: Classification, RAG, summarization; tool use (calculators, SQL,
  customer service agents); third-party integrations (Pinecone, Wikipedia,
  Voyage AI embeddings, web scraping); multimodal (vision best practices,
  charts, forms, Stable Diffusion); advanced (sub-agents Haiku+Opus, PDF
  parsing, automated prompt evals, JSON mode, moderation, prompt caching)
- Freshness: last updated 2026-05-05; 42k stars (verified)

### anthropics/anthropic-quickstarts
- Provider: Anthropic
- Link: https://github.com/anthropics/anthropic-quickstarts
- Format: Reference applications (Python / TypeScript)
- Covers: Customer Support Agent, Financial Data Analyst, Computer Use Demo
  (uses `computer_use_20251124` tool version), Browser Tools API Demo
  (Playwright), Autonomous Coding Agent (Claude Agent SDK, two-agent
  initializer + coder pattern with git persistence), generic Agents folder
- Freshness: 16.5k stars; computer-use tool version dated 2025-11-24 indicates
  recent maintenance (verified)

### anthropics/claude-code
- Provider: Anthropic
- Link: https://github.com/anthropics/claude-code
- Format: CLI tool repo + issue tracker (docs live at code.claude.com/docs)
- Covers: Install, plugins (custom commands in `/plugins`), bug reporting,
  community Discord
- Freshness: 121k stars, actively maintained (verified)

## Official Anthropic — Docs / Tutorials

### Claude Code documentation
- Provider: Anthropic
- Link: https://docs.claude.com/en/docs/claude-code/overview (and
  https://code.claude.com/docs/en/overview)
- Format: Documentation site with quickstart
- Covers: Install (curl/Homebrew/winget), terminal/IDE/GitHub `@claude` usage,
  agentic coding workflows, git workflows, plugins
- Freshness: current as of 2026-05-05 (verified via overview page)

### Claude Agent SDK docs
- Provider: Anthropic
- Link: https://docs.claude.com/en/api/agent-sdk/overview
- Format: API/SDK documentation
- Covers: Building agents on the same primitives as Claude Code (subagents,
  tool use, hooks, file/bash tools)
- Freshness: not directly verified this run — fetch was blocked; canonical URL

### Anthropic Learn / Academy / Skilljar
- Provider: Anthropic
- Links:
  - https://www.anthropic.com/learn
  - https://anthropic.skilljar.com/
- Format: Hosted courses (video + interactive)
- Covers (per public listings): prompt engineering, API fundamentals, building
  with Claude, Claude for Work / Claude.ai usage tracks
- Freshness: not directly verified this run (host blocked WebFetch). Worth
  re-checking in-browser for any 2026 additions (e.g., Agent SDK, Skills,
  Claude Code tracks).

## Model Context Protocol (MCP) — free, open

### modelcontextprotocol.io
- Provider: MCP project (Anthropic-led, open standard)
- Link: https://modelcontextprotocol.io/
- Format: Documentation, tutorials, quickstarts
- Covers (verified via llms.txt index):
  - "What is MCP?" intro + architecture concepts
  - Quickstart: Build an MCP server
  - Quickstart: Build an MCP client
  - Connect to local MCP servers (Claude Desktop)
  - Connect to remote MCP servers
  - Quickstart: Publish to the MCP Registry
  - Build an MCP App (interactive UI inside AI clients)
  - Tutorial: Authorization in MCP (OAuth 2.1)
  - Tutorial: Security best practices
- Freshness: actively maintained 2026 (verified)

## DeepLearning.AI short courses (typically free to audit)

DeepLearning.AI hosts several Anthropic-collaboration short courses. The site
blocked direct verification this run; recommend confirming current free-audit
status on each course page.

- "Building Towards Computer Use with Anthropic" — Anthropic + DeepLearning.AI;
  computer-use API, agent loops, screen actions.
  https://www.deeplearning.ai/short-courses/building-towards-computer-use-with-anthropic/
- "Prompt Engineering with Llama / Claude" tracks and broader prompt
  engineering courses on https://learn.deeplearning.ai/ — many include
  Anthropic-style techniques.
- Coursera mirrors of DLAI courses are usually free to audit (no certificate).

Status: not directly verified this run; treat as pointers.

## YouTube / video (free)

- Anthropic YouTube channel — https://www.youtube.com/@anthropic-ai
  Conference talks, Claude Code walkthroughs, Agent SDK and Skills sessions,
  prompt engineering with Anthropic engineers (e.g., the long-running
  "Prompt Engineering" interview with Amanda Askell et al.). Not verified
  this run; channel is the canonical source.
- Anthropic Developer livestreams / "Code with Claude" event recordings
  (search the channel) — Claude Code, Agent SDK, MCP demos.

## Cloud-vendor ports of Anthropic courses (free)

- AWS Workshop: Prompt Engineering with Anthropic Claude on Bedrock —
  https://catalog.us-east-1.prod.workshops.aws/workshops/0644c9e9-5b82-45f2-8835-3b5aa30b1848/en-US
  Mirror of the Anthropic interactive prompt eng tutorial, Bedrock-flavored
  (verified link from anthropics/courses README).
- Google Vertex variant of "Real World Prompting":
  https://github.com/anthropics/courses/tree/vertex/real_world_prompting
  (verified).

## Suggested learning path

1. anthropics/courses #1 (API Fundamentals) → #2 (Prompt Eng Tutorial)
2. anthropics/claude-cookbooks — pick recipes matching your use case
3. anthropics/courses #3–5 (Real-World Prompting, Evaluations, Tool Use)
4. Claude Code docs + claude-code repo plugins
5. anthropics/anthropic-quickstarts → Autonomous Coding Agent (Agent SDK)
6. modelcontextprotocol.io quickstarts (server + client) → security tutorial
7. Optional: DeepLearning.AI computer-use / agent short courses for video
   reinforcement.

## Items to re-verify in-browser

- anthropic.com/learn and anthropic.skilljar.com course catalog (host blocked
  WebFetch; check for 2026-added Agent SDK / Skills / Claude Code tracks).
- DeepLearning.AI free-audit availability for each Anthropic collab course.
- docs.claude.com Agent SDK overview (host blocked WebFetch this run).
