"use client";

import React from "react";
import LazySection from "@/components/molecules/lazy-section";
import RecentViewedSection from "./recent-viewed-section";
import RecommendedSection from "./recommend-section";
import FavoriteSection from "./favorite-section";
import { useConfig } from "@/hooks/config/use-config";

export interface DiscoverySectionsProps {
  exclude?: Array<"recent-viewed" | "favorites" | "recommended">;
}

export const DiscoverySections = ({ exclude = [] }: DiscoverySectionsProps) => {
  const showRecentViewed = !exclude.includes("recent-viewed");
  const showFavorites = !exclude.includes("favorites");
  const showRecommended = !exclude.includes("recommended");

  return (
    <div className="w-full space-y-12">
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

export default DiscoverySections;
