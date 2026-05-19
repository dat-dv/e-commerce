"use client";

import AppContainer from "@/components/atoms/app-container";
import Input from "@/components/atoms/input";
import Accordion from "@/components/molecules/accordion";
import HelpSupportCard from "@/components/molecules/help-support-card";
import HelpTopicNav, {
  getHelpTopicId,
} from "@/components/molecules/help-topic-nav";
import { getRawI18nValue } from "@/utils/i18n";
import Fuse from "fuse.js";
import {
  CreditCard,
  PackageCheck,
  RotateCcw,
  Search,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useMemo, useState } from "react";
import FAQHeader from "./faq-header";

interface FAQItem {
  q: string;
  a: string;
}

interface Topic {
  name: string;
  icon: string;
  faqs: FAQItem[];
}

const iconMap = {
  "credit-card": CreditCard,
  "package-check": PackageCheck,
  "rotate-ccw": RotateCcw,
  "shield-check": ShieldCheck,
  truck: Truck,
};

type IconName = keyof typeof iconMap;

export function HelpFAQView(): React.ReactElement {
  const tFAQ = useTranslations("HelpCenter.faq");
  const topics = getRawI18nValue<Topic[]>(tFAQ.raw("topics"));
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTopics = useMemo(() => {
    if (!searchQuery.trim()) return topics;

    const searchableFaqs = topics.flatMap((topic: Topic) =>
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
      .map((topic: Topic) => ({
        ...topic,
        faqs: grouped.get(topic.name) ?? [],
      }))
      .filter((topic: Topic) => topic.faqs.length > 0);
  }, [searchQuery, topics]);

  return (
    <div className="pb-16 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <FAQHeader />
      <AppContainer size="2xl" className="py-10 sm:py-14">
        <div className="grid gap-10 lg:grid-cols-[280px_1fr]">
          <aside className="self-start lg:top-32">
            <HelpSupportCard
              title={tFAQ("contactTitle")}
              description={tFAQ("contactDesc")}
              ctaLabel={tFAQ("contactCta")}
              showCta
            />

            <HelpTopicNav topics={topics.map((topic: Topic) => topic.name)} />
          </aside>

          <main className="min-w-0">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-content/35" />
              <Input
                id="help-faq-search"
                name="help-faq-search"
                type="search"
                aria-label={tFAQ("search")}
                autoComplete="off"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder={tFAQ("search")}
                className="rounded-xl bg-surface px-12 text-sm font-medium"
              />
            </div>

            <div className="mt-8 space-y-8">
              {filteredTopics.map((topic: Topic) => {
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
                {tFAQ("empty")}
              </div>
            )}

            <HelpSupportCard
              title={tFAQ("contactTitle")}
              description={tFAQ("contactDesc")}
              className="mt-10 p-6"
            />
          </main>
        </div>
      </AppContainer>
    </div>
  );
}

export default HelpFAQView;
