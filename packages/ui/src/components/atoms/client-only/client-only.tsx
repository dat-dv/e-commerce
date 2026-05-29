"use client";

import { useEffect, useState } from "react";

import { type IClientOnlyProps } from "./client-only.types";

export default function ClientOnly({
  children,
  fallback = null,
}: IClientOnlyProps) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

ClientOnly.displayName = "ClientOnly";
