"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { APP_ROUTES } from "@/constants/routes";
import { useOrders } from "@/hooks/orders/use-orders";
import { OrderTabs } from "@/components/molecules/order-part/order-tabs";
import { OrderCard } from "@/components/molecules/order-part/order-card";

export const OrdersView = () => {
  const { orders, loading, activeTab, setActiveTab } = useOrders();

  return (
    <div className="min-h-screen bg-gray-50/30">
      {/* Premium Header Section */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-6 max-w-6xl">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Order History
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage and track the status of your orders
          </p>
        </div>

        {/* Integrated Tabs */}
        <OrderTabs activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {loading && orders.length === 0 ? (
          <div className="py-24 text-center">
            <div className="inline-block w-12 h-12 border-4 border-primary/10 border-t-primary rounded-full animate-spin mb-4" />
            <div className="text-[10px] uppercase tracking-widest font-black text-content/40">
              Synchronizing with server...
            </div>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {orders.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-32 rounded-[3rem] bg-white border border-gray-100 flex flex-col items-center justify-center text-center shadow-sm"
              >
                <div className="w-24 h-24 rounded-full bg-gray-50 flex items-center justify-center mb-8">
                  <ShoppingBag size={40} className="text-gray-200" />
                </div>
                <h2 className="text-3xl font-black mb-2 uppercase tracking-tight">
                  Empty History
                </h2>
                <p className="text-gray-400 mb-10 max-w-xs italic font-light">
                  Looks like your purchase history is clear. Ready to start
                  shopping?
                </p>
                <Link
                  href={APP_ROUTES.PRODUCTS}
                  className="px-12 py-5 bg-black text-white text-[11px] uppercase tracking-[0.3em] font-black rounded-full hover:bg-primary transition-all shadow-2xl hover:scale-105 active:scale-95"
                >
                  Explore Products
                </Link>
              </motion.div>
            ) : (
              <div className="space-y-6">
                {orders.map((order, index) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};
