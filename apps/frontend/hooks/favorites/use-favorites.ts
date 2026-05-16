"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { TUserFavoriteProductItem } from "@/domain/user-favorite-products/types/user-favorite-products.model";
import { useAuthStore } from "../auth/use-auth-store";
import { userFavoriteProductsUseCase } from "@/domain/user-favorite-products/use-cases";
import { IPaginationMeta } from "@/utils/request/request.types";

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<TUserFavoriteProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [meta, setMeta] = useState<IPaginationMeta>({
    limit: 24,
    page: 1,
    totalPages: 1,
    total: 0,
  });

  const isFetch = useRef(false);

  const userId = useAuthStore((s) => s.user?.id);

  const fetchFavorites = useCallback(
    async (targetPage: number, append = false) => {
      if (!userId) return;

      try {
        if (append) setLoadingMore(true);
        else setLoading(true);

        const response =
          await userFavoriteProductsUseCase.getUserFavoriteProductsUseCase.execute(
            targetPage,
            24, // Increased limit for better grid filling
          );

        if (response.status === "success" && response.data) {
          setFavorites((prev) =>
            append ? [...prev, ...response.data] : response.data,
          );
          if (response.meta) {
            setMeta(response.meta);
            setHasMore(response.meta.page < response.meta.totalPages);
            setPage(response.meta.page);
          }
        }
      } catch (error) {
        console.error("Failed to fetch favorites:", error);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [userId],
  );

  const fetchMore = useCallback(() => {
    if (hasMore && !loading) {
      fetchFavorites(page + 1, true);
    }
  }, [fetchFavorites, hasMore, loading, page]);

  useEffect(() => {
    if (isFetch.current) return;
    isFetch.current = true;
    fetchFavorites(1);
  }, [fetchFavorites]);

  const toggleFavorite = useCallback(
    async (productId: string) => {
      try {
        const response =
          await userFavoriteProductsUseCase.toggleUserFavoriteProductUseCase.execute(
            productId,
          );
        if (response.status === "success") {
          // Refresh favorites list
          fetchFavorites(1);
        }
        return response;
      } catch (error) {
        console.error("Failed to toggle favorite:", error);
        throw error;
      }
    },
    [fetchFavorites],
  );

  return {
    favorites,
    loading,
    loadingMore,
    page,
    hasMore,
    meta,
    fetchFavorites,
    fetchMore,
    toggleFavorite,
  };
};
