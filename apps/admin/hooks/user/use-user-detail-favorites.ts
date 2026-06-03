import { useEffect, useState } from "react";

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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) {
      setFavorites({
        items: [],
        meta: { total: 0, page: 1, limit: 10, totalPages: 0 },
      });
      setLoading(false);
      return;
    }

    let ignore = false;

    const loadData = async () => {
      setLoading(true);
      try {
        const favoritesResponse =
          await adminUserUseCase.getUserFavorites.execute(userId, {
            page: 1,
            limit: 10,
          });
        if (!ignore) setFavorites(favoritesResponse);
      } catch (err) {
        if (!ignore) console.error(err);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    void loadData();

    return () => {
      ignore = true;
    };
  }, [userId]);

  return { favorites, loading };
};
