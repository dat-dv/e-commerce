"use client";

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

const keyMap: Record<string, string> = {
  "Flash Sale": "flashSale",
  Vouchers: "vouchers",
  "Top Brands": "topBrands",
  "New Arrivals": "newArrivals",
};

export const FeatureGrid = ({ items, classNames }: FeatureGridProps) => {
  const t = useTranslations("HomePage.features");

  return (
    <nav className={cn("grid grid-cols-2 gap-3 md:grid-cols-4", classNames)}>
      {items.map((item) => {
        const Icon = item.icon;
        const key = keyMap[item.name];
        const displayName = key ? t(`${key}.name`) : item.name;
        const displayDesc = key ? t(`${key}.desc`) : item.desc;

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
