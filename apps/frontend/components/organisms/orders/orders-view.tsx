"use client";

import AppContainer from "@/components/atoms/app-container";
import { ConfirmCancelModal } from "@/components/molecules/order-part/confirm-cancel-modal";
import { OrderCard } from "@/components/molecules/order-part/order-card";
import { OrderEmptyState } from "@/components/molecules/order-part/order-empty-state";
import { OrderHeader } from "@/components/molecules/order-part/order-header";
import { OrderTabs } from "@/components/molecules/order-part/order-tabs";
import { RequestReturnModal } from "@/components/molecules/order-part/request-return-modal";
import { VirtualList } from "@/components/molecules/virtual-list";
import { useOrderReturnRequest } from "@/hooks/order-returns/use-order-return-request";
import { useOrders } from "@/hooks/orders/use-orders";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

export const OrdersView = () => {
  const [confirmCancelId, setConfirmCancelId] = useState<string | null>(null);
  const [returnOrderId, setReturnOrderId] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  const {
    orders,
    loadingMore,
    activeTab,
    setActiveTab,
    loadMore,
    hasMore,
    cancelOrder,
    refresh,
  } = useOrders();

  const returnRequest = useOrderReturnRequest({
    orderId: returnOrderId ?? "",
    onSuccess: () => {
      setReturnOrderId(null);
      refresh();
    },
  });

  const handleConfirmCancel = async () => {
    if (!confirmCancelId) return;
    setIsCancelling(true);
    try {
      await cancelOrder(confirmCancelId);
      setConfirmCancelId(null);
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <>
      <AppContainer>
        <OrderHeader />
        <div className="-mx-4 -mt-6 pb-6 sm:mx-0">
          <OrderTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            listClassName="mx-0"
            tabClassName="px-4 py-4 text-xs sm:px-6 sm:py-5 sm:text-sm"
          />
        </div>
        <AnimatePresence mode="wait">
          {orders.length === 0 ? (
            <OrderEmptyState type={activeTab} />
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <VirtualList
                data={orders}
                loadingMore={loadingMore}
                hasMore={hasMore}
                onLoadMore={loadMore}
                renderItem={(order) => (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <OrderCard
                      order={order}
                      onCancelOrder={(id) => setConfirmCancelId(id)}
                      onRequestReturn={(id) => setReturnOrderId(id)}
                      headerClassName="flex-col items-stretch gap-3 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-5"
                      headerStatusClassName="justify-between gap-3 sm:justify-end sm:gap-4"
                      itemClassName="gap-3 p-4 sm:gap-5 sm:p-5"
                      itemImageClassName="size-18 sm:size-20"
                      itemTitleClassName="line-clamp-2 sm:line-clamp-1"
                      footerClassName="px-4 py-4 sm:px-5 sm:py-5"
                      totalClassName="text-2xl sm:text-3xl"
                      footerActionsClassName="gap-2 sm:gap-3"
                      actionButtonClassName="px-4 sm:px-6"
                    />
                  </motion.div>
                )}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </AppContainer>

      <ConfirmCancelModal
        isOpen={!!confirmCancelId}
        isCancelling={isCancelling}
        onClose={() => setConfirmCancelId(null)}
        onConfirm={handleConfirmCancel}
      />

      <RequestReturnModal
        isOpen={!!returnOrderId}
        isSubmitting={returnRequest.isSubmitting}
        onClose={() => setReturnOrderId(null)}
        onSubmit={returnRequest.submitReturnRequest}
      />
    </>
  );
};
