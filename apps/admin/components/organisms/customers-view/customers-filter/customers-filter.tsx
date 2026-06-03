"use client";

import type { PaginationQueryParams } from "@ecommerce/ui";
import { Select } from "@ecommerce/ui";
import React from "react";

import { FilterBar } from "@/components/molecules/filter-bar";
import {
  CUSTOMER_DEFAULT_SORT,
  CUSTOMER_SORT_OPTIONS,
} from "@/constants/customer.constants";
import { GENDER_OPTIONS } from "@/constants/gender.constanst";
import type { PaginationFilterChange } from "@/hooks/use-pagination/use-pagination.types";

export interface ICustomersFilterProps {
  searchQuery: string;
  roleFilter: string;
  genderFilter: string;
  sortFilter: string;
  uniqueRoles: Array<{ label: string; value: string }>;
  onSearch: (query: string) => void;
  setRoleFilter: (val: string) => void;
  setGenderFilter: (val: string) => void;
  setSortFilter: (val: string) => void;
  onChangeFilter: (
    filters: PaginationFilterChange<PaginationQueryParams>[],
  ) => void;
}

export const CustomersFilter = ({
  searchQuery,
  roleFilter,
  genderFilter,
  sortFilter,
  uniqueRoles,
  onSearch,
  setRoleFilter,
  setGenderFilter,
  setSortFilter,
  onChangeFilter,
}: ICustomersFilterProps) => {
  return (
    <FilterBar
      searchQuery={searchQuery}
      onSearchQueryChange={onSearch}
      searchPlaceholder="Search customers by name or email..."
      showClearButton={
        !!searchQuery ||
        !!roleFilter ||
        !!genderFilter ||
        sortFilter !== CUSTOMER_DEFAULT_SORT
      }
      onClearFilters={() => {
        onSearch("");
        setRoleFilter("");
        setGenderFilter("");
        setSortFilter(CUSTOMER_DEFAULT_SORT);
        onChangeFilter([
          { key: "roleId", value: null },
          { key: "gender", value: null },
          { key: "sortBy", value: CUSTOMER_DEFAULT_SORT },
          { key: "search", value: null },
        ]);
      }}
    >
      <Select
        aria-label="Filter by Role"
        placeholder="All Roles"
        selectedKey={roleFilter}
        onSelectionChange={(k) => {
          const val = k as string;
          setRoleFilter(val);
          onChangeFilter([{ key: "roleId", value: val }]);
        }}
        options={[
          { label: "All Roles", value: "" },
          ...uniqueRoles,
          ...(uniqueRoles.length === 0
            ? [{ label: "User", value: "user" }]
            : []),
        ]}
        className="w-[140px]"
        size="sm"
      />
      <Select
        aria-label="Filter by Gender"
        placeholder="Any Gender"
        selectedKey={genderFilter}
        onSelectionChange={(k) => {
          const val = k as string;
          setGenderFilter(val);
          onChangeFilter([{ key: "gender", value: val }]);
        }}
        options={[
          { label: "Any Gender", value: "" },
          ...GENDER_OPTIONS.map((g) => ({
            label: g.label,
            value: String(g.value),
          })),
        ]}
        className="w-[140px]"
        size="sm"
      />
      <Select
        aria-label="Sort By"
        placeholder="Sort By"
        selectedKey={sortFilter}
        onSelectionChange={(k) => {
          const val = k as string;
          setSortFilter(val);
          onChangeFilter([{ key: "sortBy", value: val }]);
        }}
        options={CUSTOMER_SORT_OPTIONS}
        className="w-[160px]"
        size="sm"
      />
    </FilterBar>
  );
};

CustomersFilter.displayName = "CustomersFilter";
