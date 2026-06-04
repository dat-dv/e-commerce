"use client";

import { RequestReturnModal } from "@/components/molecules/order-part/request-return-modal";
import { ORDER_STATUS_CONFIG } from "@/constants/order-status.constant";
import { APP_ROUTES } from "@/constants/routes";
import { useOrderReturnRequest } from "@/hooks/order-returns/use-order-return-request";
import { useOrderDetail } from "@/hooks/orders/use-order-detail";
import { getOrderStatusLabel } from "@/utils/order";
import { EOrderStatus } from "@ecommerce/shared";
import { EmptyState, Loading } from "@ecommerce/ui";
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
  const { order, loading, refresh } = useOrderDetail(orderId);
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
    return <Loading />;
  }

  if (!order) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <EmptyState
          title={t("detail.notFoundTitle")}
          description={t("detail.notFoundDesc")}
          icon={AlertCircle}
          actionLabel={t("detail.backToOrders")}
          actionHref={APP_ROUTES.ORDERS}
          linkComponent={Link}
        />
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
