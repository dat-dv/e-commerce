"use client";

import { ReactNode, useState } from "react";

import { useIntersectionObserver } from "../../../hooks/use-intersection-observer";

export interface ILazySectionProps {
  children: ReactNode;
  placeholder?: ReactNode;
  rootMargin?: string;
  threshold?: number;
  className?: string;
}

/**
 * LazySection renders children lazily once it intersects with the viewport.
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
