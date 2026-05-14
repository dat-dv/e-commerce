import Footer from "@/components/atoms/footer";
import Header from "@/components/molecules/header";
import { CartProvider } from "@/components/molecules/providers/cart/cart-provider";
import { CartDrawer } from "@/components/organisms/cart/cart-drawer";

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <CartProvider>
      <div className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
      <CartDrawer />
    </CartProvider>
  );
}
