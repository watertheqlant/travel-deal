"use client";

import { useEffect, useRef, useState } from "react";

/**
 * 곰곰쿠폰 대표 배너 (반응형)
 * - 1920x720 디자인을 컨테이너 폭에 맞춰 자동 스케일링합니다.
 * - 폰트(Jua, Gothic A1)는 next/font로 로드되어 CSS 변수
 *   (--font-jua, --font-gothic-a1)로 주입됩니다. layout.tsx 참고.
 */
const DESIGN_W = 1920;
const DESIGN_H = 720;

const JUA = "var(--font-jua), sans-serif";
const GOTHIC = "var(--font-gothic-a1), sans-serif";

export default function GomgomBanner() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setScale(entry.contentRect.width / DESIGN_W);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={wrapRef}
      style={{
        width: "100%",
        aspectRatio: `${DESIGN_W} / ${DESIGN_H}`,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <style>{`
        @keyframes ggFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        @keyframes ggDrift { 0%{transform:translateX(0)} 100%{transform:translateX(-60px)} }
      `}</style>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: DESIGN_W,
          height: DESIGN_H,
          transformOrigin: "top left",
          transform: `scale(${scale})`,
          background:
            "linear-gradient(160deg,#dff2fb 0%,#c3e6f7 48%,#a9d9f2 100%)",
          fontFamily: GOTHIC,
          overflow: "hidden",
        }}
      >
        {/* clouds */}
        <div style={{ position: "absolute", top: 120, left: -80, width: 360, height: 120, background: "rgba(255,255,255,0.55)", borderRadius: 120, filter: "blur(2px)", animation: "ggDrift 18s linear infinite alternate" }} />
        <div style={{ position: "absolute", top: 250, right: 120, width: 280, height: 96, background: "rgba(255,255,255,0.45)", borderRadius: 96, filter: "blur(2px)", animation: "ggDrift 24s linear infinite alternate" }} />
        <div style={{ position: "absolute", top: 60, right: 480, width: 200, height: 70, background: "rgba(255,255,255,0.4)", borderRadius: 70, filter: "blur(2px)" }} />

        {/* sun */}
        <div style={{ position: "absolute", top: 80, right: 260, width: 130, height: 130, borderRadius: "50%", background: "radial-gradient(circle at 40% 40%,#fff4cf,#ffe08a)", boxShadow: "0 0 60px rgba(255,214,110,0.55)" }} />

        {/* content */}
        <div style={{ position: "absolute", top: 0, left: 130, height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", gap: 26, maxWidth: 900, zIndex: 3 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 52, height: 52, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 14px rgba(46,120,160,0.2)" }}>
              <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#eaf6fd", border: "3px solid #7fc4e8" }} />
            </div>
            <span style={{ fontFamily: JUA, fontSize: 34, color: "#1e5f80", letterSpacing: "-0.5px" }}>곰곰쿠폰</span>
          </div>

          <div style={{ display: "inline-flex", alignSelf: "flex-start", alignItems: "center", gap: 8, background: "#fff", padding: "9px 18px", borderRadius: 100, boxShadow: "0 6px 18px rgba(46,120,160,0.14)" }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#ff8a5c" }} />
            <span style={{ fontSize: 20, fontWeight: 700, color: "#ff7a45", letterSpacing: "-0.3px" }}>여행사 쿠폰 모아보기</span>
          </div>

          <h1 style={{ margin: 0, fontFamily: JUA, fontSize: 78, lineHeight: 1.18, color: "#12455f", letterSpacing: "-1.5px" }}>
            여행 가기 전에<br />쿠폰 검색하고 <span style={{ color: "#ff7a45" }}>할인</span> 받으세요!
          </h1>

          <p style={{ margin: 0, fontSize: 30, fontWeight: 500, color: "#3d7591", lineHeight: 1.5, letterSpacing: "-0.5px" }}>
            흩어진 여행사 쿠폰, 한 곳에 다 모았어요.<br />직접 찾느라 고생하지 마세요.
          </p>
        </div>

        {/* polar bear */}
        <div style={{ position: "absolute", right: 210, bottom: 40, width: 460, height: 560, animation: "ggFloat 6s ease-in-out infinite", zIndex: 2 }}>
          <div style={{ position: "relative", width: "100%", height: "100%" }}>
            <div style={{ position: "absolute", bottom: -18, left: "50%", transform: "translateX(-50%)", width: 320, height: 44, background: "rgba(46,120,160,0.18)", borderRadius: "50%", filter: "blur(6px)" }} />

            {/* suitcase */}
            <div style={{ position: "absolute", left: -10, bottom: 0, width: 150, height: 180, background: "linear-gradient(150deg,#ff9a6a,#ff7a45)", borderRadius: 22, boxShadow: "inset 0 0 0 6px rgba(255,255,255,0.25),0 10px 22px rgba(46,120,160,0.22)" }}>
              <div style={{ position: "absolute", top: 34, left: 12, right: 12, height: 6, background: "rgba(255,255,255,0.35)", borderRadius: 6 }} />
              <div style={{ position: "absolute", top: 54, left: 12, right: 12, height: 6, background: "rgba(255,255,255,0.35)", borderRadius: 6 }} />
              <div style={{ position: "absolute", top: -20, left: "50%", transform: "translateX(-50%)", width: 70, height: 40, border: "8px solid #e56a38", borderBottom: "none", borderRadius: "40px 40px 0 0" }} />
              <div style={{ position: "absolute", bottom: 22, left: "50%", transform: "translateX(-50%)", width: 46, height: 46, background: "#fff", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: JUA, color: "#ff7a45", fontSize: 26 }}>%</div>
            </div>

            {/* body */}
            <div style={{ position: "absolute", left: 118, bottom: 6, width: 250, height: 300, background: "linear-gradient(180deg,#fff,#eaf5fc)", borderRadius: "130px 130px 110px 110px", boxShadow: "inset -14px -10px 26px rgba(180,214,232,0.5)" }} />
            <div style={{ position: "absolute", left: 168, bottom: 40, width: 150, height: 190, background: "#fbfeff", borderRadius: 80 }} />

            {/* arms */}
            <div style={{ position: "absolute", left: 92, bottom: 210, width: 74, height: 120, background: "linear-gradient(180deg,#fff,#e6f2fa)", borderRadius: 40, transform: "rotate(28deg)", boxShadow: "inset -6px -4px 12px rgba(180,214,232,0.5)" }} />
            <div style={{ position: "absolute", left: 300, bottom: 120, width: 74, height: 120, background: "linear-gradient(180deg,#fff,#e6f2fa)", borderRadius: 40, transform: "rotate(-24deg)", boxShadow: "inset 6px -4px 12px rgba(180,214,232,0.5)" }} />

            {/* coupon */}
            <div style={{ position: "absolute", left: 320, bottom: 190, width: 120, height: 78, background: "#fff", borderRadius: 12, boxShadow: "0 8px 18px rgba(46,120,160,0.24)", transform: "rotate(-12deg)", borderLeft: "5px dotted #ff8a5c", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: "#9fb3bd" }}>COUPON</span>
              <span style={{ fontFamily: JUA, fontSize: 26, color: "#ff7a45", lineHeight: 1 }}>50%</span>
            </div>

            {/* head */}
            <div style={{ position: "absolute", left: 128, bottom: 250, width: 230, height: 210, background: "linear-gradient(180deg,#fff,#edf6fc)", borderRadius: "50%", boxShadow: "inset -12px -8px 24px rgba(180,214,232,0.5)" }} />
            <div style={{ position: "absolute", left: 138, bottom: 420, width: 62, height: 62, background: "#fff", borderRadius: "50%", boxShadow: "inset -4px -4px 10px rgba(180,214,232,0.5)" }}><div style={{ position: "absolute", inset: 16, background: "#ffe3d3", borderRadius: "50%" }} /></div>
            <div style={{ position: "absolute", left: 288, bottom: 420, width: 62, height: 62, background: "#fff", borderRadius: "50%", boxShadow: "inset -4px -4px 10px rgba(180,214,232,0.5)" }}><div style={{ position: "absolute", inset: 16, background: "#ffe3d3", borderRadius: "50%" }} /></div>

            {/* hat */}
            <div style={{ position: "absolute", left: 120, bottom: 408, width: 246, height: 42, background: "#2e93c2", borderRadius: "50%" }} />
            <div style={{ position: "absolute", left: 168, bottom: 424, width: 150, height: 84, background: "linear-gradient(180deg,#3aa6d6,#2e93c2)", borderRadius: "80px 80px 20px 20px" }} />
            <div style={{ position: "absolute", left: 168, bottom: 430, width: 150, height: 22, background: "#ff7a45", borderRadius: 12 }} />

            {/* snout */}
            <div style={{ position: "absolute", left: 188, bottom: 268, width: 110, height: 78, background: "#fbfeff", borderRadius: 55 }} />
            <div style={{ position: "absolute", left: 228, bottom: 320, width: 30, height: 22, background: "#33424b", borderRadius: "50%" }} />
            <div style={{ position: "absolute", left: 234, bottom: 292, width: 18, height: 18, border: "4px solid #33424b", borderTop: "none", borderLeft: "none", borderRadius: "0 0 12px 0", transform: "rotate(45deg)" }} />

            {/* eyes */}
            <div style={{ position: "absolute", left: 196, bottom: 352, width: 24, height: 24, background: "#33424b", borderRadius: "50%" }}><div style={{ position: "absolute", top: 4, left: 4, width: 8, height: 8, background: "#fff", borderRadius: "50%" }} /></div>
            <div style={{ position: "absolute", left: 268, bottom: 352, width: 24, height: 24, background: "#33424b", borderRadius: "50%" }}><div style={{ position: "absolute", top: 4, left: 4, width: 8, height: 8, background: "#fff", borderRadius: "50%" }} /></div>
            <div style={{ position: "absolute", left: 176, bottom: 328, width: 26, height: 16, background: "#ffd0bb", borderRadius: "50%", opacity: 0.8 }} />
            <div style={{ position: "absolute", left: 286, bottom: 328, width: 26, height: 16, background: "#ffd0bb", borderRadius: "50%", opacity: 0.8 }} />

            {/* feet */}
            <div style={{ position: "absolute", left: 150, bottom: -6, width: 84, height: 46, background: "#f2fafe", borderRadius: 44, boxShadow: "inset -4px -4px 10px rgba(180,214,232,0.5)" }} />
            <div style={{ position: "absolute", left: 252, bottom: -6, width: 84, height: 46, background: "#f2fafe", borderRadius: 44, boxShadow: "inset -4px -4px 10px rgba(180,214,232,0.5)" }} />
          </div>
        </div>

        {/* coupon chips */}
        <div style={{ position: "absolute", right: 620, top: 150, zIndex: 4, animation: "ggFloat 5s ease-in-out infinite" }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: "14px 22px", boxShadow: "0 10px 26px rgba(46,120,160,0.22)", borderLeft: "6px dotted #ff8a5c", transform: "rotate(-6deg)" }}>
            <div style={{ fontSize: 15, color: "#99adb8", fontWeight: 700 }}>항공권</div>
            <div style={{ fontFamily: JUA, fontSize: 30, color: "#ff7a45" }}>-30%</div>
          </div>
        </div>
        <div style={{ position: "absolute", right: 90, top: 90, zIndex: 4, animation: "ggFloat 6.5s ease-in-out infinite" }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: "14px 22px", boxShadow: "0 10px 26px rgba(46,120,160,0.22)", borderLeft: "6px dotted #4fb0d9", transform: "rotate(5deg)" }}>
            <div style={{ fontSize: 15, color: "#99adb8", fontWeight: 700 }}>호텔·숙소</div>
            <div style={{ fontFamily: JUA, fontSize: 30, color: "#2e93c2" }}>1+1</div>
          </div>
        </div>
        <div style={{ position: "absolute", right: 700, bottom: 120, zIndex: 4, animation: "ggFloat 5.8s ease-in-out infinite" }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: "12px 20px", boxShadow: "0 10px 26px rgba(46,120,160,0.22)", borderLeft: "6px dotted #ffbc4a", transform: "rotate(-3deg)" }}>
            <div style={{ fontSize: 15, color: "#99adb8", fontWeight: 700 }}>투어·티켓</div>
            <div style={{ fontFamily: JUA, fontSize: 30, color: "#f0a52e" }}>최대 50%</div>
          </div>
        </div>

        {/* snow ground */}
        <div style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: 120, background: "#fff", borderRadius: "50% 50% 0 0 / 100% 100% 0 0", opacity: 0.85 }} />
      </div>
    </div>
  );
}
