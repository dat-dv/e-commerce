"use client";

import ImagePreview from "@/components/molecules/image-preview";
import { TOrder } from "@/domain/orders/types/order.model";
import { formatCurrency } from "@/utils/format-currency";
import { motion } from "framer-motion";
import { Package } from "lucide-react";
import { useTranslations } from "next-intl";

export function OrderDetailItems({ order }: { order: TOrder }) {
  const t = useTranslations("OrdersPage");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="overflow-hidden rounded-2xl border border-content/[0.05] bg-surface/40 shadow-sm backdrop-blur-md"
    >
      <div className="flex items-center gap-3 border-b border-content/[0.05] bg-content/[0.02] px-4 py-4 sm:px-6">
        <Package className="h-4 w-4 text-content/40" />
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
            className="flex gap-4 p-4 transition-colors hover:bg-content/[0.02] sm:gap-6 sm:p-6"
          >
            <div className="relative size-20 shrink-0 overflow-hidden rounded-xl border border-content/[0.05] bg-content/[0.02] shadow-sm sm:size-24 sm:rounded-2xl">
              {item.sku?.imageUrl && (
                <ImagePreview
                  src={item.sku.imageUrl}
                  alt={item.sku.product?.name || t("detail.productFallback")}
                  fill
                  sizes="96px"
                  triggerClassName="absolute inset-0 rounded-xl sm:rounded-2xl"
                  imageClassName="object-cover"
                />
              )}
            </div>
            <div className="flex min-w-0 flex-1 flex-col justify-center">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                <h3 className="line-clamp-2 text-sm font-bold leading-tight text-content sm:text-base">
                  {item.sku?.product?.name || t("detail.unknownProduct")}
                </h3>
                <div className="shrink-0 text-base font-black tracking-tight text-content sm:text-lg">
                  {formatCurrency(item.price)}
                </div>
              </div>
              <p className="mt-2 line-clamp-1 text-xs font-medium text-content/40">
                {item.snapshot?.sku.attributes || `SKU: ${item.skuId}`}
              </p>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 sm:mt-4">
                <span className="rounded-full bg-content/[0.05] px-3 py-1 text-xs font-semibold text-content/60">
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
