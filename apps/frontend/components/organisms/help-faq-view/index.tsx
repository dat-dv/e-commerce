"use client";

import AppContainer from "@/components/atoms/app-container";
import { getRawI18nValue } from "@/utils/i18n";
import { useTranslations } from "next-intl";
import React, { useMemo, useState } from "react";
import FAQHeader from "./faq-header";
import { FAQContent } from "./faq-content";
import { FAQSidebar } from "./faq-sidebar";
import { FAQTopic } from "./help-faq.types";
import { filterFAQTopics } from "./help-faq.utils";

export function HelpFAQView(): React.ReactElement {
  const tFAQ = useTranslations("HelpCenter.faq");
  const topics = getRawI18nValue<FAQTopic[]>(tFAQ.raw("topics"));
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTopics = useMemo(() => {
    return filterFAQTopics(topics, searchQuery);
  }, [searchQuery, topics]);

  return (
    <div className="pb-16 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <FAQHeader />
      <AppContainer size="2xl" className="py-10 sm:py-14">
        <div className="grid gap-10 lg:grid-cols-[280px_1fr]">
          <FAQSidebar
            topics={topics}
            contactTitle={tFAQ("contactTitle")}
            contactDescription={tFAQ("contactDesc")}
            contactCta={tFAQ("contactCta")}
          />

          <FAQContent
            topics={filteredTopics}
            searchQuery={searchQuery}
            searchPlaceholder={tFAQ("search")}
            emptyText={tFAQ("empty")}
            contactTitle={tFAQ("contactTitle")}
            contactDescription={tFAQ("contactDesc")}
            onSearchChange={setSearchQuery}
          />
        </div>
      </AppContainer>
    </div>
  );
}

export default HelpFAQView;
