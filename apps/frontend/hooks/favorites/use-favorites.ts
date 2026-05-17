"use client";

import { useCallback, useContext, useEffect } from "react";
import { useAuthStore } from "../auth/use-auth-store";
import { userFavoriteProductsUseCase } from "@/domain/user-favorite-products/use-cases";
import { useFavoritesStore } from "./use-favorites-store";
import { FavoritesContext } from "@/components/molecules/providers/favorites-provider";

const LIMIT = 24;

/**
 * Custom hook to load and manage favorite products with pagination support.
 * Why: Orchestrates state selection and async fetch boundaries using a scoped vanilla Zustand store,
 * allowing synchronized list rendering and preventing concurrent duplicate requests.
 */
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
  const loadingMore = useFavoritesStore((state) => state.loadingMore);
  const setLoadingMore = useFavoritesStore((state) => state.setLoadingMore);

  const setFavorites = useFavoritesStore((state) => state.setFavorites);
  const appendFavorites = useFavoritesStore((state) => state.appendFavorites);
  const setPage = useFavoritesStore((state) => state.setPage);
  const setTotal = useFavoritesStore((state) => state.setTotal);
  const setHasMore = useFavoritesStore((state) => state.setHasMore);

  const userId = useAuthStore((s) => s.user?.id);

  /**
   * Initializes and fetches a specific page of favorites.
   * Why: Resets pagination state and fetches favorites from the backend repository.
   */
  const fetchFavorites = useCallback(
    async (targetPage: number, append = false) => {
      if (!userId) return;
      if (store.getState().loading) return;

      if (append) setLoadingMore(true);
      else setLoading(true);

      try {
        const response =
          await userFavoriteProductsUseCase.getUserFavoriteProductsUseCase.execute(
            targetPage,
            LIMIT,
          );

        if (response.status === "success" && response.data) {
          if (append) {
            appendFavorites(response.data);
          } else {
            setFavorites(response.data);
          }

          if (response.meta) {
            setPage(response.meta.page);
            setTotal(response.meta.total);
            setHasMore(response.meta.page < response.meta.totalPages);
          } else {
            setPage(targetPage);
            setHasMore(response.data.length >= LIMIT);
          }
        }
      } catch (error) {
        console.error("Failed to fetch favorites:", error);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [
      userId,
      store,
      appendFavorites,
      setFavorites,
      setLoading,
      setLoadingMore,
      setPage,
      setTotal,
      setHasMore,
    ],
  );

  /**
   * Fetches the next page of favorites.
   * Why: Enables premium infinite scroll listing by expanding pagination request boundaries on the FE.
   */
  const fetchMore = useCallback(() => {
    if (hasMore && !loading && !loadingMore) {
      fetchFavorites(page + 1, true);
    }
  }, [fetchFavorites, hasMore, loading, loadingMore, page]);

  // Initial load when mounting
  useEffect(() => {
    if (favorites.length === 0 && !loading) {
      fetchFavorites(1);
    }
  }, [fetchFavorites, favorites.length, loading]);

  /**
   * Toggles the favorite status of a product.
   * Why: Safely performs toggle and updates the store synchronously.
   */
  const toggleFavorite = useCallback(
    async (productId: string) => {
      try {
        const response =
          await userFavoriteProductsUseCase.toggleUserFavoriteProductUseCase.execute(
            productId,
          );
        if (response.status === "success") {
          // Refresh favorites list to page 1 to synchronize across all consumers
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

  // Virtual meta for exact backwards-compatibility with profile and favorites grid
  const meta = {
    limit: LIMIT,
    page,
    totalPages: Math.ceil(total / LIMIT) || 1,
    total,
  };

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
