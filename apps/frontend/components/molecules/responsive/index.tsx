"use client";

import useMediaQuery from "@/hooks/use-media-query";

export function DesktopRenderOnly({ children }: { children: React.ReactNode }) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (!isDesktop) return null;

  return children;
}

export function RenderOnMobile({ children }: { children: React.ReactNode }) {
  const isMobile = useMediaQuery("(max-width: 767px)");

  if (!isMobile) return null;

  return children;
}
