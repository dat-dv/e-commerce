"use client";

import { cn } from "@/utils/cn";
import React, { useEffect, useMemo, useState } from "react";

export const getHelpTopicId = (name: string): string =>
  name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

interface HelpTopicNavProps {
  topics: string[];
  className?: string;
}

export function HelpTopicNav({
  topics,
  className,
}: HelpTopicNavProps): React.ReactElement {
  const topicIds = useMemo(() => topics.map(getHelpTopicId), [topics]);
  const [activeId, setActiveId] = useState(topicIds[0] ?? "");

  useEffect(() => {
    const sections = topicIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));

    if (!sections.length) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActiveId(sections[0].id);

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleEntry?.target.id) {
          setActiveId(visibleEntry.target.id);
        }
      },
      {
        rootMargin: "-25% 0px -60% 0px",
        threshold: [0.1, 0.35, 0.6],
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [topicIds]);

  return (
    <nav
      className={cn(
        "scrollbar-hide mt-5 flex max-w-full gap-2 overflow-x-auto rounded-xl border border-content/5 bg-surface p-2 lg:block lg:overflow-visible",
        className,
      )}
    >
      {topics.map((topic) => {
        const topicId = getHelpTopicId(topic);
        const isActive = activeId === topicId;

        return (
          <a
            key={topic}
            href={`#${topicId}`}
            onClick={() => setActiveId(topicId)}
            aria-current={isActive ? "true" : undefined}
            className={cn(
              "block whitespace-nowrap rounded-lg px-3 py-2 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 lg:whitespace-normal",
              isActive
                ? "bg-primary/10 text-primary"
                : "text-content/60 hover:bg-content/[0.04] hover:text-primary",
            )}
          >
            {topic}
          </a>
        );
      })}
    </nav>
  );
}

export default HelpTopicNav;
