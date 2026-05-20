"use client";

import useMediaQuery from "@/hooks/use-media-query";

const BREAKPOINTS = {
  tablet: 768,
  desktop: 1024,
};

interface ResponsiveRenderProps {
  children: React.ReactNode;
  query: string;
}

function ResponsiveRender({ children, query }: ResponsiveRenderProps) {
  const matches = useMediaQuery(query);

  if (!matches) return null;

  return children;
}

export function RenderDesktopOnly({ children }: { children: React.ReactNode }) {
  return (
    <ResponsiveRender query={`(min-width: ${BREAKPOINTS.desktop}px)`}>
      {children}
    </ResponsiveRender>
  );
}

export function RenderTabletAbove({ children }: { children: React.ReactNode }) {
  return (
    <ResponsiveRender query={`(min-width: ${BREAKPOINTS.tablet}px)`}>
      {children}
    </ResponsiveRender>
  );
}

export function RenderTabletOnly({ children }: { children: React.ReactNode }) {
  return (
    <ResponsiveRender
      query={`(min-width: ${BREAKPOINTS.tablet}px) and (max-width: ${BREAKPOINTS.desktop - 1}px)`}
    >
      {children}
    </ResponsiveRender>
  );
}

export function RenderTabletBelow({ children }: { children: React.ReactNode }) {
  return (
    <ResponsiveRender query={`(max-width: ${BREAKPOINTS.desktop - 1}px)`}>
      {children}
    </ResponsiveRender>
  );
}

export function RenderMobileOnly({ children }: { children: React.ReactNode }) {
  return (
    <ResponsiveRender query={`(max-width: ${BREAKPOINTS.tablet - 1}px)`}>
      {children}
    </ResponsiveRender>
  );
}
