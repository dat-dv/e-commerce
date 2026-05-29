"use client";

import { toast } from "@/components/atoms/toast";
import { userFavoriteProductsUseCase } from "@/domain/user-favorite-products/use-cases";
import { useCallback, useState } from "react";
import { useAuthStore } from "../auth/use-auth-store";
import { useFavoritesStore } from "./use-favorites-store";

export const useToggleFavorite = (
  productId: string,
  initialIsFavorited: boolean = false,
) => {
  const addFavorite = useFavoritesStore((state) => state.addFavorite);
  const removeFavorite = useFavoritesStore((state) => state.removeFavorite);

  const [isFavorited, setIsFavorited] = useState(initialIsFavorited);
  const [loading, setLoading] = useState(false);
  const userId = useAuthStore((s) => s.user?.id);

  const toggle = useCallback(
    async (e?: React.MouseEvent) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }

      if (!userId) {
        toast.info("Please sign in to add items to your wishlist");
        return;
      }

      try {
        setLoading(true);
        const response =
          await userFavoriteProductsUseCase.toggleUserFavoriteProductUseCase.execute(
            productId,
          );

        if (response.status === "success") {
          const nextState = response.data.isFavorited;
          setIsFavorited(nextState);

          // Synchronize global FavoritesStore
          if (nextState) {
            addFavorite({
              userId: userId || "",
              productId,
              createdAt: new Date().toISOString(),
            });
          } else {
            removeFavorite(productId);
          }

          toast.success(
            nextState ? "Added to wishlist" : "Removed from wishlist",
          );
        }
      } catch (error) {
        console.error("Failed to toggle favorite:", error);
        toast.error("Something went wrong");
      } finally {
        setLoading(false);
      }
    },
    [productId, userId, addFavorite, removeFavorite],
  );

  return { isFavorited, loading, toggle };
};
