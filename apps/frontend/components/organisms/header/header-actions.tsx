"use client";

import Button from "@/components/atoms/button";
import CartIcon from "@/components/atoms/cart-icon";
import FavoriteIcon from "@/components/atoms/favorite-icon";
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
import AvatarDropdown from "../../molecules/avatar-dropdown";

export default function HeaderActions({
  visible = ["cart", "avatar", "notifications", "favorites", "fallback"],
}: {
  visible?: ("cart" | "avatar" | "notifications" | "favorites" | "fallback")[];
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
    <div className="flex items-center gap-2 md:gap-3 ml-1 md:ml-2">
      <ProtectedSection
        fallbackChildren={
          isFallbackVisible && (
            <>
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
            </>
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
            )}
            title={t("favorites")}
          >
            <FavoriteIcon isActive={isFavoritesActive} />
          </Link>
        )}
        {isCartVisible && (
          <Button
            variant="ghost"
            onClick={() => setCartOpen(true)}
            className="relative p-2.5 text-content/60 hover:text-content hover:bg-content/[0.05] rounded-full transition-colors flex items-center justify-center h-auto active:scale-95 opacity-100 hover:opacity-100"
            title={t("cart")}
          >
            <CartIcon isActive={isCartOpen} itemsCount={itemsCount} />
            {itemsCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-blue-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
                {itemsCount}
              </span>
            )}
          </Button>
        )}
        {isNotificationsVisible && <NotificationCenter />}
        {isAvatarVisible && (
          <AvatarDropdown
            name={`${user?.firstName || ""} ${user?.lastName || ""}`}
            email={user?.email || ""}
            avatarUrl={user?.avatarUrl || ""}
            handleClickLogout={handleClickLogout}
          />
        )}
      </ProtectedSection>
    </div>
  );
}
