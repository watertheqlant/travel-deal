// Central site constants used across metadata, sitemap, robots, and structured data.

export const SITE_URL = "https://travel-deal-4u.vercel.app";
export const SITE_NAME = "곰곰쿠폰";
export const SITE_TITLE =
  "곰곰쿠폰 (Gomgomcoupon) | 실시간 여행 할인 & 쿠폰 혜택";
export const SITE_DESCRIPTION =
  "아고다, 부킹닷컴, Klook, 마이리얼트립 등 인기 여행 플랫폼의 실시간 할인 쿠폰 번호와 특가 혜택 정보를 한눈에 모아보세요. 복사만 하면 바로 할인이 적용됩니다!";

export const SITE_KEYWORDS = [
  "여행쿠폰",
  "여행할인",
  "아고다할인코드",
  "Klook할인쿠폰",
  "특가항공권",
  "호텔할인코드",
  "곰곰쿠폰",
];

// Open Graph / Twitter share image (lives in /public). Resolved against metadataBase.
export const SITE_OG_IMAGE = "/hero-banner.png";

// Search engine ownership-verification tokens.
// These values are NOT secret — they are exposed publicly in the page <head> by design.
// Each has a NEXT_PUBLIC_* env override that takes precedence if set.
export const GOOGLE_SITE_VERIFICATION =
  process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ??
  "QBiyaRSDYcvm21Rps0RSLMBEOJCNQj1YL5Ot_vJ4hS8";

// Naver Search Advisor (searchadvisor.naver.com) — Korea's dominant search engine.
// Paste the token from "사이트 소유확인 > HTML 태그" here, or set NEXT_PUBLIC_NAVER_SITE_VERIFICATION.
export const NAVER_SITE_VERIFICATION =
  process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION ?? "";

// Bing Webmaster Tools (bing.com/webmasters) — also powers DuckDuckGo, Ecosia, etc.
// Paste the "content" value of the msvalidate.01 meta tag here, or set NEXT_PUBLIC_BING_SITE_VERIFICATION.
export const BING_SITE_VERIFICATION =
  process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION ?? "";
