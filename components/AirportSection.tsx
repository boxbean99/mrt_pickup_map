import { CITIES, CITY_MAP } from '@/data/cities';
import type { City } from '@/types';
import PickupProductCard from './PickupProductCard';

type Props = {
  filteredAirportId: string;
  pickupType: 'pickup' | 'sending';
  onClearFilter: () => void;
};

type AirportGroup = {
  cityId: string;
  cityName: string;
  cityEmoji: string;
  airports: City[];
  airportCodes: string;
};

export default function AirportSection({ filteredAirportId, pickupType, onClearFilter }: Props) {
  const airports = CITIES.filter((c) => c.type === 'airport' && c.parentCityId);

  const seen = new Set<string>();
  const groups: AirportGroup[] = [];

  airports.forEach((airport) => {
    const cityId = airport.parentCityId!;
    if (!seen.has(cityId)) {
      seen.add(cityId);
      const city = CITY_MAP[cityId];
      const cityAirports = airports.filter((a) => a.parentCityId === cityId);
      const pickupProducts = city?.pickupProducts ?? [];
      if (pickupProducts.length > 0) {
        const codes = cityAirports.map((a) => a.description.split(' · ')[0]).join(' / ');
        groups.push({
          cityId,
          cityName: city?.name ?? cityId,
          cityEmoji: city?.emoji ?? '✈️',
          airports: cityAirports,
          airportCodes: codes,
        });
      }
    }
  });

  const filteredAirport = filteredAirportId
    ? CITIES.find((c) => c.id === filteredAirportId)
    : null;

  const displayGroups = filteredAirport?.parentCityId
    ? groups.filter((g) => g.cityId === filteredAirport.parentCityId)
    : groups;

  return (
    <div className="px-6 py-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-[#2A2A25]">공항별 픽업/샌딩 상품</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            총 {displayGroups.reduce((s, g) => s + (CITY_MAP[g.cityId]?.pickupProducts?.length ?? 0), 0)}개 상품
          </p>
        </div>
        {filteredAirportId && (
          <button
            onClick={onClearFilter}
            className="text-xs text-[#4A8C52] bg-[#D4EDD4] px-3 py-1 rounded-full font-medium hover:bg-[#C8E6C9] transition-colors"
          >
            필터 해제 ×
          </button>
        )}
      </div>

      {displayGroups.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-5xl mb-3">✈️</p>
          <p className="text-sm">해당 공항의 픽업 상품이 없습니다.</p>
          <p className="text-xs mt-1">다른 공항을 선택해 주세요.</p>
        </div>
      )}

      <div className="space-y-10">
        {displayGroups.map((group) => {
          const city = CITY_MAP[group.cityId];
          const products = city?.pickupProducts ?? [];

          return (
            <div key={group.cityId}>
              {/* 공항 그룹 헤더 */}
              <div className="flex items-center gap-3 mb-1 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{group.cityEmoji}</span>
                  <h3 className="text-lg font-bold text-[#2A2A25]">{group.cityName}</h3>
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  {group.airports.map((a) => (
                    <span
                      key={a.id}
                      className="text-[10px] bg-[#EDE5CC] text-[#5C5840] px-2 py-0.5 rounded-full font-bold"
                    >
                      {a.description.split(' · ')[0]}
                    </span>
                  ))}
                </div>
              </div>

              {/* 출발/도착 요약 */}
              <p className="text-xs text-gray-400 mb-4">
                {pickupType === 'pickup'
                  ? `출발: ${group.airportCodes} → 도착: ${group.cityName} 시내/호텔`
                  : `출발: ${group.cityName} 시내/호텔 → 도착: ${group.airportCodes}`}
                {' · '}{products.length}개 상품
              </p>

              {/* 상품 목록 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {products.map((p) => (
                  <PickupProductCard
                    key={p.gid}
                    product={p}
                    airportCodes={group.airportCodes}
                    cityId={group.cityId}
                    cityName={group.cityName}
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
