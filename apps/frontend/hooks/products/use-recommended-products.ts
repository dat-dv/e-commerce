"use client";

import {
  PAGINATION_LIMITS,
  createInitialPaginationMeta,
} from "@/constants/pagination.constant";
import { TProduct } from "@/domain/products/types/products.model";
import { productsUseCase } from "@/domain/products/use-cases";
import usePagination from "@/hooks/use-pagination";
import { useCallback, useMemo } from "react";

const LIMIT = PAGINATION_LIMITS.DEFAULT;
const INITIAL_META = createInitialPaginationMeta(LIMIT);
const EMPTY_INITIAL_ITEMS: TProduct[] = [];

export const useRecommendedProducts = ({
  initialItems,
}: {
  initialItems?: TProduct[];
} = {}) => {
  const initialData = useMemo(
    () => ({
      items: initialItems ?? EMPTY_INITIAL_ITEMS,
      meta: INITIAL_META,
    }),
    [initialItems],
  );

  const fetchRecommendedPage = useCallback(
    (params: Partial<{ page: number; limit: number; search: string }>) =>
      productsUseCase.getRecommended.execute({
        page: params.page || 1,
        limit: params.limit || LIMIT,
      }),
    [],
  );

  const { data, loading, getData } = usePagination<
    TProduct,
    { page: number; limit: number; search: string }
  >({
    isSyncWithSearchParams: false,
    initialData,
    fetchPage: fetchRecommendedPage,
  });

  const fetchRecommendedProducts = useCallback(
    () => getData({ page: 1 }),
    [getData],
  );

  const hasMore = data.meta.page < data.meta.totalPages;
  const fetchMore = useCallback(
    () => getData({ page: data.meta.page + 1 }),
    [data.meta.page, getData],
  );

  return {
    recommendedProducts: data.items,
    isLoading: loading,
    page: data.meta.page,
    hasMore,
    total: data.meta.total,
    fetchRecommendedProducts,
    fetchMore,
  };
};
