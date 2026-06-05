import type { PickupProduct } from '@/types';

const CITY_IMAGES: Record<string, string> = {
  istanbul:   'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=400&q=80',
  cappadocia: 'https://images.unsplash.com/photo-1539650116574-75c0d3c6eb29?w=400&q=80',
  antalya:    'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=400&q=80',
  ephesus:    'https://images.unsplash.com/photo-1574739782594-db4ead022697?w=400&q=80',
  fethiye:    'https://images.unsplash.com/photo-1527838832700-5059252407fa?w=400&q=80',
};

type Props = {
  product: PickupProduct;
  cityId: string;
  fromName: string;
  toName: string;
  pickupType: 'pickup' | 'sending';
};

export default function PickupProductCard({ product, cityId, fromName, toName }: Props) {
  const mrtUrl = `https://experiences.myrealtrip.com/products/${product.gid}`;

  return (
    <a
      href={mrtUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex gap-3 bg-white rounded-xl border border-[#EDE5CC] p-3 hover:shadow-md transition-shadow group"
    >
      {/* 썸네일 */}
      <div
        className="w-20 h-20 rounded-lg bg-cover bg-center flex-shrink-0"
        style={{ backgroundImage: `url(${CITY_IMAGES[cityId] ?? CITY_IMAGES.istanbul})` }}
      />

      {/* 정보 */}
      <div className="flex-1 min-w-0">
        {/* 출발 → 도착 뱃지 */}
        <div className="flex items-center gap-1 mb-1.5 flex-wrap">
          <span className="text-[10px] font-bold bg-[#EDE5CC] text-[#5C5840] px-1.5 py-0.5 rounded truncate max-w-[110px]">
            {fromName}
          </span>
          <span className="text-[10px] text-gray-400 flex-shrink-0">→</span>
          <span className="text-[10px] font-bold bg-[#D4EDD4] text-[#4A7A50] px-1.5 py-0.5 rounded truncate max-w-[110px]">
            {toName}
          </span>
        </div>

        {/* 상품명 */}
        <p className="text-xs font-semibold text-[#2A2A25] leading-snug line-clamp-2 group-hover:text-[#4A8C52] transition-colors">
          {product.title}
        </p>

        {/* 상태 */}
        <div className="flex items-center gap-2 mt-1.5">
          {product.status === 'onsale' ? (
            <span className="text-[9px] font-bold text-[#4A8C52] bg-[#D4EDD4] px-1.5 py-0.5 rounded-full">
              판매중
            </span>
          ) : (
            <span className="text-[9px] font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">
              준비중
            </span>
          )}
        </div>
      </div>
    </a>
  );
}
