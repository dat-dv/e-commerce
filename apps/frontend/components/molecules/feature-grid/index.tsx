"use client";

import { useMemo } from "react";
import { cn } from "@/utils/cn";
import { LucideIcon, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

interface FeatureItem {
  name: string;
  desc: string;
  icon: LucideIcon;
  color?: string;
  href?: string;
  badge?: string;
}

interface FeatureGridProps {
  items: FeatureItem[];
  classNames?: string;
}

const keyMap: Record<
  string,
  "flashSale" | "vouchers" | "topBrands" | "newArrivals"
> = {
  "Flash Sale": "flashSale",
  Vouchers: "vouchers",
  "Top Brands": "topBrands",
  "New Arrivals": "newArrivals",
};

export const FeatureGrid = ({ items, classNames }: FeatureGridProps) => {
  const t = useTranslations("HomePage.features");

  const translatedItems = useMemo(() => {
    return {
      flashSale: {
        name: t("flashSale.name"),
        desc: t("flashSale.desc"),
      },
      vouchers: {
        name: t("vouchers.name"),
        desc: t("vouchers.desc"),
      },
      topBrands: {
        name: t("topBrands.name"),
        desc: t("topBrands.desc"),
      },
      newArrivals: {
        name: t("newArrivals.name"),
        desc: t("newArrivals.desc"),
      },
    };
  }, [t]);

  return (
    <nav className={cn("grid grid-cols-2 gap-3 md:grid-cols-4", classNames)}>
      {items.map((item) => {
        const Icon = item.icon;
        const key = keyMap[item.name];
        const displayName = key ? translatedItems[key].name : item.name;
        const displayDesc = key ? translatedItems[key].desc : item.desc;

        return (
          <Link
            key={item.name}
            href={item.href || "#"}
            className="group flex items-center justify-between gap-2 rounded-2xl border border-content/10 bg-surface/50 px-4 py-[14px] transition-all duration-300 hover:border-primary/20 hover:bg-primary/[0.04]"
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-content/[0.04] text-content/45 transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                <Icon size={18} strokeWidth={2.2} />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="truncate text-sm font-black text-content transition-colors group-hover:text-primary">
                    {displayName}
                  </h3>

                  {item.badge && (
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.12em] text-primary">
                      {item.badge}
                    </span>
                  )}
                </div>

                <p className="mt-0.5 truncate text-xs font-medium text-content/35">
                  {displayDesc}
                </p>
              </div>
            </div>

            <ArrowRight
              size={15}
              className="shrink-0 text-content/20 transition-all group-hover:translate-x-0.5 group-hover:text-primary"
            />
          </Link>
        );
      })}
    </nav>
  );
};
