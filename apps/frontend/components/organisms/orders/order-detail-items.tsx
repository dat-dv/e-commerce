"use client";

import { TOrder } from "@/domain/orders/types/order.model";
import { formatCurrency } from "@/utils/format-currency";
import { motion } from "framer-motion";
import { Package } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";

export function OrderDetailItems({ order }: { order: TOrder }) {
  const t = useTranslations("OrdersPage");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-surface/40 backdrop-blur-md rounded-2xl border border-content/[0.05] overflow-hidden shadow-sm"
    >
      <div className="px-6 py-4 border-b border-content/[0.05] bg-content/[0.02] flex items-center gap-3">
        <Package className="w-4 h-4 text-content/40" />
        <h2 className="text-sm font-bold text-content">
          {t("detail.orderItemsTitle", {
            count: String(order.items.length),
          })}
        </h2>
      </div>
      <div className="divide-y divide-content/[0.05]">
        {order.items.map((item) => (
          <div
            key={item.id}
            className="p-6 flex gap-6 hover:bg-content/[0.02] transition-colors"
          >
            <div className="relative w-24 h-24 rounded-2xl border border-content/[0.05] bg-content/[0.02] overflow-hidden shrink-0 shadow-sm">
              {item.sku?.imageUrl && (
                <Image
                  src={item.sku.imageUrl}
                  alt={item.sku.product?.name || t("detail.productFallback")}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              )}
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <div className="flex justify-between items-start gap-4">
                <h3 className="text-base font-bold text-content leading-tight">
                  {item.sku?.product?.name || t("detail.unknownProduct")}
                </h3>
                <div className="text-lg font-black text-content tracking-tight shrink-0">
                  {formatCurrency(item.price)}
                </div>
              </div>
              <p className="mt-2 text-xs font-medium text-content/40">
                {item.snapshot?.sku.attributes || `SKU: ${item.skuId}`}
              </p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs font-semibold px-3 py-1 bg-content/[0.05] rounded-full text-content/60">
                  {t("card.units", { count: item.quantity })}
                </span>
                <span className="text-sm font-bold text-content/60">
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
