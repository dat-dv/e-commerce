import {
  ADMIN_PERMISSIONS,
  ADMIN_ROUTE_PERMISSION_RULES,
  type IAdminRoutePermissionRule,
  type TAdminPermission,
} from "@/constants/permissions";
import { APP_ROUTES } from "@/constants/routes";
import type { IAdminUser } from "@/domain/user";

export const getUserPermissions = (user?: IAdminUser | null): string[] =>
  user?.role?.permissions?.map((item) => item.permission.permissionName) ?? [];

export const hasPermission = (
  user: IAdminUser | null | undefined,
  permission: TAdminPermission,
) => getUserPermissions(user).includes(permission);

export const hasEveryPermission = (
  user: IAdminUser | null | undefined,
  permissions: readonly TAdminPermission[],
) => permissions.every((permission) => hasPermission(user, permission));

export const hasAdminAccess = (user?: IAdminUser | null): boolean =>
  hasPermission(user, ADMIN_PERMISSIONS.ACCESS_ADMIN);

export const getRoutePermissionRule = (
  pathname: string,
): IAdminRoutePermissionRule | null => {
  const matchedRules = ADMIN_ROUTE_PERMISSION_RULES.filter((rule) => {
    if (rule.exact) return pathname === rule.path;
    return pathname === rule.path || pathname.startsWith(`${rule.path}/`);
  });

  return matchedRules.sort((a, b) => b.path.length - a.path.length)[0] ?? null;
};

export const canAccessAdminPath = (
  user: IAdminUser | null | undefined,
  pathname: string,
): boolean => {
  if (!pathname.startsWith(APP_ROUTES.DASHBOARD)) return true;

  const rule = getRoutePermissionRule(pathname);
  if (!rule) return hasAdminAccess(user);

  return hasEveryPermission(user, rule.permissions);
};

export const filterLinksByPermission = <
  T extends { permissions?: readonly TAdminPermission[] },
>(
  links: T[],
  user: IAdminUser | null | undefined,
): T[] =>
  links.filter((link) => {
    if (!link.permissions?.length) return true;
    return hasEveryPermission(user, link.permissions);
  });
