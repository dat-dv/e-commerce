"use client";

import { HelpSupportCard } from "@ecommerce/ui";
import { HelpTopicNav } from "@ecommerce/ui";
import { FAQTopic } from "./help-faq.types";
import { APP_ROUTES } from "@/constants/routes";
import Link from "next/link";

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
    <aside className="min-w-0 self-start lg:top-32">
      <HelpSupportCard
        title={contactTitle}
        description={contactDescription}
        ctaLabel={contactCta}
        showCta
        ctaHref={APP_ROUTES.CONTACT}
        linkComponent={Link}
      />

      <HelpTopicNav topics={topics.map((topic) => topic.name)} />
    </aside>
  );
}
