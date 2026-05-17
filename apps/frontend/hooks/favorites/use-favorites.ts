"use client";

import { useCallback } from "react";
import { userFavoriteProductsUseCase } from "@/domain/user-favorite-products/use-cases";
import { TUserFavoriteProductItem } from "@/domain/user-favorite-products/types/user-favorite-products.model";
import { usePagination } from "@/hooks/use-pagination";
import {
  PAGINATION_LIMITS,
  createInitialPaginationMeta,
} from "@/constants/pagination.constant";

const LIMIT = PAGINATION_LIMITS.FAVORITES;

export const useFavorites = ({
  initialItems = [],
}: {
  initialItems?: TUserFavoriteProductItem[];
} = {}) => {
  const fetchFavoritesPage = useCallback(
    (params: { page: number; limit: number }) =>
      userFavoriteProductsUseCase.getUserFavoriteProductsUseCase.execute(
        params.page,
        params.limit,
      ),
    [],
  );

  const {
    items: favorites,
    meta,
    hasMore,
    loading,
    loadPage,
    loadMore: fetchMore,
  } = usePagination<TUserFavoriteProductItem>({
    initialItems: initialItems,
    initialMeta: createInitialPaginationMeta(LIMIT),
    fetchPage: fetchFavoritesPage,
    getItemKey: (item) => item.productId,
  });

  const fetchFavorites = useCallback(() => loadPage(1), [loadPage]);

  const toggleFavorite = useCallback(
    async (productId: string) => {
      try {
        const response =
          await userFavoriteProductsUseCase.toggleUserFavoriteProductUseCase.execute(
            productId,
          );
        if (response.status === "success") {
          loadPage(1);
        }
        return response;
      } catch (error) {
        console.error("Failed to toggle favorite:", error);
        throw error;
      }
    },
    [loadPage],
  );

  return {
    favorites,
    loading,
    page: meta.page,
    hasMore,
    meta,
    fetchFavorites,
    fetchMore,
    toggleFavorite,
  };
};
