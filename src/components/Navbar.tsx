"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Bookmark, Menu, X } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [bookmarkCount, setBookmarkCount] = useState<number>(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Sync bookmark count
  useEffect(() => {
    const updateCount = () => {
      const saved = localStorage.getItem("travel-deal-bookmarks");
      if (saved) {
        try {
          const list = JSON.parse(saved);
          setBookmarkCount(Array.isArray(list) ? list.length : 0);
        } catch {
          setBookmarkCount(0);
        }
      } else {
        setBookmarkCount(0);
      }
    };

    updateCount();

    // Listen to custom bookmark updates on the same page
    window.addEventListener("bookmark-updated", updateCount);
    // Listen to storage event for updates in other tabs
    window.addEventListener("storage", updateCount);

    return () => {
      window.removeEventListener("bookmark-updated", updateCount);
      window.removeEventListener("storage", updateCount);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full glass transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-2 group ">
            <Compass className="w-6 h-6 sm:w-6 sm:h-6 animate-spin-slow" />
            <span className="text-xl sm:text-2xl font-black tracking-tight">
              곰쿠폰
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className={`text-sm font-semibold transition-colors duration-200 px-3 py-2 rounded-lg ${
                pathname === "/"
                  ? "text-brand-primary bg-brand-primary/5"
                  : "text-slate-600 dark:text-slate-300 hover:text-brand-primary hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              홈
            </Link>
            <Link
              href="/bookmarks"
              className={`flex items-center gap-2 text-sm font-semibold transition-colors duration-200 px-3 py-2 rounded-lg ${
                pathname === "/bookmarks"
                  ? "text-brand-primary bg-brand-primary/5"
                  : "text-slate-600 dark:text-slate-300 hover:text-brand-primary hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>저장한 딜</span>
              {bookmarkCount > 0 && (
                <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-white bg-brand-primary rounded-full animate-bounce">
                  {bookmarkCount}
                </span>
              )}
            </Link>
          </nav>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center gap-4">
            {/* Mobile Bookmark Badge Shortcut */}
            <Link href="/bookmarks" className="relative p-2 text-slate-600 dark:text-slate-300">
              <Bookmark className="w-6 h-6" />
              {bookmarkCount > 0 && (
                <span className="absolute top-1 right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white bg-brand-primary rounded-full">
                  {bookmarkCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden glass border-t border-slate-200/20 py-4 px-6 absolute top-16 left-0 w-full animate-fade-in-up">
          <div className="flex flex-col gap-4">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`text-base font-semibold py-2 px-3 rounded-lg ${
                pathname === "/"
                  ? "text-brand-primary bg-brand-primary/5"
                  : "text-slate-600 dark:text-slate-300"
              }`}
            >
              홈
            </Link>
            <Link
              href="/bookmarks"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center justify-between text-base font-semibold py-2 px-3 rounded-lg ${
                pathname === "/bookmarks"
                  ? "text-brand-primary bg-brand-primary/5"
                  : "text-slate-600 dark:text-slate-300"
              }`}
            >
              <span className="flex items-center gap-2">
                <Bookmark className="w-5 h-5" />
                저장한 딜
              </span>
              {bookmarkCount > 0 && (
                <span className="inline-flex items-center justify-center px-2.5 py-1 text-xs font-bold leading-none text-white bg-brand-primary rounded-full">
                  {bookmarkCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
