import { CartView } from "@/components/organisms/cart";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shopping Cart | Premium Tech Essentials",
  description:
    "Review and manage the items in your shopping cart before proceeding to checkout.",
};

export default function CartPage() {
  return <CartView />;
}
