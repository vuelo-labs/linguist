# Verb Taxonomy — Everyday AI Reference

---

## The Concept

**The verb you lead with tells the AI how much it's allowed to decide on its own.**

---

## The Safe Verbs

These verbs set a clear ceiling. The AI does only what you specified and stops there. Use these as your defaults.

---

### Summarise

**What it means:** Condense this into the key points, without changing what it says.

**What the AI will do:** Shorten the material, keep the substance, preserve your meaning.

**What the AI will not do:** Rewrite your voice, restructure your argument, or add ideas of its own.

**Worked example:**

> Summarise this meeting transcript in five bullet points. Focus on decisions made and next steps agreed. Do not include any discussion that did not lead to a decision.

**How to edit this for your own use:**
Copy the example above. Replace "meeting transcript" with whatever you want shortened (a report, an email thread, a document). Replace "five bullet points" with however many you need. Replace the last sentence with whatever you want left out.

---

### Explain

**What it means:** Help me understand this — read-only, no changes.

**What the AI will do:** Walk you through what something means, how it works, or why it matters.

**What the AI will not do:** Rewrite, edit, or touch the original in any way.

**Worked example:**

> Explain what this contract clause means in plain language. Don't rewrite the clause — just tell me what it's saying and what I'd be agreeing to.

**How to edit this for your own use:**
Copy the example above. Replace "contract clause" with whatever you need explained (a policy, a graph, a set of figures, a legal term). The instruction "don't rewrite" is worth keeping every time — it makes explicit that this is a read-only task.

---

### List

**What it means:** Give me structured output — options, items, or steps — without writing prose.

**What the AI will do:** Produce a set of items relevant to what you asked for.

**What the AI will not do:** Write lengthy paragraphs, make recommendations beyond what you asked, or decide the format for you.

**Worked example:**

> List five possible subject lines for this customer apology email. Keep them under ten words each. Don't rewrite the email itself.

**How to edit this for your own use:**
Copy the example above. Replace "five possible subject lines" with what you want listed (agenda items, possible responses, talking points, questions to ask). Keep the number specific — "list some" produces a different result than "list five."

---

### Fix

**What it means:** Find and correct the specific problem I've named. Do not touch anything else.

**What the AI will do:** Address the exact issue you identified.

**What the AI will not do:** Rewrite surrounding content, improve things you didn't mention, or expand the scope beyond the stated problem.

**Worked example:**

> Fix the grammar errors in the second paragraph of this report. Do not rewrite or rephrase any sentences — only correct errors.

