import { useContext } from "react";
import { useStore } from "zustand";
import { FavoritesContext } from "@/components/molecules/providers/favorites-provider";
import { IFavoritesStore } from "@/store/favorites-store/favorites-store.type";

/**
 * useFavoritesStore safely selects slices of state from the FavoritesStore.
 * Why: Guarantees scoped component re-renders only when specified slices change.
 */
export const useFavoritesStore = <T>(
  selector: (state: IFavoritesStore) => T,
): T => {
  const store = useContext(FavoritesContext);
  if (!store) {
    throw new Error("Missing FavoritesProvider");
  }

  return useStore(store, selector);
};
