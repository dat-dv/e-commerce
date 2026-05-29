"use client";

import { ORDER_TABS, OrderTabValue } from "@/constants/order-status.constant";
import { ShoppingBag } from "lucide-react";
import { APP_ROUTES } from "@/constants/routes";
import EmptyState from "../empty-space";
import { useTranslations } from "next-intl";

interface OrderEmptyStateProps {
  type: OrderTabValue;
}

export const OrderEmptyState = ({ type }: OrderEmptyStateProps) => {
  const t = useTranslations("OrdersPage");

  const activeTabLabel =
    ORDER_TABS.find((tab) => tab.value === type)?.label || "Overview";

  const getLocalizedTabName = (label: string) => {
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

  const message =
    activeTabLabel === "Overview"
      ? t("emptyState.messageOverview")
      : t("emptyState.messageOther", {
          tab: getLocalizedTabName(activeTabLabel).toLowerCase(),
        });

  return (
    <EmptyState
      title={t("emptyState.title")}
      description={message}
      icon={ShoppingBag}
      actionLabel={t("emptyState.actionLabel")}
      actionHref={APP_ROUTES.PRODUCTS}
    />
  );
};
