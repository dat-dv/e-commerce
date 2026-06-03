"use client";

import type { TableSortDirection } from "@ecommerce/ui";
import React from "react";

import { PageHeader } from "@/components/molecules/page-header";
import { ESortDirection } from "@/constants/common.constants";
import {
  createCustomerSortValue,
  CUSTOMER_DEFAULT_SORT,
  ECustomerSortField,
} from "@/constants/customer.constants";
import { useCustomerFilters } from "@/hooks/user/use-customer-filters";
import { useCustomersView } from "@/hooks/user/use-customers-view";
import { getTableSortField, type TableSortFieldMap } from "@/utils/table-sort";

import { CustomersFilter } from "./customers-filter";
import { CustomersTable } from "./customers-table";

const CUSTOMER_TABLE_SORT_FIELD_MAP: TableSortFieldMap<ECustomerSortField> = {
  createdAt: ECustomerSortField.CREATED_AT,
  customer: ECustomerSortField.NAME,
};

export const CustomersView = () => {
  const {
    loading,
    page,
    limit,
    total,
    users,
    setPage,
    setPageSize,
    onChangeFilter,
    handleViewDetail,
  } = useCustomersView();
  const {
    searchQuery,
    roleFilter,
    setRoleFilter,
    genderFilter,
    setGenderFilter,
    sortFilter,
    setSortFilter,
    uniqueRoles,
    handleSearch,
  } = useCustomerFilters({
    users,
    onChangeFilter,
  });
  const handleTableSort = (column?: string, direction?: TableSortDirection) => {
    const sort = getTableSortField(
      column,
      direction,
      CUSTOMER_TABLE_SORT_FIELD_MAP,
    );
    const sortValue = sort
      ? createCustomerSortValue(
          sort.field,
          sort.direction === "asc" ? ESortDirection.ASC : ESortDirection.DESC,
        )
      : CUSTOMER_DEFAULT_SORT;

    setSortFilter(sortValue);
    onChangeFilter([{ key: "sortBy", value: sortValue }]);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customer Management"
        description="View and manage registered system customers, details, and roles."
      />

      <CustomersFilter
        searchQuery={searchQuery}
        roleFilter={roleFilter}
        genderFilter={genderFilter}
        sortFilter={sortFilter}
        uniqueRoles={uniqueRoles}
        onSearch={handleSearch}
        setRoleFilter={setRoleFilter}
        setGenderFilter={setGenderFilter}
        setSortFilter={setSortFilter}
        onChangeFilter={onChangeFilter}
      />

      <CustomersTable
        users={users}
        loading={loading}
        page={page}
        pageSize={limit}
        total={total}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        onSortChange={handleTableSort}
        onViewDetail={handleViewDetail}
      />
    </div>
  );
};

CustomersView.displayName = "CustomersView";
