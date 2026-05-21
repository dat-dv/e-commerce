"use client";

import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import {
  Bell,
  Lock,
  MapPin,
  ShoppingBag,
  ShoppingCart,
  User,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";

const PROFILE_TABS = [
  { href: "/profile", icon: User, labelKey: "links.profile" },
  {
    href: "/profile/password",
    icon: Lock,
    labelKey: "links.changePassword",
  },
  {
    href: "/profile/address",
    icon: MapPin,
    labelKey: "links.addresses",
  },
  {
    href: "/notifications",
    icon: Bell,
    labelKey: "links.notifications",
  },
  {
    href: "/orders",
    icon: ShoppingBag,
    labelKey: "links.purchases",
  },
  {
    href: "/cart",
    icon: ShoppingCart,
    labelKey: "links.cart",
  },
] as const;

export function ProfileSettingNavTablet({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const t = useTranslations("ProfileLayout.sidebar");

  return (
    <div className="flex w-full flex-col gap-0 pt-10">
      <div
        className={cn(
          "border-content/10 flex flex-row items-end gap-1 border-b",
          "hide-scrollbar overflow-x-auto overflow-y-clip",
        )}
        role="tablist"
        aria-label="Profile settings"
      >
        {PROFILE_TABS.map(({ href, icon: Icon, labelKey }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              role="tab"
              aria-selected={isActive}
              className={cn(
                "relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors duration-200",
                "shrink-0 cursor-pointer whitespace-nowrap outline-none select-none",
                isActive
                  ? "text-primary"
                  : "text-content/50 hover:text-content/80",
              )}
            >
              <Icon className="h-4 w-4" />
              {t(labelKey)}
              {isActive && (
                <motion.span
                  layoutId="profile-tab-indicator"
                  className="bg-primary absolute right-0 bottom-0 left-0 h-0.5 rounded-full"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
            </Link>
          );
        })}
      </div>

      <div className="mt-12">{children}</div>
    </div>
  );
}
