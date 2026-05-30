/** @description Admin Application route paths */
export const APP_ROUTES = {
  HOME: "/",
  SIGN_IN: "/sign-in",
  FORGOT_PASSWORD: "/forgot-password",
  DASHBOARD: "/dashboard",
  CUSTOMERS: "/dashboard/customers",
  PERMISSIONS: "/dashboard/permissions",
  ORDERS: "/dashboard/orders",
  PRODUCTS: "/dashboard/products",
  SETTINGS: "/dashboard/settings",
} as const;

/** @description Admin API endpoint paths */
export const API_ROUTES = {
  AUTH: {
    LOGIN: "/auth/login",
    ME: "/auth/me",
    LOGOUT: "/auth/logout",
    FORGOT_PASSWORD: "/auth/forgot-password",
  },
  USERS: {
    LIST: "/users",
    CREATE: "/users",
    DETAIL: (id: string) => `/users/${id}`,
    UPDATE: (id: string) => `/users/${id}`,
    DELETE: (id: string) => `/users/${id}`,
  },
  ROLES: {
    LIST: "/roles",
    DETAIL: (id: string) => `/roles/${id}`,
    UPDATE: (id: string) => `/roles/${id}`,
  },
  PERMISSIONS: {
    LIST: "/permissions",
  },
  ORDERS: {
    ALL: "/orders/all",
    DETAIL: (id: string) => `/orders/${id}`,
    UPDATE_STATUS: (id: string) => `/orders/${id}/status`,
  },
  PRODUCTS: {
    LIST: "/products",
    DETAIL: (slug: string) => `/products/${slug}`,
  },
} as const;
