import React from "react";
import { Metadata } from "next";
import { OrdersView } from "@/components/organisms/orders/orders-view";

export const metadata: Metadata = {
  title: "My Orders | Luxury E-commerce",
  description: "Track and manage your premium orders.",
};

export default function OrdersPage() {
  return <OrdersView />;
}
