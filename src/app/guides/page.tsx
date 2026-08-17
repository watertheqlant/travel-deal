import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { brandGuides } from "@/data/guides";
import { getActiveDeals } from "@/data/deals";
import { SITE_URL, SITE_NAME, SITE_OG_IMAGE } from "@/lib/site";
import { ArrowRight, BookOpen } from "lucide-react";

const TITLE = "여행 플랫폼 예약 가이드";
const DESCRIPTION =
  "아고다, 부킹닷컴, 클룩, 마이리얼트립, 트립닷컴의 요금제 구조와 예약 시 확인할 점을 플랫폼별로 정리했습니다. 결제 방식, 취소 규정, 수하물·바우처 등 예약 전에 알아야 할 내용을 담았습니다.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "여행 플랫폼 비교",
    "숙소 예약 방법",
    "항공권 예약 가이드",
    "액티비티 예약 방법",
    "여행 예약 주의사항",
  ],
  alternates: {
    canonical: "/guides",
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "/guides",
    siteName: SITE_NAME,
    title: `${TITLE} | 곰곰쿠폰`,
    description: DESCRIPTION,
    images: [SITE_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: `${TITLE} | 곰곰쿠폰`,
    description: DESCRIPTION,
    images: [SITE_OG_IMAGE],
  },
};

// The per-brand deal counts below must not include lapsed coupons.
export const revalidate = 3600;

export default function GuidesIndexPage() {
  const activeDeals = getActiveDeals();

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "홈", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "브랜드 가이드",
        item: `${SITE_URL}/guides`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <Navbar />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in-up">
        <header className="space-y-4 mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full bg-brand-secondary/10 text-brand-secondary border border-brand-secondary/20">
            <BookOpen className="w-3.5 h-3.5" />
            <span>브랜드 가이드</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
            여행 플랫폼 예약 가이드
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
            같은 숙소, 같은 항공권이라도 어느 플랫폼에서 어떤 요금제로
            예약하느냐에 따라 최종 금액과 취소 조건이 달라집니다. 플랫폼별로
            구조가 어떻게 다른지, 결제 전에 무엇을 확인해야 하는지 정리했습니다.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {brandGuides.map((guide) => {
            const dealCount = activeDeals.filter(
              (deal) => deal.brand === guide.brand,
            ).length;

            return (
              <Link
                key={guide.slug}
                href={`/guides/${guide.slug}`}
                className="glass rounded-3xl p-6 sm:p-8 border border-slate-200/20 dark:border-slate-800/20 space-y-3 hover:border-brand-primary/40 transition-colors group"
              >
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                    {guide.brand} 예약 가이드
                  </h2>
                  <ArrowRight className="w-5 h-5 shrink-0 text-slate-400 group-hover:text-brand-primary transition-colors" />
                </div>

                <p className="text-sm font-semibold text-brand-primary">
                  {guide.subtitle}
                </p>

                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                  {guide.intro[0]}
                </p>

                <div className="flex flex-wrap gap-2 pt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-900/60">
                    {guide.sections.length}개 항목
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-900/60">
                    FAQ {guide.faq.length}개
                  </span>
                  {dealCount > 0 && (
                    <span className="px-2.5 py-1 rounded-full bg-brand-primary/10 text-brand-primary">
                      진행 중인 할인 {dealCount}건
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </main>

      <Footer />
    </>
  );
}
