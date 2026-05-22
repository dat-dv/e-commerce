"use client";

import useAppRouter from "@/hooks/use-native-router";
import {
  ApiPaginatedResponse,
  IPaginationMeta,
} from "@/utils/request/request.types";
import { useCallback, useEffect, useState, useTransition } from "react";

type PaginationParams = {
  page: number;
  limit: number;
  search: string;
};

type ExtraParams = Record<
  string,
  string | number | boolean | null | undefined | object
>;

type PaginationQueryParams = PaginationParams & ExtraParams;

interface IUsePaginationParams<
  T,
  TParams extends PaginationQueryParams = PaginationParams,
> {
  initialData: {
    items: T[];
    meta: IPaginationMeta;
  } | null;
  extendParams?: Partial<TParams>;
  fetchPage: (params: Partial<TParams>) => Promise<ApiPaginatedResponse<T>>;
  isSyncWithSearchParams: boolean;
}

const usePagination = <
  T,
  TParams extends PaginationQueryParams = PaginationParams,
>({
  initialData,
  extendParams,
  fetchPage,
  isSyncWithSearchParams,
}: IUsePaginationParams<T, TParams>) => {
  const [data, setData] = useState<{
    items: T[];
    meta: IPaginationMeta;
  }>(() => ({
    items: initialData?.items || [],
    meta: initialData?.meta || {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 1,
    },
  }));
  const [loading, startTransition] = useTransition();

  const router = useAppRouter({
    isSyncWithSearchParams,
    extendParams,
  });

  useEffect(() => {
    if (!initialData) return;
    startTransition(() => {
      setData(initialData);
    });
  }, [initialData]);

  const updatePaginationData = setData;

  const getData = useCallback(
    async (params: Partial<TParams>) => {
      const res = await fetchPage(params);
      router.setRouterState((prev) => ({
        ...prev,
        ...params,
      }));

      startTransition(() => {
        if (params.page && params.page > 1) {
          setData((prev) => ({
            items: [...(prev?.items || []), ...(res?.data?.items || [])],
            meta: res.data.meta,
          }));
        } else {
          setData(res.data);
        }
      });
    },
    [fetchPage, router],
  );

  const getFirstPage = useCallback(
    async (params: Partial<TParams>) => {
      const res = await fetchPage(params);
      startTransition(() => {
        setData(res.data);
      });
    },
    [fetchPage],
  );

  const onChangePagination = useCallback(
    async (page: number) => {
      const res = await fetchPage({
        ...router.routerState,
        page,
        limit: data.meta.limit,
      });
      router.push(
        {
          ...router.routerState,
          page,
        },
        { merge: true, ssr: false, scroll: true },
      );

      startTransition(() => {
        setData(res.data);
      });
    },
    [fetchPage, router, data.meta.limit],
  );

  return {
    data,
    updatePaginationData,
    getData,
    loading,
    getFirstPage,
    router,
    onChangePagination,
  };
};

export default usePagination;
