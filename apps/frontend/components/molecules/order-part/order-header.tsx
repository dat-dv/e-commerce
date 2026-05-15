"use client";

import { motion } from "framer-motion";
import { OrderTabs } from "./order-tabs";

interface OrderHeaderProps {
  activeTab: readonly number[] | "all";
  onTabChange: (value: readonly number[] | "all") => void;
}

export const OrderHeader = ({ activeTab, onTabChange }: OrderHeaderProps) => {
  return (
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
            Track and manage your recent acquisitions
          </p>
        </motion.div>
      </div>

      {/* Integrated Tabs */}
      <OrderTabs activeTab={activeTab} onTabChange={onTabChange} />
    </div>
  );
};
