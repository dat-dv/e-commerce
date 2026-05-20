"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  HelpHrefKey,
  HelpIconName,
  helpHrefMap,
  helpIconMap,
} from "./help-view.utils";
import { HelpCardItem } from "./help-view.types";

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
        <div>
          <h2 className="text-xl font-black text-content">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-content/55">
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
              className="group flex min-w-0 items-center gap-4 rounded-lg border border-content/5 bg-surface p-4 shadow-sm transition-colors hover:border-primary/30 hover:bg-primary/[0.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-black text-content">
                  {item.title}
                </span>
                <span className="mt-1 block text-sm leading-6 text-content/60">
                  {item.desc}
                </span>
              </span>
              <ArrowRight
                className="size-4 shrink-0 text-content/30 transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
                aria-hidden="true"
              />
            </Link>
          );
        })}
      </div>

      {!cards.length && (
        <p className="mt-6 rounded-lg border border-content/5 bg-surface p-6 text-sm text-content/55">
          {emptyText}
        </p>
      )}
    </div>
  );
}
