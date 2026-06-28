import type { MetadataRoute } from "next";
import { mockDeals } from "@/data/deals";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const dealRoutes: MetadataRoute.Sitemap = mockDeals.map((deal) => ({
    url: `${SITE_URL}/deals/${deal.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...dealRoutes,
  ];
}
