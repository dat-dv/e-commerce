import React from "react";
import { Metadata } from "next";
import { CheckoutView } from "@/components/organisms/checkout/checkout-view";

export const metadata: Metadata = {
  title: "Checkout | Luxury E-commerce",
  description: "Complete your order with our secure and premium checkout experience.",
};

export default function CheckoutPage() {
  return <CheckoutView />;
}
