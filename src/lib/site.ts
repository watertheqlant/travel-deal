// Central site constants used across metadata, sitemap, robots, and structured data.

export const SITE_URL = "https://travel-deal-4u.vercel.app";
export const SITE_NAME = "트래블딜";
export const SITE_TITLE =
  "트래블딜 (Travel Deal) | 실시간 여행 할인 & 쿠폰 혜택";
export const SITE_DESCRIPTION =
  "아고다, 부킹닷컴, Klook, 마이리얼트립 등 인기 여행 플랫폼의 실시간 할인 쿠폰 번호와 특가 혜택 정보를 한눈에 모아보세요. 복사만 하면 바로 할인이 적용됩니다!";

export const SITE_KEYWORDS = [
  "여행쿠폰",
  "여행할인",
  "아고다할인코드",
  "Klook할인쿠폰",
  "특가항공권",
  "호텔할인코드",
  "트래블딜",
];

// Open Graph / Twitter share image (lives in /public). Resolved against metadataBase.
export const SITE_OG_IMAGE = "/hero-banner.png";

// Google Search Console verification token.
// Set NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION in the deployment env (Vercel project settings).
export const GOOGLE_SITE_VERIFICATION =
  process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? "";
