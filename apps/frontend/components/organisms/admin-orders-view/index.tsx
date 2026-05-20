"use client";

import AppContainer from "@/components/atoms/app-container";
import Loading from "@/components/atoms/loading";
import { toast } from "@/components/ui/toast";
import { useAdminOrders } from "@/hooks/orders/use-admin-orders";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import type { Key } from "react-aria-components";
import { AdminOrdersFilters } from "./admin-orders-filters";
import { AdminOrdersHeader } from "./admin-orders-header";
import { OrderResults } from "./admin-orders-results";
import { EmptyOrders } from "./empty-orders";
import { OrdersPagination } from "./orders-pagination";

export function AdminOrdersView() {
  const t = useTranslations("AdminOrdersPage");

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
      <div className="pointer-events-none absolute -top-40 -right-40 -z-10 size-96 rounded-full bg-primary/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 -z-10 size-96 rounded-full bg-primary/5 blur-3xl" />

      <AppContainer size="2xl" className="flex flex-col gap-8">
        <AdminOrdersHeader loading={loading} onRefresh={refresh} />

        <AdminOrdersFilters
          search={search}
          selectedStatuses={selectedStatuses}
          loading={loading}
          hasFilters={hasFilters}
          onSearch={handleSearchChange}
          onStatusFilterToggle={handleStatusFilterToggle}
          onClearFilters={clearFilters}
        />

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
