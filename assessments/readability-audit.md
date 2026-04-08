# Readability Audit -- Formatting and Scannability

**Auditor:** Editorial/UX writing review
**Date:** 2026-04-08
**Sample:** 7 module pages (B-01, B-05, B-07, E-01, E-04, A-05, A-07), 3 supporting pages (Guide, Booklet, Handbook)

---

## Executive Summary

The course modules have a strong and consistent structural rhythm -- Intro, Concept/What is happening, Exercise, Copy-Personalise-Use, What good looks like, If this did not work, Next -- that makes every page predictable and navigable after the first visit. Prose quality is high: paragraphs are short, sentences are plain, and the voice is controlled throughout. The most significant formatting problem is in the "How to personalise it" / "How to edit this" sections, where individual template placeholders are presented as consecutive bold-lead paragraphs rather than as a list, creating a visual wall of text that the reader must parse linearly when a definition list or bullet list would let them scan. A second site-wide issue is the overuse of `<hr>` dividers between every section, which fragments pages that would read more naturally with headers alone providing the section breaks -- the horizontal rules impose a visual full-stop where a softer transition would serve better. The blockquote format for exercise templates works well and is instantly recognisable across all modules. The numbered list in B-07 ("four signals") is a strong example of the right format for the right content. The advanced modules (A-05, A-07) introduce tables and longer prose blocks that are well-suited to their audience but occasionally run long without a visual break. The three supporting pages (Guide, Booklet, Handbook) each use a distinct layout vocabulary -- card grids, principle rows, pattern blocks -- and the formatting choices within each are well-matched to their purpose; the Handbook's long prose sections are appropriate for their depth but would benefit from occasional pull-out summaries.

---

## Page-by-Page Findings

### B-01: Your First Message

**Prose blocks.** Paragraph lengths are well-calibrated. No paragraph exceeds four sentences. The single long paragraph in "If your response looks different from what you expected" is dense but acceptable -- it covers a single thought and does not try to teach multiple things.

**Bullet lists.** The `<ul>` under "If it asks you to upgrade" (listing Claude.ai, ChatGPT, Gemini) is a good use of bullets for genuinely parallel items. No bullets are misused.

**Blockquotes.** The exercise messages (`"What is the capital of France?"`, the chicken-and-rice message, the new-role variant) are wrapped in `<blockquote>` and are immediately distinguishable from body text. This is working well.

**Headers and section breaks.** The page has seven `<hr>` dividers and seven `<h2>` headers. Each `<hr>` is paired with a following `<h2>`, making the `<hr>` redundant -- the header alone would create a sufficient visual break. The "Where to type" section has five `<h3>` subheadings (one per platform), which is the right structure for reference content that readers should dip into selectively. However, the platform instructions are all single paragraphs of prose that pack a lot of sequential steps into one block. For a low-confidence audience, numbered steps would be easier to follow than prose for procedural instructions like "Type or paste your message there. Press Enter... The response will appear below your message. To start a fresh conversation later, click New chat."

**Overall rhythm.** Good. The page reads naturally from top to bottom. The two exercise variants (default and newrole) are hidden by profile logic, so a given reader sees only one -- no duplication friction.

**Specific issue.** The "Where to type" platform sections present procedural instructions as prose paragraphs. For the target audience (low tech confidence), a numbered list of 3-4 steps per platform would be faster to follow while actually doing the task.

---

### B-05: One Thing at a Time

**Prose blocks.** The "What is happening" section has three short paragraphs that flow well as prose -- this is explanatory content where a list would break the argument.

**Bullet lists.** The comparison questions under Step 3 ("What did Version A change...") are correctly formatted as `<ul>` bullets -- they are genuinely parallel questions.

**Blockquotes.** Four blockquote templates appear across the exercise. Each is clearly differentiated. No issues.

**The "How to personalise it" section -- key problem.** Lines 132-138. The four bracketed placeholders (`[verb]`, `[the specific thing]`, `[one relevant detail]`, `[stopping condition]`) are each presented as a standalone `<p>` with a bold lead. This is the wrong format. These are definition items: a term and its explanation. They should be either a `<ul>` with bold lead terms or a `<dl>` (definition list). As standalone paragraphs, they read as four separate ideas rather than four parts of a single template. The reader has to mentally reconstruct the relationship between the template above and the four explanations below. A list format would make that relationship immediate.

