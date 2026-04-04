# 06 -- Gap Analysis: Advocate Report

_Produced 2026-04-03. Reference document: `content/llm_intro_guides.md`. Role: ADVOCATE -- identifying genuine content gaps the course needs._

---

## 1. Executive Summary

The reference document (`llm_intro_guides.md`) is a technical platform comparison guide covering OpenAI, Google Gemini, and xAI Grok. Roughly 80% of its content -- API pricing, SDK installation, developer quickstarts, rate limit tiers, prompting parameter flags -- is irrelevant to Linguist, which is a communication mode-switching course for low-tech-confidence learners, not a platform comparison guide or prompt engineering course. However, I found **five genuine gaps** where the reference document contains information that Linguist learners need and the existing course does not adequately provide. The most important are: accurate free-tier realities so learners know what to expect before they hit a paywall, the model selector problem (learners will see model names and not know what to pick), and a critical gotcha about Gemini's free tier using your data. These are small, targeted additions -- none requires a new module.

---

## 2. Genuine Gaps

### Gap 1: Free-tier message limits and what happens when you hit them

**What is missing:** The course tells learners to go to chatgpt.com, gemini.google.com, or claude.ai and start typing. It does not tell them what happens when they hit the free-tier limit -- which on ChatGPT is a rolling 5-hour window, on Gemini is daily limits that silently downgrade you to the Flash model, and on Grok is roughly 10 prompts per 2 hours. A beginner following B-01 could run into a limit wall during their first session and think they did something wrong.

**Why it matters:** The Linguist audience has low general tech confidence. A sudden "upgrade to continue" message during their first interaction is exactly the kind of moment that makes someone close the tab and not come back. The course needs to inoculate against this.

**Where it belongs:** B-01 (Your First Message), as a short addition to the "If your response looks different from what you expected" section, or as a new short section titled something like "If it asks you to upgrade."

**What form:** 2-3 sentences per platform, within the existing platform-specific orientation blocks. Example: "Free accounts have a limited number of messages. If you see a message asking you to upgrade, you have not done anything wrong -- you have used your free allowance. Wait a few hours and your allowance resets, or come back tomorrow." This is not a pricing table -- it is emotional reassurance with practical guidance.

---

### Gap 2: The model selector -- what to pick when you see a dropdown

**What is missing:** Both ChatGPT and Gemini present model selectors to users. ChatGPT shows a model dropdown; Gemini shows labelled choices (Fast, Thinking, Pro). The course's B-03 (Platform Orientation) does not mention model selectors at all. The reference document shows that ChatGPT free users get GPT-5.2, and Gemini free users see choices labelled Fast, Thinking, and Pro. A beginner will see these options and freeze -- "Which one do I pick? Will I break something if I pick the wrong one?"

**Why it matters:** This is a real first-experience blocker for the low-tech-confidence audience. They will encounter the model selector before they send their first message. If B-01 and B-03 do not address it, the learner is on their own at the most fragile moment in the course.

**Where it belongs:** B-03 (Platform Orientation), within the ChatGPT and Gemini sections. A brief addition to each.

**What form:** One short paragraph per platform. For ChatGPT: "You may see a model dropdown at the top of the screen. If you are on the free plan, it will already be set to the right model. Leave it as it is." For Gemini: "You may see options labelled Fast, Thinking, and Pro. For everyday tasks, Fast is fine. You do not need to understand the differences yet -- any option will work for the exercises in this course."

---

### Gap 3: Gemini free-tier data usage warning

**What is missing:** The reference document states: "on the free tier, your prompts and responses are used to improve Google products -- the paid tier ensures data privacy." This is a significant gotcha that the course does not mention anywhere. A learner pasting work emails or sensitive documents into Gemini on the free tier is unknowingly contributing that content to Google's training data.

**Why it matters:** Linguist is about communication mode-switching. The course's exercises (B-09, B-10, E-01 through E-03) all encourage learners to use real work tasks and real documents. If a learner is on Gemini's free tier, the course is inadvertently encouraging them to share potentially sensitive material with Google's training pipeline. This is a duty-of-care issue, not a technical detail.

