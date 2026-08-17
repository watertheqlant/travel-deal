# gomgomcp.com 재색인 절차 안내 (Google Search Console)

이 문서는 **배포 이후 사용자가 직접 수행할 GSC 작업**을 화면 순서대로 정리한 것입니다.
코드 작업(canonical 정정, 308 리다이렉트, 가이드 페이지)은 이미 완료되었습니다.

관련 스펙: `.omc/specs/deep-interview-gomgomcp-gsc-index-recovery.md` (AC7~AC10)

---

## 0. 먼저 이해할 것 — 왜 노출이 0이었나

GSC에 뜬 **"적절한 표준 태그가 포함된 대체 페이지"** 는 구글의 오류가 아니라 정상 처리 결과였습니다.

gomgomcp.com의 모든 페이지가 이렇게 응답하고 있었습니다:

```html
<link rel="canonical" href="https://travel-deal-4u.vercel.app"/>
```

즉 "이 페이지의 정본은 vercel 도메인입니다"라고 구글에 알린 것입니다. 구글은 그 지시를 따라 gomgomcp.com URL을 색인에서 제외했습니다. 원인은 `src/lib/site.ts`의 `SITE_URL` 상수 하나였고, 지금은 수정되었습니다.

**따라서 아래 절차는 "구글에게 신호가 바뀌었으니 다시 읽어달라"고 요청하는 과정입니다.**

---

## 1. 배포 (선행 조건)

GSC 작업 전에 반드시 배포가 끝나 있어야 합니다. 배포 전에 색인 요청을 넣으면 구글이 옛 canonical을 다시 읽고 같은 결론을 내립니다.

배포 후 아래 명령으로 실제 반영을 확인하세요. **4개 모두 통과해야 다음 단계로 넘어갑니다.**

```bash
# 1) canonical이 gomgomcp.com을 가리키는가
curl -sS https://gomgomcp.com/ | grep -o '<link rel="canonical"[^>]*>'
# 기대: <link rel="canonical" href="https://gomgomcp.com"/>

# 2) robots.txt가 신규 도메인 기준인가
curl -sS https://gomgomcp.com/robots.txt
# 기대: Host / Sitemap 모두 https://gomgomcp.com

# 3) sitemap의 모든 URL이 신규 도메인인가 (16개)
curl -sS https://gomgomcp.com/sitemap.xml | grep -c 'gomgomcp.com'
# 기대: 16

# 4) 구 도메인이 경로를 보존해 리다이렉트되는가
curl -sSI https://travel-deal-4u.vercel.app/deals/agoda-2026 | grep -iE '^HTTP|^location'
# 기대: HTTP/2 308  /  location: https://gomgomcp.com/deals/agoda-2026
```

> **308은 정상입니다.** Next.js는 301 대신 308을 사용합니다(요청 메서드 보존 목적). 구글은 308을 301과 동일하게 취급하므로 링크 평가 승계에 문제가 없습니다.

---

## 2. sitemap 재제출 (AC7)

