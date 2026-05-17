"use client";

import { ORDER_TABS, OrderTabValue } from "@/constants/order-status.constant";
import { ShoppingBag } from "lucide-react";
import { APP_ROUTES } from "@/constants/routes";
import EmptyState from "../empty-space";

interface OrderEmptyStateProps {
  type: OrderTabValue;
}

export const OrderEmptyState = ({ type }: OrderEmptyStateProps) => {
  const activeTabLabel =
    ORDER_TABS.find((tab) => tab.value === type)?.label || "Overview";

  const message =
    activeTabLabel === "Overview"
      ? "You haven’t placed any orders yet. Start exploring products and place your first order."
      : `You have no ${activeTabLabel.toLowerCase()} orders at the moment.`;

  return (
    <EmptyState
      title="No Orders Yet"
      description={message}
      icon={ShoppingBag}
      actionLabel="Start Shopping"
      actionHref={APP_ROUTES.PRODUCTS}
    />
  );
};
