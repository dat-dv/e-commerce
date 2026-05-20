import {
  ApiPaginatedResponse,
  IPaginationMeta,
} from "@/utils/request/request.types";
import { useCallback, useMemo, useRef, useState } from "react";
import useAppRouter from "../use-native-router";

type PaginationParams = {
  page: number;
  limit: number;
};

type ExtraParams = Record<
  string,
  string | number | boolean | null | undefined | object
>;

type LoadPageOptions = {
  firstLoad?: boolean;
  syncQuery?: boolean;
};

type PaginationQueryParams = PaginationParams & ExtraParams;

interface UsePaginationParams<
  T,
  TParams extends PaginationQueryParams = PaginationParams,
> {
  initialData: {
    items: T[];
    meta: IPaginationMeta;
  };
  defaultParams?: Partial<TParams>;
  defaultPathname?: string;
  syncUrlParams?: boolean;
  fetchPage: (params: TParams) => Promise<ApiPaginatedResponse<T>>;
  getItemKey?: (item: T) => string | number;
}

export const usePaginationWithSSRData = <
  T,
  TParams extends PaginationQueryParams = PaginationParams,
>({
  initialData,
  defaultParams,
  defaultPathname,
  syncUrlParams = false,
  fetchPage,
  getItemKey,
}: UsePaginationParams<T, TParams>) => {
  const [items, setItems] = useState<T[]>(() => initialData.items);
  const [meta, setMeta] = useState<IPaginationMeta>(() => initialData.meta);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resolvedDefaultParams = useMemo(() => {
    return {
      page: defaultParams?.page || initialData.meta.page || 1,
      limit: defaultParams?.limit || initialData.meta.limit || 10,
      ...(defaultParams ?? {}),
    } as TParams;
  }, [defaultParams, initialData.meta.limit, initialData.meta.page]);

  const { clear, routerState, replace } = useAppRouter<TParams>({
    defaultParams: resolvedDefaultParams,
    syncUrlParams: defaultPathname,
    updateUrl: syncUrlParams,
  });

  const loadingRef = useRef(false);
  const loadingMoreRef = useRef(false);
  const initialLimit = initialData.meta.limit;

  const hasMore = meta.page < meta.totalPages;

  const totalPages = useMemo(
    () => Math.max(meta.totalPages, 1),
    [meta.totalPages],
  );

  const buildParams = useCallback(
    (
      paginationParams: PaginationParams,
      overrideParams?: Partial<TParams>,
    ): TParams => {
      return {
        ...routerState,
        ...(overrideParams ?? {}),
        ...paginationParams,
      } as TParams;
    },
    [routerState],
  );

  const appendItems = useCallback(
    (nextItems: T[]) => {
      setItems((currentItems) => {
        if (!getItemKey) return [...currentItems, ...nextItems];

        const currentKeys = new Set(currentItems.map(getItemKey));

        return [
          ...currentItems,
          ...nextItems.filter((item) => !currentKeys.has(getItemKey(item))),
        ];
      });
    },
    [getItemKey],
  );

  const loadPage = useCallback(
    async (
      nextPage: number,
      overrideParams?: Partial<TParams>,
      options: LoadPageOptions = {},
    ) => {
      if (loadingRef.current) return;

      const isFirstLoad = options.firstLoad ?? false;
      const shouldSyncQuery = options.syncQuery ?? true;

      loadingRef.current = true;

      if (!isFirstLoad) {
        setLoading(true);
      }

      setError(null);

      try {
        const nextLimit =
          Number(overrideParams?.limit ?? routerState.limit) || initialLimit;

        const response = await fetchPage(
          buildParams(
            {
              page: nextPage,
              limit: nextLimit,
            },
            overrideParams,
          ),
        );

        if (response.status !== "success") return;

        setItems(response.data.items);
        setMeta(response.data.meta);

        if (shouldSyncQuery) {
          replace((response.data.meta || {}) as object as TParams);
        }
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to load page",
        );
      } finally {
        loadingRef.current = false;

        if (!isFirstLoad) {
          setLoading(false);
        }
      }
    },
    [buildParams, routerState.limit, fetchPage, initialLimit, replace],
  );

  const loadMore = useCallback(
    async (
      overrideParams?: Partial<TParams>,
      options: Pick<LoadPageOptions, "syncQuery"> = {},
    ) => {
      if (loadingMoreRef.current || !hasMore) return;

      const shouldSyncQuery = options.syncQuery ?? true;

      loadingMoreRef.current = true;
      setLoadingMore(true);
      setError(null);

      try {
        const response = await fetchPage(
          buildParams(
            {
              page: meta.page + 1,
              limit: meta.limit,
            },
            overrideParams,
          ),
        );

        if (response.status !== "success") return;

        appendItems(response.data.items);
        setMeta(response.data.meta);

        if (shouldSyncQuery) {
          replace((response.data.meta || {}) as object as TParams);
        }
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to load more items",
        );
      } finally {
        loadingMoreRef.current = false;
        setLoadingMore(false);
      }
    },
    [
      appendItems,
      buildParams,
      fetchPage,
      hasMore,
      meta.limit,
      meta.page,
      replace,
    ],
  );

  const reset = useCallback(
    (next?: {
      items?: T[];
      meta?: IPaginationMeta;
      keepQuery?: Record<string, boolean>;
    }) => {
      const nextItems = next?.items ?? initialData.items;
      const nextMeta = next?.meta ?? initialData.meta;

      setItems(nextItems);
      setMeta(nextMeta);
      setError(null);
      setLoading(false);
      setLoadingMore(false);

      loadingRef.current = false;
      loadingMoreRef.current = false;

      clear(next?.keepQuery);
    },
    [initialData.items, initialData.meta, clear],
  );

  return {
    items,
    meta,

    totalPages,
    hasMore,

    loading,
    loadingMore,
    error,

    loadPage,
    loadMore,
    reset,

    routerState,
    update: replace,
  };
};
