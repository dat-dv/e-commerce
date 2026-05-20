"use client";

import Button from "@/components/atoms/button";
import { HEADER_NAV_LINKS } from "@/constants/navigation";
import { cn } from "@/utils/cn";
import { ChevronRight } from "lucide-react";
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

  return (
    <nav className="flex flex-col gap-1 mb-8">
      <span className="text-xs font-semibold text-content/40 uppercase tracking-wider px-3 mb-2">
        {t("navigation")}
      </span>
      {HEADER_NAV_LINKS.map((link) => {
        const isActive = link.exact
          ? pathname === link.href
          : pathname.startsWith(link.href);
        const key = navKeyMap[link.label];
        const displayLabel = key ? tNav(key) : link.label;

        return (
          <Button
            key={link.href}
            variant="ghost"
            href={link.href}
            onClick={onClose}
            className={cn(
              "flex items-center justify-between px-3 py-3 rounded-xl text-sm font-bold transition-colors w-full text-left h-auto",
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
          </Button>
        );
      })}
    </nav>
  );
}
