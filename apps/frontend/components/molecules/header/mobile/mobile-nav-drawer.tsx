"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronRight,
  Heart,
  LogOut,
  Settings,
  ShoppingBag,
  User,
  X,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";

import Button from "@/components/atoms/button";
import { HEADER_NAV_LINKS } from "@/constants/navigation";
import { APP_ROUTES } from "@/constants/routes";
import { useAuthStore } from "@/hooks/auth/use-auth-store";
import { useLogout } from "@/hooks/auth/use-logout";
import { useCart } from "@/hooks/cart/use-cart";
import { cn } from "@/utils/cn";

interface IMobileNavDrawerProps {
  /** Controls the visibility state of the drawer */
  isOpen: boolean;
  /** Callback triggered when clicking outside, close button, or link */
  onClose: () => void;
}

export default function MobileNavDrawer({
  isOpen,
  onClose,
}: IMobileNavDrawerProps) {
  const pathname = usePathname();
  const t = useTranslations("Common.header");
  const tNav = useTranslations("Common.header.nav");
  const user = useAuthStore((store) => store.user);
  const { handleClickLogout } = useLogout();
  const { setIsOpen: setCartOpen, itemsCount } = useCart();

  const handleLogout = async () => {
    onClose();
    await handleClickLogout();
  };

  const navKeyMap: Record<
    string,
    "home" | "categories" | "newArrivals" | "flashSale" | "brands"
  > = {
    Home: "home",
    Categories: "categories",
    "New Arrivals": "newArrivals",
    "Flash Sale": "flashSale",
    Brands: "brands",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm md:hidden"
          />

          {/* Slide-out Menu Panel */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 bottom-0 z-50 w-full bg-surface/90 backdrop-blur-xl border-r border-content/10 flex flex-col p-6 shadow-2xl overflow-y-auto md:hidden"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between mb-8">
              <span className="text-lg font-black tracking-wider text-primary uppercase">
                Menu
              </span>
              <button
                onClick={onClose}
                className="p-2 -mr-2 text-content/60 hover:text-content hover:bg-content/5 rounded-full transition-colors"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            {/* User Profile / Auth State Section */}
            <div className="mb-8 p-4 rounded-2xl bg-content/[0.03] border border-content/[0.05]">
              {user ? (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-lg uppercase">
                      {user.firstName ? user.firstName[0] : <User size={18} />}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-bold truncate text-content">
                        {`${user.firstName || ""} ${user.lastName || ""}`}
                      </span>
                      <span className="text-xs text-content/50 truncate">
                        {user.email}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-2.5">
                  <span className="text-xs font-semibold text-content/40 uppercase tracking-wider mb-1">
                    {t("signIn") || "Account"}
                  </span>
                  <Button
                    variant="ghost"
                    href={APP_ROUTES.SIGN_IN}
                    onClick={onClose}
                    className="w-full justify-center h-10 text-sm border border-content/10"
                  >
                    {t("signIn")}
                  </Button>
                  <Button
                    variant="primary"
                    href={APP_ROUTES.SIGN_UP}
                    onClick={onClose}
                    className="w-full justify-center h-10 text-sm shadow-md"
                  >
                    {t("signUp")}
                  </Button>
                </div>
              )}
            </div>

            {/* Core Navigation Links */}
            <nav className="flex flex-col gap-1 mb-8">
              <span className="text-xs font-semibold text-content/40 uppercase tracking-wider px-3 mb-2">
                Navigation
              </span>
              {HEADER_NAV_LINKS.map((link) => {
                const isActive = link.exact
                  ? pathname === link.href
                  : pathname.startsWith(link.href);
                const key = navKeyMap[link.label];
                const displayLabel = key ? tNav(key) : link.label;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center justify-between px-3 py-3 rounded-xl text-sm font-bold transition-colors",
                      isActive
                        ? "bg-primary/5 text-primary"
                        : "text-content/70 hover:text-content hover:bg-content/5",
                    )}
                  >
                    <span className="flex items-center gap-2">
                      {displayLabel}
                      {link.badge && (
                        <span className="px-1.5 py-0.5 rounded-full bg-red-500 text-[8px] text-white font-black uppercase tracking-wider">
                          {link.badge}
                        </span>
                      )}
                    </span>
                    <ChevronRight size={16} className="opacity-40" />
                  </Link>
                );
              })}
            </nav>

            {/* User Specific Shortcuts (Logged In Only) */}
            {user && (
              <div className="flex flex-col gap-1 mb-8">
                <span className="text-xs font-semibold text-content/40 uppercase tracking-wider px-3 mb-2">
                  My Space
                </span>

                <Link
                  href={APP_ROUTES.FAVORITES}
                  onClick={onClose}
                  className="flex items-center justify-between px-3 py-3 rounded-xl text-sm font-bold text-content/70 hover:text-content hover:bg-content/5 transition-colors"
                >
                  <span className="flex items-center gap-2.5">
                    <Heart size={18} className="text-content/50" />
                    Favorites
                  </span>
                  <ChevronRight size={16} className="opacity-40" />
                </Link>

                <button
                  onClick={() => {
                    onClose();
                    setCartOpen(true);
                  }}
                  className="flex items-center justify-between px-3 py-3 rounded-xl text-sm font-bold text-content/70 hover:text-content hover:bg-content/5 transition-colors w-full text-left"
                >
                  <span className="flex items-center gap-2.5">
                    <ShoppingBag size={18} className="text-content/50" />
                    Cart
                    {itemsCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-blue-600 text-[10px] text-white font-bold">
                        {itemsCount}
                      </span>
                    )}
                  </span>
                  <ChevronRight size={16} className="opacity-40" />
                </button>

                <Link
                  href={APP_ROUTES.SETTINGS}
                  onClick={onClose}
                  className="flex items-center justify-between px-3 py-3 rounded-xl text-sm font-bold text-content/70 hover:text-content hover:bg-content/5 transition-colors"
                >
                  <span className="flex items-center gap-2.5">
                    <Settings size={18} className="text-content/50" />
                    Settings
                  </span>
                  <ChevronRight size={16} className="opacity-40" />
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center justify-between px-3 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-500/5 transition-colors w-full text-left mt-4"
                >
                  <span className="flex items-center gap-2.5">
                    <LogOut size={18} />
                    Logout
                  </span>
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
