"use client";
import { toast } from "@/components/ui/toast";
import { ORDER_TABS, OrderTabValue } from "@/constants/order-status.constant";
import { ordersUseCase } from "@/domain/orders";
import { TOrder } from "@/domain/orders/types/order.model";
import { IPaginationMeta } from "@/utils/request/request.types";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAuthStore } from "../auth/use-auth-store";
export const useOrders = () => {
  const [orders, setOrders] = useState<TOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [activeTabState, setActiveTabState] = useState<OrderTabValue>(
    ORDER_TABS[1].value,
  );
  const [meta, setMeta] = useState<IPaginationMeta | null>(null);
  const [page, setPage] = useState(1);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const userId = useAuthStore((s) => s.user?.id);
  const loadingRef = useRef(false);

  const fetchOrders = useCallback(
    async (targetPage: number, isAppending: boolean) => {
      if (!userId || loadingRef.current) return;

      if (isAppending) setLoadingMore(true);
      else setLoading(true);

      loadingRef.current = true;

      try {
        const response = await ordersUseCase.getOrders.execute({
          status: activeTabState === "all" ? undefined : [...activeTabState],
          page: targetPage,
          limit: 20,
        });

        if (response.status === "success" && response.data) {
          setOrders((prev) =>
            isAppending ? [...prev, ...response.data] : response.data,
          );
          if (response.meta) {
            setMeta(response.meta);
          }
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        toast.error("Failed to load your collection. Please try again.");
      } finally {
        setLoading(false);
        setLoadingMore(false);
        loadingRef.current = false;
      }
    },
    [userId, activeTabState],
  );

  // Initial load and tab changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchOrders(1, false);
  }, [activeTabState, refreshTrigger, fetchOrders]);

  const loadMore = useCallback(() => {
    if (loading || loadingMore || !meta || page >= meta.totalPages) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchOrders(nextPage, true);
  }, [loading, loadingMore, meta, page, fetchOrders]);

  const setActiveTab = useCallback((tab: OrderTabValue) => {
    setPage(1);
    setActiveTabState(tab);
  }, []);

  const refresh = useCallback(() => {
    setPage(1);
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  return {
    orders,
    loading,
    loadingMore,
    activeTab: activeTabState,
    setActiveTab,
    meta,
    page,
    loadMore,
    refresh,
    hasMore: meta ? page < meta.totalPages : false,
  };
};
