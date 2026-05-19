"use client";

import Link from "next/link";
import { Eye, ShoppingBag } from "lucide-react";
import { useTranslations } from "next-intl";

import AppContainer from "@/components/atoms/app-container";
import { ProductCard } from "@/components/molecules/product-card";
import { APP_ROUTES } from "@/constants/routes";
import { useLoadRecentViewedProducts } from "@/hooks/products/recent-viewed/use-load-recent-viewed-product";
import { useLoadOnce } from "@/hooks/use-load-once";

import { VirtualGrid } from "@/components/molecules/virtual-grid";

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
    <AppContainer size="2xl" className="py-14">
      <div className="mb-10 flex flex-col gap-3">
        <div className="flex items-center gap-2 text-primary">
          <Eye size={18} />
          <span className="text-xs font-black uppercase tracking-[0.25em]">
            {t("tag")}
          </span>
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-tight text-content">
            {t("title")}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-content/50">
            {t("description")}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {Array.from({ length: 10 }).map((_, index) => (
            <div
              key={index}
              className="aspect-[3/4] animate-pulse rounded-2xl border border-content/[0.05] bg-content/[0.03]"
            />
          ))}
        </div>
      ) : recentViewedProducts.length > 0 ? (
        <VirtualGrid
          data={recentViewedProducts}
          loadingMore={loadingMore}
          hasMore={hasMore}
          onLoadMore={fetchMore}
          gridClassName="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
          renderItem={(product) => (
            <ProductCard key={product.id} product={product} />
          )}
          keyExtractor={(product) => product.id}
          loadingText={t("loadingText")}
          endText={t("endText")}
          columns={{
            base: 2,
            sm: 3,
            md: 4,
            lg: 5,
          }}
        />
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-content/10 bg-surface/50 px-6 py-20 text-center">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-content/5 text-content/30">
            <Eye size={28} />
          </div>
          <h2 className="text-xl font-black text-content">{t("emptyTitle")}</h2>
          <p className="mt-2 max-w-sm text-sm text-content/50">
            {t("emptyDescription")}
          </p>
          <Link
            href={APP_ROUTES.PRODUCTS}
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-content px-5 py-3 text-sm font-bold text-surface transition-transform active:scale-95"
          >
            <ShoppingBag size={16} />
            {t("browseButton")}
          </Link>
        </div>
      )}
    </AppContainer>
  );
};
