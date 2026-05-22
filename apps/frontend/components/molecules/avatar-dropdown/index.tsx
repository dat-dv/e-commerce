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
import { TYPOGRAPHY } from "@/constants/typography";

import { UI_RADIUS } from "@/constants/ui-radius";
import { cn } from "@/utils/cn";
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
      className="flex"
      popoverClassName="min-w-0 w-64"
      trigger={({ ref, toggle, isOpen }) => (
        <Button
          ref={ref}
          onClick={toggle}
          aria-label={t("menuLabel")}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          className={cn(
            "group border-content/10 hover:border-content/5 relative h-10 w-10 cursor-pointer overflow-hidden border bg-transparent p-0 outline-none",
            UI_RADIUS.avatar,
          )}
        >
          <Avatar name={name || t("fallbackUser")} url={avatarUrl || ""} />
        </Button>
      )}
    >
      <div className="flex w-full flex-col">
        <div className="border-content/[0.08] bg-content/[0.01] flex items-center gap-2.5 border-b px-3 py-2.5">
          <div className="border-content/10 h-9 w-9 flex-shrink-0 overflow-hidden rounded-lg border">
            <Avatar name={name || t("fallbackUser")} url={avatarUrl || ""} />
          </div>
          <div className="flex min-w-0 flex-col">
            <p
              className={`text-content truncate ${TYPOGRAPHY.bodySmall} leading-none font-bold`}
            >
              {name || t("fallbackUser")}
            </p>
            <p
              className={`text-content/50 mt-1 truncate ${TYPOGRAPHY.meta} leading-none`}
            >
              {email || t("noEmail")}
            </p>
          </div>
        </div>

        {/* Compact action buttons with reduced height for improved vertical proportion */}
        <div className="space-y-0.5 p-1">
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.href}
                variant="ghost"
                size="sm"
                className="hover:bg-content/5 group h-8 w-full justify-start rounded-lg px-2 font-bold transition-all"
                href={item.href}
              >
                <Icon className="mr-2 h-3.5 w-3.5 opacity-60 transition-opacity group-hover:opacity-100" />
                <span className={TYPOGRAPHY.caption}>{t(item.labelKey)}</span>
              </Button>
            );
          })}

          {/* Separation line for destructive action section */}
          <div className="bg-content/[0.08] my-1 h-px" />

          <Button
            variant="danger"
            size="sm"
            onClick={handleClickLogout}
            className="group h-8 w-full justify-start rounded-lg px-2 font-bold transition-all active:scale-95"
          >
            <LogOut className="mr-2 h-3.5 w-3.5 opacity-80" />
            <span className={TYPOGRAPHY.caption}>{t("signOut")}</span>
          </Button>
        </div>
      </div>
    </AppDropdown>
  );
};

export default AvatarDropdown;
