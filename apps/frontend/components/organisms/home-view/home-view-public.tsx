"use client";

import AppContainer from "@/components/atoms/app-container";
import { FeatureGrid } from "@/components/molecules/feature-grid";
import { CategoriesCarousel } from "@/components/molecules/categories-carousel";

import { FEATURE_ITEMS } from "@/constants/homepage";

import { useProductsStore } from "@/hooks/products/use-products-store";
import { useCategories } from "@/hooks/categories/use-homepage-categories";
import { DynamicCarouselSection } from "./dynamic-carousel-section";
import { useConfig } from "@/hooks/config/use-config";
import HomeWelcomeSection from "@/components/molecules/welcome-banner";
import { JoinUs } from "@/components/molecules/join-us";
import { FlashSaleCarousel } from "@/components/molecules/flash-sale-carousel";
import { TProduct } from "@/domain/products/types/products.model";

interface HomepagePublicProps {
  flashSaleProducts: TProduct[];
}

export const HomepagePublic = ({ flashSaleProducts }: HomepagePublicProps) => {
  const sections = useProductsStore((state) => state.sections);
  const { treeCategories: categories } = useCategories();
  const { language: lang } = useConfig();

  return (
    <div className="flex flex-col pb-10" data-testid="public-home">
      {/* 1. Hero Banner Section */}
      <HomeWelcomeSection />
      {/* Wrapping the rest in ONE AppContainer */}
      <AppContainer className="flex flex-col gap-8 sm:gap-10 lg:gap-12">
        {/* 2. Feature Cards Grid */}
        <FeatureGrid items={FEATURE_ITEMS} />

        {/* Categories Section */}
        <CategoriesCarousel categories={categories} lang={lang} />

        <FlashSaleCarousel products={flashSaleProducts} />

        {/* 3. Dynamic Backend Sections */}
        <DynamicCarouselSection sections={sections} />

        {/* 4. Promotional Banner */}
        <JoinUs />
      </AppContainer>
    </div>
  );
};

export default HomepagePublic;
