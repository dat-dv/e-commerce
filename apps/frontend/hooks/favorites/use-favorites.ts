"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { TUserFavoriteProductItem } from "@/domain/user-favorite-products/types/user-favorite-products.model";
import { useAuthStore } from "../auth/use-auth-store";
import { userFavoriteProductsUseCase } from "@/domain/user-favorite-products/use-cases";

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<TUserFavoriteProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const isFetch = useRef(false);

  const userId = useAuthStore((s) => s.user?.id);

  const fetchFavorites = useCallback(
    async (targetPage: number, append = false) => {
      if (!userId) return;

      try {
        setLoading(true);
        const response =
          await userFavoriteProductsUseCase.getUserFavoriteProductsUseCase.execute(
            targetPage,
            12,
          );

        if (response.status === "success" && response.data) {
          if (append) {
            setFavorites((prev) => [...prev, ...response.data!.items]);
          } else {
            setFavorites(response.data.items);
          }
          setHasMore(response.data.meta.page < response.data.meta.totalPages);
          setPage(response.data.meta.page);
        }
      } catch (error) {
        console.error("Failed to fetch favorites:", error);
      } finally {
        setLoading(false);
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
    page,
    hasMore,
    fetchFavorites,
    fetchMore,
    toggleFavorite,
  };
};
