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
}

function ResponsiveRender({
  children,
  fallback = null,
  fallbackClassName,
  query,
}: ResponsiveRenderProps) {
  const matches = useMediaQuery(query);

  if (matches === undefined) {
    if (fallback === null || fallback === undefined) return null;

    return <div className={fallbackClassName}>{fallback}</div>;
  }

  if (matches !== true) return null;

  return children;
}

export function RenderDesktopOnly({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  return (
    <ResponsiveRender
      fallback={fallback}
      fallbackClassName="hidden lg:block"
      query={`(min-width: ${BREAKPOINTS.desktop}px)`}
    >
      {children}
    </ResponsiveRender>
  );
}

export function RenderTabletAndAbove({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  return (
    <ResponsiveRender
      fallback={fallback}
      fallbackClassName="hidden md:block"
      query={`(min-width: ${BREAKPOINTS.tablet}px)`}
    >
      {children}
    </ResponsiveRender>
  );
}

export function RenderTabletOnly({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  return (
    <ResponsiveRender
      fallback={fallback}
      fallbackClassName="hidden md:block lg:hidden"
      query={`(min-width: ${BREAKPOINTS.tablet}px) and (max-width: ${BREAKPOINTS.desktop - 1}px)`}
    >
      {children}
    </ResponsiveRender>
  );
}

export function RenderTabletAndBelow({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  return (
    <ResponsiveRender
      fallback={fallback}
      fallbackClassName="lg:hidden"
      query={`(max-width: ${BREAKPOINTS.desktop - 1}px)`}
    >
      {children}
    </ResponsiveRender>
  );
}

export function RenderMobileOnly({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  return (
    <ResponsiveRender
      fallback={fallback}
      fallbackClassName="md:hidden"
      query={`(max-width: ${BREAKPOINTS.tablet - 1}px)`}
    >
      {children}
    </ResponsiveRender>
  );
}
