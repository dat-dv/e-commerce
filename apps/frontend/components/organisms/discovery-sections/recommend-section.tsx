"use client";

import React from "react";
import { Sparkles } from "lucide-react";
import { useRecommendedProducts } from "@/hooks/products/use-recommended-products";
import { ProductCarousel } from "@/components/molecules/product-carousel";
import { RecentViewedSectionSkeleton } from "./skeletons";
import { TProduct } from "@/domain/products/types/products.model";
import { useConfig } from "@/hooks/config/use-config";
import { useLoadOnce } from "@/hooks/use-load-once";

import { useTranslations } from "next-intl";

export interface RecommendedSectionProps {
  products?: TProduct[];
  loading?: boolean;
}

export const RecommendedSection = ({
  products: propProducts,
  loading: propLoading,
}: RecommendedSectionProps) => {
  const { fetchRecommendedProducts, recommendedProducts } =
    useRecommendedProducts({ initialItems: propProducts ?? [] });
  const { language } = useConfig();
  const t = useTranslations("HomePage.discovery");
  const { loading: isInitialLoading } = useLoadOnce(fetchRecommendedProducts);

  const products = propProducts ?? recommendedProducts;
  const loading = propLoading || isInitialLoading;

  if (loading && (!products || products.length === 0)) {
    return <RecentViewedSectionSkeleton />;
  }

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="w-full py-6">
      <ProductCarousel
        title={t("recommended")}
        icon={Sparkles}
        products={products}
        rows={1}
        lang={language}
      />
    </div>
  );
};

export default RecommendedSection;
