"use client";

import AppContainer from "@/components/atoms/app-container";
import { FeatureGrid } from "@/components/molecules/feature-grid";
import { CategoriesCarousel } from "@/components/molecules/categories-carousel";
import HomeWelcomeSection from "@/components/molecules/welcome-banner";
import { useAuthStore } from "@/hooks/auth/use-auth-store";

import { FEATURE_ITEMS } from "@/constants/homepage";

import { useProductsStore } from "@/hooks/products/use-products-store";
import { useCategories } from "@/hooks/categories/use-homepage-categories";
import { DynamicSections } from "./dynamic-sections";
import { useConfig } from "@/hooks/config/use-config";
import DiscoverySections from "../discovery-sections";

export const HomepagePrivate = () => {
  const user = useAuthStore((state) => state.user);
  const sections = useProductsStore((state) => state.sections);
  const { treeCategories: categories } = useCategories();
  const { language: lang } = useConfig();

  return (
    <div className="flex flex-col gap-12 pb-20" data-testid="private-home">
      <AppContainer className="flex flex-col gap-12 pt-10">
        {/* 1. Welcome Banner */}
        <HomeWelcomeSection
          name={`${user?.firstName || ""} ${user?.lastName || ""}`}
        />
        {/* 2. Feature Cards Grid */}
        <FeatureGrid items={FEATURE_ITEMS} />
        {/* Categories Section */}
        <CategoriesCarousel categories={categories} lang={lang} />

        {/* 3. Dynamic Backend Sections */}
        <DynamicSections sections={sections} />

        <DiscoverySections />
      </AppContainer>
    </div>
  );
};

export default HomepagePrivate;
