export interface GuideSection {
  heading: string;
  body: string[];
}

export interface BrandGuide {
  /** URL segment: /guides/{slug}. ASCII only — Korean brand names stay in `brand`. */
  slug: string;
  /** Must match the `brand` field in deals.json so guide <-> deal links resolve. */
  brand: string;
  /** Short informational-intent qualifier used in <title> after the brand name. */
  subtitle: string;
  metaDescription: string;
  /** Informational keywords — deliberately disjoint from the deal pages' "할인코드" set. */
  keywords: string[];
  intro: string[];
  sections: GuideSection[];
  /** Pre-booking checklist rendered as a list. */
  checklist: string[];
  faq: { q: string; a: string }[];
}

import guidesData from "./guides.json";

export const brandGuides = guidesData as BrandGuide[];

export function getGuideBySlug(slug: string): BrandGuide | undefined {
  return brandGuides.find((guide) => guide.slug === slug);
}

/** Reverse lookup so a deal page can link to its brand's guide. */
export function getGuideByBrand(brand: string): BrandGuide | undefined {
  return brandGuides.find((guide) => guide.brand === brand);
}
