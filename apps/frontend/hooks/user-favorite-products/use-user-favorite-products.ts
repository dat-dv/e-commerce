"use client";

import { useState } from "react";
import { userFavoriteProductsUseCase } from "@/domain/user-favorite-products/use-cases";
import { toast } from "@/components/ui/toast";
import { useAuthStore } from "../auth/use-auth-store";

export const useUserFavoriteProducts = (
  initialIsFavorited: boolean = false,
) => {
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited);
  const [loading, setLoading] = useState(false);
  const user = useAuthStore((s) => s.user);

  const toggleFavorite = async (productId: string) => {
    if (!user) {
      toast.info("Please sign in to add items to your wishlist");
      return;
    }

    setLoading(true);
    // Optimistic UI update
    const previousState = isFavorited;
    setIsFavorited(!previousState);

    try {
      const response =
        await userFavoriteProductsUseCase.toggleUserFavoriteProductUseCase.execute(
          productId,
        );
      if (response.data) {
        setIsFavorited(response.data.isFavorited);
        toast.success(
          response.data.isFavorited
            ? "Added to favorites"
            : "Removed from favorites",
        );
      }
    } catch (error) {
      console.error("Error toggling favorites:", error);
      // Revert on error
      setIsFavorited(previousState);
      toast.error("Failed to update favorites");
    } finally {
      setLoading(false);
    }
  };

  return {
    isFavorited,
    toggleFavorite,
    loading,
  };
};
