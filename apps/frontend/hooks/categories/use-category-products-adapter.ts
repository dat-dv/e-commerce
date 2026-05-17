import { useCallback } from "react";
import { useShallow } from "zustand/react/shallow";
import { EProductSort } from "@ecommerce/shared";

import { productsUseCase } from "@/domain/products/use-cases";
import { PAGINATION_LIMITS } from "@/constants/pagination.constant";
import { useCategoryProductsStore } from "./use-category-products-store";
import {
  CategoryProductsFilterKey,
  ICategoryProductsFilters,
} from "@/store/category-products-store/category-products-store.type";

interface FetchCategoryProductsParams extends Partial<ICategoryProductsFilters> {
  page?: number;
  limit?: number;
}

export const useCategoryProductsAdapter = (categorySlug: string) => {
  const store = useCategoryProductsStore(
    useShallow((state) => ({
      currentPage: state.currentPage,
      totalPages: state.totalPages,

      sort: state.sort,
      search: state.search,
      min_price: state.min_price,
      max_price: state.max_price,
      rating: state.rating,

      setProducts: state.setProducts,
      setLoading: state.setLoading,
      setFilters: state.setFilters,
      setPage: state.setPage,
      clearFilter: state.clearFilter,
      resetFilters: state.resetFilters,
    })),
  );

  const buildQuery = useCallback(
    (overrides: FetchCategoryProductsParams = {}) => ({
      category_slug: categorySlug,
      page: overrides.page ?? store.currentPage,
      limit: overrides.limit ?? PAGINATION_LIMITS.CATEGORIES,
      sort: String(overrides.sort ?? store.sort),
      search: overrides.search ?? store.search,
      min_price: overrides.min_price ?? store.min_price,
      max_price: overrides.max_price ?? store.max_price,
      rating: overrides.rating ?? store.rating,
    }),
    [categorySlug, store],
  );

  const fetchProducts = useCallback(
    async (overrides?: FetchCategoryProductsParams) => {
      store.setLoading(true);

      try {
        const response = await productsUseCase.getProducts.execute(
          buildQuery(overrides),
        );

        store.setProducts(
          response.data.items,
          response.data.meta.total,
          response.data.meta.totalPages,
        );
      } finally {
        store.setLoading(false);
      }
    },
    [buildQuery, store],
  );

  const changePage = useCallback(
    async (page: number) => {
      store.setPage(page);
      await fetchProducts({ page });
    },
    [fetchProducts, store],
  );

  const applyFilters = useCallback(
    async (filters: Partial<ICategoryProductsFilters>) => {
      store.setFilters(filters);
      await fetchProducts({ ...filters, page: 1 });
    },
    [fetchProducts, store],
  );

  const clearFilter = useCallback(
    async (key: CategoryProductsFilterKey) => {
      const nextValue = key === "sort" ? EProductSort.DEFAULT : undefined;

      store.clearFilter(key);
      await fetchProducts({ [key]: nextValue, page: 1 });
    },
    [fetchProducts, store],
  );

  const resetFilters = useCallback(async () => {
    const defaultFilters = {
      sort: EProductSort.DEFAULT,
      search: undefined,
      min_price: undefined,
      max_price: undefined,
      rating: undefined,
    };

    store.resetFilters();
    await fetchProducts({ ...defaultFilters, page: 1 });
  }, [fetchProducts, store]);

  const fetchMore = useCallback(async () => {
    if (store.currentPage >= store.totalPages) return;

    const nextPage = store.currentPage + 1;

    store.setPage(nextPage);
    await fetchProducts({ page: nextPage });
  }, [fetchProducts, store]);

  return {
    fetchProducts,
    changePage,
    applyFilters,
    clearFilter,
    resetFilters,
    fetchMore,
  };
};
