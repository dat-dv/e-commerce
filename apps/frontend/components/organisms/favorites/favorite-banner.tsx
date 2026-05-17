"use client";

import AnimatedPageHeader from "@/components/molecules/page-header-animation";
import { Heart, Sparkles, ShoppingBag, Package } from "lucide-react";

const WISHLIST_ICONS = [Heart, Sparkles, ShoppingBag, Package];

const FavoritesBanner = ({ count }: { count: number }) => {
  return (
    <AnimatedPageHeader
      title="Wish"
      highlight="List"
      description="Your private gallery of curated desires. Ready to be transformed into reality."
      icons={WISHLIST_ICONS}
      rightContent={
        <div className="flex flex-col items-center md:items-end">
          <span className="text-3xl md:text-4xl font-black text-content tabular-nums">
            {count.toString().padStart(2, "0")}
          </span>

          <span className="text-xs font-medium text-content/30">
            Total Items
          </span>
        </div>
      }
    />
  );
};

export default FavoritesBanner;
