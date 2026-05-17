"use client";

import { useCallback, useContext } from "react";
import { userFavoriteProductsUseCase } from "@/domain/user-favorite-products/use-cases";
import { useFavoritesStore } from "./use-favorites-store";
import { FavoritesContext } from "@/components/molecules/providers/favorites-provider";

const LIMIT = 24;

export const useFavorites = () => {
  const store = useContext(FavoritesContext);
  if (!store) {
    throw new Error("Missing FavoritesProvider");
  }

  const favorites = useFavoritesStore((state) => state.favorites);
  const page = useFavoritesStore((state) => state.page);
  const total = useFavoritesStore((state) => state.total);
  const hasMore = useFavoritesStore((state) => state.hasMore);

  const loading = useFavoritesStore((state) => state.loading);
  const setLoading = useFavoritesStore((state) => state.setLoading);

  const setFavorites = useFavoritesStore((state) => state.setFavorites);
  const appendFavorites = useFavoritesStore((state) => state.appendFavorites);
  const setPage = useFavoritesStore((state) => state.setPage);
  const setTotal = useFavoritesStore((state) => state.setTotal);
  const setHasMore = useFavoritesStore((state) => state.setHasMore);

  const _fetchFavorites = useCallback(
    async (targetPage: number) => {
      setLoading(true);

      try {
        const response =
          await userFavoriteProductsUseCase.getUserFavoriteProductsUseCase.execute(
            targetPage,
            LIMIT,
          );

        if (response.status === "success" && response.data) {
          if (response.meta) {
            setPage(response.meta.page);
            setTotal(response.meta.total);
            setHasMore(response.meta.page < response.meta.totalPages);
          } else {
            setPage(targetPage);
            setHasMore(response.data.length >= LIMIT);
          }

          return response.data;
        }
      } catch (error) {
        console.error("Failed to fetch favorites:", error);
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setPage, setTotal, setHasMore],
  );

  const fetchFavorites = useCallback(async () => {
    const data = await _fetchFavorites(1);
    if (data) {
      setFavorites(data);
    }
  }, [_fetchFavorites, setFavorites]);

  const fetchMore = useCallback(async () => {
    if (hasMore && !loading) {
      const data = await _fetchFavorites(page + 1);
      if (data) {
        appendFavorites(data);
      }
    }
  }, [_fetchFavorites, hasMore, loading, page, appendFavorites]);

  const toggleFavorite = useCallback(
    async (productId: string) => {
      try {
        const response =
          await userFavoriteProductsUseCase.toggleUserFavoriteProductUseCase.execute(
            productId,
          );
        if (response.status === "success") {
          _fetchFavorites(1);
        }
        return response;
      } catch (error) {
        console.error("Failed to toggle favorite:", error);
        throw error;
      }
    },
    [_fetchFavorites],
  );

  const meta = {
    limit: LIMIT,
    page,
    totalPages: Math.ceil(total / LIMIT) || 1,
    total,
  };

  return {
    favorites,
    loading,
    page,
    hasMore,
    meta,
    fetchFavorites,
    fetchMore,
    toggleFavorite,
  };
};
