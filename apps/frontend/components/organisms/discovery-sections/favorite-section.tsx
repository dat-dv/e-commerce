"use client";

import { ProductCarousel } from "@/components/molecules/product-carousel";
import { APP_ROUTES } from "@/constants/routes";
import { TProduct } from "@/domain/products/types/products.model";
import { userFavoriteProductsUseCase } from "@/domain/user-favorite-products/use-cases";
import { useConfig } from "@/hooks/config/use-config";
import { useLoadOnce } from "@/hooks/use-load-once";
import { usePagination } from "@/hooks/use-pagination";
import { Heart } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useMemo } from "react";
import { RecentViewedSectionSkeleton } from "./skeletons";

export const FavoriteSection = () => {
  const { language } = useConfig();
  const t = useTranslations("HomePage.discovery");
  const { items, loading, loadPage } = usePagination({
    initialData: {
      items: [],
      meta: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      },
    },
    fetchPage: ({ page, limit }) =>
      userFavoriteProductsUseCase.getUserFavoriteProductsUseCase.execute(
        page,
        limit,
      ),
    getItemKey: (favorite) => favorite.productId,
  });

  const fetchFavorites = useCallback(
    () => loadPage(1, undefined, { firstLoad: true, syncQuery: false }),
    [loadPage],
  );
  const { loading: initialLoading } = useLoadOnce(fetchFavorites);
  const products = useMemo(
    () =>
      items
        .map((favorite) => favorite.product)
        .filter((product): product is TProduct => Boolean(product)),
    [items],
  );

  if ((loading || initialLoading) && products.length === 0) {
    return <RecentViewedSectionSkeleton />;
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="w-full py-6">
      <ProductCarousel
        title={t("wishlist")}
        href={APP_ROUTES.FAVORITES}
        icon={Heart}
        products={products}
        rows={2}
        lang={language}
      />
    </div>
  );
};

export default FavoriteSection;
