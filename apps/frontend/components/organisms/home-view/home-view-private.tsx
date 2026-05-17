"use client";

import AppContainer from "@/components/atoms/app-container";
import { FeatureGrid } from "@/components/molecules/feature-grid";
import { CategoriesCarousel } from "@/components/molecules/categories-carousel";
import HomeWelcomeSection from "@/components/molecules/welcome-banner";
import { useAuthStore } from "@/hooks/auth/use-auth-store";

import { FEATURE_ITEMS } from "@/constants/homepage";

import { useProductsStore } from "@/hooks/products/use-products-store";
import { useCategories } from "@/hooks/categories/use-homepage-categories";
import { DynamicCarouselSection } from "./dynamic-carousel-section";
import { useConfig } from "@/hooks/config/use-config";
import DiscoverySections from "../discovery-sections";
import { FlashSaleCarousel } from "@/components/molecules/flash-sale-carousel";
import { TProduct } from "@/domain/products/types/products.model";

interface HomepagePrivateProps {
  flashSaleProducts: TProduct[];
}

export const HomepagePrivate = ({
  flashSaleProducts,
}: HomepagePrivateProps) => {
  const user = useAuthStore((state) => state.user);
  const sections = useProductsStore((state) => state.sections);
  const { treeCategories: categories } = useCategories();
  const { language: lang } = useConfig();

  return (
    <div className="flex flex-col pb-10" data-testid="private-home">
      {/* 1. Welcome Banner */}
      <HomeWelcomeSection
        name={`${user?.firstName || ""} ${user?.lastName || ""}`}
      />
      <AppContainer className="flex flex-col gap-10 pt-10">
        {/* 2. Feature Cards Grid */}
        <FeatureGrid items={FEATURE_ITEMS} />
        {/* Categories Section */}
        <CategoriesCarousel categories={categories} lang={lang} />

        <FlashSaleCarousel products={flashSaleProducts} />

        {/* 3. Dynamic Backend Sections */}
        <DynamicCarouselSection sections={sections} />

        <DiscoverySections />
      </AppContainer>
    </div>
  );
};

export default HomepagePrivate;
