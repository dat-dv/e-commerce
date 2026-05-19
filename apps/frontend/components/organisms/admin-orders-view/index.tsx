"use client";

import Image from "next/image";
import React, {
  useMemo,
  useState,
  useEffect,
  useRef,
  Fragment,
  useCallback,
} from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Copy,
  FilterX,
  RefreshCw,
} from "lucide-react";
import { toast } from "react-toastify";
import { AnimatePresence, motion } from "framer-motion";
import AppContainer from "@/components/atoms/app-container";
import Loading from "@/components/atoms/loading";
import Portal from "@/components/atoms/portal";
import SearchInput from "@/components/molecules/search-input";
import { parseOrderAttributes } from "@/components/molecules/order-part/order-display.utils";
import { OrderItemsPanel } from "@/components/molecules/order-part/order-items-panel";
import { ORDER_STATUS_CONFIG } from "@/constants/order-status.constant";
import { TOrder } from "@/domain/orders/types/order.model";
import { useAdminOrders } from "@/hooks/orders/use-admin-orders";
import { cn } from "@/utils/cn";
import type { Key } from "react-aria-components";
import { EOrderStatus } from "@ecommerce/shared";
import { useTranslations, useLocale } from "next-intl";

const STATUS_VALUES = Object.keys(ORDER_STATUS_CONFIG).map(
  (v) => Number(v) as EOrderStatus,
);

const getOrderPreview = (order: TOrder) => {
  const firstItem = order.items[0];
  const snap = firstItem?.snapshot;

  return {
    image: snap?.sku?.image_url || "/images/placeholder.png",
    name: snap?.sku?.product?.name || "Product",
    attributes: parseOrderAttributes(snap?.sku?.attributes),
    extraCount: Math.max(order.items.length - 1, 0),
    quantity: order.items.reduce((total, item) => total + item.quantity, 0),
  };
};

