"use client";

import React from "react";
import AnimatedPageHeader from "@/components/molecules/page-header-animation";
import AppContainer from "@/components/atoms/app-container";
import { useAppConfig } from "@/hooks/config/use-config-store";
import {
  HelpCircle,
  LifeBuoy,
  Search,
  MessageSquare,
  Settings,
} from "lucide-react";

interface HelpHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function HelpHeader({
  searchQuery,
  setSearchQuery,
}: HelpHeaderProps): React.ReactElement {
  const language = useAppConfig((state) => state.language);
  const isVietnamese = language === "vi";
  const title = isVietnamese ? "TRỢ GIÚP" : "HELP";
  const highlight = isVietnamese ? "SHOP.HUB" : "CENTER";
  const description = isVietnamese
    ? "Bạn cần hỗ trợ gì hôm nay? Tìm nhanh câu trả lời hoặc duyệt các chủ đề bên dưới."
    : "Hello, how can we help you today? Search our database or browse categories below.";
  const placeholder = isVietnamese
    ? "Nhập từ khóa hoặc tìm bài viết phổ biến..."
    : "Enter keywords or search popular articles...";
  const clearLabel = isVietnamese ? "Xóa" : "Clear";

  return (
    <div className="mb-12">
      <AppContainer>
        <AnimatedPageHeader
          title={title}
          highlight={highlight}
          description={description}
          icons={[HelpCircle, LifeBuoy, Search, MessageSquare, Settings]}
          center={true}
        />
      </AppContainer>

      {/* Dynamic Search Bar */}
      <div className="max-w-2xl mx-auto relative mt-[-40px] z-30 px-4">
        <div className="relative">
          <label htmlFor="help-header-search" className="sr-only">
            {placeholder}
          </label>
          <input
            id="help-header-search"
            name="help-header-search"
            type="search"
            autoComplete="off"
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-14 px-6 pl-14 rounded-2xl bg-surface border-2 border-content/10 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-base shadow-md"
          />
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-content/40 text-xl">
            🔍
          </div>
          {searchQuery && (
            <button
              type="button"
              aria-label={clearLabel}
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-content/40 hover:text-content text-sm font-medium transition-colors"
            >
              {clearLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default HelpHeader;
