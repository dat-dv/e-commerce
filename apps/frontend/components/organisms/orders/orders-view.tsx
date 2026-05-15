"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { APP_ROUTES } from "@/constants/routes";
import { ORDER_TABS } from "@/constants/order-status.constant";
import { useOrders } from "@/hooks/orders/use-orders";
import { OrderTabs } from "@/components/molecules/order-part/order-tabs";
import { OrderCard } from "@/components/molecules/order-part/order-card";
import { VirtualList } from "@/components/molecules/virtual-list";

export const OrdersView = () => {
  const {
    orders,
    loading,
    loadingMore,
    activeTab,
    setActiveTab,
    loadMore,
    hasMore,
    cancelOrder,
  } = useOrders();

  const activeTabLabel =
    ORDER_TABS.find((tab) => tab.value === activeTab)?.label || "All";

  const emptyStateMessage =
    activeTabLabel === "All"
      ? "Your luxury acquisition history is currently silent. Discover our latest masterpieces."
      : `You have no ${activeTabLabel.toLowerCase()} orders at the moment.`;

  return (
    <div className="min-h-screen bg-transparent pb-20">
      {/* Premium Sticky Header */}
      <div className="sticky top-0 z-50 bg-surface/80 backdrop-blur-2xl border-b border-content/[0.05] shadow-sm">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-black text-content tracking-tighter uppercase">
              Order History
            </h1>
            <p className="text-[10px] text-content/40 mt-1 font-bold uppercase tracking-widest">
              Luxury Experience • Track & Manage
            </p>
          </motion.div>
        </div>

        {/* Integrated Tabs */}
        <OrderTabs activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {loading && orders.length === 0 ? (
          <div className="py-32 flex flex-col items-center justify-center">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 border-4 border-primary/5 rounded-full" />
              <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
            <div className="mt-8 text-[10px] uppercase tracking-[0.3em] font-black text-content/20 animate-pulse">
              Authenticating History...
            </div>
          </div>
        ) : (
          <div className="flex flex-col">
            <AnimatePresence mode="wait">
              {orders.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="py-40 rounded-3xl bg-surface/40 backdrop-blur-xl border border-content/[0.03] flex flex-col items-center justify-center text-center shadow-2xl shadow-content/5"
                >
                  <div className="w-24 h-24 rounded-full bg-content/[0.02] flex items-center justify-center mb-10 border border-content/[0.05] relative group">
                    <div className="absolute inset-0 bg-primary/5 rounded-full scale-0 group-hover:scale-100 transition-transform duration-500" />
                    <ShoppingBag
                      size={40}
                      className="text-content/10 group-hover:text-primary/40 transition-colors duration-500"
                    />
                  </div>
                  <h2 className="text-3xl font-black mb-4 uppercase tracking-tighter text-content">
                    Collection Empty
                  </h2>
                  <p className="text-content/40 mb-12 max-w-xs text-xs font-medium leading-relaxed">
                    {emptyStateMessage}
                  </p>
                  <Link
                    href={APP_ROUTES.PRODUCTS}
                    className="group relative px-12 py-5 bg-content text-surface text-[10px] uppercase tracking-[0.4em] font-black rounded-full overflow-hidden transition-all hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] hover:-translate-y-1"
                  >
                    <span className="relative z-10">Start Acquisition</span>
                    <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                  </Link>
                </motion.div>
              ) : (
                <motion.div
                  key="list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <VirtualList
                    data={orders}
                    loadingMore={loadingMore}
                    hasMore={hasMore}
                    onLoadMore={loadMore}
                    loadingText="Fetching More Masterpieces..."
                    endText="End of Collection"
                    renderItem={(order) => (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                      >
                        <OrderCard order={order} onCancelOrder={cancelOrder} />
                      </motion.div>
                    )}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};
