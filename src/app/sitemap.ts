import type { MetadataRoute } from "next";
import { mockDeals } from "@/data/deals";
import { brandGuides } from "@/data/guides";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const dealRoutes: MetadataRoute.Sitemap = mockDeals.map((deal) => ({
    url: `${SITE_URL}/deals/${deal.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
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
