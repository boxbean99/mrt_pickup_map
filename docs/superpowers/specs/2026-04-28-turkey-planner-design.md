# Turkey Multi-City Travel Planner — Design Spec

**Date:** 2026-04-28  
**Author:** 박수빈 (MRT T&A, 유럽남부팀)  
**Status:** Approved for implementation

---

## Context

마이리얼트립 T&A팀이 터키 도시 상품의 구매 전환을 높이기 위해, 사용자가 직접 멀티시티 여행 일정을 구성하고 MRT 상품을 한 번에 추천받을 수 있는 위젯을 만든다. 1차는 프로토타입(mock 데이터)으로 빠르게 내부 검증하고, 이후 실제 MRT API와 연동한다.

---

## Architecture

**형태:** Next.js 14 (App Router) 독립 앱 → Vercel 배포 → `<iframe>` 삽입  
**지도:** Leaflet.js + OpenStreetMap (무료, API 키 불필요)  
**상태관리:** React useState (단순, 외부 라이브러리 불필요)  
**데이터:** 1차는 정적 JSON mock, 2차에서 MRT API 교체

```
iframe (MRT 사이트)
  └── Next.js App (Vercel)
        ├── /  →  PlannerWidget (4-step wizard)
        │         ├── MapView (Leaflet)
        │         ├── StepPanel (우측 패널)
        │         └── ProductSheet (Step 4 결과)
        └── /api/products  →  mock JSON (→ 추후 MRT API proxy)
```

---

## User Flow (4 Steps)

### Step 1: 도시 선택
- 좌측: Leaflet 지도, 터키 중심, zoom 6
- 5개 도시 핀: 이스탄불 · 카파도키아 · 에페소(이즈미르) · 파묵칼레 · 안탈리아
- 핀 클릭 = 선택/해제, 선택 도시 간 점선 경로 자동 생성
- 우측 패널: 선택된 도시 카드 리스트 + 미선택 도시 추가 버튼
- 최소 1개 선택 시 다음 버튼 활성화

### Step 2: 날짜 설정
- 선택된 각 도시별로 숙박일 수 입력 (±버튼 또는 직접 입력, 기본값 2박)
- "AI 추천" 버튼 클릭 시: 도시 수에 따라 추천 숙박일 자동 배분 (1차는 규칙 기반: 이스탄불 3박, 나머지 2박)
- 전체 여행 기간 합산 표시 (예: "총 7박 8일")

### Step 3: 여행 스타일 선택
- 4가지 옵션 (단일 선택):
  - 🏛️ 관광지 투어 — 주요 명소 중심
  - 🍽️ 미식 탐방 — 현지 음식/레스토랑 경험
  - 🎒 패키지 여행 — 가이드 포함 패키지 선호
  - 🎡 액티비티/박물관 — 체험형 활동 중심
- 카드 형태, 클릭으로 선택

### Step 4: 상품 추천 (결과 화면)
- 선택 도시 × 여행 스타일 기반으로 MRT 상품 카드 표시
- 도시별 섹션으로 그룹핑
- **픽업/샌딩 카테고리 필수 포함**: 각 도시 섹션 최상단에 "공항 픽업" / "도시 간 이동" 상품 고정 노출
- 상품 카드: 썸네일 · 상품명 · 가격 · 별점 · "마이리얼트립에서 보기" 링크
- 1차: mock JSON으로 구성, 상품 링크는 실제 MRT URL 연결

---

## Data Model

```ts
// 도시
type City = {
  id: string;           // 'istanbul' | 'cappadocia' | 'ephesus' | 'pamukkale' | 'antalya'
  name: string;         // '이스탄불'
  lat: number;
  lng: number;
  emoji: string;
};

// 플래너 상태
type PlannerState = {
  selectedCities: string[];      // city id 배열, 선택 순서
  nights: Record<string, number>; // { istanbul: 3, cappadocia: 2 }
  style: 'sightseeing' | 'food' | 'package' | 'activity' | null;
};

// 상품 (mock → 추후 MRT API)
type Product = {
  id: string;
  cityId: string;
  category: 'pickup' | 'tour' | 'activity' | 'package' | 'food';
  title: string;
  price: number;          // KRW
  rating: number;
  reviewCount: number;
  imageUrl: string;
  mrtUrl: string;         // 실제 MRT 상품 URL
};
```

---

## Component Structure

```
src/
├── app/
│   ├── page.tsx              # PlannerWidget 루트
│   └── api/products/route.ts # mock 상품 API
├── components/
│   ├── PlannerWidget.tsx     # 전체 wizard 상태 관리
│   ├── MapView.tsx           # Leaflet 지도
│   ├── StepPanel.tsx         # 우측 패널 (step indicator + content)
│   ├── steps/
│   │   ├── Step1Cities.tsx
│   │   ├── Step2Dates.tsx
│   │   ├── Step3Style.tsx
│   │   └── Step4Products.tsx
│   └── ProductCard.tsx
├── data/
│   └── mock-products.json    # 1차 mock 데이터
└── lib/
    └── cities.ts             # 도시 좌표/메타 데이터
```

---

## iframe 삽입 코드 (최종 산출물)

```html
<iframe
  src="https://turkey-planner.vercel.app"
  width="100%"
  height="560"
  frameborder="0"
  style="border-radius:12px;"
></iframe>
```

---

## Prototype → Production 전환 계획

| 항목 | 프로토타입 (1차) | 실제 서비스 (2차) |
|------|----------------|----------------|
| 상품 데이터 | `mock-products.json` | MRT 상품 API |
| 날짜 추천 | 규칙 기반 | 실제 재고/시즌 반영 |
| 링크 | 실제 MRT URL (하드코딩) | 동적 상품 ID 기반 |
| 배포 | Vercel (free tier) | MRT 인프라 or Vercel Pro |

---

## Verification

1. `npm run dev` → `localhost:3000` 에서 4단계 플로우 전체 동작 확인
2. 도시 선택 → 경로 그려지는지 확인
3. Step 4에서 픽업/샌딩 카테고리 최상단 노출 확인
4. `<iframe>` 태그로 별도 HTML 파일에 삽입 후 크기/스크롤 확인
5. Vercel 배포 후 외부 접근 가능 URL 확인
