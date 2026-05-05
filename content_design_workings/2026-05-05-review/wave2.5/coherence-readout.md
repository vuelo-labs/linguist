# Wave 2.5 — Course Coherence Readout (L1–L6 + L6.5)

_Reviewed 2026-05-05. Files in scope: `course/00-index.md` (un-edited control), `01-mental-model.md`, `02-communication-primitives.md`, `03-session-hygiene.md`, `04-context-awareness.md`, `05-output-engineering.md`, `06-tool-fluency.md`, `course/skills-plugins-hooks.md` (Layer 6.5)._

---

## 1. Executive read

**Overall: acceptable, trending good.** The post-Wave-1+2 spine holds together — the core arc (mental model → communication → session hygiene → context → output → tools → primitives) is intact, primitives introduced in one module are reused in subsequent modules, and the new 2026 surface (Skills, Memory, Compaction API, `output_config.format`, Advisor, deferred tools, `context: fork`) is consistently named across files. Voice is broadly aligned: terse, mechanical, "why" before "how", source-grounded.

**The three issues most worth fixing before Wave 3:**

1. **`00-index.md` is dangerously stale relative to the edited modules.** It still describes L8 with the dynamic-boundary thesis, doesn't list Skills/Plugins/Hooks at all, has no `course-revision` stamp, and the Layer 4 row promises "what compaction preserves, what it loses" with zero hint that L4 now teaches a five-primitive decision tree. Anyone landing on the index gets a wrong map. (Plan §2 flags 00-index as "sequence last", but the existing index is doing active harm in the meantime — needs at minimum a "this index is pre-Wave-2.5; modules below have moved on" banner.)
2. **Layer 6.5 is unannounced from L6 and unknown to L1–L5.** L6 ends without forecasting Layer 6.5, and L4/L3 reference Skills/`context: fork` as if the reader already knows what a Skill is. The new module is good; its handoff into the rest of the spine is not.
3. **Frontmatter inconsistency.** L1–L6 carry `---\ncourse-revision: 2026-05-05\n---`. `skills-plugins-hooks.md` adds a non-standard `status:` field. `00-index.md` has no frontmatter at all. Trivial to fix, but it's the first thing a future audit will flag.

Coherence is real. Cross-references are the soft spot.

---

## 2. Findings per category

### 2.1 Voice drift

**Mostly within tolerance.** The course voice is consistent across L1–L6: imperative, mechanical, source-grounded, sparing with adjectives. Two exemplars worth quoting as the *target* register:

- `04-context-awareness.md:20` — "These skills are about reading your substrate, not about treating every session like a 200k window under siege." Punchy, mechanical, no filler.
- `06-tool-fluency.md:31` — "Pick the *kind* first, then the specific tool." Same register.

Drift instances (Nits unless noted):

- **Update — `skills-plugins-hooks.md:8`**: "Picking the wrong one is how people end up with a Skill that should have been a Hook, or a Hook that should have been a Subagent." The "people end up with" register is folksier than anywhere else in the course. Compare to L6's "The default trap" (06:33) which lands the same idea in the house voice. *Fix:* rephrase as e.g. "The wrong choice produces a Skill that should have been a Hook, or a Hook that should have been a Subagent."
- **Nit — `skills-plugins-hooks.md:80`**: "Read across that table and the pattern is clear" — directive-to-reader phrasing the rest of the course avoids. *Fix:* drop the meta-instruction; just state the pattern.
- **Nit — `05-output-engineering.md:8`**: "Reach for the lower layer first when you can; reach for the upper layer always." Slightly aphoristic vs. the rest of L5; not wrong, but stands out. Leave unless trimming.
- **Nit — `03-session-hygiene.md:230`**: "That's powerful for long-horizon work … and risky for everything else" reads more essayistic than L1–L2's clipped style. Leave; it earns its length because the Memory primitive is genuinely new.

No Blocker-level voice issues. Wave 1+2 agents wrote in compatible registers.

### 2.2 Contradictions

**Update — Skills framing: L1 says "the model … decides on its own when to load the skill body" vs. L6.5's three-path activation model.**
- `01-mental-model.md:158`: "the description is what the model uses to *proactively activate* the skill — the model sees a skill index and decides on its own when to load the skill body. You don't always have to ask."
- `skills-plugins-hooks.md:38–43` lists three activation paths: proactive, user-typed via `/skills`, and nested-skill.
- L1 isn't *wrong* — it's introducing the proactive path — but a reader arriving at L6.5 will think L1 told them activation was model-only. *Fix:* in L1, add a half-sentence: "(The user can also invoke a skill explicitly via `/skills`; covered in Layer 6.5.)"

