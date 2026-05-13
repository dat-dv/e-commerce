"use client";

import AppContainer from "@/components/atoms/app-container";
import { Zap, Sparkles, Laptop, Home, Heart, LucideIcon } from "lucide-react";
import { ProductCarousel } from "@/components/molecules/product-carousel";
import { HeroSection } from "@/components/molecules/hero-section";
import { FeatureGrid } from "@/components/molecules/feature-grid";
import { PromoBanner } from "@/components/molecules/promo-banner";
import { Newsletter } from "@/components/molecules/newsletter";
import { CategoriesSection } from "@/components/molecules/categories-section";
import { FlashSale } from "@/components/molecules/flash-sale";

import { HOMEPAGE_SECTION_TYPES, FEATURE_ITEMS } from "@/constants/homepage";

import { useProductsStore } from "@/hooks/products/use-products-store";
import { useHomepageCategories } from "@/hooks/categories/use-homepage-categories";
import { Eye } from "lucide-react";

const SECTION_ICONS: Record<string, LucideIcon> = {
  [HOMEPAGE_SECTION_TYPES.FLASH_SALE]: Zap,
  [HOMEPAGE_SECTION_TYPES.RECOMMENDS]: Sparkles,
  [HOMEPAGE_SECTION_TYPES.RECENT_VIEW]: Eye,
  electronics: Laptop,
  "tv-audio-cameras": Laptop,
  "toys-baby-products": Sparkles,
  "beauty-health": Heart,
  "home-kitchen": Home,
  default: Sparkles,
};

const getIcon = (type: string, slug?: string) => {
  if (type === HOMEPAGE_SECTION_TYPES.FLASH_SALE) return Zap;
  if (type === HOMEPAGE_SECTION_TYPES.RECOMMENDS) return Sparkles;
  if (type === HOMEPAGE_SECTION_TYPES.RECENT_VIEW) return Eye;
  return SECTION_ICONS[slug || ""] || SECTION_ICONS.default;
};

export const HomepagePublic = () => {
  const sections = useProductsStore((state) => state.sections);
  const { categories, fetchMore, pagination } = useHomepageCategories();
  const lang = useProductsStore((state) => state.lang);

  return (
    <div className="flex flex-col gap-12 pb-20" data-testid="public-home">
      {/* 1. Hero Banner Section */}
      <HeroSection />

      {/* Wrapping the rest in ONE AppContainer */}
      <AppContainer className="flex flex-col gap-12">
        {/* 2. Feature Cards Grid */}
        <FeatureGrid items={FEATURE_ITEMS} />

        {/* Categories Section */}
        <CategoriesSection
          categories={categories}
          lang={lang}
          onLoadMore={fetchMore}
          total={pagination?.total}
          current={categories.length}
        />

        {/* 3. Dynamic Backend Sections */}
        {sections.map((section) => {
          if (
            section.category.type === HOMEPAGE_SECTION_TYPES.FLASH_SALE &&
            section.data.length > 0
          ) {
            return (
              <FlashSale key={section.category.id} products={section.data} />
            );
          }

          if (
            (section.category.type ===
              HOMEPAGE_SECTION_TYPES.PRODUCT_CAROUSEL ||
              section.category.type === HOMEPAGE_SECTION_TYPES.RECOMMENDS ||
              section.category.type === HOMEPAGE_SECTION_TYPES.RECENT_VIEW) &&
            section.data.length > 0
          ) {
            return (
              <ProductCarousel
                key={section.category.id}
                title={section.category.title}
                icon={getIcon(section.category.type, section.category.slug)}
                products={section.data}
                rows={1}
              />
            );
          }

          return null;
        })}

        {/* 4. Promotional Banner */}
        <PromoBanner />

        {/* 5. Newsletter */}
        <Newsletter />
      </AppContainer>
    </div>
  );
};

export default HomepagePublic;
