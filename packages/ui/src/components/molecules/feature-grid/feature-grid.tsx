"use client";

import { ArrowRight } from "lucide-react";
import React from "react";

import { TYPOGRAPHY, UI_RADIUS } from "../../../tokens";
import { cn } from "../../../utils";
import { IFeatureGridProps } from "./feature-grid.types";

export const FeatureGrid = ({
  items,
  classNames,
  linkComponent: LinkComponent = "a",
}: IFeatureGridProps) => {
  return (
    <nav
      className={cn(
        "hide-scrollbar flex w-full gap-3 overflow-x-auto pb-1",
        classNames,
      )}
    >
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <LinkComponent
            key={item.name}
            href={item.href || "#"}
            className={cn(
              "group border-content/10 bg-surface/50 hover:border-primary/20 hover:bg-primary/[0.04] flex min-w-[220px] flex-1 shrink-0 items-center justify-between gap-2 border px-4 py-[14px] transition-all duration-300",
              UI_RADIUS.card,
            )}
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="bg-content/[0.04] text-content/45 group-hover:bg-primary/10 group-hover:text-primary flex size-10 shrink-0 items-center justify-center rounded-xl transition-colors">
                <Icon size={18} strokeWidth={2.2} />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-content group-hover:text-primary truncate text-sm font-black transition-colors">
                    {item.name}
                  </h3>

                  {item.badge && (
                    <span
                      className={cn(
                        "bg-primary/10 text-primary rounded-full px-2 py-0.5 tracking-[0.12em] uppercase",
                        TYPOGRAPHY.badge,
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>

                <p
                  className={cn(
                    "text-content/35 mt-0.5 truncate font-medium",
                    TYPOGRAPHY.caption,
                  )}
                >
                  {item.desc}
                </p>
              </div>
            </div>

            <ArrowRight
              size={15}
              className="text-content/20 group-hover:text-primary shrink-0 transition-all group-hover:translate-x-0.5"
            />
          </LinkComponent>
        );
      })}
    </nav>
  );
};

FeatureGrid.displayName = "FeatureGrid";