This pattern recurs across nearly every module page that has a Copy-Personalise-Use section and is the single highest-priority formatting fix in the audit.

**Headers and section breaks.** Six `<hr>` dividers, all paired with `<h2>` headings. Same redundancy as B-01.

**Overall rhythm.** Strong. The exercise has a clear Step 1 / Step 2 / Step 3 progression with interleaved blockquote templates.

---

### B-07: What Just Happened? Reading AI Output

**Prose blocks.** The "What is happening" section balances prose explanation with a transition into an ordered list of four signals. This is well-structured -- the prose sets up the list, and the list delivers the scannable content.

**Numbered list.** The four signals (generic language, wrong framing, made-up details, outdated information) at lines 69-74 are correctly formatted as `<ol>`. Each item uses a bold lead phrase followed by an explanatory sentence. This is one of the best-formatted sections in the sample.

**The output review checklist -- format mismatch.** Lines 86-97. The four checklist questions are presented as individual `<p>` elements with bold numbering and `<br>` separating the number-heading from the elaboration. This is functionally a numbered list but is not marked up as one. It creates a visual ambiguity: the reader sees four items that look like paragraphs but function as list items. Compare this to the "take-home reference" at lines 138-143, which presents the same four questions as a proper `<ol>`. The inconsistency means the reader encounters two different visual treatments of the same checklist on the same page. The first (exercise) version should match the second (reference) version, or the first version should be a styled checklist with the elaboration text included.

**Blockquotes.** The feedback template at line 107 works well.

**The "How to personalise it" section.** Same problem as B-05 -- three bracketed placeholders presented as individual bold-lead paragraphs instead of a list.

**Overall rhythm.** Good, but the duplicated checklist creates slight confusion about which version is "the" checklist the learner should keep.

---

### E-01: The First Word Matters

**Prose blocks.** The "concept" section (lines 67-74) uses prose effectively to build an argument. The paragraph at line 74 starting "Some verbs have a clear ceiling..." is particularly well-constructed -- it makes a conceptual distinction that would not work as bullets.

**The `.keynote` element.** Line 72: `"The difference is not the task. It is the first word."` This is a single-line callout styled differently from body text. It works well as a visual anchor.

**Bullet list.** The three comparison questions at lines 103-107 are correctly formatted as `<ul>`.

**Blockquotes.** Two exercise templates (Version A and Version B) at lines 88-98 are clearly formatted. The restate starter at line 119-121 is clean.

**The verb reference description.** Lines 136-138. This is a prose paragraph that lists seven safe verbs and five risky verbs in running text. For a reference that learners are told to "keep" and "use in every module," this information would be faster to scan as two short lists (safe verbs / risky verbs) rather than embedded in a sentence. This is a minor issue since the full reference lives at its own URL, but the inline summary could still be more scannable.

**Headers and section breaks.** Part 1 and Part 2 are both under the same `<h2>` ("The exercise") but separated by an `<hr>`. This means Part 2 looks like a new top-level section when it is logically a subsection of the exercise. The `<hr>` before Part 2 could be removed, or Part 2 could be introduced with a lighter visual separator.

**Overall rhythm.** Good. The page is longer than the B-series pages but appropriate for its audience stage.

---

### E-04: Restate, Don't Patch

**Prose blocks.** The "concept" section (lines 61-73) uses long-form prose to build a narrative about correction spirals. This is the right format -- the argument depends on flow, not on scannable items. The three paragraphs build on each other and would not work as bullets.

**Numbered list.** The three spiral signals (lines 81-84) are correctly formatted as `<ol>`. Strong use of a list for genuinely parallel diagnostic criteria.

**Bullet list.** The "write a new first message" checklist (lines 110-114) uses `<ul>` to list course concepts by module reference. This is effective -- each bullet is a link back to a prior module.

**Blockquote.** The restate starter template (lines 124-126) is clean and recognisable.

