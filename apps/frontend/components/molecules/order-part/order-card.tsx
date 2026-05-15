"use client";

import { EOrderStatus } from "@ecommerce/shared";
import { IOrder } from "@/domain/orders/types/order.model";
import Image from "next/image";
import { formatCurrency } from "@/utils/format-currency";
import { motion } from "framer-motion";
import { MessageSquare, Store, Truck } from "lucide-react";
import { cn } from "@/utils/cn";
import { ORDER_STATUS_CONFIG } from "@/constants/order-status.constant";

import { APP_ROUTES } from "@/constants/routes";
import Link from "next/link";

interface OrderCardProps {
  order: IOrder;
}

export const OrderCard = ({ order }: OrderCardProps) => {
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
      <div className="px-5 py-3 flex items-center justify-between border-b border-content/[0.05] bg-content/[0.02]">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="font-bold text-content text-xs uppercase tracking-wider">
              Order #{order.id.slice(-8).toUpperCase()}
            </span>
            <span className="text-[10px] font-medium text-content/30 uppercase tracking-tight">
              {new Date(order.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
          <button
            disabled
            className="hidden sm:flex items-center gap-1.5 px-2 py-1 text-[10px] font-bold uppercase tracking-tighter text-content/20 bg-content/[0.02] rounded-md border border-content/[0.05]"
          >
            <MessageSquare className="w-3 h-3" />
            Support
          </button>
        </div>
        <div className="flex items-center gap-4">
          {order.status === EOrderStatus.SHIPPING && (
            <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-bold text-primary uppercase tracking-wider border-r border-content/[0.05] pr-4">
              <Truck className="w-3.5 h-3.5" />
              <span>In Transit</span>
            </div>
          )}
          <span
            className={cn(
              "px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full",
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
              <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-content/[0.05] bg-content/[0.02]">
                {item.sku?.imageUrl ? (
                  <Image
                    src={item.sku.imageUrl}
                    alt={item.sku.product?.name || "Product"}
                    fill
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
                  <h3 className="text-xs font-bold text-content line-clamp-1 leading-tight group-hover:text-primary transition-colors">
                    {item.sku?.product?.name || "Product Name"}
                  </h3>
                  <div className="text-sm font-black text-content tracking-tighter shrink-0">
                    {formatCurrency(item.price)}
                  </div>
                </div>
                <p className="mt-1 text-[10px] font-medium text-content/30 uppercase tracking-tight">
                  {item.attributes || `Code: ${item.sku?.skuCode || "Default"}`}
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <div className="text-[10px] font-bold text-content/40 bg-content/[0.05] px-1.5 py-0.5 rounded">
                    Quantity: {item.quantity}
                  </div>
                  {item.originalPrice && item.originalPrice > item.price && (
                    <span className="text-[10px] text-content/20 line-through">
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
      <div className="px-5 py-4 bg-content/[0.01] border-t border-content/[0.05]">
        <div className="flex flex-col items-end gap-3">
          <div className="flex flex-col items-end gap-1">
            {order.discountAmount > 0 && (
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-tight">
                <span className="text-content/30">Savings:</span>
                <span className="text-red-500">
                  -{formatCurrency(order.discountAmount)}
                </span>
              </div>
            )}
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-content/40 uppercase tracking-widest">
                Total Amount
              </span>
              <span className="text-2xl font-black text-content tracking-tighter">
                {formatCurrency(order.totalAmount)}
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            {order.status === EOrderStatus.DELIVERED && (
              <>
                <button className="px-6 py-2 text-[10px] font-bold uppercase tracking-widest text-surface bg-content rounded-lg hover:bg-primary transition-all active:scale-95">
                  Review Product
                </button>
                <button className="px-6 py-2 text-[10px] font-bold uppercase tracking-widest text-content/60 border border-content/[0.1] rounded-lg hover:bg-content/[0.05] transition-all">
                  Order Again
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