**Where it belongs:** B-03 (Platform Orientation), in the Gemini section. Or as a brief callout in B-01 if the course wants to be comprehensive.

**What form:** A single clear sentence: "On Gemini's free plan, Google may use your conversations to improve its products. If you are working with sensitive or confidential material, keep this in mind." This is not a legal disclaimer -- it is practical guidance for people the course is asking to use real work content.

---

### Gap 4: "Start a new conversation" as a first-resort fix -- reinforcing that conversations are disposable

**What is missing:** The reference document notes that on ChatGPT, Gemini, and Grok, each new conversation starts completely fresh. The course mentions this principle (B-07, E-04, E-06 all reference "start a new conversation"), but B-01 and B-03 do not explicitly state the foundational fact: **the AI in a new conversation has zero memory of previous conversations.** The reference document states this clearly for all three platforms.

**Why it matters:** This is a direct reinforcement of Linguist's core philosophy -- "The machine will wait. It does not mind." The disposability of conversations is one of the most liberating ideas for beginners, and the Build Context document explicitly calls it out (Context Flooding Rule: "start a new conversation. The machine has no continuity preference. Every conversation is fresh."). But B-01, the very first module, does not state this plainly. The learner should know from minute one that starting fresh is free, instant, and has no penalty.

**Where it belongs:** B-01 (Your First Message), as a single sentence near the "start a fresh conversation" instruction that already exists, and in B-03 as part of the "How to start a new conversation" entry for each platform.

**What form:** One sentence in B-01: "Every new conversation starts completely fresh -- the AI has no memory of anything from previous conversations." And a reinforcing sentence in B-03 under each platform's "How to start a new conversation" entry: "The new conversation is a blank slate. Nothing from the old conversation carries over."

---

### Gap 5: Where persistent instructions actually live -- Gemini Gems are not exactly Custom Instructions

**What is missing:** B-09 (Your Two Projects) directs Gemini users to create a Gem for persistent instructions. The reference document confirms that Gems are "saved AI personas with custom instructions" -- but it also clarifies that Gems are not global like ChatGPT's Custom Instructions. In ChatGPT, Custom Instructions apply to all new conversations automatically. In Gemini, you must deliberately start a conversation from a specific Gem. The course's B-09 does say "Start conversations from this Gem when you want these instructions to apply," which is correct. However, B-09 does not explicitly warn that Gems are conversation-specific, not global. A learner might set up a Gem, then start a normal conversation (not from the Gem), wonder why their instructions are not applying, and feel confused.

**Why it matters:** This is a practical gotcha that would directly cause confusion during the B-09 exercise. The learner's "If this did not work" section in B-09 does address this partially ("make sure you are starting the conversation inside the project (for Claude) or using the correct Gem (for Gemini)"), but the distinction between global and conversation-specific persistent instructions deserves more explicit treatment.

**Where it belongs:** B-09 (Your Two Projects), in the Gemini section of the exercise, and in the "If this did not work" section.

**What form:** One additional sentence in the Gemini setup instructions: "Important: unlike ChatGPT's Custom Instructions, which apply to all conversations automatically, Gems only apply when you start a conversation from that specific Gem. If you start a regular conversation from the main screen, your Gem instructions will not be active." This prevents a predictable failure mode.

---

## 3. Things Considered but Rejected

### API pricing tables
The reference document contains detailed per-million-token pricing for all three platforms. Rejected because: Linguist learners are using free chat interfaces, not APIs. The A-01 module covers API cost for Claude Code users specifically, with appropriate framing. Cross-platform API pricing is irrelevant to the course audience and changes frequently.

### SDK installation instructions
Python/Node.js/Go installation for OpenAI, Gemini, and Grok APIs. Rejected because: developer content. The Linguist course has one developer path (A-series) focused exclusively on Claude Code. Multi-platform SDK setup is Builder-stage content at best, and even the X-series specs are marked as future/low priority.

