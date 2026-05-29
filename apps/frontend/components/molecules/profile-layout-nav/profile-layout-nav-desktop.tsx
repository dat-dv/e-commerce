"use client";
import { LiquidWaveText } from "@ecommerce/ui";

import { UI_RADIUS } from "@/constants/ui-radius";
import { cn } from "@/utils/cn";
import { Bell, ShoppingBag, ShoppingCart, User } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ProfileLayoutNavDesktop() {
  const t = useTranslations("ProfileLayout.sidebar");
  const pathname = usePathname();

  const sidebarItems = [
    {
      type: "header",
      label: t("accountSettings"),
    },
    {
      type: "group",
      label: t("myAccount"),
      icon: User,
      items: [
        { href: "/profile", label: t("links.profile") },
        { href: "/profile/address", label: t("links.addresses") },
        { href: "/profile/password", label: t("links.changePassword") },
      ],
    },
    {
      type: "link",
      href: "/notifications",
      label: t("links.notifications"),
      icon: Bell,
    },
    {
      type: "link",
      href: "/orders",
      label: t("links.purchases"),
      icon: ShoppingBag,
    },
    {
      type: "link",
      href: "/cart",
      label: t("links.cart"),
      icon: ShoppingCart,
    },
  ];

  return (
    <div className="space-y-6">
      {sidebarItems.map((item, index) => {
        if (item.type === "header") {
          return (
            <h1
              key={index}
              className="text-content/40 mb-4 ml-1 text-sm font-bold tracking-wider uppercase"
            >
              {item.label}
            </h1>
          );
        }

        if (item.type === "group") {
          const Icon = item.icon;
          return (
            <div key={index} className="space-y-1">
              <div className="text-content mb-2 flex items-center gap-2 px-3 py-2 font-bold">
                {Icon && (
                  <Icon
                    className="text-content/60 h-5 w-5"
                    aria-hidden="true"
                  />
                )}
                {item.label}
              </div>
              <ul className="ml-4 space-y-1">
                {item.items?.map((subItem, subIndex) => (
                  <li key={subIndex}>
                    <Link
                      href={subItem.href}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 text-sm font-medium transition-all",
                        UI_RADIUS.control,
                        pathname === subItem.href
                          ? "bg-primary/10 text-primary font-semibold"
                          : "text-content/60 hover:bg-content/5",
                      )}
                    >
                      <LiquidWaveText
                        isActive={pathname === subItem.href}
                        inactiveClassName="text-content/60"
                      >
                        {subItem.label}
                      </LiquidWaveText>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        }

        if (item.type === "link") {
          const Icon = item.icon;
          return (
            <div key={index}>
              <Link
                href={item.href || "/"}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 text-sm font-bold transition-all",
                  UI_RADIUS.control,
                  pathname === item.href
                    ? "bg-primary/10 text-primary"
                    : "text-content/80 hover:bg-primary/5",
                )}
              >
                {Icon && (
                  <Icon
                    className="text-content/60 h-5 w-5"
                    aria-hidden="true"
                  />
                )}
                <LiquidWaveText
                  isActive={pathname === item.href}
                  inactiveClassName="text-content/80"
                >
                  {item.label}
                </LiquidWaveText>
              </Link>
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}
