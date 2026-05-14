import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { ordersUseCase } from "@/domain/orders";
import { IOrder } from "@/domain/orders/types/order.model";
import { useAuthStore } from "../auth/use-auth-store";

export const useOrders = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<readonly number[] | "all">("all");
  const isFetched = useRef(false);
  const userId = useAuthStore((s) => s.user?.id);

  const fetchOrders = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const response = await ordersUseCase.getOrders.execute();
      if (response.status === "success" && response.data) {
        setOrders(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (!isFetched.current && userId) {
      fetchOrders();
      isFetched.current = true;
    }
  }, [fetchOrders, userId]);

  const filteredOrders = useMemo(() => {
    if (activeTab === "all") return orders;
    return orders.filter((order) => activeTab.includes(order.status));
  }, [orders, activeTab]);

  return {
    orders: filteredOrders,
    loading,
    activeTab,
    setActiveTab,
    refresh: fetchOrders,
  };
};
