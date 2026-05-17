import { StateCreator } from "zustand";
import { devtools } from "zustand/middleware";
import { createStore } from "zustand/vanilla";
import { PUBLIC_ENV } from "@/config/public.env.config";
import {
  IRecommendedStore,
  IRecommendedStoreState,
} from "./recommended-store.type";

const createRecommendedStoreCreator =
  (
    initState?: Partial<IRecommendedStoreState>,
  ): StateCreator<IRecommendedStore> =>
  (set, _get, _store) => {
    const state: IRecommendedStore = {
      recommendedProducts: [],
      loading: false,
      page: 1,
      total: 0,
      hasMore: true,
      ...initState,
      setRecommendedProducts: (products) =>
        set({ recommendedProducts: products }),
      appendRecommendedProducts: (products) =>
        set((state) => ({
          recommendedProducts: [...state.recommendedProducts, ...products],
        })),
      setLoading: (loading) => set({ loading }),
      setPage: (page) => set({ page }),
      setTotal: (total) => set({ total }),
      setHasMore: (hasMore) => set({ hasMore }),
      hydrate: (data) => set((state) => ({ ...state, ...data })),
    };

    return state;
  };

export const createRecommendedStore = (
  initState?: Partial<IRecommendedStoreState>,
) =>
  createStore<IRecommendedStore>()(
    devtools(createRecommendedStoreCreator(initState), {
      name: "RecommendedStore",
      enabled: PUBLIC_ENV.IS_DEBUG,
    }),
  );
