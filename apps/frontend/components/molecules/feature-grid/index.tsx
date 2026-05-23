"use client";

import { TYPOGRAPHY } from "@/constants/typography";
import { UI_RADIUS } from "@/constants/ui-radius";
import { cn } from "@/utils/cn";
import { ArrowRight, LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useMemo } from "react";

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
    <nav
      className={cn(
        "hide-scrollbar flex w-full gap-3 overflow-x-auto pb-1 md:grid md:grid-cols-4 md:pb-0",
        classNames,
      )}
    >
      {items.map((item) => {
        const Icon = item.icon;
        const key = keyMap[item.name];
        const displayName = key ? translatedItems[key].name : item.name;
        const displayDesc = key ? translatedItems[key].desc : item.desc;

        return (
          <Link
            key={item.name}
            href={item.href || "#"}
            className={cn(
              "group border-content/10 bg-surface/50 hover:border-primary/20 hover:bg-primary/[0.04] flex w-[230px] shrink-0 items-center justify-between gap-2 border px-4 py-[14px] transition-all duration-300 md:w-auto md:shrink",
              UI_RADIUS.card,
            )}
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="bg-content/[0.04] text-content/45 group-hover:bg-primary/10 group-hover:text-primary flex size-10 shrink-0 items-center justify-center rounded-xl transition-colors">
                <Icon size={18} strokeWidth={2.2} />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-content group-hover:text-primary truncate text-sm font-black transition-colors">
                    {displayName}
                  </h3>

                  {item.badge && (
                    <span
                      className={`bg-primary/10 rounded-full px-2 py-0.5 ${TYPOGRAPHY.badge} text-primary tracking-[0.12em] uppercase`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>

                <p
                  className={`mt-0.5 truncate ${TYPOGRAPHY.caption} text-content/35 font-medium`}
                >
                  {displayDesc}
                </p>
              </div>
            </div>

            <ArrowRight
              size={15}
              className="text-content/20 group-hover:text-primary shrink-0 transition-all group-hover:translate-x-0.5"
            />
          </Link>
        );
      })}
    </nav>
  );
};
