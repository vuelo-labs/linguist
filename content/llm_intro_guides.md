# Getting started with OpenAI, Google Gemini, and xAI Grok

**All three major LLM platforms — OpenAI, Google Gemini, and xAI Grok — offer free access tiers, chat interfaces for non-technical users, and developer APIs with OpenAI-compatible endpoints, but they differ sharply in pricing, model lineups, and unique capabilities.** OpenAI remains the most mature ecosystem with the broadest documentation. Google Gemini offers the most generous free API tier and the widest range of official SDKs. xAI Grok differentiates through real-time X/Twitter data access, massive 2M-token context windows, and an irreverent personality. This guide covers everything a beginner, prompt writer, or developer needs to start using each platform today.

---

## OpenAI: the most established LLM platform

### What OpenAI offers

OpenAI provides AI models through two main products: **ChatGPT** (the consumer chat interface) and the **OpenAI API** (the developer platform). As of April 2026, the current flagship models are **GPT-5.4** (1M-token context, configurable reasoning, best for agentic and coding workflows), **GPT-5.2** (400K context, available on the free tier), and **GPT-5** (400K context, previous flagship). The legacy models referenced in many tutorials — GPT-4o, o3, o4-mini, and GPT-4.1 — remain available through the API but have been retired from the ChatGPT interface.

The platform excels at text generation, code generation, multimodal analysis (images, audio, documents), structured data extraction, and building AI agents. OpenAI's documentation at **platform.openai.com/docs** is the most comprehensive of the three providers.

### Access, pricing, and sign-up

ChatGPT offers six tiers. The **Free** plan ($0) provides limited GPT-5.2 access within 5-hour rolling windows. **ChatGPT Go** ($8/month) adds expanded access to GPT-5.3 Instant with more uploads and tools. **ChatGPT Plus** ($20/month) unlocks higher limits, priority access, advanced reasoning, and no ads. **ChatGPT Pro** ($200/month) provides unlimited access including GPT-5 Pro mode. **Business** plans start at $25/user/month (or $20/user/month annual), and **Enterprise** requires contacting sales.

API pricing is pay-per-use with no subscription required. Key price points per million tokens:

| Model | Input | Output | Context window |
|-------|-------|--------|---------------|
| GPT-5.4 | $2.50 | $15.00 | 1M tokens |
| GPT-5.2 | $1.75 | $14.00 | 400K tokens |
| GPT-4o | $2.50 | $10.00 | 128K tokens |
| GPT-4o-mini | $0.15 | $0.60 | 128K tokens |
| o3 | $2.00 | $8.00 | 200K tokens |
| o4-mini | $1.10 | $4.40 | 200K tokens |
| GPT-4.1 | $2.00 | $8.00 | 1M+ tokens |

Sign up for ChatGPT at **chatgpt.com**, the API at **platform.openai.com**, and view all pricing at **openai.com/chatgpt/pricing** and **platform.openai.com/docs/pricing**.

### Every way to access OpenAI models

OpenAI offers more interfaces than any competitor. The **ChatGPT web app** (chatgpt.com) is the primary consumer interface. Native **iOS, Android, macOS, and Windows desktop apps** are all available — the desktop apps feature a companion window (Option+Space on Mac, Alt+Space on Windows) and IDE integration. The **OpenAI Playground** (platform.openai.com/playground) provides an interactive testing sandbox. The **OpenAI API** supports REST calls, streaming, and a realtime API. Third-party integrations include **Apps in ChatGPT** (Canva, Figma, Spotify, Booking.com), **Codex** (agentic coding), and **Azure OpenAI Service** for enterprise deployments. Official SDKs exist for Python (`pip install openai`), Node.js/TypeScript (`npm install openai`), and C#/.NET.

### Getting started with the ChatGPT chat interface

For non-technical users, getting started takes under two minutes:

