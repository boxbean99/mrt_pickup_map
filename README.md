# 터키 픽업/샌딩 플래너 위젯

MRT T&A 유럽남부팀 — 터키 공항 픽업/샌딩 상품을 탐색하는 임베드용 위젯.  
MRT 프로모션 페이지에 `<iframe>`으로 삽입하는 것을 목적으로 개발 중.

**배포 URL**: https://pickupplanner.vercel.app  
**GitHub**: https://github.com/boxbean99/mrt_pickup_map  
**담당**: 박수빈 (soobin.park@myrealtrip.com)

---

## 현재 구현 상태

### 완료
- [x] 클룩 스타일 단일 페이지 레이아웃 (헤로 배너 + 검색 + 가치 제안 + 지도 + 상품 목록)
- [x] **출발지 / 도착지** 선택형 검색 (공항 ↔ 도시, 방향 자동 추론)
- [x] 공항 → 도시 = 픽업, 도시 → 공항 = 샌딩 자동 전환
- [x] 터키 지도 (react-simple-maps) — 마커 클릭 시 출발지로 연동
- [x] 실제 MRT 픽업/샌딩 상품 GID 연동 (총 34개)
  - 이스탄불 17개 (IST / SAW)
  - 카파도키아 15개 (ASR / NAV)
  - 안탈리아 1개 (AYT)
  - 페티예 1개 (DLM)
- [x] 상품 클릭 시 `experiences.myrealtrip.com/products/{gid}` 이동
- [x] 크림 + 연두 + 단색 디자인 시스템
- [x] GitHub → Vercel 자동 배포 연동

### 미완료 (다음 작업)
- [ ] 실제 상품 썸네일 이미지 연동 (현재 도시별 Unsplash 플레이스홀더 사용)
- [ ] 상품별 가격 / 평점 / 리뷰수 표시 (MRT 내부 API 또는 BQ 연동 필요)
- [ ] 에페소(ADB), 앙카라(ESB) 상품 추가
- [ ] 인터시티 이동 상품 (이스탄불→카파도키아 야간버스 등) 연동
- [ ] MRT 프로모션 페이지 iframe 실삽입 (개발팀 CSP 허용 요청 필요)

---

## 기술 스택

| 항목 | 내용 |
|------|------|
| 프레임워크 | Next.js 14.2 (App Router) |
| 언어 | TypeScript |
| 스타일 | Tailwind CSS |
| 지도 | react-simple-maps + world-50m TopoJSON |
| 배포 | Vercel (GitHub 자동 배포) |
| 로컬 실행 | `npm run dev` → localhost:3000 |

---

## 파일 구조

```
turkey-planner/
├── app/
│   ├── page.tsx                  # 루트 페이지 (PickupWidget 마운트)
│   └── api/products/route.ts     # API 라우트 (현재 미사용)
├── components/
│   ├── PickupWidget.tsx          # 최상위 컨테이너, 상태(fromId/toId) 관리
│   ├── HeroBanner.tsx            # 상단 헤로 배너
│   ├── SearchWidget.tsx          # 출발지/도착지/탑승객 검색 폼
│   ├── ValueProps.tsx            # 3단 가치 제안 섹션
│   ├── MapView.tsx               # 터키 지도 (공항/도시 마커)
│   ├── AirportSection.tsx        # 공항별 상품 목록, 필터링 로직
│   └── PickupProductCard.tsx     # 개별 상품 카드
├── data/
│   └── cities.ts                 # 도시/공항 데이터 + 실제 GID pickupProducts
├── types/
│   └── index.ts                  # PickupProduct, City 등 타입 정의
└── public/
    └── world-50m.json            # 지도 TopoJSON 데이터
```

> `PlannerWidget`, `StepPanel`, `steps/` 폴더는 이전 버전(지도+4단계 위저드) 잔재로,
> 현재 사용하지 않음. 추후 정리 예정.

---

## 데이터 구조

### 상품 데이터 위치
`data/cities.ts` 내 각 도시 객체의 `pickupProducts` 배열.

```ts
{
  id: 'istanbul',
  name: '이스탄불',
  type: 'city',
  pickupProducts: [
    {
      gid: '3860075',          // MRT 상품 GID
      title: '[픽업샌딩] 이스탄불 공항-호텔 전용차량',
      partner: '레츠고터키',    // 파트너명
      status: 'onsale',        // 'onsale' | 'ready'
    },
    // ...
  ]
}
```

### 공항-도시 연결
`parentCityId`로 공항과 도시를 연결.

| 공항 ID | IATA | 연결 도시 |
|---------|------|-----------|
| airport-ist | IST | istanbul |
| airport-saw | SAW | istanbul |
| airport-ayt | AYT | antalya |
| airport-asr | ASR | cappadocia |
| airport-nev | NAV | cappadocia |
| airport-dlm | DLM | fethiye |
| airport-adb | ADB | ephesus |
| airport-esb | ESB | (미연결) |

---

## 검색 로직

출발지(from) / 도착지(to) 타입에 따라 방향 자동 추론:

| 출발지 타입 | 도착지 타입 | 표시 상품 | 방향 |
|-------------|-------------|-----------|------|
| 공항 | 도시 | 공항 parentCity 상품 | 픽업 |
| 도시 | 공항 | 도시 상품 | 샌딩 |
| 공항 | 미선택 | 공항 parentCity 상품 | 픽업 |
| 미선택 | 미선택 | 전체 도시 상품 | — |

---

## 로컬 실행

```bash
cd turkey-planner
npm install
npm run dev
# → http://localhost:3000
```

---

## iframe 삽입 (프로모션 페이지용)

```html
<iframe
  src="https://pickupplanner.vercel.app"
  width="100%"
  height="700"
  frameborder="0"
  style="border-radius:12px; max-width:960px;"
></iframe>
```

> MRT 프로모션 페이지 삽입 시 개발팀에 `pickupplanner.vercel.app` CSP 화이트리스트 추가 요청 필요.

---

## 상품 추가 방법

`data/cities.ts`에서 해당 도시의 `pickupProducts` 배열에 항목 추가:

```ts
{ gid: 'XXXXXX', title: '상품명', partner: '파트너명', status: 'onsale' }
```

GID는 `experiences.myrealtrip.com/products/{gid}` 에서 확인.
