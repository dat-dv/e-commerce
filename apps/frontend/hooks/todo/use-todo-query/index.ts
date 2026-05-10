"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { useShallow } from "zustand/react/shallow";

import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@/config/pagination.confg";
import { ETodoFilter } from "@/domain/todo/model/todo.model";

import { useTodoFetch } from "../use-todo-fetch";
import { useTodoStore } from "../use-todo-store";

export const todoQueryDefaults = {
  page: DEFAULT_PAGE,
  pageSize: DEFAULT_PAGE_SIZE,
  filter: ETodoFilter.ALL,
};

export const useTodoQuery = () => {
  const router = useRouter();
  const pathname = usePathname();

  const {
    page,
    pageSize,
    filter,
    setStorePage,
    setStorePageSize,
    setStoreFilter,
  } = useTodoStore(
    useShallow((s) => ({
      page: s.page,
      pageSize: s.pageSize,
      filter: s.filter,
      setStorePage: s.setPage,
      setStorePageSize: s.setPageSize,
      setStoreFilter: s.setFilter,
    })),
  );
  const { fetchTodos } = useTodoFetch();

  const setFilter = useCallback(
    (newFilter: ETodoFilter) => {
      if (newFilter === filter) return;

      const params = new URLSearchParams(window.location.search);
      if (newFilter === todoQueryDefaults.filter) {
        params.delete("filter");
      } else {
        params.set("filter", String(newFilter));
      }
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`, { scroll: false });

      setStoreFilter(newFilter);
      setStorePage(1);
      fetchTodos(newFilter, 1, pageSize);
    },
    [
      filter,
      pathname,
      router,
      setStoreFilter,
      setStorePage,
      fetchTodos,
      pageSize,
    ],
  );

  const setPage = useCallback(
    (newPage: number) => {
      if (newPage === page) return;

      const params = new URLSearchParams(window.location.search);
      if (newPage <= todoQueryDefaults.page) {
        params.delete("page");
      } else {
        params.set("page", newPage.toString());
      }
      router.push(`${pathname}?${params.toString()}`, { scroll: false });

      setStorePage(newPage);
      fetchTodos(filter, newPage, pageSize);
    },
    [page, pathname, router, setStorePage, filter, pageSize, fetchTodos],
  );

  const setPageSize = useCallback(
    (newPageSize: number) => {
      if (newPageSize === pageSize) return;

      const params = new URLSearchParams(window.location.search);
      if (newPageSize === todoQueryDefaults.pageSize) {
        params.delete("pageSize");
      } else {
        params.set("pageSize", newPageSize.toString());
      }
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`, { scroll: false });

      setStorePageSize(newPageSize);
      setStorePage(1);
      fetchTodos(filter, 1, newPageSize);
    },
    [
      pageSize,
      pathname,
      router,
      setStorePageSize,
      setStorePage,
      filter,
      fetchTodos,
    ],
  );

  return useMemo(
    () => ({
      page,
      pageSize,
      filter,
      setFilter,
      setPage,
      setPageSize,
    }),
    [page, pageSize, filter, setFilter, setPage, setPageSize],
  );
};
