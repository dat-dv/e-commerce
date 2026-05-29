import { type ComponentPropsWithoutRef } from "react";

export interface IAddress {
  id?: string;
  name?: string;
  phone?: string;
  street?: string;
  ward?: string;
  district?: string;
  province?: string;
  country?: string;
  isDefault?: boolean;
  label?: string | number | null;
}

export type AddressCardMode = "select" | "manage";

export interface IAddressCardLabels {
  home?: string;
  work?: string;
  apartment?: string;
  other?: string;
  noName?: string;
  noPhone?: string;
  defaultBadge?: string;
  setDefaultAriaLabel?: string;
  editAriaLabel?: string;
  deleteAriaLabel?: string;
}

export interface IAddressCardProps extends Omit<
  ComponentPropsWithoutRef<"div">,
  "onSelect"
> {
  address: IAddress;
  mode?: AddressCardMode;
  isSelected?: boolean;
  disabled?: boolean;
  isMutating?: boolean;
  labels?: IAddressCardLabels;
  contentClassName?: string;
  selectButtonClassName?: string;
  staticContentClassName?: string;
  actionsClassName?: string;
  onSelect?: () => void;
  onEdit?: () => void;
  onSetDefault?: () => void;
  onDelete?: () => void;
}
