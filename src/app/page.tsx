import React from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DealCard from "@/components/DealCard";
import { mockDeals } from "@/data/deals";
import { SITE_URL } from "@/lib/site";
import { Sparkles, TicketPercent } from "lucide-react";

// ItemList of all live deals — helps search engines understand the homepage
// as a curated collection and can surface a richer sitelinks presentation.
const itemListJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "곰쿠폰 실시간 여행 할인 쿠폰 목록",
  numberOfItems: mockDeals.length,
  itemListElement: mockDeals.map((deal, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: `${deal.brand} ${deal.title}`,
    url: `${SITE_URL}/deals/${deal.id}`,
  })),
};

// General homepage FAQ — targets common informational queries about how
// travel coupon codes work, and is eligible for FAQ rich results.
const homeFaqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "곰쿠폰의 할인 쿠폰은 어떻게 사용하나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "원하는 딜을 선택해 할인코드를 복사한 뒤, 해당 예약 플랫폼의 결제 화면에 있는 '프로모션 코드' 입력란에 붙여넣고 적용하면 할인이 반영됩니다. 결제 전 총액이 실제로 낮아졌는지 확인하세요.",
      },
    },
    {
      "@type": "Question",
      name: "할인 쿠폰 이용에 비용이 드나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "아니요. 곰쿠폰의 모든 할인코드와 쿠폰 정보는 무료로 제공됩니다. 회원가입 없이 코드를 복사해 바로 사용할 수 있습니다.",
      },
    },
    {
      "@type": "Question",
      name: "어떤 여행 플랫폼의 할인을 제공하나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "아고다, 부킹닷컴, 클룩, 마이리얼트립, KKday, 트립닷컴, 대한항공, 렌탈카스닷컴 등 국내외 인기 숙박·항공·액티비티·교통 플랫폼의 할인 혜택을 한곳에 모아 제공합니다.",
      },
    },
    {
      "@type": "Question",
      name: "할인코드가 적용되지 않을 때는 어떻게 하나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "쿠폰마다 최소 결제 금액, 대상 상품, 유효기간 등 조건이 다릅니다. 각 딜 상세 페이지의 이용 조건을 확인하고, 조건에 맞는 상품·결제 방식을 선택하면 대부분 해결됩니다.",
      },
    },
  ],
};

export default function Home() {
  const featuredDeals = mockDeals.filter((deal) => deal.featured);
  const regularDeals = mockDeals.filter((deal) => !deal.featured);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([itemListJsonLd, homeFaqJsonLd]),
        }}
      />

      <Navbar />

      <main className="flex-1 pb-16">
        {/* Hero Section */}
        <section className="relative w-full h-[400px] sm:h-[480px] flex items-center justify-center overflow-hidden border-b border-slate-200">
          {/* Background image using next/image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/hero-banner.png"
              alt="Beautiful beach and sunset mountains"
              fill
              priority
              className="object-cover object-center scale-105"
            />
            {/* Elegant light overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#f8fafc] via-[#f8fafc]/85 to-[#f8fafc]/40" />
          </div>

          {/* Hero Content */}
          <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 text-slate-900 space-y-6 animate-fade-in-up">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-black uppercase tracking-wider backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Realtime Travel Coupon Hub</span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-slate-900">
              여행을 가볍게,<br className="sm:hidden" />
              할인은 <span className="text-brand-primary">곰쿠폰</span>에서!
            </h1>
            
            <p className="text-sm sm:text-lg text-slate-600 max-w-xl mx-auto font-medium">
              아고다, 부킹닷컴, Klook 등 전 세계 주요 여행사의 최신 할인 쿠폰 코드를 모아두었습니다. 간편하게 복사하고 추가 혜택을 받으세요!
            </p>
          </div>
        </section>

        {/* Content Wrapper */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16 space-y-16">
          {/* Featured Deals Section */}
          {featuredDeals.length > 0 && (
            <section className="space-y-6">
              <div className="flex items-center gap-2">
                <div className="bg-brand-primary/10 p-2 rounded-xl text-brand-primary border border-brand-primary/20">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white">
                    오늘의 추천 특가 🌟
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                    곰쿠폰이 엄선한 놓치기 아까운 강력 추천 할인 혜택
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredDeals.map((deal) => (
                  <DealCard key={deal.id} deal={deal} />
                ))}
              </div>
            </section>
          )}

          {/* Regular Active Deals Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="bg-brand-secondary/10 p-2 rounded-xl text-brand-secondary border border-brand-secondary/20">
                <TicketPercent className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white">
                  활성화된 실시간 쿠폰 🎟️
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  결제 단계에서 즉시 복사하여 사용할 수 있는 할인 정보 모음
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {regularDeals.map((deal) => (
                <DealCard key={deal.id} deal={deal} />
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
