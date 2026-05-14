"use client";

import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import { ORDER_TABS } from "@/constants/order-status.constant";

interface OrderTabsProps {
  activeTab: readonly number[] | "all";
  onTabChange: (value: readonly number[] | "all") => void;
}

export const OrderTabs = ({ activeTab, onTabChange }: OrderTabsProps) => {
  return (
    <div className="sticky top-0 z-10 w-full overflow-x-auto bg-white/80 backdrop-blur-md border-b border-gray-100 scrollbar-hide">
      <div className="flex min-w-max px-4 container mx-auto max-w-6xl">
        {ORDER_TABS.map((tab) => {
          const isActive = activeTab === tab.value;
          return (
            <button
              key={tab.label}
              onClick={() => onTabChange(tab.value)}
              className={cn(
                "relative px-6 py-4 text-sm font-medium transition-colors duration-200",
                isActive ? "text-primary" : "text-gray-500 hover:text-gray-900",
              )}
            >
              <span className="relative z-10">{tab.label}</span>
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
