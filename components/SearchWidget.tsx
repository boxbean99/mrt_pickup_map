'use client';

import { useState } from 'react';
import { CITIES } from '@/data/cities';

type Props = {
  onSearch: (fromId: string, toId: string, passengers: number) => void;
};

export default function SearchWidget({ onSearch }: Props) {
  const [fromId, setFromId] = useState('');
  const [toId, setToId] = useState('');
  const [passengers, setPassengers] = useState(2);

  const airports = CITIES.filter((c) => c.type === 'airport');
  const cities = CITIES.filter((c) => c.type === 'city');

  return (
    <div className="bg-white shadow-sm border-b border-[#EDE5CC] px-6 py-5">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center gap-3">

          {/* 출발지 */}
          <select
            value={fromId}
            onChange={(e) => setFromId(e.target.value)}
            className="flex-[2] border border-[#D4C9A8] rounded-lg px-4 py-3 text-sm text-gray-700 bg-[#FAF7F0] focus:outline-none focus:border-[#76B87A]"
          >
            <option value="">출발지 선택</option>
            <optgroup label="── 공항 ──────────────">
              {airports.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} ({a.description.split(' · ')[0]})
                </option>
              ))}
            </optgroup>
            <optgroup label="── 도시 ──────────────">
              {cities.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.emoji} {c.name}
                </option>
              ))}
            </optgroup>
          </select>

          <span className="text-gray-400 font-bold text-lg flex-shrink-0">→</span>

          {/* 도착지 */}
          <select
            value={toId}
            onChange={(e) => setToId(e.target.value)}
            className="flex-[2] border border-[#D4C9A8] rounded-lg px-4 py-3 text-sm text-gray-700 bg-[#FAF7F0] focus:outline-none focus:border-[#76B87A]"
          >
            <option value="">도착지 선택</option>
            <optgroup label="── 도시 ──────────────">
              {cities.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.emoji} {c.name}
                </option>
              ))}
            </optgroup>
            <optgroup label="── 공항 ──────────────">
              {airports.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} ({a.description.split(' · ')[0]})
                </option>
              ))}
            </optgroup>
          </select>

          {/* 탑승객 */}
          <select
            value={passengers}
            onChange={(e) => setPassengers(Number(e.target.value))}
            className="flex-1 border border-[#D4C9A8] rounded-lg px-4 py-3 text-sm text-gray-700 bg-[#FAF7F0] focus:outline-none focus:border-[#76B87A]"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <option key={n} value={n}>탑승객 {n}인</option>
            ))}
          </select>

          {/* 검색 버튼 */}
          <button
            onClick={() => onSearch(fromId, toId, passengers)}
            className="flex-1 bg-[#2A2A25] hover:bg-[#1A1A16] text-white rounded-lg px-6 py-3 text-sm font-semibold transition-colors whitespace-nowrap"
          >
            검색
          </button>
        </div>

        <p className="text-xs text-gray-400 mt-2">
          공항 또는 도시를 선택하면 해당 구간 픽업/샌딩 상품을 찾아드립니다.
        </p>
      </div>
    </div>
  );
}
