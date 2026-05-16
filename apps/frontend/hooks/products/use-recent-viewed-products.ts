"use client";

import { useCallback } from "react";

import { productsUseCase } from "@/domain/products/use-cases";
import { useProductsStore } from "@/hooks/products/use-products-store";

export const useRecentViewedProducts = () => {
  const recentViewedProducts = useProductsStore(
    (state) => state.recentViewedProducts,
  );
  const loading = useProductsStore((state) => state.loading);
  const setLoading = useProductsStore((state) => state.setLoading);
  const setRecentViewedProducts = useProductsStore(
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
