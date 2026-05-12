import CartView from "@/components/organisms/cart/cart-view";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Cart",
  description: "View and manage items in your shopping cart.",
};

export default function CartPage() {
  return <CartView />;
}
