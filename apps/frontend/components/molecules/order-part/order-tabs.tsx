"use client";

import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import { ORDER_TABS, OrderTabValue } from "@/constants/order-status.constant";
import { useTranslations } from "next-intl";

interface OrderTabsProps {
  activeTab: OrderTabValue;
  onTabChange: (value: OrderTabValue) => void;
}

export const OrderTabs = ({ activeTab, onTabChange }: OrderTabsProps) => {
  const t = useTranslations("OrdersPage");

  const getTabLabel = (label: string) => {
    switch (label) {
      case "Overview":
        return t("tabs.all");
      case "In Progress":
        return t("tabs.inProgress");
      case "In Transit":
        return t("tabs.inTransit");
      case "Delivered":
        return t("tabs.delivered");
      case "Returns":
        return t("tabs.returns");
      case "Closed":
        return t("tabs.closed");
      default:
        return label;
    }
  };

  return (
    <div className="w-full overflow-x-auto bg-transparent border-b border-content/[0.05] scrollbar-hide">
      <div className="flex min-w-max container mx-auto">
        {ORDER_TABS.map((tab) => {
          const isActive = activeTab === tab.value;
          return (
            <button
              key={tab.label}
              onClick={() => onTabChange(tab.value)}
              className={cn(
                "relative px-6 py-5 text-sm font-semibold transition-all duration-300",
                isActive
                  ? "text-primary"
                  : "text-content/40 hover:text-content hover:bg-content/[0.02]",
              )}
            >
              <span className="relative z-10">{getTabLabel(tab.label)}</span>
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
