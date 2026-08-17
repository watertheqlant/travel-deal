import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DealCard from "@/components/DealCard";
import CopyCodeButton from "@/components/CopyCodeButton";
import BookmarkButton from "@/components/BookmarkButton";
import { mockDeals, getActiveDeals, isExpired } from "@/data/deals";
import { getGuideByBrand } from "@/data/guides";
import { SITE_URL, SITE_NAME, SITE_OG_IMAGE } from "@/lib/site";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  ExternalLink,
  Calendar,
  Info,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

// Only the known deals are valid routes; anything else 404s.
export const dynamicParams = false;

// Prerendered, so "today" would otherwise be frozen at build time and an
// expired coupon would keep presenting itself as usable. Hourly regeneration
// lets the expiry notice appear without a deploy.
export const revalidate = 3600;

export function generateStaticParams() {
  return mockDeals.map((deal) => ({ id: deal.id }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const deal = mockDeals.find((d) => d.id === id);

  if (!deal) {
    return {};
  }

  const title = `${deal.brand} 할인코드 ${deal.discount}`;
  // Search results can outlive the coupon. Say so in the description rather
  // than letting a dead offer look live in the SERP.
  const description = isExpired(deal)
    ? `${deal.brand} ${deal.title}은 ${deal.validUntil}자로 종료되었습니다. 지금 사용할 수 있는 ${deal.category} 할인 쿠폰을 확인하세요.`
    : `${deal.brand} ${deal.title}. ${
        deal.code
          ? `할인코드 ${deal.code} 입력 시 ${deal.discount} 혜택`
          : `코드 입력 없이 링크 접속만으로 ${deal.discount} 적용`
      }${deal.validUntil ? `, ${deal.validUntil}까지 사용 가능` : ""}. 지금 바로 확인하세요.`;
  const url = `/deals/${deal.id}`;

  return {
    title,
    description,
    keywords: [
      `${deal.brand} 할인코드`,
      `${deal.brand} 쿠폰`,
      `${deal.brand} 프로모션 코드`,
      `${deal.category} 할인`,
      "여행 할인",
      "곰곰쿠폰",
    ],
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "article",
      locale: "ko_KR",
      url,
      siteName: SITE_NAME,
      title: `${deal.brand} 할인코드 ${deal.discount} | 곰곰쿠폰`,
      description,
      images: [SITE_OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: `${deal.brand} 할인코드 ${deal.discount} | 곰곰쿠폰`,
      description,
      images: [SITE_OG_IMAGE],
    },
  };
}

const categoryColors = {
  숙박: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20",
  항공: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20",
  액티비티:
    "bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20",
  교통: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
};

export default async function DealDetailPage({ params }: PageProps) {
  const { id } = await params;
  const deal = mockDeals.find((d) => d.id === id);

  if (!deal) {
    notFound();
  }

  const dealUrl = `${SITE_URL}/deals/${deal.id}`;
  const expired = isExpired(deal);

  const offerJsonLd = {
    "@context": "https://schema.org",
    "@type": "Offer",
    name: deal.title,
    description: deal.code
      ? `${deal.brand} ${deal.discount} 할인코드 (${deal.code})`
      : `${deal.brand} ${deal.discount} — 코드 없이 링크 접속으로 적용`,
    category: deal.category,
    url: dealUrl,
    priceCurrency: "KRW",
    availability: "https://schema.org/InStock",
    seller: {
      "@type": "Organization",
      name: deal.brand,
    },
    // Omitted entirely for open-ended promotions — a null validThrough is
    // invalid structured data, and inventing a date would be a false claim.
    ...(deal.validUntil
      ? { validThrough: deal.validUntil, priceValidUntil: deal.validUntil }
      : {}),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "홈", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: deal.title, item: dealUrl },
    ],
  };

  // FAQPage structured data — eligible for FAQ rich results when the deal
  // carries hand-written Q&A. Omitted entirely for deals without FAQ.
  const faqJsonLd =
    deal.faq && deal.faq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: deal.faq.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.a,
            },
          })),
        }
      : null;

  // An expired coupon must not keep advertising itself as a live Offer; the
  // breadcrumb and FAQ stay because they describe the page, not the offer.
  const structuredData = [
    expired ? null : offerJsonLd,
    breadcrumbJsonLd,
    faqJsonLd,
  ].filter(Boolean);

  const activeDeals = getActiveDeals().filter((d) => d.id !== deal.id);

  // For an expired deal, lead with usable coupons in the same category so a
  // visitor arriving from search does not leave empty-handed.
  const relatedDeals = (
    expired
      ? [
          ...activeDeals.filter((d) => d.category === deal.category),
          ...activeDeals.filter((d) => d.category !== deal.category),
        ]
      : activeDeals
  ).slice(0, 3);

  // The informational counterpart of this page, when one exists. Linking to it
  // completes the deal <-> guide pair: this page owns the transactional query
  // ("{brand} 할인코드"), the guide owns the how-to queries.
  const brandGuide = getGuideByBrand(deal.brand);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      <Navbar />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in-up">
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-brand-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>전체 할인 목록으로 가기</span>
          </Link>
        </div>

        {expired && (
          <div className="mb-6 flex items-start gap-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 sm:p-5">
            <AlertCircle className="w-5 h-5 shrink-0 text-amber-600 dark:text-amber-500 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-bold text-amber-700 dark:text-amber-500">
                종료된 프로모션입니다
              </p>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                이 혜택은 {deal.validUntil}자로 종료되어 할인코드가 적용되지
                않습니다. 페이지 하단에서 지금 사용할 수 있는 다른 할인을
                확인하실 수 있습니다.
              </p>
            </div>
          </div>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Left Column: Coupon Info Card */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass rounded-3xl p-6 sm:p-8 border border-slate-200/20 dark:border-slate-800/20 space-y-6">
              {/* Brand and Category Headers */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className={`text-2xl font-black text-white px-3 py-1 rounded-xl shadow-sm ${deal.logoColor}`}>
                    {deal.brand}
                  </span>
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${categoryColors[deal.category]}`}>
                    {deal.category}
                  </span>
                </div>

                <BookmarkButton dealId={deal.id} />
              </div>

              {/* Title & Discount */}
              <div className="space-y-3">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
                  {deal.title}
                </h1>

                <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 text-sm">
                  <Calendar className="w-4 h-4" />
                  {expired ? (
                    <span>
                      <strong className="text-slate-600 dark:text-slate-300">{deal.validUntil}</strong>자로 종료된 프로모션입니다
                    </span>
                  ) : deal.validUntil ? (
                    <span>만료일: <strong className="text-slate-600 dark:text-slate-300">{deal.validUntil}</strong>까지 사용 가능</span>
                  ) : (
                    // No end date exists — the promotion ends on a condition,
                    // which is spelled out in the terms panel.
                    <span>
                      <strong className="text-slate-600 dark:text-slate-300">종료일 미정</strong> · 아래 이용 조건의 종료 기준을 확인하세요
                    </span>
                  )}
                </div>
              </div>

              {/* Discount Amount */}
              <div className="bg-brand-primary/5 dark:bg-brand-primary/10 border border-brand-primary/20 rounded-2xl p-6 text-center">
                <p className="text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400 mb-1">총 할인 혜택</p>
                <div className="text-4xl sm:text-5xl font-black text-brand-primary tracking-tight">
                  {deal.discount}
                </div>
              </div>

              {/* Action Buttons — replaced by an end-of-promotion notice once
                  the coupon lapses, so nobody copies a code that will fail at
                  checkout. */}
              {expired ? (
                <div className="bg-slate-100 dark:bg-slate-900/60 border border-slate-200/40 dark:border-slate-800/40 rounded-2xl p-5 space-y-2 text-center">
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    이 할인코드는 더 이상 사용할 수 없습니다
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    아래에서 지금 사용할 수 있는 {deal.category} 할인을 확인하거나,{" "}
                    <Link href="/" className="font-bold text-brand-primary hover:underline">
                      전체 쿠폰 목록
                    </Link>
                    을 둘러보세요.
                  </p>
                </div>
              ) : (
                <div className={`grid grid-cols-1 gap-4 pt-2 ${deal.code ? "sm:grid-cols-2" : ""}`}>
                  {/* Coupon Code Section — omitted for link-only promotions,
                      where the discount comes from arriving via the link. */}
                  {deal.code ? (
                    <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-900/60 p-3 rounded-2xl border border-slate-200/10">
                      <code className="text-base sm:text-lg font-mono font-black tracking-widest text-slate-700 dark:text-slate-300 pl-3">
                        {deal.code}
                      </code>
                      <CopyCodeButton code={deal.code} />
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed bg-slate-100 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200/10">
                      이 혜택은 <strong className="text-slate-700 dark:text-slate-300">쿠폰 코드가 없습니다.</strong>{" "}
                      아래 버튼으로 접속하면 할인가가 자동으로 반영된 화면이 열립니다.
                    </p>
                  )}

                  {/* Redirect Link */}
                  <a
                    href={deal.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-primary/95 text-white font-bold p-3 rounded-2xl shadow-lg shadow-brand-primary/10 transition-all hover:scale-102 cursor-pointer"
                  >
                    <span>공식 사이트 바로가기</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              )}
            </div>

            {/* How to use */}
            <div className="glass rounded-3xl p-6 sm:p-8 border border-slate-200/20 dark:border-slate-800/20">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <Info className="w-5 h-5 text-brand-secondary" />
                <span>쿠폰 사용 방법 안내 ✈️</span>
              </h2>

              <div className="relative border-l border-slate-200 dark:border-slate-800 ml-3 pl-6 space-y-6">
                {(deal.code
                  ? [
                      { step: "01", text: "코드 복사 버튼을 눌러 할인코드를 복사합니다." },
                      { step: "02", text: "공식 사이트 바로가기 버튼을 클릭하여 해당 예약 플랫폼으로 이동합니다." },
                      { step: "03", text: "할인이 적용 가능한 객실, 항공권 또는 투어 상품을 선택하고 예약을 진행합니다." },
                      { step: "04", text: "결제 페이지의 '할인 코드/프로모션 코드 입력란'에 복사한 코드를 입력합니다." },
                      { step: "05", text: "할인 혜택이 적용된 금액을 확인한 뒤 최종 결제를 마칩니다." }
                    ]
                  : [
                      { step: "01", text: "아래 바로가기 버튼을 눌러 할인 페이지로 이동합니다. 이 링크를 통해 접속해야 할인가가 반영됩니다." },
                      { step: "02", text: "날짜와 인원 등 원하는 조건으로 검색해 상품을 살펴봅니다." },
                      { step: "03", text: "표시된 요금이 할인가인지 확인한 뒤 예약을 진행합니다." },
                      { step: "04", text: "결제 화면에서도 할인가가 그대로 유지되는지 확인하고 최종 결제를 마칩니다." }
                    ]
                ).map((item, idx) => (
                  <div key={idx} className="relative">
                    <span className="absolute -left-[35px] top-0.5 flex items-center justify-center w-6 h-6 rounded-full bg-brand-secondary/15 text-brand-secondary text-xs font-extrabold border border-brand-secondary/35">
                      {item.step}
                    </span>
                    <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Deal Introduction (unique SEO body copy) */}
            {deal.about && deal.about.length > 0 && (
              <div className="glass rounded-3xl p-6 sm:p-8 border border-slate-200/20 dark:border-slate-800/20">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-brand-primary" />
                  <span>{deal.brand} 할인 혜택 자세히 보기</span>
                </h2>
                <div className="space-y-4">
                  {deal.about.map((paragraph, idx) => (
                    <p
                      key={idx}
                      className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* FAQ (rendered + FAQPage structured data) */}
            {deal.faq && deal.faq.length > 0 && (
              <div className="glass rounded-3xl p-6 sm:p-8 border border-slate-200/20 dark:border-slate-800/20">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                  <Info className="w-5 h-5 text-brand-secondary" />
                  <span>자주 묻는 질문 (FAQ)</span>
                </h2>
                <div className="space-y-5">
                  {deal.faq.map((item, idx) => (
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
              </div>
            )}
          </div>

          {/* Right Column: Terms & Conditions & Warning */}
          <div className="space-y-6">
            {deal.terms.length > 0 && (
              <div className="glass rounded-3xl p-6 border border-slate-200/20 dark:border-slate-800/20">
                <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <span>쿠폰 이용 조건 📋</span>
                </h2>

                <ul className="space-y-3">
                  {deal.terms.map((term, index) => (
                    <li key={index} className="flex gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <span className="text-emerald-500 font-bold">•</span>
                      <span>{term}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {brandGuide && (
              <Link
                href={`/guides/${brandGuide.slug}`}
                className="block bg-brand-secondary/5 border border-brand-secondary/20 rounded-3xl p-6 space-y-2 hover:border-brand-secondary/50 transition-colors group"
              >
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-brand-secondary" />
                  <span>{deal.brand} 예약 가이드</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {brandGuide.subtitle}. 결제 전에 확인할 점을 정리했습니다.
                </p>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-secondary pt-1">
                  <span>가이드 읽어보기</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </Link>
            )}

            <div className="bg-amber-500/5 border border-amber-500/20 rounded-3xl p-6 space-y-3">
              <h3 className="text-sm font-bold text-amber-600 dark:text-amber-500 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>유의사항 안내</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                본 할인 정보는 수시로 변경될 수 있으며, 마감 임박 또는 조건 변경에 따라 코드 적용이 되지 않을 수 있습니다. 예약 완료 전에 반드시 할인 금액이 최종 적용되었는지 직접 확인해 주시기 바랍니다.
              </p>
            </div>
          </div>
        </div>

        {/* Related Deals Section */}
        {relatedDeals.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="bg-brand-primary/10 p-2 rounded-xl text-brand-primary border border-brand-primary/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white">
                {expired
                  ? "지금 사용할 수 있는 할인 ✅"
                  : "다른 추천 할인 정보 🔥"}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedDeals.map((relatedDeal) => (
                <DealCard key={relatedDeal.id} deal={relatedDeal} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}