### Rate limits and tier structures
Detailed RPM/TPM limits, tier graduation rules, per-organization limits. Rejected because: irrelevant to chat-interface users. Even for the A-series (Claude Code), the course correctly handles cost awareness through the mental-model approach in A-01 rather than through rate-limit tables.

### Platform-specific prompting parameters (temperature, reasoning_effort, thinking_level)
The reference document covers reasoning modes and parameter tuning for all three platforms. Rejected because: this is prompt engineering, which the Build Context explicitly states Linguist is NOT. The course teaches communication mode-switching, not parameter optimisation.

### Grok platform coverage
The reference document covers Grok in equal depth to OpenAI and Gemini. Rejected as a new platform for the course because: the existing modules cover Claude, ChatGPT, and Gemini. Adding Grok would add complexity for a platform with a more complex tier structure, a smaller user base, and an X/Twitter integration that is irrelevant to the course's communication-focused exercises. If Grok becomes more mainstream, it can be added later as a B-03 section.

### OpenAI Playground, Google AI Studio, and other developer tools
Rejected because: developer tools, not relevant to the Linguist audience.

### The "Where to start based on your role" recommendation table
The reference document recommends Gemini for beginners due to the most generous free tier. Considered adding this to B-01 as guidance for learners who have not yet chosen a platform. Rejected because: B-01 assumes the learner has already chosen a platform (the instructions say "Find your platform below"). Platform recommendation is a pre-course decision that should be handled on the landing page or course intro, not in B-01. The reference document's recommendation is also based on API generosity, not chat-interface quality, making it misleading for the Linguist audience.

### Hallucination warnings as a standalone topic
The reference document mentions hallucination risk for all three platforms. Rejected as a new addition because: B-06 (What Just Happened) and E-05 (Read the Whole Thing) already handle this through the "made-up details" framing and the output review checklist. The course's existing coverage is appropriate for the audience -- practical and non-alarmist.

### OpenAI "ChatGPT subscriptions and API access are billed completely separately" warning
This is a genuinely useful gotcha, but rejected because: the Linguist learner is using the chat interface, not the API. The only API path in the course is Claude Code (A-series), which uses the Anthropic API, not OpenAI's. This gotcha would only confuse learners who do not need to know it.

---

## 4. Recommended Priority Order

1. **Gap 1: Free-tier message limits** -- Highest priority. Directly affects the first-session experience. A learner who hits a paywall in B-01 may abandon the course. Two-sentence addition per platform.

2. **Gap 2: Model selector guidance** -- High priority. Also affects the first-session experience. A learner who freezes at the model dropdown has not even sent their first message. One paragraph per platform in B-03.

3. **Gap 3: Gemini data usage warning** -- High priority. Duty-of-care issue. The course asks learners to use real work content; it should warn them when a platform may use that content. One sentence in B-03.

4. **Gap 4: Conversations are disposable** -- Medium priority. Reinforces the core Linguist philosophy at the right moment. The information exists later in the course but should appear in B-01 where the learner first encounters conversations. One sentence.

5. **Gap 5: Gemini Gems are not global** -- Medium priority. Prevents a predictable failure in B-09. The existing "If this did not work" section partially covers it, but an upfront clarification would prevent the failure rather than just recovering from it. One sentence in the Gemini instructions.

---

## Summary of Recommended Changes

| Gap | Module(s) affected | Size of change |
|-----|-------------------|----------------|
| Free-tier limits | B-01 | ~6 sentences (2 per platform) |
| Model selector | B-03 | ~3 short paragraphs (1 per platform) |
| Gemini data warning | B-03 | 1 sentence |
| Conversations are disposable | B-01, B-03 | 1-2 sentences each |
| Gems are not global | B-09 | 1-2 sentences |

Total: approximately 15-20 sentences of new content across three existing modules. No new modules needed. No structural changes required.
