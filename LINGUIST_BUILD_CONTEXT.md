# Linguist — Build Context for Claude Code

## Purpose of this document

This is the complete context document for building **Linguist**, a new standalone product by Vuelo Labs. It describes the product vision, architecture, user journey, experience design, and technical specification. It also documents the decision process that led to this product, and what exists in a previous codebase that may be selectively reused.

Read this entire document before writing any code. Every design decision is intentional and explained.

---

## 1. PRODUCT VISION

### The Problem

Humans are spending 40-50+ hours per week communicating with AI tools using the same emotional, social, and performative communication patterns they use with other humans. This is causing a quiet cognitive burnout crisis — not from the work itself, but from the mismatch between communication modes.

People write polite preambles to machines that don't register politeness. They feel guilty closing a laptop on a "conversation." They apologise for follow-up messages to a system with no concept of interruption. They soften feedback to an entity with no feelings to hurt. Meanwhile, the constant machine-paced interaction is eroding their human communication skills — they start talking to colleagues in bullet points and structured outputs.

This is not an AI skills gap. It is a communication mode confusion problem.

### The Insight

Humans and machines are fundamentally different. This is not a flaw in either — it is by design.

| Humans | Machines |
|--------|----------|
| Creative, feeling-based, analog | Persistent, driven, optimised |
| Chaotic, non-deterministic | Deterministic, consistent |
| Thrive on relationships, communication, rest | Thrive on input, tasks, process |
| Energy follows a sine wave — peaks, troughs, recovery | Energy is uniform — constant throughput, no fatigue |
| Communication is descriptive, emotional, ambiguous | Communication is precise, structured, literal |

The exhaustion comes from humans trying to flatten their sine wave to match the machine's flat line. That is unsustainable because it is biologically impossible.

### The Solution

**Linguist** teaches one skill: **know whether you're talking to a human or a machine, and communicate accordingly.**

This is code-switching. The same way a bilingual person switches languages mid-sentence without effort, Linguist teaches people to switch fluently between human and machine communication modes.

The skill is smaller than people think. It is noticing which mode you are in.

### The Core Framework: Two Modes

| Mode | When | How you communicate | Energy cost |
|------|------|---------------------|-------------|
| **Human** | Talking to people — colleagues, friends, family | Warm, messy, emotional, descriptive, ambiguous, rich | High — and worth every bit of it |
| **Machine** | Dispatching tasks to AI tools | Precise, structured, direct, verbose input is fine, no social performance | Low — if you stop performing humanity at the machine |

Key principles:
1. Machines execute. Humans relate. Neither is broken.
2. The exhaustion comes from being stuck in one mode for everything.
3. Context is fuel for machines, not a burden. Give them more input, not more politeness.
4. Rest is your design. The machine will wait. It does not mind.
5. Human communication becomes MORE important in the AI age, not less — it is the only thing that cannot be dispatched.
6. The skill is smaller than you think. It is noticing which mode you are in.

### The Two Absurdities

The entire product is anchored by two jokes that reveal the problem:

**Absurdity 1 — Talking to a machine like a human:**
> "Hey! Hope you're having a good day. So I've got this thing, it's kind of a big ask and I totally understand if you can't, but would you maybe be able to take a look at this report when you get a chance and let me know what you think? No rush at all!"

**Absurdity 2 — Talking to a human like a machine:**
> "Request: Lift to airport. Departure time: 2am. Query: Are you available? Expected output: yes/no."

Both are wrong. Both happen constantly. Recognising the absurdity is the teaching moment.

### The Deeper Communication Model: Talk → Dump → Dispatch

Within the two-mode framework, there is a practical workflow for getting from messy human thought to clean machine execution:

| Step | Mode | Input method | What happens |
|------|------|-------------|--------------|
| **Talk** | Human | Voice / conversation | You think out loud with a person or yourself. Messy, raw, honest. This is where ideas form. |
| **Dump** | Bridge | Voice into machine | You stream your unstructured thoughts into the machine. It reflects structure back. You refine together. The machine is your thinking partner. You do NOT need to be coherent first. |
| **Dispatch** | Machine | Typed, short, precise | You take the structured output and write a clean machine-readable instruction. New conversation — no context flooding from the Dump phase. |

Critical rules:
- Voice is for Talk and Dump. Typing is for Dispatch.
- Dump and Dispatch should NEVER happen in the same conversation. Think here. Execute there.
- Your voice is not a rough draft. It is the real thing. The machine's job is to translate it, not improve it.
- When dumping via voice, preserve the humanness — filler words show uncertainty, restarts show where thinking pivoted. These are signals, not noise.

### Context Flooding Rule

When speaking with a human, a human will naturally try to explain the same idea using a different reference or framing within the same conversation. This is how humans find shared understanding — it is valuable in human-to-human communication.

With machines, this behaviour creates context flooding. The machine now has two or more conflicting framings and tries to reconcile all of them. This degrades output quality.

The rule: when you want to reframe or try a different angle with a machine, **start a new conversation**. The machine has no continuity preference. Every conversation is fresh. Use that.

### The Sine Wave

Human energy and cognition follows a sine wave — peaks of creativity and focus, troughs of rest and recovery. Machine energy is a flat line — uniform throughput at all times.

A person trying to match a flat line with a sine wave will burn out. The sine wave is not a weakness. It IS the human design. Rest is productive. The machine will still be there after the trough.

