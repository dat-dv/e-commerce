import type { IPermissionResponse } from "@ecommerce/shared";

import type { TAdminRole } from "@/domain/permission";

export const DEFAULT_PERMISSION_ERROR =
  "Failed to load permission settings. Please try again.";

export const getPermissionIds = (role: TAdminRole | null) =>
  role?.permissions?.map((item) => item.permission.id) ?? [];

export const groupPermissionsByCategory = (
  permissions: IPermissionResponse[],
) => {
  return permissions.reduce<Record<string, IPermissionResponse[]>>(
    (acc, permission) => {
      const category = permission.category || "Other";
      acc[category] = [...(acc[category] ?? []), permission];
      return acc;
    },
    {},
  );
};
