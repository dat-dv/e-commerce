"use client";

import { StateCreator } from "zustand";
import { devtools } from "zustand/middleware";
import { createStore } from "zustand/vanilla";
import { PUBLIC_ENV } from "@/config/public.env.config";
import { EProductSort } from "@ecommerce/shared";
import {
  IProductsPageStore,
  IProductsPageState,
} from "./products-page-store.type";

const createProductsPageStoreCreator =
  (initState?: Partial<IProductsPageState>): StateCreator<IProductsPageStore> =>
  (set, _get, _store) => {
    const state: IProductsPageStore = {
      products: [],
      total: 0,
      currentPage: 1,
      totalPages: 1,
      loading: false,
      category_id: null,
      sort: EProductSort.DEFAULT.toString(),
      ...initState,
      setProducts: (products, total, totalPages) =>
        set({ products, total, totalPages }),
      setPage: (currentPage) => set({ currentPage }),
      setFilters: (filters) =>
        set((state) => ({ ...state, ...filters, currentPage: 1 })),
      clearFilter: (key) =>
        set((state) => ({
          ...state,
          [key]: key === "sort" ? EProductSort.DEFAULT.toString() : undefined,
          currentPage: 1,
        })),
      resetFilters: () =>
        set((state) => ({
          ...state,
          sort: EProductSort.DEFAULT.toString(),
          min_price: undefined,
          max_price: undefined,
          rating: undefined,
          search: undefined,
          currentPage: 1,
        })),
      setLoading: (loading) => set({ loading }),
      hydrate: (data) => set((state) => ({ ...state, ...data })),
    };

    return state;
  };

export const createProductsPageStore = (
  initState?: Partial<IProductsPageState>,
) =>
  createStore<IProductsPageStore>()(
    devtools(createProductsPageStoreCreator(initState), {
      name: "ProductsPageStore",
      enabled: PUBLIC_ENV.IS_DEBUG,
    }),
  );
