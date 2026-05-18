"use client";

import { useCallback, useMemo, useState } from "react";

export const useBrandsFilter = ({
  search = "",
  page,
  limit,
  ...otherParams
}: {
  search?: string;
  page: number;
  limit: number;
  [key: string]: unknown;
}) => {
  const [searchValue, setSearchValue] = useState(search);
  const [submittedSearch, setSubmittedSearch] = useState(search);

  const updateUrl = useCallback((value: string) => {
    const params = new URLSearchParams(window.location.search);
    const trimmed = value.trim();

    if (trimmed) params.set("q", trimmed);
    else params.delete("q");

    params.delete("page");

    const nextUrl = params.toString()
      ? `${window.location.pathname}?${params.toString()}`
      : window.location.pathname;

    window.history.replaceState(null, "", nextUrl);
  }, []);

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchValue(value);
      updateUrl(value);
    },
    [updateUrl],
  );

  const handleSearchSubmit = useCallback(
    (value = searchValue) => {
      const trimmed = value.trim();

      setSubmittedSearch(trimmed);
      updateUrl(trimmed);
    },
    [searchValue, updateUrl],
  );

  const updateParams = useCallback(
    (updates: Record<string, string | number | boolean | null | undefined>) => {
      const params = new URLSearchParams(window.location.search);

      Object.entries(updates).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });

      const nextUrl = params.toString()
        ? `${window.location.pathname}?${params.toString()}`
        : window.location.pathname;

      window.history.replaceState(null, "", nextUrl);
    },
    [],
  );

  const params = useMemo(
    () => ({
      ...otherParams,
      page,
      limit,
      search: submittedSearch || undefined,
    }),
    [page, limit, submittedSearch, otherParams],
  );

  return {
    searchValue,
    setSearchValue: handleSearchChange,
    submittedSearch,
    handleSearchSubmit,
    params,
    updateParams,
  };
};
