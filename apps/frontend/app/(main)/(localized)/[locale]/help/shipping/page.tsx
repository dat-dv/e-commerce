import type { Metadata } from "next";
import HelpShippingView from "@/components/organisms/help-shipping-view";

export const metadata: Metadata = {
  title: "Shipping Information",
  description: "Learn about our shipping policies and tracking.",
};

export default function ShippingPage() {
  return <HelpShippingView />;
}
