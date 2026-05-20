"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

type QueryPrimitive = string | number | boolean | object;
type QueryValue = QueryPrimitive | null | undefined | QueryPrimitive[];
type QueryParams = Record<string, QueryValue>;

type ParamsObject = Record<string, string | string[]>;

type NavigateParams = {
  pathname?: string;
} & QueryParams;

type UseAppRouterOptions<T extends Record<string, unknown>> = {
  updateUrl?: boolean;
  defaultParams?: Partial<T>;
  syncUrlParams?: string;
};

export default function useAppRouter<T extends Record<string, unknown>>({
  updateUrl = false,
  defaultParams,
  syncUrlParams,
}: UseAppRouterOptions<T> = {}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const nextRouter = useRouter();

  const [routerState, setRouterState] = useState<T>(() => {
    return {
      ...(defaultParams ?? {}),
      ...Object.fromEntries(searchParams.entries()),
    } as T;
  });

  const buildParamsObject = useCallback(
    (query: QueryParams = {}) => {
      const nextState = {
        ...routerState,
        ...query,
      };

      return Object.entries(nextState).reduce<ParamsObject>(
        (acc, [key, value]) => {
          if (
            value === null ||
            value === undefined ||
            value === "" ||
            (Array.isArray(value) && value.length === 0)
          ) {
            return acc;
          }

          if (Array.isArray(value)) {
            acc[key] = value.map(String);
            return acc;
          }

          acc[key] = String(value);
          return acc;
        },
        {},
      );
    },
    [routerState],
  );

  const buildQueryString = useCallback((paramsObject: ParamsObject) => {
    const search = new URLSearchParams();

    Object.entries(paramsObject).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item) => {
          search.append(key, item);
        });

        return;
      }

      search.set(key, value);
    });

    return search.toString();
  }, []);

  const buildUrl = useCallback(
    ({ pathname: nextPathname, ...query }: NavigateParams) => {
      const paramsObject = buildParamsObject(query);
      const queryString = buildQueryString(paramsObject);
      const finalPathname = nextPathname?.trim() || syncUrlParams || pathname;

      return {
        url: queryString ? `${finalPathname}?${queryString}` : finalPathname,
        paramsObject,
        pathname: finalPathname,
      };
    },
    [buildParamsObject, buildQueryString, syncUrlParams, pathname],
  );

  const isSamePathname = useCallback(
    (nextPathname?: string) => {
      const targetPathname = nextPathname?.trim() || syncUrlParams || pathname;
      return targetPathname === pathname;
    },
    [syncUrlParams, pathname],
  );

  const push = useCallback(
    (params: NavigateParams) => {
      const result = buildUrl(params);

      setRouterState(result.paramsObject as T);

      if (!updateUrl) return;

      if (isSamePathname(params.pathname)) {
        window.history.pushState(null, "", result.url);
        return;
      }

      nextRouter.push(result.url);
    },
    [buildUrl, isSamePathname, nextRouter, updateUrl],
  );

  const replace = useCallback(
    (params: NavigateParams) => {
      const result = buildUrl(params);

      setRouterState(result.paramsObject as T);

      if (!updateUrl) return;

      if (isSamePathname(params.pathname)) {
        window.history.replaceState(null, "", result.url);
        return;
      }

      nextRouter.replace(result.url);
    },
    [buildUrl, isSamePathname, nextRouter, updateUrl],
  );

  const clear = useCallback(
    (keep: Record<string, boolean> = {}) => {
      const nextState = Object.entries(routerState).reduce<QueryParams>(
        (acc, [key, value]) => {
          acc[key] = keep[key] ? (value as QueryValue) : null;
          return acc;
        },
        {},
      );

      replace(nextState as NavigateParams);
    },
    [replace, routerState],
  );

  return {
    pathname,
    routerState,
    push,
    replace,
    clear,
  };
}
