"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { ordersUseCase } from "@/domain/orders";
import { TOrder } from "@/domain/orders/types/order.model";
import { useAuthStore } from "../auth/use-auth-store";
import { IPaginationMeta } from "@/utils/request/request.types";
import { toast } from "react-toastify";

export const useOrders = () => {
  const [orders, setOrders] = useState<TOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [activeTabState, setActiveTabState] = useState<
    readonly number[] | "all"
  >("all");
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
          status:
            activeTabState === "all" ? undefined : (activeTabState as number[]),
          page: targetPage,
          limit: 10,
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

  const setActiveTab = useCallback((tab: readonly number[] | "all") => {
    setPage(1);
    setActiveTabState(tab);
  }, []);

  const refresh = useCallback(() => {
    setPage(1);
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  const cancelOrder = useCallback(
    async (orderId: string) => {
      try {
        setLoading(true);
        const response = await ordersUseCase.cancelOrder.execute(orderId);
        if (response.status === "success") {
          toast.success("Order cancelled successfully");
          refresh();
        }
        return response;
      } catch (error) {
        console.error("Failed to cancel order:", error);
        toast.error("Failed to cancel order. Please try again.");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [refresh],
  );

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
    cancelOrder,
    hasMore: meta ? page < meta.totalPages : false,
  };
};
