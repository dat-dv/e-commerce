import AppContainer from "@/components/atoms/app-container";
import Button from "@/components/atoms/button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your purchase.",
};

export default function CheckoutPage() {
  return (
    <AppContainer
      size="2xl"
      className="py-16 animate-in fade-in slide-in-from-bottom-6 duration-700"
    >
      <h1 className="text-3xl font-black mb-2 text-content">Checkout</h1>
      <p className="text-content/40 text-sm mb-8">Complete your purchase.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left: Shipping Info Placeholder */}
        <div className="md:col-span-2 space-y-6">
          <div className="border border-content/5 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-content mb-4">
              Shipping Address
            </h2>
            <p className="text-content/60 text-sm">No address saved yet.</p>
          </div>
          <div className="border border-content/5 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-content mb-4">
              Payment Method
            </h2>
            <p className="text-content/60 text-sm">
              No payment method selected.
            </p>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="border border-content/5 rounded-2xl p-6 h-fit">
          <h2 className="text-lg font-bold text-content mb-4">Order Summary</h2>
          <div className="space-y-2 text-sm text-content/60">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>$0.00</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>$0.00</span>
            </div>
            <div className="flex justify-between font-bold text-content pt-2 border-t border-content/5">
              <span>Total</span>
              <span>$0.00</span>
            </div>
          </div>
          <Button variant="primary" className="w-full mt-6" disabled>
            Place Order
          </Button>
        </div>
      </div>
    </AppContainer>
  );
}
