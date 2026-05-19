"use client";

import { EyeIcon, Heart, LogOut, ShoppingBag, User } from "lucide-react";
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
      <div className="flex flex-col gap-1 min-w-[220px]">
        <div className="px-3.5 py-3 border-b border-content/[0.1] space-y-1">
          <p className="text-[10px] font-black text-content/50 uppercase tracking-widest">
            {t("accountDetails")}
          </p>
          <div className="flex flex-col">
            <p className="font-bold text-sm truncate text-content leading-snug">
              {name || t("fallbackUser")}
            </p>
            <p className="text-xs text-content/60 truncate font-medium">
              {email || t("noEmail")}
            </p>
          </div>
        </div>

        <div className="p-1 space-y-0.5">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start rounded-lg font-bold hover:bg-content/5 group h-9 px-2.5 transition-all"
            href={APP_ROUTES.PROFILE}
          >
            <User className="w-4 h-4 mr-2.5 opacity-60 group-hover:opacity-100 transition-opacity" />
            <span className="text-sm">{t("viewProfile")}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start rounded-lg font-bold hover:bg-content/5 group h-9 px-2.5 transition-all"
            href={APP_ROUTES.FAVORITES}
          >
            <Heart className="w-4 h-4 mr-2.5 opacity-60 group-hover:opacity-100 transition-opacity" />
            <span className="text-sm">{t("wishlist")}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start rounded-lg font-bold hover:bg-content/5 group h-9 px-2.5 transition-all"
            href={APP_ROUTES.RECENTLY_VIEWED}
          >
            <EyeIcon className="w-4 h-4 mr-2.5 opacity-60 group-hover:opacity-100 transition-opacity" />
            <span className="text-sm">{t("recentlyViewed")}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start rounded-lg font-bold hover:bg-content/5 group h-9 px-2.5 transition-all"
            href={APP_ROUTES.ORDERS}
          >
            <ShoppingBag className="w-4 h-4 mr-2.5 opacity-60 group-hover:opacity-100 transition-opacity" />
            <span className="text-sm">{t("myOrders")}</span>
          </Button>

          <Button
            variant="danger"
            size="sm"
            onClick={handleClickLogout}
            className="w-full justify-start rounded-lg font-bold group h-9 px-2.5 active:scale-95 transition-all"
          >
            <LogOut className="w-4 h-4 mr-2.5 opacity-80" />
            <span className="text-sm">{t("signOut")}</span>
          </Button>
        </div>
      </div>
    </AppDropdown>
  );
};

export default AvatarDropdown;
