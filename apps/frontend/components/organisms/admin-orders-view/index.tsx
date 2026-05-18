"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  FilterX,
  RefreshCw,
  Search,
} from "lucide-react";
import { toast } from "react-toastify";
import AppContainer from "@/components/atoms/app-container";
import Loading from "@/components/atoms/loading";
import { ORDER_STATUS_CONFIG } from "@/constants/order-status.constant";
import { TOrder } from "@/domain/orders/types/order.model";
import { useAdminOrders } from "@/hooks/orders/use-admin-orders";

const STATUS_OPTIONS = Object.entries(ORDER_STATUS_CONFIG).map(
  ([value, config]) => ({
    value: Number(value),
    label: config.label,
  }),
);

const dateFormatter = new Intl.DateTimeFormat("vi-VN", {
  dateStyle: "medium",
  timeStyle: "short",
});

const currencyFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat("vi-VN");

type AttributeValue = string | number | boolean | null;

const getStatusConfig = (status: number) =>
  ORDER_STATUS_CONFIG[status] || {
    label: "Unknown",
    color: "text-content/50 bg-content/10",
  };

const parseAttributes = (attributes?: string | null) => {
  if (!attributes) return null;

  try {
    const parsed = JSON.parse(attributes) as Record<string, AttributeValue>;
    return Object.entries(parsed)
      .map(([key, value]) => `${key}: ${String(value)}`)
      .join(" | ");
  } catch {
    return attributes;
  }
};

const getOrderPreview = (order: TOrder) => {
  const firstItem = order.items[0];
  const snap = firstItem?.snapshot;

  return {
    image: snap?.sku?.image_url || "/images/placeholder.png",
    name: snap?.sku?.product?.name || "Product",
    attributes: parseAttributes(snap?.sku?.attributes),
    extraCount: Math.max(order.items.length - 1, 0),
    quantity: order.items.reduce((total, item) => total + item.quantity, 0),
  };
};

