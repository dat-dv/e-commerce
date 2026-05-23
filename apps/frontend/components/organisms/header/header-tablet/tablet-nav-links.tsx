"use client";

import { HEADER_NAV_LINKS } from "@/constants/navigation";
import { TYPOGRAPHY } from "@/constants/typography";
import {
  Flame,
  Grid2X2,
  Home,
  PackagePlus,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import MobileDrawerAction, {
  MobileDrawerSectionTitle,
} from "./tablet-drawer-action";

interface IMobileNavLinksProps {
  onClose: () => void;
}

export default function MobileNavLinks({ onClose }: IMobileNavLinksProps) {
  const pathname = usePathname();
  const t = useTranslations("Common.header");
  const tNav = useTranslations("Common.header.nav");

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

  const iconMap: Record<string, LucideIcon> = {
    Home,
    Categories: Grid2X2,
    "New Arrivals": PackagePlus,
    "Flash Sale": Flame,
    Brands: ShieldCheck,
  };

  return (
    <nav className="mb-5 flex flex-col gap-1">
      <MobileDrawerSectionTitle>{t("navigation")}</MobileDrawerSectionTitle>
      {HEADER_NAV_LINKS.map((link) => {
        const isActive = link.exact
          ? pathname === link.href
          : pathname.startsWith(link.href);
        const key = navKeyMap[link.label];
        const displayLabel = key ? tNav(key) : link.label;
        const Icon = iconMap[link.label] ?? Home;

        return (
          <MobileDrawerAction
            key={link.href}
            href={link.href}
            onClick={onClose}
            icon={Icon}
            label={displayLabel}
            isActive={isActive}
            badge={
              link.badge ? (
                <span
                  className={`rounded-full bg-red-500 px-1.5 py-0.5 ${TYPOGRAPHY.badge} tracking-wider text-white uppercase`}
                >
                  {link.badge}
                </span>
              ) : undefined
            }
          />
        );
      })}
    </nav>
  );
}
