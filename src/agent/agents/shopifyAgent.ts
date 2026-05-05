import type { ParsedBrief, BrandOutput, ContentOutput } from "../types";

export function buildShopifySchema(
  brief: ParsedBrief,
  brand: BrandOutput,
  content: ContentOutput
): Record<string, unknown> {
  const accentColor = brand.colors.find((c) => c.name === "Accent")?.hex ?? "#C9A96E";
  const primaryColor = brand.colors.find((c) => c.name === "Primary")?.hex ?? "#1C1C1A";

  return {
    store: { name: brief.brandName, currency: "INR", country: "IN" },

    themeSettings: {
      colors_accent_1: accentColor,
      colors_accent_2: primaryColor,
      colors_text: brand.shopifyThemeSettings?.textColor ?? "#1C1C1A",
      colors_background_1: brand.shopifyThemeSettings?.backgroundColor ?? "#FAF8F5",
      typography_header_font: brand.fonts.display.name.replace(/ /g, "_") + "_n4",
      typography_body_font: brand.fonts.body.name.replace(/ /g, "_") + "_n4",
    },

    collections: [
      {
        title: content.collection.name,
        handle: content.collection.handle,
        body_html: content.collection.description,
        published: true,
        sort_order: "manual",
      },
      {
        title: "Gift Sets",
        handle: "gift-sets",
        body_html: "<p>Curated luxury gift sets for every occasion.</p>",
        published: true,
      },
    ],

    products: content.products.map((p, i) => ({
      title: p.name,
      handle: p.handle,
      body_html: `<p>${p.description}</p><ul>${p.features.map((f) => `<li>${f}</li>`).join("")}</ul>`,
      vendor: "Lumière",
      product_type: p.productType,
      tags: ["soy-candle", "luxury", "handcrafted", "india", ...(p.tags ?? [])].join(","),
      status: "active",
      variants: [
        {
          price: String(p.price),
          compare_at_price: p.compareAtPrice ? String(p.compareAtPrice) : null,
          sku: p.sku ?? `LUM-00${i + 1}`,
          inventory_quantity: 50,
          weight: 300,
          weight_unit: "g",
        },
      ],
      metafields: [
        { namespace: "seo", key: "title", value: p.seo.title, type: "single_line_text_field" },
        { namespace: "seo", key: "description", value: p.seo.metaDescription, type: "single_line_text_field" },
        { namespace: "custom", key: "burn_time", value: p.burnTime, type: "single_line_text_field" },
        { namespace: "custom", key: "scent_family", value: p.scentFamily, type: "single_line_text_field" },
      ],
    })),

    pages: [
      {
        title: "About Us",
        handle: "about-us",
        body_html: `<h1>${content.aboutUsSection.headline}</h1><p>${content.aboutUs}</p>`,
        published: true,
        metafields: [
          { namespace: "seo", key: "title", value: content.aboutUsSection.seo.title, type: "single_line_text_field" },
        ],
      },
    ],

    navigation: {
      mainMenu: [
        { title: "Shop All", url: "/collections/all-candles" },
        { title: "Gift Sets", url: "/collections/gift-sets" },
        { title: "About", url: "/pages/about-us" },
      ],
    },
  };
}