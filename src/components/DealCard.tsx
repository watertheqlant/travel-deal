"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Deal } from "@/data/deals";
import { Copy, Check, Bookmark, BookmarkCheck, ExternalLink, Calendar } from "lucide-react";

interface DealCardProps {
  deal: Deal;
}

export default function DealCard({ deal }: DealCardProps) {
  const [copied, setCopied] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Check if bookmarked on mount/change
  useEffect(() => {
    const saved = localStorage.getItem("travel-deal-bookmarks");
    if (saved) {
      try {
        const list = JSON.parse(saved) as string[];
        setIsBookmarked(list.includes(deal.id));
      } catch {
        setIsBookmarked(false);
      }
    }
  }, [deal.id]);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to detail page when copying
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(deal.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to detail page when bookmarking
    e.stopPropagation();

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
      list = list.filter((id) => id !== deal.id);
      setIsBookmarked(false);
    } else {
      list.push(deal.id);
      setIsBookmarked(true);
    }

    localStorage.setItem("travel-deal-bookmarks", JSON.stringify(list));
    // Dispatch custom event to notify Navbar
    window.dispatchEvent(new Event("bookmark-updated"));
  };

  // Map category to styles
  const categoryStyles = {
    숙박: "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200/20",
    항공: "bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400 border border-purple-200/20",
    액티비티: "bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400 border border-orange-200/20",
    교통: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/20",
  };

  return (
    <Link href={`/deals/${deal.id}`} className="block">
      <article className="glass-card rounded-2xl overflow-hidden h-full flex flex-col p-5 relative border border-slate-200/40 dark:border-slate-800/40">
        {/* Top Badges / Actions */}
        <div className="flex items-center justify-between mb-4">
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${categoryStyles[deal.category]}`}>
            {deal.category}
          </span>
          <button
            onClick={handleBookmark}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-brand-primary transition-colors"
            aria-label="Bookmark deal"
          >
            {isBookmarked ? (
              <BookmarkCheck className="w-5 h-5 text-brand-primary fill-brand-primary" />
            ) : (
              <Bookmark className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Coupon Discount Badge & Brand */}
        <div className="flex items-baseline gap-2 mb-2">
          <span className={`text-xs text-white px-2 py-0.5 rounded font-black tracking-wide ${deal.logoColor}`}>
            {deal.brand}
          </span>
          <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            | {deal.brand} 공식 제휴
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-2 min-h-[3rem] hover:text-brand-primary transition-colors">
          {deal.title}
        </h3>

        {/* Huge Discount Display */}
        <div className="text-2xl sm:text-3xl font-extrabold text-brand-primary tracking-tight mb-4 flex items-center justify-between">
          <span>{deal.discount}</span>
        </div>

        {/* Coupon Code Copier Section */}
        <div className="mt-auto space-y-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
            <Calendar className="w-3.5 h-3.5" />
            <span>기한: {deal.validUntil}까지</span>
          </div>

          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900/60 p-2 rounded-xl border border-slate-200/10 justify-between">
            <code className="text-sm font-mono font-bold tracking-wider text-slate-700 dark:text-slate-300 pl-2">
              {deal.code}
            </code>
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                copied
                  ? "bg-emerald-500 text-white shadow-sm shadow-emerald-500/10"
                  : "bg-slate-200 hover:bg-brand-primary dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:text-white dark:hover:text-white"
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>복사됨</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>복사</span>
                </>
              )}
            </button>
          </div>

          {/* Details CTA Link */}
          <div className="flex items-center justify-end text-xs font-bold text-slate-400 hover:text-brand-primary gap-1 group/link mt-2">
            <span>자세히 보기</span>
            <ExternalLink className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </article>
    </Link>
  );
}
