import React from "react";
import Link from "next/link";
import { Compass, Mail, Shield, FileText } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-slate-900 text-slate-400 py-12 mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Info */}
          <div className="flex flex-col gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-white border border-brand-secondary p-1.5 rounded-full text-brand-secondary">
                <Compass className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold tracking-tight text-white">
                곰쿠폰
              </span>
            </Link>
            <p className="text-sm text-slate-500 max-w-sm">
              전 세계 항공권, 숙소, 투어/액티비티 플랫폼의 할인 정보를 실시간으로 수집하여 제공합니다. 번거로운 검색 없이 간편하게 쿠폰 코드를 복사해 사용하세요.
            </p>
          </div>

          {/* Contact & Policy Links */}
          <div className="flex flex-col gap-2">
            <h4 className="text-white text-sm font-semibold mb-2">고객 센터 및 약관</h4>
            <div className="flex flex-col gap-2 text-sm text-slate-500">
              <a href="mailto:support@traveldeal.mock" className="flex items-center gap-1.5 hover:text-white transition-colors">
                <Mail className="w-4 h-4" />
                support@traveldeal.mock
              </a>
              <Link href="#" className="flex items-center gap-1.5 hover:text-white transition-colors">
                <Shield className="w-4 h-4" />
                개인정보처리방침
              </Link>
              <Link href="#" className="flex items-center gap-1.5 hover:text-white transition-colors">
                <FileText className="w-4 h-4" />
                이용약관
              </Link>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="flex flex-col gap-2">
            <h4 className="text-white text-sm font-semibold mb-2">면책 공고</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              본 사이트에서 제공되는 쿠폰 및 할인 정보는 각 플랫폼사(아고다, 부킹닷컴, 클룩 등)의 제휴 조건에 따라 예고 없이 변경되거나 중단될 수 있습니다. 곰쿠폰은 링크 내 거래에 따른 보증 책임을 지지 않습니다.
            </p>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 gap-4">
          <p>© {new Date().getFullYear()} 곰쿠폰. All rights reserved.</p>
          <p>Designed with ❤️ for travelers.</p>
        </div>
      </div>
    </footer>
  );
}