**The "How to edit this" section.** Lines 130-141. This is a `<ul>` with bold lead terms. This is the correct format for the template placeholder definitions. Notably, this page gets the format right where B-05 and B-07 get it wrong. The difference: E-04 uses `<ul><li><strong>[term]</strong> -- explanation.</li></ul>` while B-05/B-07 use standalone `<p><strong>[term]</strong> -- explanation</p>`. The E-04 approach should be the site-wide standard.

**Overall rhythm.** Strong. The page handles a conceptually dense topic (when to abandon a thread) with a clean escalation: concept, recognition, exercise, template.

---

### A-05: Context Awareness and Compaction

**Prose blocks.** Several sections use long prose blocks appropriate for an advanced audience. The "What compaction is" section (lines 57-61) is three paragraphs of explanatory prose. The third paragraph ("Most AI users do not know this happens...") functions as a motivational aside and reads well as prose.

**Bullet lists.** Two lists -- "What compaction preserves" (8 items) and "What compaction loses" (6 items) -- are correctly formatted as `<ul>`. These are genuinely list-like: parallel items that should be scannable independently.

**Table.** The "Symptoms of context rot" table (lines 105-134) is well-suited to a two-column signal/meaning format. This is one of the few tables in the sample and it is used correctly -- tabular data with a clear key-value structure.

**Blockquotes.** Four blockquotes appear, each containing example messages a user might send. These are longer than the B-series templates and include multi-paragraph content. They remain readable, but the longest one (lines 194-201, the "Decision for this document" example) is dense. Its internal structure -- a heading phrase, a numbered list within the blockquote, and a concluding constraint -- is all rendered as `<p>` tags. The numbered items within the blockquote (the three themes) use `<br>` instead of an `<ol>`, which works visually but loses semantic structure.

**The "Without / With" paired examples.** Lines 136-158 and 176-201. These are presented as consecutive prose paragraphs under `<h3>` subheadings. The without/with pattern is a good structural choice, but the lack of visual differentiation between the "without" and "with" paragraphs means the reader must track which is which by reading the first word of each paragraph. A lighter card or indent treatment for the "without" scenario (the negative example) would improve scannability.

**Bullet lists for "What to do" and "When to checkpoint."** Lines 169-174 and 214-219. Both are correctly formatted and appropriately short.

**The compaction survival checklist.** Lines 228-233. Correctly formatted as `<ol>`. The items are longer than ideal for a numbered list (one item runs to two sentences with an em dash clause), but this is appropriate for the advanced audience.

**Overall rhythm.** This is the longest module page in the sample. The density is justified by the topic, but the page would benefit from a single visual marker (such as the `.keynote` element used in E-01) to anchor the core takeaway: "explicit beats implicit, standalone beats buried, named beats described" (line 93). That sentence currently sits as one `<p>` with a `<strong>` tag. It deserves the same callout treatment that E-01 gives to "The difference is not the task. It is the first word."

---

### A-07: Tool Fluency

**Prose blocks.** The tool hierarchy section (lines 67-79) presents five tool descriptions as consecutive paragraphs, each with a bold tool name lead. This is a borderline case. The content is genuinely explanatory (each tool paragraph includes a "use this when" clause), so prose is defensible. However, the five tools are parallel items that the reader will return to as reference. A hybrid format -- a styled list or definition list with the tool name as term and the description as definition -- would serve both the first-read (explanatory) and re-read (reference) use cases.

**The cost hierarchy line.** Line 79: `Read / Glob / Grep -> Bash -> Agent`. This is rendered as a `<code>` element within a `<p>`. It functions as a visual summary and works well.

**Blockquotes.** Four blockquote templates appear. They are well-differentiated from body text and clearly function as "type this" examples.

**The "Without / With" paired examples.** Same format as A-05. Same issue: consecutive prose paragraphs without visual differentiation between the negative and positive examples.

**The exercise.** Lines 132-168. Part 1 has three sub-tasks (Task A, B, C), each with a bold label, an explanation, and a suggested message. The bold-label-then-prose format works here because the tasks are sequential and the explanations are integral, not just definitions. Part 2 has two blockquote versions (free choice vs. named tool) which compare well.

