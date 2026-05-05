---
course-revision: 2026-05-05
cc2-reconciled: 2026-05-05
---

# Practitioner Tier — Concept

_Draft 2026-05-05. Concept-level only — not a syllabus. Reconciled against confirmed Cyborg-team answers 2026-05-05 (see §6)._

The Practitioner tier sits between Linguist's Advanced track (course/01–08) and the paid Cyborg assessment. Advanced gives the learner a complete mental model: how Claude executes text, how context behaves, how to brief subagents, how to architect prompts for cache economics. Cyborg-paid is where they are graded against a realistic 7-day simulation. Practitioner is the deliberate-practice layer in between — the place where a learner who has finished theory turns it into reflexes before they pay to be assessed.

Practitioner is **general**. It teaches skills that apply in any agentic environment. The currently available concrete substrate happens to be the analyst-shaped Cyborg (a light Veralux subset on the free tier; the full thing on paid); the substrate is incidental — what matters is that it provides content of the right shape to practise on. As Cyborg ships role-specific variants later (as separate products), Practitioner gains additional substrates without changing what it teaches.

## 1. Mission

A Practitioner-tier graduate can walk into an unfamiliar agentic workflow — a fresh Claude Code repo, a Managed Agents harness, a half-broken Tines story, a Skills folder that misfires — and within an hour produce a *working*, *legibly-scoped*, *cache-friendly* configuration that another practitioner could pick up and extend. They are not just "good at prompts" — they hold a working repertoire of recipes for the recurring shapes of agentic work (delegate vs keep, plan vs execute, static vs dynamic, fork vs continue, skill vs subagent vs hook), and they can pick the right one under time pressure without re-deriving it from first principles.

## 2. Entry and exit criteria

