"use client";

import { type IApiResponse, type IOrderResponse } from "@ecommerce/shared";
import { SearchInput } from "@ecommerce/ui";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import { API_ROUTES } from "@/constants/routes";
import { type ApiListResponse } from "@/utils/request";
import { apiClient } from "@/utils/request/api-client";

import { OrderDetailDialog } from "./order-detail-dialog";
import { OrdersHeader } from "./orders-header";
import { OrdersTable } from "./orders-table";

/**
 * @description Orchestrates data fetching and state for the orders management view.
 * Delegates all rendering to OrdersHeader, OrdersTable, and OrderDetailDialog.
 */
export const OrdersView = () => {
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
        const response = await apiClient.get<
          IApiResponse<ApiListResponse<IOrderResponse>>
        >(API_ROUTES.ORDERS.ALL, { params: { page: currentPage, limit } });
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

  return (
    <div className="space-y-6">
      <OrdersHeader total={total} />

      {/* Search bar */}
      <div className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-4 shadow-xl backdrop-blur-xl">
        <SearchInput
          placeholder="Search by order ID, customer name or email..."
          value={searchQuery}
          onSearch={(q) => setSearchQuery(q)}
          onChange={(q) => setSearchQuery(q)}
          showSubmitButton={false}
          className="w-full"
        />
      </div>

      <OrdersTable
        orders={filteredOrders}
        error={error}
        page={page}
        total={total}
        totalPages={totalPages}
        onPageChange={setPage}
        onViewDetail={handleViewDetail}
      />

      <OrderDetailDialog
        order={selectedOrder}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />
    </div>
  );
};

OrdersView.displayName = "OrdersView";
