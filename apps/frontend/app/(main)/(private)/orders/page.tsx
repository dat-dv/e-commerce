import AppContainer from "@/components/atoms/app-container";
import Button from "@/components/atoms/button";
import type { Metadata } from "next";
import { APP_ROUTES } from "@/constants/routes";

export const metadata: Metadata = {
  title: "My Orders",
  description: "View your order history.",
};

export default function OrdersPage() {
  return (
    <AppContainer
      size="2xl"
      className="py-16 animate-in fade-in slide-in-from-bottom-6 duration-700 flex flex-col items-center justify-center min-h-[50vh] text-center"
    >
      <div className="text-6xl mb-4">📦</div>
      <h1 className="text-3xl font-black mb-2 text-content">My Orders</h1>
      <p className="text-content/40 text-sm mb-8">You have no orders yet.</p>
      <Button
        href={APP_ROUTES.PRODUCTS}
        variant="outline"
        size="lg"
        className="rounded-2xl px-8"
      >
        Discover Products
      </Button>
    </AppContainer>
  );
}
