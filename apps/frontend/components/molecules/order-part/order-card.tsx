"use client";

import { EOrderStatus } from "@ecommerce/shared";
import { TOrder } from "@/domain/orders/types/order.model";
import Image from "next/image";
import { formatCurrency } from "@/utils/format-currency";
import { motion } from "framer-motion";
import { MessageSquare, RotateCcw, Store, Truck } from "lucide-react";
import { cn } from "@/utils/cn";
import { ORDER_STATUS_CONFIG } from "@/constants/order-status.constant";

import { APP_ROUTES } from "@/constants/routes";
import Link from "next/link";

interface OrderCardProps {
  order: TOrder;
  onCancelOrder?: (id: string) => void;
  onRequestReturn?: (id: string) => void;
}

export const OrderCard = ({
  order,
  onCancelOrder,
  onRequestReturn,
}: OrderCardProps) => {
  const status = ORDER_STATUS_CONFIG[order.status] || {
    label: "Unknown",
    color: "text-content/40 bg-content/5",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface/40 backdrop-blur-md rounded-xl border border-content/[0.05] overflow-hidden transition-all duration-300 hover:border-primary/20 shadow-sm"
    >
      {/* Header */}
      <div className="px-5 py-4 flex items-center justify-between border-b border-content/[0.05] bg-content/[0.02]">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <Link
              href={APP_ROUTES.ORDER_DETAIL(order.id)}
              className="font-bold text-content text-sm hover:text-primary transition-all"
            >
              Order #{order.id.slice(-8).toUpperCase()}
            </Link>
            <span className="text-xs font-medium text-content/40">
              {new Date(order.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
          <button
            disabled
            className="hidden sm:flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-content/40 bg-content/[0.03] rounded-full border border-content/[0.05]"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Need help?
          </button>
        </div>
        <div className="flex items-center gap-4">
          {order.status === EOrderStatus.SHIPPING && (
            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-primary border-r border-content/[0.05] pr-4">
              <Truck className="w-4 h-4" />
              <span>Shipping</span>
            </div>
          )}
          <span
            className={cn(
              "px-3 py-1 text-[11px] font-bold rounded-full",
              status.color,
            )}
          >
            {status.label}
          </span>
        </div>
      </div>

      {/* Items */}
      <div className="divide-y divide-content/[0.05]">
        {order.items.map((item) => {
          const productSlug = item.sku?.product?.slug;
          const itemContent = (
            <div className="p-5 flex gap-5 transition-colors hover:bg-content/[0.02]">
              <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border border-content/[0.05] bg-content/[0.02]">
                {item.sku?.imageUrl ? (
                  <Image
                    src={item.sku.imageUrl}
                    alt={item.sku.product?.name || "Product"}
                    fill
                    sizes="80px"
                    className="object-cover transition-transform group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-content/10">
                    <Store className="w-6 h-6" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-4">
                  <h3 className="text-sm font-bold text-content line-clamp-1 leading-tight group-hover:text-primary transition-colors">
                    {item.sku?.product?.name || "Product Name"}
                  </h3>
                  <div className="text-base font-bold text-content tracking-tight shrink-0">
                    {formatCurrency(item.price)}
                  </div>
                </div>
                <p className="mt-1 text-xs font-medium text-content/40">
                  {item.attributes || `Code: ${item.sku?.skuCode || "Default"}`}
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <div className="text-[11px] font-semibold text-content/50 bg-content/[0.05] px-2 py-0.5 rounded-full">
                    {item.quantity} unit{item.quantity > 1 ? "s" : ""}
                  </div>
                  {item.originalPrice && item.originalPrice > item.price && (
                    <span className="text-xs text-content/30 line-through">
                      {formatCurrency(item.originalPrice)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );

          return productSlug ? (
            <Link
              key={item.id}
              href={APP_ROUTES.PRODUCT_DETAIL(productSlug)}
              className="block group"
            >
              {itemContent}
            </Link>
          ) : (
            <div key={item.id}>{itemContent}</div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-5 py-5 bg-content/[0.01] border-t border-content/[0.05]">
        <div className="flex flex-col items-end gap-4">
          <div className="flex flex-col items-end gap-1">
            {order.discountAmount > 0 && (
              <div className="flex items-center gap-2 text-xs font-medium">
                <span className="text-content/30">Discount:</span>
                <span className="text-red-500">
                  -{formatCurrency(order.discountAmount)}
                </span>
              </div>
            )}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-content/40">Total</span>
              <span className="text-3xl font-black text-content tracking-tight">
                {formatCurrency(order.totalAmount)}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap justify-end gap-3">
            {order.status === EOrderStatus.PENDING && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onCancelOrder?.(order.id);
                }}
                className="px-6 py-2.5 text-sm font-semibold text-red-500 border border-red-500/20 rounded-xl hover:bg-red-500/10 transition-all active:scale-95"
              >
                Cancel
              </button>
            )}
            {order.status === EOrderStatus.DELIVERED && (
              <>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    onRequestReturn?.(order.id);
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-content border border-content/[0.1] rounded-xl hover:bg-content/[0.05] transition-all active:scale-95"
                >
                  <RotateCcw className="h-4 w-4" />
                  Request Return
                </button>
                <button className="px-6 py-2.5 text-sm font-semibold text-surface bg-content rounded-xl hover:bg-primary transition-all active:scale-95">
                  Review
                </button>
                <button className="px-6 py-2.5 text-sm font-semibold text-content/60 border border-content/[0.1] rounded-xl hover:bg-content/[0.05] transition-all active:scale-95">
                  Reorder
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
