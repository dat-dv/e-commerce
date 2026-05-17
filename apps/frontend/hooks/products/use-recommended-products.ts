"use client";

import { useCallback, useEffect } from "react";
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

export const useRecommendedProducts = () => {
  const fetchRecommendedPage = useCallback(
    (params: { page: number; limit: number }) =>
      productsUseCase.getRecommended.execute(params),
    [],
  );

  const { items, meta, hasMore, loading, loadPage, loadMore } =
    usePagination<TProduct>({
      initialItems: [],
      initialMeta: INITIAL_META,
      fetchPage: fetchRecommendedPage,
      getItemKey: (product) => product.id,
    });

  useEffect(() => {
    loadPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    recommendedProducts: items,
    isLoading: loading,
    page: meta.page,
    hasMore,
    total: meta.total,
    fetchRecommendedProducts: () => loadPage(1),
    fetchMore: loadMore,
  };
};
