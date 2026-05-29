"use client";

import { SearchInput } from "@ecommerce/ui";
import { HelpSupportCard } from "@ecommerce/ui";

import { FAQTopic } from "./help-faq.types";
import { FAQTopicList } from "./faq-topic-list";

interface FAQContentProps {
  topics: FAQTopic[];
  searchQuery: string;
  searchPlaceholder: string;
  emptyText: string;
  contactTitle: string;
  contactDescription: string;
  onSearchChange: (query: string) => void;
}

export function FAQContent({
  topics,
  searchQuery,
  searchPlaceholder,
  emptyText,
  contactTitle,
  contactDescription,
  onSearchChange,
}: FAQContentProps): React.ReactElement {
  return (
    <main className="min-w-0">
      <SearchInput
        id="help-faq-search"
        value={searchQuery}
        onChange={onSearchChange}
        placeholder={searchPlaceholder}
        showSubmitButton={false}
        className="bg-surface rounded-xl shadow-sm"
      />

      <FAQTopicList topics={topics} />

      {!topics.length && (
        <div className="border-content/5 bg-surface text-content/55 mt-8 rounded-xl border p-8 text-center text-sm">
          {emptyText}
        </div>
      )}

      <HelpSupportCard
        title={contactTitle}
        description={contactDescription}
        className="mt-10 p-6"
      />
    </main>
  );
}
