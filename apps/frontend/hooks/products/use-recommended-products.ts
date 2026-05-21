"use client";

import { TProduct } from "@/domain/products/types/products.model";
import { productsUseCase } from "@/domain/products/use-cases";
import usePagination from "@/hooks/use-pagination";
import { ApiListResponse } from "@/utils/request/request.types";
import { useCallback } from "react";

export const useRecommendedProducts = ({
  initialData,
}: {
  initialData?: ApiListResponse<TProduct> | null;
}) => {
  const fetchRecommendedPage = useCallback(
    (params: Partial<{ page: number; limit: number; search: string }>) =>
      productsUseCase.getRecommended.execute({
        page: params.page,
        limit: params.limit,
      }),
    [],
  );

  const { data, loading, getData } = usePagination<
    TProduct,
    { page: number; limit: number; search: string }
  >({
    isSyncWithSearchParams: false,
    initialData: initialData || null,
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
