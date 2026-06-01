'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import type { PlannerState, TravelStyle, Product } from '@/types';
import StepPanel from './StepPanel';

// MapView uses browser APIs — load client-side only
const MapView = dynamic(() => import('./MapView'), { ssr: false });

type Props = { products: Product[] };

const INITIAL_STATE: PlannerState = {
  step: 1,
  selectedCities: [],
  nights: {},
  style: null,
};

export default function PlannerWidget({ products }: Props) {
  const [state, setState] = useState<PlannerState>(INITIAL_STATE);

  const toggleCity = useCallback((id: string) => {
    setState((prev) => {
      const exists = prev.selectedCities.includes(id);
      const selectedCities = exists
        ? prev.selectedCities.filter((c) => c !== id)
        : [...prev.selectedCities, id];
      const nights = exists
        ? Object.fromEntries(Object.entries(prev.nights).filter(([k]) => k !== id))
        : { ...prev.nights, [id]: prev.nights[id] ?? 2 };
      return { ...prev, selectedCities, nights };
    });
  }, []);

  const changeNights = useCallback((cityId: string, n: number) => {
    setState((prev) => ({ ...prev, nights: { ...prev.nights, [cityId]: n } }));
  }, []);

  const selectStyle = useCallback((s: TravelStyle) => {
    setState((prev) => ({ ...prev, style: s }));
  }, []);

  const next = useCallback(() => {
    setState((prev) => ({
      ...prev,
      step: Math.min(4, prev.step + 1) as PlannerState['step'],
    }));
  }, []);

  const back = useCallback(() => {
    setState((prev) => ({
      ...prev,
      step: Math.max(1, prev.step - 1) as PlannerState['step'],
    }));
  }, []);

  const reset = useCallback(() => setState(INITIAL_STATE), []);

  return (
    <div className="flex flex-col h-screen max-h-[600px] min-h-[500px] rounded-xl overflow-hidden shadow-xl border border-gray-200">
      {/* Header */}
      <div className="flex-shrink-0 bg-[#2A2A25] text-[#FAF7F0] px-5 py-3 flex items-center gap-2">
        <span className="text-lg">🇹🇷</span>
        <span className="font-bold text-sm">터키 여행 플래너</span>
        <span className="text-[#76B87A] mx-1">|</span>
        <span className="text-[#C8DCCA] text-xs">마이리얼트립</span>
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Map — hidden on step 4, shown always otherwise */}
        <div className={`flex-1 overflow-hidden transition-all ${state.step === 4 ? 'hidden md:block' : ''}`}>
          <MapView selectedCities={state.selectedCities} onToggleCity={toggleCity} />
        </div>

        {/* Panel */}
        <div className="flex-shrink-0 border-l border-gray-200 overflow-hidden flex flex-col" style={{ width: 265 }}>
          <StepPanel
            state={state}
            products={products}
            onToggleCity={toggleCity}
            onChangeNights={changeNights}
            onSelectStyle={selectStyle}
            onNext={next}
            onBack={back}
            onReset={reset}
          />
        </div>
      </div>
    </div>
  );
}
