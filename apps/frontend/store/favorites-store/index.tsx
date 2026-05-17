import { StateCreator } from "zustand";
import { devtools } from "zustand/middleware";
import { createStore } from "zustand/vanilla";
import { PUBLIC_ENV } from "@/config/public.env.config";
import { IFavoritesStore, IFavoritesStoreState } from "./favorites-store.type";

const createFavoritesStoreCreator =
  (initState?: Partial<IFavoritesStoreState>): StateCreator<IFavoritesStore> =>
  (set, _get, _store) => {
    const state: IFavoritesStore = {
      favorites: [],
      loading: false,
      loadingMore: false,
      page: 1,
      total: 0,
      hasMore: true,
      ...initState,
      setFavorites: (favorites) => set({ favorites }),
      appendFavorites: (favorites) =>
        set((state) => ({
          favorites: [...state.favorites, ...favorites],
        })),
      addFavorite: (favorite) =>
        set((state) => {
          const alreadyExists = state.favorites.some(
            (fav) => fav.productId === favorite.productId,
          );
          if (alreadyExists) return {};
          return {
            favorites: [favorite, ...state.favorites],
            total: state.total + 1,
          };
        }),
      removeFavorite: (productId) =>
        set((state) => ({
          favorites: state.favorites.filter(
            (fav) => fav.productId !== productId,
          ),
          total: Math.max(0, state.total - 1),
        })),
      setLoading: (loading) => set({ loading }),
      setLoadingMore: (loadingMore) => set({ loadingMore }),
      setPage: (page) => set({ page }),
      setTotal: (total) => set({ total }),
      setHasMore: (hasMore) => set({ hasMore }),
      hydrate: (data) => set((state) => ({ ...state, ...data })),
    };

    return state;
  };

export const createFavoritesStore = (
  initState?: Partial<IFavoritesStoreState>,
) =>
  createStore<IFavoritesStore>()(
    devtools(createFavoritesStoreCreator(initState), {
      name: "FavoritesStore",
      enabled: PUBLIC_ENV.IS_DEBUG,
    }),
  );
