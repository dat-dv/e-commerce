"use client";

import { useOrders } from "@/hooks/orders/use-orders";
import { OrderCard } from "./order-card";
import { OrderTabs } from "./order-tabs";
import { motion, AnimatePresence } from "framer-motion";
import { PackageOpen } from "lucide-react";

export const OrderList = () => {
  const { orders, loading, activeTab, setActiveTab } = useOrders();

  if (loading) {
    return (
      <div className="flex flex-col gap-4 p-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="w-full h-48 bg-gray-100 rounded-xl animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/50">
      <OrderTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="p-4 mx-auto w-full">
        <AnimatePresence mode="popLayout">
          {orders.length > 0 ? (
            orders.map((order) => <OrderCard key={order.id} order={order} />)
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-center py-20 text-gray-400"
            >
              <PackageOpen className="w-16 h-16 mb-4 stroke-[1.5]" />
              <p className="text-lg font-medium">Chưa có đơn hàng nào</p>
              <p className="text-sm">
                Hãy tiếp tục mua sắm để lấp đầy lịch sử nhé!
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
