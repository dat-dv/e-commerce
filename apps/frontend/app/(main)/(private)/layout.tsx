import { AuthGuard } from "@/components/molecules/providers/auth-guard";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  return <AuthGuard>{children}</AuthGuard>;
};

export default Layout;
