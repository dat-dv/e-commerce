"use client";

import LiquidWaveText from "@/components/atoms/liquid-wave-text";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { HelpCardItem } from "./help-view.types";
import {
  HelpHrefKey,
  HelpIconName,
  helpHrefMap,
  helpIconMap,
} from "./help-view.utils";

interface HelpQuickLinksProps {
  cards: HelpCardItem[];
  title: string;
  description: string;
  emptyText: string;
}

export function HelpQuickLinks({
  cards,
  title,
  description,
  emptyText,
}: HelpQuickLinksProps): React.ReactElement {
  return (
    <div className="min-w-0">
      <div className="flex items-end justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-content text-xl font-black">{title}</h2>
          <p className="text-content/55 mt-2 text-sm leading-6">
            {description}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {cards.map((item) => {
          const Icon = helpIconMap[item.icon as HelpIconName];

          return (
            <Link
              key={item.title}
              href={helpHrefMap[item.href as HelpHrefKey]}
              className="group border-content/5 bg-surface hover:border-primary/30 hover:bg-primary/[0.03] focus-visible:ring-primary/20 flex min-w-0 items-start gap-3 rounded-lg border p-4 shadow-sm transition-colors focus-visible:ring-2 focus-visible:outline-none sm:items-center sm:gap-4"
            >
              <span className="bg-primary/10 text-primary flex size-11 shrink-0 items-center justify-center rounded-lg">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <LiquidWaveText
                  className="block text-sm font-black"
                  inactiveClassName="text-content"
                >
                  {item.title}
                </LiquidWaveText>
                <span className="text-content/60 mt-1 block text-sm leading-6">
                  {item.desc}
                </span>
              </span>
              <ArrowRight
                className="text-content/30 group-hover:text-primary mt-3 size-4 shrink-0 transition-transform group-hover:translate-x-0.5 sm:mt-0"
                aria-hidden="true"
              />
            </Link>
          );
        })}
      </div>

      {!cards.length && (
        <p className="border-content/5 bg-surface text-content/55 mt-6 rounded-lg border p-6 text-sm">
          {emptyText}
        </p>
      )}
    </div>
  );
}
