import { useCallback, useEffect, useState } from "react";
import { ordersUseCase } from "@/domain/orders";
import { IOrder } from "@/domain/orders/types/order.model";

export const useOrdersAdapter = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    let isMounted = true;

    // Poll every 5 seconds to see status updates from the simulator
    const interval = setInterval(async () => {
      if (isMounted) {
        await fetchOrders();
      }
    }, 5000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [fetchOrders]);

  return {
    orders,
    loading,
    refreshOrders: fetchOrders,
  };
};