1. Go to **chatgpt.com** and click "Sign up"
2. Create an account using Google, Apple, Microsoft SSO, or email/password
3. Verify your email if using email sign-up
4. The chat interface loads immediately — free users get GPT-5.2
5. On paid plans, use the **model selector dropdown** at the top to choose between models
6. Type your question in the message box and press Enter
7. Explore additional features: upload files (images, PDFs, spreadsheets), use voice mode, generate images, browse the web, or try custom GPTs from the GPT Store

Free-tier users face message limits within rolling 5-hour windows. When limits are reached, a prompt to upgrade appears.

### Getting started with the OpenAI API

Developers follow four steps to make their first API call:

1. Create an account at **platform.openai.com** and add a payment method
2. Generate an API key at **platform.openai.com/api-keys** — store it securely
3. Set your environment variable: `export OPENAI_API_KEY="your-key-here"`
4. Make a request using the **Responses API** (the recommended endpoint for all new projects):

```python
from openai import OpenAI
client = OpenAI()
response = client.responses.create(
    model="gpt-4o",
    input="Write a one-sentence bedtime story about a unicorn."
)
print(response.output_text)
```

The older Chat Completions API (`/v1/chat/completions`) remains supported. Key documentation lives at **platform.openai.com/docs/quickstart** and **platform.openai.com/docs/api-reference/introduction**.

### OpenAI's official prompting guidance

OpenAI publishes a detailed prompt engineering guide at **platform.openai.com/docs/guides/prompt-engineering**. The core principles: include relevant context the model doesn't have from training, provide clear and explicit instructions, supply example outputs for few-shot learning, use message roles (system messages for behavioral guidance, user messages for task-specific details), and build evaluation metrics to measure prompt performance. For reasoning models (o-series, GPT-5.x with reasoning enabled), OpenAI recommends giving **high-level outcome guidance** rather than step-by-step instructions. The platform also supports **prompt management** in the dashboard — save, version, and share prompts with `{{variable}}` syntax.

### Learning resources and documentation

OpenAI's documentation ecosystem is the most mature. The **OpenAI Cookbook** (cookbook.openai.com, also on GitHub with 69,700+ stars) contains example code covering agents, multimodal tasks, fine-tuning, guardrails, and optimization. The **Developer Forum** (community.openai.com) and **Help Center** (help.openai.com) provide troubleshooting and community support. All guides live at platform.openai.com/docs/guides/ — covering text generation, vision, audio, structured output, function calling, agents, fine-tuning, embeddings, and more.

### Rate limits and gotchas beginners should know

API rate limits operate on a **tier system** that auto-graduates based on cumulative spend: Tier 1 ($5 paid, $100/month cap), Tier 2 ($50 paid + 7 days, $500/month cap), up through Tier 5 ($1,000 paid + 30 days, $200,000/month cap). Limits are measured across RPM, RPD, TPM, and TPD — hitting any single limit triggers HTTP 429 throttling. Limits are **per-organization and per-model**, with independent pools.

Critical gotchas for beginners: **ChatGPT subscriptions and API access are billed completely separately** — a Plus subscription does not include API credits. Models are **non-deterministic** (same prompt, different outputs). **Reasoning tokens** in o-series and GPT-5.x models are billed as output but invisible to the user, often doubling apparent costs. **Prompt caching** is automatic and can reduce costs by up to 75%. Knowledge cutoffs range from October 2023 (GPT-4o) to August 2025 (GPT-5.4), so models need web search tools for current information. Always verify critical facts — **hallucination remains a risk** across all models.

---

## Google Gemini: the most generous free tier

### What Google Gemini offers

Google Gemini is Google DeepMind's multimodal AI family, spanning consumer apps, developer tools, and enterprise solutions. The platform processes text, images, audio, video, and code. The newest models are the **Gemini 3 series** (in preview): **Gemini 3.1 Pro Preview** (described as "the best model in the world for multimodal understanding and agentic capabilities"), **Gemini 3 Flash Preview** (frontier-class performance at a fraction of the cost), and **Gemini 3.1 Flash-Lite Preview** (most cost-efficient for high-volume tasks). The stable **Gemini 2.5 series** includes **Gemini 2.5 Pro** (deep reasoning and coding) and **Gemini 2.5 Flash** (hybrid reasoning, best price-performance).

