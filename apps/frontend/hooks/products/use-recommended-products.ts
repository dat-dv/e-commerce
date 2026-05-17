"use client";

import { useCallback, useContext, useEffect } from "react";
import { productsUseCase } from "@/domain/products/use-cases";
import { useRecommendedStore } from "./recommended/use-recommended-store";
import { RecommendedContext } from "@/components/molecules/providers/recommended-provider";

const LIMIT = 15;

export const useRecommendedProducts = () => {
  const store = useContext(RecommendedContext);
  if (!store) {
    throw new Error("Missing RecommendedProvider");
  }

  const recommendedProducts = useRecommendedStore(
    (state) => state.recommendedProducts,
  );
  const page = useRecommendedStore((state) => state.page);
  const total = useRecommendedStore((state) => state.total);
  const hasMore = useRecommendedStore((state) => state.hasMore);

  const loadingRecommended = useRecommendedStore((state) => state.loading);
  const setLoading = useRecommendedStore((state) => state.setLoading);
  const loadingMoreRecommended = useRecommendedStore(
    (state) => state.loadingMore,
  );
  const setLoadingMore = useRecommendedStore((state) => state.setLoadingMore);

  const setRecommendedProducts = useRecommendedStore(
    (state) => state.setRecommendedProducts,
  );
  const appendRecommendedProducts = useRecommendedStore(
    (state) => state.appendRecommendedProducts,
  );
  const setPage = useRecommendedStore((state) => state.setPage);
  const setHasMore = useRecommendedStore((state) => state.setHasMore);

  const fetchRecommendedProducts = useCallback(async () => {
    // Avoid double concurrent initialization calls
    if (store.getState().loading) return;

    setLoading(true);
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
  }, [store, setLoading, setRecommendedProducts, setPage, setHasMore]);

  const fetchMore = useCallback(async () => {
    const currentState = store.getState();
    if (
      currentState.loading ||
      currentState.loadingMore ||
      !currentState.hasMore
    ) {
      return;
    }

    setLoadingMore(true);
    const nextPage = currentState.page + 1;

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
      setLoadingMore(false);
    }
  }, [store, setLoadingMore, appendRecommendedProducts, setPage, setHasMore]);

  // Proactively fetch initial recommendations on mount if not yet hydrated
  useEffect(() => {
    if (recommendedProducts.length === 0 && !loadingRecommended) {
      fetchRecommendedProducts();
    }
  }, [
    fetchRecommendedProducts,
    recommendedProducts.length,
    loadingRecommended,
  ]);

  return {
    recommendedProducts,
    loadingRecommended,
    loadingMoreRecommended,
    page,
    hasMore,
    total,
    fetchRecommendedProducts,
    fetchMore,
  };
};
