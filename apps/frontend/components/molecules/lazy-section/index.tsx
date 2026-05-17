"use client";

import React, { useState, ReactNode } from "react";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";

interface ILazySectionProps {
  children: ReactNode;
  placeholder?: ReactNode;
  rootMargin?: string;
  threshold?: number;
  className?: string;
}

/**
 * LazyProductSection is a generic viewport boundary wrapper.
 * Why: Decouples component fetching and resource loading from specific pages.
 * By wrapping any expensive component (like a product carousel, category grid, or maps)
 * inside LazyProductSection, we defer its mount/rendering lifecycle until it scrolls
 * close to the user's viewport.
 *
 * @example
 * <LazyProductSection placeholder={<CarouselSkeleton />}>
 *   <HeavyProductCarousel sectionId={id} />
 * </LazyProductSection>
 */
export const LazySection = ({
  children,
  placeholder = null,
  rootMargin = "250px",
  threshold = 0.05,
  className,
}: ILazySectionProps) => {
  const [hasIntersected, setHasIntersected] = useState(false);
  const [ref, isIntersecting] = useIntersectionObserver<HTMLDivElement>({
    rootMargin,
    threshold,
    freezeOnceVisible: true,
  });

  if (isIntersecting && !hasIntersected) {
    setHasIntersected(true);
  }

  return (
    <div ref={ref} className={className}>
      {hasIntersected ? children : placeholder}
    </div>
  );
};

export default LazySection;
