"use client";

import { AppContainer, EmptyState, VirtualGrid } from "@ecommerce/ui";
import { Eye } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

import { ProductCard } from "@/components/molecules/product-card";
import { ProductGrid } from "@/components/molecules/product-grid";

import {
  PRODUCT_LISTING_GRID_CLASS_NAME,
  PRODUCT_LISTING_GRID_COLUMNS,
} from "@/constants/grid-presets";
import { APP_ROUTES } from "@/constants/routes";
import { useLoadRecentViewedProducts } from "@/hooks/products/recent-viewed/use-load-recent-viewed-product";
import { useLoadOnce } from "@ecommerce/ui";
import DiscoveryCarouselSection from "../discovery-sections";
import RecentViewedHeader from "./recent-viewed-header";

export const RecentViewedView = () => {
  const t = useTranslations("RecentViewedPage");
  const {
    recentViewedProducts,
    loading,
    loadingMore,
    hasMore,
    fetchMore,
    fetchRecentViewedProducts,
  } = useLoadRecentViewedProducts();
  useLoadOnce(fetchRecentViewedProducts);

  return (
    <AppContainer size="2xl" className="py-8 sm:py-12 lg:py-14">
      <RecentViewedHeader />

      {loading ? (
        <ProductGrid products={[]} loading skeletonCount={10} />
      ) : recentViewedProducts.length > 0 ? (
        <VirtualGrid
          data={recentViewedProducts}
          loadingMore={loadingMore}
          hasMore={hasMore}
          onLoadMore={fetchMore}
          gridClassName={PRODUCT_LISTING_GRID_CLASS_NAME}
          renderItem={(product, idx) => (
            <ProductCard key={product.id + idx} product={product} />
          )}
          keyExtractor={(product) => product.id}
          loadingText={t("loadingText")}
          endText={t("endText")}
          columns={PRODUCT_LISTING_GRID_COLUMNS}
        />
      ) : (
        <EmptyState
          title={t("emptyTitle")}
          description={t("emptyDescription")}
          icon={Eye}
          actionLabel={t("browseButton")}
          actionHref={APP_ROUTES.PRODUCTS}
          linkComponent={Link}
        />
      )}
      <DiscoveryCarouselSection exclude={["recent-viewed"]} />
    </AppContainer>
  );
};
