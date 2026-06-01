import type { IOrderResponse } from "@ecommerce/shared";
import { useLoadOnce } from "@ecommerce/ui";
import { useCallback, useMemo, useState } from "react";

import { AdminOrderRepository } from "@/domain/order";
import type { ApiListResponse } from "@/utils/request";

export const useUserDetailOrders = (userId: string | null) => {
  const orderRepository = useMemo(() => new AdminOrderRepository(), []);
  const [orders, setOrders] = useState<ApiListResponse<IOrderResponse>>({
    items: [],
    meta: { total: 0, page: 1, limit: 10, totalPages: 0 },
  });
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const ordersRes = await orderRepository.getOrders(1, 10, {
        user_id: userId,
      });
      setOrders(
        ordersRes.data || {
          items: [],
          meta: { total: 0, page: 1, limit: 10, totalPages: 0 },
        },
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [userId, orderRepository]);

  useLoadOnce(loadData, !!userId);

  return { orders, loading };
};
