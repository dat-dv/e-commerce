"use client";

import { useFavorites } from "@/hooks/favorites/use-favorites";

import FavoritesGrid from "./favorites-list";
import FavoritesBanner from "./favorite-banner";
import AppContainer from "@/components/atoms/app-container";
import { DiscoveryCarouselSection } from "@/components/organisms/discovery-sections";
import { TUserFavoriteProductItem } from "@/domain/user-favorite-products/types/user-favorite-products.model";
import { IPaginationMeta } from "@/utils/request/request.types";

interface FavoritesViewProps {
  initialItems: TUserFavoriteProductItem[];
  initialMeta: IPaginationMeta;
}

export const FavoritesView = ({
  initialItems,
  initialMeta,
}: FavoritesViewProps) => {
  const { favorites, loading, loadingMore, hasMore, fetchMore, meta } =
    useFavorites({
      initialItems,
      initialMeta,
    });

  return (
    <AppContainer>
      <FavoritesBanner count={meta.total} />
      <div className="space-y-24">
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
