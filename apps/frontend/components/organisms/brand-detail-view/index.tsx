import AppContainer from "@/components/atoms/app-container";
import { TBrand } from "@/domain/homepage/types/homepage.model";
import { TProduct } from "@/domain/products/types/products.model";
import { TCategory } from "@/domain/categories/types/categories.model";
import { BrandHero } from "./brand-hero";
import { BrandStory } from "./brand-story";
import { BrandProductListSection } from "./brand-product-list";
import DiscoveryCarouselSection from "../discovery-sections";

interface BrandDetailViewProps {
  brand: TBrand;
  products: TProduct[];
  currentPage: number;
  totalPages: number;
  searchQuery?: string;
  categories: TCategory[];
}

export function BrandDetailView({
  brand,
  products,
  currentPage,
  totalPages,
  searchQuery,
  categories,
}: BrandDetailViewProps) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero Banner Section */}
      <BrandHero brand={brand} />

      <AppContainer className="py-20 flex flex-col gap-32">
        {/* Editorial Narrative Story Section */}
        <BrandStory brand={brand} />

        {/* Dynamic Product Catalog Grid with Pagination */}
        <BrandProductListSection
          brand={brand}
          products={products}
          currentPage={currentPage}
          totalPages={totalPages}
          searchQuery={searchQuery}
        />

        <DiscoveryCarouselSection />
      </AppContainer>
    </div>
  );
}
