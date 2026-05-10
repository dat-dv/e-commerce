/** @description Application route paths */
export const CALLBACK_URL_KEY = "callbackUrl";

export const APP_ROUTES = {
  HOME: "/",
  SIGN_IN: "/sign-in",
  SIGN_UP: "/sign-up",
  TODO: "/todo",
  PROFILE: "/profile",
  TERMS: "/terms",
  PRIVACY: "/privacy",
  DOCS: "/docs",
} as const;

/** @description API endpoint paths */
export const API_ROUTES = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    ME: "/auth/me",
    LOGOUT: "/auth/logout",
  },
  TODO: {
    LIST: "/todos",
    CREATE: "/todos",
    DETAIL: (id: string) => `/todos/${id}`,
    UPDATE: (id: string) => `/todos/${id}`,
    DELETE: (id: string) => `/todos/${id}`,
  },
  CONFIG: "/config",
} as const;
