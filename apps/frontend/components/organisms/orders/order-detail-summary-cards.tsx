"use client";

import { UI_RADIUS } from "@/constants/ui-radius";
import { TOrder } from "@/domain/orders/types/order.model";
import { cn } from "@/utils/cn";
import { formatCurrency } from "@/utils/format-currency";
import { motion } from "framer-motion";
import { CreditCard, Truck } from "lucide-react";
import { useTranslations } from "next-intl";

export function OrderDetailSummaryCards({ order }: { order: TOrder }) {
  const t = useTranslations("OrdersPage");
  const subtotal = order.items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8"
    >
      <div
        className={cn(
          UI_RADIUS.card,
          "border-content/[0.05] bg-surface/40 border p-5 shadow-sm backdrop-blur-md sm:p-6",
        )}
      >
        <div className="mb-5 flex items-center gap-3 sm:mb-6">
          <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-full">
            <Truck className="h-4 w-4" />
          </div>
          <h2 className="text-content text-sm font-bold">
            {t("detail.deliveryDetails")}
          </h2>
        </div>
        <div className="text-content/60 space-y-4 text-sm font-medium">
          <p className="text-content font-bold">
            {order.shippingAddress?.receiverName || t("detail.notAvailable")}
          </p>
          <p>
            {order.shippingAddress?.receiverPhone || t("detail.notAvailable")}
          </p>
          <p className="leading-relaxed">
            {order.shippingAddress?.street}
            <br />
            {order.shippingAddress?.city}, {order.shippingAddress?.state}
            <br />
            {order.shippingAddress?.country}
          </p>
        </div>
      </div>

      <div
        className={cn(
          UI_RADIUS.card,
          "border-content/[0.05] bg-surface/40 border p-5 shadow-sm backdrop-blur-md sm:p-6",
        )}
      >
        <div className="mb-5 flex items-center gap-3 sm:mb-6">
          <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-full">
            <CreditCard className="h-4 w-4" />
          </div>
          <h2 className="text-content text-sm font-bold">
            {t("detail.paymentSummary")}
          </h2>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-content/60 font-medium">
              {t("detail.subtotal")}
            </span>
            <span className="text-content font-bold">
              {formatCurrency(subtotal)}
            </span>
          </div>
          {order.discountAmount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-content/60 font-medium">
                {t("detail.discount")}
              </span>
              <span className="font-bold text-red-500">
                -{formatCurrency(order.discountAmount)}
              </span>
            </div>
          )}
          <div className="border-content/[0.05] flex items-center justify-between gap-4 border-t pt-4">
            <span className="text-content text-sm font-bold">
              {t("detail.total")}
            </span>
            <span className="text-content text-2xl font-black tracking-tight sm:text-3xl">
              {formatCurrency(order.totalAmount)}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
