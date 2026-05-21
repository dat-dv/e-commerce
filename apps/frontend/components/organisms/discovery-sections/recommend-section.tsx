"use client";

import { ProductCarousel } from "@/components/molecules/product-carousel";
import { TProduct } from "@/domain/products/types/products.model";
import { useConfig } from "@/hooks/config/use-config";
import { useRecommendedProducts } from "@/hooks/products/use-recommended-products";
import { Sparkles } from "lucide-react";

import { useLoadOnce } from "@/hooks/use-load-once";
import { ApiListResponse } from "@/utils/request/request.types";
import { useTranslations } from "next-intl";
import { DiscoverySectionSkeleton } from "./skeletons";

export interface RecommendedSectionProps {
  initialItems?: ApiListResponse<TProduct>;
  loading?: boolean;
}

export const RecommendedSection = ({
  initialItems,
  loading: propLoading,
}: RecommendedSectionProps) => {
  const { recommendedProducts, fetchRecommendedProducts } =
    useRecommendedProducts({
      initialItems,
    });
  const { language } = useConfig();
  const t = useTranslations("HomePage.discovery");
  const { loading: initialLoading } = useLoadOnce(fetchRecommendedProducts);

  const products = initialItems?.items ?? recommendedProducts;
  const loading = propLoading || initialLoading;

  return (
    <DiscoverySectionSkeleton loading={loading} total={products.length}>
      <ProductCarousel
        title={t("recommended")}
        icon={Sparkles}
        products={products}
        rows={1}
        lang={language}
      />
    </DiscoverySectionSkeleton>
  );
};

export default RecommendedSection;
