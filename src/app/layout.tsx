import type { Metadata } from "next";
import { Outfit, Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const notoSansKR = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: "트래블딜 (Travel Deal) | 실시간 여행 할인 & 쿠폰 혜택",
  description: "아고다, 부킹닷컴, Klook, 마이리얼트립 등 인기 여행 플랫폼의 실시간 할인 쿠폰 번호와 특가 혜택 정보를 한눈에 모아보세요. 복사만 하면 바로 할인이 적용됩니다!",
  keywords: ["여행쿠폰", "여행할인", "아고다할인코드", "Klook할인쿠폰", "특가항공권", "호텔할인코드", "트래블딜"],
};

export default function RootLayout({
  children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
  return (
    <html
      lang="ko"
      className={`${outfit.variable} ${notoSansKR.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans text-slate-800 bg-[#f8fafc]">
        {children}
      </body>
    </html>
  );
}
