# Practitioner Tier — Concept

_Draft 2026-05-05. Concept-level only — not a syllabus._

The Practitioner tier sits between Linguist's Advanced track (course/01–08) and the paid Cyborg assessment. Advanced gives the learner a complete mental model: how Claude executes text, how context behaves, how to brief subagents, how to architect prompts for cache economics. Cyborg-paid is where they are graded against a realistic 7-day data-analyst simulation. Practitioner is the deliberate-practice layer in between — the place where a learner who has finished theory turns it into reflexes before they pay to be assessed.

## 1. Mission

A Practitioner-tier graduate can walk into an unfamiliar agentic workflow — a fresh Claude Code repo, a Managed Agents harness, a half-broken Tines story, a Skills folder that misfires — and within an hour produce a *working*, *legibly-scoped*, *cache-friendly* configuration that another practitioner could pick up and extend. They are not just "good at prompts" — they hold a working repertoire of recipes for the recurring shapes of agentic work (delegate vs keep, plan vs execute, static vs dynamic, fork vs continue, skill vs subagent vs hook), and they can pick the right one under time pressure without re-deriving it from first principles.

## 2. Entry and exit criteria

**Entry — must already have:**
- Completed Linguist Advanced (course/01–08) or demonstrated equivalent fluency.
- Comfortable with: verb taxonomy, CLAUDE.md placement, the compaction model, the delegation decision, the static/dynamic prompt boundary.
- Has a real project they want to work on — Practitioner is not a tutorial track, it is a practice track. No real project, no traction.
- Working Claude Code install (v2.1.12x+), and a free-tier Cyborg account for the lab scenarios.

**Exit — must demonstrate (self-attested + free-tier Cyborg telemetry, NOT graded):**
- Completed the full set of Practitioner drills (see §3) with submitted artefacts.
- Produced at least one end-to-end "field report" — a real piece of work delivered, with a written retro on what was delegated, what was kept, what cache they expected to hit, what actually happened.
- Cleanly handled at least one failure mode in a free-tier Cyborg lab (context rot, cache bust, runaway subagent, hook misfire) and written it up.
- Has personalised the Reference Card (Ex 8) into a working playbook they actually open during real work.

Exit is the ramp to paid Cyborg. Practitioner does not certify anything; Cyborg does.

## 3. Lesson categories

Three categories, in roughly this proportion: 60% Drills, 30% Playbooks, 10% Field reports.

### Drills — short, focused, repeatable
**Purpose:** Build reflexes for a single recurring micro-decision. A drill takes 15–30 minutes. The same drill can be re-run on different inputs. Closer to scales-and-arpeggios than to a project.
**Format:** A scenario, a constraint, a 1-page rubric for self-review, a "do it again with your own task" variant.
**Example titles:**
- *Verb-swap drill:* take a vague prompt, rewrite it five times moving down the verb taxonomy. Notice what changes in the output.
- *Boundary drill:* given a 3,000-token system prompt, mark the static/dynamic line. Defend it.
- *Delegate-or-keep drill:* given 10 mini-tasks, decide subagent vs main session, justify in one sentence each.
- *Skill vs subagent vs hook:* given a behaviour spec, pick the right primitive and write the frontmatter.
- *Re-seed drill:* a thread is at 80% context. Write the 3-line re-seed.

### Playbooks — recipes for recurring shapes
**Purpose:** Codify a multi-step pattern the learner will reuse. Closer to a reference card than a lesson. Each playbook is short (one page), opinionated, and tool-specific where useful.
**Format:** Trigger → setup → steps → exit criteria → known failure modes. Always paired with a free-tier Cyborg scenario where the playbook is the right tool.
**Example titles:**
- *The investigation fork:* parallel research subagents → synthesise in main → act.
- *The static/dynamic split for a small team agent.*
- *The CLAUDE.md / Skill / hook decision tree.*
- *The cache-bust autopsy:* spotting the change that broke your fleet's cache.
- *The Managed Agents handoff:* when to push work off Claude Code into a hosted Managed Agent + memory store.
- *The Advisor-tool pattern* (executor + advisor) for long-horizon work.

### Field reports — the learner's own work, written up
**Purpose:** Force articulation. The skill is not actually internalised until the learner can explain — to a peer who has the same training — what they did and why. Also produces the portfolio they bring into paid Cyborg.
**Format:** 500–1000 word retro on a real piece of work. Template: goal, what I delegated and why, what I kept and why, where I expected the cache to hit, what actually happened, what I would do differently. No grading; peer/self-review only.
**Example titles (prompts, not topics):**
- *A subagent I should not have delegated to.*
- *A CLAUDE.md change that fixed three problems.*
- *The cache miss I didn't see coming.*
- *My first 7-day task on free-tier Cyborg.*

## 4. Cadence

Practitioner is **drill-by-drill, not project-by-project.** Roughly:

- **Suggested pace:** 3 drills per week + 1 playbook per fortnight + 1 field report per month.
- **Total expected effort to graduate:** ~25–40 hours over 6–10 weeks. A motivated learner can compress to 3 weeks; a part-timer can stretch to a quarter.
- **Free-tier Cyborg touchpoints:** every playbook is anchored to a free-tier Cyborg scenario as its "lab." Drills can be done on the learner's own work or on a free-tier Cyborg sandbox snippet. Field reports must include at least one Cyborg-sandbox-based entry. The free-tier sandbox is the safe place to break things — paid Cyborg is the place where breakage costs.
- **Handoff to paid Cyborg:** at any point after the exit criteria are met. The Practitioner playbooks are deliberately the same shapes Cyborg will assess against, so paid Cyborg should feel like "the same drills, but graded, on a fresh scenario."

## 5. Open questions and risks

1. **Cyborg scenario surface area.** How many distinct free-tier scenarios will exist on launch? If it is one, Practitioner playbooks risk over-fitting to it. Need ≥3 distinct shapes (investigation, build, debug) for the playbooks to feel general.
2. **Grading line.** Practitioner explicitly does not grade. But learners *want* a signal. Do we offer self-rubrics, peer review, or nothing? Risk of the tier feeling shapeless if we offer nothing; risk of duplicating Cyborg if we offer too much.
3. **Tool drift.** The 2026-05-05 research shows Claude Code shipping weekly (v2.1.116 → 128 in two weeks), Managed Agents + Memory in public beta, Advisor tool experimental. Playbooks will go stale fast. Need a content-freshness commitment (quarterly review?) and a versioning convention on each playbook.
4. **Prerequisite enforcement.** Does the platform actually gate Practitioner behind Advanced completion, or is it self-selected? If self-selected, expect learners arriving without the mental model and bouncing.
5. **Scope of "field reports."** Some learners will not have real work that fits. Do we provide synthetic-but-rich scenarios as a fallback, drawn from free-tier Cyborg? (Likely yes.)
6. **Relationship to Skills marketplace.** Should Practitioner graduates be encouraged to publish a skill or plugin to `agentskills.io` as a capstone? Strong portfolio signal, but blurs into "build" rather than "practise."
7. **Platform spread.** Linguist's Advanced is multi-platform (Claude / ChatGPT / Gemini / Tines / Claude Code). Cyborg is Claude-Code-shaped. How tightly do we couple Practitioner to Claude Code? Recommendation: Claude-Code-primary, with explicit "the same shape on Tines / on the API" notes — but confirm with Cyborg team that this is the intended on-ramp.
