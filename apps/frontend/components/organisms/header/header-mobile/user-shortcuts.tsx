"use client";

import Button from "@/components/atoms/button";
import { APP_ROUTES } from "@/constants/routes";
import { useCart } from "@/hooks/cart/use-cart";
import {
  ChevronRight,
  Heart,
  LogOut,
  Settings,
  ShoppingBag,
} from "lucide-react";
import { useTranslations } from "next-intl";

interface IUserShortcutsProps {
  onClose: () => void;
  handleLogout: () => Promise<void>;
}

export default function UserShortcuts({
  onClose,
  handleLogout,
}: IUserShortcutsProps) {
  const { setIsOpen: setCartOpen, itemsCount } = useCart();
  const t = useTranslations("Common.header");

  return (
    <div className="flex flex-col gap-1 mb-8">
      <span className="text-xs font-semibold text-content/40 uppercase tracking-wider px-3 mb-2">
        {t("mySpace")}
      </span>

      <Button
        variant="ghost"
        href={APP_ROUTES.FAVORITES}
        onClick={onClose}
        className="flex items-center justify-between px-3 py-3 rounded-xl text-sm font-bold text-content/70 hover:text-content hover:bg-content/5 transition-colors w-full text-left h-auto"
      >
        <span className="flex items-center gap-2.5">
          <Heart size={18} className="text-content/50" />
          {t("favorites")}
        </span>
        <ChevronRight size={16} className="opacity-40" />
      </Button>

      <Button
        variant="ghost"
        onClick={() => {
          onClose();
          setCartOpen(true);
        }}
        className="flex items-center justify-between px-3 py-3 rounded-xl text-sm font-bold text-content/70 hover:text-content hover:bg-content/5 transition-colors w-full text-left h-auto"
      >
        <span className="flex items-center gap-2.5">
          <ShoppingBag size={18} className="text-content/50" />
          {t("cart")}
          {itemsCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-blue-600 text-[10px] text-white font-bold">
              {itemsCount}
            </span>
          )}
        </span>
        <ChevronRight size={16} className="opacity-40" />
      </Button>

      <Button
        variant="ghost"
        href={APP_ROUTES.SETTINGS}
        onClick={onClose}
        className="flex items-center justify-between px-3 py-3 rounded-xl text-sm font-bold text-content/70 hover:text-content hover:bg-content/5 transition-colors w-full text-left h-auto"
      >
        <span className="flex items-center gap-2.5">
          <Settings size={18} className="text-content/50" />
          {t("settings")}
        </span>
        <ChevronRight size={16} className="opacity-40" />
      </Button>

      <Button
        variant="ghost"
        onClick={handleLogout}
        className="flex items-center justify-between px-3 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-500/5 transition-colors w-full text-left mt-4 h-auto"
      >
        <span className="flex items-center gap-2.5">
          <LogOut size={18} />
          {t("avatarDropdown.signOut")}
        </span>
      </Button>
    </div>
  );
}
