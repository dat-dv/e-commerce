"use client";

import { EOrderStatus } from "@ecommerce/shared";
import { IOrder } from "@/domain/orders/types/order.model";
import Image from "next/image";
import { formatCurrency } from "@/utils/format-currency";
import { motion } from "framer-motion";
import { MessageSquare, Store, Truck } from "lucide-react";
import { cn } from "@/utils/cn";
import { ORDER_STATUS_CONFIG } from "@/constants/order-status.constant";

interface OrderCardProps {
  order: IOrder;
}

export const OrderCard = ({ order }: OrderCardProps) => {
  const status = ORDER_STATUS_CONFIG[order.status] || {
    label: "Unknown",
    color: "text-gray-500 bg-gray-50",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-4 hover:shadow-md transition-shadow duration-300"
    >
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-gray-50 bg-gray-50/30">
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="font-semibold text-gray-800 text-sm">
              Order #{order.id.slice(-8).toUpperCase()}
            </span>
            <span className="text-xs text-gray-500">
              {new Date(order.createdAt).toLocaleDateString()}
            </span>
          </div>
          <button
            disabled
            className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-400 bg-gray-50 rounded cursor-not-allowed border border-gray-100"
          >
            <MessageSquare className="w-3 h-3" />
            Chat (Incoming)
          </button>
        </div>
        <div className="flex items-center gap-2">
          {order.status === EOrderStatus.SHIPPING && (
            <div className="flex items-center gap-1 text-xs text-sky-600 border-r border-gray-200 pr-2 mr-2">
              <Truck className="w-3.5 h-3.5" />
              <span>Shipping</span>
            </div>
          )}
          <span
            className={cn(
              "px-2 py-1 text-xs font-semibold rounded",
              status.color,
            )}
          >
            {status.label}
          </span>
        </div>
      </div>

      {/* Items */}
      <div className="divide-y divide-gray-50">
        {order.items.map((item) => (
          <div key={item.id} className="p-4 flex gap-4">
            <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
              {item.sku?.imageUrl ? (
                <Image
                  src={item.sku.imageUrl}
                  alt={item.sku.product?.name || "Product"}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <Store className="w-8 h-8" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-gray-900 line-clamp-2 leading-relaxed">
                {item.sku?.product?.name || "Product Name"}
              </h3>
              <p className="mt-1 text-xs text-gray-500">
                Variant: {item.sku?.skuCode || "Default"}
              </p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-sm text-gray-700">x{item.quantity}</span>
                <span className="text-sm font-medium text-primary">
                  {formatCurrency(item.price)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-4 py-4 bg-gray-50/30 border-t border-gray-50">
        <div className="flex flex-col items-end gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Order Total:</span>
            <span className="text-xl font-bold text-primary">
              {formatCurrency(order.totalAmount)}
            </span>
          </div>

          <div className="flex gap-2">
            {order.status === EOrderStatus.DELIVERED && (
              <>
                <button className="px-6 py-2 text-sm font-semibold text-white bg-primary rounded-md shadow-sm hover:bg-primary/90 transition-all active:scale-95">
                  Review
                </button>
                <button className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-md hover:bg-white transition-colors">
                  Buy Again
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
