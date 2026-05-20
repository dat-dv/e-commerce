"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

import Button from "@/components/atoms/button";
import { ORDER_TABS, OrderTabValue } from "@/constants/order-status.constant";
import { cn } from "@/utils/cn";
import type { ComponentPropsWithoutRef } from "react";

export interface IOrderTabsProps extends ComponentPropsWithoutRef<"div"> {
  activeTab: OrderTabValue;
  onTabChange: (value: OrderTabValue) => void;
  listClassName?: string;
  tabClassName?: string;
}

export const OrderTabs = ({
  activeTab,
  onTabChange,
  className,
  listClassName,
  tabClassName,
  ...props
}: IOrderTabsProps) => {
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
    <div
      className={cn(
        "scrollbar-hide w-full overflow-x-auto border-b border-content/[0.05] bg-transparent",
        className,
      )}
      {...props}
    >
      <div className={cn("container mx-auto flex min-w-max", listClassName)}>
        {ORDER_TABS.map((tab) => {
          const isActive = activeTab === tab.value;
          return (
            <Button
              key={tab.label}
              onPress={() => onTabChange(tab.value)}
              className={cn(
                "relative rounded-none bg-transparent px-6 py-5 text-sm font-semibold shadow-none transition-all duration-300 active:scale-100",
                isActive
                  ? "text-primary"
                  : "text-content/40 hover:text-content hover:bg-content/[0.02]",
                tabClassName,
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
            </Button>
          );
        })}
      </div>
    </div>
  );
};
