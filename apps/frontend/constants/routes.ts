/** @description Application route paths */
export const CALLBACK_URL_KEY = "callbackUrl";

export const APP_ROUTES = {
  HOME: "/",
  SIGN_IN: "/sign-in",
  SIGN_UP: "/sign-up",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  PROFILE: "/profile",
  TERMS: "/terms",
  PRIVACY: "/privacy",
  DOCS: "/docs",
  CATEGORIES: "/categories",
  CATEGORY_DETAIL: (slug: string) => `/categories/${slug}`,
  PRODUCT_DETAIL: (slug: string) => `/products/${slug}`,
  CART: "/cart",
  CHECKOUT: "/checkout",
  ORDERS: "/orders",
  PRODUCTS: "/products",
  SETTINGS: "/settings",
  HELP: "/help",
  FAQ: "/help/faq",
  SHIPPING: "/help/shipping",
  CONTACT: "/help/contact",
  VOUCHERS: "/vouchers",
  TOP_BRANDS: "/top-brands",
  BRAND_DETAIL: (slug: string) => `/brands/${slug}`,
  NEW_ARRIVALS: "/new-arrivals",
  FLASH_SALE: "/flash-sale",
} as const;

/** @description API endpoint paths */
export const API_ROUTES = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    ME: "/auth/me",
    LOGOUT: "/auth/logout",
    REFRESH_TOKEN: "/auth/refresh-token",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    CHANGE_PASSWORD: "/auth/change-password",
  },
  USERS: {
    PROFILE: "/users/profile",
  },
  PRODUCTS: {
    BASE: "/products",
    RECOMMENDED: "/products/recommended",
    BASED_ON_INTEREST: "/products/based-on-interest",
    RECENTLY_VIEWED: "/products/recently-viewed",
    FLASH_SALE: "/products/flash-sale",
    DETAIL_BY_SLUG: (slug: string) => `/products/${slug}`,
    REVIEWS: (id: string) => `/products/${id}/reviews`,
    SIMILAR: (id: string) => `/products/${id}/similar`,
  },
  PRODUCT_CATEGORIES: {
    BASE: "/product-categories",
    TREE: "/product-categories/tree",
    GROUPS: "/product-categories/groups",
  },
  BRAND: {
    TOP: "/brands/top",
    BASE: "/brands",
    DETAIL: (slug: string) => `/brands/${slug}`,
  },
  HOMEPAGE: {
    SECTIONS: "/homepage/sections",
  },
  CONFIG: "/config",
} as const;
