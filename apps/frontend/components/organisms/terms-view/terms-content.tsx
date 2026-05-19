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
    <div className="space-y-12 text-content/80 leading-relaxed text-sm sm:text-base">
      {sections.map((section) => (
        <section key={section.id} id={section.id} className="scroll-mt-24">
          <h2 className="text-2xl font-bold text-content mb-4 flex items-center gap-2">
            <span className="w-1 h-5 bg-primary rounded-full"></span>
            {section.title.toUpperCase()}
          </h2>
          <div className="space-y-3">
            {section.paragraphs.map((paragraph, index) => {
              const isListItem = !/^\d+\.\d+/.test(paragraph.trim());

              if (isListItem && index > 0) {
                return (
                  <ul
                    key={index}
                    className="list-disc pl-5 space-y-1 text-content/70"
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
