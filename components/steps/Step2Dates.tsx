'use client';

import { CITY_MAP, DEFAULT_NIGHTS } from '@/data/cities';

type Props = {
  selectedCities: string[];
  nights: Record<string, number>;
  onChangeNights: (cityId: string, n: number) => void;
  onNext: () => void;
  onBack: () => void;
};

export default function Step2Dates({ selectedCities, nights, onChangeNights, onNext, onBack }: Props) {
  const totalNights = selectedCities.reduce((sum, id) => sum + (nights[id] ?? 2), 0);

  function applyRecommendation() {
    selectedCities.forEach((id) => {
      onChangeNights(id, DEFAULT_NIGHTS[id] ?? 2);
    });
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            도시별 숙박일
          </p>
          <button
            onClick={applyRecommendation}
            className="text-xs text-red-600 font-medium hover:text-red-800 border border-red-200 rounded-full px-2.5 py-0.5 hover:bg-red-50 transition-colors"
          >
            ✨ AI 추천
          </button>
        </div>

        <div className="space-y-3">
          {selectedCities.map((id, i) => {
            const city = CITY_MAP[id];
            const n = nights[id] ?? 2;
            return (
              <div key={id} className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  {i + 1}. {city.emoji} {city.name}
                </p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onChangeNights(id, Math.max(1, n - 1))}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors font-bold"
                  >
                    −
                  </button>
                  <div className="flex-1 text-center">
                    <span className="text-lg font-bold text-gray-800">{n}</span>
                    <span className="text-sm text-gray-500 ml-1">박</span>
                  </div>
                  <button
                    onClick={() => onChangeNights(id, Math.min(14, n + 1))}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 bg-red-50 rounded-lg p-3 text-center">
          <p className="text-xs text-gray-500">총 여행 기간</p>
          <p className="text-xl font-bold text-red-600 mt-0.5">
            {totalNights}박 {totalNights + 1}일
          </p>
        </div>
      </div>

      <div className="p-4 border-t border-gray-100 flex gap-2">
        <button
          onClick={onBack}
          className="flex-1 py-3 rounded-lg text-sm font-semibold border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
        >
          ← 이전
        </button>
        <button
          onClick={onNext}
          className="flex-[2] py-3 rounded-lg text-sm font-semibold bg-red-600 hover:bg-red-700 text-white transition-colors"
        >
          다음: 여행 스타일 →
        </button>
      </div>
    </div>
  );
}
