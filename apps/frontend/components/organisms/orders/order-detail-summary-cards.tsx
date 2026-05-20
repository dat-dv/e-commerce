"use client";

import { TOrder } from "@/domain/orders/types/order.model";
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
      className="grid grid-cols-1 md:grid-cols-2 gap-8"
    >
      <div className="bg-surface/40 backdrop-blur-md rounded-2xl border border-content/[0.05] p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Truck className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-bold text-content">
            {t("detail.deliveryDetails")}
          </h2>
        </div>
        <div className="space-y-4 text-sm font-medium text-content/60">
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

      <div className="bg-surface/40 backdrop-blur-md rounded-2xl border border-content/[0.05] p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <CreditCard className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-bold text-content">
            {t("detail.paymentSummary")}
          </h2>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-content/60 font-medium">
              {t("detail.subtotal")}
            </span>
            <span className="font-bold text-content">
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
          <div className="pt-4 border-t border-content/[0.05] flex justify-between items-center">
            <span className="text-sm font-bold text-content">
              {t("detail.total")}
            </span>
            <span className="text-3xl font-black text-content tracking-tight">
              {formatCurrency(order.totalAmount)}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
