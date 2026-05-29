"use client";

import React from "react";

import { TYPOGRAPHY } from "../../../tokens";
import LiquidWaveText from "../../atoms/liquid-wave-text";
import ViewAllButton from "../../atoms/view-all-button";
import { ISectionHeaderProps } from "./section-header.types";

export const SectionHeader = ({
  title,
  href,
  icon,
  children,
  linkComponent: LinkComponent = "a",
}: ISectionHeaderProps) => {
  const renderHeading = () => (
    <h2
      className={`flex min-w-0 items-center gap-2 ${TYPOGRAPHY.sectionTitle} text-content leading-tight capitalize`}
    >
      {icon}
      <span className="truncate">{title}</span>
    </h2>
  );

  return (
    <div className="flex items-start justify-between gap-3 sm:items-center">
      <div className="flex min-w-0 items-center gap-3 sm:gap-6">
        <div className="flex min-w-0 items-center gap-3">
          {href ? (
            <LinkComponent href={href} className="min-w-0">
              <h2
                className={`flex min-w-0 cursor-pointer items-center gap-2 ${TYPOGRAPHY.sectionTitle} text-content hover:text-primary leading-tight capitalize transition-colors`}
              >
                {icon}
                <LiquidWaveText
                  className="min-w-0 truncate"
                  inactiveClassName="text-content"
                >
                  {title}
                </LiquidWaveText>
              </h2>
            </LinkComponent>
          ) : (
            renderHeading()
          )}
        </div>

        {children}
      </div>

      {href && <ViewAllButton href={href} linkComponent={LinkComponent} />}
    </div>
  );
};

SectionHeader.displayName = "SectionHeader";

export default SectionHeader;
