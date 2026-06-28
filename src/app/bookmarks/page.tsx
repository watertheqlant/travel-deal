import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookmarksList from "./BookmarksList";
import { Bookmark, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "내가 저장한 할인 딜",
  description: "북마크한 여행 쿠폰 정보를 모아보는 개인 보관함입니다.",
  // Personal, localStorage-only view — keep it out of search results.
  robots: { index: false, follow: false },
  alternates: { canonical: "/bookmarks" },
};

export default function BookmarksPage() {
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

        <BookmarksList />
      </main>

      <Footer />
    </>
  );
}
