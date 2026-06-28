"use client";

import React, { useEffect, useState } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";

interface BookmarkButtonProps {
  dealId: string;
}

const STORAGE_KEY = "travel-deal-bookmarks";

export default function BookmarkButton({ dealId }: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const syncBookmark = () => {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const list = JSON.parse(saved) as string[];
          setIsBookmarked(Array.isArray(list) && list.includes(dealId));
        } catch {
          setIsBookmarked(false);
        }
      } else {
        setIsBookmarked(false);
      }
    };

    syncBookmark();

    // Keep in sync when bookmarks change elsewhere (cards, other tabs)
    window.addEventListener("bookmark-updated", syncBookmark);
    window.addEventListener("storage", syncBookmark);
    return () => {
      window.removeEventListener("bookmark-updated", syncBookmark);
      window.removeEventListener("storage", syncBookmark);
    };
  }, [dealId]);

  const handleBookmark = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    let list: string[] = [];

    if (saved) {
      try {
        list = JSON.parse(saved);
        if (!Array.isArray(list)) list = [];
      } catch {
        list = [];
      }
    }

    if (list.includes(dealId)) {
      list = list.filter((savedId) => savedId !== dealId);
      setIsBookmarked(false);
    } else {
      list.push(dealId);
      setIsBookmarked(true);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new Event("bookmark-updated"));
  };

  return (
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
  );
}