**Update — CLAUDE.md scope vs. Memory scope.**
- `03-session-hygiene.md:18` claims the CLAUDE.md hierarchy includes "managed (system-wide), user, project, and local".
- `03-session-hygiene.md:104` shows a `~/.claude/CLAUDE.md` example labelled "user-level CLAUDE.md".
- The Memory comparison table (03:226) labels CLAUDE.md as "Loaded fresh every session; edited deliberately by humans" — fine — but the table omits the hierarchy distinction that 03:18 establishes. Not a contradiction, but a reader trying to choose between *user-level CLAUDE.md* and *Memory* gets no hierarchy context in the table. *Fix:* add a parenthetical "(at any level — managed/user/project/local)" to the CLAUDE.md row of the table at 03:226.

**Nit — `output_config.format` framing duplication, slightly inconsistent.**
- `02-communication-primitives.md:237`: "the parameter formerly known as `output_format` was renamed to `output_config.format` (alongside fine-grained tool streaming GA the same day)".
- `05-output-engineering.md:20`: "structured outputs are GA and the parameter formerly known as `output_format` is now `output_config.format` (the rename shipped alongside fine-grained tool streaming GA)".
Same fact, two near-identical phrasings. Not contradictory, but see Redundancy below.

**No true contradictions found.** All "X says A, Y says not-A" candidates resolved on close reading to compatible framings.

### 2.3 Redundancy

**Update — `output_config.format` is taught twice, almost verbatim.**
- `02-communication-primitives.md:235–251` has a callout titled "Structured outputs vs prompt-only formatting" with reach-for/stay-in-prose lists.
- `05-output-engineering.md:18–22` and the decision row at `05:42` repeat the same teaching.
- L2's callout explicitly says "this callout is most directly actionable when you're calling the API yourself" (02:251), and L5 makes the same disclaimer at 05:49. The two callouts cover the same when-to-reach-for-it decision twice.
- *Fix:* trim L2's callout to a one-paragraph pointer ("the API exposes `output_config.format` for guaranteed shapes; full treatment in Layer 5") and let L5 own the decision. L2 is the wrong place to land this — Skill 4–6 are about prompt mechanics, not API parameters.

**Nit — Compaction-preservation list partially duplicates 03 ↔ 04.**
- `03-session-hygiene.md:112` describes auto-compaction firing on a buffer threshold and what it summarises.
- `04-context-awareness.md:22–38` enumerates the nine sections preserved and the four things lost.
- The L3 description is light enough that this is forecast-not-redundancy. Leave.

**Nit — `/compact` and `claude project purge` definitions appear in both 03 and 04.**
- `03-session-hygiene.md:114–119` (toolkit list) defines `/compact`, `/usage`, `claude project purge`.
- `04-context-awareness.md:14–18` table re-defines `/compact` in the context-management primitive table.
- Both are short; pedagogically defensible. Leave but consider a "see L3 for command surface" pointer in L4 to acknowledge the overlap.

### 2.4 Broken cross-refs

**Blocker — references to "Layer 7" in L4 and L6.5 don't match what the index promises.**
- `skills-plugins-hooks.md:181`: "L7 (Agent Design) goes one level further again — designing longer-horizon agents that span in-CLI subagents, hosted Managed Agents, and the Advisor pairing pattern."
- `skills-plugins-hooks.md:187`: "Subagent design depth (frontmatter, `mcpServers`, prompt-cache sharing, fork): see Layer 7."
- `00-index.md:26` still describes L7 as "Delegation decisions and how to brief a subagent with zero context" — pre-rewrite framing. The rewritten L7 (per plan §2) doesn't exist yet.
- L4 and L6.5 are forward-promising material that isn't there. *Fix:* either add a "(coming in Wave 3)" stamp to those cross-refs, or add a banner to 00-index acknowledging modules below the line are post-Wave-2.5.

**Update — L6.5's cross-ref to "Layer 4" for `context: fork` lands but the reverse pointer is missing.**
- `skills-plugins-hooks.md:185`: "Skills as a context-management primitive (`context: fork` for clean working memory): see Layer 4."
- `04-context-awareness.md:18` mentions `context: fork` in the primitives table and `04:220` in the decision tree. Neither says "covered in detail in the Skills/Plugins/Hooks module" — the reader is told what a forked-skill context is for in L4 but not where to find Skill anatomy. *Fix:* add to L4's forked-skill row: "(Skill anatomy and `context: fork` semantics: see Layer 6.5.)"

