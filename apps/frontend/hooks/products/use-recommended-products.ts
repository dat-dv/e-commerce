"use client";

import { useCallback, useEffect } from "react";
import { productsUseCase } from "@/domain/products/use-cases";
import { useRecommendedStore } from "./recommended/use-recommended-store";

const LIMIT = 15;

export const useRecommendedProducts = () => {
  const recommendedProducts = useRecommendedStore(
    (state) => state.recommendedProducts,
  );
  const page = useRecommendedStore((state) => state.page);
  const total = useRecommendedStore((state) => state.total);
  const hasMore = useRecommendedStore((state) => state.hasMore);

  const isLoading = useRecommendedStore((state) => state.loading);
  const setLoading = useRecommendedStore((state) => state.setLoading);

  const setRecommendedProducts = useRecommendedStore(
    (state) => state.setRecommendedProducts,
  );
  const appendRecommendedProducts = useRecommendedStore(
    (state) => state.appendRecommendedProducts,
  );
  const setPage = useRecommendedStore((state) => state.setPage);
  const setHasMore = useRecommendedStore((state) => state.setHasMore);

  const fetchRecommendedProducts = useCallback(async () => {
    if (isLoading) return;
    setLoading(true);
    setPage(1);
    try {
      const response = await productsUseCase.getRecommended.execute({
        page: 1,
        limit: LIMIT,
      });
      const items = response.data || [];
      setRecommendedProducts(items);
      setPage(1);
      setHasMore(items.length >= LIMIT);
    } catch (error) {
      console.error("Failed to fetch recommended products:", error);
      setRecommendedProducts([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [isLoading, setLoading, setRecommendedProducts, setPage, setHasMore]);

  const fetchMore = useCallback(async () => {
    if (isLoading || !hasMore) {
      return;
    }

    setLoading(true);
    const nextPage = page + 1;

    try {
      const response = await productsUseCase.getRecommended.execute({
        page: nextPage,
        limit: LIMIT,
      });
      const items = response.data || [];

      // If we didn't receive any new products, we have reached the end of the collection
      if (items.length === 0) {
        setHasMore(false);
      } else {
        appendRecommendedProducts(items);
        setPage(nextPage);
        setHasMore(items.length >= LIMIT);
      }
    } catch (error) {
      console.error("Failed to load more recommended products:", error);
    } finally {
      setLoading(false);
    }
  }, [
    isLoading,
    hasMore,
    setLoading,
    page,
    setHasMore,
    appendRecommendedProducts,
    setPage,
  ]);

  return {
    recommendedProducts,
    isLoading,
    page,
    hasMore,
    total,
    fetchRecommendedProducts,
    fetchMore,
  };
};
