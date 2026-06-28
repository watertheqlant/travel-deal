"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DealCard from "@/components/DealCard";
import { mockDeals, Deal } from "@/data/deals";
import { Bookmark, Compass, ArrowLeft } from "lucide-react";

export default function BookmarksPage() {
  const [bookmarkedDeals, setBookmarkedDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const updateBookmarks = () => {
      const saved = localStorage.getItem("travel-deal-bookmarks");
      if (saved) {
        try {
          const list = JSON.parse(saved) as string[];
          const filtered = mockDeals.filter((deal) => list.includes(deal.id));
          setBookmarkedDeals(filtered);
        } catch {
          setBookmarkedDeals([]);
        }
      } else {
        setBookmarkedDeals([]);
      }
      setLoading(false);
    };

    updateBookmarks();

    // Sync if updated in real time on this page
    window.addEventListener("bookmark-updated", updateBookmarks);
    return () => {
      window.removeEventListener("bookmark-updated", updateBookmarks);
    };
  }, []);

  return (
    <>
      <Navbar />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in-up">
        {/* Header navigation back */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-brand-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>메인으로 돌아가기</span>
          </Link>
        </div>

        {/* Page Title */}
        <div className="flex items-center gap-2.5 mb-8">
          <div className="bg-brand-primary/10 p-2.5 rounded-xl text-brand-primary border border-brand-primary/20">
            <Bookmark className="w-6 h-6 fill-brand-primary" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white">
              내가 저장한 할인 딜 🔖
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              북마크한 여행 쿠폰 정보를 언제든 꺼내어 사용해 보세요.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-primary"></div>
          </div>
        ) : bookmarkedDeals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {bookmarkedDeals.map((deal) => (
              <DealCard key={deal.id} deal={deal} />
            ))}
          </div>
        ) : (
          /* Beautiful Empty State */
          <div className="glass rounded-3xl p-12 text-center max-w-lg mx-auto border border-slate-200/20 dark:border-slate-800/20 my-12 space-y-6">
            <div className="mx-auto w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400 dark:text-slate-500">
              <Bookmark className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">저장한 쿠폰이 없습니다</h3>
              <p className="text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
                마음에 드는 여행 상품의 할인 카드를 북마크하면 여기에 모아 두고 결제 시 빠르게 확인할 수 있습니다.
              </p>
            </div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-brand-primary hover:bg-brand-primary/95 text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-brand-primary/20 transition-all hover:scale-102"
            >
              <Compass className="w-4 h-4" />
              <span>추천 할인 보러가기</span>
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
