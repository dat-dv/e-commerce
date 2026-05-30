"use client";

import { useMediaQuery } from "../../../hooks/use-media-query";
import { cn } from "../../../utils/cn";
import type {
  IResponsiveOnlyProps,
  IResponsiveRenderProps,
} from "./responsive.types";

export const BREAKPOINTS = {
  tablet: 768,
  desktop: 1024,
} as const;

export function ResponsiveRender({
  children,
  fallback = null,
  fallbackClassName,
  query,
  isFallbackChildren = true,
}: IResponsiveRenderProps) {
  const matches = useMediaQuery(query);

  if (matches === undefined) {
    const initialNode = isFallbackChildren ? children : fallback;

    if (initialNode === null || initialNode === undefined) return null;

    return <div className={fallbackClassName}>{initialNode}</div>;
  }

  if (!matches) return null;

  return children;
}

export function RenderDesktopOnly({
  children,
  fallback,
  isFallbackChildren = true,
  fallbackClassName,
}: IResponsiveOnlyProps) {
  return (
    <ResponsiveRender
      fallback={fallback}
      fallbackClassName={cn("hidden lg:block", fallbackClassName)}
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
  fallbackClassName,
}: IResponsiveOnlyProps) {
  return (
    <ResponsiveRender
      fallback={fallback}
      fallbackClassName={cn("hidden md:block", fallbackClassName)}
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
  fallbackClassName,
}: IResponsiveOnlyProps) {
  return (
    <ResponsiveRender
      fallback={fallback}
      fallbackClassName={cn("hidden md:block lg:hidden", fallbackClassName)}
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
  fallbackClassName,
}: IResponsiveOnlyProps) {
  return (
    <ResponsiveRender
      fallback={fallback}
      fallbackClassName={cn("lg:hidden", fallbackClassName)}
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
  fallbackClassName,
}: IResponsiveOnlyProps) {
  return (
    <ResponsiveRender
      fallback={fallback}
      fallbackClassName={cn("md:hidden", fallbackClassName)}
      query={`(max-width: ${BREAKPOINTS.tablet - 1}px)`}
      isFallbackChildren={isFallbackChildren}
    >
      {children}
    </ResponsiveRender>
  );
}

ResponsiveRender.displayName = "ResponsiveRender";
RenderDesktopOnly.displayName = "RenderDesktopOnly";
RenderTabletAndAbove.displayName = "RenderTabletAndAbove";
RenderTabletOnly.displayName = "RenderTabletOnly";
RenderTabletAndBelow.displayName = "RenderTabletAndBelow";
RenderMobileOnly.displayName = "RenderMobileOnly";
