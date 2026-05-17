"use client";

import { useEffect, useRef, useState } from "react";

export interface UseIntersectionObserverProps extends IntersectionObserverInit {
  freezeOnceVisible?: boolean;
}

/**
 * useIntersectionObserver detects when a target DOM node enters or exits the browser viewport.
 * It uses the highly performant browser IntersectionObserver API to avoid scrolling event overhead.
 *
 * @param options configuration for thresholds, margins, and visibility freezing behavior
 * @returns a tuple containing the element ref callback and a boolean indicating intersection state
 */
export function useIntersectionObserver<T = Element>({
  threshold = 0.1,
  root = null,
  rootMargin = "200px",
  freezeOnceVisible = true,
}: UseIntersectionObserverProps = {}) {
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const elementRef = useRef<T | null>(null);
  const frozen = entry?.isIntersecting && freezeOnceVisible;

  const updateEntry = ([newEvent]: IntersectionObserverEntry[]): void => {
    setEntry(newEvent);
  };

  useEffect(() => {
    const node = elementRef.current as unknown as Element;
    const hasIOSupport =
      typeof window !== "undefined" && !!window.IntersectionObserver;

    if (!hasIOSupport || frozen || !node) return;

    const observerParams = { threshold, root, rootMargin };
    const observer = new IntersectionObserver(updateEntry, observerParams);

    observer.observe(node);

    return () => observer.disconnect();
  }, [threshold, root, rootMargin, frozen]);

  return [elementRef, entry?.isIntersecting ?? false] as const;
}

export default useIntersectionObserver;