**Update — L3 references settings.json features without forward pointer to L6.5 hooks.**
- `03-session-hygiene.md:20`: "settings.json … hooks, env vars, MCP servers, allowed tools."
- L3 names hooks here but never explains them. L6.5 owns the explanation. *Fix:* one parenthetical at 03:20: "(hooks themselves are covered in Layer 6.5.)"

**Update — L6 says "covered in detail in the Skills/Plugins/Hooks module" four times (06:26, 06:29, 06:39) but never names it as Layer 6.5.**
- `06-tool-fluency.md:26`: "covered in detail in the **Skills/Plugins/Hooks** module".
- `06-tool-fluency.md:29`: "covered in the Agent Design module".
- These are name-based pointers, not number-based, and the Skills/Plugins/Hooks module's filename is `skills-plugins-hooks.md` (no number). Acceptable, but inconsistent with the rest of the course's `LN-*.md` numbering. *Fix:* once the module is renumbered (per its own frontmatter: "Wave 4 will renumber"), update L6's pointers; until then, add "(see `skills-plugins-hooks.md`)" once for findability.

**Nit — `01-mental-model.md:201` still references "launch a sub-agent to do extended research" without naming it as a kind from the new tool taxonomy.** L6 introduces the taxonomy at 06:22; L1 predates that taxonomy in reading order. Leave — L1 is allowed to be loose since the taxonomy lands properly in L6.

**Nit — `05:47` says "Skill 14 (prose mechanics, below)" and "Skill 13 (below) — and auto mode's plan step when in Claude Code".** Internal cross-ref; correct. Leave.

### 2.5 Narrative gaps

**Blocker — L6 → L6.5 handoff is missing.**
- `06-tool-fluency.md` ends at line 111 with the third worked example. There is no closing paragraph forecasting Layer 6.5. The reader finishes L6 and has no signal that the very next file extends the same taxonomy.
- L6.5 itself opens (`skills-plugins-hooks.md:8`) with "This module sits between tool fluency (L6) and agent design (L7)" — good, but this only helps a reader who *finds* L6.5. Without an L6 outro, only readers reading the whole directory in alphabetical order will encounter it.
- *Fix:* add a 3–4 line closing section to L6 — "Next: Layer 6.5 — Skills, Plugins, Hooks. The taxonomy above tells you which kind of tool to call; the next layer tells you how to add new kinds and how to wrap them with deterministic behaviour." Cross-link the file.

**Update — L3 → L4 handoff under-forecasts Memory's role in L4.**
- `03-session-hygiene.md:240` Layer-3 thesis names CLAUDE.md / settings.json / Memory as the three persistent-state surfaces.
- `04-context-awareness.md:14` table includes Memory as a context-management primitive — different framing (state across sessions vs. instructions persistence).
- L3 doesn't forecast that Memory will reappear in L4 as one of the five context primitives, and L4 doesn't recap that L3 already covered Memory's lifetime/audit profile. Reader sees Memory twice with no acknowledgement of the overlap. *Fix:* in L4 at the Memory row of the primitives table (04:17), add "(lifetime + audit covered in Layer 3.)"

**Update — L1's "tool surface" callout should forecast L6's full taxonomy explicitly.**
- `01-mental-model.md:152–162` introduces five tool *kinds* (built-in, MCP, Skills, deferred, sub-agent-as-tool).
- `06-tool-fluency.md:22` re-tabulates the same kinds with cost/latency/cache columns.
- L1 doesn't say "you'll meet these again with cost shape and latency in Layer 6". *Fix:* add a closing sentence to the L1 callout: "Layer 6 reprises this taxonomy with cost shape, latency, and cache impact." This converts a redundancy risk into a forecast.

**Nit — L5's Advisor mention (`05-output-engineering.md:223`) introduces Advisor for the first time but doesn't forecast L7's deeper treatment.** L6.5's `:181` says "L7 (Agent Design) goes one level further again — designing longer-horizon agents that span in-CLI subagents, hosted Managed Agents, and the Advisor pairing pattern" — so the forecast exists, just in the wrong file. *Fix:* L5:223 add "(see Layer 7 for the full Advisor pattern.)"

### 2.6 Stale framing left behind

**Update — L1's "Tools Are How the Model Acts" intro paragraph predates its own callout.**
- `01-mental-model.md:148`: "Vague requests trigger expensive tool chains (sub-agents, multi-file searches, bash commands) when a targeted request might need only one read."
- This sentence frames "sub-agents" as just one of several tools — but the callout immediately after (148–162) establishes that sub-agents are a distinct *kind* with their own cost shape. The intro reads like the pre-Wave-1 version. *Fix:* tighten to "Vague requests let the model wander the tool surface; precise requests pin it." (which is essentially what 01:162 already says, mid-callout). The repetition is mild.

