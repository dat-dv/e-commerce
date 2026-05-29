import { type ReactNode } from "react";

export interface IAnimatedPageHeaderProps {
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  className?: string;
}
