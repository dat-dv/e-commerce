import { ordersUseCase } from "@/domain/orders";
import { TOrder } from "@/domain/orders/types/order.model";
import { toast } from "@ecommerce/ui";
import { useCallback, useEffect, useState } from "react";

export const useOrderDetail = (orderId: string) => {
  const [order, setOrder] = useState<TOrder | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrderDetail = useCallback(async () => {
    if (!orderId) return;

    setLoading(true);

    try {
      const response = await ordersUseCase.getOrderDetail.execute(orderId);
      if (response.status === "success" && response.data) {
        setOrder(response.data);
      } else {
        throw new Error(response.message || "Failed to load order details");
      }
    } catch (err) {
      toast.error("Failed to load order details. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrderDetail();
  }, [fetchOrderDetail]);

  return {
    order,
    loading,
    refresh: fetchOrderDetail,
  };
};
