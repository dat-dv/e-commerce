"use client";

import { useAuthStore } from "@/hooks/auth/use-auth-store";

interface ProtectedSectionProps {
  children: React.ReactNode;
  fallbackChildren?: React.ReactNode;
}

const ProtectedSection = ({
  children,
  fallbackChildren,
}: ProtectedSectionProps) => {
  const userId = useAuthStore((store) => store.user?.id);
  // Trả về null hoặc skeleton cho đến khi hoàn thành hydration để tránh mismatch

  return userId ? children : fallbackChildren;
};

export default ProtectedSection;
