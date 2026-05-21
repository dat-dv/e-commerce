"use client";

import AppContainer from "@/components/atoms/app-container";
import { DiscoveryCarouselSection } from "@/components/organisms/discovery-sections";
import { TUserFavoriteProductItem } from "@/domain/user-favorite-products/types/user-favorite-products.model";
import { userFavoriteProductsUseCase } from "@/domain/user-favorite-products/use-cases";
import { usePagination } from "@/hooks/use-pagination";
import { IPaginationMeta } from "@/utils/request/request.types";
import FavoritesBanner from "./favorite-banner";
import FavoritesGrid from "./favorites-list";

interface FavoritesViewProps {
  initialItems: TUserFavoriteProductItem[];
  initialMeta: IPaginationMeta;
}

export const FavoritesView = ({
  initialItems,
  initialMeta,
}: FavoritesViewProps) => {
  const {
    items: favorites,
    meta,
    hasMore,
    loading,
    loadingMore,
    loadMore: fetchMore,
  } = usePagination<TUserFavoriteProductItem, { page: number; limit: number }>({
    initialData: {
      items: initialItems,
      meta: initialMeta,
    },
    fetchPage: ({ page, limit }) =>
      userFavoriteProductsUseCase.getUserFavoriteProductsUseCase.execute(
        page,
        limit,
      ),
    getItemKey: (item) => item.productId,
  });

  return (
    <AppContainer>
      <FavoritesBanner count={meta.total} />
      <div className="space-y-12 sm:space-y-16 lg:space-y-24">
        <FavoritesGrid
          favorites={favorites}
          loading={loading}
          loadingMore={loadingMore}
          hasMore={hasMore}
          fetchMore={fetchMore}
        />
        <DiscoveryCarouselSection exclude={["favorites"]} />
      </div>
    </AppContainer>
  );
};
