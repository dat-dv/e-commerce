import { useEffect, useState } from "react";

import { adminUserUseCase, type IAdminCustomerOrder } from "@/domain/user";
import type { ApiListResponse } from "@/utils/request";

export const useUserDetailOrders = (userId: string | null) => {
  const [orders, setOrders] = useState<ApiListResponse<IAdminCustomerOrder>>({
    items: [],
    meta: { total: 0, page: 1, limit: 10, totalPages: 0 },
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) {
      setOrders({
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
        const ordersRes = await adminUserUseCase.getUserOrders.execute(userId, {
          page: 1,
          limit: 10,
        });
        if (!ignore) setOrders(ordersRes);
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

  return { orders, loading };
};
