import AppContainer from "@/components/atoms/app-container";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Orders",
  description: "View your order history.",
};

export default function OrdersPage() {
  return (
    <AppContainer className="py-16 flex flex-col items-center justify-center min-h-[50vh] text-center">
      <h1 className="text-4xl font-black mb-4">My Orders</h1>
      <p className="text-content/60 text-lg">You have no orders yet.</p>
    </AppContainer>
  );
}
