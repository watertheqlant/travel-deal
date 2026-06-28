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
}

import dealsData from "./deals.json";

export const mockDeals = dealsData as Deal[];
