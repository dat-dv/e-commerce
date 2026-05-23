"use client";

import useMediaQuery from "@/hooks/use-media-query";

const BREAKPOINTS = {
  tablet: 768,
  desktop: 1024,
};

interface ResponsiveRenderProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  fallbackClassName?: string;
  query: string;

  /**
   * true: khi media query chưa resolve thì dùng chính children làm fallback.
   * false: dùng fallback truyền vào.
   */
  isFallbackChildren?: boolean;
}

function ResponsiveRender({
  children,
  fallback = null,
  fallbackClassName,
  query,
  isFallbackChildren = false,
}: ResponsiveRenderProps) {
  const matches = useMediaQuery(query);

  if (matches === undefined) {
    const fallbackNode = isFallbackChildren ? children : fallback;

    if (fallbackNode === null || fallbackNode === undefined) return null;

    return <div className={fallbackClassName}>{fallbackNode}</div>;
  }

  if (matches !== true) return null;

  return children;
}

export function RenderDesktopOnly({
  children,
  fallback,
  isFallbackChildren = true,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  isFallbackChildren?: boolean;
}) {
  return (
    <ResponsiveRender
      fallback={fallback}
      fallbackClassName="hidden lg:block"
      query={`(min-width: ${BREAKPOINTS.desktop}px)`}
      isFallbackChildren={isFallbackChildren}
    >
      {children}
    </ResponsiveRender>
  );
}

export function RenderTabletAndAbove({
  children,
  fallback,
  isFallbackChildren = true,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  isFallbackChildren?: boolean;
}) {
  return (
    <ResponsiveRender
      fallback={fallback}
      fallbackClassName="hidden md:block"
      query={`(min-width: ${BREAKPOINTS.tablet}px)`}
      isFallbackChildren={isFallbackChildren}
    >
      {children}
    </ResponsiveRender>
  );
}

export function RenderTabletOnly({
  children,
  fallback,
  isFallbackChildren = true,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  isFallbackChildren?: boolean;
}) {
  return (
    <ResponsiveRender
      fallback={fallback}
      fallbackClassName="hidden md:block lg:hidden"
      query={`(min-width: ${BREAKPOINTS.tablet}px) and (max-width: ${
        BREAKPOINTS.desktop - 1
      }px)`}
      isFallbackChildren={isFallbackChildren}
    >
      {children}
    </ResponsiveRender>
  );
}

export function RenderTabletAndBelow({
  children,
  fallback,
  isFallbackChildren = true,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  isFallbackChildren?: boolean;
}) {
  return (
    <ResponsiveRender
      fallback={fallback}
      fallbackClassName="lg:hidden"
      query={`(max-width: ${BREAKPOINTS.desktop - 1}px)`}
      isFallbackChildren={isFallbackChildren}
    >
      {children}
    </ResponsiveRender>
  );
}

export function RenderMobileOnly({
  children,
  fallback,
  isFallbackChildren = true,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  isFallbackChildren?: boolean;
}) {
  return (
    <ResponsiveRender
      fallback={fallback}
      fallbackClassName="md:hidden"
      query={`(max-width: ${BREAKPOINTS.tablet - 1}px)`}
      isFallbackChildren={isFallbackChildren}
    >
      {children}
    </ResponsiveRender>
  );
}
