"use client";

import React, { useState } from "react";
import { Copy, Check } from "lucide-react";

interface CopyCodeButtonProps {
  code: string;
}

export default function CopyCodeButton({ code }: CopyCodeButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
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
  );
}
