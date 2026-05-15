"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  Package,
  CreditCard,
  Truck,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { APP_ROUTES } from "@/constants/routes";
import { useOrderDetail } from "@/hooks/orders/use-order-detail";
import { ORDER_STATUS_CONFIG } from "@/constants/order-status.constant";
import { formatCurrency } from "@/utils/format-currency";
import { cn } from "@/utils/cn";
import Image from "next/image";

export const OrderDetailView = ({ orderId }: { orderId: string }) => {
  const { order, loading, error } = useOrderDetail(orderId);

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent flex flex-col items-center justify-center">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-primary/5 rounded-full" />
          <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
        <div className="mt-8 text-[10px] uppercase tracking-[0.3em] font-black text-content/20 animate-pulse">
          Loading Masterpiece...
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-transparent flex flex-col items-center justify-center">
        <AlertCircle className="w-16 h-16 text-red-500/50 mb-6" />
        <h1 className="text-2xl font-black text-content tracking-tighter uppercase mb-4">
          Order Not Found
        </h1>
        <p className="text-content/40 text-xs font-medium mb-8 max-w-sm text-center">
          We could not locate this acquisition. It may have been removed or the
          ID is incorrect.
        </p>
        <Link
          href={APP_ROUTES.ORDERS}
          className="px-8 py-3 bg-content text-surface text-[10px] uppercase tracking-[0.3em] font-black rounded-lg hover:-translate-y-1 transition-all"
        >
          Return to History
        </Link>
      </div>
    );
  }

  const status = ORDER_STATUS_CONFIG[order.status] || {
    label: "Unknown",
    color: "text-content/40 bg-content/5",
  };

  return (
    <div className="min-h-screen bg-transparent">
      <div className="sticky top-0 z-50 bg-surface/80 backdrop-blur-2xl border-b border-content/[0.05] shadow-sm">
        <div className="container mx-auto px-4 py-6 max-w-4xl flex items-center gap-6">
          <Link
            href={APP_ROUTES.ORDERS}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-content/[0.05] transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-content/60" />
          </Link>
          <div>
            <h1 className="text-xl font-black text-content tracking-tighter uppercase">
              Order #{order.id.slice(-8).toUpperCase()}
            </h1>
            <p className="text-[10px] text-content/40 mt-1 font-bold uppercase tracking-widest">
              {new Date(order.createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
          <div className="ml-auto">
            <span
              className={cn(
                "px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-full",
                status.color,
              )}
            >
              {status.label}
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {/* Shipping Info */}
          <div className="bg-surface/40 backdrop-blur-md rounded-2xl border border-content/[0.05] p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Truck className="w-4 h-4" />
              </div>
              <h2 className="text-xs font-black uppercase tracking-widest text-content">
                Delivery Details
              </h2>
            </div>
            <div className="space-y-4 text-sm font-medium text-content/60">
              <p className="text-content font-bold">
                {order.shippingAddress?.fullName || "N/A"}
              </p>
              <p>{order.shippingAddress?.phone || "N/A"}</p>
              <p className="leading-relaxed">
                {order.shippingAddress?.street}
                <br />
                {order.shippingAddress?.ward}, {order.shippingAddress?.district}
                <br />
                {order.shippingAddress?.city}
              </p>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-surface/40 backdrop-blur-md rounded-2xl border border-content/[0.05] p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <CreditCard className="w-4 h-4" />
              </div>
              <h2 className="text-xs font-black uppercase tracking-widest text-content">
                Payment Summary
              </h2>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-content/60 font-medium">Subtotal</span>
                <span className="font-bold text-content">
                  {formatCurrency(
                    order.items.reduce(
                      (acc, item) => acc + item.price * item.quantity,
                      0,
                    ),
                  )}
                </span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-content/60 font-medium">Discount</span>
                  <span className="font-bold text-red-500">
                    -{formatCurrency(order.discountAmount)}
                  </span>
                </div>
              )}
              <div className="pt-4 border-t border-content/[0.05] flex justify-between items-center">
                <span className="text-xs font-black uppercase tracking-widest text-content">
                  Total
                </span>
                <span className="text-2xl font-black text-content tracking-tighter">
                  {formatCurrency(order.totalAmount)}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Order Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-surface/40 backdrop-blur-md rounded-2xl border border-content/[0.05] overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-content/[0.05] bg-content/[0.02] flex items-center gap-3">
            <Package className="w-4 h-4 text-content/40" />
            <h2 className="text-xs font-black uppercase tracking-widest text-content">
              Acquisitions ({order.items.length})
            </h2>
          </div>
          <div className="divide-y divide-content/[0.05]">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="p-6 flex gap-6 hover:bg-content/[0.02] transition-colors"
              >
                <div className="relative w-24 h-24 rounded-xl border border-content/[0.05] bg-content/[0.02] overflow-hidden shrink-0">
                  {item.sku?.imageUrl && (
                    <Image
                      src={item.sku.imageUrl}
                      alt={item.sku.product?.name || "Product"}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="text-sm font-bold text-content leading-tight">
                      {item.sku?.product?.name || "Unknown Product"}
                    </h3>
                    <div className="text-base font-black text-content tracking-tighter shrink-0">
                      {formatCurrency(item.price)}
                    </div>
                  </div>
                  <p className="mt-2 text-[10px] font-bold text-content/40 uppercase tracking-widest">
                    {item.attributes || `SKU: ${item.sku?.skuCode}`}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-content/[0.05] rounded-md text-content/60">
                      Qty: {item.quantity}
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
      </div>
    </div>
  );
};
