"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/utils/cn";
import { CategoryHeaderNav } from "./category-header-nav";
import { HEADER_NAV_LINKS } from "@/constants/navigation";
import { useTranslations } from "next-intl";

const navKeyMap: Record<string, string> = {
  Home: "home",
  Categories: "categories",
  "New Arrivals": "newArrivals",
  "Flash Sale": "flashSale",
  Brands: "brands",
};

const HeaderNav = () => {
  const pathname = usePathname();
  const t = useTranslations("Common.header.nav");

  return (
    <nav className="hidden md:flex items-center gap-6">
      {HEADER_NAV_LINKS.map((link) => {
        const isActive = link.exact
          ? pathname === link.href
          : pathname.startsWith(link.href);

        const key = navKeyMap[link.label];
        const displayLabel = key ? t(key) : link.label;

        if (link.dropdown) {
          return (
            <CategoryHeaderNav
              key={link.href}
              label={displayLabel}
              isActive={isActive}
            />
          );
        }

        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "relative text-sm font-bold transition-all hover:text-primary flex items-center gap-1.5",
              isActive ? "text-primary" : "text-content/80 hover:text-content",
            )}
          >
            {displayLabel}
            {link.badge && (
              <span className="px-1.5 py-0.5 rounded-full bg-red-500 text-[9px] text-white font-black uppercase tracking-wider animate-pulse">
                {link.badge}
              </span>
            )}
            {isActive && (
              <span className="absolute -bottom-[22px] left-0 h-[2.5px] w-full bg-primary rounded-full shadow-[0_-2px_8px_rgba(var(--primary),0.4)]" />
            )}
          </Link>
        );
      })}
    </nav>
  );
};

HeaderNav.displayName = "HeaderNav";

export default HeaderNav;
