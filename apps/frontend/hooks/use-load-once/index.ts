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

    let active = true;

    const run = async () => {
      try {
        setLoading(true);

        await loader();
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void run();

    return () => {
      active = false;
    };
  }, [enabled, loader]);

  return { loading };
};
