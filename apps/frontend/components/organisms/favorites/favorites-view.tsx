"use client";

import AppContainer from "@/components/atoms/app-container";
import { DiscoveryCarouselSection } from "@/components/organisms/discovery-sections";
import { TUserFavoriteProductItem } from "@/domain/user-favorite-products/types/user-favorite-products.model";
import { userFavoriteProductsUseCase } from "@/domain/user-favorite-products/use-cases";
import usePagination from "@/hooks/use-pagination";
import { PaginatedInitialData } from "@/utils/request/request.types";
import FavoritesBanner from "./favorite-banner";
import FavoritesGrid from "./favorites-list";

interface FavoritesViewProps {
  initialData: PaginatedInitialData<TUserFavoriteProductItem>;
}

export const FavoritesView = ({ initialData }: FavoritesViewProps) => {
  const { data, loading, getData } = usePagination<
    TUserFavoriteProductItem,
    { page: number; limit: number; search: string }
  >({
    isSyncWithSearchParams: false,
    initialData,
    fetchPage: (params) =>
      userFavoriteProductsUseCase.getUserFavoriteProductsUseCase.execute(
        params.page,
        params.limit,
      ),
  });

  const hasMore = data.meta.page < data.meta.totalPages;
  const fetchMore = () => {
    getData({ page: data.meta.page + 1 });
  };

  return (
    <AppContainer>
      <FavoritesBanner count={data.meta.total} />
      <div className="space-y-12 sm:space-y-16 lg:space-y-24">
        <FavoritesGrid
          favorites={data.items}
          loading={loading}
          loadingMore={loading}
          hasMore={hasMore}
          fetchMore={fetchMore}
        />
        <DiscoveryCarouselSection exclude={["favorites"]} />
      </div>
    </AppContainer>
  );
};
