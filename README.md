# 🕯️ Lumière — AI-Powered Shopify Store Builder

> An autonomous AI agent that takes a plain-text business brief and generates a complete, production-ready Shopify store — including market research, brand identity, store copy, product listings, and a Shopify Admin API-ready JSON schema.

---

## Table of Contents

- [Demo](#demo)
- [What the Agent Does](#what-the-agent-does)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Keys](#api-keys)
- [Architecture Overview](#architecture-overview)
- [Agent Pipeline](#agent-pipeline)
- [Outputs](#outputs)
- [Shopify Integration](#shopify-integration)
- [Limitations](#limitations)
- [If I Had 2 More Weeks](#if-i-had-2-more-weeks)

---

## Demo

Enter this brief in the agent UI and watch it build a full store autonomously:

```
We want to sell premium handcrafted soy candles targeting urban women aged 25-40
in India. Brand name is 'Lumière'. Products are scented candles in luxury packaging
— price range ₹599 to ₹2,499. We want to feel like a modern, minimal luxury brand,
similar to Forest Essentials but for home fragrance. We need a homepage, a
collections page, and 3 sample product listings.
```

**What gets generated in ~2 minutes:**
- 5 competitor brands with positioning analysis
- Product trend + pricing recommendations
- Brand color palette (hex codes) + font pairing
- Full homepage copy (hero, value props, testimonial)
- 3 product listings (150+ words each, SEO meta tags)
- Collection page description + About Us
- Shopify Admin API-ready JSON schema

---

## What the Agent Does

| Stage | What Happens |
|---|---|
| 1. Parse Brief | Extracts brand name, audience, price range, tone from free-text input |
| 2. Market Research | Identifies 5 competitors, trending SKUs, pricing landscape, brand direction |
| 3. Brand Strategy | Generates color palette, typography, design rationale |
| 4. Content Writing | Writes all store copy — homepage, 3 products, collection, about us |
| 5. Shopify Schema | Outputs complete Shopify Admin API-ready JSON for collections, products, pages |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui |
| AI (Default) | Groq API — `llama-3.3-70b-versatile` (free) |
| AI (Alternative) | Anthropic Claude / Google Gemini |
| File Downloads | file-saver |

---

## Project Structure

```
lumi-re-builder/
├── src/
│   ├── agent/
│   │   ├── orchestrator.ts        # Runs all pipeline stages, emits progress events
│   │   ├── types.ts               # TypeScript interfaces for entire pipeline
│   │   ├── utils.ts               # callClaude() helper + extractJSON() parser
│   │   └── agents/
│   │       ├── researchAgent.ts   # Competitor + trend + pricing + brand direction
│   │       ├── brandAgent.ts      # Colors, fonts, design system
│   │       ├── contentAgent.ts    # Homepage, products, collection, about us
│   │       └── shopifyAgent.ts    # Builds Shopify Admin API JSON schema
│   ├── components/
│   │   └── AgentRunner.tsx        # Full UI — input, live logs, results, downloads
│   └── pages/
│       └── Agent.tsx              # Route wrapper for /agent
├── public/
├── .env.example
├── package.json
└── README.md
```

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Vivek-Mehra298/lumi-re-builder.git
cd lumi-re-builder
```

### 2. Install dependencies

```bash
npm install
```

### 3. Install agent dependencies

```bash
# If using Groq (free — recommended)
npm install groq-sdk file-saver
npm install --save-dev @types/file-saver

# If using Anthropic Claude
npm install @anthropic-ai/sdk file-saver
npm install --save-dev @types/file-saver
```

### 4. Set up environment variables (optional)

```bash
cp .env.example .env
# Then open .env and add your API key
```

> You can also skip this step and paste your API key directly into the UI at runtime.

### 5. Start the dev server

```bash
npm run dev
```

### 6. Open the agent

Visit **http://localhost:5173/agent** in your browser.

---

## API Keys

The agent runs entirely in the browser — your API key is only ever sent to the AI provider's endpoint, never stored anywhere.

### Groq (Free — Recommended)

1. Go to [console.groq.com](https://console.groq.com)
2. Sign up → **API Keys** → **Create API Key**
3. Keys start with `gsk_...`
4. Paste into the key field in the UI

### Anthropic Claude

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. **API Keys** → **Create Key**
3. Keys start with `sk-ant-...`

### Google Gemini

1. Go to [aistudio.google.com](https://aistudio.google.com)
2. Click **Get API Key**
3. Keys start with `AIza...`

### `.env.example`

```env
# Copy this file to .env and fill in your key
# Only one provider is needed

# Groq (free, recommended)
VITE_GROQ_API_KEY=gsk_...

# Anthropic Claude (paid)
VITE_ANTHROPIC_API_KEY=sk-ant-...

# Google Gemini (free tier)
VITE_GEMINI_API_KEY=AIza...
```

---

## Architecture Overview

```
User Input (brief text)
        │
        ▼
┌───────────────────┐
│   Orchestrator    │  ← Manages stage order, progress events, error handling
└───────┬───────────┘
        │
        ▼
┌───────────────────┐     ┌──────────────────────────┐
│  Research Agent   │────▶│  Web Search Tool (Groq)   │
│                   │     │  or training knowledge    │
└───────┬───────────┘     └──────────────────────────┘
        │  competitors, trends, pricing, brand direction
        ▼
┌───────────────────┐
│   Brand Agent     │  ← Uses research output as context
│                   │  → Colors, fonts, design rationale
└───────┬───────────┘
        │
        ▼
┌───────────────────┐
│  Content Agent    │  ← Uses brief + brand + research
│                   │  → Homepage, 3 products, collection, about us
└───────┬───────────┘
        │
        ▼
┌───────────────────┐
│  Shopify Agent    │  ← Pure TypeScript function (no AI call)
│                   │  → Shopify Admin API-ready JSON
└───────┬───────────┘
        │
        ▼
  UI Results + Downloads
```

### Where Human Input Ends and Autonomy Begins

- **Human input:** The business brief (one paragraph of text) and the API key
- **Fully autonomous from that point:** All research queries, JSON structure decisions, copy tone, color choices, font pairing, product names, descriptions, SEO tags, and Shopify schema construction

---

## Agent Pipeline

### Stage 1 — Parse Brief
Calls the AI with a structured extraction prompt. Outputs a typed `ParsedBrief` object with brand name, audience, price range, inspiration brands, and more.

### Stage 2 — Research Agent
Makes 4 parallel-style calls:
- **Competitor research** — identifies 5 Indian candle/luxury D2C brands with positioning notes
- **Product trends** — recommends SKUs, scent profiles, packaging trends
- **Pricing analysis** — maps the ₹599–₹2,499 range against market data
- **Brand direction** — decides copy style, voice principles, words to use/avoid

### Stage 3 — Brand Agent
Takes research output and generates:
- 6-color palette with hex codes and usage notes
- Display + body font pairing with rationale
- Design philosophy statement
- Logo concept description
- Shopify theme settings object

### Stage 4 — Content Agent
Makes 3 calls, each building on previous outputs:
- **Homepage** — hero headline, subheadline, CTA, 3 value props, social proof block
- **Products** — 3 full listings with 150+ word descriptions, feature bullets, SEO meta tags
- **Collection + About** — collection page description, About Us section

### Stage 5 — Shopify Schema
Pure TypeScript function. Maps all generated content into Shopify Admin API format:
- `collections[]` — ready for `POST /custom_collections.json`
- `products[]` — ready for `POST /products.json` with variants and metafields
- `pages[]` — ready for `POST /pages.json`
- `themeSettings` — ready for theme customization API
- `navigation` — main menu + footer menu structure

---

## Outputs

After the agent completes, you can download 5 JSON files:

| File | Contents |
|---|---|
| `lumiere_full.json` | Complete agent state — everything |
| `lumiere_shopify.json` | Shopify Admin API-ready schema |
| `lumiere_research.json` | Competitor analysis, trends, pricing |
| `lumiere_brand.json` | Color palette, fonts, design system |
| `lumiere_content.json` | All store copy — homepage, products, pages |

---

## Shopify Integration

### Option A — API Push (if you have a Shopify dev store)

Use the generated `lumiere_shopify.json` with the Shopify Admin API:

```bash
# Create a product
curl -X POST "https://your-store.myshopify.com/admin/api/2024-01/products.json" \
  -H "X-Shopify-Access-Token: YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d @lumiere_shopify.json
```

### Option B — Manual Import (no Shopify account needed)

The JSON schema matches Shopify's exact product/page/collection structure. You can:
1. Create a free Shopify dev store at [partners.shopify.com](https://partners.shopify.com)
2. Copy product content from `lumiere_content.json` into the Shopify admin UI
3. Apply the color palette from `lumiere_brand.json` in the theme editor

### Getting a Shopify Dev Store (Free)

1. Sign up at [partners.shopify.com](https://partners.shopify.com)
2. Go to **Stores** → **Add Store** → **Development Store**
3. No credit card required, no time limit

---

## Limitations

| Limitation | Details |
|---|---|
| No live web search (Groq) | Research uses model training knowledge, not real-time data. Competitors and prices may not reflect today's market exactly. Use Anthropic for live search. |
| No image generation | Product images are not generated — placeholder image URLs are used in the Shopify schema |
| Browser-only | Agent runs in the browser, so very long runs (>5 min) may hit browser timeout on slow connections |
| JSON parsing fragility | If the AI returns malformed JSON, the stage fails. The `extractJSON()` utility handles most cases but edge cases can occur |
| Rate limits | Groq free tier has per-minute token limits. If the agent errors mid-run, wait 60 seconds and retry |
| No Shopify OAuth | Direct API push requires a manually created Shopify access token — no OAuth flow is implemented |

---

## If I Had 2 More Weeks

- **Image generation** — integrate DALL-E 3 or Stability AI to generate product mockup images and hero banners automatically
- **Shopify OAuth flow** — let users connect their store directly from the UI without manually copying tokens
- **Streaming responses** — stream each Claude response token-by-token into the UI for a more dynamic feel
- **Multi-brief support** — allow saving and comparing multiple brief runs side-by-side
- **Live web search for Groq** — add a custom search layer using SerpAPI or Tavily so free-tier users also get real competitor data
- **Theme preview** — render a live HTML preview of the homepage using the generated colors, fonts, and copy before export
- **Edit mode** — let users tweak any generated output (copy, colors, prices) inline before downloading
- **One-click Shopify push** — full OAuth + automated product/collection/page creation with progress feedback

---

## Contributing

This project was built as a fresher assignment demo. PRs and suggestions welcome.

1. Fork the repo
2. Create a feature branch — `git checkout -b feature/your-feature`
3. Commit your changes — `git commit -m 'Add some feature'`
4. Push to the branch — `git push origin feature/your-feature`
5. Open a Pull Request

---

## License

MIT — feel free to use this as a base for your own AI agent projects.

---

<p align="center">Built with ☕ and Claude by <a href="https://github.com/Vivek-Mehra298">Vivek Mehra</a></p>