export function AdminOrdersView() {
  const t = useTranslations("AdminOrdersPage");
  const tStatus = useTranslations("OrderStatus");
  const locale = useLocale();

  const getStatusLabel = useCallback(
    (status: number) => {
      switch (status) {
        case EOrderStatus.PENDING:
          return tStatus("pending");
        case EOrderStatus.PAID:
          return tStatus("paid");
        case EOrderStatus.SHIPPING:
          return tStatus("shipping");
        case EOrderStatus.DELIVERED:
          return tStatus("delivered");
        case EOrderStatus.CANCEL_REQUESTED:
          return tStatus("cancelRequested");
        case EOrderStatus.CANCEL_PROCESSING:
          return tStatus("cancelProcessing");
        case EOrderStatus.CANCELLED:
          return tStatus("cancelled");
        case EOrderStatus.RETURN_REQUESTED:
          return tStatus("returnRequested");
        case EOrderStatus.RETURN_PROCESSING:
          return tStatus("returnProcessing");
        case EOrderStatus.RETURNED:
          return tStatus("returned");
        case EOrderStatus.RETURN_REJECTED:
          return tStatus("returnRejected");
        default:
          return "Unknown";
      }
    },
    [tStatus],
  );

  const STATUS_OPTIONS = useMemo(() => {
    return STATUS_VALUES.map((val) => ({
      value: val,
      label: getStatusLabel(val),
    }));
  }, [getStatusLabel]);

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
  const [expandedOrderIds, setExpandedOrderIds] = useState<Set<Key>>(
    () => new Set(),
  );
  const hasFilters = selectedStatuses.length > 0 || search.trim().length > 0;

  const totalLabel = useMemo(() => {
    if (!meta) return t("results.ordersCount", { count: 0 });
    return t("results.ordersCount", { count: meta.total });
  }, [meta, t]);

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success(t("results.copied"));
  };

  const handleStatusUpdate = async (orderId: string, newStatus: number) => {
    setUpdatingId(orderId);
    await updateOrderStatus(orderId, newStatus);
    setUpdatingId(null);
  };

  const handleExpandedToggle = (orderId: string) => {
    setExpandedOrderIds((current) => {
      const next = new Set(current);

      if (next.has(orderId)) {
        next.delete(orderId);
      } else {
        next.add(orderId);
      }

      return next;
    });
  };

  return (
    <main className="relative min-h-screen bg-surface py-8 text-content overflow-hidden">
      {/* Premium background radial glows */}
      <div className="pointer-events-none absolute -top-40 -right-40 -z-10 size-96 rounded-full bg-primary/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 -z-10 size-96 rounded-full bg-primary/5 blur-3xl" />

      <AppContainer size="2xl" className="flex flex-col gap-8">
        <header className="flex flex-col gap-4 border-b border-content/[0.08] pb-6 md:flex-row md:items-end md:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="inline-flex size-2 rounded-full bg-primary animate-pulse" />
              <p className="text-xs font-bold uppercase tracking-wider text-primary/80">
                {t("header.adminCenter")}
              </p>
            </div>
            <h1 className="mt-1 text-3xl font-extrabold text-content tracking-tight">
              {t("header.title")}
            </h1>
            <p className="mt-2 text-sm text-content/50 max-w-xl">
              {t("header.description")}
            </p>
          </div>

          <button
            type="button"
            onClick={refresh}
            disabled={loading}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-content/10 bg-surface/50 backdrop-blur-md px-4 text-sm font-semibold text-content transition-all duration-200 hover:bg-content/5 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              aria-hidden="true"
              className={
                loading
                  ? "size-4 animate-spin text-primary"
                  : "size-4 opacity-75"
              }
            />
            {t("header.refresh")}
          </button>
        </header>

        <section
          aria-label="Order Filters"
          className="flex flex-col gap-6 border-b border-content/[0.08] pb-6"
        >
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div className="min-w-0">
              <label
                htmlFor="admin-order-search"
                className="mb-2.5 block text-xs font-bold uppercase tracking-wider text-content/45"
              >
                {t("filters.searchLabel")}
              </label>
              <SearchInput
                id="admin-order-search"
                value={search}
                onSearch={handleSearchChange}
                placeholder={t("filters.searchPlaceholder")}
                loading={loading}
                className="w-full bg-surface/40 border border-content/10 backdrop-blur-md focus-within:border-primary/30"
              />
            </div>

            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-transparent bg-rose-500/10 px-4 text-sm font-semibold text-rose-600 transition-all duration-200 hover:bg-rose-500/20 hover:scale-[1.02] focus-visible:outline-none"
              >
                <FilterX aria-hidden="true" className="size-4" />
                {t("filters.clearActive")}
              </button>
            )}
          </div>

          <fieldset className="min-w-0">
            <legend className="mb-2.5 text-xs font-bold uppercase tracking-wider text-content/45">
              {t("filters.statusLabel")}
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
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold border transition-all duration-200 hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                      isSelected
                        ? "border-transparent bg-primary text-white shadow-[0_4px_12px_rgba(0,0,0,0.15)] ring-2 ring-primary/20"
                        : "border-content/10 bg-surface/40 backdrop-blur-md text-content/65 hover:bg-content/5 hover:border-content/20",
                    )}
                  >
                    <span
                      className={cn(
                        "size-1.5 rounded-full bg-current",
                        isSelected ? "bg-white" : "opacity-60",
                      )}
                    />
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
                {t("results.pageInfo", {
                  page: String(page),
                  totalPages: String(meta.totalPages || 1),
                })}
              </p>
            )}
          </div>

          {loading && orders.length === 0 ? (
            <div className="flex min-h-60 flex-col items-center justify-center rounded-md border border-content/10">
              <Loading />
              <span className="mt-3 text-sm text-content/55">
                {t("results.loading")}
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
              page={page}
              updatingId={updatingId}
              expandedOrderIds={expandedOrderIds}
              onCopy={copyToClipboard}
              onExpandedToggle={handleExpandedToggle}
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
  const t = useTranslations("AdminOrdersPage.results");
  return (
    <div className="flex min-h-60 flex-col items-center justify-center rounded-md border border-content/10 px-4 text-center">
      <h2 className="text-base font-semibold text-content">
        {t("noOrdersFound")}
      </h2>
      <p className="mt-1 max-w-sm text-sm text-content/55">
        {t("noOrdersDesc")}
      </p>
      {hasFilters && (
        <button
          type="button"
          onClick={onClearFilters}
          className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          {t("clearFilters")}
        </button>
      )}
    </div>
  );
}

function OrderResults({
  orders,
  page,
  updatingId,
  expandedOrderIds,
  onCopy,
  onExpandedToggle,
  onStatusUpdate,
}: {
  orders: TOrder[];
  page: number;
  updatingId: string | null;
  expandedOrderIds: Set<Key>;
  onCopy: (text: string) => void;
  onExpandedToggle: (orderId: string) => void;
  onStatusUpdate: (orderId: string, newStatus: number) => void;
}) {
  const t = useTranslations("AdminOrdersPage.results");
  const locale = useLocale();

  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        dateStyle: "medium",
        timeStyle: "short",
      }),
    [locale],
  );

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0,
      }),
    [locale],
  );

  return (
    <>
      <div className="hidden overflow-x-auto rounded-xl border border-content/[0.06] bg-surface/40 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] lg:block">
        <table className="w-full border-collapse text-left text-sm text-content">
          <thead>
            <tr className="border-b border-content/[0.06] bg-content/[0.02] text-xs font-semibold uppercase tracking-wider text-content/45">
              <th className="px-6 py-4 text-center w-16">{t("stt")}</th>
              <th className="px-6 py-4">{t("orderId")}</th>
              <th className="px-6 py-4">{t("customer")}</th>
              <th className="px-6 py-4">{t("date")}</th>
              <th className="px-6 py-4 text-right">{t("total")}</th>
              <th className="px-6 py-4 text-center">{t("status")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-content/[0.06]">
            {orders.map((order, index) => {
              const isExpanded = expandedOrderIds.has(order.id);
              const isUpdating = updatingId === order.id;

              return (
                <Fragment key={order.id}>
                  <tr
                    className={cn(
                      "transition-colors duration-150 hover:bg-content/[0.015] align-middle",
                      isExpanded && "bg-content/[0.005]",
                    )}
                  >
                    <td className="px-6 py-4 text-center text-content/50 font-medium font-mono text-xs w-16 border-r border-content/[0.03]">
                      {(page - 1) * 10 + index + 1}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => onExpandedToggle(order.id)}
                          className="inline-flex size-6 items-center justify-center rounded-md text-content/50 transition-colors hover:bg-content/5 hover:text-content focus-visible:outline-none"
                        >
                          <ChevronRight
                            aria-hidden="true"
                            className={cn(
                              "size-4 transition-transform duration-200",
                              isExpanded && "rotate-90",
                            )}
                          />
                        </button>
                        <OrderIdCell orderId={order.id} onCopy={onCopy} />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {order.user ? (
                        <div className="flex flex-col">
                          <span className="font-semibold text-content max-w-44 truncate">
                            {order.user.firstName || order.user.lastName
                              ? `${order.user.firstName || ""} ${order.user.lastName || ""}`.trim()
                              : t("noName")}
                          </span>
                          <span className="text-xs text-content/50 max-w-44 truncate">
                            {order.user.email}
                          </span>
                        </div>
                      ) : (
                        <span className="block max-w-44 truncate font-mono text-xs text-content/65">
                          {order.userId}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 tabular-nums text-content/65">
                      {dateFormatter.format(new Date(order.createdAt))}
                    </td>
                    <td className="px-6 py-4 text-right font-semibold tabular-nums text-content">
                      {currencyFormatter.format(order.totalAmount)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <StatusDropdown
                        orderId={order.id}
                        status={order.status}
                        disabled={isUpdating}
                        onStatusUpdate={onStatusUpdate}
                      />
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr className="bg-content/[0.005]">
                      <td colSpan={6} className="p-3 bg-content/[0.01]">
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          className="overflow-hidden"
                        >
                          <div className="pb-3 pt-1">
                            <OrderItemsPanel items={order.items} />
                          </div>
                        </motion.div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 lg:hidden">
        {orders.map((order) => (
          <OrderCompactCard
            key={order.id}
            order={order}
            updatingId={updatingId}
            isExpanded={expandedOrderIds.has(order.id)}
            onCopy={onCopy}
            onExpandedToggle={onExpandedToggle}
            onStatusUpdate={onStatusUpdate}
          />
        ))}
      </div>
    </>
  );
}

function OrderCompactCard({
  order,
  updatingId,
  isExpanded,
  onCopy,
  onExpandedToggle,
  onStatusUpdate,
}: {
  order: TOrder;
  updatingId: string | null;
  isExpanded: boolean;
  onCopy: (text: string) => void;
  onExpandedToggle: (orderId: string) => void;
  onStatusUpdate: (orderId: string, newStatus: number) => void;
}) {
  const t = useTranslations("AdminOrdersPage.results");
  const locale = useLocale();

  const preview = getOrderPreview(order);
  const isUpdating = updatingId === order.id;

  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        dateStyle: "medium",
        timeStyle: "short",
      }),
    [locale],
  );

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0,
      }),
    [locale],
  );

  return (
    <article className="rounded-xl border border-content/[0.06] bg-surface/40 backdrop-blur-md p-5 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase text-content/45">
            {t("orderId")}
          </p>
          <OrderIdCell orderId={order.id} onCopy={onCopy} />
        </div>
        <StatusDropdown
          orderId={order.id}
          status={order.status}
          disabled={isUpdating}
          onStatusUpdate={onStatusUpdate}
        />
      </div>

      <div className="mt-4">
        <OrderPreview preview={preview} />
      </div>

      <button
        type="button"
        aria-expanded={isExpanded}
        onClick={() => onExpandedToggle(order.id)}
        className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-md border border-content/15 text-sm font-semibold text-content hover:bg-content/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
      >
        <ChevronDown
          aria-hidden="true"
          className={
            isExpanded
              ? "size-4 rotate-180 transition-transform"
              : "size-4 transition-transform"
          }
        />
        {isExpanded
          ? t("hideItems")
          : t("showItems", { count: order.items.length })}
      </button>

      {isExpanded && (
        <div className="mt-3">
          <OrderItemsPanel items={order.items} compact />
        </div>
      )}

      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-xs font-semibold uppercase text-content/45">
            {t("customer")}
          </dt>
          <dd className="mt-1 truncate text-xs text-content/65">
            {order.user ? (
              <span className="font-semibold text-content block truncate">
                {order.user.firstName || order.user.lastName
                  ? `${order.user.firstName || ""} ${order.user.lastName || ""}`.trim()
                  : t("noName")}
              </span>
            ) : (
              <span className="font-mono block truncate">{order.userId}</span>
            )}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase text-content/45">
            {t("total")}
          </dt>
          <dd className="mt-1 font-semibold tabular-nums text-content">
            {currencyFormatter.format(order.totalAmount)}
          </dd>
        </div>
        <div className="col-span-2">
          <dt className="text-xs font-semibold uppercase text-content/45">
            {t("date")}
          </dt>
          <dd className="mt-1 tabular-nums text-content/65">
            {dateFormatter.format(new Date(order.createdAt))}
          </dd>
        </div>
      </dl>
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
  const t = useTranslations("AdminOrdersPage.results");
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
          {preview.attributes || t("showItems", { count: preview.quantity })}
          {preview.extraCount > 0 && ` +${preview.extraCount}`}
        </p>
      </div>
    </div>
  );
}

