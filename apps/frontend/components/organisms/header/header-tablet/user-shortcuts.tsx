"use client";

import { APP_ROUTES } from "@/constants/routes";
import { TYPOGRAPHY } from "@/constants/typography";
import { useAuthStore } from "@/hooks/auth/use-auth-store";
import { useCart } from "@/hooks/cart/use-cart";
import type { LucideIcon } from "lucide-react";
import {
  Heart,
  LogOut,
  Settings,
  ShoppingBag,
  ShoppingCart,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { useMemo, type ReactNode } from "react";

import MobileDrawerAction, {
  MobileDrawerSectionTitle,
} from "./tablet-drawer-action";

interface IUserShortcutsProps {
  onClose: () => void;
  handleLogout: () => Promise<void>;
}

interface UserShortcutItem {
  key: string;
  href?: string;
  icon: LucideIcon;
  label: string;
  isActive?: boolean;
  badge?: ReactNode;
  tone?: "danger";
  className?: string;
  onClick?: () => void | Promise<void>;
}

export default function UserShortcuts({
  onClose,
  handleLogout,
}: IUserShortcutsProps) {
  const { setIsOpen: setCartOpen, itemsCount } = useCart();
  const user = useAuthStore((state) => state.user);

  const t = useTranslations("Common.header");
  const pathname = usePathname();

  const isLoggedIn = !!user?.id;

  const shortcuts = useMemo<UserShortcutItem[]>(() => {
    const authShortcuts: UserShortcutItem[] = isLoggedIn
      ? [
          {
            key: "orders",
            href: APP_ROUTES.ORDERS,
            onClick: onClose,
            icon: ShoppingBag,
            label: t("avatarDropdown.myOrders"),
            isActive: pathname === APP_ROUTES.ORDERS,
          },
          {
            key: "favorites",
            href: APP_ROUTES.FAVORITES,
            onClick: onClose,
            icon: Heart,
            label: t("favorites"),
            isActive: pathname === APP_ROUTES.FAVORITES,
          },
          {
            key: "cart",
            onClick: () => {
              onClose();
              setCartOpen(true);
            },
            icon: ShoppingCart,
            label: t("cart"),
            badge:
              itemsCount > 0 ? (
                <span
                  className={`rounded-full bg-blue-600 px-2 py-0.5 ${TYPOGRAPHY.badge} text-white`}
                >
                  {itemsCount}
                </span>
              ) : undefined,
          },
          {
            key: "logout",
            onClick: async () => {
              await handleLogout();
              onClose();
            },
            icon: LogOut,
            label: t("avatarDropdown.signOut"),
            tone: "danger",
          },
        ]
      : [
          {
            key: "settings",
            href: APP_ROUTES.SETTINGS,
            onClick: onClose,
            icon: Settings,
            label: t("settings"),
            isActive: pathname === APP_ROUTES.SETTINGS,
          },
        ];

    return authShortcuts;
  }, [handleLogout, isLoggedIn, itemsCount, onClose, pathname, setCartOpen, t]);

  return (
    <div className="border-content/10 flex flex-col gap-1 border-t pt-4">
      <MobileDrawerSectionTitle>{t("mySpace")}</MobileDrawerSectionTitle>

      {shortcuts.map((shortcut) => (
        <MobileDrawerAction
          key={shortcut.key}
          href={shortcut.href}
          onClick={shortcut.onClick}
          icon={shortcut.icon}
          label={shortcut.label}
          isActive={shortcut.isActive}
          badge={shortcut.badge}
          tone={shortcut.tone}
          className={shortcut.className}
        />
      ))}
    </div>
  );
}
