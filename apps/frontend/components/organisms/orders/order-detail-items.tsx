"use client";

import { ImagePreview } from "@ecommerce/ui";
import { UI_RADIUS } from "@/constants/ui-radius";
import { TOrder } from "@/domain/orders/types/order.model";
import { cn } from "@/utils/cn";
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
      className={cn(
        UI_RADIUS.panel,
        "border-content/[0.05] bg-surface/40 overflow-hidden border shadow-sm backdrop-blur-md",
      )}
    >
      <div className="border-content/[0.05] bg-content/[0.02] flex items-center gap-3 border-b px-4 py-4 sm:px-6">
        <Package className="text-content/40 h-4 w-4" />
        <h2 className="text-content text-sm font-bold">
          {t("detail.orderItemsTitle", {
            count: String(order.items.length),
          })}
        </h2>
      </div>
      <div className="divide-content/[0.05] divide-y">
        {order.items.map((item) => (
          <div
            key={item.id}
            className="hover:bg-content/[0.02] flex gap-4 p-4 transition-colors sm:gap-6 sm:p-6"
          >
            <div
              className={cn(
                UI_RADIUS.media,
                "border-content/[0.05] bg-content/[0.02] relative size-20 shrink-0 overflow-hidden border shadow-sm sm:size-24",
              )}
            >
              {item.sku?.imageUrl && (
                <ImagePreview
                  src={item.sku.imageUrl}
                  alt={item.sku.product?.name || t("detail.productFallback")}
                  imageComponent={Image}
                  triggerClassName={cn("absolute inset-0", UI_RADIUS.media)}
                  imageProps={{
                    fill: true,
                    sizes: "96px",
                    className: "object-cover",
                  }}
                />
              )}
            </div>
            <div className="flex min-w-0 flex-1 flex-col justify-center">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                <h3 className="text-content line-clamp-2 text-sm leading-tight font-bold sm:text-base">
                  {item.sku?.product?.name || t("detail.unknownProduct")}
                </h3>
                <div className="text-content shrink-0 text-base font-black tracking-tight sm:text-lg">
                  {formatCurrency(item.price)}
                </div>
              </div>
              <p className="text-content/40 mt-2 line-clamp-1 text-xs font-medium">
                {item.snapshot?.sku.attributes || `SKU: ${item.skuId}`}
              </p>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 sm:mt-4">
                <span
                  className={cn(
                    UI_RADIUS.badge,
                    "bg-content/[0.05] text-content/60 px-3 py-1 text-xs font-semibold",
                  )}
                >
                  {t("card.units", { count: item.quantity })}
                </span>
                <span className="text-content/60 text-sm font-bold">
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
