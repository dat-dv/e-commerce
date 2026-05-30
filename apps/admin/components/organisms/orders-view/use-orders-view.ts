"use client";

import type { IOrderResponse } from "@ecommerce/shared";
import { useCallback, useEffect, useMemo, useState } from "react";

import { adminOrderUseCase } from "@/domain/order";

export const useOrdersView = () => {
  const [orders, setOrders] = useState<IOrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [selectedOrder, setSelectedOrder] = useState<IOrderResponse | null>(
    null,
  );
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const fetchOrders = useCallback(
    async (currentPage: number) => {
      setLoading(true);
      setError(null);
      try {
        const response = await adminOrderUseCase.getOrders.execute({
          page: currentPage,
          limit,
        });
        setOrders(response.data?.items ?? []);
        setTotal(response.data?.meta?.total ?? 0);
        setTotalPages(response.data?.meta?.totalPages ?? 0);
      } catch (err: unknown) {
        console.error(err);
        setError("Failed to fetch order data. Please check your permissions.");
      } finally {
        setLoading(false);
      }
    },
    [limit],
  );

  useEffect(() => {
    fetchOrders(page);
  }, [page, fetchOrders]);

  /** Client-side filter while the user types — server-side pagination handles the rest. */
  const filteredOrders = useMemo(() => {
    if (!searchQuery) return orders;
    const q = searchQuery.toLowerCase();
    return orders.filter(
      (o) =>
        o.id.toLowerCase().includes(q) ||
        `${o.user?.first_name ?? ""} ${o.user?.last_name ?? ""}`
          .toLowerCase()
          .includes(q) ||
        o.user?.email?.toLowerCase().includes(q),
    );
  }, [orders, searchQuery]);

  const handleViewDetail = (order: IOrderResponse) => {
    setSelectedOrder(order);
    setIsDetailOpen(true);
  };

  return {
    orders,
    loading,
    error,
    searchQuery,
    page,
    limit,
    total,
    totalPages,
    selectedOrder,
    isDetailOpen,
    filteredOrders,
    setPage,
    setSearchQuery,
    setIsDetailOpen,
    handleViewDetail,
  };
};
