"use client";

import { BasicLoading } from "@ecommerce/ui";
import React from "react";

import { useAuthGuard } from "./use-auth-guard";

interface IAuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard = ({ children }: IAuthGuardProps) => {
  const { hasHydrated, isCheckingSession, isPublicPath, user } = useAuthGuard();

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

  return <>{children}</>;
};

AuthGuard.displayName = "AuthGuard";