**Update — L4 thesis paragraph references "compaction preserves, what it loses, how to intervene" but the module now does much more.**
- `00-index.md:23` bills Layer 4 as: "What compaction preserves, what it loses, how to intervene."
- `04-context-awareness.md:8` actually delivers: substrate-awareness, five primitives, decision tree.
- The index hasn't caught up. *Fix:* once Wave 4 touches 00-index, rewrite L4's row.

**Nit — `02-communication-primitives.md:16`** still says "Claude Code's system prompt explicitly tells the model not to add features, refactor, or make improvements beyond what was asked" with no citation/source-line. The course elsewhere is increasingly careful to caveat exact-wording claims (cf. L4:22 "structure verified, exact wording may have drifted" and L6:18). *Fix:* add the same hedge to L2:16.

**Nit — `01-mental-model.md:84`** says "Claude Code's compaction logic asks the model to summarise the full conversation into a structured set of sections" — pre-Wave-1 framing. Compaction is now also a server-side API primitive (per L4). Not wrong as scoped to Claude Code, but a forward pointer would help. *Fix:* "(For the API counterpart, see Layer 4's Compaction API row.)"

### 2.7 Frontmatter / stamp consistency

**Update — frontmatter is inconsistent across the seven files.**

| File | Frontmatter |
|---|---|
| `00-index.md` | **None** |
| `01-mental-model.md` | `course-revision: 2026-05-05` |
| `02-communication-primitives.md` | `course-revision: 2026-05-05` |
| `03-session-hygiene.md` | `course-revision: 2026-05-05` |
| `04-context-awareness.md` | `course-revision: 2026-05-05` |
| `05-output-engineering.md` | `course-revision: 2026-05-05` |
| `06-tool-fluency.md` | `course-revision: 2026-05-05` |
| `skills-plugins-hooks.md` | `course-revision: 2026-05-05` + `status: standalone module (Wave 4 will renumber)` |

- *Fix 1:* Add `course-revision: 2026-05-05` to `00-index.md`.
- *Fix 2:* Decide whether `status:` is a standard frontmatter field. If yes, document it in the plan's CC-5 versioning convention; if no, move L6.5's status note into the H1 or first paragraph.

**Nit — date stamps inside the body are also inconsistent.** Some sections use "as of v2.1.128, 2026-05-05" (06:18, 06:35), some use "(v2.1.121, 2026-05-05)" (skills-plugins-hooks:43), some just "(v2.1.117)" with no date (06:25). The plan's CC-5 line says "Add per-section 'as of' stamps for any beta or v2.1.x-specific content." Mostly compliant; tighten on next pass.

---

## 3. Severity rollup

| File | Blockers | Updates | Nits |
|---|---|---|---|
| `00-index.md` | 1 (stale L7/L8 rows + missing 6.5 + no frontmatter — counted once as "stale index") | 1 (frontmatter) | 0 |
| `01-mental-model.md` | 0 | 3 (Skills activation half-truth; tool-intro stale; L4 Compaction-API forward ref) | 2 |
| `02-communication-primitives.md` | 0 | 2 (`output_config.format` redundancy with L5; missing source hedge at :16) | 0 |
| `03-session-hygiene.md` | 0 | 2 (CLAUDE.md hierarchy not in Memory table; hooks named without L6.5 pointer) | 1 |
| `04-context-awareness.md` | 0 | 2 (no L6.5 pointer for `context: fork`; Memory L3 cross-ref missing) | 1 |
| `05-output-engineering.md` | 0 | 1 (Advisor → L7 forecast missing) | 1 |
| `06-tool-fluency.md` | 1 (no closing handoff into L6.5) | 1 (name-only pointer to L6.5 vs filename) | 0 |
| `skills-plugins-hooks.md` | 0 | 2 (forward pointers to L7 land in air; voice drift at :8) | 2 |
| **Totals** | **2** | **14** | **7** |

The two Blockers are both narrative-architecture issues, not content-correctness issues:
1. **L6 → L6.5 handoff** (`06-tool-fluency.md` end of file).
2. **`00-index.md` is stale** and actively misroutes readers; either banner it or fast-track its Wave 4 rewrite.

Everything else is fixable in a single tightening pass once Wave 3 (L7, L8) lands and the index can be rewritten in full.

---

*Reviewed in reading order, against `wave1-summaries/L{1–4}.md`, `wave2-summaries/{L5,L6,NL1}.md`, and `05-full-sweep-plan.md`. No Wave 3 files (L7, L8) or appendices included in scope.*
