"use client";

import React from "react";

import { PageHeader } from "@/components/molecules/page-header";
import { useCustomerFilters } from "@/hooks/user/use-customer-filters";
import { useCustomersView } from "@/hooks/user/use-customers-view";

import { CustomersFilter } from "./customers-filter";
import { CustomersTable } from "./customers-table";

export const CustomersView = () => {
  const {
    error,
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
        error={error}
        page={page}
        pageSize={limit}
        total={total}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        onViewDetail={handleViewDetail}
      />
    </div>
  );
};

CustomersView.displayName = "CustomersView";
