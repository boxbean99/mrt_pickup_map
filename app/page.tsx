import PickupWidget from '@/components/PickupWidget';
import type { Product } from '@/types';
import mockProducts from '@/data/mock-products.json';

export default function Home() {
  return (
    <main>
      <PickupWidget products={mockProducts as Product[]} />
    </main>
  );
}
