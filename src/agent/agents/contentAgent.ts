import { callClaude, extractJSON } from "../utils";
import type { ParsedBrief, ResearchOutput, BrandOutput, ContentOutput } from "../types";
import { Groq } from "groq-sdk/client";

export async function runContentAgent(
  client: Groq,
  brief: ParsedBrief,
  brand: BrandOutput,
  research: ResearchOutput
): Promise<ContentOutput> {
  const voice = research.brandDirection.voicePrinciples.join("; ");
  const skus = research.productTrends.recommendations.map((r) => r.sku).join(", ");

  // --- Homepage ---
  const homepageText = await callClaude(
    client,
    `You are a luxury copywriter. Style: ${research.brandDirection.copyStyle}. 
Voice principles: ${voice}.
Write like Aesop, Forest Essentials, Diptyque — restrained, poetic, never hypey.
Return ONLY valid JSON.`,
    `Write homepage copy for "${brief.brandName}" — luxury soy candles, India.

Return JSON:
{
  "hero": {
    "headline": "Max 8 words. Poetic, atmospheric, sensory.",
    "subheadline": "1-2 sentences. Evocative, no clichés.",
    "cta": "2-4 words"
  },
  "valueProps": [
    { "icon": "flame", "title": "Short title", "description": "1 sentence benefit" },
    { "icon": "leaf", "title": "Short title", "description": "1 sentence benefit" },
    { "icon": "gift", "title": "Short title", "description": "1 sentence benefit" }
  ],
  "socialProof": {
    "quote": "A specific, believable customer testimonial mentioning a scent or occasion",
    "author": "First name, City (e.g. Priya M., Mumbai)",
    "context": "Verified Buyer",
    "rating": 5
  },
  "featuredCollectionHeadline": "Headline for the featured products section",
  "newsletterHeadline": "Short email signup headline",
  "newsletterSubtext": "1 sentence benefit of subscribing"
}`,
    1800
  );

  // --- Products ---
  const productsText = await callClaude(
    client,
    `You are a luxury product copywriter. Voice: ${voice}. 
Descriptions must evoke sensory experience, occasion, and aspiration.
Minimum 150 words per description. Start each description with a scene, not a spec.
Return ONLY valid JSON.`,
    `Write 3 complete product listings for "${brief.brandName}" soy candles.
Suggested SKUs: ${skus}
Price range: ₹${brief.priceRange.min} - ₹${brief.priceRange.max}

Return JSON:
{
  "products": [
    {
      "name": "Full product name",
      "handle": "url-slug",
      "price": 1299,
      "compareAtPrice": null,
      "sku": "LUM-001",
      "burnTime": "45-50 hours",
      "scentFamily": "Floral/Woody/Citrus/etc",
      "description": "MINIMUM 150 WORDS. Start with a scene. Evoke the setting where someone would light this candle. Describe the scent journey — top, heart, base notes. Then connect to a ritual or moment. Close with craftsmanship details.",
      "features": [
        "Benefit-first bullet 1",
        "Benefit-first bullet 2",
        "Benefit-first bullet 3",
        "Benefit-first bullet 4",
        "Benefit-first bullet 5"
      ],
      "seo": {
        "title": "Product Name | Lumière | Luxury Soy Candles India",
        "metaDescription": "Max 155 chars. Include primary keyword naturally.",
        "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"]
      },
      "tags": ["soy-candle", "luxury", "handcrafted"],
      "vendor": "Lumière",
      "productType": "Scented Candle"
    }
  ]
}`,
    4000
  );

  // --- Collection + About ---
  const collectionText = await callClaude(
    client,
    `You are a luxury copywriter. Voice: ${voice}. Return ONLY valid JSON.`,
    `Write a collection page description and About Us for "${brief.brandName}".

Return JSON:
{
  "collection": {
    "name": "The Lumière Collection",
    "handle": "all-candles",
    "description": "2-3 paragraphs ~120 words. Collection philosophy, craft, who they're for.",
    "seo": {
      "title": "Luxury Soy Candles India | Lumière Collection",
      "metaDescription": "Max 155 chars."
    }
  },
  "aboutUsSection": {
    "headline": "Short brand headline",
    "body": "~100 words. Origin, craft values, what makes Lumière different. First person plural. Poetic, not corporate.",
    "seo": {
      "title": "About Lumière | Premium Handcrafted Soy Candles India",
      "metaDescription": "Max 155 chars."
    }
  }
}`,
    1800
  );

  const homepage = extractJSON<ContentOutput["homepage"]>(homepageText);
  const { products } = extractJSON<{ products: ContentOutput["products"] }>(productsText);
  const { collection, aboutUsSection } = extractJSON<{
    collection: ContentOutput["collection"];
    aboutUsSection: ContentOutput["aboutUsSection"];
  }>(collectionText);

  return {
    homepage,
    products: products ?? [],
    collection,
    aboutUs: aboutUsSection?.body ?? "",
    aboutUsSection,
  };
}