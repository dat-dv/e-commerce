"use client";

import { Button, CartIcon, FavoriteIcon } from "@ecommerce/ui";

import ProtectedSection from "@/components/atoms/protected-section/protected-section";
import { NotificationCenter } from "@/components/organisms/notifications/notification-center";
import { APP_ROUTES } from "@/constants/routes";
import { useAuthStore } from "@/hooks/auth/use-auth-store";
import { useLogout } from "@/hooks/auth/use-logout";
import { useCart } from "@/hooks/cart/use-cart";
import { cn } from "@/utils/cn";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AvatarDropdown from "@/components/molecules/avatar-dropdown";

export default function HeaderActions({
  visible = ["cart", "avatar", "notifications", "favorites", "fallback"],
  classNames,
}: {
  visible?: ("cart" | "avatar" | "notifications" | "favorites" | "fallback")[];
  classNames?: Partial<
    Record<
      "cart" | "avatar" | "notifications" | "favorites" | "fallback",
      string
    >
  >;
}) {
  const user = useAuthStore((store) => store.user);
  const { handleClickLogout } = useLogout();
  const { isOpen: isCartOpen, setIsOpen: setCartOpen, itemsCount } = useCart();
  const t = useTranslations("Common.header");
  const pathname = usePathname();
  const isFavoritesActive = pathname === APP_ROUTES.FAVORITES;
  const isCartVisible = visible.includes("cart");
  const isAvatarVisible = visible.includes("avatar");
  const isNotificationsVisible = visible.includes("notifications");
  const isFavoritesVisible = visible.includes("favorites");
  const isFallbackVisible = visible.includes("fallback");

  return (
    <div className="ml-1 flex items-center gap-2 align-middle md:ml-2 md:gap-3">
      <ProtectedSection
        fallbackChildren={
          isFallbackVisible && (
            <div className={cn("contents", classNames?.fallback)}>
              <Button
                variant="ghost"
                size="sm"
                href={APP_ROUTES.SIGN_IN}
                className="h-9 px-4 text-sm sm:flex md:h-10 md:px-4 md:text-sm"
              >
                {t("signIn")}
              </Button>
              <Button
                variant="primary"
                size="sm"
                className="h-9 px-4 text-sm sm:flex md:h-10 md:px-4 md:text-sm"
                href={APP_ROUTES.SIGN_UP}
              >
                {t("signUp")}
              </Button>
            </div>
          )
        }
      >
        {isFavoritesVisible && (
          <Link
            href={APP_ROUTES.FAVORITES}
            className={cn(
              "relative items-center justify-center rounded-full p-2.5 transition-colors sm:flex",
              isFavoritesActive
                ? "bg-primary/10 text-primary"
                : "text-content/60 hover:bg-content/[0.05] hover:text-content",
              classNames?.favorites,
            )}
            title={t("favorites")}
            aria-label={t("favorites")}
          >
            <FavoriteIcon isActive={isFavoritesActive} />
          </Link>
        )}
        {isCartVisible && (
          <Button
            variant="ghost"
            onClick={() => setCartOpen(true)}
            className={cn(
              "text-content/60 hover:text-content hover:bg-content/[0.05] relative flex h-auto items-center justify-center rounded-full p-2.5 opacity-100 transition-colors hover:opacity-100 active:scale-95",
              classNames?.cart,
            )}
            title={t("cart")}
          >
            <CartIcon isActive={isCartOpen} itemsCount={itemsCount} />
            {itemsCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                {itemsCount}
              </span>
            )}
          </Button>
        )}
        {isNotificationsVisible && (
          <div className={cn("contents", classNames?.notifications)}>
            <NotificationCenter />
          </div>
        )}
        {isAvatarVisible && (
          <div className={cn("contents", classNames?.avatar)}>
            <AvatarDropdown
              name={`${user?.firstName || ""} ${user?.lastName || ""}`}
              email={user?.email || ""}
              avatarUrl={user?.avatarUrl || ""}
              handleClickLogout={handleClickLogout}
            />
          </div>
        )}
      </ProtectedSection>
    </div>
  );
}