function isStatusTransitionAllowed(
  current: EOrderStatus,
  target: EOrderStatus,
): boolean {
  if (current === target) return true;

  const terminal = [
    EOrderStatus.CANCELLED,
    EOrderStatus.RETURNED,
    EOrderStatus.RETURN_REJECTED,
  ];
  if (terminal.includes(current)) return false;

  const transitions: Partial<Record<EOrderStatus, EOrderStatus[]>> = {
    [EOrderStatus.PENDING]: [EOrderStatus.PAID, EOrderStatus.CANCELLED],
    [EOrderStatus.PAID]: [EOrderStatus.SHIPPING, EOrderStatus.CANCELLED],
    [EOrderStatus.SHIPPING]: [EOrderStatus.DELIVERED],
    [EOrderStatus.DELIVERED]: [EOrderStatus.RETURN_REQUESTED],
    [EOrderStatus.CANCEL_REQUESTED]: [
      EOrderStatus.CANCEL_PROCESSING,
      EOrderStatus.CANCELLED,
    ],
    [EOrderStatus.CANCEL_PROCESSING]: [EOrderStatus.CANCELLED],
    [EOrderStatus.RETURN_REQUESTED]: [
      EOrderStatus.RETURN_PROCESSING,
      EOrderStatus.RETURN_REJECTED,
    ],
    [EOrderStatus.RETURN_PROCESSING]: [
      EOrderStatus.RETURNED,
      EOrderStatus.RETURN_REJECTED,
    ],
  };

  return transitions[current]?.includes(target) ?? false;
}

