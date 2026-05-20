import Fuse from "fuse.js";
import {
  CreditCard,
  PackageCheck,
  RotateCcw,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { FAQItem, FAQTopic } from "./help-faq.types";

export const faqIconMap = {
  "credit-card": CreditCard,
  "package-check": PackageCheck,
  "rotate-ccw": RotateCcw,
  "shield-check": ShieldCheck,
  truck: Truck,
};

export type FAQIconName = keyof typeof faqIconMap;

export const filterFAQTopics = (
  topics: FAQTopic[],
  searchQuery: string,
): FAQTopic[] => {
  if (!searchQuery.trim()) return topics;

  const searchableFaqs = topics.flatMap((topic) =>
    topic.faqs.map((faq) => ({ ...faq, topicName: topic.name })),
  );

  const fuse = new Fuse(searchableFaqs, {
    keys: ["q", "a", "topicName"],
    threshold: 0.35,
    ignoreLocation: true,
  });

  const grouped = new Map<string, FAQItem[]>();
  fuse.search(searchQuery).forEach(({ item }) => {
    grouped.set(item.topicName, [
      ...(grouped.get(item.topicName) ?? []),
      { q: item.q, a: item.a },
    ]);
  });

  return topics
    .map((topic) => ({
      ...topic,
      faqs: grouped.get(topic.name) ?? [],
    }))
    .filter((topic) => topic.faqs.length > 0);
};
