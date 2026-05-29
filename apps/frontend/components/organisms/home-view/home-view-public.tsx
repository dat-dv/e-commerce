"use client";

import { CategoriesCarousel } from "@/components/molecules/categories-carousel";
import { AppContainer, FeatureGrid } from "@ecommerce/ui";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useMemo } from "react";

import { FEATURE_ITEMS } from "@/constants/homepage";

import { FlashSaleCarousel } from "@/components/molecules/flash-sale-carousel";
import { JoinUs } from "@/components/molecules/join-us";
import HomeWelcomeSection from "@/components/molecules/welcome-banner";
import { TProduct } from "@/domain/products/types/products.model";
import { useCategories } from "@/hooks/categories/use-homepage-categories";
import { useConfig } from "@/hooks/config/use-config";
import { useProductsStore } from "@/hooks/products/use-products-store";
import { DynamicCarouselSection } from "./dynamic-carousel-section";

interface HomepagePublicProps {
  flashSaleProducts: TProduct[];
}

export const HomepagePublic = ({ flashSaleProducts }: HomepagePublicProps) => {
  const sections = useProductsStore((state) => state.sections);
  const { treeCategories: categories } = useCategories();
  const { language: lang } = useConfig();
  const t = useTranslations("HomePage");

  const translatedFeatureItems = useMemo(() => {
    return [
      {
        ...FEATURE_ITEMS[0],
        name: t("features.flashSale.name"),
        desc: t("features.flashSale.desc"),
      },
      {
        ...FEATURE_ITEMS[1],
        name: t("features.vouchers.name"),
        desc: t("features.vouchers.desc"),
      },
      {
        ...FEATURE_ITEMS[2],
        name: t("features.topBrands.name"),
        desc: t("features.topBrands.desc"),
      },
      {
        ...FEATURE_ITEMS[3],
        name: t("features.newArrivals.name"),
        desc: t("features.newArrivals.desc"),
      },
    ];
  }, [t]);

  return (
    <div className="flex flex-col pb-10" data-testid="public-home">
      {/* 1. Hero Banner Section */}
      <HomeWelcomeSection />
      {/* Wrapping the rest in ONE AppContainer */}
      <AppContainer className="flex flex-col gap-8 sm:gap-10 lg:gap-12">
        {/* 2. Feature Cards Grid */}
        <FeatureGrid items={translatedFeatureItems} linkComponent={Link} />

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
