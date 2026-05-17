"use client";

import { useCallback } from "react";
import { productsUseCase } from "@/domain/products/use-cases";
import { useRecentViewedStore } from "@/hooks/products/recent-viewed/use-recent-viewed-store";

export const useLoadRecentViewedProducts = () => {
  const recentViewedProducts = useRecentViewedStore(
    (state) => state.recentViewedProducts,
  );
  const loading = useRecentViewedStore((state) => state.loading);
  const setLoading = useRecentViewedStore((state) => state.setLoading);
  const setRecentViewedProducts = useRecentViewedStore(
    (state) => state.setRecentViewedProducts,
  );

  const fetchRecentViewedProducts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await productsUseCase.getRecentlyViewed.execute();
      setRecentViewedProducts(response.data || []);
    } catch (error) {
      console.error("Failed to fetch recently viewed products:", error);
      setRecentViewedProducts([]);
    } finally {
      setLoading(false);
    }
  }, [setLoading, setRecentViewedProducts]);

  return {
    recentViewedProducts,
    loading,
    fetchRecentViewedProducts,
  };
};
