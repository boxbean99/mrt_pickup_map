'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import HeroBanner from './HeroBanner';
import SearchWidget from './SearchWidget';
import ValueProps from './ValueProps';
import AirportSection from './AirportSection';

const MapView = dynamic(() => import('./MapView'), { ssr: false });

type PickupType = 'pickup' | 'sending';

export default function PickupWidget() {
  const [pickupType, setPickupType] = useState<PickupType>('pickup');
  const [filteredAirportId, setFilteredAirportId] = useState('');

  function handleSearch(airportId: string, type: PickupType, _passengers: number) {
    setPickupType(type);
    setFilteredAirportId(airportId);
    if (airportId) {
      document.getElementById('airport-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  const handleMapToggle = useCallback((id: string) => {
    setFilteredAirportId((prev) => (prev === id ? '' : id));
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF7F0]">
      <HeroBanner />
      <SearchWidget onSearch={handleSearch} />
      <ValueProps />

      {/* 지도 섹션 */}
      <div className="px-6 py-8 max-w-4xl mx-auto">
        <h2 className="text-xl font-bold text-[#2A2A25] mb-4">터키 공항 지도</h2>
        <div className="rounded-xl overflow-hidden border border-[#D4C9A8] shadow-sm" style={{ height: 420 }}>
          <MapView
            selectedCities={filteredAirportId ? [filteredAirportId] : []}
            onToggleCity={handleMapToggle}
          />
        </div>
        <p className="text-xs text-gray-400 mt-2">공항 마커를 클릭하면 해당 공항 상품을 확인할 수 있습니다.</p>
      </div>

      <div id="airport-section">
        <AirportSection
          filteredAirportId={filteredAirportId}
          pickupType={pickupType}
          onClearFilter={() => setFilteredAirportId('')}
        />
      </div>
    </div>
  );
}
