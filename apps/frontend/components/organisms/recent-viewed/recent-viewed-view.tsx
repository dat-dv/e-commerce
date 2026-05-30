"use client";

import { AppContainer, VirtualGrid } from "@ecommerce/ui";
import { Eye, ShoppingBag } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

import { ProductCard } from "@/components/molecules/product-card";

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
        <div className={PRODUCT_LISTING_GRID_CLASS_NAME}>
          {Array.from({ length: 10 }).map((_, index) => (
            <div
              key={index}
              className="border-content/[0.05] bg-content/[0.03] aspect-[3/4] animate-pulse rounded-2xl border"
            />
          ))}
        </div>
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
        <div className="border-content/10 bg-surface/50 flex min-w-0 flex-col items-center justify-center rounded-2xl border border-dashed px-4 py-14 text-center sm:px-6 sm:py-20">
          <div className="bg-content/5 text-content/30 mb-6 flex h-16 w-16 items-center justify-center rounded-full">
            <Eye size={28} />
          </div>
          <h2 className="text-content max-w-full text-xl font-black">
            {t("emptyTitle")}
          </h2>
          <p className="text-content/50 mt-2 max-w-sm text-sm">
            {t("emptyDescription")}
          </p>
          <Link
            href={APP_ROUTES.PRODUCTS}
            className="bg-content text-surface mt-8 inline-flex max-w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition-transform active:scale-95"
          >
            <ShoppingBag size={16} />
            <span className="truncate">{t("browseButton")}</span>
          </Link>
        </div>
      )}
      <DiscoveryCarouselSection exclude={["recent-viewed"]} />
    </AppContainer>
  );
};
