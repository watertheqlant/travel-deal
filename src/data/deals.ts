export interface Deal {
  id: string;
  brand: string;
  logoColor: string; // Tailwind bg color class for brand badge background
  title: string;
  discount: string;
  category: "숙박" | "항공" | "액티비티" | "교통";
  code: string;
  link: string;
  validUntil: string;
  terms: string[];
  featured?: boolean;
  // Unique, human-written body copy for the deal detail page (SEO depth).
  // Each string is rendered as its own paragraph.
  about?: string[];
  // Frequently asked questions — rendered on the page AND emitted as FAQPage
  // structured data for rich results.
  faq?: { q: string; a: string }[];
}

import dealsData from "./deals.json";

export const mockDeals = dealsData as Deal[];

/**
 * Brands pinned to the front of the homepage, in this order.
 *
 * A merchandising lever, not a data property — which brand we push changes far
 * more often than the deals themselves, so it lives here rather than as a flag
 * scattered across deals.json. Priority brands are also promoted into the
 * featured section regardless of their own `featured` flag, so editing this one
 * array is enough to change what surfaces first.
 */
export const PRIORITY_BRANDS = ["마이리얼트립"];

export function isPriorityBrand(brand: string): boolean {
  return PRIORITY_BRANDS.includes(brand);
}

/**
 * Priority brands first, in PRIORITY_BRANDS order; everything else keeps its
 * original order. Array.prototype.sort is stable, so equal ranks do not shuffle.
 */
export function sortByBrandPriority(deals: Deal[]): Deal[] {
  const rank = (brand: string) => {
    const index = PRIORITY_BRANDS.indexOf(brand);
    return index === -1 ? PRIORITY_BRANDS.length : index;
  };

  return [...deals].sort((a, b) => rank(a.brand) - rank(b.brand));
}
