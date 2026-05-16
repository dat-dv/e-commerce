"use client";

import { motion } from "framer-motion";
import { OrderTabs } from "./order-tabs";

interface OrderHeaderProps {
  activeTab: readonly number[] | "all";
  onTabChange: (value: readonly number[] | "all") => void;
}

export const OrderHeader = ({ activeTab, onTabChange }: OrderHeaderProps) => {
  return (
    <div className="bg-transparent border-b border-content/[0.05]">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-black text-content tracking-tight">
            My Orders
          </h1>
        </motion.div>
      </div>

      {/* Integrated Tabs */}
      <OrderTabs activeTab={activeTab} onTabChange={onTabChange} />
    </div>
  );
};
