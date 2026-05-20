"use client";

import AppContainer from "@/components/atoms/app-container";
import AnimatedPageHeader from "@/components/molecules/page-header-animation";
import SearchInput from "@/components/molecules/search-input";
import {
  HelpCircle,
  LifeBuoy,
  MessageSquare,
  Search,
  Settings,
} from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

interface HelpHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function HelpHeader({
  searchQuery,
  setSearchQuery,
}: HelpHeaderProps): React.ReactElement {
  const t = useTranslations("HelpCenter.headers.help");
  const title = t("title");
  const highlight = t("highlight");
  const description = t("description");
  const placeholder = t("placeholder");
  const clearLabel = t("clear");

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

      <div className="max-w-2xl mx-auto relative mt-[-40px] z-30 px-4">
        <SearchInput
          id="help-header-search"
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder={placeholder}
          clearButtonLabel={clearLabel}
          showSubmitButton={false}
          className="rounded-2xl border-2 border-content/10 bg-surface shadow-md"
          inputClassName="py-3.5 text-base"
        />
      </div>
    </div>
  );
}

export default HelpHeader;
