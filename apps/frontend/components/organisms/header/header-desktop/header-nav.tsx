"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import LiquidWaveText from "@/components/atoms/liquid-wave-text";
import { HEADER_NAV_LINKS } from "@/constants/navigation";
import { TYPOGRAPHY } from "@/constants/typography";
import { cn } from "@/utils/cn";
import { useTranslations } from "next-intl";
import { CategoryHeaderNav } from "./category-header-nav";

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

const HeaderNav = () => {
  const pathname = usePathname();
  const t = useTranslations("Common.header.nav");

  return (
    <nav className="hidden items-center gap-6 md:flex">
      {HEADER_NAV_LINKS.map((link, idx) => {
        const isActive = link.exact
          ? pathname === link.href
          : pathname.startsWith(link.href);

        const key = navKeyMap[link.label];
        const displayLabel = key ? t(key) : link.label;

        if (link.dropdown) {
          return (
            <CategoryHeaderNav
              key={`${link.href}-${idx}`}
              label={displayLabel}
              isActive={isActive}
            />
          );
        }

        return (
          <Link
            key={`${link.href}-${idx}`}
            href={link.href}
            className={cn(
              "relative flex items-center gap-1.5 text-sm font-bold",
              isActive ? "text-primary" : "text-content/70",
            )}
          >
            <LiquidWaveText isActive={isActive}>{displayLabel}</LiquidWaveText>
            {link.badge && (
              <span
                className={`rounded-full bg-red-500 px-1.5 py-0.5 ${TYPOGRAPHY.badge} animate-pulse tracking-wider text-white uppercase`}
              >
                {link.badge}
              </span>
            )}
            {isActive && (
              <span className="bg-primary absolute -bottom-[22px] left-0 h-[2.5px] w-full rounded-full shadow-[0_-2px_8px_rgba(var(--primary),0.4)]" />
            )}
          </Link>
        );
      })}
    </nav>
  );
};

HeaderNav.displayName = "HeaderNav";

export default HeaderNav;
