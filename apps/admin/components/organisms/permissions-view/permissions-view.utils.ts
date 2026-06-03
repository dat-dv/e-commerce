import type {
  IAdminPermission,
  IAdminRole,
} from "@/domain/user/types/user.model";

export const DEFAULT_PERMISSION_ERROR =
  "Failed to load permission settings. Please try again.";

export const getPermissionIds = (role: IAdminRole | null) =>
  role?.permissions?.map((item) => item.permission.id) ?? [];

export const groupPermissionsByCategory = (permissions: IAdminPermission[]) => {
  return permissions.reduce<Record<string, IAdminPermission[]>>(
    (acc, permission) => {
      const category = permission.category || "Other";
      acc[category] = [...(acc[category] ?? []), permission];
      return acc;
    },
    {},
  );
};
