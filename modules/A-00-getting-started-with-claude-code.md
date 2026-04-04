# A-00: Getting Started with Claude Code

## Learning Objective

After this, Claude Code is installed, you have completed one session, and you understand how it differs from the AI tools you have used so far.

---

## What You Are Leaving Behind and What You Are Keeping

Until now, you have been using a web or desktop tool -- Claude.ai, ChatGPT, Gemini, or something similar. You type a message, the AI responds, you read the response. The conversation happens inside a browser window.

Claude Code is different. It runs in your terminal. You type, Claude Code reads your files, writes files, runs commands, and reports back. The conversation is the same kind of exchange. The environment is not.

**What carries forward:** every principle from the Enabled User stage. Opening seeds, verb choice, constraints, context loading, re-seeding -- all of it. The principles do not change. The tool does.

**What is new:** Claude Code can see your file system, with your permission. It can write files, run commands, and use specialised tools. This means results are not just words in a chat window -- they are actual changes to actual files on your computer.

---

## What Claude Code Is

Imagine your AI tool could open files on your computer, read them, make changes to them, and save them -- while you watch and approve each step. That is Claude Code.

It runs in your terminal -- the text-based interface where you type commands instead of clicking buttons. It asks permission before taking any action. You can approve or reject each action. You are always in control. Nothing happens to your files without your say-so.

---

## Installation

You need three things: Node.js, the Claude Code package, and an Anthropic API key.

### Step 1: Check for Node.js

Open your terminal and type:

    node --version

If you see a version number (something like v18.17.0 or higher), you have Node.js. Move to Step 2.

If you see "command not found" or an error, you need to install Node.js. Go to nodejs.org, download the LTS version, and follow the installer. Once finished, close and reopen your terminal, then try `node --version` again.

### Step 2: Install Claude Code

In your terminal, type:

    npm install -g @anthropic-ai/claude-code

Wait for the installation to finish. It may take a minute.

### Step 3: Authenticate

Type:

    claude

The first time you run this, it will ask you to log in or provide an API key. If you need an API key, go to console.anthropic.com, create an account, and generate one. Paste it when prompted.

### Step 4: Verify

Type:

    claude --version

You should see a version number. Claude Code is installed.

### If you see an error at any step

- **"permission denied" or "EACCES"** -- try `sudo npm install -g @anthropic-ai/claude-code` and enter your computer password when prompted. On some systems, you may need to fix your npm prefix instead -- search "npm global install permission error" for your operating system.
- **"npm: command not found"** -- Node.js did not install correctly. Reinstall from nodejs.org and make sure to restart your terminal afterwards.
- **"claude: command not found" after installing** -- close your terminal completely and open a new one. The command sometimes does not register until you do this.

---

## Your First Session

Open your terminal. Navigate to a folder that has a file you would like to work with -- a text file, a document, a piece of code. Any folder with at least one file in it will do.

Start Claude Code by typing:

    claude

You will see a prompt where you can type a message, just like in a chat tool. The difference is that Claude Code can see the files in your current folder.

Try this: ask Claude Code to summarise a file. Type a message like:

    Summarise README.md in 5 bullet points.

Replace README.md with the name of a real file in your folder.

Here is what will happen:

1. Claude Code will ask to read the file. You will see a description of the action it wants to take.
2. Type **y** and press Enter to approve. The file is read.
3. Claude Code responds with a summary.

That is one complete interaction. You sent a message, approved a tool call, and received a response.

To end your session, type **exit** or press **Ctrl+C**.

### Copy-Personalise-Use

Here is a starter message for your first Claude Code session:

    I'm a [role]. Summarise [filename] in [format]. Focus on [angle]. Keep it under [length]. Don't include [what to leave out].

**How to edit this:**

- `[role]` -- what you do. Same as every opening seed you have written.
- `[filename]` -- the name of a file in your current folder. This is the only new part. Claude Code can read it directly if you name it.
- `[format]` -- bullet points, a paragraph, a table. Your choice.
- `[angle]` -- what matters to you about this file. "Key decisions," "action items," "technical details."
- `[length]` -- a word count or item count. "5 bullet points," "under 100 words."
- `[what to leave out]` -- anything you do not need. "Background context," "introductory material," "formatting details."

This is the same opening seed from the Enabled User stage. The only change is `[filename]` -- Claude Code can see your files if you name them.

---

## The Permission Model

Claude Code will always ask before reading a file, writing a file, or running a command. You approve or reject each action. This is your control layer.

Never approve an action you do not understand. If you are not sure what an action will do, type **n** to reject it and ask Claude Code to explain what it was going to do and why.

---

## Cost Preview

Claude Code uses the Anthropic API. Every message, every tool call, every file read costs tokens. Tokens cost money. The next module -- A-01 -- covers this in full. Before you go further, know this: Claude Code is not free. You are billed for usage through your Anthropic account. Set a budget for yourself before your next session.

---

## Next

You have Claude Code installed and working. You have completed one session. You know how to approve and reject tool calls.

The next step is understanding what things cost, so you can use Claude Code with intention, not surprises. Continue to A-01: Cost, Tokens, and What Things Actually Cost.