**The "How to edit this" section.** Lines 182-187. Correctly formatted as `<ul>` with bold lead terms -- consistent with the E-04 approach.

**Overall rhythm.** The page is long but well-structured. The alternation between explanatory prose and concrete examples creates natural breathing points.

---

### Guide (`/guide/index.html`)

**Format vocabulary.** This page uses a completely different layout: framework cards (4-up grid), prompt pairs (side-by-side columns), and principle cards (2-up grid). None of the module page formatting patterns appear here.

**Framework cards.** The four-step framework (Think, Collab, Dispatch, Iterate) is presented as cards with a step number, title, body, and italic note. This is well-suited to the content -- four parallel concepts that benefit from visual equality.

**Prompt pairs.** The six before/after pairs use a two-column layout with a "less effective" / "more effective" split. This is the strongest visual format in the entire site. The left/right comparison is immediate and the captions below each pair reinforce the lesson. No issues.

**Principles grid.** The eight principles are presented as cards in a 2-up grid. Each has a number, title, and body. The titles use line breaks (`<br>`) to create two-line headings, which is a deliberate typographic choice that works well for short, punchy statements.

**Overall.** The Guide page is well-formatted and takes advantage of its different purpose (showcase, not instruction) to use a richer layout vocabulary. No readability issues.

---

### Booklet (`/pdf/index.html`)

**Format vocabulary.** Print-oriented layout with a framework grid, principle blocks (each with title, body, and a "pattern" code block), and a tips section.

**Pattern blocks.** Each principle includes a monospace "pattern" block that summarises the principle in a key:value pseudo-code format. This is a distinctive format that works well for a reference document intended to be printed and pinned up. The visual distinction between serif body text and monospace pattern blocks is strong.

**Tips section.** Eight tips presented as styled rows with title, body, and optional pattern snippet. The format is clean and scannable.

**Overall.** The Booklet is well-formatted for its purpose. It uses a different voice (more conversational, second-person, contractions) than the course modules, which is appropriate for a standalone reference.

---

### Handbook (`/handbook/index.html`)

**Prose blocks.** This is the most prose-heavy page in the sample. Each of the four parts (Think, Collab, Dispatch, Iterate) runs to 4-6 substantial paragraphs. The prose quality is high and the paragraphs flow well, but some individual paragraphs are long -- notably the "Voice memo" paragraph in Part 1 (line 408) at 6 sentences, and the "The single most leveraged investment..." paragraph in Part 2 (line 453) at 4 dense sentences covering a concept that would benefit from being broken into two.

**Machine-version blocks.** The monospace example blocks (conversation fragments, before/after dispatches, context documents) are well-differentiated from body text. They serve the same function as blockquotes in the module pages but use a richer visual treatment (background colour, left border, monospace font). This is appropriate for a longer document where more visual variation helps the reader maintain orientation.

**The principle rows in Part 5.** Each of the eight principles gets three paragraphs: "where it matters most," "what to do specifically," and a third paragraph that varies (harder version, emotional component, counterintuitive aspect). These three paragraphs are not labelled or visually differentiated -- the reader must notice the bold lead phrases to scan. For a section that is explicitly "applied" rather than "restated," a lighter structural treatment (bold subheads within each principle, or a distinct visual style for the "what to do specifically" paragraph) would help the reader jump to the actionable part.

**Blockquotes.** Two pull-quotes appear: "Stop when it's good. Not when it's perfect." (line 567) and "The machine will wait. Go be human." (line 677). These use centred italic styling with decorative rules above and below. They function well as visual anchors in a long document.

**Overall.** The Handbook reads well end-to-end for a motivated reader, but its length (approx. 3500 words of body text) and uniform paragraph-after-paragraph rhythm mean there are few visual entry points for someone returning to find a specific technique. The machine-version blocks and pull-quotes are the only non-paragraph elements in most sections.

---

## Recommendations

### Site-wide (high priority)

