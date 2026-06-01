"use client";

import { Button, type ITableColumn, TableCommon } from "@ecommerce/ui";
import { Plus, ShieldCog } from "lucide-react";
import Link from "next/link";
import React from "react";

import { PageHeader } from "@/components/molecules/page-header";
import { APP_ROUTES } from "@/constants/routes";
import type { TAdminRole } from "@/domain/permission";
import { useRolesView } from "@/hooks/role/use-roles-view";

export const RolesView = () => {
  const { roles, loading, error, handleEditRole } = useRolesView();

  const columns: ITableColumn<TAdminRole>[] = [
    {
      key: "roleName",
      header: "Role Name",
      render: (role) => (
        <span className="font-semibold text-[var(--app-text)]">
          {role.role_name || role.id}
        </span>
      ),
    },
    {
      key: "description",
      header: "Description",
      render: (role) => (
        <span className="text-[var(--app-text)]/80">
          {role.description || "No description provided."}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "text-right",
      render: (role) => (
        <Button
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation();
            handleEditRole(role);
          }}
          className="hover:bg-primary inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 p-0 text-[var(--app-text)]/80 transition-colors hover:text-white"
          aria-label={`Manage permissions for ${role.role_name}`}
        >
          <ShieldCog className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Role Management"
        description="View and manage system roles."
      >
        <Button
          linkComponent={Link}
          href={APP_ROUTES.PERMISSIONS + "/create"}
          className="inline-flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Create Role
        </Button>
      </PageHeader>

      <div className="flex flex-col gap-4">
        <TableCommon<TAdminRole>
          data={roles}
          columns={columns}
          loading={loading}
          error={error}
          onRowClick={handleEditRole}
          emptyState="No roles found."
        />
      </div>
    </div>
  );
};

RolesView.displayName = "RolesView";
