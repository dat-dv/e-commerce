"use client";

import React from "react";
import Link from "next/link";
import { CATEGORY_GRID_CLASS_NAME } from "@/constants/grid-presets";
import { APP_ROUTES } from "@/constants/routes";
import { ArrowRight, LucideIcon } from "lucide-react";
import Image from "next/image";

interface Category {
  name: string;
  count: string;
  slug?: string;
  icon: LucideIcon;
  color: string;
  image?: string;
}

interface CategoriesGridProps {
  categories: Category[];
}

export const CategoriesGrid = ({ categories }: CategoriesGridProps) => {
  return (
    <div className={CATEGORY_GRID_CLASS_NAME}>
      {categories.map((cat) => (
        <Link
          key={cat.name}
          href={APP_ROUTES.CATEGORY_DETAIL(cat.slug || cat.name.toLowerCase())}
          className="group bg-content/[0.02] border-content/[0.05] hover:border-content/[0.1] relative flex h-32 flex-col justify-between overflow-hidden rounded-2xl border p-6 transition-all"
        >
          <div
            className={`absolute top-0 right-0 h-24 w-24 bg-gradient-to-br from-current to-transparent opacity-[0.02] blur-2xl transition-opacity group-hover:opacity-[0.08] ${cat.color}`}
          />
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-content group-hover:text-primary font-bold transition-colors">
                {cat.name}
              </h3>
              <p className="text-content/40 text-xs">{cat.count}</p>
            </div>
            {cat.image ? (
              <Image
                width={20}
                height={20}
                src={cat.image}
                alt={cat.name}
                className="h-10 w-10 rounded-xl object-cover"
              />
            ) : (
              <cat.icon
                className={`h-6 w-6 ${cat.color} opacity-30 transition-opacity group-hover:opacity-100`}
              />
            )}
          </div>
          <div className="bg-surface border-content/[0.05] group-hover:bg-content/5 flex h-8 w-8 items-center justify-center self-end rounded-full border transition-colors">
            <ArrowRight className="text-content/60 h-4 w-4 transition-all group-hover:translate-x-0.5" />
          </div>
        </Link>
      ))}
    </div>
  );
};
