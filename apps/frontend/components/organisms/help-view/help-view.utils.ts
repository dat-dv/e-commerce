import { APP_ROUTES } from "@/constants/routes";
import {
  MessageCircle,
  PackageCheck,
  PackageSearch,
  ReceiptText,
  RotateCcw,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { HelpCardItem } from "./help-view.types";

export const helpIconMap = {
  "message-circle": MessageCircle,
  "package-check": PackageCheck,
  "package-search": PackageSearch,
  "receipt-text": ReceiptText,
  "rotate-ccw": RotateCcw,
  "shield-check": ShieldCheck,
  truck: Truck,
};

export const helpHrefMap = {
  contact: APP_ROUTES.CONTACT,
  faq: APP_ROUTES.FAQ,
  orders: APP_ROUTES.ORDERS,
  shipping: APP_ROUTES.SHIPPING,
};

export type HelpIconName = keyof typeof helpIconMap;
export type HelpHrefKey = keyof typeof helpHrefMap;

export const filterHelpCards = (
  cards: HelpCardItem[],
  query: string,
): HelpCardItem[] => {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return cards;

  return cards.filter((item) =>
    [item.title, item.desc, ...item.tags]
      .join(" ")
      .toLowerCase()
      .includes(normalizedQuery),
  );
};
