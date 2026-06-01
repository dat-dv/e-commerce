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

import type { IAdminUser } from "@/domain/user/types/user.model";

export interface ICustomersTableProps {
  users: IAdminUser[];
  loading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onViewDetail: (user: IAdminUser) => void;
}

export const CustomersTable = ({
  users,
  loading,
  error,
  page,
  totalPages,
  onPageChange,
  onViewDetail,
}: ICustomersTableProps) => {
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
              onViewDetail(user);
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
    <div className="flex flex-col gap-4">
      <TableCommon<IAdminUser>
        data={users}
        columns={columns}
        loading={loading}
        error={error}
        onRowClick={onViewDetail}
        emptyState="No customers found."
      />

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
        className="w-auto py-0"
      />
    </div>
  );
};

CustomersTable.displayName = "CustomersTable";
