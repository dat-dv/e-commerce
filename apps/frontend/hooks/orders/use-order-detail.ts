import { useState, useEffect, useCallback } from "react";
import { ordersUseCase } from "@/domain/orders";
import { IOrder } from "@/domain/orders/types/order.model";
import { toast } from "react-toastify";

export const useOrderDetail = (orderId: string) => {
  const [order, setOrder] = useState<IOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchOrderDetail = useCallback(async () => {
    if (!orderId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await ordersUseCase.getOrderDetail.execute(orderId);
      if (response.status === "success" && response.data) {
        setOrder(response.data);
      } else {
        throw new Error(response.message || "Failed to load order details");
      }
    } catch (err) {
      console.error("Error fetching order detail:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
      toast.error("Failed to load order details. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchOrderDetail();
  }, [fetchOrderDetail]);

  return {
    order,
    loading,
    error,
    refresh: fetchOrderDetail,
  };
};
