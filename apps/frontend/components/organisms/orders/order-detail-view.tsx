"use client";

import { RequestReturnModal } from "@/components/molecules/order-part/request-return-modal";
import { ORDER_STATUS_CONFIG } from "@/constants/order-status.constant";
import { APP_ROUTES } from "@/constants/routes";
import { UI_RADIUS } from "@/constants/ui-radius";
import { useOrderReturnRequest } from "@/hooks/order-returns/use-order-return-request";
import { useOrderDetail } from "@/hooks/orders/use-order-detail";
import { cn } from "@/utils/cn";
import { getOrderStatusLabel } from "@/utils/order";
import { EOrderStatus } from "@ecommerce/shared";
import { AlertCircle } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useState } from "react";
import { OrderDetailHeader } from "./order-detail-header";
import { OrderDetailItems } from "./order-detail-items";
import { OrderDetailSummaryCards } from "./order-detail-summary-cards";
import { OrderReturnPanel } from "./order-return-panel";

export const OrderDetailView = ({ orderId }: { orderId: string }) => {
  const t = useTranslations("OrdersPage");
  const tStatus = useTranslations("OrderStatus");
  const locale = useLocale();

  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const { order, loading, error, refresh } = useOrderDetail(orderId);
  const returnRequest = useOrderReturnRequest({
    orderId,
    onSuccess: async () => {
      setIsReturnModalOpen(false);
      await refresh();
    },
  });

  const getStatusLabel = (status: EOrderStatus) => {
    const key = getOrderStatusLabel(status);
    return tStatus(key);
  };

  const closeReturnModal = () => {
    if (returnRequest.isSubmitting) return;
    setIsReturnModalOpen(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-transparent">
        <div className="relative h-12 w-12">
          <div className="border-primary/5 absolute inset-0 rounded-full border-4" />
          <div className="border-primary absolute inset-0 animate-spin rounded-full border-4 border-t-transparent" />
        </div>
        <div className="text-content/30 mt-6 animate-pulse text-xs font-semibold">
          {t("detail.loading")}
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-transparent">
        <AlertCircle className="mb-6 h-16 w-16 text-red-500/50" />
        <h1 className="text-content mb-4 text-2xl font-bold tracking-tight">
          {t("detail.notFoundTitle")}
        </h1>
        <p className="text-content/40 mb-8 max-w-sm text-center text-sm font-medium">
          {t("detail.notFoundDesc")}
        </p>
        <Link
          href={APP_ROUTES.ORDERS}
          className={cn(
            UI_RADIUS.control,
            "bg-content text-surface px-8 py-3 text-sm font-semibold shadow-lg shadow-black/10 transition-all hover:-translate-y-1",
          )}
        >
          {t("detail.backToOrders")}
        </Link>
      </div>
    );
  }

  const statusColor =
    ORDER_STATUS_CONFIG[order.status]?.color || "text-content/40 bg-content/5";
  const statusLabel = getStatusLabel(order.status);

  return (
    <div className="min-h-screen bg-transparent">
      <OrderDetailHeader
        orderId={order.id}
        createdAt={order.createdAt}
        locale={locale}
        statusLabel={statusLabel}
        statusColor={statusColor}
      />

      <div className="container mx-auto max-w-4xl space-y-8 px-4 py-8">
        <OrderDetailSummaryCards order={order} />

        {order.status === EOrderStatus.DELIVERED && (
          <OrderReturnPanel
            onRequestReturn={() => setIsReturnModalOpen(true)}
          />
        )}

        <OrderDetailItems order={order} />
      </div>
      <RequestReturnModal
        isOpen={isReturnModalOpen}
        isSubmitting={returnRequest.isSubmitting}
        onClose={closeReturnModal}
        onSubmit={returnRequest.submitReturnRequest}
      />
    </div>
  );
};
