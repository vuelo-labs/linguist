# 06 -- Gap Analysis: Conservative Review

_Produced 2026-04-03. Assesses whether content from `llm_intro_guides.md` warrants changes to the Linguist curriculum._

---

## 1. Executive Summary

The Linguist course is a communication course, not a platform documentation project. Its build context states this in plain terms: "NOT a prompt engineering course. NOT an AI upskilling platform." The reference guide (`llm_intro_guides.md`) is a getting-started-with-platforms document covering API endpoints, pricing tables, SDK installation, rate limit tiers, and model comparison matrices. The vast majority of this content is technical reference material that belongs in platform help docs, not in a course that teaches people to notice whether they are talking to a human or a machine. The existing course already handles platform orientation (B-03), sign-up and first-message mechanics (B-01), cost awareness (A-01), and multi-platform support (B-01, B-03, B-09) at exactly the level of depth appropriate for its audience. The guide's content should be kept out almost entirely, with one narrow concession noted below.

---

## 2. Content to KEEP OUT

### 2.1 Pricing tables (all three platforms)

The guide contains six pricing tables with per-million-token rates for specific models. These should not be added to Linguist for three reasons:

1. **They are wrong by definition.** The guide itself references models that have already been "retired from the ChatGPT interface." Pricing changes quarterly or faster. Any table in the course will be stale before the next learner cohort reaches it. The build context demands content that "changes how you communicate forever" -- not content that expires in 90 days.

2. **The course already handles cost at the right level.** A-01 teaches tokens as a concept, gives worked cost examples using approximate rates, and explicitly says "Pricing changes over time. For current per-token rates, check anthropic.com/pricing." This is the correct design: teach the mental model, point to the source of truth for numbers.

3. **The audience does not need this.** The build context's audience profile (`project_linguist_audience.md`) specifies low general tech confidence. Per-million-token pricing tables are meaningless to someone who has never sent an AI message. The B-series learner needs to know "this is free" or "this costs money." A-01 handles the latter. The former is covered by B-01's platform instructions which direct learners to free tiers.

**Recommendation:** Keep out entirely.

### 2.2 API documentation (all three platforms)

The guide contains Python code samples, SDK installation commands (`pip install openai`, `npm install openai`, `google-genai`), API endpoint descriptions, REST vs gRPC comparisons, and environment variable setup for three platforms.

This is developer reference documentation. Linguist's B-series and E-series explicitly avoid technical jargon -- the spec for B-01 says to avoid the word "prompt" itself. API documentation belongs in platform docs, not in a communication course. Even the A-series (Claude Code) teaches `npm install` only for Claude Code itself (A-00), and only because installation is a prerequisite for using the tool.

The X-series (Builder stage) includes X-01: API Fundamentals as a future planned module. If API content is ever needed, it has a designated home. Importing API docs from a third-party guide into the existing curriculum would be scope drift.

**Recommendation:** Keep out entirely.

### 2.3 Model comparison tables

The guide ends with a comparison table: free chat access, cheapest paid plan, cheapest API model, largest context window, official SDKs, OpenAI API compatibility. It also includes a "where to start based on your role" section.

Linguist does not teach learners to choose the "best model." The build context is explicit: "NOT an AI upskilling platform." The course is platform-agnostic by design -- B-01 gives orientation for Claude, ChatGPT, Gemini, and Tines. B-03 does the same for navigation. B-09 does the same for persistent instructions. The course already says "find your platform below, read only the one you are using." Asking the learner to compare platforms and choose the optimal one is the opposite of the course's philosophy, which is to reduce cognitive load and get people communicating with whichever tool they already have.

Adding model comparisons would also violate the build context's "What to avoid" section: no "upskill/productivity/optimisation language."

**Recommendation:** Keep out entirely.

### 2.4 Rate limits and tier systems

The guide details rate limit tiers for all three platforms: RPM, RPD, TPM, TPD limits, tier graduation based on cumulative spend, per-organisation vs per-model limits, HTTP 429 throttling. This is operational reference material for developers building production systems.

No Linguist learner at any stage needs to know about RPM limits. The B-series learner needs to know "when limits are reached, a prompt to upgrade appears" -- which is self-evident from the platforms themselves. The A-series learner using Claude Code needs to know about cost (A-01 covers this) but not about rate limit tier graduation. If rate limits become relevant, they belong in X-series (Builder stage) alongside API Fundamentals.

**Recommendation:** Keep out entirely.

### 2.5 Platform-specific prompting flags and parameters

The guide covers: `reasoning_effort` parameters, `thinking_level: "high"`, temperature settings (`temperature at the default 1.0`), prompt management dashboards with `{{variable}}` syntax, XML-style structural delimiters, and model-specific behavioural notes (e.g., "Grok 4 is always a reasoning model").

