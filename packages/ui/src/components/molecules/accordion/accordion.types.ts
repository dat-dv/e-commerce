import { type ReactNode } from "react";

export interface IAccordionProps {
  title: string;
  children: ReactNode;
  className?: string;
  triggerClassName?: string;
  panelClassName?: string;
}
