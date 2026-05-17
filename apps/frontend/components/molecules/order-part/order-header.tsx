"use client";

import { OrderTabs } from "./order-tabs";
import AnimatedPageHeader from "../page-header-animation";
import { PackageCheck, Receipt, ShoppingBag, Truck } from "lucide-react";

interface OrderHeaderProps {
  activeTab: readonly number[] | "all";
  onTabChange: (value: readonly number[] | "all") => void;
}

export const OrderHeader = ({ activeTab, onTabChange }: OrderHeaderProps) => {
  return (
    <div className="border-b border-content/[0.03]">
      <AnimatedPageHeader
        title="My"
        highlight="Orders"
        description="Track your purchases, review order status, and manage everything you’ve bought."
        icons={[PackageCheck, ShoppingBag, Truck, Receipt]}
      />

      <div className="-mt-6 pb-6">
        <OrderTabs activeTab={activeTab} onTabChange={onTabChange} />
      </div>
    </div>
  );
};
