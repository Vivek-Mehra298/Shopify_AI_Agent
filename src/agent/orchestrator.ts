import Groq from "groq-sdk";
import { callClaude, extractJSON } from "./utils";
import { runResearchAgent } from "./agents/researchAgent";
import { runBrandAgent } from "./agents/brandAgent";
import { runContentAgent } from "./agents/contentAgent";
import { buildShopifySchema } from "./agents/shopifyAgent";
import type { AgentState, AgentStage, StageLog, ParsedBrief } from "./types";

export type OnProgress = (stage: AgentStage, log: StageLog) => void;

export async function runShopifyAgent(
  brief: string,
  apiKey: string,
  onProgress: OnProgress
): Promise<AgentState> {
  const client = new Groq({ apiKey, dangerouslyAllowBrowser: true });

  const state: AgentState = { brief, startedAt: new Date().toISOString() };

  const log = (stage: AgentStage, message: string, status: StageLog["status"] = "running") => {
    onProgress(stage, { stage, message, status, timestamp: new Date().toISOString() });
  };

  try {
    // Stage 1: Parse Brief
    log("parsing", "Parsing your brief...");
    const parsedText = await callClaude(
      client,
      "Extract structured data from a business brief. Return ONLY valid JSON.",
      `Extract from this brief and return JSON:
{
  "brandName": "", "productCategory": "",
  "targetAudience": { "gender": "", "ageRange": "", "location": "", "lifestyle": "" },
  "priceRange": { "min": 0, "max": 0, "currency": "INR" },
  "brandPersonality": "", "inspirationBrands": [], "requiredPages": [],
  "productCount": 3, "keywords": [], "uniqueValueProposition": ""
}
Brief: ${brief}`,
    );
    state.parsedBrief = extractJSON<ParsedBrief>(parsedText);
    log("parsing", "Brief parsed ✓", "done");

    // Stage 2: Research
    log("researching", "Researching competitors and market trends...");
    state.research = await runResearchAgent(client, state.parsedBrief);
    log("researching", `Found ${state.research.competitors.length} competitors, ${state.research.productTrends.recommendations.length} product recommendations ✓`, "done");

    // Stage 3: Brand
    log("branding", "Building brand identity — colours, fonts, design system...");
    state.brand = await runBrandAgent(client, state.parsedBrief, state.research);
    log("branding", `Brand system created: ${state.brand.colors.length} colours, ${state.brand.fonts.display.name} × ${state.brand.fonts.body.name} ✓`, "done");

    // Stage 4: Content
    log("writing", "Writing all store copy — homepage, products, collections, about...");
    state.content = await runContentAgent(client, state.parsedBrief, state.brand, state.research);
    log("writing", `Generated ${state.content.products.length} products + homepage + collection + about ✓`, "done");

    // Stage 5: Shopify Schema
    log("building", "Building Shopify Admin API-ready JSON schema...");
    state.shopifySchema = buildShopifySchema(state.parsedBrief, state.brand, state.content);
    log("building", "Shopify schema ready ✓", "done");

    state.completedAt = new Date().toISOString();
    log("done", "Agent completed successfully 🎉", "done");
    return state;

  } catch (err) {
    log("error", `Agent error: ${(err as Error).message}`, "error");
    throw err;
  }
}
