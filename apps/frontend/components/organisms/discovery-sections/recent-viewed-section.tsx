"use client";

import React from "react";
import { Eye } from "lucide-react";
import { useLoadRecentViewedProducts } from "@/hooks/products/recent-viewed/use-load-recent-viewed-product";
import { ProductCarousel } from "@/components/molecules/product-carousel";
import { APP_ROUTES } from "@/constants/routes";
import { RecentViewedSectionSkeleton } from "./skeletons";
import { useConfig } from "@/hooks/config/use-config";
import { useLoadOnce } from "@/hooks/use-load-once";

import { useTranslations } from "next-intl";

import { TProduct } from "@/domain/products/types/products.model";

export interface RecentViewedSectionProps {
  products?: TProduct[];
  loading?: boolean;
}

export const RecentViewedSection = ({
  products: propProducts,
  loading: propLoading,
}: RecentViewedSectionProps) => {
  const {
    recentViewedProducts,
    fetchRecentViewedProducts,
    loading: hookLoading,
  } = useLoadRecentViewedProducts({ initialItems: propProducts ?? [] });
  const { loading: initialLoading } = useLoadOnce(fetchRecentViewedProducts);

  const { language } = useConfig();
  const t = useTranslations("HomePage.discovery");

  const products = propProducts ?? recentViewedProducts;
  const loading = propLoading || hookLoading || initialLoading;

  // 1. Fallback Preview: If we have cached products in store, render them immediately.
  const hasCachedProducts = products && products.length > 0;

  // 2. Loading State: If we have no cached products and we are still loading for the first time.
  if (!hasCachedProducts && loading) {
    return <RecentViewedSectionSkeleton />;
  }

  // 3. Empty State: If we are not loading anymore and there are no products, render nothing.
  if (!hasCachedProducts && !loading) {
    return null;
  }

  return (
    <div className="w-full py-6">
      <ProductCarousel
        title={t("recentViewed")}
        href={APP_ROUTES.RECENTLY_VIEWED}
        icon={Eye}
        products={products}
        rows={1}
        lang={language}
      />
    </div>
  );
};

export default RecentViewedSection;
