"use client";

import { useCallback, useEffect, useState, useTransition } from "react";

import type {
  PaginatedResponse,
  PaginationData,
  PaginationFetchMode,
  PaginationMeta,
  PaginationParams,
  PaginationQueryParams,
  UsePaginationCoreParams,
} from "./use-pagination-core.types";

const DEFAULT_PAGINATION_META: PaginationMeta = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 1,
};

const shouldAppendPage = <TParams extends PaginationQueryParams>(
  params: Partial<TParams>,
) => Boolean(params.page && params.page > 1);

export const usePaginationCore = <
  T,
  TParams extends PaginationQueryParams = PaginationParams,
>({
  initialData,
  fetchPage,
}: UsePaginationCoreParams<T, TParams>) => {
  const [data, setData] = useState<PaginationData<T>>(() => ({
    items: initialData?.items || [],
    meta: initialData?.meta || DEFAULT_PAGINATION_META,
  }));
  const [loading, startTransition] = useTransition();

  useEffect(() => {
    if (!initialData) return;
    startTransition(() => {
      setData(initialData);
    });
  }, [initialData]);

  const updatePaginationData = setData;

  const updateDataFromResponse = useCallback(
    (response: PaginatedResponse<T>, mode: PaginationFetchMode) => {
      startTransition(() => {
        if (mode === "append") {
          setData((prev) => ({
            items: [...(prev?.items || []), ...(response?.data?.items || [])],
            meta: response.data.meta,
          }));
          return;
        }

        setData(response.data);
      });
    },
    [],
  );

  const fetchData = useCallback(
    async (params: Partial<TParams>, mode: PaginationFetchMode = "replace") => {
      const response = await fetchPage(params);
      updateDataFromResponse(response, mode);
      return response;
    },
    [fetchPage, updateDataFromResponse],
  );

  const getData = useCallback(
    (params: Partial<TParams>) => {
      return fetchData(params, shouldAppendPage(params) ? "append" : "replace");
    },
    [fetchData],
  );

  const getFirstPage = useCallback(
    (params: Partial<TParams>) => {
      return fetchData(params, "replace");
    },
    [fetchData],
  );

  return {
    data,
    updatePaginationData,
    loading,
    fetchData,
    getData,
    getFirstPage,
  };
};
