import { toast } from "@ecommerce/ui";
import { useEffect, useState, useTransition } from "react";

import {
  adminUserUseCase,
  type IAdminCustomerFavoriteProduct,
} from "@/domain/user";
import type { ApiListResponse } from "@/utils/request";

export const useUserDetailFavorites = (userId: string | null) => {
  const [favorites, setFavorites] = useState<
    ApiListResponse<IAdminCustomerFavoriteProduct>
  >({
    items: [],
    meta: { total: 0, page: 1, limit: 10, totalPages: 0 },
  });
  const [loading, startLoadingTransition] = useTransition();

  useEffect(() => {
    if (!userId) {
      setFavorites({
        items: [],
        meta: { total: 0, page: 1, limit: 10, totalPages: 0 },
      });
      return;
    }

    startLoadingTransition(async () => {
      try {
        const favoritesResponse =
          await adminUserUseCase.getUserFavorites.execute(userId, {
            page: 1,
            limit: 10,
          });
        setFavorites(favoritesResponse);
      } catch {
        toast.error("Failed to load customer favorites.");
      }
    });
  }, [userId]);

  return { favorites, loading };
};
