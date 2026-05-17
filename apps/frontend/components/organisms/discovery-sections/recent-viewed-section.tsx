"use client";

import React, { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import { useLoadRecentViewedProducts } from "@/hooks/products/recent-viewed/use-load-recent-viewed-product";
import { ProductCarousel } from "@/components/molecules/product-carousel";
import { APP_ROUTES } from "@/constants/routes";
import { RecentViewedSectionSkeleton } from "./skeletons";

export const RecentViewedSection = () => {
  const { recentViewedProducts, fetchRecentViewedProducts } =
    useLoadRecentViewedProducts();
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    const triggerFetch = async () => {
      try {
        await fetchRecentViewedProducts();
      } catch (error) {
        console.error("Failed to load recent viewed products:", error);
      } finally {
        setIsInitialLoad(false);
      }
    };
    triggerFetch();
  }, [fetchRecentViewedProducts]);

  // 1. Fallback Preview: If we have cached products in store, render them immediately.
  const hasCachedProducts =
    recentViewedProducts && recentViewedProducts.length > 0;

  // 2. Loading State: If we have no cached products and we are still loading for the first time.
  if (!hasCachedProducts && isInitialLoad) {
    return <RecentViewedSectionSkeleton />;
  }

  // 3. Empty State: If we are not loading anymore and there are no products, render nothing.
  if (!hasCachedProducts && !isInitialLoad) {
    return null;
  }

  return (
    <div className="w-full py-6">
      <ProductCarousel
        title="Recently Viewed"
        href={APP_ROUTES.RECENTLY_VIEWED}
        icon={Eye}
        products={recentViewedProducts}
        rows={1}
      />
    </div>
  );
};

export default RecentViewedSection;