Gemini's standout capabilities include **1M-token context windows** across most models, native image/video generation, Google Search grounding for real-time information, and deep integration with Google Workspace (Gmail, Docs, Sheets).

### Access, pricing, and sign-up

Any free Google account unlocks the Gemini app at **gemini.google.com**. Consumer subscription plans restructured into three AI-focused tiers: **Google AI Plus** ($7.99/month) adds 200GB storage and enhanced access to Gemini 3.1 Pro. **Google AI Pro** ($19.99/month) adds 5TB storage, Gemini in Workspace apps, and Gemini Code Assist. **Google AI Ultra** ($249.99/month) includes 30TB storage, Deep Think reasoning, Gemini Agent, YouTube Premium, and $100/month in Google Cloud credits.

For developers, Gemini's **free API tier is the most generous** of all three providers — multiple models including Gemini 3 Flash, Gemini 2.5 Pro, and Gemini 2.5 Flash are available free of charge with rate limits. Key paid-tier API pricing per million tokens:

| Model | Input | Output | Context |
|-------|-------|--------|---------|
| Gemini 3.1 Pro Preview | $2.00–$4.00 | $12.00–$18.00 | 1M tokens |
| Gemini 3 Flash Preview | $0.50 | $3.00 | 1M tokens |
| Gemini 3.1 Flash-Lite | $0.25 | $1.50 | 1M tokens |
| Gemini 2.5 Pro | $1.25–$2.50 | $10.00–$15.00 | 1M tokens |
| Gemini 2.5 Flash | $0.30 | $2.50 | 1M tokens |
| Gemini 2.5 Flash-Lite | $0.10 | $0.40 | 1M tokens |

Pricing scales at a **200K-token boundary** — prompts exceeding 200K tokens cost more for Pro models. Get an API key at **aistudio.google.com/apikey**. View plans at **one.google.com/about/google-ai-plans**.

### Every way to access Gemini models

Gemini is accessible through the **Gemini web app** (gemini.google.com), **iOS and Android mobile apps**, **Google AI Studio** (aistudio.google.com — the developer IDE for prototyping and testing), the **Gemini API** via REST endpoints, **Vertex AI** for enterprise deployments, and integrations across **Google Workspace** (Gmail, Docs, Sheets, Slides, Meet). Specialized tools include **Gemini Code Assist** (VS Code and IntelliJ extensions), **Jules** (async coding agent), **NotebookLM** (AI-powered research assistant), **Gemini CLI** (terminal agent), and **Flow** (AI filmmaking suite). Official SDKs span five languages: Python (`google-genai`), JavaScript/TypeScript (`@google/genai`), Go, Java, and .NET.

### Getting started with the Gemini chat interface

Non-technical users can start in under a minute:

1. Go to **gemini.google.com** and sign in with any Google account
2. The chat interface presents model choices labeled **Fast** (Gemini 3 Flash), **Thinking** (reasoning-enabled), and **Pro** (Gemini 3.1 Pro, limited for free users)
3. Type a message and press Enter
4. Upload images, PDFs, or other files for analysis
5. Try **Deep Research** for multi-source research reports

Free users have daily usage limits. When limits are hit on Pro or Thinking models, conversations continue on the Fast model. Limits refresh regularly.

### Getting started with the Gemini API

The developer onboarding is streamlined through Google AI Studio:

1. Go to **aistudio.google.com/apikey** and click "Create API key" (free)
2. Set your environment variable: `export GEMINI_API_KEY="your-api-key-here"`
3. Install the SDK and make a request:

```python
from google import genai
client = genai.Client()
response = client.models.generate_content(
    model="gemini-3-flash-preview",
    contents="Explain how AI works in a few words"
)
print(response.text)
```

A powerful feature of AI Studio: click **"Get code"** on any prototype prompt to export it as working API code in Python, JavaScript, Go, or other languages. Full documentation lives at **ai.google.dev/gemini-api/docs/quickstart**.

Gemini also offers **OpenAI API compatibility** — developers can use the OpenAI SDK by pointing the base URL to Gemini's endpoint, documented at **ai.google.dev/gemini-api/docs/openai**.

### Google's official prompting guidance

Google's prompting strategies guide at **ai.google.dev/gemini-api/docs/prompting-strategies** covers core principles: be clear and specific, use system instructions to set persona and behavior, provide 2–5 few-shot examples, specify response format explicitly, and use partial completion to guide output structure. For **Gemini 3 specifically**, Google recommends keeping **temperature at the default 1.0** — setting it lower can cause looping or performance degradation. Use XML-style tags (`<context>`, `<task>`) or Markdown headings as structural delimiters. For complex reasoning, set `thinking_level: "high"`; for faster responses, use `"low"`. The **Prompt Gallery** at **ai.google.dev/gemini-api/prompts** provides ready-made examples across common use cases.

### Learning resources and documentation

Google's developer documentation at **ai.google.dev/gemini-api/docs** is extensive and well-organized, covering text generation, image/video generation and understanding, audio, document processing, structured outputs, function calling, context caching, code execution, Google Search grounding, computer use, and the Live API. The **Gemini API Cookbook** on GitHub (github.com/google-gemini/cookbook) provides hands-on examples. The **community forum** at discuss.ai.google.dev hosts developer discussions. Google also documents integrations with popular frameworks including **LangChain, LlamaIndex, CrewAI, and Vercel AI SDK**.

### Rate limits and gotchas beginners should know

Rate limits are **per-project** (not per API key) and measured across RPM, TPM, and RPD. Three paid tiers unlock automatically: Tier 1 (billing linked + $10 prepay), Tier 2 ($250 spend + 30 days), Tier 3 ($1,000 spend + 30 days). Exact limits are dynamic — check **aistudio.google.com/rate-limit** for current values.

