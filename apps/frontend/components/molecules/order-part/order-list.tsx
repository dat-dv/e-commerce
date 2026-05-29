"use client";

import { UI_RADIUS } from "@/constants/ui-radius";
import { useOrders } from "@/hooks/orders/use-orders";
import { cn } from "@/utils/cn";
import { AnimatePresence, motion } from "framer-motion";
import { PackageOpen } from "lucide-react";
import { useTranslations } from "next-intl";
import { OrderCard } from "./order-card";
import { OrderTabs } from "./order-tabs";

export const OrderList = () => {
  const t = useTranslations("OrdersPage");
  const { orders, loading, activeTab, setActiveTab } = useOrders();

  if (loading) {
    return (
      <div className="flex flex-col gap-4 p-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={cn(
              UI_RADIUS.card,
              "h-48 w-full animate-pulse bg-gray-100",
            )}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50/50">
      <OrderTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="mx-auto w-full p-4">
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
              <PackageOpen className="mb-4 h-16 w-16 stroke-[1.5]" />
              <p className="text-lg font-medium">{t("card.noOrders")}</p>
              <p className="text-sm">{t("card.emptyListDesc")}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
