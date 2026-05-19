"use client";

import AppContainer from "@/components/atoms/app-container";
import Accordion from "@/components/molecules/accordion";
import HelpSupportCard from "@/components/molecules/help-support-card";
import HelpTopicNav, {
  getHelpTopicId,
} from "@/components/molecules/help-topic-nav";
import { useLocale, useTranslations } from "next-intl";
import Fuse from "fuse.js";
import {
  AlertTriangle,
  Clock,
  MapPin,
  PackageSearch,
  Search,
} from "lucide-react";
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
  const tShipping = useTranslations("HelpCenter");
  const t = tShipping.raw("shipping" as never) as {
    contactTitle: string;
    contactDesc: string;
    contactCta: string;
    search: string;
    empty: string;
    topics: ShippingTopic[];
  };
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTopics = useMemo(() => {
    if (!searchQuery.trim()) return t.topics;

    const searchableFaqs = t.topics.flatMap((topic: ShippingTopic) =>
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

    return t.topics
      .map((topic: ShippingTopic) => ({
        ...topic,
        faqs: grouped.get(topic.name) ?? [],
      }))
      .filter((topic: ShippingTopic) => topic.faqs.length > 0);
  }, [searchQuery, t.topics]);

  return (
    <div className="pb-16 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <ShippingHeader />
      <AppContainer size="2xl" className="py-10 sm:py-14">
        <section className="grid gap-10 lg:grid-cols-[280px_1fr]">
          <aside className="self-start lg:top-32">
            <HelpSupportCard
              title={t.contactTitle}
              description={t.contactDesc}
              ctaLabel={t.contactCta}
              showCta
            />

            <HelpTopicNav
              topics={t.topics.map((topic: ShippingTopic) => topic.name)}
            />
          </aside>

          <main className="min-w-0">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-content/35" />
              <label htmlFor="help-shipping-search" className="sr-only">
                {t.search}
              </label>
              <input
                id="help-shipping-search"
                name="help-shipping-search"
                type="search"
                autoComplete="off"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder={t.search}
                className="h-12 w-full rounded-xl border border-content/10 bg-surface px-12 text-sm font-medium shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="mt-8 space-y-8">
              {filteredTopics.map((topic: ShippingTopic) => {
                const Icon = iconMap[topic.icon as IconName];
                return (
                  <section
                    key={topic.name}
                    id={getHelpTopicId(topic.name)}
                    className="scroll-mt-28"
                  >
                    <div className="mb-4 flex items-center gap-3">
                      <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Icon className="size-5" />
                      </span>
                      <h2 className="text-xl font-black text-content">
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
              <div className="mt-8 rounded-xl border border-content/5 bg-surface p-8 text-center text-sm text-content/55">
                {t.empty}
              </div>
            )}

            <HelpSupportCard
              title={t.contactTitle}
              description={t.contactDesc}
              className="mt-10 p-6"
            />
          </main>
        </section>
      </AppContainer>
    </div>
  );
};

export default HelpShippingView;
