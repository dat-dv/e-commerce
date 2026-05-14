import CartView from "@/components/organisms/cart/cart-view";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shopping Cart | Premium Tech Essentials",
  description:
    "Review and manage the items in your shopping cart before proceeding to checkout.",
};

export default function CartPage() {
  return <CartView />;
}
