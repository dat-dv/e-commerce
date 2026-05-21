import { APP_ROUTES } from "@/constants/routes";
import { Sparkles, Star, Ticket, Zap } from "lucide-react";

export const HOMEPAGE_SECTION_TYPES = {
  FLASH_SALE: "flash_sale",
  PRODUCT_CAROUSEL: "product_carousel",
} as const;

export type HomepageSectionType =
  (typeof HOMEPAGE_SECTION_TYPES)[keyof typeof HOMEPAGE_SECTION_TYPES];

export const FEATURE_ITEMS = [
  {
    name: "Flash Sale",
    desc: "Ending soon",
    icon: Zap,
    color: "text-red-500",
    href: APP_ROUTES.FLASH_SALE,
  },
  {
    name: "Vouchers",
    desc: "Coming soon",
    icon: Ticket,
    color: "text-pink-500",
    href: APP_ROUTES.VOUCHERS,
  },
  {
    name: "Top Brands",
    desc: "Certified stores",
    icon: Star,
    color: "text-yellow-500",
    href: APP_ROUTES.ALL_BRANDS,
  },
  {
    name: "New Arrivals",
    desc: "Fresh drops",
    icon: Sparkles,
    color: "text-purple-500",
    href: APP_ROUTES.NEW_ARRIVALS,
  },
];