These are platform-specific mechanics. Linguist teaches transferable communication skills: verb choice, constraints, stopping conditions, context loading, re-seeding. These work on any platform. Teaching learners to set `thinking_level: "high"` on Gemini ties the course to one platform's parameter surface and teaches a mechanic that may not exist next quarter.

The build context says the course teaches "one skill: know whether you're talking to a human or a machine, and communicate accordingly." Platform-specific parameter tuning is the opposite of this.

**Recommendation:** Keep out entirely.

### 2.6 SDK and third-party integration lists

The guide lists SDKs (Python, Node.js, Go, Java, .NET, xai-sdk), third-party framework integrations (LangChain, LlamaIndex, CrewAI, Vercel AI SDK), and IDE extensions (VS Code, IntelliJ). This is a developer ecosystem map.

Linguist is not a developer ecosystem guide. Even the A-series (Claude Code) treats SDK knowledge as out of scope -- the learner installs Claude Code via npm and that is the extent of package management. The X-series has planned modules for API Fundamentals and Tool Definition, which is where SDK content would live if it were ever needed.

**Recommendation:** Keep out entirely.

### 2.7 "Every way to access" platform lists

The guide catalogues every access path for each platform: web apps, mobile apps, desktop apps, companion windows, IDE integrations, enterprise services, coding agents, research assistants, filmmaking suites. This is a product catalogue.

B-03 (Platform Orientation) already tells the learner where to type, where responses appear, and where settings live. That is all the learner needs. A product catalogue of 15+ access paths per platform would overwhelm the audience and contradict the build context's "build the simplest thing that teaches that" directive.

**Recommendation:** Keep out entirely.

### 2.8 Official prompting guidance from each platform

The guide summarises each platform's official prompting documentation: OpenAI's prompt engineering guide, Google's prompting strategies, xAI's guidance. These summaries cover few-shot learning, message roles, system messages, evaluation metrics, and structural delimiters.

Linguist already teaches prompting -- but as communication, not engineering. The E-series covers verb choice (E-01), constraints (E-02), context loading (E-03), and output review (E-05). These are the same underlying skills described in platform prompting guides, but taught through the Linguist lens of "communication with a machine." Importing platform-branded prompting advice would duplicate existing content with different vocabulary and undermine the course's identity. The build context explicitly rejects "prompt engineering" as a framing.

**Recommendation:** Keep out entirely.

### 2.9 Learning resources and documentation links

The guide provides links to documentation sites, cookbooks, community forums, GitHub repos, and help centres for each platform. These are reference links that change frequently and belong in platform docs.

**Recommendation:** Keep out entirely.

---

## 3. Content the Course Already Covers Adequately

### 3.1 "How to sign up and send your first message"

The guide's sign-up and getting-started sections for each platform are functionally identical to what B-01 (Your First Message) already provides. B-01 covers Claude.ai (web), Claude.ai (desktop), ChatGPT, Gemini, Tines, and Claude Code. Each section tells the learner exactly where to type, what to click, and what happens next. The guide adds nothing that B-01 does not already cover.

### 3.2 Platform navigation

B-03 (Platform Orientation) covers where to type, where past conversations are, how to start new conversations, and where settings and projects/custom instructions/gems live -- for Claude, ChatGPT, Gemini, Tines, and Claude Code. This matches the guide's "getting started with the chat interface" sections.

### 3.3 Cost awareness

A-01 (Cost, Tokens, and What Things Actually Cost) covers what tokens are, how billing works, what makes sessions expensive, how to read usage, and how to set a mental budget. It includes worked cost examples with real numbers. The guide's pricing tables and billing information are a less pedagogically sound version of the same content -- raw numbers without the mental model to interpret them.

### 3.4 The concept that different models exist and cost different amounts

A-01 already names three Claude models (Opus, Sonnet, Haiku), explains that they differ in capability and cost, and tells the learner to check anthropic.com/pricing for current rates. This is the right level of model awareness for the course. The guide's multi-platform model lineups (GPT-5.4, GPT-5.2, Gemini 3.1 Pro Preview, Grok 4.20, etc.) are catalogue content, not educational content.

### 3.5 Persistent instructions / custom instructions / system prompts

B-09 (Your Two Projects) walks learners through setting up persistent instructions on Claude (Projects), ChatGPT (Custom Instructions), and Gemini (Gems). A-03 covers CLAUDE.md for Claude Code. The guide mentions custom instructions and system prompts in passing but does not teach how to use them. The course is ahead of the guide here.

### 3.6 "The AI is non-deterministic" / responses vary

B-01 explicitly states: "Every conversation with an AI is slightly different, even when you send the same message twice. The wording, the length, and the level of detail will vary." The guide's "models are non-deterministic" gotcha is already covered, in language appropriate to the audience.

