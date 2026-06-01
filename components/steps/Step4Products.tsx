'use client';

import type { Product, TravelStyle } from '@/types';
import { CITY_MAP } from '@/data/cities';

const STYLE_CATEGORIES: Record<TravelStyle, string[]> = {
  sightseeing: ['pickup', 'tour'],
  food: ['pickup', 'food', 'tour'],
  package: ['pickup', 'package', 'tour'],
  activity: ['pickup', 'activity', 'tour'],
};

type Props = {
  selectedCities: string[];
  style: TravelStyle;
  products: Product[];
  onBack: () => void;
  onReset: () => void;
};

function ProductCard({ product }: { product: Product }) {
  const isPickup = product.category === 'pickup';
  return (
    <a
      href={product.mrtUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex gap-3 rounded-lg border p-3 hover:shadow-md transition-shadow group ${
        isPickup ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-white hover:border-gray-300'
      }`}
    >
      <div
        className="w-16 h-16 rounded-md bg-cover bg-center flex-shrink-0"
        style={{ backgroundImage: `url(${product.imageUrl})` }}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-1">
          <p className="text-xs font-semibold text-gray-800 leading-snug line-clamp-2 group-hover:text-red-600 transition-colors">
            {isPickup && <span className="text-blue-600 mr-1">🚐</span>}
            {product.title}
          </p>
        </div>
        <div className="flex items-center gap-1 mt-1">
          <span className="text-yellow-500 text-xs">★</span>
          <span className="text-xs text-gray-600">{product.rating.toFixed(1)}</span>
          <span className="text-xs text-gray-400">({product.reviewCount.toLocaleString()})</span>
        </div>
        <p className="text-sm font-bold text-red-600 mt-1">
          ₩{product.price.toLocaleString()}
          <span className="text-xs font-normal text-gray-400 ml-1">~</span>
        </p>
      </div>
    </a>
  );
}

export default function Step4Products({ selectedCities, style, products, onBack, onReset }: Props) {
  const allowedCategories = STYLE_CATEGORIES[style];

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {selectedCities.map((cityId) => {
          const city = CITY_MAP[cityId];
          const cityProducts = products.filter((p) => p.cityId === cityId);
          const pickups = cityProducts.filter((p) => p.category === 'pickup');
          const others = cityProducts.filter(
            (p) => p.category !== 'pickup' && allowedCategories.includes(p.category)
          );
          const displayed = [...pickups, ...others];
          if (displayed.length === 0) return null;

          return (
            <div key={cityId}>
              <h3 className="text-sm font-bold text-gray-800 mb-2">
                {city.emoji} {city.name}
              </h3>
              {pickups.length > 0 && (
                <p className="text-[10px] text-blue-500 font-semibold uppercase tracking-wide mb-1.5">
                  🚐 픽업 / 이동
                </p>
              )}
              <div className="space-y-2">
                {displayed.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-4 border-t border-gray-100 flex gap-2">
        <button
          onClick={onBack}
          className="flex-1 py-2.5 rounded-lg text-sm font-semibold border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
        >
          ← 이전
        </button>
        <button
          onClick={onReset}
          className="flex-1 py-2.5 rounded-lg text-sm font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
        >
          처음부터
        </button>
      </div>
    </div>
  );
}
