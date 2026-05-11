/** @description Application route paths */
export const CALLBACK_URL_KEY = "callbackUrl";

export const APP_ROUTES = {
  HOME: "/",
  SIGN_IN: "/sign-in",
  SIGN_UP: "/sign-up",
  PROFILE: "/profile",
  TERMS: "/terms",
  PRIVACY: "/privacy",
  DOCS: "/docs",
  CATEGORIES: "/products/categories",
  CATEGORY: (name: string) => `/products/categories?name=${name}`,
  PRODUCT_DETAIL: (id: string | number) => `/products/${id}`,
  CART: "/cart",
  ORDERS: "/orders",
  PRODUCTS: "/products",
  SETTINGS: "/settings",
  HELP: "/help",
  FAQ: "/help/faq",
  SHIPPING: "/help/shipping",
  CONTACT: "/help/contact",
  VOUCHERS: "/vouchers",
  SUPER_DEALS: "/products/categories?name=super-deals",
  FAST_DELIVERY: "/products/categories?name=fast-delivery",
  TOP_BRANDS: "/products/categories?name=top-brands",
  NEW_ARRIVALS: "/products/categories?name=new-arrivals",
  FLASH_SALE: "/products/categories?name=flash-sale",
} as const;

/** @description API endpoint paths */
export const API_ROUTES = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    ME: "/auth/me",
    LOGOUT: "/auth/logout",
    REFRESH_TOKEN: "/auth/refresh-token",
  },
  USERS: {
    PROFILE: "/users/profile",
  },
  CONFIG: "/config",
} as const;
