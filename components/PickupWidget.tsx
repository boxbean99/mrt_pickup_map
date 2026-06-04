'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import HeroBanner from './HeroBanner';
import SearchWidget from './SearchWidget';
import ValueProps from './ValueProps';
import AirportSection from './AirportSection';

const MapView = dynamic(() => import('./MapView'), { ssr: false });

export default function PickupWidget() {
  const [fromId, setFromId] = useState('');
  const [toId, setToId] = useState('');

  function handleSearch(newFromId: string, newToId: string, _passengers: number) {
    setFromId(newFromId);
    setToId(newToId);
    if (newFromId || newToId) {
      document.getElementById('airport-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // 지도 마커 클릭 → fromId로 연결
  const handleMapToggle = useCallback((id: string) => {
    setFromId((prev) => (prev === id ? '' : id));
    setToId('');
  }, []);

  const mapSelected = [fromId, toId].filter(Boolean);

  return (
    <div className="min-h-screen bg-[#FAF7F0]">
      <HeroBanner />
      <SearchWidget onSearch={handleSearch} />
      <ValueProps />

      {/* 지도 섹션 */}
      <div className="px-6 py-8 max-w-4xl mx-auto">
        <h2 className="text-xl font-bold text-[#2A2A25] mb-4">터키 공항 지도</h2>
        <div className="rounded-xl overflow-hidden border border-[#D4C9A8] shadow-sm" style={{ height: 420 }}>
          <MapView selectedCities={mapSelected} onToggleCity={handleMapToggle} />
        </div>
        <p className="text-xs text-gray-400 mt-2">공항 또는 도시 마커를 클릭하면 출발지로 설정됩니다.</p>
      </div>

      <div id="airport-section">
        <AirportSection
          fromId={fromId}
          toId={toId}
          onClearFilter={() => { setFromId(''); setToId(''); }}
        />
      </div>
    </div>
  );
}
