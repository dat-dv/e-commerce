"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { APP_ROUTES } from "@/constants/routes";
import { AdminUserRepository } from "@/domain/user";
import type { IAdminUser } from "@/domain/user/types/user.model";
import usePagination from "@/hooks/use-pagination";

export const useCustomersView = () => {
  const router = useRouter();
  const userRepository = useMemo(() => new AdminUserRepository(), []);

  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { data, loading, onChangePagination } = usePagination<IAdminUser>({
    initialData: null,
    isSyncWithSearchParams: false,
    fetchPage: async (params) => {
      setError(null);
      try {
        const response = await userRepository.getUsers(
          params.page ?? 1,
          params.limit ?? 10,
        );
        return {
          data: {
            items: response.items,
            meta: response.meta,
          },
          message: null,
          timestamp: new Date().toISOString(),
          status: "success",
        };
      } catch (err: unknown) {
        console.error(err);
        setError("Failed to fetch customer data. Please try again.");
        throw err;
      }
    },
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onChangePagination(1);
  };

  const handleViewDetail = (user: IAdminUser) => {
    router.push(APP_ROUTES.CUSTOMER_DETAIL(user.id));
  };

  // Client-side filtering as a fallback and extra responsiveness
  const filteredUsers = useMemo(() => {
    if (!searchQuery) return data.items;
    const lowerQuery = searchQuery.toLowerCase();
    return data.items.filter(
      (u) =>
        u.email.toLowerCase().includes(lowerQuery) ||
        `${u.firstName} ${u.lastName}`.toLowerCase().includes(lowerQuery),
    );
  }, [data.items, searchQuery]);

  return {
    users: data.items,
    loading,
    error,
    searchQuery,
    page: data.meta.page,
    limit: data.meta.limit,
    total: data.meta.total,
    totalPages: data.meta.totalPages,
    filteredUsers,
    setPage: onChangePagination,
    handleSearch,
    handleViewDetail,
  };
};