1. [Google Search Console](https://search.google.com/search-console) 접속
2. 좌측 상단 속성 선택기에서 **gomgomcp.com** 속성 선택
3. 좌측 메뉴 → **색인 생성** → **Sitemaps**
4. 기존에 제출된 sitemap이 있다면 그대로 두어도 됩니다 (URL이 같으므로 내용만 갱신됨)
5. "새 사이트맵 추가" 입력란에 `sitemap.xml` 입력 → **제출**
6. 몇 분 뒤 새로고침하여 확인:
   - 상태: **성공**
   - 발견된 페이지: **16**

발견된 페이지가 16이 아니면 배포가 아직 반영되지 않았을 수 있습니다. 1번의 검증 명령을 다시 돌려보세요.

---

## 3. URL 검사로 표준 URL 확인 (AC8 — 가장 중요)

이 단계가 **주원인이 실제로 해소됐는지 확인하는 직접 증거**입니다.

1. GSC 상단 중앙의 검색창(URL 검사)에 다음을 입력하고 Enter:
   ```
   https://gomgomcp.com/
   ```
2. 결과가 뜨면 **"페이지 색인 생성"** 섹션을 펼칩니다
3. 두 항목을 확인합니다:

| 항목 | 기대값 |
|------|--------|
| 사용자가 선언한 표준 URL | `https://gomgomcp.com/` |
| Google이 선택한 표준 URL | `https://gomgomcp.com/` |

> ⚠️ 이 시점에 캐시된 옛 정보가 보일 수 있습니다. 그럴 땐 **"실제 URL 테스트"** 버튼을 눌러 구글이 지금 이 순간 페이지를 가져오게 하세요. 실제 URL 테스트 결과의 canonical이 gomgomcp.com이면 배포는 정상입니다.
>
> "Google이 선택한 표준 URL"이 색인 데이터에 반영되기까지는 재크롤이 필요하므로 며칠 걸릴 수 있습니다. **실제 URL 테스트가 통과하면 이 단계는 성공으로 간주**하고 다음으로 넘어가세요.

---

## 4. 색인 생성 요청 (AC9)

3번과 같은 URL 검사 화면에서 **"색인 생성 요청"** 버튼을 누릅니다.

아래 3개 URL에 대해 각각 반복하세요:

| URL | 목적 |
|-----|------|
| `https://gomgomcp.com/` | 홈 — 사이트 전체 재크롤의 진입점 |
| `https://gomgomcp.com/deals/agoda-2026` | 딜 페이지 대표 |
| `https://gomgomcp.com/guides/agoda` | 신규 가이드 페이지 대표 |

> 색인 생성 요청은 하루 할당량이 있습니다. 전체 16개를 다 넣을 필요는 없습니다. 대표 페이지만 요청하면 내부 링크를 따라 나머지가 크롤됩니다. 홈 → 가이드 허브(`/guides`) → 각 가이드 → 각 딜로 이어지는 링크 경로가 이미 구성돼 있습니다.

---

## 5. 구 도메인 속성 처리 (AC10)

GSC에 `travel-deal-4u.vercel.app` 속성도 등록돼 있다면 아래를 시도합니다.

1. 속성 선택기에서 **travel-deal-4u.vercel.app** 선택
2. 좌측 메뉴 → **설정** → **주소 변경**
3. 새 사이트로 **gomgomcp.com** 선택 → 검증 실행

**주소 변경 도구가 동작하지 않는 경우** (vercel.app 하위 도메인은 지원되지 않을 수 있습니다):

그대로 두어도 무방합니다. 308 리다이렉트만으로도 구글은 도메인 이전을 인식하고 신호를 이전합니다. 주소 변경 도구는 이 과정을 **가속**할 뿐 필수는 아닙니다. 이 경우 아래 사실만 기록해 두세요:

> 주소 변경 도구 미지원 — 308 리다이렉트로 신호 이전 처리. 구 속성은 모니터링 용도로 유지.

⚠️ **구 도메인 속성을 삭제하지 마세요.** 리다이렉트가 제대로 도는지, 구 도메인의 색인이 줄어드는지 관찰하는 데 필요합니다.

---

## 6. 이후 무엇을 언제 확인하나

| 시점 | 확인할 것 | 어디서 |
|------|-----------|--------|
| 즉시 | 1번의 curl 4종 통과 | 터미널 |
| 즉시 | sitemap 상태 성공 / 16 URL | 색인 생성 → Sitemaps |
| 1~3일 | URL 검사에서 "Google이 선택한 표준 URL"이 gomgomcp.com으로 갱신 | URL 검사 |
| 3~14일 | 페이지 색인 리포트에서 "대체 페이지" 항목 감소, "색인 생성됨" 증가 | 색인 생성 → 페이지 |
| 2~4주 | 실적 리포트에 노출수(impressions) 발생 | 실적 |

**이번 작업의 완료 기준은 즉시 확인 항목까지입니다.** 그 아래 시점 항목은 구글 측 처리 시간에 달려 있어 코드로 보장할 수 없습니다.

---

## 7. 문제가 계속될 때 확인할 것

**"대체 페이지"가 2주 넘게 유지되는 경우**
- URL 검사 → 실제 URL 테스트 → "크롤된 페이지 보기" → HTML에서 canonical을 직접 확인하세요. 여기에 vercel 도메인이 남아 있으면 배포가 반영되지 않은 것입니다.
- Vercel 대시보드에서 최신 배포가 Production으로 승격됐는지 확인하세요.

**"발견됨 – 현재 색인되지 않음"이 유지되는 경우**
- 이는 크롤 우선순위 문제입니다. 신규 도메인에서는 흔하며 시간이 해결하는 경우가 많습니다.
- 이번에 추가한 가이드 페이지 5개가 이 신호를 개선하는 목적입니다. 추가 콘텐츠가 필요하다면 나머지 브랜드(KKday, 대한항공, 렌탈카스닷컴) 가이드를 확장할 수 있습니다.

**리다이렉트가 안 도는 경우**
- Vercel 프로젝트 설정에서 `travel-deal-4u.vercel.app`이 여전히 Production 도메인으로 직접 서빙되고 있는지 확인하세요.
- `next.config.ts`의 `LEGACY_SITE_HOST` 값이 실제 Vercel 도메인과 정확히 일치해야 합니다 (`src/lib/site.ts`에 정의).

---

## 부록: 알려진 미해결 항목 (이번 범위 밖)

사용자 요청으로 **연기된** 쿠폰 데이터 정비 항목입니다. 검색 품질에 영향을 주므로 별도 세션에서 처리하는 것을 권합니다.

- `koreanair-card` — 만료일 `2026-07-31`. **이미 만료된 쿠폰이 노출 중**
- `myrealtrip-stay` — 만료일 `2026-08-31`. 임박
- `skyscanner-flight` — URL은 `skyscanner`인데 실제 내용은 트립닷컴. **URL과 콘텐츠 불일치**
- 만료 쿠폰 자동 숨김/표시 로직 부재
- `public/hero-banner.png` 793KB — LCP 영향
