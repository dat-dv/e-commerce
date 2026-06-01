"use client";

import type { PaginationQueryParams } from "@ecommerce/ui";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { APP_ROUTES } from "@/constants/routes";
import { AdminUserRepository } from "@/domain/user";
import type { IAdminUser } from "@/domain/user/types/user.model";
import usePagination from "@/hooks/use-pagination";

export type ICustomersViewPaginationParams = PaginationQueryParams & {
  roleId?: string;
  gender?: string;
  sortBy?: string;
};

export const useCustomersView = () => {
  const router = useRouter();
  const userRepository = useMemo(() => new AdminUserRepository(), []);

  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [genderFilter, setGenderFilter] = useState<string>("");
  const [sortFilter, setSortFilter] = useState<string>("created_at:desc");

  const { data, loading, onChangePagination, onChangeFilter } = usePagination<
    IAdminUser,
    ICustomersViewPaginationParams
  >({
    initialData: null,
    isSyncWithSearchParams: false,
    fetchPage: async (params) => {
      setError(null);
      try {
        const response = await userRepository.getUsers({
          page: params.page ?? 1,
          limit: params.limit ?? 10,
          search: params.search,
          roleId: params.roleId as string | undefined,
          gender: params.gender as string | undefined,
          sortBy: params.sortBy as string | undefined,
        });
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
    onChangeFilter([{ key: "search", value: query }]);
  };
  const uniqueRoles = useMemo(() => {
    const rolesMap = new Map<string, string>();
    data.items.forEach((u) => {
      if (u.role) rolesMap.set(u.roleId, u.role.roleName);
    });
    return Array.from(rolesMap.entries()).map(([value, label]) => ({
      value,
      label,
    }));
  }, [data.items]);

  const handleViewDetail = (user: IAdminUser) => {
    router.push(APP_ROUTES.CUSTOMER_DETAIL(user.id));
  };

  const filteredUsers = data.items;

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
    uniqueRoles,
    roleFilter,
    setRoleFilter,
    genderFilter,
    setGenderFilter,
    sortFilter,
    setSortFilter,
    setPage: onChangePagination,
    onChangeFilter,
    handleSearch,
    handleViewDetail,
  };
};
