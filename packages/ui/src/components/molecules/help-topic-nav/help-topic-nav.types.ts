import { type ElementType } from "react";

export interface IHelpTopic {
  id: string;
  label: string;
  icon?: ElementType;
}

export interface IHelpTopicNavProps {
  topics: IHelpTopic[];
  activeId?: string;
  onSelect?: (id: string) => void;
  linkComponent?: ElementType;
  className?: string;
}
