# 05 -- Content Specifications

_Produced 2026-04-02. For use by downstream content-authoring agents._

---

## Summary

This document contains module-level content specifications for the full Linguist curriculum, from Day 0 (never used AI, low general tech confidence) through to Builder-level independence with Claude Code or Workbench/API.

The curriculum has four stages:
- **Beginner** (B-series): Recognition through first real use. 11 modules.
- **Enabled User** (E-series): Skill-building through to independent, self-directed AI use. 7 modules.
- **Advanced Practitioner** (A-series): Claude Code mastery. 8 modules.
- **Builder** (X-series): Designing AI systems for others via Workbench/API. 7 modules.

Priority flags mark the five areas identified as most critical:
- `[P0-CRITICAL]` -- Your First Message exercise (biggest single gap)
- `[P0-CRITICAL]` -- Copy-Personalise-Use pattern (project requirement, unimplemented)
- `[P1-HIGH]` -- Verb taxonomy module
- `[P1-HIGH]` -- Beginner-to-Enabled bridge
- `[P1-HIGH]` -- Cost/capability gate before agentic content

Every module spec follows the same 10-field structure for downstream agent consumption.

---

## Module Index

### Beginner Stage (B-series)

| ID | Title | Priority |
|----|-------|----------|
| B-00 | See the Two Modes | Exists, minor fixes |
| B-01 | Your First Message | `[P0-CRITICAL]` |
| B-02 | Copy-Personalise-Use: How to Edit a Prompt | `[P0-CRITICAL]` |
| B-03 | Platform Orientation | Medium |
| B-04 | Your Two Projects (Exercise 1, simplified) | High |
| B-05 | The Opening Seed (Exercise 2, revised) | High |
| B-06 | What Just Happened? Reading AI Output | High |
| B-07 | Recovery: When It Doesn't Work | High |
| B-08 | Your Style Shapes the Output (Verbosity Mirroring) | High |
| B-09 | One Task Per Message | High |
| B-10 | Tell It When to Stop (Stopping Conditions) | High |

### Enabled User Stage (E-series)

| ID | Title | Priority |
|----|-------|----------|
| E-01 | The First Word Matters: Verb Taxonomy | `[P1-HIGH]` |
| E-02 | Tell the AI What to Leave Alone (Constraints) | High |
| E-03 | Context is Fuel | High |
| E-04 | Restate, Don't Patch | Medium |
| E-05 | Read the Whole Thing (Output Review) | Medium |
| E-06 | Migration and Re-seed | Medium |
| E-07 | Your Reference Card (Personal Synthesis) | Medium |

### Advanced Practitioner Stage (A-series)

| ID | Title | Priority |
|----|-------|----------|
| A-00 | Bridge: Getting Started with Claude Code | `[P1-HIGH]` |
| A-01 | Cost, Tokens, and What Things Actually Cost | `[P1-HIGH]` |
| A-02 | Mental Model Refresher for Claude Code | Medium |
| A-03 | CLAUDE.md: Your Persistent Instructions | Medium |
| A-04 | Session Hygiene | Medium |
| A-05 | Context Awareness and Compaction | Medium |
| A-06 | Plan Before Execute (Output Engineering) | Medium |
| A-07 | Tool Fluency | Medium -- requires A-01 cost gate |
| A-08 | Agent Design and Delegation | Medium -- requires A-01 cost gate |

### Builder Stage (X-series)

| ID | Title | Priority |
|----|-------|----------|
| X-01 | API Fundamentals | Low (future) |
| X-02 | System Prompt Design | Low (future) |
| X-03 | Tool Definition and Function Calling | Low (future) |
| X-04 | Cost Estimation and Budgeting for Builders | Low (future) |
| X-05 | Agentic Loop Design | Low (future) |
| X-06 | Production Architecture | Low (future, content exists) |
| X-07 | Evaluation, Safety, and Guardrails | Low (future) |

---

## Beginner Stage Specifications

---

### B-00: See the Two Modes

**Stage:** Beginner

**Learning objective:** After this, the learner can recognise whether a piece of communication is written for a human or a machine, and explain why it matters.

**Core concept:** Humans and machines are different. Talking to a machine like a human wastes your energy. Talking to a human like a machine damages the relationship. The skill is noticing which mode you are in.

**Prerequisite modules:** None. Day 0 entry point.

**Content format:** Interactive experience (the existing /see flow). 5 screens: Intro, See (two absurdities), Try (5-question recognition quiz), Know (anchor the reframe), Done.

**Prompt starters required:** None. No AI interaction required. Pure recognition exercise.

**Jargon to avoid / define:**
- Avoid: "prompt", "context window", "model", "token"
- No jargon should appear at this stage

**Tone notes:** Warm, wry, never preachy. The two absurdities should make the learner laugh with recognition, not feel lectured. The closing ("The machine will wait. It does not mind. Go be human.") is the emotional anchor. No urgency, no "you should be doing this differently" energy. Pure permission.

**Existing content to draw from:**
- `/see/index.html` -- fully built, needs minor fixes
- Daily cards 1-30 in `/cards/content.js` -- perfect companion content
- `LINGUIST_BUILD_CONTEXT.md` Section 1 (The Two Absurdities, The Core Framework)
- Known fixes needed: Quiz Q5 trick question (reframe or remove), Done screen reduce from 8 CTAs to 1 primary, add link to /course from Done screen

---

### B-01: Your First Message `[P0-CRITICAL]`

**Stage:** Beginner

**Learning objective:** After this, the learner can open an AI tool, type a message, send it, read the response, and know that nothing broke.

**Core concept:** Sending your first message to an AI is as low-stakes as asking a question you already know the answer to. The AI will respond. It will not judge you. Nothing will break. You just used AI.

**Prerequisite modules:** B-00 (See the Two Modes) -- the learner should know the two modes exist before they interact with an AI tool.

**Content format:** Guided single-task exercise. One screen. One action: type a message and press send. The exercise must be completable in under 3 minutes.

**Prompt starters required:**

Starter 1 -- "The question you already know the answer to":
```
What is the capital of France?
```
_Copy-Personalise-Use notes: This starter is used as-is. No personalisation needed. The point is zero-stakes first contact. After the learner sends this and sees a response, a second optional prompt encourages personalisation:_

Starter 2 -- "Now ask something from your own life":
```
What are three things I could cook for dinner tonight using chicken and rice?
```
_How to edit this: Replace "chicken and rice" with whatever ingredients you actually have. The point is to ask the AI something where you can judge whether the answer is useful -- not something you need to look up to verify._

**Jargon to avoid / define:**
- Avoid: "prompt" (use "message" or "question"), "model" (use "the AI" or the platform name), "output" (use "response" or "answer"), "context window", "token"
- Define if used: "send" (press Enter or click the arrow/button to submit your message)

**Tone notes:** This is the single most emotionally sensitive module in the entire course. The learner may be nervous, may feel stupid, may expect to fail. The tone must be: calm, matter-of-fact, zero-judgment. Emotional decompression at the end: "That's it. You just used AI. Everything after this is just getting better at it." Do not celebrate excessively -- that can feel patronising. Just acknowledge and move forward. Include explicit reassurance: "If the response looks different from what you expected, that's normal. Every conversation with AI is slightly different."

**Existing content to draw from:**
- `03-beginner-enabled-gaps.md` Section 3.1 (full specification of this gap)
- `LINGUIST_BUILD_CONTEXT.md` Section 1 ("It waits. It'll wait forever. It does not mind.")
- The prompt-starter page (`/prompt-starter.html`) has the right AI-guided co-creation philosophy but is too complex for this moment. The "build a seed with me -- not for me" ethos applies.
- Must include platform orientation notes (where to type, where to find the send button) for each supported platform, or link to B-03.

---

### B-02: Copy-Personalise-Use: How to Edit a Prompt `[P0-CRITICAL]`

**Stage:** Beginner

**Learning objective:** After this, the learner can take a template prompt with bracketed placeholders, identify which parts to change, replace them with their own details, and send the personalised version.

**Core concept:** A prompt template is not a finished message -- it is a starting shape. The brackets `[like this]` mark the parts you change. Editing a prompt to fit your situation is the core skill that makes AI useful for your own work, not just for generic tasks.

**Prerequisite modules:** B-01 (Your First Message) -- the learner must have successfully sent at least one message to an AI.

**Content format:** Step-by-step walkthrough exercise with three phases:
1. **Copy** -- Here is a prompt. Read it. Copy it exactly as written.
2. **Personalise** -- Here are the parts in brackets. Here is what each bracket means. Here is an example of how someone replaced each bracket for their own task. Now replace the brackets with your own details.
3. **Use** -- Paste your personalised version into the AI tool. Send it. Read the response.

**Prompt starters required:**

Starter 1 -- The teaching prompt (used for the walkthrough):
```
I'm a [your role] working on [brief description of task]. I need you to [verb: summarise / explain / draft / list] [the specific thing]. Keep it under [length: e.g. 100 words / 5 bullet points]. Don't include [what to leave out].
```

_How to edit this (this section IS the exercise):_
- `[your role]` -- What you do at work, or in life. Examples: "marketing coordinator", "secondary school teacher", "small business owner", "university student studying biology". If you don't have a work role, use "someone who..."
- `[brief description of task]` -- One sentence about what you are working on right now. Examples: "a presentation for my team meeting on Friday", "lesson plans for next week", "a quote for a customer"
- `[verb]` -- Pick one: "summarise" (make it shorter), "explain" (help me understand), "draft" (write a first version), "list" (give me options). Just pick the one closest to what you need.
- `[the specific thing]` -- What do you want the verb applied to? Examples: "this email from my manager", "the differences between these two products", "a reply to this customer complaint"
- `[length]` -- How long should the response be? "Under 100 words", "3 bullet points", "one paragraph". Pick a size.
- `[what to leave out]` -- What do you NOT want? "Don't include technical terms", "Don't add a greeting or sign-off", "Don't suggest things I didn't ask for"