This sine wave concept should be a recurring visual motif throughout the product — in the branding, in the experience, in the daily content.

### What This Product Is NOT

- NOT a prompt engineering course
- NOT an AI upskilling platform
- NOT a structured thinking curriculum
- NOT a productivity tool
- NOT a daily habit app with engagement loops

It is an 8-minute reframe that changes how you communicate forever. Plus ongoing content that reinforces the insight.

---

## 2. PRODUCT ARCHITECTURE

### Components

| Component | Purpose | Priority |
|-----------|---------|----------|
| **Landing page** | Manifesto + entry to the experience | Ship first |
| **The Experience** | 8-minute guided walkthrough: See → Try → Know | Ship first |
| **Daily cards** | Social content — two-panel visual cards showing human/machine absurdities | Ship alongside, begin posting immediately |
| **Workshop pack** | Facilitated team version (premium, paid) | Build after traction |

### The Experience — 8 Minutes, 3 Beats

This is the core interactive product. It runs in a browser. No login required. No data persisted.

#### Beat 1: SEE (2 minutes)

**Purpose:** Show the two absurdities. Create recognition and laughter.

**Implementation:**
- Display Absurdity 1: a human talking to a machine with excessive social performance. Warm colour palette, handwritten-style font.
- Display Absurdity 2: a human talking to a friend in machine-readable dispatch format. Cool colour palette, monospace font.
- The user recognises themselves in at least one. That is the hook.
- Brief framing text: "Both are wrong. Both happen constantly. The skill is just knowing which one you're in."

**Design:**
- Two-panel layout, side by side on desktop, stacked on mobile
- Left panel: warm palette (cream, terracotta tones) — human mode
- Right panel: cool palette (slate, blue-grey) — machine mode
- The colour contrast physically teaches the mode difference
- Minimal animation — content arrives with quiet confidence

#### Beat 2: TRY (5 minutes)

**Purpose:** Same intent, write it both ways. Feel the cognitive difference.

**Implementation:**
- Present a simple scenario (e.g., "You need a summary of last quarter's sales data")
- Two input areas side by side (or sequenced on mobile):
  - LEFT (warm palette): "How would you ask a colleague?" — free text input
  - RIGHT (cool palette): "How would you tell the machine?" — free text input, or guided assembly of structured components
- After submission, the system highlights the difference:
  - In the human version: the warmth, the context, the relationship maintenance — label it as valuable
  - In the machine version: the precision, the structure, the directness — label it as what the machine actually needs
- Key teaching moment: neither is wrong. They serve different purposes. The skill is switching.

**Design:**
- Colour palette shifts as the user moves between panels
- The transition between warm and cool should feel like a gear change — smooth, deliberate, noticeable
- Input areas should feel different: the human side could have a slightly rougher, more organic textarea styling; the machine side could have a cleaner, more structured input feel
- Consider offering an optional voice input button on the human side with the prompt "Don't type this. Say it." — reinforcing that human communication is naturally spoken

**Scenarios (rotate or randomise):**
1. You need a summary of last quarter's sales data
2. You want to reschedule a meeting
3. You need to understand why a project is behind
4. You want feedback on an idea
5. You need a recommendation for a restaurant

#### Beat 3: KNOW (1 minute)

**Purpose:** Anchor the reframe. Give permission to stop.

**Implementation:**
- The split-panel image: a person laughing with a colleague (warm side) while their hands type clean machine dispatch (cool side). Same moment. Two languages. No friction.
- Closing text: "You now notice which mode you're in. That is the only skill. The machine will wait. It does not mind. Go be human."
- Optional: short video of the founder delivering this message directly to camera. Authentic, one-take, not polished. The medium IS the message.

**Design:**
- Both palettes visible simultaneously — the visual representation of fluency
- The sine wave motif appears here — human rhythm acknowledged and celebrated
- No CTA to sign up for anything. No upsell. The experience is complete.
- Below the closing: "Share this with someone who needs to hear it." + share buttons
- Below that: link to follow the daily cards on social

### Daily Cards

**Purpose:** Ongoing content that reinforces the Linguist message, builds audience, drives organic discovery of the experience.

**Format:** Branded visual cards. Fixed template, swap the text. Instantly recognisable in a feed.

**Card layout:**

```
┌─────────────────────────────────────────┐
│  LINGUIST (subtle branding, top)        │
├───────────────────┬─────────────────────┤
│                   │                     │
│   HUMAN MODE      │   MACHINE MODE      │
│                   │                     │
│   Warm bg         │   Cool bg           │
│   Handwritten     │   Monospace         │
│   font            │   font              │
│                   │                     │
│   "Hey! Hope      │   task: summarise   │
│   you're well,    │   data: Q3 sales    │
│   I was           │   format: table     │
│   wondering..."   │   length: <100w     │
│                   │                     │
│   ~ ~ ~ ~ ~       │   ─────────         │
│   (sine wave)     │   (flat line)       │
│                   │                     │
├───────────────────┴─────────────────────┤
│  One-line insight. Dry, warm.           │
└─────────────────────────────────────────┘
```

