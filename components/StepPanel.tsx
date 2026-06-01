'use client';

import type { PlannerState, TravelStyle } from '@/types';
import type { Product } from '@/types';
import Step1Cities from './steps/Step1Cities';
import Step2Dates from './steps/Step2Dates';
import Step3Style from './steps/Step3Style';
import Step4Products from './steps/Step4Products';

const STEP_LABELS = ['도시 선택', '날짜 설정', '여행 스타일', '상품 추천'];

type Props = {
  state: PlannerState;
  products: Product[];
  onToggleCity: (id: string) => void;
  onChangeNights: (cityId: string, n: number) => void;
  onSelectStyle: (s: TravelStyle) => void;
  onNext: () => void;
  onBack: () => void;
  onReset: () => void;
};

export default function StepPanel({
  state,
  products,
  onToggleCity,
  onChangeNights,
  onSelectStyle,
  onNext,
  onBack,
  onReset,
}: Props) {
  return (
    <div className="flex flex-col h-full bg-white" style={{ width: 265 }}>
      {/* Step indicator */}
      <div className="px-4 pt-4 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-1 mb-3">
          {STEP_LABELS.map((label, i) => {
            const stepNum = i + 1;
            const isActive = stepNum === state.step;
            const isDone = stepNum < state.step;
            return (
              <div key={i} className="flex items-center gap-1 flex-1">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                    isActive
                      ? 'bg-red-600 text-white'
                      : isDone
                      ? 'bg-red-100 text-red-600'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {isDone ? '✓' : stepNum}
                </div>
                {i < STEP_LABELS.length - 1 && (
                  <div className={`h-0.5 flex-1 ${isDone ? 'bg-red-200' : 'bg-gray-100'}`} />
                )}
              </div>
            );
          })}
        </div>
        <p className="text-sm font-bold text-gray-800">{STEP_LABELS[state.step - 1]}</p>
      </div>

      {/* Step content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {state.step === 1 && (
          <Step1Cities
            selectedCities={state.selectedCities}
            onToggleCity={onToggleCity}
            onNext={onNext}
          />
        )}
        {state.step === 2 && (
          <Step2Dates
            selectedCities={state.selectedCities}
            nights={state.nights}
            onChangeNights={onChangeNights}
            onNext={onNext}
            onBack={onBack}
          />
        )}
        {state.step === 3 && (
          <Step3Style
            style={state.style}
            onSelectStyle={onSelectStyle}
            onNext={onNext}
            onBack={onBack}
          />
        )}
        {state.step === 4 && state.style && (
          <Step4Products
            selectedCities={state.selectedCities}
            style={state.style}
            products={products}
            onBack={onBack}
            onReset={onReset}
          />
        )}
      </div>
    </div>
  );
}
