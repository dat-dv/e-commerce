"use client";

import {
  EOrderStatus,
  type IApiResponse,
  type IOrderResponse,
} from "@ecommerce/shared";
import {
  Avatar,
  BasicLoading,
  Button,
  Dialog,
  DialogPanel,
  DialogTitle,
  SearchInput,
} from "@ecommerce/ui";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Eye,
  Package,
  User as UserIcon,
} from "lucide-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import { API_ROUTES } from "@/constants/routes";
import { type ApiListResponse } from "@/utils/request";
import { apiClient } from "@/utils/request/api-client";

// ─── Status helpers ────────────────────────────────────────────────────────────

const ORDER_STATUS_MAP: Record<number, { label: string; color: string }> = {
  [EOrderStatus.PENDING]: {
    label: "Pending",
    color: "bg-yellow-500/10 text-yellow-400",
  },
  [EOrderStatus.PAID]: { label: "Paid", color: "bg-blue-500/10 text-blue-400" },
  [EOrderStatus.SHIPPING]: {
    label: "Shipping",
    color: "bg-indigo-500/10 text-indigo-400",
  },
  [EOrderStatus.DELIVERED]: {
    label: "Delivered",
    color: "bg-emerald-500/10 text-emerald-400",
  },
  [EOrderStatus.CANCEL_REQUESTED]: {
    label: "Cancel Requested",
    color: "bg-orange-500/10 text-orange-400",
  },
  [EOrderStatus.CANCEL_PROCESSING]: {
    label: "Cancel Processing",
    color: "bg-orange-500/10 text-orange-400",
  },
  [EOrderStatus.CANCELLED]: {
    label: "Cancelled",
    color: "bg-red-500/10 text-red-400",
  },
  [EOrderStatus.RETURN_REQUESTED]: {
    label: "Return Requested",
    color: "bg-purple-500/10 text-purple-400",
  },
  [EOrderStatus.RETURN_PROCESSING]: {
    label: "Return Processing",
    color: "bg-purple-500/10 text-purple-400",
  },
  [EOrderStatus.RETURNED]: {
    label: "Returned",
    color: "bg-zinc-500/10 text-zinc-400",
  },
  [EOrderStatus.RETURN_REJECTED]: {
    label: "Return Rejected",
    color: "bg-red-500/10 text-red-400",
  },
};

const getOrderStatus = (status: number) =>
  ORDER_STATUS_MAP[status] ?? {
    label: `Status ${status}`,
    color: "bg-zinc-500/10 text-zinc-400",
  };

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    amount,
  );