**How to edit this for your own use:**
Copy the example above. Replace "grammar errors in the second paragraph" with the specific problem you want fixed (a date that is wrong, a figure that doesn't match, a name that is misspelled). The more precisely you name the problem, the less the AI decides for itself.

---

### Draft

**What it means:** Create a first version of something that does not yet exist.

**What the AI will do:** Produce a starting point you can edit — a first attempt, not a finished product.

**What the AI will not do:** Treat this as finished. Draft signals that this is material to be worked with, not delivered as-is.

**Worked example:**

> Draft a short email to a client letting them know their project deadline has moved by one week. Keep the tone apologetic but confident. Three short paragraphs maximum.

**How to edit this for your own use:**
Copy the example above. Replace the description of the email with whatever you need a first version of (a presentation introduction, a job description, a policy notice). Specify tone and length — without them, the AI picks its own defaults.

---

### Rewrite

**What it means:** Same content, different style or format. The meaning stays; the expression changes.

**What the AI will do:** Rephrase, restructure, or change the register of what you have given it.

**What the AI will not do:** Add new content, remove points you haven't told it to cut, or change the underlying message.

**Worked example:**

> Rewrite this performance review comment in a warmer, more encouraging tone. Keep all the same feedback points — don't add or remove anything, just change how it sounds.

**How to edit this for your own use:**
Copy the example above. Replace "performance review comment" with what you want rewritten (a customer complaint response, a formal notice, a team update). Be explicit about what to keep — "keep all the same points" and "don't add or remove anything" are useful constraints to carry over.

---

### Compare

**What it means:** Show me the meaningful differences between two things.

**What the AI will do:** Identify and describe the differences (and similarities, if useful) between the items you give it.

**What the AI will not do:** Recommend which is better unless you ask, make changes to either item, or merge them together.

**Worked example:**

> Compare these two supplier quotes side by side. For each one, tell me: total cost, delivery time, and payment terms. Don't recommend one — just lay out the facts.

**How to edit this for your own use:**
Copy the example above. Replace "two supplier quotes" with whatever you want compared (two versions of a document, two job candidates' CVs, two proposals). Specify the dimensions you want compared — without them, the AI decides which differences matter.

---

## The Risky Verbs

These verbs have no ceiling. When you use them, you are giving the AI permission to decide what "better" means — and it will. Use these only when you genuinely do not mind what changes.

---

### Improve

**Why it's risky:** "Improve" tells the AI to make this better without defining what better means. It may change your tone, restructure your argument, cut things you wanted to keep, or add things you never asked for. Every decision it makes feels justified — it was asked to improve.

**What to use instead:** Choose the specific dimension you want improved and use a safe verb.

- Instead of "improve this email" — try "rewrite this email to be more concise. Keep all the main points. No longer than three short paragraphs."
- Instead of "improve this report introduction" — try "rewrite the first paragraph so it leads with the key finding. Don't change anything else."

**Before / After:**

Before (risky):
> Improve this customer complaint response.

After (safe):
> Rewrite this customer complaint response so it opens with an apology in the first sentence. Keep the resolution I've offered unchanged. Don't add new information.

The risky version gives the AI free rein. The safe version tells it exactly what to change and what to leave alone.

---

### Clean up

**Why it's risky:** "Clean up" sounds minor, but it has no defined scope. The AI may rewrite sentences, restructure paragraphs, cut repetition you intended, or change your voice — all in the name of tidying. Each change seems reasonable. The cumulative effect may not be what you wanted.

**What to use instead:** Name the specific thing you want cleaned.

- Instead of "clean up this document" — try "fix any spelling and grammar errors in this document. Do not rewrite or rephrase anything."
- Instead of "clean up my notes" — try "reformat these notes as a bulleted list. Keep every point — don't cut or combine anything."

**Before / After:**

Before (risky):
> Clean up my presentation draft.

After (safe):
> Fix the spelling errors in this presentation draft. Do not rewrite any slides or change the structure.

---

### Make better / Enhance / Optimise

**Why they're risky:** These are all variations of "improve" with different words. Each one delegates the definition of success to the AI. "Enhance" invites additions you didn't ask for. "Optimise" lets the AI decide what the goal even is. "Make better" is the vaguest of all.

**What to use instead:** Stop and ask yourself what specifically you want to be better. Then use a safe verb for that thing.

- Instead of "make this better" — try "summarise this into three key points" or "fix the awkward sentence in the second paragraph."
- Instead of "optimise this agenda" — try "reorder these agenda items so the most time-sensitive ones come first. Don't add or remove any items."
- Instead of "enhance this report" — try "add a one-sentence summary at the top of each section. Don't change anything else."

---

## Quick Reference

| Verb | What the AI does with it |
|---|---|
| **Summarise** | Condenses to key points — does not add or rewrite |
| **Explain** | Describes what something means — read-only, no changes |
| **List** | Produces structured items — no prose, no recommendations |
| **Fix** | Addresses the named problem only — does not touch the rest |
| **Draft** | Creates a first version — treats output as a starting point |
| **Rewrite** | Changes expression, not meaning — keeps your content intact |
| **Compare** | Shows differences between things — does not recommend or merge |
| **Improve** | **Risky — use with caution.** No ceiling. AI decides what counts as better. |
| **Clean up** | **Risky — use with caution.** Scope undefined. AI decides what needs tidying. |
| **Make better** | **Risky — avoid.** Vague direction with no ceiling. |
| **Enhance** | **Risky — avoid.** Invites additions you did not request. |
| **Optimise** | **Risky — avoid.** AI decides what the goal is. |

> **For those who want the technical term:** The amount a verb extends the AI's decision-making authority is sometimes called its "blast radius" — how far the effects can spread beyond what you intended. Safe verbs have a small blast radius. Risky verbs have no ceiling.

---

## The Pattern

Every well-formed instruction has three parts:

```
[Safe verb] [specific thing]. [Stopping condition]. [What to leave alone].
```

**Worked example:**

> Summarise the key decisions from this board meeting transcript. Stop after five bullet points. Do not include discussion that did not result in a decision or an action.

- Safe verb: **Summarise**
- Specific thing: **the key decisions from this board meeting transcript**
- Stopping condition: **Stop after five bullet points**
- What to leave alone: **Do not include discussion that did not result in a decision or an action**

**Now fill in your own:**

> __________ [safe verb] __________ [what specifically]. __________ [stopping condition]. __________ [what to leave alone].
