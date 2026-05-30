/** @description Admin Application route paths */
export const APP_ROUTES = {
  HOME: "/",
  SIGN_IN: "/sign-in",
  FORGOT_PASSWORD: "/forgot-password",
  DASHBOARD: "/dashboard",
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
} as const;
