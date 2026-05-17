"use client";

import React from "react";
import { Sparkles } from "lucide-react";
import { useRecommendedProducts } from "@/hooks/products/use-recommended-products";
import { ProductCarousel } from "@/components/molecules/product-carousel";
import { RecentViewedSectionSkeleton } from "./skeletons";
import { TProduct } from "@/domain/products/types/products.model";

export interface RecommendedSectionProps {
  products?: TProduct[];
  loading?: boolean;
}

export const RecommendedSection = ({
  products: propProducts,
  loading: propLoading,
}: RecommendedSectionProps) => {
  const hookState = useRecommendedProducts();

  const products = propProducts ?? hookState.recommendedProducts;
  const loading = propLoading ?? hookState.isLoading;

  if (loading && (!products || products.length === 0)) {
    return <RecentViewedSectionSkeleton />;
  }

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="w-full py-6">
      <ProductCarousel
        title="Recommended for You"
        icon={Sparkles}
        products={products}
        rows={1}
      />
    </div>
  );
};

export default RecommendedSection;
