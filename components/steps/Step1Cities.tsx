'use client';

import { CITIES } from '@/data/cities';
import type { LocationType } from '@/types';

type Props = {
  selectedCities: string[];
  onToggleCity: (id: string) => void;
  onNext: () => void;
};

const TYPE_LABEL: Record<LocationType, string> = {
  city: '주요 도시',
  airport: '공항',
  attraction: '관광지',
  nearby: '근교 도시',
};

const TYPE_BADGE: Record<LocationType, string> = {
  city: 'bg-[#EDE5CC] text-[#5C5840]',
  airport: 'bg-[#DDE8EE] text-[#4A6878]',
  attraction: 'bg-[#EEE8D8] text-[#7A6040]',
  nearby: 'bg-[#D4EDD4] text-[#4A7A50]',
};

const TYPE_ORDER: LocationType[] = ['city', 'attraction', 'nearby', 'airport'];

export default function Step1Cities({ selectedCities, onToggleCity, onNext }: Props) {
  const selectedSet = new Set(selectedCities);
  const selectedList = CITIES.filter((c) => selectedSet.has(c.id));
  const unselectedByType = TYPE_ORDER.map((type) => ({
    type,
    items: CITIES.filter((c) => !selectedSet.has(c.id) && c.type === type),
  })).filter(({ items }) => items.length > 0);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {selectedList.length > 0 && (
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
              선택됨 ({selectedList.length})
            </p>
            <div className="space-y-2">
              {selectedList.map((city, i) => (
                <div
                  key={city.id}
                  className="flex items-center justify-between bg-[#FAF7F0] border border-[#D4C9A8] rounded-lg px-3 py-2"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p className="text-sm font-semibold text-[#4A7A50]">
                        {i + 1}. {city.emoji} {city.name}
                      </p>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${TYPE_BADGE[city.type]}`}>
                        {TYPE_LABEL[city.type]}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5 truncate">{city.description}</p>
                  </div>
                  <button
                    onClick={() => onToggleCity(city.id)}
                    className="w-6 h-6 flex-shrink-0 flex items-center justify-center text-stone-300 hover:text-stone-500 text-lg leading-none ml-2"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {unselectedByType.map(({ type, items }) => (
          <div key={type}>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
              {TYPE_LABEL[type]}
            </p>
            <div className="space-y-1.5">
              {items.map((city) => (
                <button
                  key={city.id}
                  onClick={() => onToggleCity(city.id)}
                  className="w-full flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2 hover:border-gray-400 hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-700 truncate">
                      {city.emoji} {city.name}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5 truncate">{city.description}</p>
                  </div>
                  <span className="text-xs text-gray-400 ml-2 flex-shrink-0">+</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-gray-100">
        <button
          onClick={onNext}
          disabled={selectedCities.length === 0}
          className="w-full py-3 rounded-lg text-sm font-semibold transition-colors disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed bg-[#2A2A25] hover:bg-[#1A1A16] text-white"
        >
          다음: 날짜 설정 →
        </button>
        {selectedCities.length === 0 && (
          <p className="text-center text-xs text-gray-400 mt-2">최소 1개 장소 선택 필요</p>
        )}
      </div>
    </div>
  );
}
