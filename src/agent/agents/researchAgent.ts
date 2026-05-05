import { callClaude, extractJSON } from "../utils";
import type { ParsedBrief, ResearchOutput } from "../types";
import Groq from "groq-sdk";

export async function runResearchAgent(
  client: Groq,
  brief: ParsedBrief
): Promise<ResearchOutput> {
  const { brandName, productCategory, targetAudience, priceRange, inspirationBrands } = brief;

  // --- Competitors (with web search) ---
  const competitorText = await callClaude(
    client,
    `You are a market research specialist for D2C brands in India. Return ONLY valid JSON.`,
    `Search and identify the top 5 competitor stores for a luxury ${productCategory} brand in India 
targeting ${targetAudience.gender} aged ${targetAudience.ageRange} in ${targetAudience.location}. 
Price range ₹${priceRange.min}-₹${priceRange.max}. Similar to ${inspirationBrands.join(", ")}.

Return JSON:
{
  "competitors": [
    {
      "name": "Brand Name",
      "url": "https://...",
      "positioning": "one sentence",
      "priceRange": "₹X - ₹Y",
      "strengths": "2-3 key strengths",
      "gap": "what ${brandName} can do better"
    }
  ]
}`,
    2000,
    true // use web search
  );

  // --- Product Trends (with web search) ---
  const trendsText = await callClaude(
    client,
    `You are a product trend analyst for luxury home fragrance in India. Return ONLY valid JSON.`,
    `Research trending scented candle SKUs, scent profiles, and packaging trends popular among 
urban Indian women aged 25-40 in 2025. Focus on what's selling on Nykaa, Amazon India, and D2C stores.

Return JSON:
{
  "scentProfiles": ["scent1", "scent2", "scent3", "scent4", "scent5", "scent6"],
  "recommendations": [
    { "sku": "Product Name", "rationale": "why this will sell" },
    { "sku": "Product Name", "rationale": "why this will sell" },
    { "sku": "Product Name", "rationale": "why this will sell" }
  ],
  "packagingTrends": "summary of luxury candle packaging trends in India 2025",
  "occasionOpportunities": ["Diwali gift sets", "wedding favours", "self-gifting", "corporate gifting"]
}`,
    1500,
    true
  );

  // --- Pricing Analysis ---
  const pricingText = await callClaude(
    client,
    `You are a pricing strategist for D2C luxury brands in India. Return ONLY valid JSON.`,
    `Analyze the pricing landscape for luxury scented candles in India. 
Brand "${brandName}" is positioned between ₹${priceRange.min} and ₹${priceRange.max}.
Competitors: search for current candle prices on Indian platforms.

Return JSON:
{
  "analysis": "2-3 sentence summary of the market pricing landscape",
  "tiers": [
    { "name": "Entry", "price": 699, "rationale": "why this entry point works" },
    { "name": "Mid", "price": 1299, "rationale": "mid-tier rationale" },
    { "name": "Premium", "price": 2199, "rationale": "premium tier rationale" }
  ],
  "recommendation": "overall pricing strategy recommendation for ${brandName}"
}`,
    1200,
    true
  );

  // --- Brand Direction ---
  const directionText = await callClaude(
    client,
    `You are a luxury brand strategist. Return ONLY valid JSON.`,
    `Determine ideal brand tone and copy direction for "${brandName}" — 
${productCategory} targeting ${targetAudience.gender} ${targetAudience.ageRange} in ${targetAudience.location}.
Brand personality: ${brief.brandPersonality}. Inspiration: ${inspirationBrands.join(", ")}.

Return JSON:
{
  "copyStyle": "one phrase (e.g. 'Quiet luxury editorial')",
  "rationale": "2-3 sentences explaining why this style fits",
  "voicePrinciples": ["Principle 1", "Principle 2", "Principle 3", "Principle 4"],
  "wordsToUse": ["word1", "word2", "word3", "word4", "word5"],
  "wordsToAvoid": ["word1", "word2", "word3", "word4", "word5"],
  "toneExamples": {
    "headline": "example headline in this voice",
    "productDesc": "example opening line for a product description"
  }
}`,
    1200
  );

  return {
    competitors: extractJSON<{ competitors: any[] }>(competitorText).competitors ?? [],
    productTrends: extractJSON(trendsText),
    pricing: extractJSON(pricingText),
    brandDirection: extractJSON(directionText),
  };
}