# Appendix: The Tool Landscape

A reference for the tools that appear in this course and in practitioner conversations about AI-assisted development. No exercises. Come back to it when you encounter a name you do not recognise.

---

## The two main coding agents

**Claude Code** (Anthropic) and **Codex** (OpenAI) are the two dominant coding agents at the time of writing. Both can read your codebase, run commands, write and edit files, run tests, and iterate until something works.

They are largely interchangeable for most tasks. Practitioners tend to use both and switch depending on the task or which is performing better on a given day. These are not chat interfaces — they are agents that take a brief, work through a series of tool calls, and report back.

---

## Orchestrating multiple agents: Superset

**Superset** (superset.sh) runs 10 or more coding agents simultaneously on your machine, with each task isolated in its own git branch and working directory so agents never interfere with each other. It supports Claude Code, Codex, Gemini CLI, and other CLI-based agents.

The interface combines a terminal, diff/file editor, chat panel, and in-app browser. Instead of cycling through one agent session at a time, you have a dashboard of parallel workstreams each progressing independently.

---

## Managing agent sessions: Agents View

When you run coding agents heavily, you accumulate a large history of sessions. By default this is just a pile of files.

Wes built **Agents View** to address this — a desktop application that syncs agent session files, indexes them for full-text search, and provides an analytics dashboard. Not publicly available, but the problem it solves is real: as agent use scales up, managing what agents have done becomes its own discipline.

---

## Terminal management: Kitty

**Kitty** is a GPU-accelerated terminal emulator built for heavy use. It supports multiple windows, tabs, and splits within a single application and is highly configurable. For practitioners running several agents at once, it provides a fast, stable base to manage all the terminal sessions in one place.

---

## Desktop wrappers: Tauri

Many AI tools run as local web servers — functional but awkward, requiring browser tabs and remembering ports.

**Tauri** wraps those tools as proper desktop applications. It is an alternative to Electron but significantly smaller and more resource-efficient. Wes used it to package Agents View as a native Mac app, built entirely by coding agents.

---

## Language choice for agent-driven development: Go

When a coding agent works on a project, its cycle is: read → change → build → test → repeat. Build speed matters.

**Go** has fast builds — often single-digit seconds — which compresses agent iteration cycles significantly. Wes moved to Go after finding Python too slow for test cycles (and if the agent is writing the code, Python's human-readability advantage disappears) and Rust too slow to compile at scale.

His conclusion: for terminal utilities, system tools, and web backends, Go fits the agentic model well. For data science or AI work, Python still makes sense.
