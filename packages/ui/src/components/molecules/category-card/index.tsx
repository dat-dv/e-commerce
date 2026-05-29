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
        "group border-content/10 relative flex h-20 w-full items-center justify-between overflow-hidden border px-5 transition-all",
      )}
    >
      <div
        className={`absolute top-0 right-0 h-20 w-20 bg-gradient-to-br from-current to-transparent opacity-[0.02] blur-2xl transition-opacity group-hover:opacity-[0.08] ${color}`}
      />
      <div className="min-w-0 flex-1 pr-3">
        <h3 className="text-content group-hover:text-primary line-clamp-1 font-bold capitalize transition-colors">
          {name}
        </h3>
        {showCount && <p className="text-content/40 mt-0.5 text-xs">{count}</p>}
      </div>
      {image ? (
        <Image
          width={80}
          loading="eager"
          height={80}
          src={image}
          alt={name}
          className={cn(UI_RADIUS.media, "h-10 w-10 shrink-0 object-cover")}
        />
      ) : (
        <Icon
          className={`h-5 w-5 ${color} shrink-0 opacity-30 transition-opacity group-hover:opacity-100`}
        />
      )}
    </Link>
  );
};
