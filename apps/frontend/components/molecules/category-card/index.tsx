"use client";

import React from "react";
import Link from "next/link";
import { LucideIcon, Sparkles } from "lucide-react";
import Image from "next/image";

interface CategoryCardProps {
  name: string;
  count: string;
  href?: string;
  icon?: LucideIcon;
  color?: string;
  image?: string;
}

export const CategoryCard = ({
  name,
  count,
  href = "/",
  icon: Icon = Sparkles,
  color = "text-primary",
  image,
}: CategoryCardProps) => {
  return (
    <Link
      href={href}
      className="group relative h-40 bg-surface/40 backdrop-blur-sm border border-content/5 hover:border-primary/20 rounded-[2rem] p-8 flex flex-col justify-between transition-all overflow-hidden w-full hover:shadow-2xl hover:shadow-primary/5"
    >
      <div
        className={`absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity`}
      />
      
      <div className="flex justify-between items-start relative z-10">
        <div className="flex-1">
          <h3 className="text-lg font-black text-content group-hover:text-primary transition-colors capitalize leading-tight mb-2">
            {name}
          </h3>
          <p className="text-[10px] uppercase tracking-widest font-black text-content/20">{count}</p>
        </div>
        
        {image ? (
          <div className="relative w-12 h-12 rounded-2xl overflow-hidden border border-content/5">
            <Image
              fill
              src={image}
              alt={name}
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>
        ) : (
          <div className="w-12 h-12 rounded-2xl bg-content/[0.03] flex items-center justify-center border border-content/5 group-hover:bg-primary/10 transition-colors">
            <Icon
              className={`w-5 h-5 ${color} opacity-20 group-hover:opacity-100 transition-all`}
            />
          </div>
        )}
      </div>

      <div className="flex justify-end relative z-10">
        <div className="text-[10px] uppercase tracking-[0.3em] font-black text-content/10 group-hover:text-primary group-hover:translate-x-1 transition-all">
          Explore Collection →
        </div>
      </div>
    </Link>
  );
};
