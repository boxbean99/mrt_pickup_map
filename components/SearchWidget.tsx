'use client';

import { useState } from 'react';
import { CITIES } from '@/data/cities';

type PickupType = 'pickup' | 'sending';

type Props = {
  onSearch: (airportId: string, type: PickupType, passengers: number) => void;
};

export default function SearchWidget({ onSearch }: Props) {
  const [type, setType] = useState<PickupType>('pickup');
  const [airportId, setAirportId] = useState('');
  const [passengers, setPassengers] = useState(2);

  const airports = CITIES.filter((c) => c.type === 'airport');

  return (
    <div className="bg-white shadow-sm border-b border-[#EDE5CC] px-6 py-5">
      <div className="max-w-4xl mx-auto">
        <div className="flex gap-6 mb-4">
          {(['pickup', 'sending'] as const).map((t) => (
            <label key={t} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="pickupType"
                value={t}
                checked={type === t}
                onChange={() => setType(t)}
                className="accent-[#76B87A]"
              />
              <span className={`text-sm font-medium ${type === t ? 'text-[#2A2A25]' : 'text-gray-400'}`}>
                {t === 'pickup' ? '공항 픽업' : '공항 샌딩'}
              </span>
            </label>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={airportId}
            onChange={(e) => setAirportId(e.target.value)}
            className="flex-[2] border border-[#D4C9A8] rounded-lg px-4 py-3 text-sm text-gray-700 bg-[#FAF7F0] focus:outline-none focus:border-[#76B87A]"
          >
            <option value="">공항 선택</option>
            {airports.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name} ({a.description.split(' · ')[0]})
              </option>
            ))}
          </select>

          <select
            value={passengers}
            onChange={(e) => setPassengers(Number(e.target.value))}
            className="flex-1 border border-[#D4C9A8] rounded-lg px-4 py-3 text-sm text-gray-700 bg-[#FAF7F0] focus:outline-none focus:border-[#76B87A]"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <option key={n} value={n}>
                탑승객 {n}인
              </option>
            ))}
          </select>

          <button
            onClick={() => onSearch(airportId, type, passengers)}
            className="flex-1 bg-[#2A2A25] hover:bg-[#1A1A16] text-white rounded-lg px-6 py-3 text-sm font-semibold transition-colors"
          >
            검색
          </button>
        </div>
      </div>
    </div>
  );
}
