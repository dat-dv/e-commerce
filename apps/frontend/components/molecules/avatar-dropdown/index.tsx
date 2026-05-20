"use client";

import {
  EyeIcon,
  Heart,
  LogOut,
  Settings,
  ShoppingBag,
  User,
} from "lucide-react";
import { useTranslations } from "next-intl";

import Avatar from "@/components/atoms/avatar";
import Button from "@/components/atoms/button";
import { APP_ROUTES } from "@/constants/routes";

import { AppDropdown } from "../dropdown";

interface IAvatarDropdownProps {
  name: string;
  email: string;
  handleClickLogout: () => void;
  avatarUrl?: string;
}

const MENU_ITEMS = [
  {
    labelKey: "viewProfile" as const,
    href: APP_ROUTES.PROFILE,
    icon: User,
  },
  {
    labelKey: "wishlist" as const,
    href: APP_ROUTES.FAVORITES,
    icon: Heart,
  },
  {
    labelKey: "recentlyViewed" as const,
    href: APP_ROUTES.RECENTLY_VIEWED,
    icon: EyeIcon,
  },
  {
    labelKey: "myOrders" as const,
    href: APP_ROUTES.ORDERS,
    icon: ShoppingBag,
  },
  {
    labelKey: "settings" as const,
    href: APP_ROUTES.SETTINGS,
    icon: Settings,
  },
];

const AvatarDropdown = ({
  name,
  email,
  handleClickLogout,
  avatarUrl,
}: IAvatarDropdownProps) => {
  const t = useTranslations("Common.header.avatarDropdown");

  return (
    <AppDropdown
      align="right"
      popoverClassName="min-w-0 w-64"
      trigger={({ ref, toggle, isOpen }) => (
        <button
          ref={ref}
          onClick={toggle}
          aria-label={t("menuLabel")}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          className="h-10 w-10 relative cursor-pointer group border-none bg-transparent outline-none p-0"
        >
          <div className="absolute inset-0 rounded-xl border-2 border-primary/20 bg-primary/5 transition-all group-hover:border-primary/40 group-hover:scale-105 active:scale-95 overflow-hidden ring-offset-background group-focus-visible:ring-2 group-focus-visible:ring-primary/50">
            <Avatar name={name || t("fallbackUser")} url={avatarUrl || ""} />
          </div>
        </button>
      )}
    >
      <div className="flex flex-col w-full">
        <div className="flex items-center gap-2.5 px-3 py-2.5 border-b border-content/[0.08] bg-content/[0.01]">
          <div className="h-9 w-9 rounded-lg overflow-hidden border border-content/10 flex-shrink-0">
            <Avatar name={name || t("fallbackUser")} url={avatarUrl || ""} />
          </div>
          <div className="flex flex-col min-w-0">
            <p className="font-bold text-sm truncate text-content leading-none">
              {name || t("fallbackUser")}
            </p>
            <p className="text-[11px] text-content/50 truncate font-medium mt-1 leading-none">
              {email || t("noEmail")}
            </p>
          </div>
        </div>

        {/* Compact action buttons with reduced height for improved vertical proportion */}
        <div className="p-1 space-y-0.5">
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.href}
                variant="ghost"
                size="sm"
                className="w-full justify-start rounded-lg font-bold hover:bg-content/5 group h-8 px-2 transition-all"
                href={item.href}
              >
                <Icon className="w-3.5 h-3.5 mr-2 opacity-60 group-hover:opacity-100 transition-opacity" />
                <span className="text-xs">{t(item.labelKey)}</span>
              </Button>
            );
          })}

          {/* Separation line for destructive action section */}
          <div className="h-px bg-content/[0.08] my-1" />

          <Button
            variant="danger"
            size="sm"
            onClick={handleClickLogout}
            className="w-full justify-start rounded-lg font-bold group h-8 px-2 active:scale-95 transition-all"
          >
            <LogOut className="w-3.5 h-3.5 mr-2 opacity-80" />
            <span className="text-xs">{t("signOut")}</span>
          </Button>
        </div>
      </div>
    </AppDropdown>
  );
};

export default AvatarDropdown;
