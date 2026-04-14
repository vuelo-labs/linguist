# Linguist Curriculum Depth Audit

**Date:** 2026-04-09
**Scope:** A-series (A-00–A-08), B-04, B-10, E-07

---

## 1. Terminal Environment Best Practices

**Assumed but not taught.** A-00 asks learners to open a terminal, navigate to a folder, and run commands — with no explanation of what a terminal is or why Claude Code needs one.

**What is taught:** Claude Code-specific usage only — installation checks, error-message-to-fix mapping, `/clear`, tool naming in A-07.

**What is not taught:**
- Working directory awareness (`pwd`, what Claude Code can see)
- File paths: absolute vs relative
- When to run a shell command yourself vs ask Claude Code to run it
- Exit codes and stderr vs stdout
- Permission errors and why they happen

**Recommendation:** Add a 200-word "Terminal Concepts" primer to A-00 covering: pwd, file paths, exit codes, when to use shell directly vs Claude Code tools.

---

## 2. Exercise Depth Across All Three Stages

### B-Series
Heavy "send and compare" exercises. Every module ends with sending something and evaluating it. Exercises are scaffolded and outcome-based.

### E-Series
Guided exercises where learners test principles on real tasks. More independent than B but still clear steps and verification.

### A-Series — exercise inventory

| Module | Hands-on? | Notes |
|--------|-----------|-------|
| A-00 | Yes | Install, run one session |
| A-01 | No | Pure conceptual |
| A-02 | No | Template provided, not required |
| A-03 | Yes | Write CLAUDE.md, test, iterate |
| A-04 | No | "Without/With" examples only |
| A-05 | Optional | Checkpoint template, not required |
| A-06 | No | Templates, no comparison exercise |
| A-07 | Yes | Send 3 tasks, observe tools, compare cost |
| A-08 | Yes | Decision exercises + brief writing |

**Lower density is appropriate for the audience — except A-05.**

A-05 (Compaction) is the most subtle concept in the course and has no required exercise. Learners read the theory but may not discover what actually survives compaction until it fails in production.

**Recommendation:** A-05 should require a long session where learners observe automatic compaction and test whether early constraints survived.

---

## 3. Capstone Projects

### Current final modules

**B-10: The Opening Seed**
Synthesis-capstone hybrid. Synthesizes B-01–B-09 into one artifact (an opening seed). Stops short: learner writes the seed but isn't required to evaluate the response against B-07's checklist.

**E-07: Your Reference Card**
Reflective synthesis. Creates a portable reference card but doesn't ask learners to use it and verify it works. Reflective (what did you learn?) not applicative (go use it).

**A-08: Agent Delegation and Briefing**
Not a capstone — it's the final skill module. Teaches delegation in isolation, doesn't integrate A-00–A-07.

### Capstone vs Synthesis

| Dimension | Synthesis Module | Capstone Project |
|-----------|-----------------|-----------------|
| Primary task | Reflect and consolidate | Apply all skills to one complex task |
| Artifact | Reference card / template | Completed project + documented process |
| Feedback | Implicit | Explicit ("document what worked") |
| Time | 10–20 min | 45 min – 2 hours |

### Recommendations

**B-10:** Add a step — "Send your seed. Evaluate using the B-07 checklist. If something's off, diagnose and revise." This closes the feedback loop without adding a new module.

**E-07:** Add optional E-08 — "Use your reference card on a task you haven't done before. Document what worked and what surprised you. Revise the card."

**A-09 (missing, recommended):** Real multi-step project integrating all A-series skills:
1. Scope the session (A-04)
2. Use /plan before execution (A-06)
3. Name tools explicitly (A-07)
4. Set a manual checkpoint halfway (A-05)
5. Delegate one subtask if appropriate (A-08)
6. Deliver result + document: what went as planned, what surprised you

Example scenarios: audit a codebase for a pattern, compile a competitive analysis, refactor a function across multiple files.

---

## Summary

| Area | Finding | Priority |
|------|---------|----------|
| Terminal basics | Genuine gap — assumed, not taught | A-00 addition, low effort |
| A-05 exercise | Missing required hands-on for most subtle concept | Medium effort |
| B-10 / E-07 capstone | Need "use it and reflect" step to close feedback loop | Low effort |
| E-08 (optional) | Validate reference card on a new task | Medium effort, high value |
| A-09 capstone | No integrative project exists — most significant gap | High effort, high value |
