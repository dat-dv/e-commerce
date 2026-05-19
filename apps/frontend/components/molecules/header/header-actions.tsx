"use client";

import Button from "@/components/atoms/button";
import ProtectedSection from "@/components/atoms/protected-section/protected-section";
import { APP_ROUTES } from "@/constants/routes";
import { useAuthStore } from "@/hooks/auth/use-auth-store";
import { useLogout } from "@/hooks/auth/use-logout";
import AvatarDropdown from "../avatar-dropdown";
import { ShoppingBag, Heart } from "lucide-react";
import { useCart } from "@/hooks/cart/use-cart";
import { NotificationCenter } from "@/components/organisms/notifications/notification-center";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function HeaderActions() {
  const user = useAuthStore((store) => store.user);
  const { handleClickLogout } = useLogout();
  const { setIsOpen, itemsCount } = useCart();
  const t = useTranslations("Common.header");

  return (
    <div className="flex items-center gap-2 md:gap-3 ml-1 md:ml-2">
      <ProtectedSection
        fallbackChildren={
          <>
            <Button
              variant="ghost"
              size="sm"
              href={APP_ROUTES.SIGN_IN}
              className="hidden sm:flex h-9 px-4 text-sm md:h-10 md:px-4 md:text-sm"
            >
              {t("signIn")}
            </Button>
            <Button
              variant="primary"
              size="sm"
              className="h-9 px-4 text-sm md:h-10 md:px-4 md:text-sm"
              href={APP_ROUTES.SIGN_UP}
            >
              {t("signUp")}
            </Button>
          </>
        }
      >
        <Link
          href={APP_ROUTES.FAVORITES}
          className="relative p-2.5 text-content/60 hover:text-content hover:bg-content/[0.05] rounded-full transition-colors flex items-center justify-center"
          title={t("favorites")}
        >
          <Heart size={20} />
        </Link>
        <button
          onClick={() => setIsOpen(true)}
          className="relative p-2.5 text-content/60 hover:text-content hover:bg-content/[0.05] rounded-full transition-colors flex items-center justify-center"
          title={t("cart")}
        >
          <ShoppingBag size={20} />
          {itemsCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 bg-blue-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
              {itemsCount}
            </span>
          )}
        </button>
        <AvatarDropdown
          name={`${user?.firstName || ""} ${user?.lastName || ""}`}
          email={user?.email || ""}
          avatarUrl={user?.avatarUrl || ""}
          handleClickLogout={handleClickLogout}
        />
        <NotificationCenter />
      </ProtectedSection>
    </div>
  );
}
