"use client";

import { useCallback } from "react";
import { productsUseCase } from "@/domain/products/use-cases";
import { useRecentViewedStore } from "@/hooks/products/recent-viewed/use-recent-viewed-store";

const LIMIT = 15;

export const useLoadRecentViewedProducts = () => {
  const recentViewedProducts = useRecentViewedStore(
    (state) => state.recentViewedProducts,
  );
  const page = useRecentViewedStore((state) => state.page);
  const total = useRecentViewedStore((state) => state.total);
  const hasMore = useRecentViewedStore((state) => state.hasMore);

  const loading = useRecentViewedStore((state) => state.loading);
  const setLoading = useRecentViewedStore((state) => state.setLoading);

  const setRecentViewedProducts = useRecentViewedStore(
    (state) => state.setRecentViewedProducts,
  );
  const appendRecentViewedProducts = useRecentViewedStore(
    (state) => state.appendRecentViewedProducts,
  );
  const setPage = useRecentViewedStore((state) => state.setPage);
  const setHasMore = useRecentViewedStore((state) => state.setHasMore);

  const fetchRecentViewedProducts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await productsUseCase.getRecentlyViewed.execute({
        page: 1,
        limit: LIMIT,
      });
      const items = response.data || [];
      setRecentViewedProducts(items);
      setPage(1);
      setHasMore(items.length >= LIMIT);
    } catch (error) {
      console.error("Failed to fetch recently viewed products:", error);
      setRecentViewedProducts([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [setLoading, setRecentViewedProducts, setPage, setHasMore]);

  const fetchMore = useCallback(async () => {
    if (loading || !hasMore) {
      return;
    }

    setLoading(true);
    const nextPage = page + 1;

    try {
      const response = await productsUseCase.getRecentlyViewed.execute({
        page: nextPage,
        limit: LIMIT,
      });
      const items = response.data || [];

      if (items.length === 0) {
        setHasMore(false);
      } else {
        appendRecentViewedProducts(items);
        setPage(nextPage);
        setHasMore(items.length >= LIMIT);
      }
    } catch (error) {
      console.error("Failed to load more recently viewed products:", error);
    } finally {
      setLoading(false);
    }
  }, [
    loading,
    hasMore,
    page,
    appendRecentViewedProducts,
    setLoading,
    setPage,
    setHasMore,
  ]);

  return {
    recentViewedProducts,
    loading,
    page,
    hasMore,
    total,
    fetchRecentViewedProducts,
    fetchMore,
  };
};
