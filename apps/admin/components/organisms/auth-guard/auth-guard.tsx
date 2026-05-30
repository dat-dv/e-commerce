"use client";

import { BasicLoading } from "@ecommerce/ui";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { adminAuthUseCase } from "@/domain/auth";
import { useAdminUserStore } from "@/store/user";

interface IAuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard = ({ children }: IAuthGuardProps) => {
  const router = useRouter();

  const user = useAdminUserStore((state) => state.user);
  const hasHydrated = useAdminUserStore((state) => state._hasHydrated);
  const setUser = useAdminUserStore((state) => state.setUser);
  const logout = useAdminUserStore((state) => state.logout);

  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    if (!hasHydrated) return;

    let ignore = false;

    const checkSession = async () => {
      try {
        const response = await adminAuthUseCase.fetchMe.execute();

        if (ignore) return;

        if (response.status !== "success" || !response.data) {
          throw new Error("Session verification failed");
        }

        setUser(response.data);
      } catch {
        if (ignore) return;

        logout();
        router.replace("/sign-in");
      } finally {
        if (!ignore) {
          setIsCheckingSession(false);
        }
      }
    };

    checkSession();

    return () => {
      ignore = true;
    };
  }, [hasHydrated, router, setUser, logout]);

  if (!hasHydrated || isCheckingSession) {
    return <BasicLoading />;
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
};

AuthGuard.displayName = "AuthGuard";
