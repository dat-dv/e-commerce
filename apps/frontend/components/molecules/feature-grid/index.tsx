"use client";

import { cn } from "@/utils/cn";
import { LucideIcon } from "lucide-react";
import Link from "next/link";

interface FeatureItem {
  name: string;
  desc: string;
  icon: LucideIcon;
  color: string;
  href?: string;
}

interface FeatureGridProps {
  items: FeatureItem[];
  classNames?: string;
}

export const FeatureGrid = ({ items, classNames }: FeatureGridProps) => {
  return (
    <div
      className={cn(
        "grid grid-cols-3 md:grid-cols-4 gap-4 justify-items-center",
        classNames,
      )}
    >
      {items.map((item) => (
        <Link
          key={item.name}
          href={item?.href || "#"}
          className="w-full bg-content/[0.02] border border-content/[0.05] rounded-2xl p-4 flex flex-col items-center gap-4 hover:bg-content/[0.04] hover:border-content/[0.1] hover:translate-y-[-2px] transition-all duration-300 group text-center"
        >
          <div className="w-10 h-10 rounded-xl bg-content/[0.03] flex items-center justify-center group-hover:bg-content/[0.05] transition-colors">
            <item.icon
              className={`w-5 h-5 ${item.color} group-hover:scale-110 transition-transform`}
            />
          </div>
          <div>
            <h3 className="text-sm font-bold text-content group-hover:text-primary transition-colors">
              {item.name}
            </h3>
            <p className="text-xs text-content/40 mt-0.5">{item.desc}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};
