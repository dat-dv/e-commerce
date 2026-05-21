"use client";

import {
  PAGINATION_LIMITS,
  createInitialPaginationMeta,
} from "@/constants/pagination.constant";
import { TProduct } from "@/domain/products/types/products.model";
import { productsUseCase } from "@/domain/products/use-cases";
import usePagination from "@/hooks/use-pagination";
import { useCallback, useMemo, useRef, useState } from "react";

const LIMIT = PAGINATION_LIMITS.DEFAULT;
const INITIAL_META = createInitialPaginationMeta(LIMIT);
const EMPTY_INITIAL_ITEMS: TProduct[] = [];

export const useLoadRecentViewedProducts = ({
  initialItems,
}: {
  initialItems?: TProduct[];
} = {}) => {
  const loadingRef = useRef(false);
  const [networkLoading, setNetworkLoading] = useState(false);

  const initialData = useMemo(
    () => ({
      items: initialItems ?? EMPTY_INITIAL_ITEMS,
      meta: INITIAL_META,
    }),
    [initialItems],
  );

  const fetchRecentViewedPage = useCallback(
    (params: Partial<{ page: number; limit: number; search: string }>) =>
      productsUseCase.getRecentlyViewed.execute({
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
    fetchPage: fetchRecentViewedPage,
  });

  const loadPage = useCallback(
    async (page: number) => {
      if (loadingRef.current) return;

      loadingRef.current = true;
      setNetworkLoading(true);

      try {
        await getData({ page });
      } finally {
        loadingRef.current = false;
        setNetworkLoading(false);
      }
    },
    [getData],
  );

  const hasMore = data.meta.page < data.meta.totalPages;
  const fetchRecentViewedProducts = useCallback(() => loadPage(1), [loadPage]);
  const fetchMore = useCallback(() => {
    if (!hasMore) return;
    return loadPage(data.meta.page + 1);
  }, [data.meta.page, hasMore, loadPage]);
  const isLoading = loading || networkLoading;

  return {
    recentViewedProducts: data.items,
    loading: isLoading,
    loadingMore: isLoading,
    page: data.meta.page,
    hasMore,
    total: data.meta.total,
    fetchRecentViewedProducts,
    fetchMore,
  };
};