### 3.7 Hallucination / made-up details

E-05 (Read the Whole Thing) teaches output review including checking for invented details. B-06 (What Just Happened?) introduces the concept that responses need to be evaluated. The guide's "hallucination remains a risk" note is already covered -- and the course avoids the word "hallucination" in favour of "made-up details" or "things the AI invented," which is better for the audience.

### 3.8 "ChatGPT subscriptions and API access are billed separately"

The guide flags this as a gotcha. It is irrelevant to B-series and E-series learners (they are using chat interfaces, not APIs). For A-series learners using Claude Code, A-01 already covers the billing model. For X-series learners who might eventually use multiple APIs, this is a detail for X-01 (API Fundamentals).

---

## 4. Concessions

After careful review, one area in the guide points to something the course does not yet address and arguably should:

### 4.1 Free tier data privacy (Gemini)

The guide notes: "On the free tier, your prompts and responses are used to improve Google products -- the paid tier ensures data privacy." This is a genuine learner-safety concern. A beginner using Gemini's free tier might paste sensitive work data into the tool without knowing it could be used for model training.

The course currently does not address data privacy at any stage. B-01 tells learners where to type and how to send a message. It does not warn them about what happens to what they type.

This is a real gap. However, it is not a gap that should be filled with the guide's content. It is a gap that should be filled with a brief, platform-agnostic note -- likely in B-01 or B-03 -- that says something like: "Before you paste work documents or sensitive information into any AI tool, check your platform's data policy. Some free tiers use your conversations to train the AI. Paid plans typically do not. If you are using a work-provided tool, ask your IT team what applies to you."

This is a one-paragraph addition, not a section. It should not name specific platforms' policies (those change). It should teach the habit of checking, not the current state of any platform's terms.

### 4.2 Knowledge cutoffs and the need for web search

The guide notes that models have knowledge cutoffs and need web search tools for current information. The course does not explicitly teach this. However, this is a narrow concern: B-series and E-series learners sending messages about their own work tasks (drafting emails, summarising documents) will rarely hit a knowledge cutoff issue. Advanced learners using Claude Code will encounter it naturally.

A brief mention could be warranted -- perhaps a line in B-06 (What Just Happened?) or B-07 (Recovery) noting: "If the AI gives you outdated information about something that changes frequently (laws, prices, current events), that is because it was trained on data up to a certain date. Check facts you cannot verify from the response alone." This is a diagnostic tip, not a new section.

---

## 5. Recommended Minimum-Change Approach

The course should remain as-is with two small additions:

### Addition 1: Data privacy habit (one paragraph)

**Where:** B-01 (Your First Message), added as a short section after the exercise, before "If your response looks different from what you expected." Alternatively, in B-03 (Platform Orientation) as a general note.

**Content:** A 3-4 sentence platform-agnostic note about checking data policies before pasting sensitive content. No platform-specific terms of service. Teaches the habit of checking, not the current state of any policy.

**Why this and not the guide's version:** The guide buries the Gemini data privacy note in a "gotchas" section alongside rate limit tiers and deprecated SDKs. The course should surface this as a standalone habit, stripped of technical context, because it affects the learner's safety, not their technical understanding.

### Addition 2: Knowledge cutoff awareness (one sentence)

**Where:** B-07 (Recovery: When It Doesn't Work), as a fourth diagnostic pattern alongside "too generic," "too long," and "misunderstood."

**Content:** One pattern entry: "The information seems outdated" with a one-sentence explanation that AI tools are trained on data up to a certain date and may not know about very recent events.

**Why minimal:** This is a niche diagnostic case for B-series learners. Most beginner tasks (drafting, summarising, listing) do not depend on current information. A single diagnostic entry is sufficient.

### What NOT to add

- No pricing tables. Point to platform pricing pages from A-01 (already done).
- No model comparison tables. The course is platform-agnostic by design.
- No API documentation. This belongs in platform docs or, eventually, X-01.
- No rate limit information. Irrelevant to the audience at every stage except Builder.
- No platform-specific parameter guidance. The course teaches transferable skills.
- No SDK or integration lists. Developer ecosystem content, not communication content.
- No "where to start based on your role" recommendations. The course already handles this by letting learners pick their platform and follow only that platform's instructions.

---

## Summary Judgement

The reference guide is a competent getting-started document for people who want to evaluate and compare LLM platforms. That is not what Linguist is. Linguist is a communication course built on a specific philosophical insight about human-machine interaction. Importing platform documentation into it would dilute its identity, burden its audience with irrelevant technical detail, and create a maintenance liability as platform specifics change.

Two small additions (data privacy habit, knowledge cutoff diagnostic) address genuine learner-safety and diagnostic gaps. Everything else should stay out.