**Entry — must already have:**
- Completed Linguist Advanced (course/01–08) or demonstrated equivalent fluency.
- Comfortable with: verb taxonomy, CLAUDE.md placement, the compaction model, the delegation decision, the static/dynamic prompt boundary.
- Has a real project they want to work on — Practitioner is not a tutorial track, it is a practice track. No real project, no traction.
- Working Claude Code install (v2.1.12x+), and access to the **light Veralux subset** (Cyborg's free-tier substrate; analyst-focused at launch, with role-specific Cyborg variants expected to follow as separate products) for the lab anchor points.

**Exit — must demonstrate (self-attested + whatever artefacts the substrate happens to produce; NOT graded):**
- Completed the full set of Practitioner drills (see §3) with submitted artefacts.
- Produced at least one end-to-end "field report" — a real piece of work delivered, with a written retro on what was delegated, what was kept, what cache they expected to hit, what actually happened.
- Cleanly handled at least one failure mode (context rot, cache bust, runaway subagent, hook misfire) on the available substrate and written it up.
- Has personalised the Reference Card (Ex 8) into a working playbook they actually open during real work.

The free-tier substrate's telemetry surface is still TBD — exit evidence is self-attested plus whatever Veralux-subset artefacts the learner can produce (substrate shape evolving, see §5). Exit is the ramp to paid Cyborg. Practitioner does not certify anything; Cyborg does.

## 3. Lesson categories

Three categories, in roughly this proportion: 60% Drills, 30% Playbooks, 10% Field reports. **Practitioner content is general** — domain-agnostic by default. Where a concrete environment is needed, point at the currently available Cyborg substrate (the light Veralux subset is the available one with the right content shape). Do not author analyst-specific drills.

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
**Format:** Trigger → setup → steps → exit criteria → known failure modes. Each playbook can be exercised on the learner's own work or anchored to the available Cyborg substrate (the light Veralux subset is the currently available environment with the right content shape — environment is incidental, the content type is what matters).
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
- *My first piece of work on the Cyborg substrate.*

### MUST-NOT (Practitioner authoring constraints)
- **No profile- or persona-typed drills.** Cyborg's role/persona framing is being rethought upstream and has not landed; do not invent profile-coupled content.
- **No role-specific authoring.** Practitioner is general. Don't write analyst-only, founder-only, etc. drills even though the analyst-Cyborg is the currently visible substrate.
- **No Version D / `trellis_analytics` references.** That artefact is being dropped upstream.
- **No Veralux-internal names or canon** (15 tensions, Gordon's brief, named characters, LENS/ARC/Wearables, A/B/C/D version labels). Teach the underlying skill on neutral material.
- **No replication of Cyborg's assessment shape** (one-week sim, panel readout, activity-log diagnostic). Practitioner is preparation, not a parallel assessment.
- **No rebrand of Cyborg's free funnel.** Don't mirror Cyborg's free surface as Linguist content; point at it.

## 4. Cadence

Practitioner is **drill-by-drill, not project-by-project.** Roughly:

- **Suggested pace:** 3 drills per week + 1 playbook per fortnight + 1 field report per month.
- **Total expected effort to graduate:** ~25–40 hours over 6–10 weeks. A motivated learner can compress to 3 weeks; a part-timer can stretch to a quarter.
- **Substrate touchpoints:** every playbook can be anchored to the available Cyborg substrate (currently the light Veralux subset) as its concrete lab. Drills can be done on the learner's own work or on a substrate snippet. Field reports must include at least one substrate-based entry. The substrate is the safe place to break things — paid Cyborg is the place where breakage costs. As role-specific Cyborg variants ship later (as separate products), more substrate options become available; the Practitioner content does not change shape, only the available concrete anchors.
- **Handoff to paid Cyborg:** at any point after the exit criteria are met. The Practitioner playbooks are deliberately the same shapes Cyborg will assess against, so paid Cyborg should feel like "the same drills, but graded, on a fresh scenario."

## 5. Open questions and risks

1. **Substrate telemetry shape.** The light Veralux subset's telemetry/artefact surface is undefined. Exit evidence is currently "self-attested + whatever the subset produces." Need a stable shape before we can tighten exit criteria or build self-review rubrics on top of substrate output.
2. **Role-specific Cyborg variants — timeline and forwarding.** Cyborg launches analyst-focused; other role variants come later as separate products. When they ship, how does Practitioner forward learners to the right one? (Soft-route by stated goal? Let learners pick? Hand off to Cyborg's own routing?)
3. **Profile-vs-persona resolution upstream.** Cyborg is rethinking the older five-profile framing, leaning toward personas tied to "what the job is becoming," but undecided. If/when that lands, does Linguist need to mirror it, or can Practitioner stay strictly general?
4. **Grading line.** Practitioner explicitly does not grade. But learners *want* a signal. Do we offer self-rubrics, peer review, or nothing? Risk of the tier feeling shapeless if we offer nothing; risk of duplicating Cyborg if we offer too much.
5. **Tool drift.** The 2026-05-05 research shows Claude Code shipping weekly (v2.1.116 → 128 in two weeks), Managed Agents + Memory in public beta, Advisor tool experimental. Playbooks will go stale fast. Need a content-freshness commitment (quarterly review?) and a versioning convention on each playbook.
6. **Prerequisite enforcement.** Does the platform actually gate Practitioner behind Advanced completion, or is it self-selected? If self-selected, expect learners arriving without the mental model and bouncing.
7. **Scope of "field reports."** Some learners will not have real work that fits. Do we provide synthetic-but-rich scenarios as a fallback, drawn from the available substrate? (Likely yes.)
8. **Relationship to Skills marketplace.** Should Practitioner graduates be encouraged to publish a skill or plugin to `agentskills.io` as a capstone? Strong portfolio signal, but blurs into "build" rather than "practise."
9. **Platform spread.** Linguist's Advanced is multi-platform (Claude / ChatGPT / Gemini / Tines / Claude Code). Cyborg is Claude-Code-shaped. How tightly do we couple Practitioner to Claude Code? Recommendation: Claude-Code-primary, with explicit "the same shape on Tines / on the API" notes.

## 6. Cyborg-side open questions (status after 2026-05-05 reconciliation)

P4 (`04-cyborg-alignment.md` §6) raised seven open questions for the Cyborg team. Confirmed answers received 2026-05-05:

- **P4 Q1 (Version D / `trellis_analytics` free-zip status): RESOLVED.** Dropped entirely. Artefact of a previous version; no forward plans. Practitioner does not reference it.
- **P4 Q2 (Scenario Library indexing): SUPERSEDED.** The free-tier substrate is no longer "Scenario Library only" — it is a light Veralux subset (derived from the full Veralux being built). Stable deep-link IDs into a Library are no longer the relevant question; substrate-anchor stability is (folded into the live OQ#1 above).
- **P4 Q3 (Profile alignment — five profiles vs analyst-first): PARTIALLY RESOLVED.** Cyborg launches analyst-focused; the five-profile framing is being rethought, probably toward job-shape personas, but undecided. Practitioner stays general regardless. The remaining uncertainty is tracked as live OQ#3 above.
- **Still upstream-dependent:**
  - Live OQ#1 (substrate telemetry shape) — corresponds to P4 Q6 (activity-log shape) and parts of Q4 (prerequisite contract).
  - Live OQ#2 (role-variant timeline + forwarding) — new, follows from the "other roles as separate products later" answer.
  - P4 Q5 (AI tooling assumptions — standardise on Claude vs stay tool-agnostic) and P4 Q7 (Veralux canon leakage — what is quotable in public Linguist content) remain open and are deferred to the Practitioner authoring pass.
