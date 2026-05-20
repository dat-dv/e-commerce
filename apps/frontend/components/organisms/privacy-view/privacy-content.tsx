"use client";

import React from "react";

interface StaticPageSection {
  id: string;
  title: string;
  paragraphs: string[];
}

interface PrivacyContentProps {
  sections: StaticPageSection[];
}

export function PrivacyContent({
  sections,
}: PrivacyContentProps): React.ReactElement {
  return (
    <div className="space-y-9 text-sm leading-relaxed text-content/80 sm:space-y-12 sm:text-base">
      {sections.map((section) => (
        <section key={section.id} id={section.id} className="scroll-mt-24">
          <h2 className="mb-4 flex min-w-0 items-start gap-2 text-xl font-bold leading-tight text-content sm:items-center sm:text-2xl">
            <span className="mt-1 h-5 w-1 shrink-0 rounded-full bg-primary sm:mt-0" />
            <span className="min-w-0 break-words">
              {section.title.toUpperCase()}
            </span>
          </h2>
          <div className="space-y-3">
            {section.paragraphs.map((paragraph, index) => {
              const isListItem = !/^\d+\.\d+/.test(paragraph.trim());

              if (isListItem && index > 0) {
                return (
                  <ul
                    key={index}
                    className="space-y-1 pl-5 text-content/70 list-disc"
                  >
                    <li>{paragraph}</li>
                  </ul>
                );
              }

              return <p key={index}>{paragraph}</p>;
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

export default PrivacyContent;
