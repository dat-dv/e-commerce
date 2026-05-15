"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { APP_ROUTES } from "@/constants/routes";
import { useOrders } from "@/hooks/orders/use-orders";
import { OrderTabs } from "@/components/molecules/order-part/order-tabs";
import { OrderCard } from "@/components/molecules/order-part/order-card";
import { Pagination } from "@/components/molecules/pagination";

export const OrdersView = () => {
  const { orders, loading, activeTab, setActiveTab, meta, page, setPage } =
    useOrders();

  return (
    <div className="min-h-screen bg-transparent">
      {/* Premium Header Section */}
      <div className="bg-surface/50 backdrop-blur-xl border-b border-content/[0.05]">
        <div className="container mx-auto px-4 py-10 max-w-6xl">
          <h1 className="text-4xl font-bold text-content tracking-tight">
            Order History
          </h1>
          <p className="text-sm text-content/40 mt-2 font-medium">
            Manage and track your premium orders
          </p>
        </div>

        {/* Integrated Tabs */}
        <OrderTabs activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {loading && orders.length === 0 ? (
          <div className="py-24 text-center">
            <div className="inline-block w-10 h-10 border-2 border-primary/10 border-t-primary rounded-full animate-spin mb-6" />
            <div className="text-[10px] uppercase tracking-widest font-bold text-content/30">
              Synchronizing orders...
            </div>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {orders.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="py-32 rounded-2xl bg-surface/30 backdrop-blur-md border border-content/[0.05] flex flex-col items-center justify-center text-center shadow-sm"
              >
                <div className="w-20 h-20 rounded-full bg-content/[0.02] flex items-center justify-center mb-8 border border-content/5">
                  <ShoppingBag size={32} className="text-content/10" />
                </div>
                <h2 className="text-2xl font-black mb-2 uppercase tracking-tight">
                  No Orders Yet
                </h2>
                <p className="text-content/30 mb-10 max-w-xs text-xs font-medium">
                  Your purchase history is clear. Ready to discover something
                  new?
                </p>
                <Link
                  href={APP_ROUTES.PRODUCTS}
                  className="px-10 py-4 bg-primary text-surface text-[10px] uppercase tracking-[0.3em] font-bold rounded-xl hover:opacity-90 transition-all shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95"
                >
                  Start Shopping
                </Link>
              </motion.div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}

                {meta && meta.totalPages > 1 && (
                  <div className="pt-8">
                    <Pagination
                      currentPage={page}
                      totalPages={meta.totalPages}
                      onPageChange={setPage}
                    />
                  </div>
                )}
              </div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};
