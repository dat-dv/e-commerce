import { StateCreator } from "zustand";
import { devtools } from "zustand/middleware";
import { createStore } from "zustand/vanilla";
import { PUBLIC_ENV } from "@/config/public.env.config";
import {
  ICategoriesStore,
  ICategoriesStoreState,
} from "./categories-store.type";

const createCategoriesStoreCreator =
  (
    initState?: Partial<ICategoriesStoreState>,
  ): StateCreator<ICategoriesStore> =>
  (set, _get, _store) => {
    const state: ICategoriesStore = {
      categories: [],
      loading: false,
      pagination: undefined,
      ...initState,
      setCategories: (categories) => set({ categories }),
      setLoading: (loading) => set({ loading }),
      hydrate: (data) => set((state) => ({ ...state, ...data })),
    };

    return state;
  };

export const createCategoriesStore = (
  initState?: Partial<ICategoriesStoreState>,
) =>
  createStore<ICategoriesStore>()(
    devtools(createCategoriesStoreCreator(initState), {
      name: "CategoriesStore",
      enabled: PUBLIC_ENV.IS_DEBUG,
    }),
  );
