"use client";

import Button from "@/components/atoms/button";
import { HEADER_NAV_LINKS } from "@/constants/navigation";
import { cn } from "@/utils/cn";
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
      <span className="mb-2 px-1 text-[11px] font-black uppercase tracking-[0.18em] text-content/35">
        {t("navigation")}
      </span>
      {HEADER_NAV_LINKS.map((link) => {
        const isActive = link.exact
          ? pathname === link.href
          : pathname.startsWith(link.href);
        const key = navKeyMap[link.label];
        const displayLabel = key ? tNav(key) : link.label;
        const Icon = iconMap[link.label] ?? Home;

        return (
          <Button
            key={link.href}
            variant="ghost"
            href={link.href}
            onClick={onClose}
            className={cn(
              "flex h-11 w-full items-center justify-start rounded-lg px-2 text-left text-sm font-bold transition-colors",
              isActive
                ? "bg-primary/10 text-primary"
                : "text-content/70 hover:bg-content/[0.04] hover:text-content",
            )}
          >
            <span
              className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-md",
                isActive ? "bg-primary text-white" : "bg-content/[0.04]",
              )}
            >
              <Icon size={16} />
            </span>
            <span className="ml-3 flex min-w-0 flex-1 items-center gap-2 truncate">
              {displayLabel}
              {link.badge && (
                <span className="rounded-full bg-red-500 px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider text-white">
                  {link.badge}
                </span>
              )}
            </span>
          </Button>
        );
      })}
    </nav>
  );
}
