import { StateCreator } from "zustand";
import { devtools } from "zustand/middleware";
import { createStore } from "zustand/vanilla";
import { PUBLIC_ENV } from "@/config/public.env.config";
import {
  IRecentViewedStore,
  IRecentViewedStoreState,
} from "./recent-viewed-store.type";

const createRecentViewedStoreCreator =
  (
    initState?: Partial<IRecentViewedStoreState>,
  ): StateCreator<IRecentViewedStore> =>
  (set, _get, _store) => {
    const state: IRecentViewedStore = {
      recentViewedProducts: [],
      loading: false,
      page: 1,
      total: 0,
      hasMore: true,
      ...initState,
      setRecentViewedProducts: (products) =>
        set({ recentViewedProducts: products }),
      setLoading: (loading) => set({ loading }),
      hydrate: (data) => set((state) => ({ ...state, ...data })),
    };

    return state;
  };

export const createRecentViewedStore = (
  initState?: Partial<IRecentViewedStoreState>,
) =>
  createStore<IRecentViewedStore>()(
    devtools(createRecentViewedStoreCreator(initState), {
      name: "RecentViewedStore",
      enabled: PUBLIC_ENV.IS_DEBUG,
    }),
  );
