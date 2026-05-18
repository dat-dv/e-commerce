import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ApiPaginatedResponse,
  IPaginationMeta,
} from "@/utils/request/request.types";
import { useClientSearchParams } from "../use-clien-query-params";

type PaginationParams = {
  page: number;
  limit: number;
};

type ExtraParams = Record<string, unknown>;

type LoadPageOptions = {
  firstLoad?: boolean;
  syncQuery?: boolean;
};

interface UsePaginationParams<T, TParams extends ExtraParams = ExtraParams> {
  initialItems: T[];
  initialMeta: IPaginationMeta;
  params?: TParams;
  pathname?: string;
  fetchPage: (
    params: PaginationParams & TParams,
  ) => Promise<ApiPaginatedResponse<T>>;
  getItemKey?: (item: T) => string | number;
}

export const usePaginationWithSSRData = <
  T,
  TParams extends ExtraParams = ExtraParams,
>({
  initialItems,
  initialMeta,
  params,
  pathname,
  fetchPage,
  getItemKey,
}: UsePaginationParams<T, TParams>) => {
  const [items, setItems] = useState<T[]>(() => initialItems);
  const [meta, setMeta] = useState<IPaginationMeta>(() => initialMeta);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const queryParams = useMemo(() => (params ?? {}) as TParams, [params]);

  const {
    clear,
    params: clientQueryParams,
    update,
  } = useClientSearchParams<TParams>({
    searchParams: queryParams,
    pathname,
  });

  const metaRef = useRef(meta);
  const clientQueryParamsRef = useRef(clientQueryParams);
  const loadingRef = useRef(false);
  const loadingMoreRef = useRef(false);

  const hasMore = meta.page < meta.totalPages;

  const totalPages = useMemo(
    () => Math.max(meta.totalPages, 1),
    [meta.totalPages],
  );

  const buildParams = useCallback(
    (
      paginationParams: PaginationParams,
      overrideParams?: Partial<TParams>,
    ): PaginationParams & TParams => {
      return {
        ...clientQueryParamsRef.current,
        ...(overrideParams ?? {}),
        ...paginationParams,
      } as PaginationParams & TParams;
    },
    [],
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
          Number(overrideParams?.limit ?? clientQueryParamsRef.current.limit) ||
          1;

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
        metaRef.current = response.data.meta;
        setMeta(response.data.meta);

        if (shouldSyncQuery) {
          update((response.data.meta || {}) as unknown as TParams);
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
    [buildParams, fetchPage, update],
  );

  const loadMore = useCallback(
    async (
      overrideParams?: Partial<TParams>,
      options: Pick<LoadPageOptions, "syncQuery"> = {},
    ) => {
      const currentMeta = metaRef.current;
      const currentHasMore = currentMeta.page < currentMeta.totalPages;

      if (loadingMoreRef.current || !currentHasMore) return;

      const shouldSyncQuery = options.syncQuery ?? true;

      loadingMoreRef.current = true;
      setLoadingMore(true);
      setError(null);

      try {
        const response = await fetchPage(
          buildParams(
            {
              page: currentMeta.page + 1,
              limit: currentMeta.limit,
            },
            overrideParams,
          ),
        );

        if (response.status !== "success") return;

        appendItems(response.data.items);
        metaRef.current = response.data.meta;
        setMeta(response.data.meta);

        if (shouldSyncQuery) {
          update((response.data.meta || {}) as unknown as TParams);
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
    [appendItems, buildParams, fetchPage, update],
  );

  const reset = useCallback(
    (next?: {
      items?: T[];
      meta?: IPaginationMeta;
      keepQuery?: Record<string, boolean>;
    }) => {
      const nextItems = next?.items ?? initialItems;
      const nextMeta = next?.meta ?? initialMeta;

      setItems(nextItems);
      metaRef.current = nextMeta;
      setMeta(nextMeta);
      setError(null);
      setLoading(false);
      setLoadingMore(false);

      loadingRef.current = false;
      loadingMoreRef.current = false;

      clear(next?.keepQuery);
    },
    [initialItems, initialMeta, clear],
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

    clientQueryParams,
    update,
  };
};
