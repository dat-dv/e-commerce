"use client";

import AppContainer from "@/components/atoms/app-container";
import { HeroSection } from "@/components/molecules/hero-section";
import { FeatureGrid } from "@/components/molecules/feature-grid";
import { PromoBanner } from "@/components/molecules/promo-banner";
import { CategoriesSection } from "@/components/molecules/categories-section";

import { FEATURE_ITEMS } from "@/constants/homepage";

import { useProductsStore } from "@/hooks/products/use-products-store";
import { useHomepageCategories } from "@/hooks/categories/use-homepage-categories";
import { DynamicSections } from "./dynamic-sections";

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
        <FeatureGrid
          items={FEATURE_ITEMS}
          classNames="px-2 justify-items-center"
        />

        {/* Categories Section */}
        <CategoriesSection
          categories={categories}
          lang={lang}
          onLoadMore={fetchMore}
          total={pagination?.total}
          current={categories.length}
        />

        {/* 3. Dynamic Backend Sections */}
        <DynamicSections sections={sections} />

        {/* 4. Promotional Banner */}
        <PromoBanner />
      </AppContainer>
    </div>
  );
};

export default HomepagePublic;
