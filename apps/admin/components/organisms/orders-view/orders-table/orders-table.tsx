"use client";

import {
  Button,
  type CommonTableColumn,
  TableCommon,
  type TableQuery,
  type TableSortDirection,
} from "@ecommerce/ui";
import { ChevronDown, Eye, User as UserIcon } from "lucide-react";
import { useState } from "react";

import {
  formatCurrency,
  formatDate,
  getOrderStatus,
} from "@/components/organisms/orders-view/order.utils";
import type { IAdminCustomerOrder } from "@/domain/user/types/user.model";

import { OrdersTableExpandedRow } from "./orders-table-expanded-row";

interface IOrdersTableProps {
  orders: IAdminCustomerOrder[];
  loading?: boolean;
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onSortChange: (
    sortColumn?: string,
    sortDirection?: TableSortDirection,
  ) => void;
  onViewDetail: (order: IAdminCustomerOrder) => void;
}

export const OrdersTable = ({
  orders,
  loading = false,
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  onSortChange,
  onViewDetail,
}: IOrdersTableProps) => {
  const [sortColumn, setSortColumn] = useState<string>();
  const [sortDirection, setSortDirection] = useState<TableSortDirection>();

  const handleQueryChange = (nextQuery: TableQuery) => {
    const isSortChange =
      nextQuery.sortColumn !== sortColumn ||
      nextQuery.sortDirection !== sortDirection;

    setSortColumn(nextQuery.sortColumn);
    setSortDirection(nextQuery.sortDirection);

    if (isSortChange) {
      onSortChange(nextQuery.sortColumn, nextQuery.sortDirection);
      return;
    }

    if (nextQuery.pageSize !== pageSize) {
      onPageSizeChange(nextQuery.pageSize);
      return;
    }

    if (nextQuery.page !== page) {
      onPageChange(nextQuery.page);
    }
  };

  const columns: CommonTableColumn<IAdminCustomerOrder>[] = [
    {
      key: "expand",
      header: "Expand",
      resizable: true,
      className: "text-center",
      renderItem: ({ item: order, isExpanded, toggleExpanded }) => (
        <Button
          variant="ghost"
          onClick={(event) => {
            event.stopPropagation();
            toggleExpanded();
          }}
          className="hover:bg-primary/10 inline-flex h-8 w-8 items-center justify-center rounded-lg p-0 text-[var(--muted)] transition-colors hover:text-[var(--app-text)]"
          aria-label={`${isExpanded ? "Collapse" : "Expand"} order ${order.id}`}
        >
          <ChevronDown
            className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-360" : "rotate-270"}`}
          />
        </Button>
      ),
    },
    {
      key: "id",
      header: "Order ID",
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
      resizable: true,
      renderItem: ({ item: order }) => {
        const customerName =
          [order.user?.firstName, order.user?.lastName]
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
      key: "totalAmount",
      header: "Total",
      sortable: true,
      resizable: true,
      renderItem: ({ item: order }) =>
        formatCurrency(Number(order.totalAmount)),
    },
    {
      key: "createdAt",
      header: "Date",
      sortable: true,
      resizable: true,
      renderItem: ({ item: order }) => formatDate(order.createdAt),
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
      <TableCommon<IAdminCustomerOrder>
        name="admin-orders"
        data={orders}
        columns={columns}
        loading={loading}
        total={total}
        page={page}
        pageSize={pageSize}
        showIndex
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onQueryChange={handleQueryChange}
        emptyState="No orders found."
        isRowExpandable={(order) => Boolean(order.items?.length)}
        renderExpandedRow={({ item: order }) => (
          <OrdersTableExpandedRow order={order} />
        )}
      />
    </div>
  );
};

OrdersTable.displayName = "OrdersTable";
