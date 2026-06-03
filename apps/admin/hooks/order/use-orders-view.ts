"use client";

import { EOrderSortBy, ESortValue } from "@ecommerce/shared";
import type { PaginationQueryParams, TableSortDirection } from "@ecommerce/ui";
import { useState } from "react";

import { adminOrderUseCase } from "@/domain/order";
import type { IAdminCustomerOrder } from "@/domain/user/types/user.model";
import usePagination from "@/hooks/use-pagination";
import { getTableSortField, type TableSortFieldMap } from "@/utils/table-sort";

type OrdersViewPaginationParams = PaginationQueryParams & {
  sort_by?: EOrderSortBy;
  sort_order?: ESortValue;
};

const ORDER_SORT_COLUMN_MAP: TableSortFieldMap<EOrderSortBy> = {
  createdAt: EOrderSortBy.CREATED_AT,
  status: EOrderSortBy.STATUS,
  totalAmount: EOrderSortBy.TOTAL_AMOUNT,
};

const ORDER_SORT_DIRECTION_MAP: Record<TableSortDirection, ESortValue> = {
  asc: ESortValue.ASC,
  desc: ESortValue.DESC,
};

export const useOrdersView = () => {
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { data, loading, getFirstPage, onChangePagination, onChangeFilter } =
    usePagination<IAdminCustomerOrder, OrdersViewPaginationParams>({
      initialData: null,
      isSyncWithSearchParams: false,
      fetchPage: async (params) => {
        setError(null);
        try {
          const response = await adminOrderUseCase.getOrders.execute({
            page: params.page ?? 1,
            limit: params.limit ?? 10,
            search: params.search,
            sort_by: params.sort_by ?? undefined,
            sort_order: params.sort_order ?? undefined,
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
        } catch (err) {
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

  const handleSortChange = (
    column?: string,
    direction?: TableSortDirection,
  ) => {
    const sort = getTableSortField(column, direction, ORDER_SORT_COLUMN_MAP);

    onChangeFilter([
      { key: "sort_by", value: sort?.field ?? null },
      {
        key: "sort_order",
        value: sort ? ORDER_SORT_DIRECTION_MAP[sort.direction] : null,
      },
    ]);
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
    setSort: handleSortChange,
  };
};
