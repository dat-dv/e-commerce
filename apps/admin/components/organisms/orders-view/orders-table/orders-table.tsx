"use client";

import { type IOrderResponse } from "@ecommerce/shared";
import {
  Button,
  type CommonTableColumn,
  TableCommon,
  type TableQuery,
  type TableSortDirection,
} from "@ecommerce/ui";
import { Eye, User as UserIcon } from "lucide-react";
import { useState } from "react";

import {
  formatCurrency,
  formatDate,
  getOrderStatus,
} from "@/components/organisms/orders-view/order.utils";

interface IOrdersTableProps {
  orders: IOrderResponse[];
  loading?: boolean;
  error: string | null;
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onViewDetail: (order: IOrderResponse) => void;
}

export const OrdersTable = ({
  orders,
  loading = false,
  error,
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  onViewDetail,
}: IOrdersTableProps) => {
  const [sortColumn, setSortColumn] = useState<string>();
  const [sortDirection, setSortDirection] = useState<TableSortDirection>();

  const handleQueryChange = (nextQuery: TableQuery) => {
    console.log("Orders table query change", nextQuery);
    setSortColumn(nextQuery.sortColumn);
    setSortDirection(nextQuery.sortDirection);

    if (nextQuery.pageSize !== pageSize) {
      onPageSizeChange(nextQuery.pageSize);
      return;
    }

    if (nextQuery.page !== page) {
      onPageChange(nextQuery.page);
    }
  };

  const columns: CommonTableColumn<IOrderResponse>[] = [
    {
      key: "id",
      header: "Order ID",
      sortable: true,
      resizable: true,
      renderItem: ({ item: order }) => (
        <code className="text-primary rounded bg-white/5 px-2 py-1 text-xs">
          #{order.id.slice(0, 8).toUpperCase()}
        </code>
      ),
    },
    {
      key: "customer",
      header: "Customer",
      sortable: true,
      resizable: true,
      renderItem: ({ item: order }) => {
        const customerName =
          [order.user?.first_name, order.user?.last_name]
            .filter(Boolean)
            .join(" ") ||
          order.user?.email ||
          "Unknown";

        return (
          <div className="flex items-center gap-2.5">
            <div className="from-primary/20 to-primary/10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br">
              <UserIcon className="text-primary h-4 w-4" />
            </div>
            <div>
              <p className="font-semibold text-[var(--app-text)]">
                {customerName}
              </p>
              {order.user?.email && (
                <p className="text-xs text-[var(--muted)]">
                  {order.user.email}
                </p>
              )}
            </div>
          </div>
        );
      },
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      resizable: true,
      renderItem: ({ item: order }) => {
        const statusInfo = getOrderStatus(order.status);
        return (
          <span
            className={`inline-block rounded-md px-2.5 py-0.5 text-xs font-semibold ${statusInfo.color}`}
          >
            {statusInfo.label}
          </span>
        );
      },
    },
    {
      key: "total_amount",
      header: "Total",
      sortable: true,
      resizable: true,
      renderItem: ({ item: order }) => formatCurrency(order.total_amount),
    },
    {
      key: "created_at",
      header: "Date",
      sortable: true,
      resizable: true,
      renderItem: ({ item: order }) => formatDate(order.created_at),
    },
    {
      key: "actions",
      width: 50,
      header: "",
      className: "text-right",
      renderItem: ({ item: order }) => (
        <Button
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation();
            onViewDetail(order);
          }}
          className="hover:bg-primary inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 p-0 text-[var(--app-text)]/80 transition-colors hover:text-white"
          aria-label={`View order ${order.id}`}
        >
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <TableCommon<IOrderResponse>
        name="admin-orders"
        data={orders}
        columns={columns}
        loading={loading}
        error={error}
        total={total}
        page={page}
        pageSize={pageSize}
        showIndex
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onQueryChange={handleQueryChange}
        emptyState="No orders found."
      />
    </div>
  );
};

OrdersTable.displayName = "OrdersTable";
