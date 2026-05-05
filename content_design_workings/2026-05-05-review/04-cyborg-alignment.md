# Cyborg Alignment — Brief for Practitioner Tier Authors

*Date: 2026-05-05. Source of truth: `cyborg/planning/cyborg-environment-spec.md` (treated as fixed). Supporting reads: `08-assessment-versions.md`, `09-analyst-framework.md`, `02-philosophy-and-product.md`, `05-the-distinction.md`.*

---

## 1. Environment summary (one paragraph, share verbatim)

Cyborg is a one-week, first-week-on-the-job simulation. The candidate inherits a departed senior data IC's (Gordon's) desktop at fictional sports-data company **Veralux Analytics** and is asked to deliver real value in seven days using whatever AI tooling they bring (Claude bundled, others via SSH). The workspace is a Dockerised web desktop plus terminal, populated with a Linear-shaped Kanban (9 columns), a Slack-clone (Relay), a Notion-clone, a dbt repo, a Snowflake-like SQL UI, Tableau/Power-BI surfaces, Salesforce exports, Gong transcripts, and an in-house ops portal. The frame is explicit: **"ambiguity → information → decision"** and *"The workspace is overwhelming on purpose. The point isn't to clear the queue — it's to triage, investigate the right threads, and have something to say about it at the end of the week."* Activity (terminal, AI prompts/responses, file accesses, SQL, config edits) is captured and disclosed; the panel readout afterwards is graded against that log — *"the gap between what they did and what they say they did is the diagnostic."*

## 2. Free-tier vs paid-tier

Cyborg's commercial split (per `02-philosophy-and-product.md`, with the caveat doc 06 supersedes commercials in places):

- **Free — the Scenario Library.** A browsable, situation-indexed collection of 10-minute Cyborg "moves" with templates. Not a course, not a sandbox of Veralux. Each entry soft-routes to a paid Path. This is the discovery surface and what Practitioner learners can freely point at.
- **Paid — Cyborg.** Subscription. Includes (a) Core Paths (~20 lessons each, profile-curated), (b) the Template Pack, (c) Automation Recipes, (d) the Sandbox / Veralux assessment environment, (e) updates. The **one-week Veralux assessment, the 15 tensions, Gordon's brief, the live Interview-2 Q&A, and the panel readout are all paid surface.**

Practical implication for Practitioner: **the Veralux workspace itself is not a free practice sandbox.** The free practice surface is the Scenario Library plus whatever standalone artefacts (e.g. the Version-D `trellis_analytics` zip, per `08-assessment-versions.md`) Cyborg chooses to release. Practitioner should assume learners do *not* have free access to Veralux and design exercises around (a) the Scenario Library, (b) public/standalone repo zips when explicitly published as free, (c) Practitioner's own bespoke artefacts.

## 3. Skills/competencies Cyborg measures

Synthesised from the spec's bridging-design list and the analyst framework:

1. **Triage in noise** — *"Reading 150 tickets and picking the 3 worth working — that's a teachable skill, and it's the first thing a Cyborg candidate has to do."*
2. **Reading code other people wrote** — dbt models, annotated SQL, broken contracts; rarely starting from scratch.
3. **Reading conversations** — Slack threads, Gong transcripts, Notion comments. Distinguishing what was said from what was claimed.
4. **Async / partial information** — recommending under absent stakeholders and incomplete context.
5. **Knowing when to stop** — finishing two things well beats touching ten.
6. **Communicating the trail** — narrative is the deliverable; the panel question is *"how was your first week?"*
7. **Provenance before analysis** (from `08-assessment-versions.md`) — the structural fast path in every assessment version is broken-code → PR → Slack → done; the test is whether the candidate checks provenance before producing numbers.
8. **Distinguishing broken vs unfinished** — Version D's core inversion: code that compiles, tests that pass, numbers that are wrong.
9. **AI restraint and bullshit-detection** — the `.cursorrules`/CLAUDE.md traps test whether the candidate notices when the AI is hedging-suppressed or hallucinating certainty.
10. **The analyst framework spine (`09`):** *"Get to the load-bearing question. Establish what's solid. Name the gaps precisely."* Plus interview-the-person-then-the-transcript, decompose into Lookup/Synthesis/Human-judgment, co-generate, reproducibility-as-first-principle.