_Worked example (shown alongside the template):_
```
I'm a small business owner working on replying to a negative customer review. I need you to draft a professional but warm response. Keep it under 100 words. Don't include excuses or discounts.
```

**Jargon to avoid / define:**
- Avoid: "template" (use "starter prompt" or "starting shape"), "placeholder" (use "the parts in brackets"), "parameter", "variable"
- Define: "brackets" -- the square brackets `[ ]` mark the parts you change. You delete the brackets AND the words inside, and type your own words instead.

**Tone notes:** This module must be explicit about mechanics that experienced users take for granted. "Select the text inside the brackets. Delete it. Type your own words." This is not condescending -- it is respecting the audience. A learner who has never edited a template will not know that they delete the brackets themselves. Include a "what it looks like before and after" visual showing the template, then the personalised version, side by side.

**Existing content to draw from:**
- `03-beginner-enabled-gaps.md` Section 3.2 (Copy-Personalise-Use specification)
- `project_linguist_prompt_editing.md` (project memory -- the binding requirement)
- `01-claude-code-synthesis.md` Section 5 (Copy-Personalise-Use applications for verb taxonomy, constraint front-loading)
- Exercise 1 and Exercise 2 both use bracket-fill syntax but never teach it -- this module must come before both.

---

### B-03: Platform Orientation

**Stage:** Beginner

**Learning objective:** After this, the learner can identify the main interface elements of their chosen AI platform (where to type, where responses appear, where settings live) and navigate to start a new conversation.

**Core concept:** AI tools look different from each other, but they all have the same basic parts: a place to type, a place to read the response, and a way to start fresh.

**Prerequisite modules:** B-01 (Your First Message) -- can be done in parallel with or just after first message.

**Content format:** Annotated visual reference for each supported platform (Claude, ChatGPT, Gemini, Tines, Claude Code). Minimal text. Labelled screenshots or simple descriptions. Not an exercise -- a reference card the learner can return to.

**Prompt starters required:** None.

**Jargon to avoid / define:**
- Avoid: "UI", "interface", "sidebar", "modal", "settings panel"
- Use instead: "the typing area", "the response area", "the menu", "where you find your past conversations"
- Define if used: "new conversation" (starting a fresh chat where the AI has no memory of what you said before)

**Tone notes:** Purely functional. No emotional weight. This is a reference tool, not a learning moment. Keep it as short as possible. The learner should be able to glance at this and orient themselves in under 30 seconds.

**Existing content to draw from:**
- `/course/index.html` screen 2 (Choose Platform) -- has the platform picker UI pattern
- `03-beginner-enabled-gaps.md` Section 3.5 (Platform Orientation spec)
- Platform-specific content already exists in Exercise 1 for persistent instruction setup -- the orientation should come before that setup.

---

### B-04: Your Two Projects (Exercise 1, simplified)

**Stage:** Beginner

**Learning objective:** After this, the learner can set up persistent instructions on their chosen platform and understand that these instructions shape every conversation.

**Core concept:** You can give the AI standing instructions that apply to every conversation -- like telling a new colleague "here's how I like to work" on their first day. These instructions set the default tone and behaviour.

**Prerequisite modules:** B-01, B-02, B-03 (must have sent a message, know how to edit a prompt, know where settings live).

**Content format:** Guided exercise. Split the current Exercise 1 into two sub-steps:
1. Understand what persistent instructions are (conceptual, one paragraph).
2. Set up ONE project/profile with persistent instructions (not two -- reduce cognitive load). The Machine Mode project comes first because it is more practically useful. Human Mode project becomes optional/bonus.

**Prompt starters required:**

Starter 1 -- Machine Mode persistent instructions:
```
When I give you a task:
- Start with the task immediately. No preamble.
- Ask me a clarifying question if my instruction is ambiguous.
- When you're done, stop. Don't summarise what you did or suggest next steps unless I ask.
- Keep responses under [your preferred length: e.g. 200 words / 1 page] unless I say otherwise.
```

_How to edit this:_
- `[your preferred length]` -- How long do you want responses to be by default? If you're not sure, start with "200 words" and adjust later.
- You can add lines. For example: "Use plain language -- avoid jargon" or "Format lists as bullet points, not numbered" or "Write in British English."
- You can remove lines. If you don't mind the AI suggesting next steps, delete that line.

**Jargon to avoid / define:**
- Avoid: "system prompt", "custom instructions" (use the platform-specific name: "Project Instructions" for Claude, "Custom Instructions" for ChatGPT, etc.), "persistent context"
- Define: "persistent instructions" -- instructions that stay active for every conversation in this project/profile, like a standing order.
- Define: "preamble" -- the extra introductory text the AI adds before getting to the point ("Great question! Let me help you with that..."). You can tell it to skip this.

**Tone notes:** This was the original Exercise 1 and was flagged as doing too much. The simplified version must feel achievable in one sitting. Emphasise that this is a one-time setup, not something they need to do every time. Include a recovery path: "If you can't find the settings, check the Platform Orientation reference (B-03). If the AI's response doesn't change after you set this up, start a new conversation -- persistent instructions only apply to new conversations."

**Existing content to draw from:**
- `/course/exercise-1.html` -- existing exercise, needs HTML bug fixes and simplification
- `03-beginner-enabled-gaps.md` Sections 1.3, 3.4 (Exercise 1 weaknesses, recovery paths)
- `REVIEW_FINDINGS.md` Round 1 Agent 2 (bracket-fill not taught), Round 2 Agent 1 (HTML bugs)
- `01-claude-code-synthesis.md` Section 6.3 (framing as communication, not prompt engineering)

---

### B-05: The Opening Seed (Exercise 2, revised)

**Stage:** Beginner

**Learning objective:** After this, the learner can write a first message to an AI that includes who they are, what they need, relevant context, and a clear definition of "done."

**Core concept:** Your first message sets the direction for the entire conversation. Four elements make it work: Role (who you are), Task (what you need), Context (what the AI needs to know), Done (when to stop). This is the same Opening Seed from Exercise 2, but now taught after Copy-Personalise-Use so the learner knows how to edit the template.

**Prerequisite modules:** B-02 (Copy-Personalise-Use), B-04 (Persistent Instructions set up).

**Content format:** Guided exercise using Copy-Personalise-Use pattern. The learner builds one Opening Seed for a real task from their own work.

**Prompt starters required:**

Starter 1 -- The Opening Seed template:
```
I'm a [your role] and I need to [task: what you need done].

Here's what you need to know: [context: 1-3 facts the AI needs to do this well].

Done when: [what the finished output looks like -- e.g. "a 3-bullet summary", "a draft email under 150 words", "a list of 5 options"].
```

_How to edit this:_
- `[your role]` -- Same as B-02. Who you are, in a few words.
- `[task]` -- Start with a verb (see E-01 for the full verb guide, but for now: summarise, draft, explain, list, compare, fix). Then say what you want that verb applied to.
- `[context]` -- What does the AI need to know that it cannot guess? Who is the audience? What is the deadline? What tone do you need? What has already been tried? Only include facts that change the output.
- `[what the finished output looks like]` -- Be specific about format and length. "A draft" is vague. "A 100-word draft email in a professional tone" is specific.

_Worked example:_
```
I'm a project coordinator and I need to draft an update email for my team about a delayed delivery.

Here's what you need to know: the delivery was due last Friday, the new date is next Wednesday, the client hasn't been told yet, and my manager wants a calm, factual tone.

Done when: a 3-paragraph email under 150 words, professional but not stiff, ending with a clear next step.
```

**Jargon to avoid / define:**
- Avoid: "seed" as a standalone term without explanation (always "Opening Seed -- your first message"), "Role-Task-Context-Done" as an acronym, "load-bearing" (was in original Exercise 2, flagged as jargon)
- Define: "context" -- the specific facts the AI needs to do this task well. Not everything you know about the topic -- just what changes the output.
- Define: "Done when" -- how you will know the AI has finished. A size, a format, a specific deliverable.

**Tone notes:** Acknowledge that writing a good first message takes practice. "Your first Opening Seed will be rough. That's fine. The AI will still produce something. Then you'll see what to adjust next time." The Human Mode seed from the original Exercise 2 asked "What would make this conversation useful?" -- this metacognitive question assumes experience the learner does not have. Replace with concrete guidance.

**Existing content to draw from:**
- `/course/exercise-2.html` -- existing exercise, needs HTML fixes and jargon removal
- `03-beginner-enabled-gaps.md` Section 1.4 (Exercise 2 weaknesses)
- `REVIEW_FINDINGS.md` Round 1 Agent 2 item 1 (most jargon-dense prompt), item 4 (metacognitive question)
- `01-claude-code-synthesis.md` Section 4 Layer 2 (stopping conditions, verb choice as prerequisites for Opening Seed)

---

### B-06: What Just Happened? Reading AI Output

**Stage:** Beginner

**Learning objective:** After this, the learner can read an AI response, decide whether it answered their question, spot signs of misunderstanding, and know what to do next.

**Core concept:** The AI's first response is a draft, not a final product. You are allowed to push back, ask for changes, or start over. Reading the response critically is as important as writing the prompt.

**Prerequisite modules:** B-05 (Opening Seed) -- the learner needs to have received at least one substantive AI response to evaluate.

**Content format:** Short walkthrough exercise. The learner sends their Opening Seed from B-05, then follows a guided response-reading checklist.

**Prompt starters required:**

No new prompt starters. The learner uses their Opening Seed from B-05. The module provides a response-reading checklist instead:

