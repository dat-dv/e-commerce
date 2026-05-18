"use client";

import { AdminGuard } from "@/components/molecules/providers/admin-guard";
import { ReactNode } from "react";

interface AdminLayoutProps {
  children: ReactNode;
}

/**
 * Layout specifically for administrative pages.
 * Why: Ensures that all pages nested under /admin are strictly protected by AdminGuard.
 */
export default function AdminLayout({ children }: AdminLayoutProps) {
  return <AdminGuard>{children}</AdminGuard>;
}
