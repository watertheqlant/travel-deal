"use client";

import React, { useEffect, useRef, useState } from "react";
import { Copy, Check, ExternalLink, AlertCircle } from "lucide-react";

type CopyState = "idle" | "copied" | "failed";

interface CopyAndGoButtonProps {
  code: string;
  /** Merchant URL opened in a new tab alongside the copy. */
  link: string;
  brand: string;
}

/**
 * Copies the coupon code and opens the merchant site in one click.
 *
 * Copying alone left users to find the merchant themselves, which is the point
 * where they dropped off — the code is worthless without the site it belongs to.
 */
export default function CopyAndGoButton({
  code,
  link,
  brand,
}: CopyAndGoButtonProps) {
  const [state, setState] = useState<CopyState>("idle");
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    },
    [],
  );

  const scheduleReset = () => {
    if (resetTimer.current) clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setState("idle"), 2500);
  };

  const handleClick = (event: React.MouseEvent) => {
    // Cards wrap this button in a link to the deal detail page; this button has
    // its own destination.
    event.preventDefault();
    event.stopPropagation();

    // Both calls must sit in the same synchronous gesture handler. Awaiting the
    // clipboard write first would close the user-activation window and get the
    // tab blocked as a popup; opening the tab first would move focus away and
    // make the write reject with NotAllowedError.
    const write = navigator.clipboard?.writeText(code);
    window.open(link, "_blank", "noopener,noreferrer");

    // Insecure context (no HTTPS) — the tab still opens, but the user has to
    // read the code off the card.
    if (!write) {
      setState("failed");
      scheduleReset();
      return;
    }

    write
      .then(() => setState("copied"))
      .catch(() => setState("failed"))
      .finally(scheduleReset);
  };

  // Kept short so the longest brand name (렌탈카스닷컴) still fits a card-width
  // button on mobile without truncating.
  const label = {
    idle: `복사하고 ${brand} 이동`,
    copied: "복사 완료! 새 탭 확인",
    failed: "코드를 직접 복사해 주세요",
  }[state];

  const tone = {
    idle: "bg-brand-primary hover:bg-brand-primary/90 text-white shadow-sm shadow-brand-primary/20",
    copied: "bg-emerald-500 text-white shadow-sm shadow-emerald-500/20",
    failed: "bg-amber-500 text-white shadow-sm shadow-amber-500/20",
  }[state];

  const Icon = { idle: Copy, copied: Check, failed: AlertCircle }[state];

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={`${brand} 할인코드 ${code} 복사하고 ${brand} 사이트를 새 탭에서 열기`}
      className={`w-full flex items-center justify-center gap-1.5 text-xs sm:text-sm font-bold px-3 py-2.5 rounded-xl transition-all cursor-pointer ${tone}`}
    >
      <Icon className="w-4 h-4 shrink-0" />
      <span className="truncate">{label}</span>
      {state === "idle" && <ExternalLink className="w-3.5 h-3.5 shrink-0" />}
    </button>
  );
}