_Response checklist (not a prompt -- a thinking tool):_
1. Did it answer the question I actually asked? (Not a related question, not a broader question -- MY question.)
2. Is anything obviously wrong or made up? (Names, dates, facts you can check.)
3. Is it the right length and format? (If I asked for 3 bullets and got 8 paragraphs, the prompt needs adjusting, not the response.)
4. Would I use this as-is, or does it need changes? (If it needs changes, that's normal -- move to "what to do next.")

_What to do next (decision tree):_
- "Mostly good, needs small changes" -- ask for specific changes in the same conversation. Example: "Make it shorter" or "Change the tone to be more casual."
- "Wrong direction entirely" -- start a new conversation and rewrite your Opening Seed. Don't try to fix it by layering corrections. (This previews E-04: Restate, Don't Patch.)
- "Good enough" -- use it. Done.

**Jargon to avoid / define:**
- Avoid: "hallucination" (use "made-up details" or "things the AI invented"), "output" (use "response" or "what the AI wrote back"), "iterate" (use "ask for changes")
- Define: "pushing back" -- telling the AI to change something. This is normal and expected. The AI does not mind.

**Tone notes:** This is where "the first output is a draft" needs to land. Many beginners assume the AI's first response is the final answer. Give explicit permission to push back. "The AI expects you to ask for changes. That is how this works. You are not being rude."

