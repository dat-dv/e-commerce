"use client";

import HelpSupportCard from "@/components/molecules/help-support-card";
import HelpTopicNav from "@/components/molecules/help-topic-nav";
import { FAQTopic } from "./help-faq.types";

interface FAQSidebarProps {
  topics: FAQTopic[];
  contactTitle: string;
  contactDescription: string;
  contactCta: string;
}

export function FAQSidebar({
  topics,
  contactTitle,
  contactDescription,
  contactCta,
}: FAQSidebarProps): React.ReactElement {
  return (
    <aside className="self-start lg:top-32">
      <HelpSupportCard
        title={contactTitle}
        description={contactDescription}
        ctaLabel={contactCta}
        showCta
      />

      <HelpTopicNav topics={topics.map((topic) => topic.name)} />
    </aside>
  );
}
