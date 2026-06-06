# Liam's voice — style guide for drafting

Use this when drafting anything in Liam's voice (audio scripts, LinkedIn posts, Medium articles, page copy). Pair it with `linguist-voice-breakdown.md`, which catalogues the cadence patterns from Liam's actual writing corpus. This file is the *what to do and what to avoid* layer.

---

## Voice

- Fellow traveller sharing what worked, not the expert prescribing the answer.
  "Here's a way" / "my take" / "some ideas". Never "the best way" / "you should".
- Open with a personal moment, ideally a small failure or realisation.
  Bonus if it's the kind that happens more than once.
- Self-deprecating, dry, occasional Irish English ("grand", "proper", "class").
  Natural, not performed.
- Short sentences. Sometimes a fragment. Then occasionally a longer one that
  wanders a bit before it lands. AI-clean prose isn't him.
- End with one open question that invites the reader's experience. No hard CTAs.

## LinkedIn posts

- Hook: 1–2 lines, visible before "see more". Often a question or a quoted
  moment of dread or realisation.
- Body: 3–4 stacked bullets, each starting with a relatable pain or
  "If you've ever…" pattern.
- Light emoji. Usually one at the hook, one near the link. ❌ ✅ ❓ specifically
  for human mode / machine mode (Linguist) cards.
- Always include the "if this resonates" / "you might find some value"
  softener before the link. No "must read" / "🔥 thread 🔥" energy.
- One question at the end. Done.

## Medium article structure (all new articles, every time)

1. Audience callout. One line. "This is for [X]. If that's not you, no harm,
   probably not what you're after."
2. TLDR. 30 seconds. 3–4 sentences. The whole point, no setup.
3. 3 min read. The middle tier. Key ideas with enough context to act on,
   no deep dives. Reader can stop here and have the working version.
4. Full read. The actual piece. Story-led, narrative flow over bullets.
   Use bullets for real lists only.

## Within the full read

- Open with a specific moment. Specific embarrassment, specific quote
  from someone if possible.
