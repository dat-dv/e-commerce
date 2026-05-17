"use client";

import AnimatedPageHeader from "../page-header-animation";
import { PackageCheck, Receipt, ShoppingBag, Truck } from "lucide-react";

export const OrderHeader = () => {
  return (
    <AnimatedPageHeader
      title="My"
      highlight="Orders"
      description="Track your purchases, review order status, and manage everything you’ve bought."
      icons={[PackageCheck, ShoppingBag, Truck, Receipt]}
    />
  );
};
