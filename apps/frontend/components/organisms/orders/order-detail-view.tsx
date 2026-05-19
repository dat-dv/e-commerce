"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Package,
  CreditCard,
  Truck,
  AlertCircle,
  RotateCcw,
} from "lucide-react";
import Link from "next/link";
import { APP_ROUTES } from "@/constants/routes";
import { useOrderDetail } from "@/hooks/orders/use-order-detail";
import { useOrderReturnRequest } from "@/hooks/order-returns/use-order-return-request";
import { ORDER_STATUS_CONFIG } from "@/constants/order-status.constant";
import { formatCurrency } from "@/utils/format-currency";
import { cn } from "@/utils/cn";
import Image from "next/image";
import { EOrderStatus } from "@ecommerce/shared";
import { RequestReturnModal } from "@/components/molecules/order-part/request-return-modal";

export const OrderDetailView = ({ orderId }: { orderId: string }) => {
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const { order, loading, error, refresh } = useOrderDetail(orderId);
  const returnRequest = useOrderReturnRequest({
    orderId,
    onSuccess: async () => {
      setIsReturnModalOpen(false);
      await refresh();
    },
  });

  const closeReturnModal = () => {
    if (returnRequest.isSubmitting) return;
    setIsReturnModalOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent flex flex-col items-center justify-center">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-4 border-primary/5 rounded-full" />
          <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
        <div className="mt-6 text-xs font-semibold text-content/30 animate-pulse">
          Loading...
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-transparent flex flex-col items-center justify-center">
        <AlertCircle className="w-16 h-16 text-red-500/50 mb-6" />
        <h1 className="text-2xl font-bold text-content tracking-tight mb-4">
          Order Not Found
        </h1>
        <p className="text-content/40 text-sm font-medium mb-8 max-w-sm text-center">
          We could not locate this order. It may have been removed or the ID is
          incorrect.
        </p>
        <Link
          href={APP_ROUTES.ORDERS}
          className="px-8 py-3 bg-content text-surface text-sm font-semibold rounded-xl hover:-translate-y-1 transition-all shadow-lg shadow-black/10"
        >
          Return to Orders
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
      <div className="bg-surface/80 backdrop-blur-2xl border-b border-content/[0.05]">
        <div className="container mx-auto px-4 py-6 max-w-4xl flex items-center gap-6">
          <Link
            href={APP_ROUTES.ORDERS}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-content/[0.05] transition-colors border border-content/[0.05]"
          >
            <ArrowLeft className="w-5 h-5 text-content/60" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-content tracking-tight">
              Order #{order.id.slice(-8).toUpperCase()}
            </h1>
            <p className="text-xs text-content/40 mt-1 font-medium">
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
                "px-4 py-1.5 text-xs font-bold rounded-full",
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
          <div className="bg-surface/40 backdrop-blur-md rounded-2xl border border-content/[0.05] p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Truck className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-content">
                Delivery Details
              </h2>
            </div>
            <div className="space-y-4 text-sm font-medium text-content/60">
              <p className="text-content font-bold">
                {order.shippingAddress?.receiverName || "N/A"}
              </p>
              <p>{order.shippingAddress?.receiverPhone || "N/A"}</p>
              <p className="leading-relaxed">
                {order.shippingAddress?.street}
                <br />
                {order.shippingAddress?.city}, {order.shippingAddress?.state}
                <br />
                {order.shippingAddress?.country}
              </p>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-surface/40 backdrop-blur-md rounded-2xl border border-content/[0.05] p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <CreditCard className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-content">
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
                <span className="text-sm font-bold text-content">Total</span>
                <span className="text-3xl font-black text-content tracking-tight">
                  {formatCurrency(order.totalAmount)}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {order.status === EOrderStatus.DELIVERED && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="flex flex-col gap-4 rounded-2xl border border-content/[0.05] bg-surface/40 p-6 shadow-sm backdrop-blur-md sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <h2 className="text-sm font-bold text-content">
                Need to return this order?
              </h2>
              <p className="mt-1 text-sm font-medium leading-relaxed text-content/50">
                Submit a reason and clear photos for support review.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsReturnModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-content px-5 py-3 text-sm font-semibold text-surface shadow-lg shadow-black/10 transition-colors hover:bg-primary"
            >
              <RotateCcw className="h-4 w-4" />
              Request return
            </button>
          </motion.div>
        )}

        {/* Order Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-surface/40 backdrop-blur-md rounded-2xl border border-content/[0.05] overflow-hidden shadow-sm"
        >
          <div className="px-6 py-4 border-b border-content/[0.05] bg-content/[0.02] flex items-center gap-3">
            <Package className="w-4 h-4 text-content/40" />
            <h2 className="text-sm font-bold text-content">
              Order Items ({order.items.length})
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
                      alt={item.sku.product?.name || "Product"}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="text-base font-bold text-content leading-tight">
                      {item.sku?.product?.name || "Unknown Product"}
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
                      {item.quantity} unit{item.quantity > 1 ? "s" : ""}
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
      <RequestReturnModal
        isOpen={isReturnModalOpen}
        isSubmitting={returnRequest.isSubmitting}
        onClose={closeReturnModal}
        onSubmit={returnRequest.submitReturnRequest}
      />
    </div>
  );
};
