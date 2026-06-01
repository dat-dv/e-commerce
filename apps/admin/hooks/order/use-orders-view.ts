"use client";

import type { IOrderResponse } from "@ecommerce/shared";
import { useState } from "react";

import { adminOrderUseCase } from "@/domain/order";
import usePagination from "@/hooks/use-pagination";

export const useOrdersView = () => {
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<IOrderResponse | null>(
    null,
  );
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const { data, loading, onChangePagination, onChangeFilter } =
    usePagination<IOrderResponse>({
      initialData: null,
      isSyncWithSearchParams: false,
      fetchPage: async (params) => {
        setError(null);
        try {
          const response = await adminOrderUseCase.getOrders.execute({
            page: params.page ?? 1,
            limit: params.limit ?? 10,
            search: params.search,
          });
          return {
            data: {
              items: response.data?.items ?? [],
              meta: response.data?.meta ?? {
                total: 0,
                page: params.page ?? 1,
                limit: params.limit ?? 10,
                totalPages: 0,
              },
            },
            message: response.message,
            timestamp: response.timestamp || new Date().toISOString(),
            status: response.status as "success" | "fail",
          };
        } catch (err: unknown) {
          console.error(err);
          setError(
            "Failed to fetch order data. Please check your permissions.",
          );
          throw err;
        }
      },
    });

  const filteredOrders = data.items;

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    onChangeFilter([{ key: "search", value: q }]);
  };

  const handleViewDetail = (order: IOrderResponse) => {
    setSelectedOrder(order);
    setIsDetailOpen(true);
  };

  return {
    orders: data.items,
    loading,
    error,
    searchQuery,
    page: data.meta.page,
    limit: data.meta.limit,
    total: data.meta.total,
    totalPages: data.meta.totalPages,
    selectedOrder,
    isDetailOpen,
    filteredOrders,
    setPage: onChangePagination,
    setSearchQuery: handleSearch,
    setIsDetailOpen,
    handleViewDetail,
  };
};
