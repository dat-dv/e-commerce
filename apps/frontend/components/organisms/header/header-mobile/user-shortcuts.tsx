"use client";

import Button from "@/components/atoms/button";
import { APP_ROUTES } from "@/constants/routes";
import { useCart } from "@/hooks/cart/use-cart";
import { Heart, LogOut, Settings, ShoppingBag } from "lucide-react";
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
    <div className="mt-auto flex flex-col gap-1 border-t border-content/10 pt-4">
      <span className="mb-2 px-1 text-[11px] font-black uppercase tracking-[0.18em] text-content/35">
        {t("mySpace")}
      </span>

      <Button
        variant="ghost"
        href={APP_ROUTES.FAVORITES}
        onClick={onClose}
        className="flex h-11 w-full items-center justify-start rounded-lg px-2 text-left text-sm font-bold text-content/70 transition-colors hover:bg-content/[0.04] hover:text-content"
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-content/[0.04]">
          <Heart size={16} />
        </span>
        <span className="ml-3 flex-1">{t("favorites")}</span>
      </Button>

      <Button
        variant="ghost"
        onClick={() => {
          onClose();
          setCartOpen(true);
        }}
        className="flex h-11 w-full items-center justify-start rounded-lg px-2 text-left text-sm font-bold text-content/70 transition-colors hover:bg-content/[0.04] hover:text-content"
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-content/[0.04]">
          <ShoppingBag size={16} />
        </span>
        <span className="ml-3 flex flex-1 items-center gap-2">
          {t("cart")}
          {itemsCount > 0 && (
            <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-bold text-white">
              {itemsCount}
            </span>
          )}
        </span>
      </Button>

      <Button
        variant="ghost"
        href={APP_ROUTES.SETTINGS}
        onClick={onClose}
        className="flex h-11 w-full items-center justify-start rounded-lg px-2 text-left text-sm font-bold text-content/70 transition-colors hover:bg-content/[0.04] hover:text-content"
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-content/[0.04]">
          <Settings size={16} />
        </span>
        <span className="ml-3 flex-1">{t("settings")}</span>
      </Button>

      <Button
        variant="ghost"
        onClick={handleLogout}
        className="mt-2 flex h-11 w-full items-center justify-start rounded-lg px-2 text-left text-sm font-bold text-red-500 transition-colors hover:bg-red-500/5"
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-red-500/10">
          <LogOut size={16} />
        </span>
        <span className="ml-3">{t("avatarDropdown.signOut")}</span>
      </Button>
    </div>
  );
}
