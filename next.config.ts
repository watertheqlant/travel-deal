import type { NextConfig } from "next";
import { LEGACY_SITE_HOST, SITE_URL } from "./src/lib/site";

const nextConfig: NextConfig = {
  experimental: {
    turbopackFileSystemCacheForDev: false,
  },

  async redirects() {
    return [
      // The site launched on the Vercel-assigned domain and later moved to the
      // custom domain. Both still served 200, leaving two indexable copies of
      // every page. Send the legacy host to the canonical one, preserving the
      // path so link equity lands on the matching URL rather than the home page.
      //
      // `permanent: true` emits 308 (not 301) — Next.js uses 307/308 so the
      // request method is preserved. Google treats 308 the same as 301 for
      // canonicalization, so signal consolidation is unaffected.
      //
      // No redirect loop: the destination host differs from the `has` host, so
      // the redirected request never re-matches this rule.
      {
        source: "/:path*",
        has: [{ type: "host", value: LEGACY_SITE_HOST }],
        destination: `${SITE_URL}/:path*`,
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
