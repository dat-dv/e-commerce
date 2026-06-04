"use client";

import { BasicLoading, Button } from "@ecommerce/ui";
import { RefreshCw } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

import { PageHeader } from "@/components/molecules/page-header";
import { APP_ROUTES } from "@/constants/routes";
import { useOrderDetail } from "@/hooks/order/use-order-detail";

import { ItemsSection } from "./items-section";
import { OverviewSection } from "./overview-section";
import { StatusFlowSection } from "./status-flow-section";
import { StatusSection } from "./status-section";

export const OrderDetailView = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");
  const {
    order,
    loading,
    isUpdating,
    canUpdateStatus,
    selectedStatus,
    setSelectedStatus,
    availableStatuses,
    updateStatus,
    reload,
  } = useOrderDetail(orderId);

  const subtotal = useMemo(
    () =>
      order?.items?.reduce(
        (sum, item) => sum + Number(item.price) * item.quantity,
        0,
      ) ?? 0,
    [order],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title={
          order
            ? `Order #${order.id.slice(0, 8).toUpperCase()}`
            : "Order Detail"
        }
        description="Review fulfillment data and update the order status."
        backAction={() => router.push(APP_ROUTES.ORDERS)}
      >
        <Button
          variant="outline"
          onClick={reload}
          disabled={loading}
          className="rounded-lg border-[var(--border-color)]"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </PageHeader>

      {loading && <BasicLoading isBlur={false} />}

      {!loading && !order && (
        <section className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-6 text-sm text-[var(--muted)]">
          Order not found or you do not have permission to view it.
        </section>
      )}

      {!loading && order && (
        <section className="overflow-hidden rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] shadow-sm">
          <StatusSection
            order={order}
            canUpdateStatus={canUpdateStatus}
            isUpdating={isUpdating}
            selectedStatus={selectedStatus}
            availableStatuses={availableStatuses}
            setSelectedStatus={setSelectedStatus}
            updateStatus={updateStatus}
          />
          <OverviewSection order={order} subtotal={subtotal} />
          <StatusFlowSection order={order} />
          <ItemsSection items={order.items} />
        </section>
      )}
    </div>
  );
};

OrderDetailView.displayName = "OrderDetailView";
