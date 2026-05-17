"use client";

import { useCallback } from "react";
import { productsUseCase } from "@/domain/products/use-cases";
import { TProduct } from "@/domain/products/types/products.model";
import { usePagination } from "@/hooks/use-pagination";

const LIMIT = 15;
const INITIAL_META = {
  total: 0,
  page: 0,
  limit: LIMIT,
  totalPages: 1,
};

export const useLoadRecentViewedProducts = () => {
  const fetchRecentViewedPage = useCallback(
    (params: { page: number; limit: number }) =>
      productsUseCase.getRecentlyViewed.execute(params),
    [],
  );

  const { items, meta, hasMore, loading, loadingMore, loadPage, loadMore } =
    usePagination<TProduct>({
      initialItems: [],
      initialMeta: INITIAL_META,
      fetchPage: fetchRecentViewedPage,
      getItemKey: (product) => product.id,
    });

  return {
    recentViewedProducts: items,
    loading,
    loadingMore,
    page: meta.page,
    hasMore,
    total: meta.total,
    fetchRecentViewedProducts: () => loadPage(1),
    fetchMore: loadMore,
  };
};
