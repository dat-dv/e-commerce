import Footer from "@/components/atoms/footer";
import Header from "@/components/molecules/header";
import { AddressProvider } from "@/components/molecules/providers/address-provider";
import { CartDrawer } from "@/components/organisms/cart/cart-drawer";

import { cartUseCase } from "@/domain/cart/use-cases";
import { allSafe } from "@/utils/promise";
import { addressesUseCase } from "@/domain/addresses";
import { CartProvider } from "@/components/molecules/providers/cart-provider";

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [initialCartState, initialAddressesState] = await allSafe([
    cartUseCase.getCart.execute(),
    addressesUseCase.getAddresses.execute(),
  ]);

  return (
    <CartProvider initState={initialCartState?.data?.items || []}>
      <AddressProvider initState={initialAddressesState?.data || []}>
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
