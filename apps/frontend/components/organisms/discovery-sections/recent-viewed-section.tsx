"use client";

import { ProductCarousel } from "@/components/molecules/product-carousel";
import { APP_ROUTES } from "@/constants/routes";
import { useConfig } from "@/hooks/config/use-config";
import { useLoadRecentViewedProducts } from "@/hooks/products/recent-viewed/use-load-recent-viewed-product";
import { Eye } from "lucide-react";
import { DiscoverySectionSkeleton } from "./skeletons";

import { useTranslations } from "next-intl";

import { TProduct } from "@/domain/products/types/products.model";
import { useLoadOnce } from "@/hooks/use-load-once";

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
    loading: hookLoading,
    fetchRecentViewedProducts,
  } = useLoadRecentViewedProducts({ initialItems: propProducts });
  const { loading: initialLoading } = useLoadOnce(fetchRecentViewedProducts);
  const { language } = useConfig();
  const t = useTranslations("HomePage.discovery");
  const products = propProducts ?? recentViewedProducts;
  const loading = propLoading || hookLoading || initialLoading;

  return (
    <DiscoverySectionSkeleton loading={loading} total={products.length}>
      <ProductCarousel
        title={t("recentViewed")}
        href={APP_ROUTES.RECENTLY_VIEWED}
        icon={Eye}
        products={products}
        rows={1}
        lang={language}
      />
    </DiscoverySectionSkeleton>
  );
};

export default RecentViewedSection;
