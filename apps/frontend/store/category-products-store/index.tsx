"use client";

import { StateCreator } from "zustand";
import { devtools } from "zustand/middleware";
import { createStore } from "zustand/vanilla";
import { EProductSort } from "@ecommerce/shared";
import { PUBLIC_ENV } from "@/config/public.env.config";
import {
  ICategoryProductsState,
  ICategoryProductsStore,
} from "./category-products-store.type";

const DEFAULT_SORT = EProductSort.DEFAULT;

const buildCategoryProductsSearchParams = (
  state: ICategoryProductsState,
): string => {
  const params = new URLSearchParams();

  if (state.currentPage > 1) {
    params.set("page", String(state.currentPage));
  }

  if (state.sort && String(state.sort) !== String(DEFAULT_SORT)) {
    params.set("sort", String(state.sort));
  }

  if (state.search) {
    params.set("search", state.search);
  }

  if (state.min_price !== undefined) {
    params.set("min_price", String(state.min_price));
  }

  if (state.max_price !== undefined) {
    params.set("max_price", String(state.max_price));
  }

  if (state.rating !== undefined) {
    params.set("rating", String(state.rating));
  }

  return params.toString();
};

const syncCategoryProductsUrl = (state: ICategoryProductsState) => {
  if (typeof window === "undefined") return;

  const queryString = buildCategoryProductsSearchParams(state);

  const nextUrl = queryString
    ? `${window.location.pathname}?${queryString}`
    : window.location.pathname;

  window.history.replaceState({}, "", nextUrl);
};

const createCategoryProductsStoreCreator =
  (
    initState?: Partial<ICategoryProductsState>,
  ): StateCreator<ICategoryProductsStore> =>
  (set) => ({
    products: [],
    total: 0,
    currentPage: 1,
    totalPages: 1,
    loading: false,

    sort: DEFAULT_SORT,
    search: undefined,
    min_price: undefined,
    max_price: undefined,
    rating: undefined,

    ...initState,

    setProducts: (products, total, totalPages) =>
      set({
        products,
        total,
        totalPages,
      }),

    setLoading: (loading) =>
      set({
        loading,
      }),

    setFilters: (filters) =>
      set((state) => {
        const nextState = {
          ...state,
          ...filters,
          currentPage: 1,
        };

        syncCategoryProductsUrl(nextState);

        return nextState;
      }),

    setPage: (currentPage) =>
      set((state) => {
        const nextState = {
          ...state,
          currentPage,
        };

        syncCategoryProductsUrl(nextState);

        return nextState;
      }),

    clearFilter: (key) =>
      set((state) => {
        const nextState = {
          ...state,
          [key]: key === "sort" ? DEFAULT_SORT : undefined,
          currentPage: 1,
        };

        syncCategoryProductsUrl(nextState);

        return nextState;
      }),

    resetFilters: () =>
      set((state) => {
        const nextState = {
          ...state,
          sort: DEFAULT_SORT,
          search: undefined,
          min_price: undefined,
          max_price: undefined,
          rating: undefined,
          currentPage: 1,
        };

        syncCategoryProductsUrl(nextState);

        return nextState;
      }),

    hydrate: (data) =>
      set((state) => ({
        ...state,
        ...data,
      })),
  });

export const createCategoryProductsStore = (
  initState?: Partial<ICategoryProductsState>,
) =>
  createStore<ICategoryProductsStore>()(
    devtools(createCategoryProductsStoreCreator(initState), {
      name: "CategoryProductsStore",
      enabled: PUBLIC_ENV.IS_DEBUG,
    }),
  );
