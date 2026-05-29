import {
  type TabListProps,
  type TabPanelProps,
  type TabProps,
  type TabsProps,
} from "react-aria-components";

export interface ITabsProps extends TabsProps {
  className?: string;
}

export interface ITabListProps<T extends object> extends TabListProps<T> {
  className?: string;
}

export interface ITabProps extends TabProps {
  className?: string;
}

export interface ITabPanelProps extends TabPanelProps {
  className?: string;
}