export function AdminOrdersView() {
  const {
    orders,
    loading,
    search,
    selectedStatuses,
    meta,
    page,
    refresh,
    handlePageChange,
    handleSearchChange,
    handleStatusFilterToggle,
    clearFilters,
    updateOrderStatus,
  } = useAdminOrders({ initialLimit: 10 });

  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const hasFilters = selectedStatuses.length > 0 || search.trim().length > 0;

  const totalLabel = useMemo(() => {
    if (!meta) return "0 Orders";
    return `${numberFormatter.format(meta.total)} Orders`;
  }, [meta]);

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success("Order ID copied.");
  };

  const handleStatusUpdate = async (orderId: string, newStatus: number) => {
    setUpdatingId(orderId);
    await updateOrderStatus(orderId, newStatus);
    setUpdatingId(null);
  };

  return (
    <main className="min-h-screen bg-surface py-6 text-content">
      <AppContainer size="2xl" className="flex flex-col gap-6">
        <header className="flex flex-col gap-4 border-b border-content/10 pb-5 md:flex-row md:items-end md:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase text-content/45">
              Admin
            </p>
            <h1 className="mt-1 text-2xl font-bold text-content text-balance">
              Orders
            </h1>
            <p className="mt-1 text-sm text-content/60">
              Review orders, filter operational queues, and update fulfillment
              status.
            </p>
          </div>

          <button
            type="button"
            onClick={refresh}
            disabled={loading}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-content/15 px-3 text-sm font-semibold text-content hover:bg-content/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              aria-hidden="true"
              className={loading ? "size-4 animate-spin" : "size-4"}
            />
            Refresh
          </button>
        </header>

        <section
          aria-label="Order Filters"
          className="flex flex-col gap-4 border-b border-content/10 pb-5"
        >
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div className="min-w-0">
              <label
                htmlFor="admin-order-search"
                className="mb-1.5 block text-xs font-semibold uppercase text-content/45"
              >
                Search Orders
              </label>
              <div className="relative">
                <Search
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-content/35"
                />
                <input
                  id="admin-order-search"
                  name="admin-order-search"
                  type="search"
                  autoComplete="off"
                  placeholder="Order ID, email, customer…"
                  value={search}
                  onChange={(event) => handleSearchChange(event.target.value)}
                  className="h-10 w-full rounded-md border border-content/15 bg-surface pl-9 pr-3 text-sm text-content placeholder:text-content/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                />
              </div>
            </div>

            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-content/15 px-3 text-sm font-semibold text-content hover:bg-content/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                <FilterX aria-hidden="true" className="size-4" />
                Clear Filters
              </button>
            )}
          </div>

          <fieldset className="min-w-0">
            <legend className="mb-2 text-xs font-semibold uppercase text-content/45">
              Status
            </legend>
            <div className="flex flex-wrap gap-2">
              {STATUS_OPTIONS.map((status) => {
                const isSelected = selectedStatuses.includes(status.value);
                return (
                  <button
                    key={status.value}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => handleStatusFilterToggle(status.value)}
                    className={
                      isSelected
                        ? "rounded-md border border-primary bg-primary px-3 py-2 text-xs font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                        : "rounded-md border border-content/15 px-3 py-2 text-xs font-semibold text-content/70 hover:bg-content/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                    }
                  >
                    {status.label}
                  </button>
                );
              })}
            </div>
          </fieldset>
        </section>

        <section aria-live="polite" className="min-w-0">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-content">{totalLabel}</p>
            {meta && (
              <p className="text-sm text-content/55">
                Page {page} of {meta.totalPages || 1}
              </p>
            )}
          </div>

          {loading && orders.length === 0 ? (
            <div className="flex min-h-60 flex-col items-center justify-center rounded-md border border-content/10">
              <Loading />
              <span className="mt-3 text-sm text-content/55">
                Loading Orders…
              </span>
            </div>
          ) : orders.length === 0 ? (
            <EmptyOrders
              hasFilters={hasFilters}
              onClearFilters={clearFilters}
            />
          ) : (
            <OrderResults
              orders={orders}
              updatingId={updatingId}
              onCopy={copyToClipboard}
              onStatusUpdate={handleStatusUpdate}
            />
          )}
        </section>

        {meta && meta.totalPages > 1 && (
          <OrdersPagination
            page={page}
            totalPages={meta.totalPages}
            loading={loading}
            onPageChange={handlePageChange}
          />
        )}
      </AppContainer>
    </main>
  );
}