const formatDate = (
  d: string | Date | null | undefined,
  opts: Intl.DateTimeFormatOptions = {},
) =>
  d
    ? new Date(d).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        ...opts,
      })
    : "—";

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * @description OrdersView organism renders the admin order listing, search, pagination, and detail modal.
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

  return (
    <>
      {loading && <BasicLoading isBlur={false} />}

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[var(--app-text)] sm:text-3xl">
              Order Management
            </h1>
            <p className="mt-1.5 text-sm text-[var(--muted)]">
              Monitor and manage all customer orders across the platform.
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] px-4 py-2.5 shadow-sm backdrop-blur-xl">
            <Package className="h-5 w-5 text-indigo-400" />
            <span className="text-sm font-semibold text-[var(--app-text)]">
              {total} Total Orders
            </span>
          </div>
        </div>

        {/* Search */}
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

        {/* Table */}
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
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-red-400"
                    >
                      {error}
                    </td>
                  </tr>
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-[var(--muted)]"
                    >
                      No orders found.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => {
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
                            onClick={() => {
                              setSelectedOrder(order);
                              setIsDetailOpen(true);
                            }}
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
                Page{" "}
                <span className="font-bold text-[var(--app-text)]">{page}</span>{" "}
                of{" "}
                <span className="font-bold text-[var(--app-text)]">
                  {totalPages}
                </span>{" "}
                (
                <span className="font-bold text-[var(--app-text)]">
                  {total}
                </span>{" "}
                orders)
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 p-0 text-[var(--app-text)]/80 transition-colors disabled:opacity-40"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 p-0 text-[var(--app-text)]/80 transition-colors disabled:opacity-40"
                  aria-label="Next page"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Order Detail Dialog */}
      <Dialog isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)}>
        <DialogPanel className="max-w-xl rounded-2xl border border-white/[0.08] bg-[#0c0d12]/95 p-6 shadow-2xl backdrop-blur-2xl">
          <DialogTitle className="text-xl font-bold text-[var(--app-text)]">
            Order Details
          </DialogTitle>

          {selectedOrder && (
            <div className="mt-6 space-y-5">
              {/* Order ID & Status */}
              <div className="flex items-center justify-between rounded-xl border border-white/[0.04] bg-white/2 px-4 py-3">
                <div>
                  <p className="text-[10px] font-bold tracking-wider text-[var(--muted)] uppercase">
                    Order ID
                  </p>
                  <code className="text-sm font-bold text-indigo-300">
                    #{selectedOrder.id.toUpperCase()}
                  </code>
                </div>
                <span
                  className={`rounded-md px-3 py-1 text-xs font-semibold ${getOrderStatus(selectedOrder.status).color}`}
                >
                  {getOrderStatus(selectedOrder.status).label}
                </span>
              </div>

              {/* Customer */}
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold tracking-wider text-[var(--muted)] uppercase">
                  Customer
                </p>
                <div className="flex items-center gap-3 rounded-xl border border-white/[0.04] bg-white/2 px-4 py-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20">
                    <Avatar
                      name={`${selectedOrder.user?.first_name ?? ""} ${selectedOrder.user?.last_name ?? ""}`}
                      size={40}
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--app-text)]">
                      {[
                        selectedOrder.user?.first_name,
                        selectedOrder.user?.last_name,
                      ]
                        .filter(Boolean)
                        .join(" ") || "Unknown"}
                    </p>
                    <p className="text-xs text-[var(--muted)]">
                      {selectedOrder.user?.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Financials */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-white/[0.04] bg-white/2 px-4 py-3">
                  <p className="text-[10px] font-bold tracking-wider text-[var(--muted)] uppercase">
                    Total Amount
                  </p>
                  <p className="mt-1 text-base font-bold text-emerald-400">
                    {formatCurrency(selectedOrder.total_amount)}
                  </p>
                </div>
                <div className="rounded-xl border border-white/[0.04] bg-white/2 px-4 py-3">
                  <p className="text-[10px] font-bold tracking-wider text-[var(--muted)] uppercase">
                    Discount
                  </p>
                  <p className="mt-1 text-base font-bold text-orange-400">
                    {formatCurrency(selectedOrder.discount_amount ?? 0)}
                  </p>
                </div>
              </div>

              {/* Order Items */}
              {selectedOrder.items && selectedOrder.items.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-[10px] font-bold tracking-wider text-[var(--muted)] uppercase">
                    Items ({selectedOrder.items.length})
                  </p>
                  <div className="space-y-2 rounded-xl border border-white/[0.04] bg-white/2 p-3">
                    {selectedOrder.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-2.5">
                          <Package className="h-4 w-4 shrink-0 text-indigo-400" />
                          <span className="text-sm text-[var(--app-text)]">
                            SKU:{" "}
                            <code className="text-indigo-300">
                              {item.sku_id.slice(0, 8)}
                            </code>
                            <span className="ml-1 text-[var(--muted)]">
                              × {item.quantity}
                            </span>
                          </span>
                        </div>
                        <span className="shrink-0 text-sm font-semibold text-[var(--app-text)]">
                          {formatCurrency(item.price)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 rounded-xl border border-white/[0.04] bg-white/2 px-4 py-3">
                  <Calendar className="h-4 w-4 shrink-0 text-[var(--muted)]" />
                  <div>
                    <p className="text-[10px] font-bold tracking-wider text-[var(--muted)] uppercase">
                      Placed
                    </p>
                    <p className="text-xs text-[var(--app-text)]">
                      {formatDate(selectedOrder.created_at)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-white/[0.04] bg-white/2 px-4 py-3">
                  <Calendar className="h-4 w-4 shrink-0 text-[var(--muted)]" />
                  <div>
                    <p className="text-[10px] font-bold tracking-wider text-[var(--muted)] uppercase">
                      Updated
                    </p>
                    <p className="text-xs text-[var(--app-text)]">
                      {formatDate(selectedOrder.updated_at)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Close */}
              <div className="flex justify-end pt-2">
                <Button
                  onClick={() => setIsDetailOpen(false)}
                  className="rounded-lg bg-indigo-600 px-6 py-2.5 font-bold text-white shadow-lg shadow-indigo-500/10 hover:bg-indigo-500"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogPanel>
      </Dialog>
    </>
  );
};

OrdersView.displayName = "OrdersView";
