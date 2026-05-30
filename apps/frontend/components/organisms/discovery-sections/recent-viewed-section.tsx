"use client";

import { ProductCarousel } from "@/components/molecules/product-carousel";
import { APP_ROUTES } from "@/constants/routes";
import { useConfig } from "@/hooks/config/use-config";
import { useLoadRecentViewedProducts } from "@/hooks/products/recent-viewed/use-load-recent-viewed-product";
import { Eye } from "lucide-react";
import { DiscoverySectionSkeleton } from "./skeletons";

import { useTranslations } from "next-intl";

import { TProduct } from "@/domain/products/types/products.model";
import { useAuthStore } from "@/hooks/auth/use-auth-store";
import { useLoadOnce } from "@ecommerce/ui";

export interface RecentViewedSectionProps {
  products?: TProduct[];
  loading?: boolean;
}

export const RecentViewedSection = ({
  products: propProducts,
  loading: propLoading,
}: RecentViewedSectionProps) => {
  const user = useAuthStore((state) => state.user);
  const {
    recentViewedProducts,
    loading: hookLoading,
    fetchRecentViewedProducts,
  } = useLoadRecentViewedProducts({ initialItems: propProducts });
  const shouldLoad = Boolean(user?.id || propProducts);
  const { loading: initialLoading } = useLoadOnce(
    fetchRecentViewedProducts,
    shouldLoad,
  );
  const { language } = useConfig();
  const t = useTranslations("HomePage.discovery");
  const products = propProducts ?? recentViewedProducts;
  const loading = propLoading || hookLoading || initialLoading;

  if (!shouldLoad) return null;

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
