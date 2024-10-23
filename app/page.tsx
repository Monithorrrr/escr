import { ProductGrid } from '@/components/product-grid';
import { HeroSection } from '@/components/hero-section';
import { FeaturesSection } from '@/components/features-section';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <ProductGrid />
    </div>
  );
}