"use client";

import { useFavorites } from "@/hooks/favorites/use-favorites";

import FavoritesGrid from "./favorites-list";
import FavoritesBanner from "./favorite-banner";
import AppContainer from "@/components/atoms/app-container";
import { DiscoveryCarouselSection } from "@/components/organisms/discovery-sections";
import { useLoadOnce } from "@/hooks/use-load-once";

export const FavoritesView = () => {
  const { fetchFavorites, favorites, loading, hasMore, fetchMore, meta } =
    useFavorites();
  useLoadOnce(fetchFavorites);
  return (
    <AppContainer>
      <FavoritesBanner count={meta.total} />
      <div className="space-y-24">
        <FavoritesGrid
          favorites={favorites}
          loading={loading}
          hasMore={hasMore}
          fetchMore={fetchMore}
        />
        <DiscoveryCarouselSection exclude={["favorites"]} />
      </div>
    </AppContainer>
  );
};
