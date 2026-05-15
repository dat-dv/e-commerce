import { useState, useEffect, useCallback } from "react";
import { ordersUseCase } from "@/domain/orders";
import { IOrder } from "@/domain/orders/types/order.model";
import { useAuthStore } from "../auth/use-auth-store";
import { IPaginationMeta } from "@/utils/request/request.types";

export const useOrders = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTabState, setActiveTabState] = useState<
    readonly number[] | "all"
  >("all");
  const [meta, setMeta] = useState<IPaginationMeta | null>(null);
  const [page, setPage] = useState(1);

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const userId = useAuthStore((s) => s.user?.id);

  useEffect(() => {
    if (!userId) return;

    let isMounted = true;

    const loadOrders = async () => {
      setLoading(true);
      try {
        const response = await ordersUseCase.getOrders.execute({
          status:
            activeTabState === "all" ? undefined : (activeTabState as number[]),
          page,
          limit: 10,
        });

        if (isMounted && response.status === "success" && response.data) {
          setOrders(response.data);
          if (response.meta) {
            setMeta(response.meta);
          }
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadOrders();

    return () => {
      isMounted = false;
    };
  }, [userId, activeTabState, page, refreshTrigger]);

  const setActiveTab = useCallback((tab: readonly number[] | "all") => {
    setActiveTabState(tab);
    setPage(1);
  }, []);

  const refresh = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  return {
    orders,
    loading,
    activeTab: activeTabState,
    setActiveTab,
    meta,
    page,
    setPage,
    refresh,
  };
};
