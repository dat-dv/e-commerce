import AppContainer from "@/components/atoms/app-container";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cart",
  description: "Your shopping cart.",
};

export default function CartPage() {
  return (
    <AppContainer className="py-16 flex flex-col items-center justify-center min-h-[50vh] text-center">
      <h1 className="text-4xl font-black mb-4">Your Cart</h1>
      <p className="text-content/60 text-lg">Your cart is currently empty.</p>
    </AppContainer>
  );
}
