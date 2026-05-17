"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ORDER_TABS } from "@/constants/order-status.constant";
import { useOrders } from "@/hooks/orders/use-orders";
import { OrderHeader } from "@/components/molecules/order-part/order-header";
import { OrderCard } from "@/components/molecules/order-part/order-card";
import { OrderEmptyState } from "@/components/molecules/order-part/order-empty-state";
import { ConfirmCancelModal } from "@/components/molecules/order-part/confirm-cancel-modal";
import { VirtualList } from "@/components/molecules/virtual-list";
import AppContainer from "@/components/atoms/app-container";

export const OrdersView = () => {
  const [confirmCancelId, setConfirmCancelId] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  const {
    orders,
    loadingMore,
    activeTab,
    setActiveTab,
    loadMore,
    hasMore,
    cancelOrder,
  } = useOrders();

  const activeTabLabel =
    ORDER_TABS.find((tab) => tab.value === activeTab)?.label || "All";

  const emptyStateMessage =
    activeTabLabel === "Overview"
      ? "Your order history is empty. Start exploring our collection."
      : `You have no ${activeTabLabel.toLowerCase()} orders at the moment.`;

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
    <div className="min-h-screen bg-transparent">
      <OrderHeader activeTab={activeTab} onTabChange={setActiveTab} />

      <AppContainer>
        <AnimatePresence mode="wait">
          {orders.length === 0 ? (
            <OrderEmptyState message={emptyStateMessage} />
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
    </div>
  );
};
