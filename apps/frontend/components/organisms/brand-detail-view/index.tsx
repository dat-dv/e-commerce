import AppContainer from "@/components/atoms/app-container";
import { TCategory } from "@/domain/categories/types/categories.model";
import { TBrand } from "@/domain/homepage/types/homepage.model";
import { TProduct } from "@/domain/products/types/products.model";
import DiscoveryCarouselSection from "../discovery-sections";
import { BrandHero } from "./brand-hero";
import { BrandProductListSection } from "./brand-product-list";
import { BrandStory } from "./brand-story";

interface BrandDetailViewProps {
  brand: TBrand;
  products: TProduct[];
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  searchQuery?: string;
  categories: TCategory[];
  categorySlug: string;
}

export function BrandDetailView({
  brand,
  products,
  currentPage,
  totalPages,
  totalProducts,
  searchQuery,
  categories,
  categorySlug,
}: BrandDetailViewProps) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero Banner Section */}
      <BrandHero brand={brand} />

      <AppContainer className="flex flex-col gap-16 py-12 md:gap-24 md:py-20 lg:gap-32">
        {/* Editorial Narrative Story Section */}
        <BrandStory brand={brand} />

        {/* Dynamic Product Catalog Grid with Pagination */}
        <BrandProductListSection
          brand={brand}
          products={products}
          currentPage={currentPage}
          totalPages={totalPages}
          totalProducts={totalProducts}
          searchQuery={searchQuery}
          categories={categories}
          categorySlug={categorySlug}
        />

        <DiscoveryCarouselSection />
      </AppContainer>
    </div>
  );
}
