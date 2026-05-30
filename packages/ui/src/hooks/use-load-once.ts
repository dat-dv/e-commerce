"use client";

import { useEffect, useRef, useState } from "react";

export const useLoadOnce = (
  loader: () => Promise<void> | void,
  enabled = true,
) => {
  const loadedRef = useRef(false);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    if (loadedRef.current) return;

    loadedRef.current = true;

    const run = async () => {
      try {
        setLoading(true);
        await loader();
      } finally {
        setLoading(false);
      }
    };

    void run();
  }, [enabled, loader]);

  return { loading };
};
