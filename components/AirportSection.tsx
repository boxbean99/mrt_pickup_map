import { CITIES, CITY_MAP } from '@/data/cities';
import type { City } from '@/types';
import PickupProductCard from './PickupProductCard';

type Props = {
  fromId: string;
  toId: string;
  onClearFilter: () => void;
};

type AirportGroup = {
  cityId: string;
  cityName: string;
  cityEmoji: string;
  airports: City[];
  airportCodes: string;
};

function getFilterInfo(fromId: string, toId: string) {
  const from = fromId ? CITIES.find((c) => c.id === fromId) : null;
  const to   = toId   ? CITIES.find((c) => c.id === toId)   : null;

  const cityId =
    from?.type === 'airport' ? from.parentCityId ?? null :
    to?.type   === 'airport' ? to.parentCityId   ?? null :
    from?.type === 'city'    ? from.id            :
    to?.type   === 'city'    ? to.id              : null;

  const pickupType: 'pickup' | 'sending' =
    from?.type === 'city' ? 'sending' : 'pickup';

  const fromName = from?.type === 'airport'
    ? `${from.name} (${from.description.split(' · ')[0]})`
    : from?.name ?? null;

  const toName = to?.type === 'airport'
    ? `${to.name} (${to.description.split(' · ')[0]})`
    : to?.name ?? null;

  return { cityId, pickupType, fromName, toName };
}

export default function AirportSection({ fromId, toId, onClearFilter }: Props) {
  const airports = CITIES.filter((c) => c.type === 'airport' && c.parentCityId);

  const seen = new Set<string>();
  const allGroups: AirportGroup[] = [];

  airports.forEach((airport) => {
    const cityId = airport.parentCityId!;
    if (!seen.has(cityId)) {
      seen.add(cityId);
      const city = CITY_MAP[cityId];
      if ((city?.pickupProducts?.length ?? 0) > 0) {
        const cityAirports = airports.filter((a) => a.parentCityId === cityId);
        const codes = cityAirports.map((a) => a.description.split(' · ')[0]).join(' / ');
        allGroups.push({
          cityId,
          cityName: city.name,
          cityEmoji: city.emoji,
          airports: cityAirports,
          airportCodes: codes,
        });
      }
    }
  });

  const isFiltered = Boolean(fromId || toId);
  const { cityId, pickupType, fromName, toName } = getFilterInfo(fromId, toId);

  const displayGroups = cityId
    ? allGroups.filter((g) => g.cityId === cityId)
    : allGroups;

  const totalProducts = displayGroups.reduce(
    (s, g) => s + (CITY_MAP[g.cityId]?.pickupProducts?.length ?? 0), 0
  );

  return (
    <div className="px-6 py-8 max-w-4xl mx-auto">
      {/* 헤더 */}
      <div className="flex items-start justify-between mb-2">
        <div>
          <h2 className="text-xl font-bold text-[#2A2A25]">픽업/샌딩 상품</h2>
          <p className="text-xs text-gray-400 mt-0.5">총 {totalProducts}개 상품</p>
        </div>
        {isFiltered && (
          <button
            onClick={onClearFilter}
            className="text-xs text-[#4A8C52] bg-[#D4EDD4] px-3 py-1 rounded-full font-medium hover:bg-[#C8E6C9] transition-colors mt-1"
          >
            필터 해제 ×
          </button>
        )}
      </div>

      {/* 선택된 구간 표시 */}
      {isFiltered && (fromName || toName) && (
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          <span className="text-xs font-bold bg-[#EDE5CC] text-[#5C5840] px-2.5 py-1 rounded-lg">
            {fromName ?? '출발지'}
          </span>
          <span className="text-gray-400 text-sm">→</span>
          <span className="text-xs font-bold bg-[#D4EDD4] text-[#4A7A50] px-2.5 py-1 rounded-lg">
            {toName ?? '도착지'}
          </span>
          <span className="text-xs text-gray-400 ml-1">
            ({pickupType === 'pickup' ? '공항 픽업' : '공항 샌딩'} 방향)
          </span>
        </div>
      )}

      {!isFiltered && <div className="mb-6" />}

      {/* 검색 결과 없음 */}
      {displayGroups.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-5xl mb-3">✈️</p>
          <p className="text-sm">해당 구간의 픽업/샌딩 상품이 없습니다.</p>
          <p className="text-xs mt-1">다른 출발지 또는 도착지를 선택해 주세요.</p>
        </div>
      )}

      {/* 상품 그룹 목록 */}
      <div className="space-y-10">
        {displayGroups.map((group) => {
          const city = CITY_MAP[group.cityId];
          const products = city?.pickupProducts ?? [];

          // 카드에 전달할 from/to 이름
          const cardFromName = fromName ?? group.airportCodes;
          const cardToName   = toName   ?? `${group.cityName} 호텔/시내`;

          return (
            <div key={group.cityId}>
              <div className="flex items-center gap-3 mb-1 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{group.cityEmoji}</span>
                  <h3 className="text-lg font-bold text-[#2A2A25]">{group.cityName}</h3>
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  {group.airports.map((a) => (
                    <span key={a.id} className="text-[10px] bg-[#EDE5CC] text-[#5C5840] px-2 py-0.5 rounded-full font-bold">
                      {a.description.split(' · ')[0]}
                    </span>
                  ))}
                </div>
              </div>

              <p className="text-xs text-gray-400 mb-4">
                {pickupType === 'pickup'
                  ? `출발: ${group.airportCodes} → 도착: ${group.cityName} 시내/호텔`
                  : `출발: ${group.cityName} 시내/호텔 → 도착: ${group.airportCodes}`}
                {' · '}{products.length}개 상품
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {products.map((p) => (
                  <PickupProductCard
                    key={p.gid}
                    product={p}
                    cityId={group.cityId}
                    fromName={cardFromName}
                    toName={cardToName}
                    pickupType={pickupType}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
