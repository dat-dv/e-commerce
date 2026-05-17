"use client";

import { useFavorites } from "@/hooks/favorites/use-favorites";

import FavoritesGrid from "./favorites-list";
import FavoritesBanner from "./favorite-banner";
import AppContainer from "@/components/atoms/app-container";

export const FavoritesView = () => {
  const favoriteProps = useFavorites();

  return (
    <>
      <FavoritesBanner count={favoriteProps.meta.total} />
      <AppContainer>
        <FavoritesGrid {...favoriteProps} />
      </AppContainer>
    </>
  );
};
