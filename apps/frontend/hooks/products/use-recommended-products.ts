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

export const useRecommendedProducts = ({
  initialItems = [],
}: {
  initialItems?: TProduct[];
} = {}) => {
  const fetchRecommendedPage = useCallback(
    (params: { page: number; limit: number }) =>
      productsUseCase.getRecommended.execute(params),
    [],
  );

  const { items, meta, hasMore, loading, loadPage, loadMore } =
    usePaginationWithSSRData<TProduct, { page: number; limit: number }>({
      initialItems: initialItems,
      initialMeta: INITIAL_META,
      fetchPage: fetchRecommendedPage,
      getItemKey: (item) => item.id,
    });

  const fetchRecommendedProducts = useCallback(() => loadPage(1), [loadPage]);

  return {
    recommendedProducts: items,
    isLoading: loading,
    page: meta.page,
    hasMore,
    total: meta.total,
    fetchRecommendedProducts,
    fetchMore: loadMore,
  };
};
