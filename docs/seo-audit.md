# 트래블딜 SEO 점검 리포트

> 대상: https://travel-deal-4u.vercel.app
> 작성일: 2026-07-19
> 요약: **기술적 SEO 마크업은 우수함. 노출이 안 되는 원인은 마크업이 아니라 (1) 도메인 신뢰도, (2) 신규 사이트, (3) 콘텐츠 깊이·권위 부족.**

---

## 1. 현재 상태 진단

### ✅ 이미 잘 되어 있는 것 (기술 SEO)

| 항목 | 상태 | 확인 방법 |
|---|---|---|
| `robots.txt` (Allow + Sitemap + Host) | 정상 | `curl /robots.txt` |
| `sitemap.xml` (홈 + 딜 전체) | 정상 | `curl /sitemap.xml` |
| `<meta robots>` = index, follow | 정상 (noindex 없음) | 페이지 소스 |
| canonical 태그 | 정상 | 페이지 소스 |
| Open Graph / Twitter 카드 | 정상 | 페이지 소스 |
| Google Search Console 인증 | 삽입됨 | `google-site-verification` |
| 구조화 데이터(JSON-LD) | Organization/WebSite/Offer/Breadcrumb | 페이지 소스 |
| 서버 렌더링(prerender) | 정상 (`x-nextjs-prerender: 1`) | 응답 헤더 |
| `lang="ko"`, 한글 메타 | 정상 | 페이지 소스 |

즉 **구글이 크롤링·색인하는 데 필요한 기술 조건은 통과 상태**다. "구글이 못 읽어서" 안 나오는 게 아니다.

### ⚠️ 노출이 안 되는 진짜 원인 (중요도 순)

1. **`*.vercel.app` 공유 서브도메인 — 최대 요인.**
   `vercel.app`은 수백만 프로젝트가 공유하는 도메인이며 Google Public Suffix List에 등록되어 있어, 그 서브도메인은 **도메인 권위(authority)가 사실상 0**이다. 이 상태로는 경쟁 키워드 상위 노출이 거의 불가능하다.

2. **갓 배포된 신규 사이트.** 신규 도메인은 색인에 며칠~몇 주, 순위 형성에 보통 수개월이 걸린다. 현 시점의 "미노출"은 정상 단계다.

3. **콘텐츠 깊이 부족 + 쿠폰 애그리게이터 카테고리.** 구글의 스팸 정책·Helpful Content 시스템은 얇은 제휴/쿠폰 애그리게이터를 특히 낮게 평가한다. 딜별 고유·유용 콘텐츠가 필요하다. (→ 이번 작업에서 개선)

4. **백링크·트래픽 신호 제로.** 외부 링크와 유입이 없어 권위 신호가 축적되지 않았다.

5. **헤드 키워드 경쟁 과열.** "아고다 할인코드", "여행쿠폰"은 공식 사이트·대형 블로그가 장악. 롱테일부터 공략해야 한다.

---

## 2. 이번 커밋에서 코드로 개선한 것

| 개선 | 파일 | 효과 |
|---|---|---|
| 네이버/Bing 소유확인 메타 지원 | `src/lib/site.ts`, `src/app/layout.tsx` | 토큰만 넣으면 네이버 서치어드바이저·Bing 등록 가능 (한국 유입 핵심) |
| 딜별 고유 본문(`about`) 추가 | `src/data/deals.json`, `deals.ts`, `deals/[id]/page.tsx` | 얇은 콘텐츠 문제 완화, 페이지당 고유 텍스트 확보 |
| 딜별 FAQ + FAQPage 스키마 | 동일 | FAQ 리치 결과 노출 기회 + 정보성 롱테일 대응 |
| 홈 ItemList + FAQPage 스키마 | `src/app/page.tsx` | 컬렉션 페이지 인식 + 홈 정보성 쿼리 대응 |
| Offer 스키마 보강 | `deals/[id]/page.tsx` | `priceValidUntil`, `availability` 추가 |
| 깨진 데이터 수정 | `deals.json` (`agoda-2026-rome` link) | URL 중복 붙어 깨진 링크 정상화 |

---

## 3. 사용자가 직접 해야 할 것 (코드로 불가)

### 🥇 1순위 — 인프라

- [ ] **커스텀 도메인 구입 + Vercel 연결.** (예: `.com` / `.co.kr`) — 단일 최고 레버리지.
      연결 후 `src/lib/site.ts`의 `SITE_URL`을 새 도메인으로 교체하고 재배포.
- [ ] **Google Search Console**: 도메인 속성 등록 → 사이트맵 제출 → 각 URL "색인 요청" → "페이지" 리포트에서 색인/제외 상태 확인.
- [ ] **네이버 서치어드바이저** 등록: 소유확인 토큰을 아래 방법으로 주입 후 사이트맵 제출.
- [ ] **Bing 웹마스터** 등록: 마찬가지로 토큰 주입 후 사이트맵 제출.

#### 소유확인 토큰 주입 방법 (2가지 중 택1)

옵션 A — 환경변수 (권장, Vercel 대시보드 → Settings → Environment Variables):
```
NEXT_PUBLIC_NAVER_SITE_VERIFICATION=네이버토큰값
NEXT_PUBLIC_BING_SITE_VERIFICATION=Bing토큰값
```

옵션 B — 코드에 직접 (`src/lib/site.ts`의 기본값 `""`를 교체):
```ts
export const NAVER_SITE_VERIFICATION = process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION ?? "여기에토큰";
```

토큰을 넣으면 `<head>`에 `<meta name="naver-site-verification" ...>` / `<meta name="msvalidate.01" ...>`가 자동 출력된다. 비어 있으면 아예 출력되지 않으므로 안전하다.

### 🥈 2순위 — 콘텐츠 (진짜 순위 작업)

- [ ] **가짜/샘플 코드를 실제 유효한 딜로 교체.** 가짜 코드는 순위 형성 불가 + 스팸 리스크.
- [ ] **롱테일 키워드부터 공략.** 예: "아고다 첫예약 할인코드 2026", "클룩 첫구매 할인 한도".
- [ ] **가이드/블로그성 페이지 추가**로 페이지 수·내부 링크 확대. 예: "아고다 할인 총정리".
- [ ] 딜 콘텐츠 **정기 업데이트**(freshness 신호).

### 🥉 3순위 — 권위 & 시간

- [ ] 티스토리·네이버 블로그/카페·SNS에 공유해 **백링크·유입** 확보.
- [ ] 꾸준한 발행 + 인내 (신규 사이트 순위 형성은 수개월 단위).

---

## 4. 검증 체크리스트 (배포 후)

- [ ] `curl -s https://<도메인>/ | grep naver-site-verification` → 토큰 출력 확인
- [ ] Google Rich Results Test로 딜 페이지 FAQ/Offer, 홈 ItemList/FAQ 인식 확인
      (https://search.google.com/test/rich-results)
- [ ] GSC "페이지" 리포트에서 색인 생성 페이지 수 증가 추적
- [ ] `site:<도메인>` 구글 검색으로 색인 여부 육안 확인
