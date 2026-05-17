"use client";

import React from "react";
import LazySection from "@/components/molecules/lazy-section";
import RecentViewedSection from "./recent-viewed-section";

export const DiscoverySections = () => {
  return (
    <div className="w-full space-y-12">
      {/* 1. Recently Viewed Products Section */}
      <LazySection>
        <RecentViewedSection />
      </LazySection>

      {/* Other sections can be added here seamlessly, e.g.:
      <LazySection placeholder={<RecommendedSectionSkeleton />}>
        <RecommendedSection />
      </LazySection>
      */}
    </div>
  );
};

export default DiscoverySections;
