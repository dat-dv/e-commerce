import { APP_ROUTES } from "@/constants/routes";

export const ADMIN_PERMISSIONS = {
  ACCESS_ADMIN: "ACCESS:ADMIN",
  LIST_PRODUCTS: "LIST:PRODUCT",
  DETAIL_PRODUCT: "DETAIL:PRODUCT",
  LIST_ORDERS: "LIST:ANY_ORDER",
  LIST_CUSTOMERS: "LIST:USER",
  DETAIL_CUSTOMER: "DETAIL:ANY_USER",
  LIST_ROLES: "LIST:ROLE",
  DETAIL_ROLE: "DETAIL:ROLE",
  CREATE_ROLE: "CREATE:ROLE",
  LIST_PERMISSIONS: "LIST:PERMISSION",
  UPDATE_ROLE: "UPDATE:ROLE",
  SETTINGS: "ACCESS:ADMIN",
} as const;

export type TAdminPermission =
  (typeof ADMIN_PERMISSIONS)[keyof typeof ADMIN_PERMISSIONS];

export interface IAdminRoutePermissionRule {
  path: string;
  permissions: TAdminPermission[];
  exact?: boolean;
}

export const ADMIN_ROUTE_PERMISSION_RULES: IAdminRoutePermissionRule[] = [
  {
    path: APP_ROUTES.DASHBOARD,
    exact: true,
    permissions: [ADMIN_PERMISSIONS.ACCESS_ADMIN],
  },
  {
    path: APP_ROUTES.PRODUCTS,
    permissions: [
      ADMIN_PERMISSIONS.ACCESS_ADMIN,
      ADMIN_PERMISSIONS.LIST_PRODUCTS,
    ],
  },
  {
    path: APP_ROUTES.ORDERS,
    permissions: [
      ADMIN_PERMISSIONS.ACCESS_ADMIN,
      ADMIN_PERMISSIONS.LIST_ORDERS,
    ],
  },
  {
    path: APP_ROUTES.CUSTOMERS,
    permissions: [
      ADMIN_PERMISSIONS.ACCESS_ADMIN,
      ADMIN_PERMISSIONS.LIST_CUSTOMERS,
    ],
  },
  {
    path: APP_ROUTES.ROLES,
    permissions: [ADMIN_PERMISSIONS.ACCESS_ADMIN, ADMIN_PERMISSIONS.LIST_ROLES],
  },
  {
    path: `${APP_ROUTES.PERMISSIONS}/create`,
    exact: true,
    permissions: [
      ADMIN_PERMISSIONS.ACCESS_ADMIN,
      ADMIN_PERMISSIONS.CREATE_ROLE,
      ADMIN_PERMISSIONS.LIST_ROLES,
      ADMIN_PERMISSIONS.LIST_PERMISSIONS,
    ],
  },
  {
    path: APP_ROUTES.PERMISSIONS,
    permissions: [
      ADMIN_PERMISSIONS.ACCESS_ADMIN,
      ADMIN_PERMISSIONS.LIST_ROLES,
      ADMIN_PERMISSIONS.LIST_PERMISSIONS,
      ADMIN_PERMISSIONS.UPDATE_ROLE,
    ],
  },
  {
    path: APP_ROUTES.SETTINGS,
    permissions: [ADMIN_PERMISSIONS.ACCESS_ADMIN],
  },
];
