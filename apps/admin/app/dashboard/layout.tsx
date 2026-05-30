"use client";

import { AdminFooter } from "@/components/molecules/admin-footer";
import { AdminHeader } from "@/components/molecules/admin-header";
import { Sidebar } from "@/components/molecules/sidebar";
import { useAdminSidebarStore } from "@/store/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const toggleOpen = useAdminSidebarStore((s) => s.toggleOpen);

  return (
    <div className="flex min-h-screen bg-[var(--app-bg)]">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Right Content Area */}
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminHeader onMenuToggle={toggleOpen} />
        <main className="flex-1 px-4 py-6 sm:px-6">{children}</main>
        <AdminFooter />
      </div>
    </div>
  );
}
