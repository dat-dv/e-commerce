"use client";

import React, { useEffect, useMemo, useState } from "react";

import { UI_RADIUS } from "../../../tokens";
import { cn } from "../../../utils";
import LiquidWaveText from "../../atoms/liquid-wave-text";

export type { IHelpTopic, IHelpTopicNavProps } from "./help-topic-nav.types";

export const getHelpTopicId = (name: string): string =>
  name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export interface HelpTopicNavProps {
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
        "hide-scrollbar border-content/5 bg-surface mt-5 flex max-w-full gap-2 overflow-x-auto border p-2 lg:block lg:overflow-visible",
        UI_RADIUS.panel,
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
              "focus-visible:ring-primary/20 block px-3 py-2 text-sm font-bold whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:outline-none lg:whitespace-normal",
              UI_RADIUS.control,
              isActive
                ? "bg-primary/10 text-primary"
                : "text-content/60 hover:bg-content/[0.04]",
            )}
          >
            <LiquidWaveText
              isActive={isActive}
              inactiveClassName="text-content/60"
            >
              {topic}
            </LiquidWaveText>
          </a>
        );
      })}
    </nav>
  );
}

HelpTopicNav.displayName = "HelpTopicNav";

export default HelpTopicNav;
