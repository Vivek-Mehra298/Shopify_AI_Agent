export interface ParsedBrief {
  brandName: string;
  productCategory: string;
  targetAudience: {
    gender: string;
    ageRange: string;
    location: string;
    lifestyle: string;
  };
  priceRange: { min: number; max: number; currency: string };
  brandPersonality: string;
  inspirationBrands: string[];
  requiredPages: string[];
  productCount: number;
  keywords: string[];
  uniqueValueProposition: string;
}

export interface Competitor {
  name: string;
  url: string;
  positioning: string;
  priceRange: string;
  strengths: string;
  gap: string;
}

export interface ProductTrends {
  scentProfiles: string[];
  recommendations: Array<{ sku: string; rationale: string }>;
  packagingTrends: string;
  occasionOpportunities: string[];
}

export interface Pricing {
  analysis: string;
  tiers: Array<{ name: string; price: number; rationale: string }>;
  recommendation: string;
}

export interface BrandDirection {
  copyStyle: string;
  rationale: string;
  voicePrinciples: string[];
  wordsToUse: string[];
  wordsToAvoid: string[];
  toneExamples: { headline: string; productDesc: string };
}

export interface ResearchOutput {
  competitors: Competitor[];
  productTrends: ProductTrends;
  pricing: Pricing;
  brandDirection: BrandDirection;
}

export interface BrandColor {
  name: string;
  hex: string;
  usage: string;
}

export interface BrandOutput {
  colors: BrandColor[];
  fonts: {
    display: { name: string; googleFontsUrl: string; rationale: string };
    body: { name: string; googleFontsUrl: string; rationale: string };
  };
  designRationale: string;
  logoConceptDescription: string;
  moodKeywords: string[];
  shopifyThemeSettings: Record<string, string>;
}

export interface ProductListing {
  name: string;
  handle: string;
  price: number;
  compareAtPrice: number | null;
  sku: string;
  burnTime: string;
  scentFamily: string;
  description: string;
  features: string[];
  seo: { title: string; metaDescription: string; keywords: string[] };
  tags: string[];
  vendor: string;
  productType: string;
}

export interface ContentOutput {
  homepage: {
    hero: { headline: string; subheadline: string; cta: string };
    valueProps: Array<{ icon: string; title: string; description: string }>;
    socialProof: {
      quote: string;
      author: string;
      context: string;
      rating: number;
    };
    featuredCollectionHeadline: string;
    newsletterHeadline: string;
    newsletterSubtext: string;
  };
  products: ProductListing[];
  collection: {
    name: string;
    handle: string;
    description: string;
    seo: { title: string; metaDescription: string };
  };
  aboutUs: string;
  aboutUsSection: {
    headline: string;
    body: string;
    seo: { title: string; metaDescription: string };
  };
}

export interface AgentState {
  brief: string;
  parsedBrief?: ParsedBrief;
  research?: ResearchOutput;
  brand?: BrandOutput;
  content?: ContentOutput;
  shopifySchema?: Record<string, unknown>;
  startedAt: string;
  completedAt?: string;
}

export type AgentStage =
  | "idle"
  | "parsing"
  | "researching"
  | "branding"
  | "writing"
  | "building"
  | "done"
  | "error";

export interface StageLog {
  stage: AgentStage;
  message: string;
  timestamp: string;
  status: "running" | "done" | "error";
}