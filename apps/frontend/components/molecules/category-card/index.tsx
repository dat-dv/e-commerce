"use client";

import React from "react";
import Link from "next/link";
import { LucideIcon, Sparkles } from "lucide-react";
import { APP_ROUTES } from "@/constants/routes";
import Image from "next/image";

interface CategoryCardProps {
  name: string;
  count: string;
  slug?: string;
  icon?: LucideIcon;
  color?: string;
  image?: string;
}

export const CategoryCard = ({
  name,
  count,
  slug,
  icon: Icon = Sparkles,
  color = "text-primary",
  image,
}: CategoryCardProps) => {
  return (
    <Link
      href={APP_ROUTES.CATEGORY_DETAIL(slug || name.toLowerCase())}
      className="group relative h-32 bg-content/[0.02] border border-content/[0.05] hover:border-content/[0.1] rounded-2xl p-6 flex flex-col justify-between transition-all overflow-hidden w-full"
    >
      <div
        className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-current to-transparent opacity-[0.02] group-hover:opacity-[0.08] blur-2xl transition-opacity ${color}`}
      />
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-content group-hover:text-primary transition-colors capitalize pr-1 line-clamp-2">
            {name}
          </h3>
          <p className="text-xs text-content/40">{count}</p>
        </div>
        {image ? (
          <Image
            width={100}
            height={100}
            src={image}
            alt={name}
            className="w-10 h-10 object-cover rounded-xl"
          />
        ) : (
          <Icon
            className={`w-6 h-6 ${color} opacity-30 group-hover:opacity-100 transition-opacity`}
          />
        )}
      </div>
    </Link>
  );
};
