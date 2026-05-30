import { AdminFooter } from "@/components/molecules/admin-footer";
import { AdminHeader } from "@/components/molecules/admin-header";

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
