import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ApiPaginatedResponse,
  IPaginationMeta,
} from "@/utils/request/request.types";

interface UsePaginationParams<T> {
  initialItems: T[];
  initialMeta: IPaginationMeta;
  fetchPage: (params: {
    page: number;
    limit: number;
  }) => Promise<ApiPaginatedResponse<T>>;
  getItemKey?: (item: T) => string | number;
}

export const usePagination = <T>({
  initialItems,
  initialMeta,
  fetchPage,
  getItemKey,
}: UsePaginationParams<T>) => {
  const [items, setItems] = useState(initialItems);
  const [meta, setMeta] = useState(initialMeta);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasMore = meta.page < meta.totalPages;
  const metaRef = useRef(meta);
  const loadingRef = useRef(loading);
  const loadingMoreRef = useRef(loadingMore);
  const hasMoreRef = useRef(hasMore);

  useEffect(() => {
    metaRef.current = meta;
  }, [meta]);

  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);

  useEffect(() => {
    loadingMoreRef.current = loadingMore;
  }, [loadingMore]);

  useEffect(() => {
    hasMoreRef.current = hasMore;
  }, [hasMore]);

  const appendItems = useCallback(
    (nextItems: T[]) => {
      setItems((currentItems) => {
        if (!getItemKey) {
          return [...currentItems, ...nextItems];
        }

        const currentKeys = new Set(currentItems.map(getItemKey));
        return [
          ...currentItems,
          ...nextItems.filter((item) => !currentKeys.has(getItemKey(item))),
        ];
      });
    },
    [getItemKey],
  );

  const loadMore = useCallback(async () => {
    if (loadingMoreRef.current || !hasMoreRef.current) return;

    loadingMoreRef.current = true;
    setLoadingMore(true);
    setError(null);
    try {
      const currentMeta = metaRef.current;
      const response = await fetchPage({
        page: currentMeta.page + 1,
        limit: currentMeta.limit,
      });

      if (response.status !== "success") return;

      appendItems(response.data.items);
      setMeta(response.data.meta);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to load more items",
      );
    } finally {
      loadingMoreRef.current = false;
      setLoadingMore(false);
    }
  }, [appendItems, fetchPage]);

  const loadPage = useCallback(
    async (page: number) => {
      if (loadingRef.current) return;

      loadingRef.current = true;
      setLoading(true);
      setError(null);
      try {
        const currentMeta = metaRef.current;
        const response = await fetchPage({
          page,
          limit: currentMeta.limit,
        });

        if (response.status !== "success") return;

        setItems(response.data.items);
        setMeta(response.data.meta);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to load page",
        );
      } finally {
        loadingRef.current = false;
        setLoading(false);
      }
    },
    [fetchPage],
  );

  const totalPages = useMemo(
    () => Math.max(meta.totalPages, 1),
    [meta.totalPages],
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
  };
};
