"use client";

import { BasicLoading } from "@ecommerce/ui";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { adminAuthUseCase } from "@/domain/auth";
import { useAdminUserStore } from "@/store/user";

interface IAuthGuardProps {
  children: React.ReactNode;
}

const PUBLIC_PATHS = ["/sign-in", "/forgot-password"];

export const AuthGuard = ({ children }: IAuthGuardProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const user = useAdminUserStore((state) => state.user);
  const hasHydrated = useAdminUserStore((state) => state._hasHydrated);
  const setUser = useAdminUserStore((state) => state.setUser);
  const logout = useAdminUserStore((state) => state.logout);

  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isSessionVerified, setIsSessionVerified] = useState(false);

  const isPublicPath = PUBLIC_PATHS.includes(pathname);

  useEffect(() => {
    if (!hasHydrated) return;

    // 1. If we are on a public path (like sign-in)
    if (isPublicPath) {
      if (user) {
        router.replace("/dashboard");
        return;
      }
      setIsCheckingSession(false);
      return;
    }

    // 2. If we are on a protected path and have no session/user locally
    if (!user) {
      router.replace("/sign-in");
      setIsCheckingSession(false);
      return;
    }

    // 3. If we already verified the session during this mount, skip API call
    if (isSessionVerified) {
      setIsCheckingSession(false);
      return;
    }

    // 4. Verify session in the background
    let ignore = false;

    const checkSession = async () => {
      try {
        const response = await adminAuthUseCase.fetchMe.execute();
        if (ignore) return;

        if (response.status !== "success" || !response.data) {
          throw new Error("Session verification failed");
        }
        setUser(response.data);
        setIsSessionVerified(true);
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
  }, [
    hasHydrated,
    pathname,
    user,
    isSessionVerified,
    router,
    setUser,
    logout,
    isPublicPath,
  ]);

  if (!hasHydrated || isCheckingSession) {
    return <BasicLoading />;
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
