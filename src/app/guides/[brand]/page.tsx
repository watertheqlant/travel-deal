import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DealCard from "@/components/DealCard";
import { brandGuides, getGuideBySlug } from "@/data/guides";
import { getActiveDeals } from "@/data/deals";
import { SITE_URL, SITE_NAME, SITE_OG_IMAGE } from "@/lib/site";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Info,
  Ticket,
} from "lucide-react";

interface PageProps {
  params: Promise<{ brand: string }>;
}

// Only the hand-written guides are valid routes; anything else 404s.
export const dynamicParams = false;

// Guides list live coupons for their brand, so they need the same hourly
// regeneration as the other deal listings to drop expired ones.
export const revalidate = 3600;

export function generateStaticParams() {
  return brandGuides.map((guide) => ({ brand: guide.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { brand } = await params;
  const guide = getGuideBySlug(brand);

  if (!guide) {
    return {};
  }

  // Informational intent. The deal pages own "{brand} 할인코드 {discount}" —
  // this title deliberately avoids that phrase so the two pages do not compete
  // for the same query.
  const title = `${guide.brand} 예약 가이드 | ${guide.subtitle}`;
  const url = `/guides/${guide.slug}`;

  return {
    title,
    description: guide.metaDescription,
    keywords: guide.keywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "article",
      locale: "ko_KR",
      url,
      siteName: SITE_NAME,
      title: `${title} | 곰곰쿠폰`,
      description: guide.metaDescription,
      images: [SITE_OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | 곰곰쿠폰`,
      description: guide.metaDescription,
      images: [SITE_OG_IMAGE],
    },
  };
}

export default async function BrandGuidePage({ params }: PageProps) {
  const { brand } = await params;
  const guide = getGuideBySlug(brand);

  if (!guide) {
    notFound();
  }

  const guideUrl = `${SITE_URL}/guides/${guide.slug}`;

  // Deals for this brand — the transactional counterpart of this page.
  // Rendering them here completes the guide -> deal half of the internal link
  // pair (the deal page links back).
  const brandDeals = getActiveDeals().filter(
    (deal) => deal.brand === guide.brand,
  );

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
      {
        "@type": "ListItem",
        position: 3,
        name: `${guide.brand} 예약 가이드`,
        item: guideUrl,
      },
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: guide.faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([breadcrumbJsonLd, faqJsonLd]),
        }}
      />

      <Navbar />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in-up">
        <div className="mb-6">
          <Link
            href="/guides"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-brand-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>브랜드 가이드 목록으로 가기</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column: the guide body */}
          <article className="lg:col-span-2 space-y-6">
            <header className="glass rounded-3xl p-6 sm:p-8 border border-slate-200/20 dark:border-slate-800/20 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full bg-brand-secondary/10 text-brand-secondary border border-brand-secondary/20">
                <BookOpen className="w-3.5 h-3.5" />
                <span>브랜드 가이드</span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
                {guide.brand} 예약 가이드
              </h1>
              <p className="text-base font-semibold text-brand-primary">
                {guide.subtitle}
              </p>

              <div className="space-y-4 pt-2">
                {guide.intro.map((paragraph, idx) => (
                  <p
                    key={idx}
                    className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </header>

            {guide.sections.map((section, idx) => (
              <section
                key={idx}
                className="glass rounded-3xl p-6 sm:p-8 border border-slate-200/20 dark:border-slate-800/20"
              >
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-4">
                  {section.heading}
                </h2>
                <div className="space-y-4">
                  {section.body.map((paragraph, pIdx) => (
                    <p
                      key={pIdx}
                      className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}

            <section className="glass rounded-3xl p-6 sm:p-8 border border-slate-200/20 dark:border-slate-800/20">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <Info className="w-5 h-5 text-brand-secondary" />
                <span>자주 묻는 질문 (FAQ)</span>
              </h2>
              <div className="space-y-5">
                {guide.faq.map((item, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <h3 className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200">
                      Q. {item.q}
                    </h3>
                    <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                      {item.a}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </article>

          {/* Right column: checklist + the transactional hand-off */}
          <aside className="space-y-6">
            <div className="glass rounded-3xl p-6 border border-slate-200/20 dark:border-slate-800/20">
              <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span>예약 전 체크리스트</span>
              </h2>
              <ul className="space-y-3">
                {guide.checklist.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex gap-2 text-sm text-slate-600 dark:text-slate-400"
                  >
                    <span className="text-emerald-500 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {brandDeals.length > 0 && (
              <div className="bg-brand-primary/5 border border-brand-primary/20 rounded-3xl p-6 space-y-4">
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Ticket className="w-5 h-5 text-brand-primary" />
                  <span>{guide.brand} 할인코드 받기</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  예약 방법을 확인했다면, 지금 사용할 수 있는 {guide.brand} 할인
                  혜택을 함께 확인해 보세요.
                </p>
                <ul className="space-y-2">
                  {brandDeals.map((deal) => (
                    <li key={deal.id}>
                      <Link
                        href={`/deals/${deal.id}`}
                        className="flex items-center justify-between gap-2 bg-white/60 dark:bg-slate-900/40 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-brand-primary transition-colors"
                      >
                        <span className="line-clamp-2">{deal.title}</span>
                        <ArrowRight className="w-4 h-4 shrink-0" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>

        {brandDeals.length > 0 && (
          <section className="space-y-6 mt-16">
            <div className="flex items-center gap-2">
              <div className="bg-brand-primary/10 p-2 rounded-xl text-brand-primary border border-brand-primary/20">
                <Ticket className="w-5 h-5" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white">
                {guide.brand} 진행 중인 할인 🔥
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {brandDeals.map((deal) => (
                <DealCard key={deal.id} deal={deal} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}
