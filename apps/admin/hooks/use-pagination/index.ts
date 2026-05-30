"use client";

import {
  type PaginationParams,
  type PaginationQueryParams,
  usePaginationCore,
} from "@ecommerce/ui";
import { useCallback } from "react";

import useAppRouter from "@/hooks/use-native-router";
import type { AppRouterNavigateOptions } from "@/hooks/use-native-router/use-app-router.types";

import type {
  PaginationFilterChange,
  PaginationFilterKey,
  UsePaginationParams,
} from "./use-pagination.types";

const DEFAULT_CLIENT_NAVIGATE_OPTIONS: AppRouterNavigateOptions = {
  merge: true,
  scroll: false,
};

const usePagination = <
  T,
  TParams extends PaginationQueryParams = PaginationParams,
>({
  initialData,
  extendParams,
  resetParams,
  fetchPage,
  isSyncWithSearchParams,
}: UsePaginationParams<T, TParams>) => {
  const pagination = usePaginationCore<T, TParams>({
    initialData,
    fetchPage,
  });
  const {
    data,
    fetchData,
    getData: getPaginationData,
    getFirstPage: getFirstPaginationPage,
    loading,
    updatePaginationData,
  } = pagination;

  const router = useAppRouter({
    isSyncWithSearchParams,
    extendParams,
  });

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

      await getPaginationData(nextParams);
      router.replace(nextParams, options);
    },
    [data.meta.limit, getPaginationData, router],
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

      await getFirstPaginationPage(nextParams);
      router.replace(nextParams, options);
    },
    [data.meta.limit, getFirstPaginationPage, router],
  );

  const onChangePagination = useCallback(
    async (
      page: number,
      options: AppRouterNavigateOptions = DEFAULT_CLIENT_NAVIGATE_OPTIONS,
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

      await fetchData(nextParams, "replace");

      router.push(nextParams, options);
    },
    [data.meta.limit, fetchData, router],
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
    (options: AppRouterNavigateOptions = DEFAULT_CLIENT_NAVIGATE_OPTIONS) => {
      return getData({ page: 1, ...resetParams } as Partial<TParams>, options);
    },
    [getData, resetParams],
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
