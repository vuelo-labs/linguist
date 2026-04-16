# Linguist Build Journal
*A running record of decisions, discoveries, and turning points — written for a blog post audience*

---

## How to use this file

This is a journal, not a log. A log records what happened. A journal records what it felt like, what was surprising, what changed your mind, and what you'd do differently. Write in the first person. Be honest. The audience is someone who wants to understand what it's actually like to build a course with an AI agent swarm.

Each entry follows this structure:
- **Date / Stage**
- **What happened** (the facts)
- **What was surprising** (the interesting part)
- **What changed** (in the thinking, the product, the approach)
- **The moment** (one sentence that captures the essence of this entry for a blog reader)

---

## Entry 1 — The Audit Week
*Stage: v1 build*

**What happened:**
Started with a full site audit — link integrity, Supabase integration, narrative flow, accessibility. Ran multiple agents in parallel: one checking click-through, one on narrative flow, one on link integrity. Each agent reported back and spawned implementation agents. The approach was: Opus agents to diagnose, Sonnet agents to fix.

**What was surprising:**
How much was already broken that nobody had noticed. A CSS specificity bug was showing all three profile recommendation blocks simultaneously. The stage completion trigger in progress.js was pointing to the wrong module. The Netlify functions were 404ing silently. None of these were visible in casual use — they only surfaced under systematic review.

**What changed:**
The audit approach became the method. Instead of fixing things as they were noticed, the pattern became: audit first, log everything, fix in batches, commit on every change.

**The moment:**
"The output is a mirror — if the AI comes back confused, it's usually because you were confused."

---

## Entry 2 — The Reorder
*Stage: module sequencing*

**What happened:**
Discovered through a knowledge stacking analysis that several modules were teaching concepts before the prerequisites existed. A-01 and A-02 were in the wrong order. A-04 and A-05 were swapped. B-03 (Platform Orientation) was positioned before learners had a platform to orient to. Used `git mv` to swap directories without losing history.

**What was surprising:**
The knowledge map revealed that the course had been built in approximately the right order by intuition, but the intuition had made several systematic errors — all in the same direction. Advanced concepts were being introduced too early, and the deferral notes ("this will be covered in module X") were masking the problem rather than fixing it.

**What changed:**
Module order. And the understanding that sequencing is a different kind of design problem than content — you can write a perfect module and still place it wrong.

**The moment:**
"B-09 said 'go back to B-03' but B-03 comes after B-09 now. The cross-references had become a map to a city that had been rebuilt."

---

## Entry 3 — The Quiz
*Stage: onboarding redesign*

**What happened:**
Replaced the profile card system (three static cards: New to Role, Professional, Maker) with an 8-question True/False quiz. Each question maps to a course concept. The first unchecked question determines the recommended starting point. Built the localStorage routing so the quiz result propagates to the /course page dynamically.

**What was surprising:**
The profile card system wasn't broken — it was just doing the wrong job. It was asking people to self-identify rather than self-assess. "I'm a professional" means nothing. "I include a stopping condition in my messages" is either true or false, and the answer tells you exactly where to start.

**What changed:**
The onboarding philosophy. Instead of categorising people, the quiz reveals where their knowledge actually is, then routes them to the earliest concept they haven't encountered yet.

**The moment:**
"We're recommending a starting point. If it's too far along the journey, that's not a sign you can't do it — you just don't have the requisite knowledge. It's a very new thing and it's changing very fast."

---

## Entry 4 — The Swarm
*Stage: template pack brainstorm*

**What happened:**
Launched 8 agents simultaneously — 4 on the A-track (template repo ideas), 2 on B-track, 2 on E-track. Each agent had a distinct lens (generalist, pragmatist, creative, critic for the A-track; generalist and empathy/accessibility for B and E). Phase 1 was independent brainstorm. Phase 2 was sequential discussion threads where each agent read all previous entries before writing. Phase 3 was Opus review agents producing final production briefs.

**What was surprising:**
The agents disagreed. Not performatively — genuinely. A4's critique of A5's `clear-or-contaminate` repo ("a contaminated run producing plausible output actively misleads the learner") flipped the consensus from a structurally elegant but pedagogically dangerous choice to a safer one. A3's late case for the almanac-as-worked-example resolved a debate that the structural agents couldn't close.

**What changed:**
The understanding of what multi-agent brainstorming is actually for. It's not about getting more ideas. It's about getting different *kinds* of scrutiny on the same idea. The pragmatist catches things the creative misses. The critic catches things everyone else was too polite to say.

**The moment:**
"9,769 lines of content from 14 files. The ideas that survive aren't the cleverest ones — they're the ones that survived being argued with."

---

## Entry 5 — The Missing Mode
*Stage: philosophical audit*

**What happened:**
Three agents reviewed the full course against the Human Mode / Machine Mode frame that had emerged organically from discussions. Finding: Machine Mode is taught throughout the course. Human Mode gets one sentence in B-09. The transition between them — which is the actual skill — is never taught at all.

**What was surprising:**
The course had been built around a philosophy it never named. Every technique — stopping conditions, verb choice, opening seed — is a Machine Mode skill. But the course presents them as "how to use AI," not as one half of a two-mode operating system. It's like teaching someone to write in formal register without telling them that informal register exists or when to use it.

**What changed:**
The v2 thesis. "When thinking, use AI to expand your ideas. When you're ready to implement, switch to precision." The transition is the course.

**The moment:**
"If writing the prompt is hard, that's usually a signal that the problem isn't yet clear. The prompt is the thinking, not just the instruction."

---

## Entry 6 — The V2 Question
*Stage: strategic pivot*

**What happened:**
Launched three Opus agents to audit v1, design the v2 philosophy (Cyborg), and design the v2 architecture. The brief: scenario-first micro-lessons, profile-driven content, bullshit detection as an explicit module, automation as the advanced layer. The name under consideration: Cyborg.

**What was surprising:**
How clearly the v1 problems pointed at v2 solutions. The "too ready" problem (abstract instruction instead of scenario-first) wasn't a polish issue — it was a structural choice that had been made and could be unmade. The commercial/philosophical disconnect wasn't a messaging problem — it was a targeting problem. v1 tried to serve everyone.

**What changed:**
The project. v1 is complete. v2 is a different course with a different thesis built on the lessons of building v1.

**The moment:**
"Cyborg — it's where we teach AI integration with work and life processes, and discuss the combination with automation."

---

## Template for new entries

Copy this for each new entry:

```
## Entry [N] — [Title]
*Stage: [what phase of the build]*

**What happened:**

**What was surprising:**

**What changed:**

**The moment:**
```

---

*Last updated: 2026-04-15*
