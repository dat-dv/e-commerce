import { useCallback, useMemo, useState } from "react";
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

  const hasMore = meta.page < meta.totalPages;

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
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    try {
      const response = await fetchPage({
        page: meta.page + 1,
        limit: meta.limit,
      });

      if (response.status !== "success") return;

      appendItems(response.data.items);
      setMeta(response.data.meta);
    } finally {
      setLoadingMore(false);
    }
  }, [appendItems, fetchPage, hasMore, loadingMore, meta.limit, meta.page]);

  const loadPage = useCallback(
    async (page: number) => {
      if (loading) return;

      setLoading(true);
      try {
        const response = await fetchPage({
          page,
          limit: meta.limit,
        });

        if (response.status !== "success") return;

        setItems(response.data.items);
        setMeta(response.data.meta);
      } finally {
        setLoading(false);
      }
    },
    [fetchPage, loading, meta.limit],
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
    loadPage,
    loadMore,
  };
};
