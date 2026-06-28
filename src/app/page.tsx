import React from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DealCard from "@/components/DealCard";
import { mockDeals } from "@/data/deals";
import { Sparkles, TicketPercent } from "lucide-react";

export default function Home() {
  const featuredDeals = mockDeals.filter((deal) => deal.featured);
  const regularDeals = mockDeals.filter((deal) => !deal.featured);

  return (
    <>
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
              할인은 <span className="text-brand-primary">트래블딜</span>에서!
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
                    트래블딜이 엄선한 놓치기 아까운 강력 추천 할인 혜택
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
