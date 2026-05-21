"use client";

import Accordion from "@/components/molecules/accordion";
import { getHelpTopicId } from "@/components/molecules/help-topic-nav";
import { FAQTopic } from "./help-faq.types";
import { FAQIconName, faqIconMap } from "./help-faq.utils";

interface FAQTopicListProps {
  topics: FAQTopic[];
}

export function FAQTopicList({
  topics,
}: FAQTopicListProps): React.ReactElement {
  return (
    <div className="mt-6 space-y-7 sm:mt-8 sm:space-y-8">
      {topics.map((topic) => {
        const Icon = faqIconMap[topic.icon as FAQIconName];

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
              {topic.faqs.map((faq) => (
                <Accordion key={faq.q} title={faq.q}>
                  {faq.a}
                </Accordion>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
