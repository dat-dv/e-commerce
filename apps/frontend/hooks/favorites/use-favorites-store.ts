import { useContext } from "react";
import { useStore } from "zustand";
import { FavoritesContext } from "@/components/molecules/providers/favorites-provider";
import { IFavoritesStore } from "@/store/favorites-store/favorites-store.type";

export const useFavoritesStore = <T>(
  selector: (state: IFavoritesStore) => T,
): T => {
  const store = useContext(FavoritesContext);
  if (!store) {
    throw new Error("Missing FavoritesProvider");
  }

  return useStore(store, selector);
};
