import AppContainer from "@/components/atoms/app-container";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your purchase.",
};

export default function CheckoutPage() {
  return (
    <AppContainer className="py-16 flex flex-col items-center justify-center min-h-[50vh] text-center">
      <h1 className="text-4xl font-black mb-4">Checkout</h1>
      <p className="text-content/60 text-lg">
        Checkout process is coming soon...
      </p>
    </AppContainer>
  );
}
