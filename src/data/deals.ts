export interface Deal {
  id: string;
  brand: string;
  logoColor: string; // Tailwind bg color class for brand badge background
  title: string;
  discount: string;
  category: "숙박" | "항공" | "액티비티" | "교통";
  /**
   * Promo code entered at checkout. `null` for link-only promotions where the
   * discount is applied just by arriving through `link` — there is nothing to
   * copy, so those render a plain "go to the deal" action instead.
   */
  code: string | null;
  link: string;
  /**
   * Last usable date, YYYY-MM-DD. `null` for open-ended promotions that end on
   * a condition rather than a date (budget exhaustion, stock) — those never
   * auto-expire, so their real end condition belongs in `terms`.
   */
  validUntil: string | null;
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
 * Today's date as YYYY-MM-DD in Asia/Seoul.
 *
 * The audience and every `validUntil` are Korean-local, but Vercel renders in
 * UTC — comparing against a UTC date would expire coupons up to nine hours
 * early. `en-CA` is used because it formats as YYYY-MM-DD, which compares
 * correctly as a plain string.
 */
export function getTodayKst(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
  }).format(new Date());
}

/**
 * A coupon is usable through its `validUntil` date, so it expires the day
 * after. Open-ended coupons (`validUntil: null`) never expire on their own —
 * they end on a condition we cannot observe, so they stay listed until removed
 * by hand.
 */
export function isExpired(deal: Deal, today: string = getTodayKst()): boolean {
  return deal.validUntil !== null && deal.validUntil < today;
}

/** Human-readable validity for display. */
export function formatValidity(deal: Deal): string {
  return deal.validUntil ?? "상시 진행";
}

/**
 * Deals still usable today. Listings use this so dead coupons never occupy
 * prime space; the detail pages stay reachable (they are indexed URLs) and
 * render an expired notice instead.
 */
export function getActiveDeals(today: string = getTodayKst()): Deal[] {
  return mockDeals.filter((deal) => !isExpired(deal, today));
}

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
