"use client";

import { ProductCarousel } from "@/components/molecules/product-carousel";
import { APP_ROUTES } from "@/constants/routes";
import { TProduct } from "@/domain/products/types/products.model";
import { TUserFavoriteProductItem } from "@/domain/user-favorite-products/types/user-favorite-products.model";
import { userFavoriteProductsUseCase } from "@/domain/user-favorite-products/use-cases";
import { useAuthStore } from "@/hooks/auth/use-auth-store";
import { useConfig } from "@/hooks/config/use-config";
import { useLoadOnce } from "@ecommerce/ui";
import usePagination from "@/hooks/use-pagination";
import { Heart } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useMemo } from "react";
import { DiscoverySectionSkeleton } from "./skeletons";

export const FavoriteSection = () => {
  const user = useAuthStore((state) => state.user);
  const { language } = useConfig();
  const t = useTranslations("HomePage.discovery");
  const { data, getData } = usePagination<
    TUserFavoriteProductItem,
    { page: number; limit: number; search: string }
  >({
    initialData: null,
    isSyncWithSearchParams: false,
    fetchPage: (params) =>
      userFavoriteProductsUseCase.getUserFavoriteProductsUseCase.execute({
        page: params.page || 1,
        limit: params.limit || 10,
      }),
  });

  const fetchFavorites = useCallback(() => getData({ page: 1 }), [getData]);
  const shouldLoad = Boolean(user?.id);
  const { loading: initialLoading } = useLoadOnce(fetchFavorites, shouldLoad);

  const products = useMemo(
    () =>
      data.items
        .map((favorite) => favorite.product)
        .filter((product): product is TProduct => Boolean(product)),
    [data.items],
  );

  if (!shouldLoad) return null;

  return (
    <DiscoverySectionSkeleton loading={initialLoading} total={products.length}>
      <ProductCarousel
        title={t("wishlist")}
        href={APP_ROUTES.FAVORITES}
        icon={Heart}
        products={products}
        rows={2}
        lang={language}
      />
    </DiscoverySectionSkeleton>
  );
};

export default FavoriteSection;