function EmptyOrders({
  hasFilters,
  onClearFilters,
}: {
  hasFilters: boolean;
  onClearFilters: () => void;
}) {
  return (
    <div className="flex min-h-60 flex-col items-center justify-center rounded-md border border-content/10 px-4 text-center">
      <h2 className="text-base font-semibold text-content">No Orders Found</h2>
      <p className="mt-1 max-w-sm text-sm text-content/55">
        Adjust the search or status filters to broaden the result set.
      </p>
      {hasFilters && (
        <button
          type="button"
          onClick={onClearFilters}
          className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}

function OrderResults({
  orders,
  updatingId,
  onCopy,
  onStatusUpdate,
}: {
  orders: TOrder[];
  updatingId: string | null;
  onCopy: (text: string) => void;
  onStatusUpdate: (orderId: string, newStatus: number) => void;
}) {
  return (
    <>
      <div className="hidden overflow-x-auto rounded-md border border-content/10 lg:block">
        <table className="min-w-full divide-y divide-content/10 text-sm">
          <thead className="bg-content/[0.03] text-left text-xs font-semibold uppercase text-content/45">
            <tr>
              <th scope="col" className="px-4 py-3">
                Order
              </th>
              <th scope="col" className="px-4 py-3">
                Item Preview
              </th>
              <th scope="col" className="px-4 py-3">
                Customer
              </th>
              <th scope="col" className="px-4 py-3">
                Date
              </th>
              <th scope="col" className="px-4 py-3 text-right">
                Total
              </th>
              <th scope="col" className="px-4 py-3">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-content/10">
            {orders.map((order) => (
              <OrderTableRow
                key={order.id}
                order={order}
                updatingId={updatingId}
                onCopy={onCopy}
                onStatusUpdate={onStatusUpdate}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 lg:hidden">
        {orders.map((order) => (
          <OrderCompactCard
            key={order.id}
            order={order}
            updatingId={updatingId}
            onCopy={onCopy}
            onStatusUpdate={onStatusUpdate}
          />
        ))}
      </div>
    </>
  );
}

function OrderTableRow({
  order,
  updatingId,
  onCopy,
  onStatusUpdate,
}: {
  order: TOrder;
  updatingId: string | null;
  onCopy: (text: string) => void;
  onStatusUpdate: (orderId: string, newStatus: number) => void;
}) {
  const preview = getOrderPreview(order);
  const status = getStatusConfig(order.status);
  const isUpdating = updatingId === order.id;

  return (
    <tr className="align-middle hover:bg-content/[0.025]">
      <td className="px-4 py-4">
        <OrderIdCell orderId={order.id} onCopy={onCopy} />
      </td>
      <td className="px-4 py-4">
        <OrderPreview preview={preview} />
      </td>
      <td className="px-4 py-4">
        <span className="block max-w-44 truncate font-mono text-xs text-content/65">
          {order.userId}
        </span>
      </td>
      <td className="px-4 py-4 tabular-nums text-content/65">
        {dateFormatter.format(new Date(order.createdAt))}
      </td>
      <td className="px-4 py-4 text-right font-semibold tabular-nums text-content">
        {currencyFormatter.format(order.totalAmount)}
      </td>
      <td className="px-4 py-4">
        <StatusSelect
          id={`status-${order.id}`}
          orderId={order.id}
          status={order.status}
          disabled={isUpdating}
          onStatusUpdate={onStatusUpdate}
        />
        <span
          className={`ml-2 inline-flex rounded-full px-2 py-1 text-xs font-semibold ${status.color}`}
        >
          {isUpdating ? "Updating…" : status.label}
        </span>
      </td>
    </tr>
  );
}

function OrderCompactCard({
  order,
  updatingId,
  onCopy,
  onStatusUpdate,
}: {
  order: TOrder;
  updatingId: string | null;
  onCopy: (text: string) => void;
  onStatusUpdate: (orderId: string, newStatus: number) => void;
}) {
  const preview = getOrderPreview(order);
  const status = getStatusConfig(order.status);
  const isUpdating = updatingId === order.id;

  return (
    <article className="rounded-md border border-content/10 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase text-content/45">
            Order
          </p>
          <OrderIdCell orderId={order.id} onCopy={onCopy} />
        </div>
        <span
          className={`shrink-0 rounded-full px-2 py-1 text-xs font-semibold ${status.color}`}
        >
          {isUpdating ? "Updating…" : status.label}
        </span>
      </div>

      <div className="mt-4">
        <OrderPreview preview={preview} />
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-xs font-semibold uppercase text-content/45">
            Customer
          </dt>
          <dd className="mt-1 truncate font-mono text-xs text-content/65">
            {order.userId}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase text-content/45">
            Total
          </dt>
          <dd className="mt-1 font-semibold tabular-nums text-content">
            {currencyFormatter.format(order.totalAmount)}
          </dd>
        </div>
        <div className="col-span-2">
          <dt className="text-xs font-semibold uppercase text-content/45">
            Date
          </dt>
          <dd className="mt-1 tabular-nums text-content/65">
            {dateFormatter.format(new Date(order.createdAt))}
          </dd>
        </div>
      </dl>

      <div className="mt-4">
        <StatusSelect
          id={`mobile-status-${order.id}`}
          orderId={order.id}
          status={order.status}
          disabled={isUpdating}
          onStatusUpdate={onStatusUpdate}
          fullWidth
        />
      </div>
    </article>
  );
}

function OrderIdCell({
  orderId,
  onCopy,
}: {
  orderId: string;
  onCopy: (text: string) => void;
}) {
  return (
    <div className="mt-1 flex max-w-52 items-center gap-2">
      <span className="truncate font-mono text-xs font-semibold text-content">
        {orderId}
      </span>
      <button
        type="button"
        aria-label={`Copy Order ${orderId}`}
        onClick={() => onCopy(orderId)}
        className="inline-flex size-8 shrink-0 items-center justify-center rounded-md text-content/50 hover:bg-content/5 hover:text-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
      >
        <Copy aria-hidden="true" className="size-4" />
      </button>
    </div>
  );
}

function OrderPreview({
  preview,
}: {
  preview: ReturnType<typeof getOrderPreview>;
}) {
  return (
    <div className="flex min-w-0 items-center gap-3 lg:min-w-72">
      <Image
        src={preview.image}
        alt={preview.name}
        width={48}
        height={48}
        className="size-12 rounded-md border border-content/10 object-cover"
      />
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-content">
          {preview.name}
        </p>
        <p className="truncate text-xs text-content/50">
          {preview.attributes || `${preview.quantity} Items`}
          {preview.extraCount > 0 && ` +${preview.extraCount} More`}
        </p>
      </div>
    </div>
  );
}

function StatusSelect({
  id,
  orderId,
  status,
  disabled,
  fullWidth = false,
  onStatusUpdate,
}: {
  id: string;
  orderId: string;
  status: number;
  disabled: boolean;
  fullWidth?: boolean;
  onStatusUpdate: (orderId: string, newStatus: number) => void;
}) {
  return (
    <>
      <label
        className={
          fullWidth
            ? "mb-1.5 block text-xs font-semibold uppercase text-content/45"
            : "sr-only"
        }
        htmlFor={id}
      >
        Status
      </label>
      <select
        id={id}
        name={id}
        value={status}
        disabled={disabled}
        onChange={(event) =>
          onStatusUpdate(orderId, Number(event.target.value))
        }
        className={
          fullWidth
            ? "h-10 w-full rounded-md border border-content/15 bg-surface px-3 text-sm text-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-50"
            : "h-9 min-w-36 rounded-md border border-content/15 bg-surface px-2 text-sm text-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-50"
        }
      >
        {STATUS_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </>
  );
}

function OrdersPagination({
  page,
  totalPages,
  loading,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  loading: boolean;
  onPageChange: (page: number) => void;
}) {
  return (
    <nav
      aria-label="Orders Pagination"
      className="flex flex-col gap-3 border-t border-content/10 pt-5 sm:flex-row sm:items-center sm:justify-between"
    >
      <p className="text-sm text-content/55">
        Showing page {page} of {totalPages}
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="Previous Page"
          disabled={page <= 1 || loading}
          onClick={() => onPageChange(page - 1)}
          className="inline-flex size-10 items-center justify-center rounded-md border border-content/15 text-content hover:bg-content/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft aria-hidden="true" className="size-4" />
        </button>

        <div className="flex max-w-[calc(100vw-8rem)] items-center gap-1 overflow-x-auto">
          {Array.from({ length: totalPages }, (_, index) => {
            const targetPage = index + 1;
            const isCurrent = page === targetPage;

            return (
              <button
                key={targetPage}
                type="button"
                aria-label={`Page ${targetPage}`}
                aria-current={isCurrent ? "page" : undefined}
                onClick={() => onPageChange(targetPage)}
                disabled={loading}
                className={
                  isCurrent
                    ? "inline-flex size-10 shrink-0 items-center justify-center rounded-md bg-primary text-sm font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                    : "inline-flex size-10 shrink-0 items-center justify-center rounded-md border border-content/15 text-sm font-semibold text-content/70 hover:bg-content/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-40"
                }
              >
                {targetPage}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          aria-label="Next Page"
          disabled={page >= totalPages || loading}
          onClick={() => onPageChange(page + 1)}
          className="inline-flex size-10 items-center justify-center rounded-md border border-content/15 text-content hover:bg-content/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronRight aria-hidden="true" className="size-4" />
        </button>
      </div>
    </nav>
  );
}
