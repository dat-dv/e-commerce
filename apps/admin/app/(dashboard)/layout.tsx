import { AdminFooter } from "@/components/organisms/admin-footer";
import { AdminHeader } from "@/components/organisms/admin-header";

/**
 * Dashboard shell layout — applied to all authenticated admin routes.
 * Auth routes (sign-in, forgot-password) live outside this group
 * and do NOT inherit this layout.
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <AdminHeader />
      <main className="flex-1 px-4 py-6 sm:px-6">{children}</main>
      <AdminFooter />
    </div>
  );
}
