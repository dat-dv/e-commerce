"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useCallback, useTransition, useEffect } from "react";

export const useBrandsFilter = (initialSearchQuery: string = "") => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(initialSearchQuery);
  const [isPending, startTransition] = useTransition();

  // Sync state if initialSearchQuery prop changes (e.g. back navigation)
  useEffect(() => {
    if (initialSearchQuery !== searchValue) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSearchValue(initialSearchQuery);
    }
  }, [initialSearchQuery, searchValue]);

  // Handle instant, silent URL query parameter update on every keystroke
  const handleSearchChange = useCallback((value: string) => {
    setSearchValue(value);

    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const trimmed = value.trim();
    if (trimmed) {
      params.set("q", trimmed);
    } else {
      params.delete("q");
    }

    const nextUrl = params.toString()
      ? `${window.location.pathname}?${params.toString()}`
      : window.location.pathname;

    window.history.replaceState(null, "", nextUrl);
  }, []);

  const handleSearchSubmit = useCallback(
    (value: string) => {
      const params = new URLSearchParams(window.location.search);
      const trimmed = value.trim();
      if (trimmed) {
        params.set("q", trimmed);
      } else {
        params.delete("q");
      }

      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
      });
    },
    [pathname, router],
  );

  return {
    searchValue,
    setSearchValue: handleSearchChange,
    handleSearchSubmit,
    isPending,
  };
};
