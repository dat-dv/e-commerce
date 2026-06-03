"use client";

import { useState } from "react";

import { adminOrderUseCase } from "@/domain/order";
import type { IAdminCustomerOrder } from "@/domain/user/types/user.model";
import usePagination from "@/hooks/use-pagination";

export const useOrdersView = () => {
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { data, loading, getFirstPage, onChangePagination, onChangeFilter } =
    usePagination<IAdminCustomerOrder>({
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
              items: response.items ?? [],
              meta: response.meta ?? {
                total: 0,
                page: params.page ?? 1,
                limit: params.limit ?? 10,
                totalPages: 0,
              },
            },
            message: "Success",
            timestamp: new Date().toISOString(),
            status: "success",
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

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    onChangeFilter([{ key: "search", value: q }]);
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
    setPage: onChangePagination,
    setPageSize: (limit: number) => getFirstPage({ page: 1, limit }),
    setSearchQuery: handleSearch,
  };
};
