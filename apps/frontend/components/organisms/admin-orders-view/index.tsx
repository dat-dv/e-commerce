"use client";

import AppContainer from "@/components/atoms/app-container";
import Loading from "@/components/atoms/loading";
import { Pagination } from "@/components/molecules/pagination";
import { toast } from "@/components/ui/toast";
import { UI_RADIUS } from "@/constants/ui-radius";
import { useAdminOrders } from "@/hooks/orders/use-admin-orders";
import { cn } from "@/utils/cn";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import type { Key } from "react-aria-components";
import { AdminOrdersFilters } from "./admin-orders-filters";
import { AdminOrdersHeader } from "./admin-orders-header";
import { OrderResults } from "./admin-orders-results";
import { EmptyOrders } from "./empty-orders";

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
    <main className="bg-surface text-content relative min-h-screen overflow-x-hidden py-8">
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
            <p className="text-content text-sm font-semibold">{totalLabel}</p>
            {meta && (
              <p className="text-content/55 text-sm">
                {t("results.pageInfo", {
                  page: String(page),
                  totalPages: String(meta.totalPages || 1),
                })}
              </p>
            )}
          </div>

          {loading && orders.length === 0 ? (
            <div
              className={cn(
                UI_RADIUS.panel,
                "border-content/10 flex min-h-60 flex-col items-center justify-center border",
              )}
            >
              <Loading />
              <span className="text-content/55 mt-3 text-sm">
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
          <Pagination
            currentPage={page}
            totalPages={meta.totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </AppContainer>
    </main>
  );
}
