"use client";

import {
  PAGINATION_LIMITS,
  createInitialPaginationMeta,
} from "@/constants/pagination.constant";
import { TProduct } from "@/domain/products/types/products.model";
import { productsUseCase } from "@/domain/products/use-cases";
import { usePaginationWithSSRData } from "@/hooks/use-pagination";
import { useCallback } from "react";

const LIMIT = PAGINATION_LIMITS.DEFAULT;
const INITIAL_META = createInitialPaginationMeta(LIMIT);

export const useLoadRecentViewedProducts = ({
  initialItems = [],
}: {
  initialItems?: TProduct[];
} = {}) => {
  const fetchRecentViewedPage = useCallback(
    (params: { page: number; limit: number }) =>
      productsUseCase.getRecentlyViewed.execute(params),
    [],
  );

  const { items, meta, hasMore, loading, loadingMore, loadPage, loadMore } =
    usePaginationWithSSRData<TProduct, { page: number; limit: number }>({
      initialData: {
        items: initialItems,
        meta: INITIAL_META,
      },
      fetchPage: fetchRecentViewedPage,
      getItemKey: (item) => item.id,
    });
  const fetchRecentViewedProducts = useCallback(() => loadPage(1), [loadPage]);

  return {
    recentViewedProducts: items,
    loading,
    loadingMore,
    page: meta.page,
    hasMore,
    total: meta.total,
    fetchRecentViewedProducts,
    fetchMore: loadMore,
  };
};
