"use client";

import React from "react";
import AnimatedPageHeader from "@/components/molecules/page-header-animation";
import {
  HelpCircle,
  LifeBuoy,
  Search,
  MessageSquare,
  Settings,
} from "lucide-react";
import AppContainer from "@/components/atoms/app-container";

interface HelpHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function HelpHeader({
  searchQuery,
  setSearchQuery,
}: HelpHeaderProps): React.ReactElement {
  return (
    <div className="mb-12">
      <AppContainer>
        <AnimatedPageHeader
          title="HELP"
          highlight="CENTER"
          description="Hello, how can we help you today? Search our database or browse categories below."
          icons={[HelpCircle, LifeBuoy, Search, MessageSquare, Settings]}
        />
      </AppContainer>

      {/* Dynamic Search Bar */}
      <div className="max-w-2xl mx-auto relative mt-[-40px] z-30 px-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Enter keywords or search popular articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-14 px-6 pl-14 rounded-2xl bg-surface border-2 border-content/10 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-base shadow-md"
          />
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-content/40 text-xl">
            🔍
          </div>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-content/40 hover:text-content text-sm font-medium transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default HelpHeader;