**1. Convert "How to personalise it" / "How to edit this" placeholder definitions to `<ul>` lists.**
Currently, B-05, B-07, and E-01 present template placeholder definitions as consecutive bold-lead `<p>` elements. E-04 and A-07 already use `<ul><li><strong>[term]</strong> -- explanation.</li></ul>`. Adopt the E-04/A-07 format across all modules. This is the single highest-impact formatting change in the audit. It affects every module that has a Copy-Personalise-Use section.

**2. Remove `<hr>` dividers that are immediately followed by an `<h2>`.**
Every module page uses `<hr>` before every `<h2>`. The headers alone provide sufficient section separation. The horizontal rules add visual weight that fragments the page. Remove the `<hr>` elements and let the `<h2>` styling (plus any existing top-margin/padding) create the section break. If the design requires additional separation, increase the `margin-top` on `.module-body h2` in the CSS rather than using presentational `<hr>` elements. This would tighten the vertical rhythm across all module pages.

### Site-wide (medium priority)

**3. Standardise the "Without / With" example format in advanced modules.**
A-05 and A-07 use paired "without" and "with" paragraphs under `<h3>` subheadings. These would be more scannable with a lighter visual treatment -- even a simple CSS class that gives the "without" paragraph a muted left border or subtle background, similar to how the Guide page differentiates "less effective" and "more effective" columns.

**4. Introduce a `.keynote` callout class for core takeaways and use it consistently.**
E-01 uses `<p class="keynote">` for its central insight. A-05 has a similar anchor sentence ("explicit beats implicit, standalone beats buried, named beats described") that is rendered as a plain `<strong>` paragraph. Applying the `.keynote` treatment to the one or two most important sentences per module would give readers a visual anchor to return to.

### Page-specific fixes

**5. B-01: Convert "Where to type" platform instructions from prose to numbered steps.**
Each platform section (Claude.ai web, Claude.ai desktop, ChatGPT, Gemini) presents 3-4 procedural actions as a single prose paragraph. For the target audience (low tech confidence, first time using an AI tool), numbered steps would be significantly easier to follow while actively performing the task.

**6. B-07: Resolve the duplicate checklist format.**
The output review checklist appears twice on the page: first as bold-numbered `<p>` elements with elaboration text (the exercise version), then as a clean `<ol>` (the take-home reference). The exercise version should either match the `<ol>` format of the reference version (with the elaboration text retained as a second line or sub-item), or the two should be visually linked so the reader understands they are the same checklist in two contexts.

**7. E-01: Consider listing the safe/risky verb summary as two short lists.**
Lines 136-138 name seven safe verbs and five risky verbs in running prose. Since this summary is meant to orient the reader before they visit the full verb reference page, a quick-scan format (two short `<ul>` lists) would serve better than a sentence the reader has to parse linearly.

**8. A-05: Use semantic markup for the numbered items inside the "Decision for this document" blockquote.**
The three themes at lines 197-199 are currently rendered with `<br>` line breaks inside a `<p>`. Converting to a `<ol>` within the blockquote would give the example the same structural clarity it is teaching the reader to use.

**9. Handbook: Add visual markers to the "what to do specifically" paragraphs in Part 5.**
Each of the eight principle-in-practice sections has three paragraphs of equal visual weight. The middle paragraph ("What to do specifically") is the most actionable. A bold subhead or a distinct indent would let a returning reader jump directly to the practical instruction.

### What is working well (no changes needed)

- **Blockquotes for exercise templates** are instantly recognisable and clearly differentiated from body text across all module pages.
- **The consistent section structure** (Intro, Concept, Exercise, CPU, What good looks like, If this did not work, Next) is a genuine strength. After one or two modules, readers can predict where to find what they need.
- **Numbered lists for diagnostic criteria** (B-07's four signals, E-04's three spiral signals, A-05's compaction survival checklist) are used correctly and consistently.
- **The Guide page's prompt-pair format** is the strongest visual teaching format on the site.
- **The Booklet's pattern blocks** are well-suited to a pin-up reference document.
- **Paragraph length control** is strong across all pages. Almost no paragraph exceeds four sentences in the module pages.
- **The Handbook's long-form prose** is appropriate for its purpose and audience. The writing quality sustains the reader through dense material.
