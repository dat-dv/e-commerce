"use client";

import React from "react";

interface StaticPageSection {
  id: string;
  title: string;
  paragraphs: string[];
}

interface TermsContentProps {
  sections: StaticPageSection[];
}

export function TermsContent({
  sections,
}: TermsContentProps): React.ReactElement {
  return (
    <div className="text-content/80 space-y-9 text-sm leading-relaxed sm:space-y-12 sm:text-base">
      {sections.map((section) => (
        <section key={section.id} id={section.id} className="scroll-mt-24">
          <h2 className="text-content mb-4 flex min-w-0 items-start gap-2 text-xl leading-tight font-bold sm:items-center sm:text-2xl">
            <span className="bg-primary mt-1 h-5 w-1 shrink-0 rounded-full sm:mt-0" />
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
                    className="text-content/70 list-disc space-y-1 pl-5"
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

export default TermsContent;
