"use client";

import { createContext, ReactNode, useState } from "react";
import { createFavoritesStore } from "@/store/favorites-store";
import { IFavoritesStoreState } from "@/store/favorites-store/favorites-store.type";

export type FavoritesStore = ReturnType<typeof createFavoritesStore>;

export const FavoritesContext = createContext<FavoritesStore | null>(null);

export interface FavoritesProviderProps {
  children: ReactNode;
  initState?: Partial<IFavoritesStoreState>;
}

export const FavoritesProvider = ({
  children,
  initState,
}: FavoritesProviderProps) => {
  const [store] = useState(() => createFavoritesStore(initState));

  return (
    <FavoritesContext.Provider value={store}>
      {children}
    </FavoritesContext.Provider>
  );
};
