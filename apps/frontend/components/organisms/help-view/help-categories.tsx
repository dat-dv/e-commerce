"use client";

import React from "react";
import Link from "next/link";

interface CategoryItem {
  emoji: string;
  title: string;
  desc: string;
  href: string;
}

interface HelpCategoriesProps {
  categories: CategoryItem[];
}

export function HelpCategories({
  categories,
}: HelpCategoriesProps): React.ReactElement {
  return (
    <div className="mb-16">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-content">Browse Categories</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {categories.map((cat, index) => (
          <Link
            key={index}
            href={cat.href}
            className="group border border-content/5 rounded-2xl p-6 flex flex-col items-start hover:border-primary/20 hover:bg-surface/50 transition-all cursor-pointer shadow-sm hover:shadow-md"
          >
            <div className="text-4xl mb-4 p-3 bg-surface rounded-xl border border-content/5 group-hover:scale-110 transition-transform">
              {cat.emoji}
            </div>
            <h3 className="text-lg font-bold text-content mb-1">{cat.title}</h3>
            <p className="text-content/60 text-xs">{cat.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default HelpCategories;
