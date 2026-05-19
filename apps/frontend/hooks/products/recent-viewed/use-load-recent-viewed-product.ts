"use client";

import { useCallback } from "react";
import { productsUseCase } from "@/domain/products/use-cases";
import { TProduct } from "@/domain/products/types/products.model";
import { usePaginationWithSSRData } from "@/hooks/use-pagination";
import {
  PAGINATION_LIMITS,
  createInitialPaginationMeta,
} from "@/constants/pagination.constant";

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
      initialItems: initialItems,
      initialMeta: INITIAL_META,
      params: { page: 1, limit: LIMIT },
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
