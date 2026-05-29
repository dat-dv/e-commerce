import { type ElementType, type ReactNode } from "react";

export interface IAnimatedPageHeaderProps {
  title: ReactNode;
  highlight?: string;
  description?: ReactNode;
  icons?: ElementType[];
  rightContent?: ReactNode;
  center?: boolean;
  entranceDuration?: number;
  speed?: number;
  children?: ReactNode;
  className?: string;
}
