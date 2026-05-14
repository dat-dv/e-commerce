import { AuthGuard } from "@/components/molecules/providers/auth-guard";
import { CartSync } from "../../../components/molecules/providers/cart/cart-sync";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthGuard>
      <CartSync />
      {children}
    </AuthGuard>
  );
};

export default Layout;
