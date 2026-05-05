import Groq from "groq-sdk";
import { callClaude, extractJSON } from "../utils";
import type { ParsedBrief, ResearchOutput, BrandOutput } from "../types";

export async function runBrandAgent(
  client: Groq,
  brief: ParsedBrief,
  research: ResearchOutput
): Promise<BrandOutput> {
  const text = await callClaude(
    client,
    `You are a luxury brand designer with expertise in Indian D2C brands. Return ONLY valid JSON.`,
    `Design a complete brand identity system for "${brief.brandName}" — a luxury soy candle brand 
targeting ${brief.targetAudience.gender} aged ${brief.targetAudience.ageRange} in ${brief.targetAudience.location}.

Brand direction: ${research.brandDirection.copyStyle}
Inspiration: ${brief.inspirationBrands.join(", ")}
Mood keywords: evoke warmth, ritual, femininity, modern India

Design something that feels like Forest Essentials meets Aesop — not Western generic.
Avoid Inter, Roboto, generic sans-serifs. Choose distinctive, characterful fonts.

Return JSON:
{
  "colors": [
    { "name": "Primary", "hex": "#XXXXXX", "usage": "Primary backgrounds, hero sections" },
    { "name": "Secondary", "hex": "#XXXXXX", "usage": "Section backgrounds, cards" },
    { "name": "Accent", "hex": "#XXXXXX", "usage": "CTAs, highlights, price tags" },
    { "name": "Text Primary", "hex": "#XXXXXX", "usage": "Headings, body text" },
    { "name": "Text Secondary", "hex": "#XXXXXX", "usage": "Captions, meta text" },
    { "name": "Surface", "hex": "#XXXXXX", "usage": "Cards, modals, nav background" }
  ],
  "fonts": {
    "display": {
      "name": "Font Name (e.g. Cormorant Garamond)",
      "googleFontsUrl": "https://fonts.google.com/specimen/Cormorant+Garamond",
      "rationale": "why this font fits the brand"
    },
    "body": {
      "name": "Font Name (e.g. Jost)",
      "googleFontsUrl": "https://fonts.google.com/specimen/Jost",
      "rationale": "why this font works for body copy"
    }
  },
  "designRationale": "2-3 sentences on overall visual direction",
  "logoConceptDescription": "Describe what the logo should look like — mark, wordmark, style",
  "moodKeywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "shopifyThemeSettings": {
    "primaryButtonColor": "#XXXXXX",
    "primaryButtonTextColor": "#XXXXXX",
    "backgroundColor": "#XXXXXX",
    "textColor": "#XXXXXX",
    "accentColor": "#XXXXXX"
  }
}`,
    2000
  );

  return extractJSON<BrandOutput>(text);
}