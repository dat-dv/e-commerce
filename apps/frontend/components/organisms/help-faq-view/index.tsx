"use client";

import React, { useState, useMemo } from "react";
import SidebarLayout from "@/components/molecules/sidebar-layout";
import Fuse from "fuse.js";
import FAQHeader from "./faq-header";
import FAQSidebar from "./faq-sidebar";
import FAQList from "./faq-list";

interface FAQItem {
  q: string;
  a: string;
}

interface FAQTopic {
  name: string;
  faqs: FAQItem[];
}

const FAQ_TOPICS: FAQTopic[] = [
  {
    name: "General",
    faqs: [
      {
        q: "[Fraud Alert] Shopping safely on Shop.Hub",
        a: "Always check the seller ratings and never share your password or OTP.",
      },
      {
        q: "[Service] How to contact Shop.Hub Customer Service",
        a: "Go to Help Center > Contact Us or use the live chat feature.",
      },
    ],
  },
  {
    name: "Account & Security",
    faqs: [
      {
        q: "How do I reset my password?",
        a: 'Go to the Sign In page and click on "Forgot Password". Follow the instructions sent to your email.',
      },
      {
        q: "How do I change my email address?",
        a: "Go to Profile Settings > Account to update your email address.",
      },
    ],
  },
  {
    name: "Payments",
    faqs: [
      {
        q: "What payment methods are supported?",
        a: "We support credit/debit cards, bank transfers, and Cash on Delivery (CoD).",
      },
      {
        q: "How do I use a voucher?",
        a: "Enter the voucher code at the checkout page before making payment.",
      },
    ],
  },
  {
    name: "Shipping & Delivery",
    faqs: [
      {
        q: "How do I track my order?",
        a: 'You can track your order in the "My Orders" section by clicking on the order to see its status. The shipper will contact you when the order is being delivered.',
      },
      {
        q: "How can I change my shipping address?",
        a: "You can change your shipping address before the order is shipped. Contact support immediately.",
      },
    ],
  },
  {
    name: "Returns & Refunds",
    faqs: [
      {
        q: "What is the return policy?",
        a: "We offer a 30-day return policy for most items. Items must be in original condition.",
      },
      {
        q: "How long does a refund take?",
        a: "Refunds usually take 3-5 business days to process after the return is approved.",
      },
    ],
  },
];

export function HelpFAQView(): React.ReactElement {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTopics = useMemo(() => {
    if (!searchQuery.trim()) {
      return FAQ_TOPICS;
    }

    const searchableFaqs = FAQ_TOPICS.flatMap((topic) =>
      topic.faqs.map((faq) => ({
        topicName: topic.name,
        q: faq.q,
        a: faq.a,
      })),
    );

    const fuse = new Fuse(searchableFaqs, {
      keys: [
        { name: "q", weight: 0.6 },
        { name: "a", weight: 0.3 },
        { name: "topicName", weight: 0.1 },
      ],
      threshold: 0.4,
      ignoreLocation: true,
    });

    const matchedFaqs = fuse.search(searchQuery).map((r) => r.item);

    const topicGroups: Record<string, FAQItem[]> = {};
    matchedFaqs.forEach((faq) => {
      if (!topicGroups[faq.topicName]) {
        topicGroups[faq.topicName] = [];
      }
      topicGroups[faq.topicName].push({ q: faq.q, a: faq.a });
    });

    return FAQ_TOPICS.map((topic) => ({
      name: topic.name,
      faqs: topicGroups[topic.name] || [],
    })).filter((topic) => topic.faqs.length > 0);
  }, [searchQuery]);

  const tocItems = useMemo(() => {
    return filteredTopics.map((topic) => ({
      id: topic.name.toLowerCase().replace(/\s+/g, "-"),
      title: topic.name,
    }));
  }, [filteredTopics]);

  return (
    <SidebarLayout
      header={<FAQHeader />}
      sidebar={<FAQSidebar tocItems={tocItems} />}
    >
      <FAQList
        filteredTopics={filteredTopics}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
    </SidebarLayout>
  );
}

export default HelpFAQView;
