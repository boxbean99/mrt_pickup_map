'use client';

import type { TravelStyle } from '@/types';

const STYLES: { id: TravelStyle; emoji: string; label: string; desc: string }[] = [
  { id: 'sightseeing', emoji: '🏛️', label: '관광지 투어', desc: '주요 명소 · 역사 유적 중심' },
  { id: 'food', emoji: '🍽️', label: '미식 탐방', desc: '현지 음식 · 레스토랑 · 시장' },
  { id: 'package', emoji: '🎒', label: '패키지 여행', desc: '가이드 포함 · 편안한 여행' },
  { id: 'activity', emoji: '🎡', label: '액티비티·박물관', desc: '체험형 활동 · 열기구 · 온천' },
];

type Props = {
  style: TravelStyle | null;
  onSelectStyle: (s: TravelStyle) => void;
  onNext: () => void;
  onBack: () => void;
};

export default function Step3Style({ style, onSelectStyle, onNext, onBack }: Props) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">
          여행 스타일 선택
        </p>
        <div className="space-y-2">
          {STYLES.map((s) => {
            const isSelected = style === s.id;
            return (
              <button
                key={s.id}
                onClick={() => onSelectStyle(s.id)}
                className={`w-full text-left rounded-lg p-3 border-2 transition-all ${
                  isSelected
                    ? 'border-[#76B87A] bg-[#F0F8F1]'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{s.emoji}</span>
                  <div>
                    <p className={`text-sm font-semibold ${isSelected ? 'text-[#3D7A44]' : 'text-gray-700'}`}>
                      {s.label}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{s.desc}</p>
                  </div>
                  {isSelected && (
                    <div className="ml-auto w-5 h-5 rounded-full bg-[#76B87A] flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
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
          disabled={!style}
          className="flex-[2] py-3 rounded-lg text-sm font-semibold transition-colors disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed bg-[#2A2A25] hover:bg-[#1A1A16] text-white"
        >
          상품 추천 보기 →
        </button>
      </div>
    </div>
  );
}
