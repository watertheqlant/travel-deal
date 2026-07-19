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