function StatusDropdown({
  orderId,
  status,
  disabled,
  fullWidth = false,
  onStatusUpdate,
}: {
  orderId: string;
  status: EOrderStatus;
  disabled: boolean;
  fullWidth?: boolean;
  onStatusUpdate: (orderId: string, newStatus: EOrderStatus) => void;
}) {
  const tStatus = useTranslations("OrderStatus");
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);

  const getStatusLabel = useCallback(
    (status: number) => {
      switch (status) {
        case EOrderStatus.PENDING:
          return tStatus("pending");
        case EOrderStatus.PAID:
          return tStatus("paid");
        case EOrderStatus.SHIPPING:
          return tStatus("shipping");
        case EOrderStatus.DELIVERED:
          return tStatus("delivered");
        case EOrderStatus.CANCEL_REQUESTED:
          return tStatus("cancelRequested");
        case EOrderStatus.CANCEL_PROCESSING:
          return tStatus("cancelProcessing");
        case EOrderStatus.CANCELLED:
          return tStatus("cancelled");
        case EOrderStatus.RETURN_REQUESTED:
          return tStatus("returnRequested");
        case EOrderStatus.RETURN_PROCESSING:
          return tStatus("returnProcessing");
        case EOrderStatus.RETURNED:
          return tStatus("returned");
        case EOrderStatus.RETURN_REJECTED:
          return tStatus("returnRejected");
        default:
          return "Unknown";
      }
    },
    [tStatus],
  );

  const statusColor =
    ORDER_STATUS_CONFIG[status]?.color || "text-content/50 bg-content/10";
  const statusLabel = getStatusLabel(status);

  const updateCoords = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY + 6,
        left: rect.left + window.scrollX,
        width: Math.max(rect.width, 180),
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      updateCoords();
      window.addEventListener("resize", updateCoords);
      window.addEventListener("scroll", updateCoords, true);
    }
    return () => {
      window.removeEventListener("resize", updateCoords);
      window.removeEventListener("scroll", updateCoords, true);
    };
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        disabled={
          disabled ||
          status === EOrderStatus.CANCELLED ||
          status === EOrderStatus.RETURNED
        }
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
          statusColor,
          disabled ||
            status === EOrderStatus.CANCELLED ||
            status === EOrderStatus.RETURNED
            ? "opacity-65 cursor-not-allowed"
            : "cursor-pointer hover:scale-[1.03] hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] border-transparent",
          fullWidth &&
            "w-full h-10 px-3 justify-between bg-surface border border-content/10 rounded-md",
        )}
      >
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="relative flex size-1.5 shrink-0 rounded-full bg-current" />
          <span className="truncate">{statusLabel}</span>
        </div>
        {disabled ? (
          <RefreshCw className="size-3 animate-spin opacity-60 shrink-0" />
        ) : status === EOrderStatus.CANCELLED ||
          status === EOrderStatus.RETURNED ? null : (
          <ChevronDown
            className={cn(
              "size-3 opacity-60 transition-transform duration-200 shrink-0",
              isOpen && "rotate-180",
            )}
          />
        )}
      </button>

      <AnimatePresence>
        {isOpen && coords && (
          <Portal>
            <motion.div
              ref={dropdownRef}
              initial={{ opacity: 0, scale: 0.95, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -4 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              style={{
                position: "absolute",
                top: coords.top,
                left: coords.left,
                minWidth: coords.width,
              }}
              className="z-[99999] rounded-xl border border-content/[0.08] bg-surface/95 backdrop-blur-xl p-1.5 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] flex flex-col gap-1"
            >
              {STATUS_VALUES.map((optionValue) => {
                const isSelected = optionValue === status;
                const isAllowed = isStatusTransitionAllowed(
                  status,
                  optionValue,
                );

                return (
                  <button
                    key={optionValue}
                    type="button"
                    disabled={!isAllowed}
                    onClick={() => {
                      if (!isAllowed) return;
                      onStatusUpdate(orderId, optionValue);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "w-full text-left flex items-center justify-between gap-3 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all duration-150",
                      !isAllowed
                        ? "text-content/30 cursor-not-allowed opacity-50 bg-transparent"
                        : isSelected
                          ? "text-primary bg-primary/[0.05]"
                          : "text-content/75 hover:text-content hover:bg-content/[0.04]",
                    )}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className={cn(
                          "size-1.5 shrink-0 rounded-full",
                          isSelected ? "bg-primary" : "bg-content/30",
                        )}
                      />
                      <span className="truncate">
                        {getStatusLabel(optionValue)}
                      </span>
                    </div>
                    {isSelected && (
                      <span className="size-1 bg-primary rounded-full shrink-0" />
                    )}
                  </button>
                );
              })}
            </motion.div>
          </Portal>
        )}
      </AnimatePresence>
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
  const t = useTranslations("AdminOrdersPage.results");
  return (
    <nav
      aria-label="Orders Pagination"
      className="flex flex-col gap-3 border-t border-content/10 pt-5 sm:flex-row sm:items-center sm:justify-between"
    >
      <p className="text-sm text-content/55">
        {t("showingPageOf", {
          page: String(page),
          totalPages: String(totalPages),
        })}
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
