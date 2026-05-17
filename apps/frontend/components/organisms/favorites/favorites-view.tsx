"use client";

import { useFavorites } from "@/hooks/favorites/use-favorites";

import FavoritesGrid from "./favorites-list";
import FavoritesBanner from "./favorite-banner";
import AppContainer from "@/components/atoms/app-container";
import { DiscoveryCarouselSection } from "@/components/organisms/discovery-sections";

export const FavoritesView = () => {
  const favoriteProps = useFavorites();

  return (
    <AppContainer>
      <FavoritesBanner count={favoriteProps.meta.total} />
      <div className="space-y-24 pb-24">
        <FavoritesGrid {...favoriteProps} />
        <div className="pt-12 border-t border-content/[0.05]">
          <DiscoveryCarouselSection exclude={["favorites"]} />
        </div>
      </div>
    </AppContainer>
  );
};
