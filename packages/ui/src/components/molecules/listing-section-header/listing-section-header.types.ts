import { type ReactNode } from "react";

export interface IListingSectionHeaderProps {
  title: string;
  eyebrow?: string;
  icon?: ReactNode;
  meta?: ReactNode;
  children?: ReactNode;
  className?: string;
}
