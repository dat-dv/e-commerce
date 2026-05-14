import { AuthGuard } from "@/components/molecules/providers/auth-guard";
import { AddressProvider } from "@/components/molecules/providers/address-provider";
import { CartProvider } from "@/components/molecules/providers/cart/cart-provider";
import { CartDrawer } from "@/components/organisms/cart/cart-drawer";
import { CartSync } from "../../../components/molecules/providers/cart/cart-sync";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthGuard>
      <CartSync />
      <AddressProvider>
        {children}
        <CartDrawer />
      </AddressProvider>
    </AuthGuard>
  );
};

export default Layout;
