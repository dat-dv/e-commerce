"use client";

import React from "react";
import LazySection from "@/components/molecules/lazy-section";
import RecentViewedSection from "./recent-viewed-section";
import RecommendedSection from "./recommend-section";
import FavoriteSection from "./favorite-section";

export const DiscoverySections = () => {
  return (
    <div className="w-full space-y-12">
      {/* 1. Recently Viewed Products Section */}
      <LazySection>
        <RecentViewedSection />
      </LazySection>

      {/* 2. Favorite Products Section */}
      <LazySection>
        <FavoriteSection />
      </LazySection>

      {/* 3. Recommended Products Section */}
      <LazySection>
        <RecommendedSection />
      </LazySection>
    </div>
  );
};

export default DiscoverySections;
