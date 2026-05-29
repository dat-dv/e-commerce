"use client";

import { useState } from "react";

import { useIntersectionObserver } from "../../../hooks/use-intersection-observer";
import { ILazySectionProps } from "./lazy-section.types";

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

LazySection.displayName = "LazySection";

export default LazySection;
