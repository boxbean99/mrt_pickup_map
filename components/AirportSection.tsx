import { CITIES, CITY_MAP } from '@/data/cities';
import type { City, Product } from '@/types';
import ProductCard from './ProductCard';

type Props = {
  products: Product[];
  filteredAirportId: string;
};

type AirportGroup = {
  cityId: string;
  cityName: string;
  cityEmoji: string;
  airports: City[];
  products: Product[];
};

export default function AirportSection({ products, filteredAirportId }: Props) {
  const airports = CITIES.filter((c) => c.type === 'airport' && c.parentCityId);

  const seen = new Set<string>();
  const groups: AirportGroup[] = [];

  airports.forEach((airport) => {
    const cityId = airport.parentCityId!;
    if (!seen.has(cityId)) {
      seen.add(cityId);
      const city = CITY_MAP[cityId];
      const cityAirports = airports.filter((a) => a.parentCityId === cityId);
      const cityProducts = products.filter(
        (p) => p.cityId === cityId && p.category === 'pickup'
      );
      if (cityProducts.length > 0) {
        groups.push({
          cityId,
          cityName: city?.name ?? cityId,
          cityEmoji: city?.emoji ?? '✈️',
          airports: cityAirports,
          products: cityProducts,
        });
      }
    }
  });

  const filteredAirport = filteredAirportId
    ? CITIES.find((c) => c.id === filteredAirportId)
    : null;

  const displayGroups =
    filteredAirport?.parentCityId
      ? groups.filter((g) => g.cityId === filteredAirport.parentCityId)
      : groups;

  return (
    <div className="px-6 py-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-[#2A2A25]">주요 공항</h2>
        {filteredAirportId && (
          <button
            onClick={() => window.location.reload()}
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
        {displayGroups.map((group) => (
          <div key={group.cityId}>
            <div className="flex items-center gap-3 mb-4 flex-wrap">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {group.products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
