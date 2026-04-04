# Layer 6 — Tool Fluency
## Skill 15

Tool fluency is the shift from passively accepting the model's tool choices to actively directing which tools run, in what order, and at what scope. This is the layer where you take control of cost, latency, and auditability.

---

### Skill 15: Guiding Tool Use

**What it is:** Explicitly directing which tools to use, in what order, and with what scope — rather than letting the model choose its own tool strategy.

**Why it matters:** The model's tool selection is heuristic, not optimal. For a given task, it may choose the Agent tool when a targeted Grep would suffice, or use Bash for a file read when the Read tool is cheaper and more reviewable. The model's system prompt explicitly instructs it to prefer dedicated tools over Bash — but the ordering and strategy within tool selection is still left to the model's judgment. Guiding tool use lets you take control of token cost, latency, and auditability. The source instruction: "Do NOT use Bash when a relevant dedicated tool is provided. Using dedicated tools allows the user to better understand and review your work."

**Tool cost hierarchy (cheapest to most expensive):**

| Tool | When to use |
|------|-------------|
| Read | You know the exact file path |
| Glob | You know the file name pattern |
| Grep | You know the content pattern |
| Bash | You need shell execution specifically |
| Agent | The task generates large output you don't need in main context |

**The default trap:** Without guidance, the model often reaches for Agent or Bash when Read or Grep would suffice. Naming the tool prevents this.

---

**Example 1 — Coding (targeted investigation)**

*Scenario:* A developer wants to find all places in the codebase where a specific utility function (`debounce`) is called, to understand its usage before modifying it.

*WITHOUT:* The developer writes `find all uses of the debounce function`. The model might launch an Agent to do a codebase survey, or use Bash with a grep command, or use Glob followed by multiple Reads. The path is unpredictable and often more expensive than needed.

*WITH:*
```
Use the Grep tool to find all files that import or call `debounce` from
src/utils/debounce.ts. Search pattern: "debounce" in *.ts and *.tsx files.

For each file found, show me just the matching line and the file path.
Do not read the full files — just the grep results.
```

One Grep call. Bounded output. No downstream file reads unless the developer asks.

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

Explicit sequence. Conditional logic stated upfront. One Bash call per step.

---

**Example 3 — Content/Research (web research with boundaries)**

*Scenario:* A researcher needs to find the current CEO of three specific companies for a contact list.

*WITHOUT:* The researcher writes `find the CEOs of Figma, Linear, and Notion`. The model might hallucinate from training data, or use WebSearch with vague queries that return old results, or launch an Agent for each company.

*WITH:*
```
Use WebSearch three times — once for each company — with these specific queries:
1. "Figma CEO 2025"
2. "Linear CEO 2025"
3. "Notion CEO 2025"

For each: report the CEO name, the source URL, and whether the result is from
the company's own website or a third-party source. Mark results from third-party
sources as "unverified".
```

Three bounded searches. Output format specified. Source reliability signaled.
