import Footer from "@/components/atoms/footer";
import Header from "@/components/molecules/header";
import { CartProvider } from "@/components/molecules/providers/cart-provider";
import { AddressProvider } from "@/components/molecules/providers/address-provider";
import { CartDrawer } from "@/components/organisms/cart/cart-drawer";

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <CartProvider>
      <AddressProvider>
        <div className="min-h-full flex flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <CartDrawer />
      </AddressProvider>
    </CartProvider>
  );
}
