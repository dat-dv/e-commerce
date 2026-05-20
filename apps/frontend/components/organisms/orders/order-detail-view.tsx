"use client";

import { RequestReturnModal } from "@/components/molecules/order-part/request-return-modal";
import { ORDER_STATUS_CONFIG } from "@/constants/order-status.constant";
import { APP_ROUTES } from "@/constants/routes";
import { useOrderReturnRequest } from "@/hooks/order-returns/use-order-return-request";
import { useOrderDetail } from "@/hooks/orders/use-order-detail";
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
        return status;
    }
  };

  const closeReturnModal = () => {
    if (returnRequest.isSubmitting) return;
    setIsReturnModalOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent flex flex-col items-center justify-center">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-4 border-primary/5 rounded-full" />
          <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
        <div className="mt-6 text-xs font-semibold text-content/30 animate-pulse">
          {t("detail.loading")}
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-transparent flex flex-col items-center justify-center">
        <AlertCircle className="w-16 h-16 text-red-500/50 mb-6" />
        <h1 className="text-2xl font-bold text-content tracking-tight mb-4">
          {t("detail.notFoundTitle")}
        </h1>
        <p className="text-content/40 text-sm font-medium mb-8 max-w-sm text-center">
          {t("detail.notFoundDesc")}
        </p>
        <Link
          href={APP_ROUTES.ORDERS}
          className="px-8 py-3 bg-content text-surface text-sm font-semibold rounded-xl hover:-translate-y-1 transition-all shadow-lg shadow-black/10"
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

      <div className="container mx-auto px-4 py-8 max-w-4xl space-y-8">
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
