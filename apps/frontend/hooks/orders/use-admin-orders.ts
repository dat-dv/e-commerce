"use client";

import { ordersUseCase } from "@/domain/orders";
import { TOrder } from "@/domain/orders/types/order.model";
import { IPaginationMeta } from "@/utils/request/request.types";
import { toast } from "@ecommerce/ui";
import { useCallback, useEffect, useRef, useState } from "react";

export interface UseAdminOrdersProps {
  initialLimit?: number;
}

export const useAdminOrders = ({
  initialLimit = 10,
}: UseAdminOrdersProps = {}) => {
  const [orders, setOrders] = useState<TOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<number[]>([]);
  const [meta, setMeta] = useState<IPaginationMeta | null>(null);
  const [page, setPage] = useState(1);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const loadingRef = useRef(false);

  const fetchOrders = useCallback(async () => {
    if (loadingRef.current) return;

    setLoading(true);
    loadingRef.current = true;

    try {
      const response = await ordersUseCase.getOrdersByAdmin.execute({
        status: selectedStatuses.length > 0 ? selectedStatuses : undefined,
        search: search.trim() || undefined,
        page,
        limit: initialLimit,
      });

      if (response.status === "success" && response.data) {
        setOrders(response.data);
        if (response.meta) {
          setMeta(response.meta);
        }
      }
    } catch (error) {
      console.error("Failed to fetch admin orders:", error);
      toast.error(
        "Failed to load systems orders. Please check your admin privileges.",
      );
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, [selectedStatuses, search, page, initialLimit]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders, refreshTrigger]);

  const refresh = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handleSearchChange = useCallback((keyword: string) => {
    setSearch(keyword);
    setPage(1); // Reset page to 1 for search query
  }, []);

  const handleStatusFilterToggle = useCallback((status: number) => {
    setSelectedStatuses((prev) => {
      const updated = prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status];
      return updated;
    });
    setPage(1); // Reset page to 1 on filter change
  }, []);

  const clearFilters = useCallback(() => {
    setSelectedStatuses([]);
    setSearch("");
    setPage(1);
  }, []);

  const updateOrderStatus = useCallback(
    async (orderId: string, status: number) => {
      try {
        setLoading(true);
        const response = await ordersUseCase.updateOrderStatusByAdmin.execute(
          orderId,
          status,
        );
        if (response.status === "success") {
          toast.success("Cập nhật trạng thái đơn hàng thành công!");
          refresh();
          return true;
        }
        return false;
      } catch (error) {
        console.log("Failed to update order status:", error);
        toast.error("Cập nhật trạng thái đơn hàng thất bại. Vui lòng thử lại!");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [refresh],
  );

  return {
    orders,
    loading,
    search,
    selectedStatuses,
    meta,
    page,
    refresh,
    handlePageChange,
    handleSearchChange,
    handleStatusFilterToggle,
    clearFilters,
    updateOrderStatus,
  };
};
