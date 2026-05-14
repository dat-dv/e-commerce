import { APP_ROUTES } from "./routes";

export interface NavLink {
  href: string;
  label: string;
  exact?: boolean;
  badge?: string;
  dropdown?: boolean;
}

export const HEADER_NAV_LINKS: NavLink[] = [
  { href: APP_ROUTES.HOME, label: "Home", exact: true },
  { href: APP_ROUTES.CATEGORIES, label: "Categories", dropdown: true },
  { href: APP_ROUTES.NEW_ARRIVALS, label: "New Arrivals", exact: false },
  {
    href: APP_ROUTES.FLASH_SALE,
    label: "Flash Sale",
    exact: false,
    badge: "Hot",
  },
  { href: APP_ROUTES.TOP_BRANDS, label: "Brands", exact: false },
];
