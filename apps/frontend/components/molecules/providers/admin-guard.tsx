"use client";

import LoadingPage from "@/app/loading";
import { useAuthStore } from "@/hooks/auth/use-auth-store";
import { EDefaultRoleName } from "@ecommerce/shared";
import { notFound } from "next/navigation";
import { ReactNode } from "react";

export interface AdminGuardProps {
  children: ReactNode;
}

export const AdminGuard = ({ children }: AdminGuardProps) => {
  const user = useAuthStore((s) => s.user);

  const isHydrate = useAuthStore((s) => s.hasHydrated);
  const isAdmin = user?.roleName === EDefaultRoleName.ADMIN;

  if (!isAdmin && isHydrate) {
    return notFound();
  }

  if (!isHydrate) return <LoadingPage />;

  return children;
};
