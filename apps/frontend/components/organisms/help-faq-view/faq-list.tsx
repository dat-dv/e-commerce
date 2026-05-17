"use client";

import React from "react";
import Accordion from "@/components/molecules/accordion";

interface FAQItem {
  q: string;
  a: string;
}

interface FAQTopic {
  name: string;
  faqs: FAQItem[];
}

interface FAQListProps {
  filteredTopics: FAQTopic[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function FAQList({
  filteredTopics,
  searchQuery,
  setSearchQuery,
}: FAQListProps): React.ReactElement {
  return (
    <>
      {/* Search inside FAQ */}
      <div className="mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Search FAQs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 px-5 pl-12 rounded-2xl bg-surface border-2 border-content/5 focus:outline-none focus:border-primary transition-all text-sm shadow-sm"
          />
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-content/40">
            🔍
          </div>
        </div>
      </div>

      {/* Accordion List Grouped by Topic */}
      <div className="space-y-10">
        {filteredTopics.length > 0 ? (
          filteredTopics.map((topic, index) => (
            <div
              key={index}
              id={topic.name.toLowerCase().replace(/\s+/g, "-")}
              className="scroll-mt-24"
            >
              <h2 className="text-xl font-bold text-content mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-primary rounded-full"></span>
                {topic.name}
              </h2>
              <div className="space-y-3">
                {topic.faqs.map((faq, faqIndex) => (
                  <Accordion key={faqIndex} title={faq.q}>
                    {faq.a}
                  </Accordion>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-content/40">
            No matching FAQ topics found.
          </div>
        )}
      </div>
    </>
  );
}

export default FAQList;
