"use client";

import AppContainer from "@/components/atoms/app-container";
import { FeatureGrid } from "@/components/molecules/feature-grid";
import { CategoriesSection } from "@/components/molecules/categories-section";
import { WelcomeBanner } from "@/components/molecules/welcome-banner";
import { useAuthStore } from "@/hooks/auth/use-auth-store";

import { FEATURE_ITEMS } from "@/constants/homepage";

import { useProductsStore } from "@/hooks/products/use-products-store";
import { useHomepageCategories } from "@/hooks/categories/use-homepage-categories";
import { DynamicSections } from "./dynamic-sections";
import { useConfig } from "@/hooks/config/use-config";

export const HomepagePrivate = () => {
  const user = useAuthStore((state) => state.user);
  const sections = useProductsStore((state) => state.sections);
  const { categories, fetchMore, pagination } = useHomepageCategories();
  const { language: lang } = useConfig();

  return (
    <div className="flex flex-col gap-12 pb-20" data-testid="private-home">
      <AppContainer className="flex flex-col gap-12 pt-10">
        {/* 1. Welcome Banner */}
        <WelcomeBanner
          userName={`${user?.first_name || ""} ${user?.last_name || ""}`}
          cartCount={3}
          orderCount={1}
        />
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
        <DynamicSections sections={sections} />
      </AppContainer>
    </div>
  );
};

export default HomepagePrivate;
