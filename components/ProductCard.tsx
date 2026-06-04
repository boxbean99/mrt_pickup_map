import type { Product } from '@/types';

export default function ProductCard({ product }: { product: Product }) {
  return (
    <a
      href={product.mrtUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex gap-3 bg-white rounded-xl border border-[#EDE5CC] p-3 hover:shadow-md transition-shadow group"
    >
      <div
        className="w-20 h-20 rounded-lg bg-cover bg-center flex-shrink-0"
        style={{ backgroundImage: `url(${product.imageUrl})` }}
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[#2A2A25] leading-snug line-clamp-2 group-hover:text-[#4A8C52] transition-colors">
          {product.title}
        </p>
        <div className="flex items-center gap-1 mt-1.5">
          <span className="text-yellow-400 text-xs">★</span>
          <span className="text-xs text-gray-700 font-medium">{product.rating.toFixed(1)}</span>
          <span className="text-xs text-gray-400">({product.reviewCount.toLocaleString()})</span>
        </div>
        <p className="text-sm font-bold text-[#2A2A25] mt-1">
          최저 ₩{product.price.toLocaleString()}
        </p>
      </div>
    </a>
  );
}
