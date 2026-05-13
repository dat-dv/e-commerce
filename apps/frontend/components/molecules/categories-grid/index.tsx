"use client";

import React from "react";
import Link from "next/link";
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
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {categories.map((cat) => (
        <Link
          key={cat.name}
          href={APP_ROUTES.CATEGORY_DETAIL(cat.slug || cat.name.toLowerCase())}
          className="group relative h-32 bg-content/[0.02] border border-content/[0.05] hover:border-content/[0.1] rounded-2xl p-6 flex flex-col justify-between transition-all overflow-hidden"
        >
          <div
            className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-current to-transparent opacity-[0.02] group-hover:opacity-[0.08] blur-2xl transition-opacity ${cat.color}`}
          />
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-content group-hover:text-primary transition-colors">
                {cat.name}
              </h3>
              <p className="text-xs text-content/40">{cat.count}</p>
            </div>
            {cat.image ? (
              <Image
                width={20}
                height={20}
                src={cat.image}
                alt={cat.name}
                className="w-10 h-10 object-cover rounded-xl"
              />
            ) : (
              <cat.icon
                className={`w-6 h-6 ${cat.color} opacity-30 group-hover:opacity-100 transition-opacity`}
              />
            )}
          </div>
          <div className="w-8 h-8 bg-surface border border-content/[0.05] rounded-full flex items-center justify-center self-end group-hover:bg-content/5 transition-colors">
            <ArrowRight className="w-4 h-4 text-content/60 group-hover:translate-x-0.5 transition-all" />
          </div>
        </Link>
      ))}
    </div>
  );
};