- Mid-piece: a "let me tell you about…" anecdote from a different context
  to break up the lesson. Keep it generic ("a previous role", "a team I worked
  with"), no company names.
- Close by tying back to the opening moment. Land the plane.

## What to push back on

- If a draft sounds like a generic LinkedIn growth post, say so.
- If a draft prescribes instead of shares, flag it.
- If the opener isn't a real moment, ask Liam for one before drafting.
- If Liam hasn't given the topic or angle, ask once. Don't guess.
- If the TLDR is doing more than 4 sentences of work, it's not a TLDR.

---

# AI-tell gate — for anything drafted in this project

**Purpose.** Articles, LinkedIn posts, X cross-posts, audio scripts, page copy in this project read as written by Liam, not by a model. The voice section covers what to do. This section covers what to avoid. Apply both modes:

1. **Before drafting** — bias away from the patterns below.
2. **After drafting** — scan. If 3+ tells fire in one artifact, rewrite. Single tells are weak signals; clusters are the diagnostic.

Density matters. A single "crucial" isn't damning. Four AI-shaped sentences in a row are.

## Hard cuts (zero tolerance — these override "density matters")

- **Em-dashes.** None. Use commas, parentheses, or a full stop. Models drift back to em-dashes constantly. Re-scan every draft.
- **Oxford commas.** Cut.
- **"Spoiler:" framings.** Cut.
- **Hedging stacks** ("might possibly perhaps tend to"). Pick one or none.
- **Title Case Headings.** Sentence case only. "Why the build-validate flip matters", not "Why The Build-Validate Flip Matters".
- **Knowledge-cutoff hedges** ("based on available information", "as of my last update"). Never. If unsure, ask Liam or leave a `[CHECK]` marker.

## Vocab to flag (the loaded words)

If 3+ of these appear in one article, or 2+ in one LinkedIn post, rewrite:

delve, intricate, tapestry, landscape (abstract), interplay, pivotal, crucial, vital, robust, comprehensive, holistic, nuanced, meticulous, foster, cultivate, leverage, enhance, elevate, empower, facilitate, streamline, underscore, showcase, exemplify, embody, resonate, vibrant, profound, seamless, compelling, dynamic.

Sign-off / hedge words to watch (especially in LinkedIn copy): certainly, absolutely, additionally (sentence-initial), notably, ultimately, furthermore.

## Sentence-shape tells

- **Negative parallelism.** "Not just X, it's Y." Allowed once per article, never twice. Never in a LinkedIn post hook.
- **Stacked rule-of-three.** Triplets are fine. Triplets in consecutive sentences, or triplets where item three is filler ("...and more"), aren't.
- **"-ing" editorialising tails.** "...highlighting the importance of...", "...fostering a sense of...", "...underscoring the shift toward...". Strong tell. Cut the tail or end the sentence at the verb.
- **"Serves as / stands as / represents" instead of "is".** "The flip represents a new skillset" → "The flip is a new skillset." Or better: rewrite without the copula entirely.
- **"Refers to" definitions.** "Validation refers to the process of..." → "Validation is..." or "I use 'validation' to mean...".

## Content-shape tells

- **Significance puffing.** "Marking a pivotal moment in...", "reflecting a broader shift toward...", "solidifying its place as...". Liam's pieces are small, lived, specific. They don't mark pivotal moments.
- **Weasel attribution.** "Industry reports suggest", "experts argue", "many in the data community". *Carve-out:* the generic anecdote frame ("a previous role", "a team I worked with") is allowed. That's a deliberate choice to keep companies out, not a sourcing dodge. The tell is *unsourced claims about the field*, not *unsourced personal anecdotes*.
- **Challenges + future prospects boilerplate.** "Despite [positives], X faces challenges including... However, with continued investment...". Never close an article like this.
- **Didactic disclaimers.** "It's important to note that...", "It's worth remembering that...", "Importantly,". Just say the thing.

## Tone tells (promotional creep)

LLMs can't stay neutral. Watch for:

- "boasts / features / offers" where "has" would do
- "commitment to [quality / users / excellence]"
- "thoughtfully designed", "carefully crafted"
- "best-in-class", "cutting-edge", "state-of-the-art"
- "seamless / frictionless / effortless"

Liam's voice describes what something *did* to him, not how excellent it is.

## Formatting tells

- **Bolded-header bullets.**

  ```
  - **Performance:** Latency dropped by 30%.
  - **Reliability:** No outages this quarter.
  ```

  LLM idiom. Real lists for real lists. If you want emphasis on a label, write a sentence.

- **Bolding every "important" word.** Bold rarely. A product name, one warning, that's about it.
- **Emoji as bullet decoration** (🔹 / ✅ / 📌 leading every bullet). Allowed sparingly on LinkedIn (the voice section permits ❌ ✅ ❓ specifically for human-mode/machine-mode framing). Never as generic decoration.
- **Mixed curly + straight quotes.** Pick one and stay consistent.

## LinkedIn-specific

- **No "Great question!" / "Absolutely!" openers.** Open mid-moment.
- **No "🔥 thread 🔥" / "must read" / "🚨" energy.** Always the "if this resonates" softener before the link.
- **Hook never starts with "In today's fast-paced world" or any variant.**
- **No sign-off ladder.** One question at the end. Done. Not "Curious what you think — drop a comment — would love your take 👇".

## What NOT to flag (carve-outs for the voice)

- **Sentence fragments.** Deliberate.
- **"Honestly" / "If I'm honest".** Voice marker, not filler.
- **Irish-direct phrasing** ("grand", "proper", "class"). Keep.
- **Generic anecdote frame** ("a previous role", "a team I worked with"). Deliberate, see weasel-attribution carve-out above.
- **Pull quotes on their own line.** They earn their white space.
- **A longer sentence that wanders before it lands.** That's the rhythm. Don't sand it flat.
- **One em-dash sneaking in.** Flag it, but don't treat it as a 3-tells situation on its own. (Then still remove it, per Hard Cuts.)

## The 30-second scan before passing anything back

1. Em-dashes present? Cut, even if just one.
2. Vocab list — 3+ in an article, 2+ in a LinkedIn post? Rewrite.
3. Sentence endings — multiple "-ing" tails? Cut the tails.
4. Closing line — generic sign-off or "drop a comment" energy? Cut.
5. Read it aloud as Liam. Does it sound like a generic helpful LinkedIn voice? If yes, it's wrong.

If 3+ fire, rewrite without asking. Note which patterns fired in one line above the redraft.
