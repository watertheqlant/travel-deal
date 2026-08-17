import type { MetadataRoute } from "next";
import { mockDeals, isExpired } from "@/data/deals";
import { brandGuides } from "@/data/guides";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  // Expired deals stay listed: their pages remain 200 with an end-of-promotion
  // notice, and dropping URLs Google was just asked to index would turn them
  // into crawl errors. They are demoted instead, since a lapsed coupon is worth
  // far less than a live one.
  const dealRoutes: MetadataRoute.Sitemap = mockDeals.map((deal) => ({
    url: `${SITE_URL}/deals/${deal.id}`,
    lastModified: new Date(),
    changeFrequency: isExpired(deal) ? "monthly" : "weekly",
    priority: isExpired(deal) ? 0.3 : 0.8,
  }));

  // Guides change far less often than deals — the underlying platform mechanics
  // are stable — so they get a lower changeFrequency.
  const guideRoutes: MetadataRoute.Sitemap = brandGuides.map((guide) => ({
    url: `${SITE_URL}/guides/${guide.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_URL}/guides`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    ...dealRoutes,
    ...guideRoutes,
  ];
}
