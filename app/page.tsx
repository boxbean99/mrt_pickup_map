import PlannerWidget from '@/components/PlannerWidget';
import type { Product } from '@/types';
import mockProducts from '@/data/mock-products.json';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <PlannerWidget products={mockProducts as Product[]} />
      </div>
    </main>
  );
}
