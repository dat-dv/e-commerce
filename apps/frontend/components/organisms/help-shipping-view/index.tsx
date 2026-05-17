"use client";

import React, { useState, useMemo } from "react";
import SidebarLayout from "@/components/molecules/sidebar-layout";
import Fuse from "fuse.js";
import ShippingHeader from "./shipping-header";
import ShippingSidebar from "./shipping-sidebar";
import ShippingList from "./shipping-list";

interface FAQItem {
  q: string;
  a: string;
}

interface ShippingTopic {
  name: string;
  faqs: FAQItem[];
}

const SHIPPING_TOPICS: ShippingTopic[] = [
  {
    name: "Shipping Methods",
    faqs: [
      {
        q: "Can I choose the shipping courier?",
        a: "Currently, we automatically select the best courier for your area to ensure the fastest delivery.",
      },
      {
        q: "Do you offer express shipping?",
        a: "Yes, express shipping is available for selected areas. You can choose it during checkout.",
      },
    ],
  },
  {
    name: "Order Tracking",
    faqs: [
      {
        q: "How do I track my order?",
        a: 'You can track your order in the "My Orders" section by clicking on the order to see its status. The shipper will contact you when the order is being delivered.',
      },
      {
        q: "Why is my tracking status not updating?",
        a: "It may take up to 24 hours for the courier to update the tracking status after pickup.",
      },
    ],
  },
  {
    name: "Shipping Fees",
    faqs: [
      {
        q: "How do I calculate shipping fees?",
        a: "Shipping fees are calculated automatically based on the distance from the seller and the weight of the items.",
      },
      {
        q: "How can I get free shipping?",
        a: "You can use free shipping vouchers or purchase from shops that offer free shipping promotions.",
      },
    ],
  },
  {
    name: "Delivery Times",
    faqs: [
      {
        q: "How long does shipping take?",
        a: "Standard shipping usually takes 2-5 business days depending on your location.",
      },
      {
        q: "What if I am not home when the shipper arrives?",
        a: "The shipper will attempt to contact you. If unsuccessful, they will try again the next day. Maximum 3 attempts.",
      },
    ],
  },
  {
    name: "Lost Packages",
    faqs: [
      {
        q: "What happens if my package is lost?",
        a: "If your package is lost in transit, please contact support and we will investigate with the courier.",
      },
      {
        q: "What should I do if the package is damaged?",
        a: "Do not accept the package if it is heavily damaged. Take a photo and contact support immediately.",
      },
    ],
  },
  {
    name: "International Shipping",
    faqs: [
      {
        q: "Do you ship internationally?",
        a: "Currently, we only ship within the country. International shipping is not supported yet.",
      },
    ],
  },
];

export const HelpShippingView = (): React.ReactElement => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTopics = useMemo(() => {
    if (!searchQuery.trim()) {
      return SHIPPING_TOPICS;
    }

    const searchableFaqs = SHIPPING_TOPICS.flatMap((topic) =>
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

    return SHIPPING_TOPICS.map((topic) => ({
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
      header={<ShippingHeader />}
      sidebar={<ShippingSidebar tocItems={tocItems} />}
    >
      <ShippingList
        filteredTopics={filteredTopics}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
    </SidebarLayout>
  );
};

export default HelpShippingView;
