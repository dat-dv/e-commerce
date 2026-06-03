"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import type {
  AppRouterNavigateOptions,
  QueryParams,
  UseAppRouterOptions,
} from "./use-app-router.types";

const DEFAULT_NAVIGATE_OPTIONS: AppRouterNavigateOptions = {
  merge: true,
  scroll: false,
};

const createUrlBySearchParams = (searchParams: QueryParams) => {
  const params = new URLSearchParams();

  Object.entries(searchParams).forEach(([key, value]) => {
    if (
      value === null ||
      value === undefined ||
      value === "" ||
      (Array.isArray(value) && value.length === 0)
    ) {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((item) => {
        params.append(key, String(item));
      });

      return;
    }

    params.set(key, String(value));
  });

  const queryString = params.toString();
  return queryString
    ? `${window.location.pathname}?${queryString}`
    : window.location.pathname;
};

export default function useAppRouter<T extends QueryParams>({
  isSyncWithSearchParams = true,
  extendParams,
}: UseAppRouterOptions<T> = {}) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [routerState, setRouterState] = useState<T>(() => {
    return {
      ...(extendParams ?? {}),
      ...(isSyncWithSearchParams
        ? Object.fromEntries(searchParams.entries())
        : {}),
    } as T;
  });

  useEffect(() => {
    if (!isSyncWithSearchParams) return;

    const mergeSearchParms = () => {
      const currentSearchParams = Object.fromEntries(searchParams.entries());
      const newRouterState = {
        ...(extendParams ?? {}),
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
      options: AppRouterNavigateOptions = DEFAULT_NAVIGATE_OPTIONS,
    ) => {
      const navigateOptions = { ...DEFAULT_NAVIGATE_OPTIONS, ...options };
      const searchParams = navigateOptions.merge
        ? { ...routerState, ...params }
        : params;
      const url = createUrlBySearchParams(searchParams);

      setRouterState(searchParams as T);
      if (!isSyncWithSearchParams) {
        return;
      }
      router.push(url, { scroll: navigateOptions.scroll });
    },
    [isSyncWithSearchParams, routerState, router],
  );

  const replace = useCallback(
    (
      params: Partial<T>,
      options: AppRouterNavigateOptions = DEFAULT_NAVIGATE_OPTIONS,
    ) => {
      const navigateOptions = { ...DEFAULT_NAVIGATE_OPTIONS, ...options };
      const searchParams = navigateOptions.merge
        ? { ...routerState, ...params }
        : params;
      const url = createUrlBySearchParams(searchParams);

      setRouterState(searchParams as T);
      if (!isSyncWithSearchParams) {
        return;
      }
      router.replace(url, { scroll: navigateOptions.scroll });
    },
    [isSyncWithSearchParams, routerState, router],
  );

  const clear = useCallback(
    (
      options: AppRouterNavigateOptions = {
        ...DEFAULT_NAVIGATE_OPTIONS,
        merge: false,
      },
    ) => {
      replace((extendParams ?? {}) as Partial<T>, options);
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
