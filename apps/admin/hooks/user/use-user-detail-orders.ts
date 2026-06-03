import { toast } from "@ecommerce/ui";
import { useEffect, useState, useTransition } from "react";

import { adminUserUseCase, type IAdminCustomerOrder } from "@/domain/user";
import type { ApiListResponse } from "@/utils/request";

export const useUserDetailOrders = (userId: string | null) => {
  const [orders, setOrders] = useState<ApiListResponse<IAdminCustomerOrder>>({
    items: [],
    meta: { total: 0, page: 1, limit: 10, totalPages: 0 },
  });
  const [loading, startLoadingTransition] = useTransition();

  useEffect(() => {
    if (!userId) {
      setOrders({
        items: [],
        meta: { total: 0, page: 1, limit: 10, totalPages: 0 },
      });
      return;
    }

    startLoadingTransition(async () => {
      try {
        const ordersRes = await adminUserUseCase.getUserOrders.execute(userId, {
          page: 1,
          limit: 10,
        });
        setOrders(ordersRes);
      } catch {
        toast.error("Failed to load customer orders.");
      }
    });
  }, [userId]);

  return { orders, loading };
};
