"use client";

import { Button, type CommonTableColumn, TableCommon } from "@ecommerce/ui";
import { Plus, ShieldCog } from "lucide-react";
import Link from "next/link";

import { FilterBar } from "@/components/molecules/filter-bar";
import { PageHeader } from "@/components/molecules/page-header";
import { APP_ROUTES } from "@/constants/routes";
import type { IAdminRole } from "@/domain/user/types/user.model";
import { useRolesView } from "@/hooks/role/use-roles-view";

export const RolesView = () => {
  const { roles, loading, error, searchQuery, setSearchQuery, handleEditRole } =
    useRolesView();

  const columns: CommonTableColumn<IAdminRole>[] = [
    {
      key: "roleName",
      header: "Role Name",
      resizable: true,
      renderItem: ({ item: role }) => (
        <span className="font-semibold text-[var(--app-text)]">
          {role.roleName || role.id}
        </span>
      ),
    },
    {
      key: "description",
      header: "Description",
      resizable: true,
      renderItem: ({ item: role }) => (
        <span className="text-[var(--app-text)]/80">
          {role.description || "No description provided."}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "text-right",
      renderItem: ({ item: role }) => (
        <Button
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation();
            handleEditRole(role);
          }}
          className="hover:bg-primary inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 p-0 text-[var(--app-text)]/80 transition-colors hover:text-white"
          aria-label={`Manage permissions for ${role.roleName}`}
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

      <FilterBar
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        searchPlaceholder="Search roles by name or description..."
      />

      <div className="flex flex-col gap-4">
        <TableCommon<IAdminRole>
          name="admin-roles"
          data={roles}
          columns={columns}
          loading={loading}
          error={error}
          total={roles.length}
          page={1}
          pageSize={roles.length || 10}
          showIndex
          showPageSizeSelect={false}
          emptyState="No roles found."
        />
      </div>
    </div>
  );
};

RolesView.displayName = "RolesView";
