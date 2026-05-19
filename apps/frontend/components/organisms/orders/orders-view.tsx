"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useOrders } from "@/hooks/orders/use-orders";
import { OrderHeader } from "@/components/molecules/order-part/order-header";
import { OrderCard } from "@/components/molecules/order-part/order-card";
import { OrderEmptyState } from "@/components/molecules/order-part/order-empty-state";
import { ConfirmCancelModal } from "@/components/molecules/order-part/confirm-cancel-modal";
import { VirtualList } from "@/components/molecules/virtual-list";
import AppContainer from "@/components/atoms/app-container";
import { OrderTabs } from "@/components/molecules/order-part/order-tabs";
import { RequestReturnModal } from "@/components/molecules/order-part/request-return-modal";
import { useOrderReturnRequest } from "@/hooks/order-returns/use-order-return-request";

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
        <div className="-mt-6 pb-6">
          <OrderTabs activeTab={activeTab} onTabChange={setActiveTab} />
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
