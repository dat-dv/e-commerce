"use client";

import { LazySection } from "@ecommerce/ui";
import { cn } from "@/utils/cn";
import { ComponentPropsWithoutRef } from "react";
import FavoriteSection from "./favorite-section";
import RecentViewedSection from "./recent-viewed-section";
import RecommendedSection from "./recommend-section";

export interface IDiscoveryCarouselSectionProps extends ComponentPropsWithoutRef<"div"> {
  exclude?: Array<"recent-viewed" | "favorites" | "recommended">;
}

export const DiscoveryCarouselSection = ({
  exclude = [],
  className,
  ...props
}: IDiscoveryCarouselSectionProps) => {
  const showRecentViewed = !exclude.includes("recent-viewed");
  const showFavorites = !exclude.includes("favorites");
  const showRecommended = !exclude.includes("recommended");

  return (
    <div {...props} className={cn(className, "w-full space-y-12")}>
      {/* 1. Recently Viewed Products Section */}
      {showRecentViewed && (
        <LazySection>
          <RecentViewedSection />
        </LazySection>
      )}

      {/* 2. Favorite Products Section */}
      {showFavorites && (
        <LazySection>
          <FavoriteSection />
        </LazySection>
      )}

      {/* 3. Recommended Products Section */}
      {showRecommended && (
        <LazySection>
          <RecommendedSection />
        </LazySection>
      )}
    </div>
  );
};

export default DiscoveryCarouselSection;
