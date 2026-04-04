// =============================================
// LINGUIST — Daily Card Content
// 30 content pairs, ready to post.
// Each card: { id, human, machine, caption, type }
// Types: human_to_machine | machine_to_human | same_intent
// =============================================

const CARDS = [

  // ---- Set 1: Human → Machine absurdity ----
  // Being too human with the machine

  {
    id: 1,
    type: 'human_to_machine',
    human: "Hey! Hope you're well. I was wondering if you could maybe take a look at this data when you get a chance and pull out anything interesting? Thanks so much!",
    machine: "task: identify top 3 trends\ndata: [attached]\nformat: bullets\nlength: <100 words",
    caption: "The machine did not notice the three exclamation marks."
  },
  {
    id: 2,
    type: 'human_to_machine',
    human: "So sorry to bother you again, but I just had one more thought on that last thing…",
    machine: "additional constraint:\nexclude Q1 outliers",
    caption: "You apologised to a language model. Take a moment with that."
  },
  {
    id: 3,
    type: 'human_to_machine',
    human: "I know this is a lot to ask, but could you possibly help me rewrite this? Only if you have time!",
    machine: "task: rewrite\ntone: formal\nlength: 200 words\naudience: board",
    caption: "It has all the time. It has nothing but time."
  },
  {
    id: 4,
    type: 'human_to_machine',
    human: "Thanks so much for that! It's really great. Maybe just a tiny tweak though — could you possibly make it a bit shorter? If that's OK?",
    machine: "cut to 50 words\nkeep: recommendation + next action only",
    caption: "Your robot does not need a hug. But your colleague might."
  },
  {
    id: 5,
    type: 'human_to_machine',
    human: "Hi there! I hope your day is going well. I have a question that I think you might be able to help with, if it's not too much trouble…",
    machine: "[the actual question]",
    caption: "Skip to line two. It was always line two."
  },
  {
    id: 6,
    type: 'human_to_machine',
    human: "I feel bad asking you to redo this, but I think I explained it badly the first time…",
    machine: "new conversation\nfresh instruction\nno apology needed",
    caption: "Nobody has ever hurt a chatbot's feelings. You can stop trying."
  },
  {
    id: 7,
    type: 'human_to_machine',
    human: "I don't want to overload you, so just do what you can!",
    machine: "it has no concept of overload\ngive it the full scope",
    caption: "The machine is fine. It is always fine."
  },
  {
    id: 8,
    type: 'human_to_machine',
    human: "Could you maybe, if possible, sort of look into whether there might be any issues with this approach? No worries if not!",
    machine: "task: list risks\ninput: [approach]\nformat: numbered list",
    caption: "Hedging at something that cannot feel reassured."
  },
  {
    id: 9,
    type: 'human_to_machine',
    human: "That's amazing, thank you so much! You're so helpful!",
    machine: "// gratitude noted\n// moving to next task",
    caption: "The machine did not beam. You can stop performing."
  },
  {
    id: 10,
    type: 'human_to_machine',
    human: "I'll let you go — I've taken up enough of your time!",
    machine: "it has no concept of time being taken\nit stopped when you stopped",
    caption: "The machine waited. It was fine with waiting."
  },

  // ---- Set 2: Machine → Human absurdity ----
  // Being too machine with a human

  {
    id: 11,
    type: 'machine_to_human',
    human: "Hey, any chance you could give me a lift to the airport? It's at 2am so absolutely no pressure, just thought I'd ask!",
    machine: "Request: lift to airport\nDeparture: 02:00\nQuery: available?\nExpected output: yes/no",
    caption: "Your friend is not a REST API."
  },
  {
    id: 12,
    type: 'machine_to_human',
    human: "I've had a bit of a rubbish day, could do with a chat…",
    machine: "Task: provide emotional support\nContext: bad day\nFormat: 3 bullet points\nLength: <50 words",
    caption: "Bullet points are the wrong format for a bad day."
  },
  {
    id: 13,
    type: 'machine_to_human',
    human: "How was your weekend? Do anything fun?",
    machine: "Summarise your weekend\nConstraints: key events only\nExclude: subjective assessments\nFormat: bullets",
    caption: "Ask the question. Let it go wherever it goes."
  },
  {
    id: 14,
    type: 'machine_to_human',
    human: "You seem a bit quiet today — everything alright?",
    machine: "Input: I am feeling sad\nExpected output: solution\nDeadline: immediate",
    caption: "Some problems aren't structured. That's what makes them human."
  },
  {
    id: 15,
    type: 'machine_to_human',
    human: "That was a lovely dinner — thank you for cooking!",
    machine: "Rate this dinner: 1–10\nProvide reasoning: <30 words\nBe specific. No hedging.",
    caption: "The warmth was the point. Not the score."
  },
  {
    id: 16,
    type: 'machine_to_human',
    human: "I have no idea what to get her for her birthday…",
    machine: "Request: birthday gift\nBudget: €50\nConstraints: deliverable by Friday\nOptimise for: sentiment ROI",
    caption: "Sentiment ROI is not a thing. Love the attempt though."
  },
  {
    id: 17,
    type: 'machine_to_human',
    human: "Hi! How are you doing?",
    machine: "Query: how are you?\nExpected response length: 1 sentence\nDo not include follow-up questions",
    caption: "Let them answer in their own way. That's the whole thing."
  },
  {
    id: 18,
    type: 'machine_to_human',
    human: "I think we just see this differently — can we talk it through?",
    machine: "Task: resolve disagreement\nParticipants: 2\nSuccess metric: consensus\nTimeout: 5 minutes",
    caption: "Disagreements don't have timeouts. That's why they matter."
  },
  {
    id: 19,
    type: 'machine_to_human',
    human: "What do you think of this outfit?",
    machine: "Provide feedback on outfit\nFormat: pros/cons table\nBe specific. No hedging.",
    caption: "They wanted a reaction, not a rubric."
  },
  {
    id: 20,
    type: 'machine_to_human',
    human: "Come for dinner Saturday, it'll be good to catch up properly.",
    machine: "Schedule: 18:00 dinner\nAgenda: catch up\nKPIs: laughter, connection\nDuration: max 90 min",
    caption: "Good dinners don't have KPIs. That's what makes them good."
  },

  // ---- Set 3: Same intent, both modes ----
  // The most useful teaching format

  {
    id: 21,
    type: 'same_intent',
    human: "Any good restaurant recommendations? Somewhere a bit special for a client dinner?",
    machine: "task: restaurant recommendation\ncontext: client dinner\nconstraints: special occasion\nlocation: [city]\nformat: top 3 with one-line reason each",
    caption: "Same question. Completely different receiver."
  },
  {
    id: 22,
    type: 'same_intent',
    human: "Could you pull together a report on how we're tracking against target? Doesn't need to be too formal.",
    machine: "task: performance report\nmetrics: actual vs target\nperiod: [current quarter]\nformat: table + 3-bullet summary\ntone: internal",
    caption: "One version builds the relationship. The other builds the report."
  },
  {
    id: 23,
    type: 'same_intent',
    human: "I wanted to share some thoughts on the proposal — I think there's something really interesting here but maybe a few things to tighten up?",
    machine: "task: feedback on proposal\nfocus: strengths + gaps\nformat: bullets\nlength: <150 words",
    caption: "Feedback lands differently depending on who's receiving it."
  },
  {
    id: 24,
    type: 'same_intent',
    human: "So the thing is, the project's been running behind and I'm not totally sure why — could be resource, could be scope, maybe both?",
    machine: "task: diagnose project delay\npotential causes: resource, scope, both\noutput: root cause analysis\nformat: structured list",
    caption: "The human version is thinking out loud. Let it."
  },
  {
    id: 25,
    type: 'same_intent',
    human: "Would it be possible to move our Thursday call? Something's come up and I'm worried I won't be focused.",
    machine: "task: reschedule meeting\ncurrent: Thursday\nnew window: [provide options]\nreason: scheduling conflict",
    caption: "The machine doesn't need to know you won't be focused."
  },
  {
    id: 26,
    type: 'same_intent',
    human: "I've been going back and forth on this decision and honestly I could do with a sounding board…",
    machine: "task: decision support\noptions: [list]\ncriteria: [list]\noutput: recommendation with reasoning",
    caption: "The human version wants to think together. The machine version wants an answer."
  },
  {
    id: 27,
    type: 'same_intent',
    human: "I want it to feel warm but professional — like a letter from someone who really cares but also knows what they're talking about.",
    machine: "tone: warm + authoritative\naudience: professional\nstyle: direct, human, no jargon\nformat: letter",
    caption: "Evocative to a person. Specified to a machine."
  },
  {
    id: 28,
    type: 'same_intent',
    human: "Just checking in — did you manage to get a chance to look at the thing I sent over?",
    machine: "status query: [task name]\ndeadline: [date]\nexpected output: progress update",
    caption: "One version preserves the relationship. The other gets the update."
  },
  {
    id: 29,
    type: 'same_intent',
    human: "OK so here's the idea — it's a bit rough but I think there might be something in it…",
    machine: "task: evaluate idea\ninput: [concept]\noutput: feasibility + top 3 risks + next step\nformat: structured",
    caption: "Story to a person. Specification to a machine."
  },
  {
    id: 30,
    type: 'same_intent',
    human: "Honestly I'm not totally sure yet — I know what I want the outcome to feel like but not exactly how to get there.",
    machine: "task: define approach\ngoal: [desired outcome]\nconstraints: [known]\nunknowns: list assumptions to validate",
    caption: "Not knowing is human. Structuring the unknown is machine."
  },


  // ---- Set 4: Practical tips ----
  // Real-world patterns for people new to working with AI

  {
    id: 31,
    type: 'practical_tip',
    human: "Okay I need to ask it something but I'm not quite sure how to put it… let me just wing it and see what happens.",
    machine: "I need help with [task] but I'm not sure exactly what I want yet. Ask me one question at a time and help me figure it out.",
    caption: "Use the machine to write the brief. Then use that brief with the machine. This is the Collab step — and it's the most underused one."
  },
  {
    id: 32,
    type: 'practical_tip',
    human: "I've been in the same chat for hours. It knows my whole project. Why does it keep getting confused and going in circles?",
    machine: "new task → new conversation\npaste your brief, not your history\nclean context = cleaner output",
    caption: "Context creep is real. Old threads carry old assumptions. When it starts going sideways, don't fight it — start fresh."
  },
  {
    id: 33,
    type: 'practical_tip',
    human: "Give me feedback on this.",
    machine: "You're a senior editor who's reviewed hundreds of pieces like this. Give me honest feedback — what's working, what isn't, and what the one thing is I should fix first.",
    caption: "\"You are a...\" is the single highest-leverage thing you can add. It calibrates tone, assumptions, and quality all at once. Five seconds. Big difference."
  },
  {
    id: 34,
    type: 'practical_tip',
    human: "Make it better.",
    machine: "This is done when it's under 200 words, has one clear call to action, and uses no jargon. Tell me when you think it's there.",
    caption: "\"Make it better\" has no end state. \"Done means X\" does. Define it before you start — the machine will keep going until you give it a finish line."
  },
  {
    id: 35,
    type: 'practical_tip',
    human: "Can you write the email, summarise the doc, create an action list, suggest a subject line, and check if the tone is right?",
    machine: "Step 1: summarise the doc in 5 bullets.\n\n[wait for result]\n\nStep 2: write the email from those bullets.",
    caption: "Every extra task in a prompt dilutes every other task. One thing at a time produces better results across the board — and it's actually faster."
  },
  {
    id: 36,
    type: 'practical_tip',
    human: "So a bit of context about me — I'm a [role], I work in [industry], I usually write in a [tone] style, my audience tends to be…",
    machine: "# My context doc\nRole: [x] · Industry: [x]\nTone: [x] · Audience: [x]\nAlways: [x] · Never: [x]\n\n← paste this at the top of every new chat",
    caption: "Stop re-introducing yourself to every conversation. Write a one-page context document once. Paste it in. Every time. The quality improvement is immediate."
  },
  {
    id: 37,
    type: 'practical_tip',
    human: "That's great! But could you make it a bit better? More engaging? Actually more formal. Try something different. Go back to the first version but change the ending…",
    machine: "version 1: done ✓\niterations: 1–2 max\nrule: first good version > over-iterated version\nwhen in doubt: stop",
    caption: "Quality degrades with over-iteration. Every round takes you further from your original intent. The first good output is usually the best. Recognise it and stop."
  },
  {
    id: 38,
    type: 'practical_tip',
    human: "I know what I want but I can't quite put it into words…",
    machine: "I have a rough idea but I'm struggling to articulate it. Ask me questions — one at a time — and help me figure out what I'm actually trying to say.",
    caption: "You don't need a perfect brief to start. Let the machine extract one from you. That's exactly what it's good at."
  },
  {
    id: 39,
    type: 'practical_tip',
    human: "[copies AI output directly into email without reading]\n\n→ \"Wait, that's not what I meant at all...\"",
    machine: "output status: draft\nnext step: read it, adapt it, own it\nrule: if you wouldn't sign your name to it, don't send it",
    caption: "Read the output. Make it yours. AI gives you a starting point — not a finished product. The moment you stop reading what you send, the quality stops being yours."
  },
  {
    id: 40,
    type: 'practical_tip',
    human: "…and I was thinking something like what we did before, maybe a bit different, you know, more of the other thing, whatever you think is best really…",
    machine: "Objective: what you want\nContext: what it needs to know\nRole: who it should be\nConstraints: format, length, audience, done criteria",
    caption: "Four parts. Not all required every time — but knowing them is enough. Objective, context, role, constraints. Build the habit and the quality follows."
  }

];
