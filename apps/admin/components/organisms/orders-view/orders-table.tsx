import { type IOrderResponse } from "@ecommerce/shared";
import {
  Button,
  type ITableColumn,
  Pagination,
  TableCommon,
} from "@ecommerce/ui";
import { Eye, User as UserIcon } from "lucide-react";

import { formatCurrency, formatDate, getOrderStatus } from "./order.utils";

interface IOrdersTableProps {
  orders: IOrderResponse[];
  loading?: boolean;
  error: string | null;
  page: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onViewDetail: (order: IOrderResponse) => void;
}

export const OrdersTable = ({
  orders,
  loading = false,
  error,
  page,
  total,
  totalPages,
  onPageChange,
  onViewDetail,
}: IOrdersTableProps) => {
  const columns: ITableColumn<IOrderResponse>[] = [
    {
      key: "id",
      header: "Order ID",
      render: (order) => (
        <code className="rounded bg-white/5 px-2 py-1 text-xs text-indigo-300">
          #{order.id.slice(0, 8).toUpperCase()}
        </code>
      ),
    },
    {
      key: "customer",
      header: "Customer",
      render: (order) => {
        const customerName =
          [order.user?.first_name, order.user?.last_name]
            .filter(Boolean)
            .join(" ") ||
          order.user?.email ||
          "Unknown";

        return (
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20">
              <UserIcon className="h-4 w-4 text-indigo-400" />
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
      render: (order) => {
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
      render: (order) => formatCurrency(order.total_amount),
    },
    {
      key: "created_at",
      header: "Date",
      render: (order) => formatDate(order.created_at),
    },
    {
      key: "actions",
      header: "",
      className: "text-right",
      render: (order) => (
        <Button
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation();
            onViewDetail(order);
          }}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 p-0 text-[var(--app-text)]/80 transition-colors hover:bg-indigo-500 hover:text-white"
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
        data={orders}
        columns={columns}
        loading={loading}
        error={error}
        onRowClick={onViewDetail}
        emptyState="No orders found."
      />

      {/* Pagination */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
        className="w-auto py-0"
      />
    </div>
  );
};

OrdersTable.displayName = "OrdersTable";
