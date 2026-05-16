"use client";

import { useState, useCallback } from "react";
import { userFavoriteProductsUseCase } from "@/domain/user-favorite-products/use-cases";
import { useAuthStore } from "../auth/use-auth-store";
import { toast } from "react-toastify";

export const useToggleFavorite = (
  productId: string,
  initialIsFavorited: boolean = false,
) => {
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
        toast.info("Please sign in to add items to your wishlist", {
          toastId: "auth-required",
        });
        return;
      }

      try {
        setLoading(true);
        const response =
          await userFavoriteProductsUseCase.toggleUserFavoriteProductUseCase.execute(
            productId,
          );

        if (response.status === "success") {
          setIsFavorited(response.data.isFavorited);
          toast.success(
            response.data.isFavorited
              ? "Added to wishlist"
              : "Removed from wishlist",
          );
        }
      } catch (error) {
        console.error("Failed to toggle favorite:", error);
        toast.error("Something went wrong");
      } finally {
        setLoading(false);
      }
    },
    [productId, userId],
  );

  return { isFavorited, loading, toggle };
};
