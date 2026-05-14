import { useCallback, useEffect, useRef, useState } from "react";
import { ordersUseCase } from "@/domain/orders";
import { IOrder } from "@/domain/orders/types/order.model";
import { useAuthStore } from "../auth/use-auth-store";

export const useGetOrders = (shouldFetchOnMount = true) => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const isFetched = useRef(false);

  const userId = useAuthStore((s) => s.user?.id);

  const fetchOrders = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const res = await ordersUseCase.getOrders.execute();
      if (res.status === "success") {
        setOrders(res.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (!isFetched.current && shouldFetchOnMount) {
      fetchOrders();
    }
  }, [fetchOrders, shouldFetchOnMount]);

  return {
    orders,
    loading,
    refreshOrders: fetchOrders,
  };
};
