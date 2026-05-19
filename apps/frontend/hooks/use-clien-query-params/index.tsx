"use client";

import { useCallback, useState } from "react";

type ExtraParams = Record<
  string,
  string | number | boolean | null | undefined | object
>;

interface TUseSearchParamsOptions<T extends ExtraParams> {
  pathname?: string;
  searchParams: T;
  mask?: boolean;
}

export const useClientSearchParams = <T extends ExtraParams>({
  pathname,
  searchParams,
  mask = true,
}: TUseSearchParamsOptions<T>) => {
  const [params, setParams] = useState<T>(() => searchParams);

  const navigate = useCallback(
    (nextParams: URLSearchParams) => {
      if (mask) return;
      const queryString = nextParams.toString();

      const nextUrl = queryString
        ? `${pathname || window.location.pathname}?${queryString}`
        : pathname;

      window.history.replaceState(null, "", nextUrl);
    },
    [pathname, mask],
  );

  const toURLSearchParams = useCallback((values: T) => {
    const next = new URLSearchParams();

    Object.entries(values).forEach(([key, value]) => {
      if (value === null || value === undefined || value === "") return;

      next.set(key, String(value));
    });

    return next;
  }, []);

  const update = useCallback(
    (values: Partial<T>) => {
      const current = toURLSearchParams(params);

      Object.entries(values).forEach(([key, value]) => {
        if (value === null || value === undefined || value === "") {
          current.delete(key);
        } else {
          current.set(key, String(value));
        }
      });

      navigate(current);
      setParams((prev) => ({ ...prev, ...values }));
    },
    [navigate, params, toURLSearchParams],
  );

  const clear = useCallback(
    (keep: Record<string, boolean> = {}) => {
      const keepKeys = Object.keys(keep);

      if (keepKeys.length === 0) {
        navigate(new URLSearchParams());
        setParams({} as T);
        return;
      }

      const next = new URLSearchParams();

      keepKeys.forEach((key) => {
        if (!keep[key]) return;

        const value = params[key];

        if (value !== null && value !== undefined && value !== "") {
          next.set(key, String(value));
        }
      });

      navigate(next);
      setParams((prev) => {
        const keptParams: ExtraParams = {};

        keepKeys.forEach((key) => {
          if (keep[key]) {
            keptParams[key] = prev[key];
          }
        });

        return keptParams as T;
      });
    },
    [navigate, params],
  );

  return {
    params,
    update,
    clear,
  };
};