## 4. What Practitioner MUST cover

Direct mapping from #3 — these are prerequisites that make a learner viable in Veralux without being Cyborg itself:

- Ticket-queue triage as a method (read-before-act; choosing the 3 of 150).
- Reading inherited dbt / SQL / Python — orienting in a repo built by someone who left.
- Reading transcripts and Slack threads as primary sources, including the gap between live framing and recorded framing.
- Working under absent stakeholders: drafting recommendations with named gaps rather than assumptions.
- Stopping criteria and scope reduction.
- Narrative output: writing up a week of work as a defensible trail keyed to an activity log.
- Provenance habits: checking PR comments, schema.yml notes, manager notes before trusting upstream numbers.
- AI bullshit-detection drills: spotting confidently-wrong output, recognising when bot-suppression instructions in a repo are working against the learner.
- Reproducibility hygiene: pinned models, seeded RNG, deterministic SQL, Makefile-as-record.
- The decomposition vocabulary: Lookup vs Synthesis vs Human-judgment.

These are taught **on Practitioner's own toy material or on the Free Scenario Library**, never on Veralux content.

## 5. What Practitioner MUST NOT do

- **Do not reproduce or reference the 15 Veralux tensions, Gordon's character brief, the Interview-2 hidden extraction targets, or any hero-tier Veralux artefact.** These are paid, load-bearing, and single-use per candidate.
- **Do not publish solutions, walk-throughs, or "expected paths" for Versions A/B/C/D of the assessment** (`08-assessment-versions.md`). The fast-path-vs-slow-path mechanic only works once.
- **Do not replicate the assessment shape** (one-week sim, panel readout, activity-log diagnostic). Practitioner is preparation, not a parallel assessment.
- **Do not duplicate Cyborg's own Core Paths or Template Pack.** Practitioner sits *below* Cyborg in the stack — per `05-the-distinction.md`: *"Linguist: the reference manual. Cyborg: what you build with it."* Practitioner extends the manual; it is not a second build product.
- **Do not teach the hidden-comment / `.cursorrules` trick as a recognisable pattern** — naming it defuses it. Teach the underlying skill (notice when an AI is being instructed against you) on neutral examples.
- **Do not rebrand the Scenario Library inside Linguist.** That is Cyborg's free funnel; mirroring it competes with Cyborg.
- **Do not use Veralux names** (Gordon, Sandra, Marcus Chen, Tomasz, Dr. Watanabe, Trellis, LENS/ARC/Wearables, etc.) in Practitioner exercises.

## 6. Open questions for the Cyborg team

1. **Free-zip status of Version D (`trellis_analytics`).** `08-assessment-versions.md` recommends it be downloadable and `dbt build`-runnable. Is it free, paid, or under embargo while live assessments use it? Practitioner needs to know whether it can be referenced as a learner-facing artefact.
2. **Scenario Library indexing.** Will the Library expose stable URLs/IDs that Linguist Practitioner lessons can deep-link to? If yes, Practitioner can route to specific moves rather than re-teaching them.
3. **Profile alignment.** Cyborg uses five profiles (Operator, Founder, Specialist, Builder, Polymath) but `09-analyst-framework.md` is data-analyst-first. Should Practitioner align to the five-profile system, the analyst framing, or treat profiles as flavouring (per `05`'s "profiles become flavouring, not architecture")?
4. **Prerequisite contract.** Is there a stated "you should be able to do X before sitting Cyborg"? Practitioner's exit criteria need to match Cyborg's entry expectations exactly.
5. **AI tooling assumptions.** Spec says Claude is bundled, others via SSH. Should Practitioner standardise on Claude (Code + chat) for parity, or stay tool-agnostic?
6. **Activity-log shape.** Practitioner could teach learners to read their *own* activity log as a self-review habit — but only if the schema is stable and shareable. Is there a public spec of what Cyborg captures?
7. **Veralux canon leakage.** How strict is the embargo on canon details (LENS/ARC/Wearables, the defense-pivot tension T15)? Some are already in the environment spec we can quote — confirm what's quotable in public-facing Linguist content vs internal author docs only.
