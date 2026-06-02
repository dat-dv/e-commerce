"use client";

import { BasicLoading } from "@ecommerce/ui";
import React from "react";

import { useAuthGuard } from "@/hooks/auth/use-auth-guard";

interface IAuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard = ({ children }: IAuthGuardProps) => {
  const { hasHydrated, isCheckingSession, isForbidden, isPublicPath, user } =
    useAuthGuard();

  if (!hasHydrated || isCheckingSession) {
    return <BasicLoading isBlur={false} />;
  }

  // Render children on public pages even if there is no user
  if (isPublicPath && !user) {
    return <>{children}</>;
  }

  // Block protected pages if there is no user
  if (!user) {
    return null;
  }

  if (isForbidden) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--app-bg)] px-4">
        <div className="w-full max-w-md rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-6 text-center shadow-xl">
          <p className="text-sm font-semibold text-[var(--app-text)]">
            You do not have permission to access this admin page.
          </p>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Ask an administrator to grant the required role permissions.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

AuthGuard.displayName = "AuthGuard";
