"use client";

import { UI_RADIUS } from "@/constants/ui-radius";
import { cn } from "@/utils/cn";
import { LucideIcon, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface CategoryCardProps {
  name: string;
  count: string;
  href?: string;
  icon?: LucideIcon;
  color?: string;
  image?: string;
  showCount?: boolean;
}

export const CategoryCard = ({
  name,
  count,
  href = "/",
  icon: Icon = Sparkles,
  color = "text-primary",
  image,
  showCount = true,
}: CategoryCardProps) => {
  return (
    <Link
      href={href}
      className={cn(
        UI_RADIUS.card,
        "group border-content/10 relative flex h-32 w-full flex-col justify-between overflow-hidden border p-6 transition-all",
      )}
    >
      <div
        className={`absolute top-0 right-0 h-24 w-24 bg-gradient-to-br from-current to-transparent opacity-[0.02] blur-2xl transition-opacity group-hover:opacity-[0.08] ${color}`}
      />
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-content group-hover:text-primary line-clamp-2 pr-1 font-bold capitalize transition-colors">
            {name}
          </h3>
          {showCount && <p className="text-content/40 text-xs">{count}</p>}
        </div>
        {image ? (
          <Image
            width={100}
            height={100}
            src={image}
            alt={name}
            className={cn(UI_RADIUS.media, "h-10 w-10 object-cover")}
          />
        ) : (
          <Icon
            className={`h-6 w-6 ${color} opacity-30 transition-opacity group-hover:opacity-100`}
          />
        )}
      </div>
    </Link>
  );
};
