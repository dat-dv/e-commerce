"use client";

import { APP_ROUTES } from "@/constants/routes";
import { TYPOGRAPHY } from "@/constants/typography";
import { useCart } from "@/hooks/cart/use-cart";
import { Heart, LogOut, Settings, ShoppingBag } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import MobileDrawerAction, {
  MobileDrawerSectionTitle,
} from "./mobile-drawer-action";

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
  const pathname = usePathname();
  const isFavoritesActive = pathname === APP_ROUTES.FAVORITES;
  const isSettingsActive = pathname === APP_ROUTES.SETTINGS;

  return (
    <div className="flex flex-col gap-1 border-t border-content/10 pt-4">
      <MobileDrawerSectionTitle>{t("mySpace")}</MobileDrawerSectionTitle>

      <MobileDrawerAction
        href={APP_ROUTES.FAVORITES}
        onClick={onClose}
        icon={Heart}
        label={t("favorites")}
        isActive={isFavoritesActive}
      />

      <MobileDrawerAction
        onClick={() => {
          onClose();
          setCartOpen(true);
        }}
        icon={ShoppingBag}
        label={t("cart")}
        badge={
          itemsCount > 0 ? (
            <span
              className={`rounded-full bg-blue-600 px-2 py-0.5 ${TYPOGRAPHY.badge} text-white`}
            >
              {itemsCount}
            </span>
          ) : undefined
        }
      />

      <MobileDrawerAction
        href={APP_ROUTES.SETTINGS}
        onClick={onClose}
        icon={Settings}
        label={t("settings")}
        isActive={isSettingsActive}
      />

      <MobileDrawerAction
        onClick={handleLogout}
        icon={LogOut}
        label={t("avatarDropdown.signOut")}
        tone="danger"
        className="mt-2"
      />
    </div>
  );
}