Critical gotchas: on the **free tier, your prompts and responses are used to improve Google products** — the paid tier ensures data privacy. **Thinking tokens count as output** and are billed accordingly, which can significantly increase costs when reasoning is enabled (it's on by default for Gemini 3). **Preview models** may change behavior and can be deprecated with as little as 2 weeks notice. Gemini 2.0 Flash models are **shutting down June 1, 2026**. Not all models or features are available in all countries — check **ai.google.dev/gemini-api/docs/available-regions**. The legacy Google AI SDK was deprecated November 30, 2025; use the new `google-genai` package. Since March 2, 2026, new Google Cloud accounts **cannot use the $300 welcome credit** for Gemini API usage.

---

## xAI Grok: real-time data and massive context

### What xAI Grok offers

Grok is xAI's AI assistant family, inspired by the *Hitchhiker's Guide to the Galaxy* and described as "maximally truth-seeking." The newest flagship is **Grok 4.20** (2M-token context, claimed lowest hallucination rate, fastest agentic tool calling). **Grok 4** (256K context) is the core reasoning model with native tool use and image generation. **Grok 3** (1M context) remains strong for non-reasoning workloads. Specialized models include **grok-code-fast-1** (agentic coding at 4x speed and 1/10th cost), **grok-imagine-image** (Aurora image generation), and **grok-imagine-video** (video generation up to 15 seconds).

Grok's unique differentiator is **real-time X/Twitter data access** — it can search posts, profiles, threads, and media from X, a capability no competitor offers. It also features a distinctively witty, irreverent personality compared to more cautious competitors.

### Access, pricing, and sign-up

Grok offers the most complex tier structure. The **Free** tier ($0) provides roughly 10 prompts per 2 hours with basic features — no X account required. **X Premium** ($8/month) adds increased usage and 25% off SuperGrok. **X Premium+** ($40/month) provides higher access plus ad-free X. **SuperGrok** ($30/month) unlocks full Grok 4/4.1 access, 128K-token memory, unlimited image generation, DeepSearch, and voice features. **SuperGrok Heavy** ($300/month) provides exclusive Grok 4 Heavy access (the most powerful variant) and 256K-token memory. **Grok Business** starts at $30/seat/month for team workspaces.

API pricing per million tokens:

| Model | Input | Output | Context |
|-------|-------|--------|---------|
| Grok 4.20 | TBD (newest) | TBD | 2M tokens |
| Grok 4 | $3.00 | $15.00 | 256K tokens |
| Grok 4 Fast / 4.1 Fast | $0.20 | $0.50 | 2M tokens |
| Grok 3 | $3.00 | $15.00 | 1M tokens |

New API users may receive **$25 in promotional credits** (expire 30 days after account creation). An additional $150/month is available through xAI's data-sharing program. Sign up at **console.x.ai**, view plans at **grok.com/plans**.

### Every way to access Grok models

Grok is accessible through the **Grok web app** (grok.com), **iOS and Android mobile apps**, **Grok in X** (grok.x.com, integrated into the X/Twitter sidebar), and the **xAI API** (api.x.ai). The API supports both REST and gRPC protocols. A key detail: **Grok in X has fewer features** than the standalone grok.com app. SDKs include the native **xai-sdk** for Python (gRPC-based, full feature coverage), the **OpenAI Python SDK** (compatible with a base_url change), and the **Vercel AI SDK** (@ai-sdk/xai) for JavaScript.

### Getting started with the Grok chat interface

Getting started with Grok requires just a few steps:

1. Go to **grok.com** and create an xAI account (email or X/Twitter sign-in — no X account required)
2. The chat interface appears immediately — type your message and press Enter
3. Click the **"Think" button** for extended reasoning on complex problems
4. Upload files for analysis, request image generation, or use voice mode
5. Upgrade at **grok.com/plans** for enhanced features

To link an existing X Premium subscription: go to Settings → Account → "Connect your X Account" on grok.com. Subscriptions are managed at grok.com → Settings → Billing.

### Getting started with the xAI API

Developers can start with four steps:

1. Sign up at **accounts.x.ai** and load credits at **console.x.ai**
2. Generate an API key at **console.x.ai/team/default/api-keys**
3. Set your environment variable: `export XAI_API_KEY="your_api_key"`
4. Make a request — the xAI API is **fully compatible with OpenAI's API format**:

```python
from openai import OpenAI
client = OpenAI(
    api_key=os.getenv("XAI_API_KEY"),
    base_url="https://api.x.ai/v1",
)
completion = client.responses.create(
    model="grok-4.20-reasoning",
    input=[
        {"role": "system", "content": "You are Grok, a helpful AI assistant."},
        {"role": "user", "content": "What is the meaning of life?"},
    ],
)
print(completion.output_text)
```

The **Responses API** (`/v1/responses`) is the preferred endpoint. Full documentation lives at **docs.x.ai/developers/quickstart**.

### xAI's official prompting guidance

xAI provides less prompting documentation than OpenAI or Google, but key guidance exists. System prompts are fully supported and can be mixed in any order with user and assistant roles. For **grok-code-fast-1** (documented at docs.x.ai/developers/advanced-api-usage/grok-code-prompt-engineering), xAI recommends being specific with context, defining clear goals, iterating rapidly (the model's speed enables fast experimentation), and using it for **agentic tasks** rather than one-shot queries. An important nuance: **Grok 4 is always a reasoning model** — there is no non-reasoning mode, and the `reasoning_effort` parameter is not supported (it returns an error). For Grok 3 mini, `reasoning_effort` accepts `"low"` or `"high"` values.

### Learning resources and documentation

xAI's documentation at **docs.x.ai** is organized into developers (API reference, quickstart, models, rate limits), guides (reasoning, structured outputs, text generation, image/video/voice capabilities), and tools (function calling, web search, X search, code execution, collections search, remote MCP). The **xAI Cookbook** at docs.x.ai/cookbook provides example implementations. Blog posts and announcements live at **x.ai/news**. The Grok Business user guide at **docs.x.ai/grok/user-guide** covers team features. FAQs at **docs.x.ai/developers/faq/general** and **docs.x.ai/grok/faq** address common questions. Service status is tracked at **status.x.ai**.

### Rate limits and gotchas beginners should know

API rate limits follow a tier-based system determined by **cumulative spend since January 1, 2026**. Tiers unlock automatically and are permanent — you never downgrade. Limits are measured in RPM and TPM per model. Check current limits at **console.x.ai/team/default/rate-limits**. Voice and image API limits require contacting sales@x.ai directly.

Critical gotchas: **X Premium and API billing are completely separate** — one does not affect the other. Grok has **no knowledge of events beyond November 2024** without explicitly enabling the Web Search or X Search tools in API calls. **Promotional credits expire 30 days** after account creation. **Tool invocations carry additional costs** beyond token pricing — Web Search and X Search cost $5 per 1,000 calls, file attachments cost $10 per 1,000 calls. There's a **$0.05 fee per request** for usage guideline violations caught before generation. **Automatic prompt caching** is enabled by default with no configuration needed. Grok 4 does not support `presencePenalty`, `frequencyPenalty`, `stop`, or `logprobs` parameters. The Responses API stores conversation history server-side for 30 days, enabling stateful conversations.

---

## How the three platforms compare at a glance

| Feature | OpenAI | Google Gemini | xAI Grok |
|---------|--------|---------------|----------|
| **Free chat access** | Yes (GPT-5.2, limited) | Yes (Gemini 3 Flash) | Yes (~10 prompts/2 hrs) |
| **Cheapest paid chat plan** | $8/mo (Go) | $7.99/mo (AI Plus) | $8/mo (X Premium) |
| **Full-featured plan** | $20/mo (Plus) | $19.99/mo (AI Pro) | $30/mo (SuperGrok) |
| **Free API tier** | Very limited | Generous (multiple models) | $25 promo credits |
| **Cheapest API model** | GPT-4o-mini ($0.15/$0.60) | Gemini 2.5 Flash-Lite ($0.10/$0.40) | Grok 4 Fast ($0.20/$0.50) |
| **Largest context window** | 1M tokens (GPT-5.4) | 1M tokens (multiple models) | 2M tokens (Grok 4.20) |
| **Official SDKs** | Python, Node.js, .NET | Python, JS, Go, Java, .NET | Python (xai-sdk), OpenAI-compatible |
| **OpenAI API compatible** | Native | Yes (documented) | Yes (documented) |
| **Real-time web search** | Built-in tool | Google Search grounding | Web + X/Twitter search |
| **Unique strength** | Deepest ecosystem, most docs | Best free tier, Workspace integration | X/Twitter data, 2M context |

### Where to start based on your role

For **complete beginners**, Google Gemini offers the lowest barrier to entry — a free Google account unlocks the chat interface immediately, and the free API tier is the most generous for experimentation. For **prompt writers and business users**, OpenAI's ChatGPT Plus ($20/month) provides the most polished chat experience with the broadest tool ecosystem (custom GPTs, apps integrations, desktop companion). For **developers building applications**, all three platforms support OpenAI-compatible API formats, meaning you can switch between providers by changing a single base URL. Start with whichever offers the best model for your use case and budget — Gemini 2.5 Flash-Lite for cost-sensitive workloads, GPT-4o-mini for the OpenAI ecosystem, or Grok 4 Fast for applications needing massive context windows or X/Twitter data access.