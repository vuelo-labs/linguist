# W4-C — Renumbering hygiene + coherence cleanup

## Files touched

- [x] `01-mental-model.md` — Skills `/skills` activation note (→ L7); tool-intro stale framing tightened; forward-pointer to L4 Compaction API; closing forecast to L6 taxonomy added.
- [x] `02-communication-primitives.md` — provenance hedge added at the system-prompt claim; `output_config.format` callout trimmed to a one-sentence pointer to L5.
- [x] `03-session-hygiene.md` — hooks parenthetical (→ L7); CLAUDE.md hierarchy parenthetical added to Memory comparison table.
- [x] `04-context-awareness.md` — Memory row gains "(lifetime + audit covered in L3)"; `context: fork` row gains "(Skill anatomy: see L7)".
- [x] `05-output-engineering.md` — Advisor row gains "(see Layer 9 for the full Advisor pattern)".
- [x] `06-tool-fluency.md` — filename pointer `07-skills-plugins-hooks.md` added; closing pointer renumbered "Layer 7 — Skills, Plugins, Hooks".
- [x] `07-skills-plugins-hooks.md` — heading → "Layer 7"; `status:` frontmatter dropped; voice nits at :8 and :80 fixed; L7→L8 cross-refs renumbered (intro, "How this composes", subagent depth pointer).
- [x] `08-agent-design.md` — heading → "Layer 8"; `managed-agents-memory-advisor.md` filename refs all gained "Layer 9" prefix; sub-agent cache-sharing section gains back-ref to L10 Skill 18; Next section reframed around L9 then L10.
- [x] `09-managed-agents-memory-advisor.md` — heading kept "Layer 9"; placeholder line dropped; `status:` frontmatter dropped; all L7 refs to in-CLI agent design renumbered to L8; L6.5 → L7; L8 → L10 references corrected; references list updated.
- [x] `10-production-architecture.md` — heading → "Layer 10"; "eight layers" → "ten layers".

## Coherence findings applied

All 14 Updates and the relevant 7 Nits in scope from `wave2.5/coherence-readout.md` §2 (excluding the two Blockers, already done in W2.5, and the `00-index.md` items deferred to W4-D):

- §2.2: L1 Skills activation half-truth; CLAUDE.md hierarchy in Memory table (Update). `output_config.format` near-duplicate (Nit) handled by trim.
- §2.3: L2 ↔ L5 redundancy trimmed (Update). 03↔04 toolkit overlap left as forecast (Nit deferred per readout).
- §2.4: L4 reverse-pointer to L7 (Update); L3 hooks → L7 pointer (Update); L6 filename pointer (Update).
- §2.5: L3↔L4 Memory cross-ref (Update); L1 callout closing forecast to L6 (Update); L5 Advisor → L9 forecast (Nit promoted).
- §2.6: L1 tool-intro stale framing tightened (Update); L1 compaction → L4 forward pointer (Nit); L2 source-prompt provenance hedge (Nit).
- §2.1: L7 voice nits at :8 and :80 fixed.

## Deferred / out of scope

- `00-index.md` items: handed to W4-D.
- `claude-code-best-practices*.md`: handled by W4-A and W4-B.
- L5 `output_config.format` framing: kept (L5 is now sole owner; L2 trimmed to pointer).
- L1 sub-agent taxonomy nit at :201 and L5 internal Skill 13/14 cross-ref at :47 left as-is per readout (Nit, "leave").
- Date-stamp tightening (Nit in §2.7): out of scope for this pass.

No new sections introduced; profile language avoided; voice preserved.