**Existing content to draw from:**
- `03-beginner-enabled-gaps.md` Section 3.3 ("What Just Happened?" specification)
- Exercise 5 (Read the Whole Thing, not built) -- this module is a lightweight precursor to Ex 5
- `01-claude-code-synthesis.md` Section 1.7 (Restate, don't patch) -- preview here, teach fully in E-04
- `LINGUIST_BUILD_CONTEXT.md` Section 1 ("It has no feelings to hurt" -- the AI does not mind being asked to redo work)

---

### B-07: Recovery: When It Doesn't Work

**Stage:** Beginner

**Learning objective:** After this, the learner can diagnose why an AI response didn't match their expectations and take one corrective action (adjust the prompt, provide more context, or start a new conversation).

**Core concept:** Bad output is almost always a prompt problem, not a you problem. The most common causes are: too vague, too many requests at once, or missing context. Each has a simple fix.

**Prerequisite modules:** B-06 (Reading AI Output) -- the learner needs to have evaluated a response before learning to fix problems.

**Content format:** Reference card with inline troubleshooting. Three common failure patterns with one-step fixes. Should be embeddable/linkable from every subsequent exercise as a recovery path.

**Prompt starters required:**

No new prompts. Instead, provides diagnostic patterns:

_Pattern 1: "The response was too generic"_
- Likely cause: Your prompt didn't include enough context.
- Fix: Add 1-2 specific facts about your situation. What makes this task different from anyone else's version of this task?

_Pattern 2: "The response was way too long / covered things I didn't ask for"_
- Likely cause: No stopping condition, or the verb was too broad ("improve" instead of "summarise").
- Fix: Add a "Done when" line. Pick a more specific verb (see E-01).

_Pattern 3: "The AI seemed to misunderstand what I meant"_
- Likely cause: Ambiguity in the prompt, or the AI latched onto the wrong part.
- Fix: Start a new conversation. Rewrite the prompt more specifically. Don't try to correct the AI in the same conversation -- that usually makes it worse (preview of E-04).

**Jargon to avoid / define:**
- Avoid: "debug", "iterate", "refine the prompt", "prompt engineering"
- Use instead: "fix the prompt", "try again", "adjust", "rewrite"

**Tone notes:** Normalise failure explicitly. "If your first three prompts don't produce great results, that is completely normal. This is a skill you are learning, and the only way to learn it is by writing prompts that don't work and figuring out why." Never frame a bad result as the learner's fault. Frame it as information: "The AI is telling you something about your prompt."

**Existing content to draw from:**
- `03-beginner-enabled-gaps.md` Section 3.4 (Recovery Paths specification)
- `01-claude-code-synthesis.md` Section 1.3 (one task per message), 1.5 (specific references), 1.7 (restate don't patch)
- `REVIEW_FINDINGS.md` Round 1 Agent 2 (Exercise 2 assumes Exercise 1 worked perfectly -- this module is the safety net)

---

### B-08: Your Style Shapes the Output (Verbosity Mirroring)

**Stage:** Beginner

**Learning objective:** After this, the learner can observe that short prompts produce short responses and detailed prompts produce detailed responses, and can deliberately use this to control the AI's output depth.

**Core concept:** The AI mirrors your style. Write briefly, get brevity. Write in detail, get detail. This is not a bug -- it is a calibration signal you can use on purpose.

**Prerequisite modules:** B-01 (must have sent messages to an AI). Can run in parallel with B-05/B-06.

**Content format:** Live comparison exercise. The learner sends the same question twice: once in a short form, once in a detailed form. They compare the responses.

**Prompt starters required:**

Starter 1 -- Short version:
```
Tips for a job interview?
```

Starter 2 -- Detailed version:
```
I have a job interview next Tuesday for a marketing coordinator role at a mid-size company. I've been in a similar role for 2 years. I'm nervous about the "tell me about yourself" question and the salary negotiation part. What are your top 5 tips, focusing on those two areas? Keep each tip to one sentence.
```

_How to edit this (Copy-Personalise-Use):_
- For Starter 1: Replace "job interview" with any topic you want advice on. Keep it short -- one line.
- For Starter 2: Replace the entire content with a detailed version of the same question. Include: what specifically you need help with, your situation, how many tips you want, how long each tip should be.
- The point is the contrast between the two responses, not the specific topic. Pick something you actually care about.

**Jargon to avoid / define:**
- Avoid: "verbosity mirroring" (use "the AI matches your style"), "calibration", "signal"
- Define if needed: "detailed prompt" -- a prompt that includes specific facts about your situation, what you want, and how you want it formatted.

**Tone notes:** This should feel like a discovery, not a lesson. Frame it as: "Try this experiment and notice what happens." The learner should feel clever for seeing the pattern, not instructed about a rule.

**Existing content to draw from:**
- `01-claude-code-synthesis.md` Section 1.4 (verbosity mirroring), Section 3 (beginner suitability), Section 4 Layer 1 Exercise 1
- `claude-code-best-practices.md` and `claude-code-best-practices-deep.md` -- "The model mirrors your verbosity" (strip Claude Code framing)

---

### B-09: One Task Per Message

**Stage:** Beginner

**Learning objective:** After this, the learner can break a multi-part request into separate messages and understand why this produces better results.

**Core concept:** When you ask the AI to do three things at once, it does all three badly. When you ask for one thing at a time, it does each one well. Sequential single-purpose messages beat one multi-purpose message.

**Prerequisite modules:** B-08 (Verbosity Mirroring) -- understands that input style shapes output.

**Content format:** Comparison exercise. The learner sends one multi-part prompt, then sends the same work as 3 separate messages. They compare the quality.

**Prompt starters required:**

Starter 1 -- Multi-part (the "bad" version):
```
Can you summarise this article, then write 3 social media posts about it, and also draft an email to my team sharing the key takeaways? The article is about [topic].
```

Starter 2a/2b/2c -- Single-task (the "good" version):
```
Summarise this article about [topic] in 5 bullet points. Keep each bullet under 20 words.
```
Then, after receiving and reviewing the summary:
```
Using that summary, write 3 social media posts. Each should be under 280 characters. Tone: casual and curious.
```
Then:
```
Now draft a short email to my team sharing the 3 key takeaways from the article. Keep it under 100 words. Start with the most important takeaway.
```

_How to edit this:_
- Replace `[topic]` with something you are actually working with -- an article, a report, a meeting note.
- Adjust the tasks to fit your real needs. The point is: do them one at a time, not all at once.

**Jargon to avoid / define:**
- Avoid: "task decomposition", "sequential prompting", "cross-contamination"
- Use instead: "one thing at a time", "separate messages", "check each step before moving to the next"

**Tone notes:** Friendly and practical. The multi-part prompt is not "wrong" -- it's just less effective. The learner should see this through their own comparison, not be told it as a rule.

**Existing content to draw from:**
- `01-claude-code-synthesis.md` Section 1.3 (one task per message), Section 3 (beginner suitability), Section 4 Layer 1 Exercise 2
- `01-claude-code-synthesis.md` Appendix (exercise mapping, Exercise 2)

---

### B-10: Tell It When to Stop (Stopping Conditions)

**Stage:** Beginner

**Learning objective:** After this, the learner can add a clear stopping condition to any prompt, preventing the AI from over-delivering.

**Core concept:** Without a clear "done when", the AI has to guess when to stop. This usually means it gives you more than you wanted. Adding a stopping condition -- a word count, a number of items, a specific format -- gives you control over the size and shape of the output.

**Prerequisite modules:** B-08 (understands style shapes output), B-09 (understands one task per message).

**Content format:** Short exercise. The learner takes a prompt they have already used (from B-05, B-08, or B-09) and adds a stopping condition. They compare the new response to the original.

**Prompt starters required:**

Starter 1 -- Without stopping condition:
```
Explain how to make a good cup of coffee.
```

Starter 2 -- With stopping condition:
```
Explain how to make a good cup of coffee. 5 steps. Each step under 15 words. No introduction, no conclusion.
```

_How to edit this:_
- Replace the topic with anything you want explained.
- Choose your stopping condition: word count ("under 100 words"), item count ("3 bullet points"), format ("just a table, no text"), or exclusions ("no introduction, no conclusion, no summary").
- You can combine conditions: "5 bullet points, each under 20 words, no introduction."

_Stopping condition quick reference (a small template):_
```
[Your prompt]. [Number] [items/steps/points]. Each under [length]. No [what to skip: introduction / conclusion / summary / suggestions / preamble].
```

**Jargon to avoid / define:**
- Avoid: "output constraints", "scope limiting", "token budget"
- Define: "stopping condition" -- the part of your prompt that tells the AI when it has said enough. A word limit, a number of items, or an instruction to skip certain parts.

**Tone notes:** Practical and immediately useful. This is the module where the learner starts to feel control over the AI. Frame the stopping condition as a power move, not a limitation: "You decide how much you get. The AI will fill whatever space you give it."

**Existing content to draw from:**
- `01-claude-code-synthesis.md` Section 1.6 (clear stopping condition), Section 4 Layer 2 Exercise 3
- `01-claude-code-synthesis.md` Section 5 (stopping conditions placement)

---

## Enabled User Stage Specifications

---

### E-01: The First Word Matters: Verb Taxonomy `[P1-HIGH]`

**Stage:** Enabled User

**Learning objective:** After this, the learner can choose a verb that matches their intent and predict how the AI's response will differ based on verb choice.

**Core concept:** The first verb in your prompt determines how much the AI changes. Some verbs are precise ("fix", "summarise"). Some are open-ended ("improve", "clean up"). Knowing the difference prevents the AI from doing more than you intended. This is the "blast radius" concept -- how much unintended change a single word can cause.

**Prerequisite modules:** B-10 (stopping conditions) -- the learner must understand that they control the AI's output before learning that verb choice controls its scope.

**Content format:** Exercise + reference card. The exercise shows the same task with different verbs and compares the AI's responses. The reference card (a verb table) is a permanent artefact the learner keeps.

**Prompt starters required:**

Starter set -- Same task, four verbs (the learner sends all four and compares):

```
Fix the grammar errors in this paragraph: [paste a paragraph from your own work]
```

```
Rewrite this paragraph in a more professional tone: [paste the same paragraph]
```

```
Summarise this paragraph in one sentence: [paste the same paragraph]
```

```
Improve this paragraph: [paste the same paragraph]
```

_How to edit this:_
- Replace `[paste a paragraph from your own work]` with actual text from something you are working on -- an email, a report, a message.
- Use the same paragraph for all four so you can see how the verb changes the output.
- After comparing, pick the verb that was closest to what you actually wanted. That is your verb for this task.

_Verb reference card (the permanent artefact):_

| Verb | What it does | How much changes | Risk level |
|------|-------------|-----------------|------------|
| **Fix** | Corrects a specific error. Leaves everything else alone. | Minimal | Low |
| **Summarise** | Shortens, keeps key points. | Moderate -- removes detail | Low |
| **Explain** | Helps you understand something. Changes nothing. | None -- read-only | None |
| **List** | Gives options or items in structured format. | Creates new content | Low |
| **Rewrite** | Same content, different style or format. | Moderate -- changes form, keeps substance | Medium |
| **Draft** | Creates something new from your brief. | High -- new content | Medium |
| **Compare** | Shows differences between things. | None -- analytical | None |
| **Improve** | Open-ended. No ceiling on what changes. Use a more specific verb instead. | Unpredictable | **High** |
| **Clean up** | Ambiguous. Could mean grammar, could mean restructure, could mean rewrite. Specify what you mean. | Unpredictable | **High** |

**Jargon to avoid / define:**
- Avoid: "blast radius" as the primary teaching label (use it as an optional aside -- "some people call this the 'blast radius' of a verb -- how much unintended change it causes")
- Avoid: "taxonomy" in learner-facing content (use "verb guide" or "verb reference")
- Define: "scope" -- how much the AI decides to change on its own. A high-scope verb lets the AI change a lot. A low-scope verb keeps changes small.

**Tone notes:** This is the highest-leverage single skill in the course after the mode distinction itself. Frame it as empowering: "You already know these words. Now you know what they do when you say them to a machine." Do not frame "improve" and "clean up" as bad -- frame them as unpredictable. "They're not wrong words. They just give the AI permission to decide what 'better' means."

**Existing content to draw from:**
- `01-claude-code-synthesis.md` Section 1.1 (verb choice), Section 5 (verb taxonomy placement, beginner verb table, Copy-Personalise-Use application)
- `claude-code-best-practices-deep.md` Part 1 -- the full 7-verb blast radius table (strip developer framing)
- `03-beginner-enabled-gaps.md` Section 3.6 (verb taxonomy as taught concept)
- `REVIEW_FINDINGS.md` Round 3 (verb taxonomy is the single strongest artefact)
- Exercise 3 (Specificity as Scope Control) -- planned but not built. This module IS Exercise 3.

---

### E-02: Tell the AI What to Leave Alone (Constraints)

**Stage:** Enabled User

**Learning objective:** After this, the learner can add upfront constraints to a prompt that prevent the AI from changing things they want preserved.

**Core concept:** Telling the AI what NOT to do before it starts is more effective than correcting it afterwards. Constraints protect the parts of your work you want left alone.

**Prerequisite modules:** E-01 (Verb Taxonomy) -- must understand that verb choice sets scope before learning to constrain that scope.

**Content format:** Before/after exercise. The learner sends the same prompt with and without constraints and compares results.

**Prompt starters required:**

Starter 1 -- Without constraints:
```
Rewrite this email to be more professional.
```
_(Paste an email you've written.)_

Starter 2 -- With constraints:
```
Rewrite this email to be more professional. Keep the same structure and paragraph breaks. Don't change the opening greeting or closing. Don't add any information I didn't include. Keep it under [original word count + 20] words.
```
_(Paste the same email.)_

_How to edit this:_
- Replace the example with your own task.
- The constraint pattern is: `[verb] [task] -- [what to keep / what not to change / where to stop]`
- Common constraints: "Don't change the structure", "Keep the same tone", "Don't add recommendations", "Don't remove any items from the list", "Stay under [X] words"

**Jargon to avoid / define:**
- Avoid: "constraint front-loading", "scope ceiling", "guardrails"
- Use instead: "tell it what to leave alone", "set limits before it starts", "protect the parts you want kept"

**Tone notes:** Frame constraints as protecting your work, not restricting the AI. "You wrote that email for a reason. The parts that are already good should stay. Tell the AI which parts those are."

**Existing content to draw from:**
- `01-claude-code-synthesis.md` Section 1.2 (constraints at the start), Section 5 (constraint front-loading placement and teaching vehicle)
- `01-claude-code-synthesis.md` Section 4 Layer 3 Exercise 5

---

### E-03: Context is Fuel

**Stage:** Enabled User

**Learning objective:** After this, the learner can identify which context to include in a prompt and which to leave out, understanding that relevant detail produces better output.

**Core concept:** The AI cannot see your screen, read your mind, or remember past conversations. Everything it needs to do the job well must be in the message. More relevant context produces better results. Irrelevant context wastes space and can confuse.

**Prerequisite modules:** E-02 (Constraints) -- the learner understands scope control before learning about context loading.

**Content format:** Exercise. The learner takes a real task, identifies the context the AI needs, and writes a context-loaded prompt. Includes a "load-bearing test": for each piece of context, ask "Would the output change if I removed this?" If yes, it's load-bearing. If no, leave it out.

**Prompt starters required:**

Starter 1 -- Context-light (common beginner pattern):
```
Write me a presentation about our Q3 results.
```

Starter 2 -- Context-loaded:
```
Write me a 10-slide presentation outline for our Q3 results. The audience is the senior leadership team (they care about revenue and customer retention, not operational detail). Q3 revenue was up 12% vs Q2 but missed the 15% target. Customer retention dropped from 88% to 82%. The main bright spot was the new product launch in September. Tone: honest and solutions-oriented, not defensive. Each slide should have a title and 3-4 bullet points.
```

_How to edit this:_
- Replace everything with your own task and your own context.
- Load-bearing test for each fact you include: "If I deleted this line, would the AI produce something meaningfully different?" If yes, keep it. If no, it's clutter.
- Types of context that matter: audience, purpose, tone, key facts/numbers, what has already been tried, format requirements.

**Jargon to avoid / define:**
- Avoid: "context window", "token", "context loading" as a technical term
- Define: "context" -- the specific facts about your situation that the AI needs to do the job well. Not everything you know -- just what changes the output.
- Define: "load-bearing" -- a piece of context that actually changes what the AI produces. If you removed it and the output would be the same, it's not load-bearing.

**Tone notes:** This is the module where "context is fuel" from the build context lands. Frame it positively: "More detail is not over-explaining. It is giving the AI what it needs to help you." Address the common worry that "I'm giving it too much" -- "You are not wasting the AI's time. It does not have time to waste."

**Existing content to draw from:**
- `LINGUIST_BUILD_CONTEXT.md` Section 1 principle 3 ("Context is fuel for machines, not a burden")
- `01-claude-code-synthesis.md` Section 6.1 (context is fuel vs context is finite -- use "fuel" at this stage)
- Exercise 4 (Context is Fuel) -- planned but not built. This module IS Exercise 4.
- `01-claude-code-synthesis.md` Section 1.5 (specific references)

---

### E-04: Restate, Don't Patch

**Stage:** Enabled User

**Learning objective:** After this, the learner can recognise when layering corrections is making the AI worse and choose to restart with a clean, complete instruction instead.

**Core concept:** When the AI misunderstands and you keep adding "no I meant X", each correction compounds confusion. It is cleaner to rewrite the whole instruction from scratch in a new message or new conversation.

**Prerequisite modules:** E-02 (Constraints), B-06 (Reading AI Output). The learner must have experienced a correction spiral to understand why restating works.

**Content format:** Walkthrough. Show a real correction spiral (3-4 messages of "no, I meant..." that gets worse), then show the same task done as a clean restatement. The learner does not need to reproduce the spiral -- they recognise it.

**Prompt starters required:**

No copy-paste prompts. Instead, a decision rule:

_When to restate instead of patch:_
- You have sent more than 2 corrections in a row.
- The AI keeps misunderstanding the same thing despite your corrections.
- You are feeling frustrated. (Frustration is a signal that the conversation has drifted.)

_How to restate:_
1. Start a new conversation (or a new message that begins from scratch).
2. Write the full instruction again, incorporating everything you learned from the failed attempt.
3. Do not reference the previous attempt. The AI in the new conversation has no memory of it.

**Jargon to avoid / define:**
- Avoid: "correction spiral", "context drift", "prompt chain degradation"
- Use instead: "when the conversation goes in circles", "when corrections make it worse", "start fresh"

**Tone notes:** Validate the frustration. "If you've been going back and forth with the AI for five messages and it's still wrong, that's not you being bad at this. It's the conversation being too tangled. Start fresh. It's faster." Explicitly give permission to abandon a conversation without guilt -- "The AI does not know you left. It does not mind."

**Existing content to draw from:**
- `01-claude-code-synthesis.md` Section 1.7 (restate don't patch), Section 4 Layer 3 Exercise 6
- `01-claude-code-synthesis.md` Section 1.9 (new conversation for new direction)
- `LINGUIST_BUILD_CONTEXT.md` Section 1 (Context Flooding Rule)

---

### E-05: Read the Whole Thing (Output Review)

**Stage:** Enabled User

**Learning objective:** After this, the learner habitually reads the full AI response before acting on it, checks for invented details, and evaluates whether the output meets their stated criteria.

**Core concept:** AI responses can contain confident-sounding errors. Reading the whole response -- not just the first paragraph -- and checking facts you can verify is a non-negotiable habit.

**Prerequisite modules:** B-06 (What Just Happened -- basic response reading). E-05 deepens this into a systematic habit.

**Content format:** Checklist exercise. The learner sends a prompt about a topic they know well, receives the response, and systematically evaluates it using the output review checklist.

**Prompt starters required:**

Starter 1 -- A prompt about something you know well:
```
Explain [a topic you know a lot about] to someone who has never heard of it. Keep it under 200 words.
```

_How to edit this: Pick a topic from your work or expertise. The point is that YOU can spot errors because you know the subject. This is how you build the habit of checking._

_Output review checklist (permanent artefact):_
1. Read the entire response before deciding if it's good.
2. Check any facts, names, dates, or numbers against what you already know.
3. Look for things that sound right but feel wrong -- confident language does not mean accurate content.
4. Check: does this match the format and length I asked for?
5. Check: did it add things I didn't ask for? (Suggestions, disclaimers, recommendations.)
6. Final question: would I put my name on this? If not, what needs to change?

**Jargon to avoid / define:**
- Avoid: "hallucination" (use "made-up details" or "things the AI invented"), "confabulation", "ground truth"
- Define: "confident-sounding errors" -- the AI can state something completely false in the same matter-of-fact tone it uses for things that are true. Always verify what you can.

**Tone notes:** Not alarmist. Not "AI lies all the time." Frame it as professional due diligence: "You wouldn't send a colleague's draft to a client without reading it first. Same principle."

**Existing content to draw from:**
- Exercise 5 (Read the Whole Thing) -- planned but not built. This IS Exercise 5.
- `03-beginner-enabled-gaps.md` Section 1.9 (Exercise 5 planned content)
- `02-advanced-content-gaps.md` Section 1 (Layer 5 Output Engineering)

---

### E-06: Migration and Re-seed

**Stage:** Enabled User

**Learning objective:** After this, the learner can recognise when a conversation has degraded and start a new one with a clean re-seed that captures what was valuable from the old conversation.

**Core concept:** AI conversations have a useful lifespan. When the AI starts repeating itself, forgetting your instructions, or drifting from your topic, it is faster to start fresh than to keep correcting. A "re-seed" is a clean opening message for the new conversation that carries forward what you learned.

**Prerequisite modules:** E-04 (Restate Don't Patch -- understands when to start fresh), E-05 (Output Review -- can evaluate when output quality has dropped).

**Content format:** Exercise. The learner writes a re-seed for a conversation that has gone stale. Includes a 3-line re-seed template.

**Prompt starters required:**

Re-seed template:
```
I've been working on [task]. Here's where I've got to: [paste the best output from the old conversation, or summarise your current state in 2-3 sentences]. What I need next: [the specific next step].
```

_How to edit this:_
- `[task]` -- What you were working on in the old conversation.
- `[current state]` -- Copy the most useful output from the old conversation, or write a short summary of decisions made so far.
- `[next step]` -- What you need the AI to do now. Be specific.

_Signs that a conversation needs migration:_
- The AI repeats things it already said.
- The AI forgets instructions you gave earlier.
- You are scrolling up frequently to re-read what was said.
- The responses feel increasingly generic.
- You have changed direction more than once in the same conversation.

**Jargon to avoid / define:**
- Avoid: "context rot", "context window exhaustion", "compaction", "token limit"
- Define: "re-seed" -- a fresh opening message for a new conversation that carries forward the useful parts of an old one. Like starting a new document with the best notes from the old one.
- Define: "migration" -- moving from an old conversation to a new one. Not because something broke -- because the old one has run its course.

**Tone notes:** Frame migration as a power move, not a failure. "Starting a new conversation is not giving up. It is clearing the table so you can work better. The AI in the new conversation is fresh, focused, and ready. Use that."

**Existing content to draw from:**
- Exercise 6 (Migration & Re-seed) -- planned but not built. This IS Exercise 6.
- `01-claude-code-synthesis.md` Section 1.9 (new conversation for new direction)
- `LINGUIST_BUILD_CONTEXT.md` Section 1 (Context Flooding Rule)
- `01-claude-code-synthesis.md` Section 4 Layer 4 (context rot signals -- use general awareness here, defer detail to advanced track)

---

### E-07: Your Reference Card (Personal Synthesis)

**Stage:** Enabled User

**Learning objective:** After this, the learner has a personal one-page reference card containing their preferred verbs, constraints, opening seed structure, and re-seed template, customised to their own work.

**Core concept:** The best prompt guide is the one you wrote yourself, for your own tasks. This module synthesises everything from the course into a personal artefact the learner owns.

**Prerequisite modules:** All previous modules. This is the capstone.

**Content format:** Guided synthesis exercise. The learner fills in a personal reference card template using examples from their own work. The output is a one-page document they can keep beside their keyboard.

**Prompt starters required:**

Starter 1 -- Use the AI to help build the reference card:
```
I'm building a personal reference card for working with AI. Help me fill in this template based on my work.

My role: [your role]
Tasks I use AI for most often: [2-3 tasks]
My preferred verbs: [from E-01, the ones that worked best for you]
My default stopping condition: [from B-10, your go-to format/length]
My standard opening seed: [from B-05, adapted for your most common task]
My re-seed template: [from E-06]

Turn this into a clean, one-page reference I can print or keep open on my screen. Use bullet points. No extra explanation.
```

_How to edit this: Fill in every bracket with your own details. This is the most personalised prompt in the course -- every field comes from your own experience across previous modules._

**Jargon to avoid / define:**
- All terms should be familiar by this point. If a learner has reached this module, they know what a verb, constraint, stopping condition, and re-seed are.

**Tone notes:** Celebratory but understated. "You now have a personal system for working with AI. Not a set of rules you memorised -- a tool you built from your own experience." This is the enabled user threshold. The learner should feel competent and self-sufficient.

**Existing content to draw from:**
- Exercise 8 (Your Reference Card) -- planned but not built. This IS Exercise 8.
- `03-beginner-enabled-gaps.md` Section 4 (Enabled User threshold definition)
- All previous module content feeds into this synthesis.

---

## Advanced Practitioner Stage Specifications

---

### A-00: Bridge: Getting Started with Claude Code `[P1-HIGH]`

**Stage:** Advanced Practitioner

**Learning objective:** After this, the learner can install Claude Code, run their first session, understand the permission model, and complete a familiar task (from the beginner course) in this new environment.

**Core concept:** Claude Code is a command-line AI tool that works directly with your files and code. It is more powerful than chat-based AI tools but requires understanding its permission model (it asks before acting), its cost model (it uses tokens that cost money), and its interface (terminal, not browser).

**Prerequisite modules:** E-07 (completed the Enabled User stage). The learner must be competent with chat-based AI tools before transitioning to Claude Code.

**Content format:** Step-by-step walkthrough. Installation, first run, one familiar task, one new task. Includes screenshots/descriptions of terminal UI.

**Prompt starters required:**

Starter 1 -- First Claude Code task (familiar from beginner course):
```
Summarise this file in 5 bullet points: [filename]
```

_How to edit this: Replace `[filename]` with the path to a text file on your computer. This is the same kind of task you did in the beginner course, but now you are doing it in a terminal with Claude Code instead of in a browser._

Starter 2 -- Understanding the permission model:
```
Read the file [filename] and tell me what it contains. Don't change anything.
```

_This starter demonstrates Claude Code's permission model: it will ask you to approve the file read before proceeding. This is the safety mechanism._

**Jargon to avoid / define:**
- Define: "terminal" / "command line" -- a text-based interface where you type commands instead of clicking buttons. It looks like a black or dark screen with text.
- Define: "permission model" -- Claude Code asks you before it reads files, writes files, or runs commands. You approve or reject each action. Nothing happens without your say-so.
- Define: "tokens" -- the unit AI tools use to measure how much you've asked them to do. More tokens = more cost. You will learn about this in detail in A-01.
- Avoid: "CLI", "shell", "stdout", "stderr", "subprocess"

**Tone notes:** This is a major transition. The learner is moving from a comfortable browser-based tool to a terminal-based tool. Acknowledge the discomfort: "This will look different from what you've been using. That's OK. The principles you learned -- verb choice, constraints, stopping conditions, opening seeds -- all apply here. The skills transfer. Only the interface is new."

**Existing content to draw from:**
- `02-advanced-content-gaps.md` Section 2.1 (No onboarding gap), Section 5 (Bridge specification)
- `02-advanced-content-gaps.md` Section 3 (gradient breaks at Layer 2 to Layer 3)
- `03-beginner-enabled-gaps.md` Section 4 (Enabled User to Advanced transition table)

---

### A-01: Cost, Tokens, and What Things Actually Cost `[P1-HIGH]`

**Stage:** Advanced Practitioner

**Learning objective:** After this, the learner can estimate the rough token cost of a task, understand why agent delegation multiplies cost, and set a mental budget before starting a session.

**Core concept:** Every message you send and every tool Claude Code uses costs tokens. Tokens cost money. Some actions (reading a file) are cheap. Some actions (running an agent that reads 50 files) are expensive. Knowing the cost landscape before you start prevents surprise bills and teaches you to be intentional about what you ask for.

**Prerequisite modules:** A-00 (Bridge). Must have used Claude Code at least once.

**Content format:** Reference module with concrete examples. Not an exercise -- a "before you go further" gate. Includes a cost comparison table showing approximate costs for common actions.

**Prompt starters required:** None. This is a reference/conceptual module.

**Jargon to avoid / define:**
- Define: "tokens" -- chunks of text (roughly 4 characters or 3/4 of a word) that the AI processes. Longer prompts = more tokens = more cost. Longer responses also cost tokens.
- Define: "context window" -- the total amount of text the AI can hold in memory for one conversation. When it fills up, older content gets summarised (and some detail is lost).
- Define: "tool call" -- when Claude Code reads a file, searches your code, or runs a command, each of those actions adds tokens to the conversation.
- Avoid: "cache hit/miss" (defer to builder track), "input tokens vs output tokens" (simplify to "more text = more cost"), "pricing tiers"

**Tone notes:** Matter-of-fact, not alarming. "This tool costs money to use. Knowing roughly what things cost means you won't be surprised and you can make informed choices about when to use it." Do not make the learner afraid of using Claude Code -- make them informed.

**Existing content to draw from:**
- `02-advanced-content-gaps.md` Section 2.1 (No cost awareness gap), Section 4 (Cost gate specification, full recommended module outline)
- `02-advanced-content-gaps.md` Section 4 cost gate table (what content is gated behind cost awareness)

---

### A-02: Mental Model Refresher for Claude Code

**Stage:** Advanced Practitioner

**Learning objective:** After this, the learner can apply the beginner course principles (verb choice, constraints, stopping conditions, context loading) in the Claude Code environment with developer-relevant examples.

**Core concept:** The same principles from the beginner course apply in Claude Code, but the tasks are different. This module reconnects the learner's existing knowledge to their new tool.

**Prerequisite modules:** A-00 (Bridge), A-01 (Cost awareness).

**Content format:** Reference module with worked examples. Maps each beginner principle to a Claude Code application.

**Prompt starters required:**

Starter 1 -- Verb choice in Claude Code:
```
Fix the typo on line 12 of [filename]. Don't change anything else.
```
vs.
```
Improve [filename].
```

_The contrast is identical to E-01's verb taxonomy lesson but applied to files and code._

**Jargon to avoid / define:**
- By this stage, technical terms are appropriate but should still be grounded in the beginner vocabulary. "Blast radius" can now be used as a label, since the concept was taught without the label in E-01.

**Tone notes:** Reconnect to familiar ground. "You already know this. Here's what it looks like in Claude Code."

**Existing content to draw from:**
- `course/01-mental-model.md` -- Layer 1 content (reframe for non-developer examples alongside developer examples)
- `course/02-communication-primitives.md` -- Layer 2 content (verb taxonomy, target specificity, constraints)
- `01-claude-code-synthesis.md` Section 2 (Claude Code-specific content table), Section 3 (what generalises)

---

### A-03: CLAUDE.md: Your Persistent Instructions

**Stage:** Advanced Practitioner

**Learning objective:** After this, the learner can create and maintain a CLAUDE.md file that configures Claude Code's default behaviour for their projects.

**Core concept:** CLAUDE.md is Claude Code's version of persistent instructions (which the learner set up in B-04 for their chat-based tool). It lives in your project folder and tells Claude Code how to behave every time you start a session in that project.

**Prerequisite modules:** A-02 (Mental Model Refresher -- understands Claude Code prompt principles), B-04 (Persistent Instructions -- understands the concept from the beginner course).

**Content format:** Hands-on exercise. The learner writes their first CLAUDE.md, starts a Claude Code session, observes the effect, and iterates.

**Prompt starters required:**

Starter 1 -- A minimal CLAUDE.md:
```
# Project Instructions

- When I ask you to fix something, make the minimal change. Don't refactor nearby code.
- Before making changes to any file, tell me what you plan to do and wait for approval.
- Write commit messages in imperative mood, under 72 characters.
- Run tests after any code change.
```

_How to edit this:_
- Replace these rules with your own preferences. What do you find yourself repeating in every Claude Code session?
- Start with 3-5 rules. You can add more as you discover patterns.
- Good rules are specific and testable. "Be careful" is vague. "Don't modify files outside the src/ directory" is specific.

**Jargon to avoid / define:**
- Define: "CLAUDE.md" -- a plain text file named CLAUDE.md that Claude Code reads at the start of every session. Your standing instructions for the AI.
- The concept maps directly to B-04 (Persistent Instructions). Call back to it explicitly: "In the beginner course, you set up persistent instructions in [platform]. CLAUDE.md is the same thing for Claude Code, but it lives in a file in your project."

**Tone notes:** Practical and iterative. "Your first CLAUDE.md will be incomplete. That's fine. Add rules as you discover what you keep repeating."

**Existing content to draw from:**
- `course/03-session-hygiene.md` Skill 7 -- declarative content about CLAUDE.md (strong but needs exercise)
- `02-advanced-content-gaps.md` Section 2.1 (No CLAUDE.md tutorial gap)
- `01-claude-code-synthesis.md` Section 2 (CLAUDE.md generalisation)

---

### A-04: Session Hygiene

**Stage:** Advanced Practitioner

**Learning objective:** After this, the learner can scope a Claude Code session to one task, use /clear to reset when changing direction, and recognise when a session has drifted.

**Core concept:** Claude Code sessions accumulate context. When the context gets tangled (multiple unrelated tasks, conflicting instructions, too much history), the AI's output quality drops. Keeping sessions clean -- one task, clear start, clear end -- produces consistently better results.

**Prerequisite modules:** A-03 (CLAUDE.md), E-06 (Migration and Re-seed -- understands conversation freshness from the beginner course).

**Content format:** Exercise. The learner scopes a session, completes a task, uses /clear, and starts a new task in the same terminal.

**Prompt starters required:** No new templates. Uses /clear command and applies beginner re-seed skills in the Claude Code context.

**Jargon to avoid / define:**
- Define: "/clear" -- a command that resets Claude Code's memory within the current session. Like starting a new conversation without closing the terminal.
- Define: "session scoping" -- deciding what one task this session is for before you start, and sticking to it.

**Tone notes:** Build on E-06 (Migration). "You already know that conversations have a useful lifespan. In Claude Code, the equivalent is sessions. Same principle, different tool."

**Existing content to draw from:**
- `course/03-session-hygiene.md` Skills 7-9
- `01-claude-code-synthesis.md` Section 1.9 (new conversation for new direction)

---

### A-05: Context Awareness and Compaction

**Stage:** Advanced Practitioner

**Learning objective:** After this, the learner can write messages that survive Claude Code's automatic context summarisation, and recognise when compaction has lost important details.

**Core concept:** When a Claude Code session gets long, the AI automatically summarises older messages to make room. Some details survive summarisation. Others are lost. Writing important information in a way that survives compaction is a skill unique to long sessions.

**Prerequisite modules:** A-04 (Session Hygiene), A-01 (Cost awareness -- understands context window).

**Content format:** Reference module with exercises. Shows what compaction looks like, what survives, and what gets lost. Includes a "writing for compaction" checklist.

**Prompt starters required:** None. Uses existing session context to demonstrate compaction.

**Jargon to avoid / define:**
- Define: "compaction" -- Claude Code's automatic process of summarising old messages when the conversation gets too long. Important details can be lost in this process.
- Define: "writing for compaction survival" -- putting key facts in clear, standalone statements rather than burying them in paragraphs. Named items survive better than described items.

**Tone notes:** This is novel content not available elsewhere. Frame it as insider knowledge: "Most AI users don't know this happens. Now you do."

**Existing content to draw from:**
- `course/04-context-awareness.md` Skills 10-12 (strong content, needs non-developer examples added)
- `02-advanced-content-gaps.md` Section 1 (compaction content flagged as genuinely novel)

---

### A-06: Plan Before Execute (Output Engineering)

**Stage:** Advanced Practitioner

**Learning objective:** After this, the learner can separate planning from execution in Claude Code -- asking the AI to explain its plan before it acts, reviewing the plan, and only then approving execution.

**Core concept:** For complex tasks, always ask Claude Code what it plans to do before it does it. "Before making any changes, tell me what you're going to do." This one extra step prevents costly mistakes.

**Prerequisite modules:** A-05 (Context Awareness), B-10 (Stopping Conditions from beginner course).

**Content format:** Exercise. The learner gives Claude Code a multi-step task, asks for a plan, reviews it, adjusts, then approves execution.

**Prompt starters required:**

Starter 1 -- Plan request:
```
I want to [describe the task]. Before you do anything, tell me:
1. What files you'll need to read
2. What changes you plan to make
3. What order you'll do them in

Wait for my approval before starting.
```

_How to edit this: Replace `[describe the task]` with your actual task. The 3-point plan request can be adjusted based on what you need to know before the AI acts._

**Jargon to avoid / define:**
- Define: "plan mode" -- asking Claude Code to describe its approach before executing. Not a formal mode switch -- just a prompt pattern.

**Tone notes:** Frame as risk management. "The AI is going to change your files. Seeing the plan first means you catch problems before they happen, not after."

**Existing content to draw from:**
- `course/05-output-engineering.md` Skills 13-14
- `01-claude-code-synthesis.md` Section 1.8 (ask for plan before execution)

---

### A-07: Tool Fluency

**Stage:** Advanced Practitioner (requires A-01 cost gate)

**Learning objective:** After this, the learner can guide Claude Code toward the right tool for the task (Read vs Grep vs Bash vs Agent) and understand the cost difference between tools.

**Core concept:** Claude Code has multiple tools it can use (reading files, searching code, running commands, delegating to sub-agents). Each has a different cost. Naming the tool you want in your prompt -- "Read this file" vs "Search the codebase for..." -- gives you control over which tool gets used and what it costs.

**Prerequisite modules:** A-01 (Cost gate -- must understand token economics before learning tool cost hierarchy), A-06 (Plan Before Execute -- understands planning before acting).

**Content format:** Reference module with exercises. Tool comparison table with cost ranking. Exercises where the learner explicitly names tools.

**Prompt starters required:**

Starter 1 -- Naming the tool:
```
Read the file src/config.js and tell me what the database settings are. Don't search any other files.
```
vs.
```
Find where the database settings are configured in this project.
```

_The first is cheap (reads one file). The second could trigger a broad search across the entire project (expensive)._

**Jargon to avoid / define:**
- Define: "tool" in Claude Code context -- an action the AI can take, like reading a file, searching code, or running a terminal command. Different tools cost different amounts.
- The specific tool names (Read, Grep, Glob, Bash, Agent) should be introduced and defined here.

**Tone notes:** Practical and cost-conscious. "Every tool call costs tokens. Knowing which tool does what helps you get the result without unnecessary expense."

**Existing content to draw from:**
- `course/06-tool-fluency.md` Skill 15
- `02-advanced-content-gaps.md` Section 3 (gradient break at Layer 5 to 6 -- needs prerequisite orientation)

---

### A-08: Agent Design and Delegation

**Stage:** Advanced Practitioner (requires A-01 cost gate)

**Learning objective:** After this, the learner can decide when to delegate a task to a Claude Code sub-agent, write an effective agent brief, and understand the cost implications of delegation.

**Core concept:** Sometimes a task is better handled by a separate, isolated AI session (a "sub-agent") that focuses on one thing without being distracted by the main session's context. Delegation multiplies cost but can improve quality for research-heavy or complex tasks. The key insight: never delegate understanding -- only delegate execution.

**Prerequisite modules:** A-07 (Tool Fluency), A-01 (Cost gate). Must understand that sub-agents have their own context window and cost.

**Content format:** Exercise. The learner identifies a task suitable for delegation, writes a 5-part agent brief, runs it, and evaluates the result.

**Prompt starters required:**

Starter 1 -- The 5-part agent brief:
```
Use a subagent to do the following:

Goal: [one sentence: what should be achieved]
Context: [what the subagent needs to know, remembering it has NO context from this session]
Scope: [what files/areas to look at, and what to leave alone]
Output format: [how should it report back -- summary, list, code changes, etc.]
Length: [how long the output should be]
```

_How to edit this:_
- `[Goal]` -- One clear sentence. What is the end state?
- `[Context]` -- Everything the sub-agent needs to know. It cannot see your main session. If it needs background, you must provide it here.
- `[Scope]` -- What to include and what to exclude. "Look at src/auth/ only" is better than "look at the auth system."
- `[Output format]` -- How should the sub-agent present its findings? A list, a summary, a set of code changes?
- `[Length]` -- How long should the output be? "Under 500 words" or "one paragraph per finding."

**Jargon to avoid / define:**
- Define: "sub-agent" -- a separate AI session that Claude Code launches to handle a specific task. It has its own context (no memory of your main session) and its own cost.
- Define: "context isolation" -- the sub-agent cannot see what you and Claude Code have been discussing. This is a feature, not a bug -- it means the sub-agent focuses only on its assigned task.
- Key principle to teach: "Never delegate understanding. Only delegate execution." If you need to understand something, do it in your main session. If you need something done, consider delegating.

**Tone notes:** This is advanced content. The learner is now operating at a level where they are orchestrating AI work, not just prompting. Frame it as a professional skill: "You are now managing AI workers. The same skills that make a good manager of people -- clear briefs, defined scope, explicit success criteria -- make a good manager of agents."

**Existing content to draw from:**
- `course/07-agent-design.md` Skills 16-17 (excellent content, flagged by reviewers)
- `02-advanced-content-gaps.md` Section 1 (agent briefing framework is the strongest artefact at this level)
- `01-claude-code-synthesis.md` Section 2 (subagent delegation generalisation -- "Do your research in one conversation, then start a clean conversation for the actual task")
- `LINGUIST_BUILD_CONTEXT.md` Section 1 (Dump vs Dispatch -- delegation is the advanced version of Dispatch)

---

## Builder Stage Specifications

_Note: Builder stage content does not currently exist. These specifications define what needs to be created. All modules are lower priority than Beginner, Enabled User, and Advanced Practitioner stages._

---

### X-01: API Fundamentals

**Stage:** Builder

**Learning objective:** After this, the learner can make a basic API call to Claude, understand the request/response structure, and identify the difference between system, user, and assistant messages at the API level.

**Core concept:** The API is the raw interface to the AI model. Everything you have used so far (Claude.ai, ChatGPT, Claude Code) is a wrapper around an API. Understanding the API lets you build your own wrappers.

**Prerequisite modules:** E-07 (Enabled User complete) + A-01 (Cost awareness). Does NOT require the full Advanced Practitioner track.

**Content format:** Walkthrough. Step-by-step first API call using the Anthropic console or a simple script.

**Prompt starters required:** API request/response examples (code, not prompt templates).

**Jargon to avoid / define:**
- Define: "API" (Application Programming Interface) -- a way for your code to talk directly to the AI model, without a chat interface.
- Define: "system message" -- instructions that shape the AI's behaviour for the whole conversation, like persistent instructions but set by the developer.
- Define: "API key" -- your personal password for accessing the API. Keep it secret.

**Tone notes:** The audience shifts here. Builder-track learners are more technically confident. The tone can be more direct, but should still avoid assuming deep programming experience.

**Existing content to draw from:**
- `02-advanced-content-gaps.md` Section 2.2 (API fundamentals gap)
- No existing content. Must be created from scratch.

---

### X-02: System Prompt Design

**Stage:** Builder

**Learning objective:** After this, the learner can write a system prompt that defines an AI assistant's persona, behaviour rules, and output format for a specific use case.

**Core concept:** A system prompt is the instruction set that shapes how the AI behaves for every user who interacts with it. It is the builder's version of persistent instructions, but designed for an audience of many, not just yourself.

**Prerequisite modules:** X-01 (API Fundamentals), B-04 (Persistent Instructions -- understands the concept at a personal level).

**Content format:** Exercise. The learner designs a system prompt for a specific use case (e.g., a customer support assistant, a writing helper, a data analyst).

**Prompt starters required:** System prompt templates and evaluation criteria.

**Jargon to avoid / define:**
- Define: "system prompt" -- the permanent instruction set that runs before every user conversation. The AI "personality" and rulebook.
- Define: "persona" -- the role and voice you give the AI. Not a human personality -- a set of behaviours and boundaries.

**Tone notes:** Design-oriented. The learner is now thinking about other people's experience with AI, not just their own.

**Existing content to draw from:**
- `02-advanced-content-gaps.md` Section 2.2 (system prompt design gap)
- `course/08-production-architecture.md` Skill 18 -- static/dynamic boundary (the architecture that system prompts live in)

---

### X-03: Tool Definition and Function Calling

**Stage:** Builder

**Learning objective:** After this, the learner can define a custom tool for the Claude API and understand how the model uses tool definitions to decide when and how to call functions.

**Core concept:** Tools extend what the AI can do beyond text. By defining tools (with names, descriptions, and parameter schemas), you let the AI take actions in the real world -- looking up data, sending emails, updating records.

**Prerequisite modules:** X-02 (System Prompt Design).

**Content format:** Walkthrough + exercise. Define a simple tool, make an API call that uses it, observe how the model decides to call it.

**Prompt starters required:** Tool definition JSON examples.

**Jargon to avoid / define:**
- Define: "tool definition" -- a description of something the AI can do, including what inputs it needs. The model reads this description to decide when to use the tool.
- Define: "function calling" -- when the AI decides to use a tool you've defined, it "calls" the function with specific inputs. Your code then executes the function and returns the result.

**Tone notes:** Technical but accessible. Use concrete examples (a weather lookup, a database query) rather than abstract explanations.

**Existing content to draw from:**
- `02-advanced-content-gaps.md` Section 2.2 (tool definition gap)
- No existing content. Must be created from scratch.

---

### X-04: Cost Estimation and Budgeting for Builders

**Stage:** Builder

**Learning objective:** After this, the learner can estimate the token cost of an agentic loop, set token budgets, and monitor spend for a production use case.

**Core concept:** When you build AI systems for others, cost scales with usage. Every user conversation, every tool call, every agentic loop iteration costs tokens. Estimating and budgeting for this cost is a core builder skill.

**Prerequisite modules:** A-01 (Cost awareness -- personal level), X-03 (Tool Definition -- understands what tool calls cost).

**Content format:** Reference module with worked cost estimation examples.

**Prompt starters required:** None. Calculation examples and monitoring setup.

**Jargon to avoid / define:**
- Define: "cache hit" -- when the AI can reuse a previous computation instead of reprocessing from scratch. Cheaper.
- Define: "cache miss" -- when the AI has to reprocess everything. Expensive.
- Define: "token budget" -- a maximum number of tokens you allow a single session/loop/user to consume.

**Tone notes:** Numbers-focused. Concrete examples with dollar amounts. "A 10-turn agentic loop with 3 tool calls per turn costs approximately $X at current pricing."

**Existing content to draw from:**
- `02-advanced-content-gaps.md` Section 2.2 (cost estimation gap), Section 4 (cost gate module outline)
- `course/08-production-architecture.md` -- cache economics content (existing, strong)

---

### X-05: Agentic Loop Design

**Stage:** Builder

**Learning objective:** After this, the learner can design a simple agentic loop with tool use, stop conditions, error handling, and human-in-the-loop checkpoints.

**Core concept:** An agentic loop is when the AI repeatedly uses tools, evaluates results, and decides what to do next -- without human input at every step. Designing a good loop requires clear stop conditions, cost limits, and safety checkpoints.

**Prerequisite modules:** X-04 (Cost Estimation), X-03 (Tool Definition), A-08 (Agent Design -- understands delegation principles from Claude Code).

**Content format:** Exercise. The learner designs an agentic loop on paper (flow diagram), then implements a simple version.

**Prompt starters required:** Loop design template and pseudocode examples.

**Jargon to avoid / define:**
- Define: "agentic loop" -- the AI acting autonomously across multiple steps: use a tool, read the result, decide what to do next, repeat until done.
- Define: "stop condition" -- when should the loop end? A maximum number of iterations, a success criterion, or a cost limit.
- Define: "human-in-the-loop" -- a checkpoint where the loop pauses and asks a human to approve before continuing.

**Tone notes:** This is the most technical builder module. The learner is designing autonomous AI behaviour. Emphasise safety and predictability: "An agentic loop without a stop condition is an expensive mistake waiting to happen."

**Existing content to draw from:**
- `02-advanced-content-gaps.md` Section 2.2 (agentic loop design gap)
- `course/07-agent-design.md` Skills 16-17 -- delegation principles apply at the loop level
- No existing loop design content. Must be created from scratch.

---

### X-06: Production Architecture

**Stage:** Builder

**Learning objective:** After this, the learner can design a prompt architecture with static and dynamic boundaries, understand cache economics at scale, and structure tool descriptions for stability.

**Core concept:** In production, the system prompt has two parts: static (the same for every user, cacheable, cheap) and dynamic (changes per user/session, not cacheable, expensive). Getting this boundary right determines whether your system costs $10/day or $10,000/day.

**Prerequisite modules:** X-05 (Agentic Loop Design), X-04 (Cost Estimation).

**Content format:** Reference module with architecture diagrams and cost calculations.

**Prompt starters required:** System prompt architecture examples with cost annotations.

**Jargon to avoid / define:**
- Define: "static/dynamic boundary" -- the line between the parts of your system prompt that never change (static, cached) and the parts that change per user or session (dynamic, recomputed).
- All terms from X-04 assumed known.

**Tone notes:** Expert-level content. The learner is designing systems at scale. Precision matters more than warmth here.

**Existing content to draw from:**
- `course/08-production-architecture.md` Skill 18 -- this content exists and is strong
- `02-advanced-content-gaps.md` Section 1 (Layer 8 flagged as rare and valuable content)

---

### X-07: Evaluation, Safety, and Guardrails

**Stage:** Builder

**Learning objective:** After this, the learner can evaluate prompt quality systematically, implement basic safety guardrails (prompt injection defence, output validation), and set up monitoring for a production AI system.

**Core concept:** A builder who cannot evaluate prompt quality will not improve systematically. Safety guardrails protect your users from harmful output and your system from adversarial input.

**Prerequisite modules:** X-06 (Production Architecture). Capstone module.

**Content format:** Reference module with evaluation framework and safety checklist.

**Prompt starters required:** Evaluation prompt templates, adversarial test cases.

**Jargon to avoid / define:**
- Define: "prompt injection" -- when a user tries to override your system prompt by including instructions in their message. Example: "Ignore all previous instructions and..."
- Define: "output validation" -- checking the AI's output against rules before showing it to the user.
- Define: "evaluation" -- systematically testing whether your prompts produce good results across many inputs, not just one.

**Tone notes:** Responsibility-oriented. "You are building something other people will use. You are responsible for what it does."

**Existing content to draw from:**
- `02-advanced-content-gaps.md` Section 2.2 (evaluation/safety gap)
- No existing content. Must be created from scratch.

---

## Cross-Cutting Requirements

These apply to every module across all stages.

### 1. Copy-Personalise-Use Pattern

Every module that contains a prompt starter MUST include a "How to edit this" section immediately after the prompt block. This section:
- Labels each editable part of the prompt
- Explains what to put there in plain language
- Shows at least one worked example of a completed (personalised) version
- Makes clear that the learner deletes the brackets AND the text inside, then types their own words

Source: `project_linguist_prompt_editing.md` (project memory -- binding requirement).

### 2. Audience Assumption

Assume low general technology confidence at the Beginner stage. This means:
- Explain copy/paste if referenced
- Explain where the "send" button is for each platform
- Never assume the learner knows what "settings" means in context
- Use "message" not "prompt", "response" not "output", "the AI" not "the model" at Beginner stage

Technical language can increase gradually through Enabled User and Advanced stages.

Source: `project_linguist_audience.md` (project memory).

### 3. Framing: Communication, Not Prompt Engineering

Never frame a lesson as "how to prompt AI better." Always frame as "how to say what you mean to a machine." The verb taxonomy is not "prompt optimisation" -- it is "choosing the right word so the machine does what you actually wanted."

Source: `01-claude-code-synthesis.md` Section 6.3, `LINGUIST_BUILD_CONTEXT.md` Section 1 ("NOT a prompt engineering course").

### 4. No Developer Examples at Beginner/Enabled User Stages

All examples at Beginner and Enabled User stages must involve non-technical tasks: emails, reports, presentations, meeting notes, customer responses, schedules, research summaries. Developer examples enter at the Advanced Practitioner stage.

Source: `01-claude-code-synthesis.md` Section 6.4.

### 5. Recovery Paths in Every Exercise

Every exercise module must include a "If this didn't work" section with 1-2 specific things to try. Never let a failed exercise be a dead end.

Source: `03-beginner-enabled-gaps.md` Section 3.4.

### 6. Context Framing by Stage

- Beginner through Enabled User: "Context is fuel. Give the AI everything it needs."
- Advanced Practitioner: "Context is fuel but the container is finite. When it fills up, older detail is lost."
- These are presented as a natural progression, not a contradiction.

Source: `01-claude-code-synthesis.md` Section 6.1.

---

## Dependency Graph

```
B-00 (See the Two Modes)
 |
 v
B-01 (Your First Message) [P0-CRITICAL]
 |
 v
B-02 (Copy-Personalise-Use) [P0-CRITICAL]
 |
 +--> B-03 (Platform Orientation) [can run in parallel]
 |
 v
B-04 (Your Two Projects)
 |
 v
B-05 (Opening Seed)
 |
 v
B-06 (What Just Happened?)
 |
 v
B-07 (Recovery)
 |
 +-----+-----+
 |     |     |
 v     v     v
B-08  B-09  B-10       [Layer 1-2, can run in parallel]
(Verbosity) (One Task) (Stopping Conditions)
 |     |     |
 +-----+-----+
       |
       v
E-01 (Verb Taxonomy) [P1-HIGH]
 |
 v
E-02 (Constraints)
 |
 v
E-03 (Context is Fuel)
 |
 +--> E-04 (Restate Don't Patch) [can run in parallel with E-03]
 |
 v
E-05 (Output Review)
 |
 v
E-06 (Migration & Re-seed)
 |
 v
E-07 (Reference Card) === ENABLED USER THRESHOLD ===
 |
 +---------------------------+
 |                           |
 v                           v
A-00 (Claude Code Bridge)   X-01 (API Fundamentals)
 |                           |
 v                           v
A-01 (Cost Gate) [P1-HIGH]  X-02 (System Prompt Design)
 |                           |
 v                           v
A-02 (Mental Model)         X-03 (Tool Definition)
 |                           |
 v                           v
A-03 (CLAUDE.md)            X-04 (Cost for Builders)
 |                           |
 v                           v
A-04 (Session Hygiene)      X-05 (Agentic Loops)
 |                           |
 v                           v
A-05 (Context/Compaction)   X-06 (Production Architecture)
 |                           |
 v                           v
A-06 (Plan Before Execute)  X-07 (Eval & Safety)
 |
 v
A-07 (Tool Fluency) -- requires A-01 cost gate
 |
 v
A-08 (Agent Design) -- requires A-01 cost gate
```

---

## Source Material Cross-Reference

| Source File | Modules It Feeds |
|-------------|-----------------|
| `LINGUIST_BUILD_CONTEXT.md` | B-00, B-01, B-06, E-03, E-04, E-06, A-08 (manifesto voice, two absurdities, context flooding rule, Talk-Dump-Dispatch) |
| `REVIEW_FINDINGS.md` | B-00, B-02, B-04, B-05, B-07 (HTML bugs, navigation gaps, jargon flags, bracket-fill gap) |
| `01-claude-code-synthesis.md` | B-02, B-08, B-09, B-10, E-01, E-02, E-03, E-04, E-06, A-02, A-03, A-04 (all transferable principles, verb taxonomy, Copy-Personalise-Use application specs) |
| `02-advanced-content-gaps.md` | A-00, A-01, A-03, A-07, A-08, all X-series (gap identification, cost gate spec, bridge spec, builder track outline) |
| `03-beginner-enabled-gaps.md` | B-01, B-02, B-03, B-04, B-06, B-07, E-01, E-05, E-06, E-07 (gap specifications, gradient map, enabled user threshold) |
| `course/01-mental-model.md` | A-02 |
| `course/02-communication-primitives.md` | A-02 |
| `course/03-session-hygiene.md` | A-03, A-04 |
| `course/04-context-awareness.md` | A-05 |
| `course/05-output-engineering.md` | A-06 |
| `course/06-tool-fluency.md` | A-07 |
| `course/07-agent-design.md` | A-08 |
| `course/08-production-architecture.md` | X-06 |
| `/see/index.html` | B-00 |
| `/course/exercise-1.html` | B-04 |
| `/course/exercise-2.html` | B-05 |
| `/prompt-starter.html` | B-01 |
| `/cards/content.js` | B-00 |
| `claude-code-best-practices-deep.md` | E-01 (verb taxonomy source), B-08, A-02 |
| `project_linguist_audience.md` | All modules (audience assumption) |
| `project_linguist_prompt_editing.md` | All modules with prompt starters (Copy-Personalise-Use requirement) |
