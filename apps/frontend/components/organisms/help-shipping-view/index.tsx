"use client";

import { Accordion, AppContainer, SearchInput } from "@ecommerce/ui";
import HelpSupportCard from "@/components/molecules/help-support-card";
import HelpTopicNav, {
  getHelpTopicId,
} from "@/components/molecules/help-topic-nav";

import { getRawI18nValue } from "@/utils/i18n";
import Fuse from "fuse.js";
import { AlertTriangle, Clock, MapPin, PackageSearch } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useMemo, useState } from "react";
import ShippingHeader from "./shipping-header";

interface FAQItem {
  q: string;
  a: string;
}

interface ShippingTopic {
  name: string;
  icon: string;
  faqs: FAQItem[];
}

const iconMap = {
  "alert-triangle": AlertTriangle,
  clock: Clock,
  "map-pin": MapPin,
  "package-search": PackageSearch,
};

type IconName = keyof typeof iconMap;

export const HelpShippingView = (): React.ReactElement => {
  const tShipping = useTranslations("HelpCenter.shipping");
  const topics = getRawI18nValue<ShippingTopic[]>(tShipping.raw("topics"));

  const [searchQuery, setSearchQuery] = useState("");

  const filteredTopics = useMemo(() => {
    if (!searchQuery.trim()) return topics;

    const searchableFaqs = topics.flatMap((topic: ShippingTopic) =>
      topic.faqs.map((faq: FAQItem) => ({ ...faq, topicName: topic.name })),
    );

    const fuse = new Fuse(searchableFaqs, {
      keys: ["q", "a", "topicName"],
      threshold: 0.35,
      ignoreLocation: true,
    });

    const grouped = new Map<string, FAQItem[]>();
    fuse.search(searchQuery).forEach(({ item }) => {
      const typedItem = item as FAQItem & { topicName: string };
      grouped.set(typedItem.topicName, [
        ...(grouped.get(typedItem.topicName) ?? []),
        { q: typedItem.q, a: typedItem.a },
      ]);
    });

    return topics
      .map((topic: ShippingTopic) => ({
        ...topic,
        faqs: grouped.get(topic.name) ?? [],
      }))
      .filter((topic: ShippingTopic) => topic.faqs.length > 0);
  }, [searchQuery, topics]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-6 pb-12 duration-700 sm:pb-16">
      <ShippingHeader />
      <AppContainer size="2xl" className="py-6 sm:py-10 lg:py-14">
        <section className="grid gap-6 lg:grid-cols-[280px_1fr] lg:gap-10">
          <aside className="min-w-0 self-start lg:top-32">
            <HelpSupportCard
              title={tShipping("contactTitle")}
              description={tShipping("contactDesc")}
              ctaLabel={tShipping("contactCta")}
              showCta
            />

            <HelpTopicNav
              topics={topics.map((topic: ShippingTopic) => topic.name)}
            />
          </aside>

          <main className="min-w-0">
            <SearchInput
              id="help-shipping-search"
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder={tShipping("search")}
              showSubmitButton={false}
              className="bg-surface rounded-xl shadow-sm"
            />

            <div className="mt-6 space-y-7 sm:mt-8 sm:space-y-8">
              {filteredTopics.map((topic: ShippingTopic) => {
                const Icon = iconMap[topic.icon as IconName];
                return (
                  <section
                    key={topic.name}
                    id={getHelpTopicId(topic.name)}
                    className="scroll-mt-28"
                  >
                    <div className="mb-4 flex min-w-0 items-center gap-3">
                      <span className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-xl">
                        <Icon className="size-5" />
                      </span>
                      <h2 className="text-content min-w-0 text-lg font-black break-words sm:text-xl">
                        {topic.name}
                      </h2>
                    </div>
                    <div className="space-y-3">
                      {topic.faqs.map((faq: FAQItem) => (
                        <Accordion key={faq.q} title={faq.q}>
                          {faq.a}
                        </Accordion>
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>

            {!filteredTopics.length && (
              <div className="border-content/5 bg-surface text-content/55 mt-8 rounded-xl border p-5 text-center text-sm sm:p-8">
                {tShipping("empty")}
              </div>
            )}

            <HelpSupportCard
              title={tShipping("contactTitle")}
              description={tShipping("contactDesc")}
              className="mt-10 p-6"
            />
          </main>
        </section>
      </AppContainer>
    </div>
  );
};

export default HelpShippingView;