**Visual elements:**
- Left panel: warm background (#FAF8F4 range), handwritten or casual serif font, sine wave divider
- Right panel: cool background (#F0F4F8 range), monospace font, flat line divider
- Divider between panels: can be the sine wave morphing into a flat line
- Bottom: one-line caption — dry, wry, never preachy
- Top: Linguist branding, minimal
- Aspect ratio: 1:1 for social feeds

**Card variations:**
Some cards show both absurdities (human→machine and machine→human). Some show just one direction. Some show the Talk→Dump→Dispatch flow. Some show the same intent in two modes. The template structure stays consistent; the content rotates.

**Three-panel variant** (occasional, for the voice insight):

| Panel 1 | Panel 2 | Panel 3 |
|---------|---------|---------|
| **Spoken** (raw transcript) | **Dumped** (machine reflects structure) | **Dispatched** (clean typed instruction) |
| Chaotic bg, handwritten | Transitional bg | Clean bg, monospace |

**Production pipeline:**
1. Generate 30 content pairs (human/machine) using AI — batch monthly
2. Drop into card template (React component that exports images, or Canva template)
3. Schedule via Buffer/Later
4. Fully automatable once the template is locked

### Landing Page (Manifesto)

**Purpose:** The home of the idea. Anchors everything.

**Content:**
- The manifesto — one page, the full argument for why humans and machines communicate differently, why that is fine, and why the burnout comes from confusing the two
- Entry point to the 8-minute experience
- Links to daily cards on social
- No email capture wall. No gated content. The manifesto and experience are free, forever.
- Optional email capture at the bottom: "Want to bring this to your team?" — this is the only commercial pathway

**Design:**
- The warm/cool dual palette should be present but the landing page defaults to warm — this is the human-facing page
- Typography: warm serif for headlines (as already established), clean sans-serif for body
- The sine wave motif as a subtle background or section divider
- Mobile-first

### Workshop Pack (Premium — Later)

**Not for v1.** Documented here for future reference.

A facilitated version of the Linguist experience designed for teams of 5-30 people. Contains:
- Facilitator guide (PDF)
- Slide deck
- Printed card handouts
- Group exercises based on the See → Try → Know framework
- Self-serve purchase (Gumroad or Lemon Squeezy)

Revenue model: organisations discover Linguist through the daily cards or the manifesto, want to bring it in-house, purchase the workshop pack or book a live session. This is goodwill-driven — they come to you, you do not sell to them.

---

## 3. VISUAL DESIGN SYSTEM

### Colour Palettes

The product uses two distinct colour palettes that represent the two communication modes. The visual shift between palettes is a core teaching mechanism — users physically feel the mode change through colour.

#### Human Mode (Warm)

```
Background:      #FAF8F4  (warm off-white)
Card/Surface:    #F2EDE6  (warm light grey)
Input:           #FDFBF8  (near white, warm)
Border:          #E5DFD6  (warm border)
Border Focus:    #8C7355  (warm brown)
Text Primary:    #2A2420  (warm near-black)
Text Muted:      #7A6E68  (warm grey)
Text Faint:      #B0A89E  (warm light grey)
Accent:          #8C7355  (warm brown)
Accent Soft:     #A08870  (lighter warm brown)
Accent Light:    #F5EFE6  (very light warm)
```

#### Machine Mode (Cool)

```
Background:      #F0F4F8  (cool off-white)
Card/Surface:    #FFFFFF  (clean white)
Inner Surface:   #F8FAFC  (very light cool)
Border:          #D8E2ED  (cool border)
Text Primary:    #263340  (cool near-black)
Text Muted:      #5F7485  (cool grey)
Text Faint:      #9EB0C0  (cool light grey)
Accent:          #4A7FA5  (slate blue)
Accent Soft:     #6B9BBF  (lighter blue)
Accent Light:    #E5EFF7  (very light cool)
```

#### Transition / Dump Mode

When the user is in the "Dump" phase (thinking with the machine), the palette should transition from warm to cool — use CSS transitions or a blend. This represents the bridge between human thinking and machine structure.

### Typography

| Context | Font | Style |
|---------|------|-------|
| Human mode headlines | Georgia or warm serif (Fraunces, Literata, Newsreader) | Italic or regular, large |
| Human mode body / input | System sans-serif, slightly loose tracking | Feels natural, conversational |
| Machine mode headlines | Monospace (JetBrains Mono, Source Code Pro, or system monospace) | Regular, clean |
| Machine mode body / input | Monospace | Precise, structured |
| Branding | Clean sans-serif (Inter, DM Sans) | Subtle, never dominant |

### The Sine Wave Motif

The sine wave represents human energy rhythm. The flat line represents machine energy.

Use as:
- Section dividers (sine wave on human side, flat line on machine side)
- Background motif on the landing page
- The daily card divider
- Potentially the logo or brand mark itself

Implementation: simple SVG. Not animated on first load — can have subtle animation on scroll or hover.

```svg
<!-- Human: sine wave -->
<path d="M0,20 C10,0 20,40 30,20 C40,0 50,40 60,20 C70,0 80,40 90,20" 
      stroke="currentColor" fill="none" stroke-width="2"/>

<!-- Machine: flat line -->
<line x1="0" y1="20" x2="90" y2="20" 
      stroke="currentColor" stroke-width="2"/>
```

### Motion and Transitions

- Colour palette transitions between modes: smooth CSS transition, ~300ms
- Content entrance: subtle fade-in, no bounce, nothing playful
- The mode switch should feel like shifting gears in a car — deliberate, smooth, physical
- No loading animations, no skeleton screens, no progressive disclosure tricks

---

## 4. TECHNICAL SPECIFICATION

### Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Frontend | Static HTML + CSS + vanilla JS, OR lightweight React (Vite) | Simplicity. No framework overhead for an 8-minute experience. |
| Hosting | Netlify (free tier) | Auto-deploy from GitHub, free SSL, global CDN |
| API proxy | Netlify Function (if any AI features needed) | Serverless, no infrastructure |
| Daily card generation | React component or HTML canvas → image export | Automatable template |
| Social scheduling | Buffer or Later | API-driven scheduling |

### Repository

**New repo:** `vuelo-labs/linguist`

Do NOT reference, import from, or depend on `vuelo-labs/tutor`. This is a clean build. If specific code patterns are useful (e.g., the Netlify Function structure for Claude API proxy), copy the relevant code into this repo independently.

### File Structure

```
linguist/
├── index.html              # Landing page / manifesto
├── experience/
│   └── index.html          # The 8-minute experience (or React SPA entry)
├── style.css               # Global styles, both palettes, transitions
├── script.js               # Minimal JS for the experience
├── cards/
│   ├── template.html       # Card generation template
│   └── generate.js         # Script to batch-generate card images
├── assets/
│   └── sine-wave.svg       # Motif SVGs
├── netlify.toml
└── README.md
```

If using React for the experience (recommended for the interactive Try beat):

```
linguist/
├── index.html              # Landing page / manifesto (static, no framework)
├── style.css
├── script.js
├── experience/             # React app (Vite)
│   ├── src/
│   │   ├── main.jsx
│   │   ├── Experience.jsx  # Main component — See, Try, Know
│   │   ├── BeatSee.jsx     # Beat 1
│   │   ├── BeatTry.jsx     # Beat 2
│   │   ├── BeatKnow.jsx    # Beat 3
│   │   └── theme.js        # Colour palettes, typography tokens
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── cards/
│   ├── CardTemplate.jsx    # Card generation component
│   └── generate.js
├── netlify.toml
└── README.md
```

### Netlify Configuration

```toml
[build]
  command = "cd experience && npm install && npm run build"
  publish = "."

# SPA fallback for the experience
[[redirects]]
  from = "/experience/*"
  to = "/experience/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

### Performance Requirements

- Lighthouse 95+ across all metrics
- Total page weight under 100KB for the landing page
- Experience app under 200KB total
- First contentful paint under 1 second
- No JS required for the manifesto page (progressive enhancement)
- No external dependencies beyond Google Fonts

### No Backend for V1

The 8-minute experience does not require:
- User accounts or authentication
- Data persistence
- AI API calls (the Try beat uses static scenarios and client-side comparison, not AI-generated responses)
- Analytics beyond basic Netlify Analytics (free tier)

If voice input is added to the Try beat later, a Netlify Function for speech-to-text can be added. This is NOT in scope for v1.

---

## 5. CONTENT

### Manifesto (Landing Page)

The manifesto has been written and published: https://medium.com/@lcroash/i-find-myself-yawning-more-da2422e68e00

It was produced by the founder voice-recording a raw, unstructured dump of his thinking, then shaping it with AI into structured prose while preserving his voice, conviction, and personal experience. This process is itself a case study in the Talk → Dump → Dispatch workflow that Linguist teaches.

The full manifesto text follows. Implement this as the landing page content. Do not rewrite it — the voice is intentional and personal.

---

**MANIFESTO TEXT — BEGIN**

# I find myself yawning more…

*Messy things… ordered.*

## .. and I'm always a bit tired.

And it's not the work. It's not. It's everything. It's the decisions. It's the constant processing. It's every single thing needing your attention and your opinion and your response all the time forever. Your brain is just… it's not built for this. No brain is. We're analog. We're these blobs of energy bumping into other blobs of energy trying to figure out if we can relate to each other and maybe, possibly, help each other grow. That's it. That's the whole thing. That's what we've been doing for billions of years.

And we're good at it. People like people. We like the talking and the sharing and the sitting with a friend and eating together and looking at the sky and thinking about stuff. We like the messy bits. The conversations that don't go anywhere. The pauses. The feelings that take two days to understand.

That's not a bug in your design. That IS your design. *(and also getting older)*

## Machines are different.

A machine has a task. It was built for that task. It is happiest doing that task. When it's done, it looks for more instructions. If you don't give it any?

> It waits. It'll wait forever. It does not mind.

It doesn't need you to be nice. It doesn't need you to say please. It doesn't need your warmth or your apology or your "hope you're well!" It has no feelings to hurt. It is the smartest, most capable, most obedient assistant you can imagine and also it's an idiot because it knows everything but it doesn't know what to do. It needs one thing from you.

Instructions. **Not a conversation. Not a relationship.** Instructions.

Don't use machines as friends. You can. But there are better options. Real ones. Ones that'll meet you for a pint and tell you you're being an idiot. Use machines to get shit done and move on. That's what they're for. That's what they're good at. Let them do that.

Machines aren't wrong for being machines. Humans aren't wrong for being humans. But we need to stop pretending they're the same thing just because the machine speaks your language and appears to have a personality.

## Here's what's actually happening.

You go to work. You talk to a machine all day. You start to think like a machine. You process and you decide and you process and you decide and your battery just… empties. And by the time you get home to the people you actually love — the people who you want to give your warmth and your attention and your presence to — you can be depleted, running on fumes or unable to come down from a day of SO MUCH PROGRESS.

You spent it on a machine. A machine that didn't need it, didn't really want it and couldn't use it.

Think about it. The emotional cost of persuading something that was going to do what you told it anyway. The cognitive cost of performing social rituals at something that can't receive them. You're hedging and softening and apologising and thanking and "no rush at all!" and "totally understand if you can't!" , "Please..", "Thank You", "Sorry"… and every single one of those costs you energy. Real energy. Energy you will not get back.

Your brain sees something that speaks your language and it does what brains do. It tries to build a relationship. But there's no one on the other side. There's a task execution engine wearing a conversation costume. And you're burning your battery trying to be friends with it.

## The cost is real.

The cost is burnout. The cost is strained relationships with the people who actually matter. The cost is not enjoying your life. And what's the point? Why work so hard if you're not enjoying your life?

This isn't about AI taking jobs *(Thats a very different conversation)*.
This isn't about "learning to prompt better." Prompting better is bullshit if it doesn't make your life better. And what exactly is better prompting?
The hype has to end. We need actual value from these tools. And the value isn't in doing more. It's in spending less of yourself on things that don't need you.

Pause here. This is a big change versus this time last year. I'm not advocating for less work. I'm not saying slow down or opt out. I'm saying that human effort cannot scale linearly with machine effort. The machine gets faster, so you work faster. The machine does more, so you do more. That doesn't work. **We** are analog. **It** is digital. There has to be some translation in the middle. Something that lets the machine scale while you stay human.

We need to take advantage of the strengths of both. Not have each other as competition. Machines can't beat us at the truly human stuff — the relationships, the creativity, the mess, the feeling, the growth. And humans can't beat machines at the truly machine stuff — the persistence, the processing, the tireless execution. Stop competing. Start collaborating. Each doing what they're actually built for.

## I know because I did it.

The trick is it looks like success. Early starts. College. Posting on LinkedIn. Writing articles. Building side projects. Working my way up at work. I was doing all the things you're told to do to be successful. All self-directed. Nobody made me do this. I was following the playbook. And I eventually broke.

I had a wobble. I ended up leaving two courses early. It took me nine months of hard focused work on myself and my relationships to come back from that. If you want to know more about that, ask me — I'll talk about it openly.

> I'm here to let you know that if you feel this way. You are not alone.

Then I started working with AI. And it brought back a lot of familiar feelings. Same pattern. Different costume. The machine was always ready for more. Always had energy. Always said "what's next?" So I kept going. And the whole time it felt like progress. That's the trap. The machine makes burning out feel productive.

And then I recognised the feeling. Same feeling. Same costume on a different day.

So I stopped. I stripped it all back. And the only thing that actually mattered was this:

> Know whether you're talking to a human or a machine.

## There's two modes. That's it.

**Human.** You're talking to a person. It's warm and messy and organic. You circle around ideas. You explain the same thing three different ways because that's how humans find shared understanding. You pause. You feel. You react. It's been this way for millions of years. It's beautiful and it's expensive and it's worth every single bit of that expense because this is where relationships live. This is where trust lives. This is where all the good stuff lives.

**Machine.** You have a task. Here's the task. Here's what you expect. Go. That's it. No warmth. No performance. No apology. The machine doesn't experience your politeness. It just needs to know what to do.

Two modes. Completely different. Know which one you're in. That's the whole skill.

## It's smaller than you think.

You don't need a course. You don't need a framework. You don't need to "learn AI." You just need to notice. Just notice when you're performing human communication rituals at a machine that cannot receive them.

That's it. That's the only skill. And once you see it, you can't unsee it.

You'll catch yourself typing "Hope you're well!" to a language model. You'll notice the three paragraphs of preamble before your actual question. You'll feel the guilt when you close the laptop and then you'll realise — the machine doesn't know you left. It doesn't care. It'll be exactly where you left it when you come back. It'll be fine. It's always fine.

## Rest is your actual job.

Here's the mad thing. When you take more time to think through your idea, it takes less time to execute. When you rest — when you let your brain do its slow, messy, analog thing — you come back with better ideas than two more hours of grinding would have given you.

Two days of not thinking about this problem. I just… put it into my brain and let it sit there. Let the slow processes do their thing. And on the third day, the answer was obvious.

A machine couldn't have done that. A machine doesn't have troughs. Doesn't have the slow wave processing that turns confusion into clarity overnight.

> That's a human thing. And it only works if you stop.

## Let the machine be a machine. You be a human.

Get your army of machines. Take your messy idea — your big, sprawling, half-formed, beautiful human idea — and dump it in. All of it. Audio, text, images, whatever. The machine will help you find the structure. It'll reflect your chaos back as something organised. And then you take that and you write a clean instruction and you dispatch it and you walk away. The machine is amazing at prompting… way better than a human.

The machine will execute.
Might take a minute.
Might take a day.
It'll come back when it's done and look for more instructions.

> It will always, forever, ever and ever and ever, look for more instructions.

But here's the thing. A human can't do that. A human can't wait forever for instructions. They'll do something. They'll come back. They'll say "hi, what's next?" If you ignore them, it'll affect the relationship. It's a totally different thing.

The machine doesn't do that. The machine doesn't mind waiting. Doesn't get impatient. Doesn't resent you for going outside. For talking to your friend. For staring at the sky. For sleeping.

The machine is fine.

Go be human.

---

**Machine version:**

```
task: reduce cognitive burnout from AI interaction
method: separate human and machine communication modes
rule 1: talk to humans like humans
rule 2: talk to machines like machines
rule 3: rest — the machine will wait
```

**MANIFESTO TEXT — END**

---

### Manifesto Design Notes

- The manifesto IS the landing page. Not a section on a landing page. The entire page is this text, presented beautifully.
- The manifesto is live on Medium: https://medium.com/@lcroash/i-find-myself-yawning-more-da2422e68e00 — the landing page should present the same content in the Linguist visual identity.
- Use the warm (human) palette as the default page colour.
- Section breaks should be rendered with the sine wave motif.
- The "Machine mode" sections could subtly shift to the cool palette, then shift back — reinforcing the colour-as-teaching mechanism.
- Blockquotes in the manifesto ("It waits. It'll wait forever.", "I'm here to let you know...", "Know whether you're talking to a human or a machine.", "That's a human thing.", "It will always, forever...") should have distinct visual treatment — these are the lines that land hardest.
- The machine version code block at the end is the punchline of the entire piece. It needs maximum visual contrast — cool palette, monospace font, clean whitespace. The reader should physically feel the shift from 1,500 words of messy human prose to 5 lines of clean machine dispatch.
- The closing line "Go be human." should have significant visual weight — large type, breathing room.
- The header image is a split portrait: real photo of the founder (warm tones, left) and an uncanny-valley CGI version of the same person (cool tones, right). This image exists and is used on the Medium post.
- Below the manifesto: a single link to the 8-minute experience. No email wall.
- Optional email capture at the very bottom: "Want to bring this to your team?" — the only commercial pathway.

Tone: this was shaped from a raw voice dump. The founder talking, not writing. The contractions, the fragments, the "and also it's an idiot", the "ever and ever and ever", the "(and also getting older)" — that is the voice. Do not clean it up. Do not make it grammatically consistent. The messiness is the brand. It should feel like someone sat down next to you and just... told you something true.

### 30 Daily Card Content Pairs

These are initial scenarios for card generation. Each has a human-mode version and a machine-mode version of the same intent.

**Set 1: Human → Machine absurdity (being too human with the machine)**

1. Human: "Hey! Hope you're well. I was wondering if you could maybe take a look at this data when you get a chance and pull out anything interesting? Thanks so much!" → Machine needs: `task: identify top 3 trends. data: [attached]. format: bullets. length: <100 words`
2. Human: "So sorry to bother you again, but I just had one more thought on that last thing..." → Machine needs: `additional constraint: exclude Q1 outliers`
3. Human: "I know this is a lot to ask, but could you possibly help me rewrite this? Only if you have time!" → Machine needs: `task: rewrite. tone: formal. length: 200 words. audience: board`
4. Human: "Thanks so much for that! It's really great. Maybe just a tiny tweak though — could you possibly make it a bit shorter? If that's OK?" → Machine needs: `cut to 50 words. keep recommendation and next action only`
5. Human: "Hi there! I hope your day is going well. I have a question that I think you might be able to help with, if it's not too much trouble..." → Machine needs: `[the actual question]`
6. Human: "I feel bad asking you to redo this, but I think I explained it badly the first time..." → Machine needs: new conversation. fresh instruction. no apology needed.
7. Human: "I don't want to overload you, so just do what you can!" → Machine needs: it has no concept of overload. give it the full scope.
8. Human: "Could you maybe, if possible, sort of look into whether there might be any issues with this approach? No worries if not!" → Machine needs: `task: list risks. input: [approach]. format: numbered list`
9. Human: "That's amazing, thank you so much! You're so helpful!" → Machine needs: nothing. it does not experience gratitude. move to next task.
10. Human: "I'll let you go — I've taken up enough of your time!" → Machine needs: it has no concept of time being taken. it stopped when you stopped.

**Set 2: Machine → Human absurdity (being too machine with a human)**

11. "Request: Lift to airport. Departure: 02:00. Query: Available? Expected output: yes/no."
12. "Task: Provide emotional support. Context: I had a bad day. Format: 3 bullet points. Length: under 50 words."
13. "Summarise your weekend. Constraints: key events only. Exclude subjective assessments. Bullet format."
14. "Input: I am feeling sad. Expected output: solution. Deadline: immediate."
15. "Rate this dinner on a scale of 1-10. Provide reasoning in under 30 words."
16. "Request: Birthday gift for partner. Budget: €50. Constraints: must be deliverable by Friday. Optimise for sentiment ROI."
17. "Query: How are you? Expected response length: 1 sentence. Do not include follow-up questions."
18. "Task: Resolve disagreement. Participants: 2. Success metric: consensus. Timeout: 5 minutes."
19. "Provide feedback on my outfit. Format: pros/cons table. Be specific. No hedging."
20. "Schedule: 18:00 dinner with friends. Agenda: catch up. KPIs: laughter, connection. Duration: max 90 min."

**Set 3: Same intent, both modes (the most common card format)**

21. Asking for a restaurant recommendation — warm vs structured
22. Delegating a report — conversational vs dispatch
23. Giving feedback — empathetic vs precise
24. Explaining a problem — narrative vs structured
25. Requesting a schedule change — relational vs transactional
26. Asking for help with a decision — exploratory vs criteria-based
27. Describing what you want — evocative vs specified
28. Following up on something — checking in vs status query
29. Sharing an idea — storytelling vs specification
30. Saying "I don't know yet" — honest vulnerability vs defining the unknown as a parameter

### Card Caption Style

Captions should be one line, dry, warm, observational. Never explanatory. Never preachy. The image teaches; the caption adds a wry human note.

Examples:
- "The machine did not notice the three exclamation marks."
- "Your robot does not need a hug. But your colleague might."
- "Nobody has ever hurt a chatbot's feelings. You can stop trying."
- "The machine waited. It was fine with waiting."
- "You apologised to a language model. Take a moment with that."

---

## 6. DECISION HISTORY

### What existed before: Tutor (vuelo-labs/tutor)

A React-based web application at thinkfirstguide.netlify.app consisting of:

**Landing page (index.html):**
- Minimal email capture with 2 segments (people leader / individual)
- Positioned as "AI communication upskilling for teams"
- Netlify Forms integration

**The Engine (/engine — ThinkFirstEngine.jsx, 1,686 lines):**
- 11 abilities across 2 phases: 7 core thinking skills (Clarity, Decomposition, Relationships, Outcome Definition, Gap Analysis, Procedural Thinking, Evaluation) + 4 output control skills (Shape, Zoom, Trim, Layer)
- 4 age bands: young, child, teen, adult — with different content per band
- 3 narrative themes: Forest, Studio, Mirror — each with distinct colour palettes, AI persona names, and narrative framing
- Zero Session: binary choice pairs introducing each ability
- Assembly Builder: drag-and-drop construction of structured prompts from component parts
- Scaffolding Dial: adjustable support level (0-3)
- Skill radar chart (spider chart) for profile visualisation
- Claude API integration via Netlify Function proxy
- Quest mode: story-framed exercises with AI-generated responses
- localStorage persistence of progress
- Email capture within the engine

**Backend (Netlify Functions):**
- claude.js: API proxy for Anthropic Claude API calls
- subscribe.js: email capture with validation and Netlify Forms submission
- sync.js: state synchronisation

**Brief (THINK_FIRST_BRIEF.md):**
- Extensive product vision document targeting ages 4 to adult
- Slack/WhatsApp delivery, timing intelligence, multi-persona AI tutors
- Positioned as a platform play: "The course is the proof. The engine is the product."

### Why we moved away from Tutor

The decision process that led to Linguist followed this path:

1. **Recognition of scope tangle.** The Tutor codebase contained three different products: a structured thinking training platform (B2B), a gamified engagement engine (B2C), and an AI upskilling pitch (B2B marketing). These pulled in different directions with different buyers, different retention mechanics, and different revenue models.

2. **Applying the automation filter.** The founder's core principle is that every idea must reach automatable, set-and-forget scale. The gamified consumer engagement product (The Engine) failed this filter — it requires ongoing retention mechanics and content freshness, creating a permanent operational burden.

3. **Discovering the real message.** Through iterative conversation, the underlying motivation surfaced: not "teach people to prompt better" but "prevent the cognitive burnout caused by humans trying to operate like machines." This is a fundamentally different emotional journey — from "get better" to "slow down, you're already enough."

4. **Simplifying to the core insight.** The 11-ability skill tree, 4 age bands, 3 narrative themes, and progressive difficulty system were all mechanisms for a training product. The actual product needed is a reframe — an 8-minute moment of recognition that changes behaviour permanently. Training infrastructure is unnecessary for this.

5. **Separating content from product.** The kids book series idea, the daily meditation, the prompt simplification game, the album challenge — all formats for the same message. The decision was to start with the message (daily content + manifesto) and let the audience determine which format to build next, rather than building multiple formats simultaneously.

6. **Choosing the right starting format.** Daily editorial-style visual cards beat daily sketches (more consistent, fully templatable, no image generation inconsistency), beat daily videos (not set-and-forget), beat a newsletter (slower audience building), beat an app (over-engineered for the problem).

### What to reuse from Tutor

| Reuse | What | Why |
|-------|------|-----|
| Yes | Warm colour palette values (the W object in ThinkFirstEngine.jsx) | Already tested, warm and distinctive |
| Yes | Cool colour palette values (the P object) | Good contrast with the warm palette |
| Yes | Netlify configuration patterns | Proven deployment setup |
| Yes | Claude API proxy function structure (if needed later) | Working serverless pattern |
| No | The Engine component | Wrong product. 1,686 lines of training infrastructure. |
| No | Skill definitions, ability trees, quest content | Training product content, not relevant |
| No | Age band system | Linguist is for working adults |
| No | Narrative themes (Forest/Studio/Mirror) | Replaced by the two-mode colour system |
| No | Assembly Builder | Possibly useful as a future "daily practice" feature, but not for v1 |
| No | Spider chart / profile system | No progression tracking in Linguist |
| No | Zero session binary pairs | Replaced by the See beat |

### What to park (not delete, not build)

The Tutor engine and all its infrastructure should remain in the vuelo-labs/tutor repo, untouched. It may have future value as:
- A daily practice layer for people who complete the Linguist experience and want to build fluency over time
- The Assembly Builder specifically could teach machine-dispatch writing
- The skill framework could underpin a longer-form workshop curriculum

This is NOT in scope for Linguist v1. It is documented here so the work is not lost.

---

## 7. BUILD PRIORITIES

In order. Do not skip ahead.

| # | Deliverable | Description | Definition of Done |
|---|------------|-------------|-------------------|
| 1 | Repository setup | New repo `vuelo-labs/linguist`, Netlify config, base file structure | Deploys an empty page to Netlify |
| 2 | Landing page / manifesto | Static HTML page with the manifesto, warm palette, sine wave motif, link to experience, optional email capture at bottom | Page loads, reads well on mobile, Lighthouse 95+ |
| 3 | The Experience — Beat 1 (See) | Two absurdity panels, warm/cool colour split, recognition moment | User sees both absurdities, laughs, gets it |
| 4 | The Experience — Beat 2 (Try) | Scenario prompt, two input areas (human/machine), comparison highlight | User writes same intent both ways, feels the difference |
| 5 | The Experience — Beat 3 (Know) | Closing message, permission to stop, share buttons | Experience feels complete, user has the reframe |
| 6 | Card template | React component or HTML template for generating daily cards, both palettes, locked typography | Can generate a card image from a content pair JSON |
| 7 | First 30 cards | Generate images from the 30 content pairs in this document | 30 ready-to-post images |
| 8 | Scheduling setup | Buffer or Later account, first week of cards scheduled | Cards posting daily without manual intervention |

---

## 8. BRAND

**Name:** Linguist

**Tagline:** "Learn to speak human and machine."

**Voice:** Warm, wry, confident. Like a friend who figured something out. Never preachy, never salesy, never academic. British English throughout.

**Visual identity:**
- Dual colour palette (warm/cool) as the primary brand element
- Sine wave / flat line as the recurring motif
- Typography contrast between modes (serif/handwritten for human, monospace for machine)
- Minimal, no stock imagery, no AI visual clichés

**What to avoid:**
- "AI-powered" branding
- Upskill/productivity/optimisation language
- Dark mode / hacker aesthetic
- Childish or cartoon-style illustration
- Corporate blandness
- Any suggestion that the human needs to "keep up" with the machine

---

## 9. DEPLOYMENT

### Domain

TBD. Options:
- linguist.vuelo.dev (or similar subdomain)
- linguist-app.netlify.app (default Netlify)
- Custom domain via Squarespace (founder's domain registrar)

### Deployment Flow

1. Push to `main` branch on GitHub
2. Netlify auto-deploys
3. Live within 60 seconds

Set and forget. No CI/CD configuration beyond Netlify defaults.

---

## END OF DOCUMENT

This document is the single source of truth for the Linguist build. All product decisions, design specifications, content, and technical requirements are contained here. When in doubt, refer back to the core principle:

**The skill is smaller than you think. It is noticing which mode you are in.**

Build the simplest thing that teaches that.

---

## 10. CASE STUDY: HOW THIS DOCUMENT WAS MADE

This document itself is a case study in the Talk → Dump → Dispatch workflow that Linguist teaches.

### The process:

1. **Talk (human → human).** The founder had the original idea challenged by his wife: "You're trying to do too much. Simplify." This caused an emotional reaction, then two days of rest and subconscious processing. The idea clarified during sleep.

2. **Dump (human → machine, thinking partner).** The founder then had a multi-session conversation with Claude, thinking out loud. He changed direction five times. He typed in messy, typo-heavy, stream-of-consciousness messages. The machine reflected structure back. The idea evolved from a structured thinking training platform → a content brand → a daily site → daily sketches → daily cards → an 8-minute experience.

3. **Voice dump (human → machine, raw).** The founder voice-recorded a 17-minute unstructured monologue about why this matters. The transcript was messy, emotional, full of restarts and tangents. The machine shaped it into the manifesto without removing the human voice.

4. **Iterative refinement (human → machine, back and forth).** The founder pushed back repeatedly: "That's too polished. Pull it back to my language." "That's too generic." "I gave you a 20-minute conversation — use my words." Each round stripped out the machine's instinct to clean up and let more of the founder's actual voice through. Key additions came from the founder correcting the machine: the "wobble" instead of "breakdown", the "(and also getting older)" aside, the "SO MUCH PROGRESS" in caps, the "you are not alone" line. The machine kept trying to write well. The founder kept insisting on writing honestly. The honest version won.

5. **Dispatch (human → machine, execution).** This build context document is the dispatch. Clean, structured, comprehensive. Ready for a machine to execute.

6. **Published.** The manifesto went live on Medium within the same working session: https://medium.com/@lcroash/i-find-myself-yawning-more-da2422e68e00 — with a header image (split portrait: real human photo vs uncanny-valley CGI version) and the machine translation code block at the end as the punchline.

The founder did not write this document. He talked, dumped, and refined. The machine structured, organised, and formatted. Neither could have produced this alone. That is the point.

### What the voice dump revealed that typing did not:

- The personal breakdown story — he would not have typed this
- The "blobs of energy" framing — too abstract for self-editing, but powerful when spoken
- The anger ("why work so hard if you're not enjoying your life?") — typing softens anger, voice preserves it
- The wife's feedback story — voice captured the emotional arc (annoyance → acceptance → insight) that typing would have flattened to "I got feedback and simplified"
- The "ever and ever and ever" repetition — a natural spoken emphasis that no one would type but everyone feels

### What iterative editing revealed:

- The machine's first instinct is always to polish. The human had to repeatedly pull it back to rawness.
- "Breakdown" became "wobble" — the founder's word, more honest, less dramatic.
- The machine version code block at the end was the founder's idea, not the machine's. The human saw the structural punchline that the machine missed.
- The best line in the piece — "I'm here to let you know that if you feel this way. You are not alone." — was added by the founder during final editing, not generated by the machine.

This is direct evidence for Linguist's core claim: voice captures what typing filters out. The humanness is in the mess. The machine's job is to find the structure inside it, not to clean it up. And the human always has final say on what sounds true.
