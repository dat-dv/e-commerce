"use client";

import type { PaginationQueryParams } from "@ecommerce/ui";
import { useMemo, useState } from "react";

import { CUSTOMER_DEFAULT_SORT } from "@/constants/customer.constants";
import type { IAdminUser } from "@/domain/user/types/user.model";
import type { PaginationFilterChange } from "@/hooks/use-pagination/use-pagination.types";

export type ICustomerFilterPaginationParams = PaginationQueryParams & {
  roleId?: string;
  gender?: string;
  sortBy?: string;
};

type CustomerFilterChange = (
  filters: PaginationFilterChange<ICustomerFilterPaginationParams>[],
) => Promise<void> | void;

interface IUseCustomerFiltersParams {
  users: IAdminUser[];
  onChangeFilter: CustomerFilterChange;
}

export const useCustomerFilters = ({
  users,
  onChangeFilter,
}: IUseCustomerFiltersParams) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [genderFilter, setGenderFilter] = useState<string>("");
  const [sortFilter, setSortFilter] = useState<string>(CUSTOMER_DEFAULT_SORT);

  const uniqueRoles = useMemo(() => {
    const rolesMap = new Map<string, string>();
    users.forEach((user) => {
      if (user.role && user.roleId) {
        rolesMap.set(user.roleId, user.role.roleName);
      }
    });

    return Array.from(rolesMap.entries()).map(([value, label]) => ({
      value,
      label,
    }));
  }, [users]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onChangeFilter([{ key: "search", value: query }]);
  };

  return {
    searchQuery,
    roleFilter,
    setRoleFilter,
    genderFilter,
    setGenderFilter,
    sortFilter,
    setSortFilter,
    uniqueRoles,
    handleSearch,
  };
};
