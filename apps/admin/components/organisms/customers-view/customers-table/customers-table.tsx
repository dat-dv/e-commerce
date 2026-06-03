"use client";

import {
  Avatar,
  Button,
  type CommonTableColumn,
  TableCommon,
  type TableQuery,
  type TableSortDirection,
} from "@ecommerce/ui";
import { Eye } from "lucide-react";
import React from "react";

import type { IAdminUser } from "@/domain/user/types/user.model";

export interface ICustomersTableProps {
  users: IAdminUser[];
  loading: boolean;
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onSortChange: (
    sortColumn?: string,
    sortDirection?: TableSortDirection,
  ) => void;
  onViewDetail: (user: IAdminUser) => void;
}

export const CustomersTable = ({
  users,
  loading,
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  onSortChange,
  onViewDetail,
}: ICustomersTableProps) => {
  const [sortColumn, setSortColumn] = React.useState<string>();
  const [sortDirection, setSortDirection] =
    React.useState<TableSortDirection>();

  const handleQueryChange = (nextQuery: TableQuery) => {
    const isSortChange =
      nextQuery.sortColumn !== sortColumn ||
      nextQuery.sortDirection !== sortDirection;

    setSortColumn(nextQuery.sortColumn);
    setSortDirection(nextQuery.sortDirection);

    if (isSortChange) {
      onSortChange(nextQuery.sortColumn, nextQuery.sortDirection);
      return;
    }

    if (nextQuery.pageSize !== pageSize) {
      onPageSizeChange(nextQuery.pageSize);
      return;
    }

    if (nextQuery.page !== page) {
      onPageChange(nextQuery.page);
    }
  };

  const columns: CommonTableColumn<IAdminUser>[] = [
    {
      key: "customer",
      header: "Customer",
      sortable: true,
      resizable: true,
      renderItem: ({ item: user }) => {
        const fullName =
          [user.firstName, user.lastName].filter(Boolean).join(" ") ||
          "No Name";
        return (
          <div className="flex items-center gap-3">
            <div className="from-primary/20 to-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ring-2 ring-white/5">
              <Avatar
                name={fullName}
                url={user.avatar?.url || undefined}
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
      resizable: true,
      renderItem: ({ item: user }) => (
        <span className="text-[var(--app-text)]/80">{user.email}</span>
      ),
    },
    {
      key: "role",
      header: "Role",
      resizable: true,
      renderItem: ({ item: user }) => {
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
      sortable: true,
      resizable: true,
      renderItem: ({ item: user }) =>
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
      width: 50,
      className: "text-right",
      renderItem: ({ item: user }) => {
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
        name="admin-customers"
        data={users}
        columns={columns}
        loading={loading}
        total={total}
        page={page}
        pageSize={pageSize}
        showIndex
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onQueryChange={handleQueryChange}
        emptyState="No customers found."
      />
    </div>
  );
};

CustomersTable.displayName = "CustomersTable";
