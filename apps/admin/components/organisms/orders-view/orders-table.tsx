import { type IOrderResponse } from "@ecommerce/shared";
import { Button } from "@ecommerce/ui";
import { ChevronLeft, ChevronRight, Eye, User as UserIcon } from "lucide-react";

import { formatCurrency, formatDate, getOrderStatus } from "./order.utils";

interface IOrdersTableProps {
  orders: IOrderResponse[];
  error: string | null;
  page: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onViewDetail: (order: IOrderResponse) => void;
}

export const OrdersTable = ({
  orders,
  error,
  page,
  total,
  totalPages,
  onPageChange,
  onViewDetail,
}: IOrdersTableProps) => (
  <div className="overflow-hidden rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] shadow-xl backdrop-blur-xl">
    <div className="overflow-x-auto">
      <table className="w-full min-w-[900px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-[var(--border-color)] bg-white/1 text-xs font-bold tracking-wider text-[var(--muted)] uppercase">
            <th className="px-6 py-4">Order ID</th>
            <th className="px-6 py-4">Customer</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Total</th>
            <th className="px-6 py-4">Date</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border-color)]">
          {error ? (
            <tr>
              <td colSpan={6} className="px-6 py-12 text-center text-red-400">
                {error}
              </td>
            </tr>
          ) : orders.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                className="px-6 py-12 text-center text-[var(--muted)]"
              >
                No orders found.
              </td>
            </tr>
          ) : (
            orders.map((order) => {
              const statusInfo = getOrderStatus(order.status);
              const customerName =
                [order.user?.first_name, order.user?.last_name]
                  .filter(Boolean)
                  .join(" ") ||
                order.user?.email ||
                "Unknown";

              return (
                <tr
                  key={order.id}
                  className="transition-colors hover:bg-white/1"
                >
                  <td className="px-6 py-4">
                    <code className="rounded bg-white/5 px-2 py-1 text-xs text-indigo-300">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </code>
                  </td>
                  <td className="px-6 py-4">
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
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block rounded-md px-2.5 py-0.5 text-xs font-semibold ${statusInfo.color}`}
                    >
                      {statusInfo.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-[var(--app-text)]">
                    {formatCurrency(order.total_amount)}
                  </td>
                  <td className="px-6 py-4 text-[var(--muted)]">
                    {formatDate(order.created_at)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button
                      variant="ghost"
                      onClick={() => onViewDetail(order)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 p-0 text-[var(--app-text)]/80 transition-colors hover:bg-indigo-500 hover:text-white"
                      aria-label={`View order ${order.id}`}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>

    {/* Pagination */}
    {totalPages > 1 && (
      <div className="flex items-center justify-between border-t border-[var(--border-color)] px-6 py-4">
        <span className="text-xs text-[var(--muted)]">
          Page <span className="font-bold text-[var(--app-text)]">{page}</span>{" "}
          of{" "}
          <span className="font-bold text-[var(--app-text)]">{totalPages}</span>{" "}
          (<span className="font-bold text-[var(--app-text)]">{total}</span>{" "}
          orders)
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            disabled={page === 1}
            onClick={() => onPageChange(Math.max(page - 1, 1))}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 p-0 text-[var(--app-text)]/80 transition-colors disabled:opacity-40"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            disabled={page === totalPages}
            onClick={() => onPageChange(Math.min(page + 1, totalPages))}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 p-0 text-[var(--app-text)]/80 transition-colors disabled:opacity-40"
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    )}
  </div>
);

OrdersTable.displayName = "OrdersTable";
