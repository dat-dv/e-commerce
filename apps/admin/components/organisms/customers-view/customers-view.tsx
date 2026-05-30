import {
  Avatar,
  Button,
  type ITableColumn,
  SearchInput,
  TableCommon,
} from "@ecommerce/ui";
import { ChevronLeft, ChevronRight, Eye } from "lucide-react";
import React from "react";

import type { IAdminUser } from "@/domain/user/types/user.model";

import { useCustomersView } from "./use-customers-view";

export const CustomersView = () => {
  const {
    error,
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
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 ring-2 ring-white/5">
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
          <span className="inline-block rounded-md bg-indigo-500/10 px-2.5 py-0.5 text-xs font-semibold text-indigo-400">
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
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 p-0 text-[var(--app-text)]/80 transition-colors hover:bg-indigo-500 hover:text-white"
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--app-text)] sm:text-3xl">
            Customer Management
          </h1>
          <p className="mt-1.5 text-sm text-[var(--muted)]">
            View and manage registered system customers, details, and roles.
          </p>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="relative rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-4 shadow-xl backdrop-blur-xl">
        <SearchInput
          placeholder="Search customers by name or email..."
          value={searchQuery}
          onSearch={handleSearch}
          showSubmitButton={true}
          className="w-full"
        />
      </div>

      {/* User Table Card */}
      <div className="flex flex-col gap-4">
        <TableCommon<IAdminUser>
          data={filteredUsers}
          columns={columns}
          error={error}
          onRowClick={handleViewDetail}
          emptyState="No customers found."
        />

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-[var(--border-color)] px-6 py-4">
            <div className="text-xs text-[var(--muted)]">
              Showing page{" "}
              <span className="font-bold text-[var(--app-text)]">{page}</span>{" "}
              of{" "}
              <span className="font-bold text-[var(--app-text)]">
                {totalPages}
              </span>{" "}
              (<span className="font-bold text-[var(--app-text)]">{total}</span>{" "}
              total customers)
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                disabled={page === 1}
                onClick={() => setPage(Math.max(page - 1, 1))}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 p-0 text-[var(--app-text)]/80 transition-colors disabled:opacity-50"
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                disabled={page === totalPages}
                onClick={() => setPage(Math.min(page + 1, totalPages))}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 p-0 text-[var(--app-text)]/80 transition-colors disabled:opacity-50"
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

CustomersView.displayName = "CustomersView";
