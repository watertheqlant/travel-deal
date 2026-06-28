"use client";

import React, { use, useEffect, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DealCard from "@/components/DealCard";
import { mockDeals, Deal } from "@/data/deals";
import { 
  ArrowLeft, 
  Bookmark, 
  BookmarkCheck, 
  Copy, 
  Check, 
  ExternalLink, 
  Calendar, 
  Info, 
  CheckCircle2, 
  AlertCircle,
  Sparkles
} from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function DealDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const deal = mockDeals.find((d) => d.id === id);

  const [copied, setCopied] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Sync bookmark state on mount
  useEffect(() => {
    if (!deal) return;
    const saved = localStorage.getItem("travel-deal-bookmarks");
    if (saved) {
      try {
        const list = JSON.parse(saved) as string[];
        setIsBookmarked(list.includes(deal.id));
      } catch {
        setIsBookmarked(false);
      }
    }
  }, [deal]);

  if (!deal) {
    return notFound();
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(deal.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const handleBookmark = () => {
    const saved = localStorage.getItem("travel-deal-bookmarks");
    let list: string[] = [];

    if (saved) {
      try {
        list = JSON.parse(saved);
        if (!Array.isArray(list)) list = [];
      } catch {
        list = [];
      }
    }

    if (list.includes(deal.id)) {
      list = list.filter((savedId) => savedId !== deal.id);
      setIsBookmarked(false);
    } else {
      list.push(deal.id);
      setIsBookmarked(true);
    }

    localStorage.setItem("travel-deal-bookmarks", JSON.stringify(list));
    window.dispatchEvent(new Event("bookmark-updated"));
  };

  // Filter other active deals
  const relatedDeals = mockDeals
    .filter((d) => d.id !== deal.id)
    .slice(0, 3);

  const categoryColors = {
    숙박: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20",
    항공: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20",
    액티비티: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20",
    교통: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
  };

  return (
    <>
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

                <button
                  onClick={handleBookmark}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors text-slate-600 dark:text-slate-300"
                >
                  {isBookmarked ? (
                    <>
                      <BookmarkCheck className="w-4.5 h-4.5 text-brand-primary fill-brand-primary" />
                      <span>저장됨</span>
                    </>
                  ) : (
                    <>
                      <Bookmark className="w-4.5 h-4.5" />
                      <span>저장하기</span>
                    </>
                  )}
                </button>
              </div>

              {/* Title & Discount */}
              <div className="space-y-3">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
                  {deal.title}
                </h1>
                
                <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>만료일: <strong className="text-slate-600 dark:text-slate-300">{deal.validUntil}</strong>까지 사용 가능</span>
                </div>
              </div>

              {/* Discount Amount */}
              <div className="bg-brand-primary/5 dark:bg-brand-primary/10 border border-brand-primary/20 rounded-2xl p-6 text-center">
                <p className="text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400 mb-1">총 할인 혜택</p>
                <div className="text-4xl sm:text-5xl font-black text-brand-primary tracking-tight">
                  {deal.discount}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {/* Coupon Code Section */}
                <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-900/60 p-3 rounded-2xl border border-slate-200/10">
                  <code className="text-base sm:text-lg font-mono font-black tracking-widest text-slate-700 dark:text-slate-300 pl-3">
                    {deal.code}
                  </code>
                  <button
                    onClick={handleCopy}
                    className={`flex items-center gap-1.5 text-xs font-bold px-4 py-2.5 rounded-xl transition-all ${
                      copied
                        ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/10"
                        : "bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-brand-primary hover:text-white dark:hover:text-white"
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>복사 완료</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>코드 복사</span>
                      </>
                    )}
                  </button>
                </div>

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
            </div>

            {/* How to use */}
            <div className="glass rounded-3xl p-6 sm:p-8 border border-slate-200/20 dark:border-slate-800/20">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <Info className="w-5 h-5 text-brand-secondary" />
                <span>쿠폰 사용 방법 안내 ✈️</span>
              </h3>
              
              <div className="relative border-l border-slate-200 dark:border-slate-800 ml-3 pl-6 space-y-6">
                {[
                  { step: "01", text: "코드 복사 버튼을 눌러 할인코드를 복사합니다." },
                  { step: "02", text: "공식 사이트 바로가기 버튼을 클릭하여 해당 예약 플랫폼으로 이동합니다." },
                  { step: "03", text: "할인이 적용 가능한 객실, 항공권 또는 투어 상품을 선택하고 예약을 진행합니다." },
                  { step: "04", text: "결제 페이지의 '할인 코드/프로모션 코드 입력란'에 복사한 코드를 입력합니다." },
                  { step: "05", text: "할인 혜택이 적용된 금액을 확인한 뒤 최종 결제를 마칩니다." }
                ].map((item, idx) => (
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
          </div>

          {/* Right Column: Terms & Conditions & Warning */}
          <div className="space-y-6">
            <div className="glass rounded-3xl p-6 border border-slate-200/20 dark:border-slate-800/20">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span>쿠폰 이용 조건 📋</span>
              </h3>
              
              <ul className="space-y-3">
                {deal.terms.map((term, index) => (
                  <li key={index} className="flex gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <span className="text-emerald-500 font-bold">•</span>
                    <span>{term}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-amber-500/5 border border-amber-500/20 rounded-3xl p-6 space-y-3">
              <h4 className="text-sm font-bold text-amber-600 dark:text-amber-500 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>유의사항 안내</span>
              </h4>
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
                다른 추천 할인 정보 🔥
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
