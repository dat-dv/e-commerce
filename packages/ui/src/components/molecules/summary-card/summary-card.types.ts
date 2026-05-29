import { type ElementType } from "react";

export interface ISummaryCardProps {
  label: string;
  value: string | number;
  icon: ElementType;
  active?: boolean;
  className?: string;
  contentClassName?: string;
  labelClassName?: string;
  valueClassName?: string;
  iconWrapperClassName?: string;
  iconClassName?: string;
}
