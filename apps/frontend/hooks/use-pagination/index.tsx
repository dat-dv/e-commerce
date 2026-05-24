"use client";

import useAppRouter from "@/hooks/use-native-router";
import type { AppRouterNavigateOptions } from "@/hooks/use-native-router/use-app-router.types";
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

type PaginationFilterChange<TParams extends PaginationQueryParams> = {
  key: Exclude<keyof TParams, "page" | "limit">;
  value: TParams[Exclude<keyof TParams, "page" | "limit">] | null;
};

type PaginationFilterKey<TParams extends PaginationQueryParams> = Exclude<
  keyof TParams,
  "page" | "limit"
>;

const DEFAULT_CLIENT_NAVIGATE_OPTIONS: AppRouterNavigateOptions = {
  merge: true,
  ssr: false,
  scroll: false,
};

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
    async (
      params: Partial<TParams>,
      options: AppRouterNavigateOptions = DEFAULT_CLIENT_NAVIGATE_OPTIONS,
    ) => {
      const paramsWithPagination = {
        limit: data.meta.limit,
        ...params,
      } as Partial<TParams>;
      const nextParams = (
        options.merge
          ? { ...router.routerState, ...paramsWithPagination }
          : paramsWithPagination
      ) as Partial<TParams>;

      if (options.ssr) {
        router.push(nextParams, options);
        return;
      }

      const res = await fetchPage(nextParams);
      router.replace(nextParams, options);

      startTransition(() => {
        if (nextParams.page && nextParams.page > 1) {
          setData((prev) => ({
            items: [...(prev?.items || []), ...(res?.data?.items || [])],
            meta: res.data.meta,
          }));
        } else {
          setData(res.data);
        }
      });
    },
    [data.meta.limit, fetchPage, router],
  );

  const getFirstPage = useCallback(
    async (
      params: Partial<TParams>,
      options: AppRouterNavigateOptions = DEFAULT_CLIENT_NAVIGATE_OPTIONS,
    ) => {
      const paramsWithPagination = {
        limit: data.meta.limit,
        ...params,
      } as Partial<TParams>;
      const nextParams = (
        options.merge
          ? { ...router.routerState, ...paramsWithPagination }
          : paramsWithPagination
      ) as Partial<TParams>;

      if (options.ssr) {
        router.push(nextParams, options);
        return;
      }

      const res = await fetchPage(nextParams);
      router.replace(nextParams, options);

      startTransition(() => {
        setData(res.data);
      });
    },
    [data.meta.limit, fetchPage, router],
  );

  const onChangePagination = useCallback(
    async (
      page: number,
      options = {
        merge: true,
        ssr: false,
        scroll: false,
      },
    ) => {
      const paginationParams = {
        page,
        limit: data.meta.limit,
      } as Partial<TParams>;
      const nextParams = (
        options.merge
          ? { ...router.routerState, ...paginationParams }
          : paginationParams
      ) as Partial<TParams>;

      if (options.ssr) {
        router.push(nextParams, options);

        return;
      }

      const res = await fetchPage(nextParams);

      router.push(nextParams, { ...options, ssr: false });

      startTransition(() => {
        if (options.merge) {
          setData((prev) => ({
            items: [...(prev?.items || []), ...(res?.data?.items || [])],
            meta: res.data.meta,
          }));
        } else {
          setData(res.data);
        }
      });
    },
    [fetchPage, router, data.meta.limit],
  );

  const onChangeFilter = useCallback(
    (
      filters: PaginationFilterChange<TParams>[],
      options: AppRouterNavigateOptions = DEFAULT_CLIENT_NAVIGATE_OPTIONS,
    ) => {
      const nextParams = Object.fromEntries(
        filters.map(({ key, value }) => [key, value]),
      ) as Partial<TParams>;

      return getData({ page: 1, ...nextParams }, options);
    },
    [getData],
  );

  const onClearFilter = useCallback(
    (
      key: PaginationFilterKey<TParams>,
      options: AppRouterNavigateOptions = DEFAULT_CLIENT_NAVIGATE_OPTIONS,
    ) => {
      return getData({ page: 1, [key]: null } as Partial<TParams>, options);
    },
    [getData],
  );

  const onResetFilters = useCallback(
    (
      params: Partial<Omit<TParams, "page" | "limit">>,
      options: AppRouterNavigateOptions = DEFAULT_CLIENT_NAVIGATE_OPTIONS,
    ) => {
      return getData({ page: 1, ...params } as Partial<TParams>, options);
    },
    [getData],
  );

  return {
    data,
    updatePaginationData,
    getData,
    loading,
    getFirstPage,
    router,
    onChangePagination,
    onChangeFilter,
    onClearFilter,
    onResetFilters,
  };
};

export default usePagination;
