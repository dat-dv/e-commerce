"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { getNewUrlBySearchParams } from "@/utils/url";
import type { UseAppRouterOptions } from "./use-app-router.types";

export default function useAppRouter<T extends Record<string, unknown>>({
  extendParams,
}: UseAppRouterOptions<T> = {}) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [routerState, setRouterState] = useState<T>(() => {
    return {
      ...(extendParams ?? {}),
      ...Object.fromEntries(searchParams.entries()),
    } as T;
  });

  useEffect(() => {
    const mergeSearchParms = () => {
      const currentSearchParams = Object.fromEntries(searchParams.entries());
      const newRouterState = {
        ...routerState,
        ...currentSearchParams,
      } as T;

      setRouterState(newRouterState);
    };
    mergeSearchParms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const push = useCallback(
    (
      params: Partial<T>,
      options: { merge: boolean; ssr: boolean; scroll?: boolean },
    ) => {
      const searchParams = options?.merge
        ? { ...routerState, ...params }
        : params;
      const url = getNewUrlBySearchParams(searchParams);

      if (!options?.ssr) {
        setRouterState(searchParams as T);
        window.history.replaceState(null, "", url);
        return;
      }
      router.push(url, { scroll: options?.scroll });
    },
    [routerState, router],
  );

  const replace = useCallback(
    (
      params: Partial<T>,
      options: { merge: boolean; ssr: boolean; scroll?: boolean },
    ) => {
      const searchParams = options?.merge
        ? { ...routerState, ...params }
        : params;
      const url = getNewUrlBySearchParams(searchParams);

      if (options?.ssr) {
        setRouterState(searchParams as T);
        window.history.replaceState(null, "", url);
        return;
      }
      router.replace(url, { scroll: options?.scroll });
    },
    [routerState, router],
  );

  const clear = useCallback(
    (
      options = {
        merge: false,
        ssr: true,
        scroll: false,
      },
    ) => {
      replace(extendParams as T, options);
    },
    [replace, extendParams],
  );

  return {
    routerState,
    push,
    replace,
    clear,
    setRouterState,
  };
}
