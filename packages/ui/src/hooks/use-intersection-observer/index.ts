"use client";

import { useEffect, useRef, useState } from "react";

export interface UseIntersectionObserverProps extends IntersectionObserverInit {
  freezeOnceVisible?: boolean;
}

/**
 * Custom hook to detect when an element is visible in the viewport using IntersectionObserver.
 *
 * @param options - Config options including threshold, root, rootMargin, and freezeOnceVisible.
 * @returns A tuple containing a ref callback to attach to the element, and a boolean indicating if it is intersecting.
 */
export function useIntersectionObserver<T extends Element = Element>({
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
    const node = elementRef.current;
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
