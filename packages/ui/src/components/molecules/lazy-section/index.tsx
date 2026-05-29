"use client";

import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { ReactNode, useState } from "react";

interface ILazySectionProps {
  children: ReactNode;
  placeholder?: ReactNode;
  rootMargin?: string;
  threshold?: number;
  className?: string;
}

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
