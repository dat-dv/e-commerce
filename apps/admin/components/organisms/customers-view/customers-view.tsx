"use client";

import {
  Avatar,
  Button,
  type ITableColumn,
  Pagination,
  TableCommon,
} from "@ecommerce/ui";
import { Eye } from "lucide-react";
import React from "react";

import { FilterBar } from "@/components/molecules/filter-bar";
import { PageHeader } from "@/components/molecules/page-header";
import type { IAdminUser } from "@/domain/user/types/user.model";
import { useCustomersView } from "@/hooks/user/use-customers-view";

export const CustomersView = () => {
  const {
    error,
    loading,
    searchQuery,
    page,
    total,
    totalPages,
    filteredUsers,
    setPage,
    handleSearch,
    handleViewDetail,
  } = useCustomersView();

  const columns: ITableColumn<IAdminUser>[] = [
    {
      key: "customer",
      header: "Customer",
      render: (user) => {
        const fullName =
          [user.firstName, user.lastName].filter(Boolean).join(" ") ||
          "No Name";
        return (
          <div className="flex items-center gap-3">
            <div className="from-primary/20 to-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ring-2 ring-white/5">
              <Avatar
                name={fullName}
                url={user.avatarUrl || undefined}
                size={40}
              />
            </div>
            <div className="font-semibold text-[var(--app-text)]">
              {fullName}
            </div>
          </div>
        );
      },
    },
    {
      key: "email",
      header: "Email",
      render: (user) => (
        <span className="text-[var(--app-text)]/80">{user.email}</span>
      ),
    },
    {
      key: "role",
      header: "Role",
      render: (user) => {
        const roleName = user.role?.roleName || "User";
        return (
          <span className="bg-primary/10 text-primary inline-block rounded-md px-2.5 py-0.5 text-xs font-semibold">
            {roleName}
          </span>
        );
      },
    },
    {
      key: "createdAt",
      header: "Joined Date",
      render: (user) =>
        user.createdAt
          ? new Date(user.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          : "-",
    },
    {
      key: "actions",
      header: "",
      className: "text-right",
      render: (user) => {
        const fullName =
          [user.firstName, user.lastName].filter(Boolean).join(" ") ||
          "No Name";
        return (
          <Button
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              handleViewDetail(user);
            }}
            className="hover:bg-primary inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 p-0 text-[var(--app-text)]/80 transition-colors hover:text-white"
            aria-label={`View details of ${fullName}`}
          >
            <Eye className="h-4 w-4" />
          </Button>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Customer Management"
        description="View and manage registered system customers, details, and roles."
      />

      <FilterBar
        searchQuery={searchQuery}
        onSearchQueryChange={handleSearch}
        searchPlaceholder="Search customers by name or email..."
      />

      {/* User Table Card */}
      <div className="flex flex-col gap-4">
        <TableCommon<IAdminUser>
          data={filteredUsers}
          columns={columns}
          loading={loading}
          error={error}
          onRowClick={handleViewDetail}
          emptyState="No customers found."
        />

        {/* Pagination Controls */}
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          className="w-auto py-0"
        />
      </div>
    </div>
  );
};

CustomersView.displayName = "CustomersView";
