"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Package,
  ChevronRight,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  ShoppingBag,
} from "lucide-react";
import Link from "next/link";
import { APP_ROUTES } from "@/constants/routes";
import { useGetOrders } from "@/hooks/orders/use-get-orders";
import { cn } from "@/utils/cn";
import { format } from "date-fns";

const statusConfig: Record<
  number,
  { label: string; icon: React.ElementType; color: string }
> = {
  0: { label: "Pending", icon: Clock, color: "text-amber-500 bg-amber-500/10" },
  1: {
    label: "Confirmed",
    icon: CheckCircle2,
    color: "text-blue-500 bg-blue-500/10",
  },
  2: {
    label: "Processing",
    icon: Package,
    color: "text-indigo-500 bg-indigo-500/10",
  },
  3: { label: "Shipping", icon: Truck, color: "text-primary bg-primary/10" },
  4: {
    label: "Delivered",
    icon: CheckCircle2,
    color: "text-green-500 bg-green-500/10",
  },
  5: { label: "Cancelled", icon: XCircle, color: "text-red-500 bg-red-500/10" },
  6: {
    label: "Refunded",
    icon: XCircle,
    color: "text-gray-500 bg-gray-500/10",
  },
};

export const OrdersView = () => {
  const { orders, loading } = useGetOrders();

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="mb-12">
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none mb-4 uppercase">
          MY <span className="italic font-light opacity-20">ORDERS</span>
        </h1>
        <div className="h-px w-24 bg-primary" />
      </div>

      {loading && orders.length === 0 ? (
        <div className="py-24 text-center">
          <div className="inline-block w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
          <div className="text-[10px] uppercase tracking-widest font-black text-content/40">
            Fetching your history...
          </div>
        </div>
      ) : orders.length === 0 ? (
        <div className="py-32 rounded-[3rem] bg-surface/50 backdrop-blur-xl border border-content/5 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 rounded-full bg-content/5 flex items-center justify-center mb-8">
            <ShoppingBag size={32} className="text-content/20" />
          </div>
          <h2 className="text-2xl font-black mb-2 uppercase tracking-tight">
            No orders yet
          </h2>
          <p className="text-content/40 mb-10 max-w-xs italic font-light">
            Looks like you haven&apos;t placed any orders with us yet.
          </p>
          <Link
            href={APP_ROUTES.PRODUCTS}
            className="px-10 py-4 bg-content text-surface text-[11px] uppercase tracking-[0.3em] font-black rounded-full hover:bg-primary transition-all shadow-2xl shadow-content/20"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const config = statusConfig[order.status] || statusConfig[0];
            const StatusIcon = config.icon;

            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="group p-8 rounded-[2rem] bg-surface/50 backdrop-blur-xl border border-content/5 hover:border-primary/20 transition-all hover:shadow-2xl hover:shadow-primary/5 cursor-pointer relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <div className="absolute top-0 right-0 p-8">
                  <ChevronRight
                    size={20}
                    className="text-content/10 group-hover:text-primary transition-colors"
                  />
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          "px-4 py-1.5 rounded-full flex items-center gap-2 text-[10px] uppercase tracking-widest font-black",
                          config.color,
                        )}
                      >
                        <StatusIcon size={12} />
                        {config.label}
                      </div>
                      <span className="text-[10px] uppercase tracking-[0.4em] font-black text-content/20">
                        #{order.id.slice(-8).toUpperCase()}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="text-[11px] uppercase tracking-widest font-black text-content/40">
                        Placed on
                      </div>
                      <div className="text-lg font-bold">
                        {format(order.createdAt, "MMMM do, yyyy")}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-12">
                    <div className="text-right">
                      <div className="text-[11px] uppercase tracking-widest font-black text-content/40 mb-1">
                        Total Amount
                      </div>
                      <div className="text-3xl font-black tracking-tighter text-primary">
                        ${order.totalAmount.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};
