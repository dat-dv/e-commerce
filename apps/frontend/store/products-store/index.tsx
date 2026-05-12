import { StateCreator } from "zustand";
import { devtools } from "zustand/middleware";
import { createStore } from "zustand/vanilla";
import { PUBLIC_ENV } from "@/config/public.env.config";
import { IProductsStore, IProductsStoreState } from "./products-store.type";

const createProductsStoreCreator =
  (initState?: Partial<IProductsStoreState>): StateCreator<IProductsStore> =>
  (set, _get, _store) => {
    const state: IProductsStore = {
      flashSaleProducts: [],
      recommendedProducts: [],
      sections: [],
      loading: false,
      ...initState,
      lang: initState?.lang || "vi",
      setFlashSaleProducts: (products) => set({ flashSaleProducts: products }),
      setRecommendedProducts: (products) =>
        set({ recommendedProducts: products }),
      setSections: (sections) => set({ sections }),
      setLoading: (loading) => set({ loading }),
      hydrate: (data) => set((state) => ({ ...state, ...data })),
    };

    return state;
  };

export const createProductsStore = (initState?: Partial<IProductsStoreState>) =>
  createStore<IProductsStore>()(
    devtools(createProductsStoreCreator(initState), {
      name: "ProductsStore",
      enabled: PUBLIC_ENV.IS_DEBUG,
    }),
  );
