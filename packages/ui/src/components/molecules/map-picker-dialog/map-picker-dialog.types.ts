import { ReactNode } from "react";

export interface IMapPickerSuggestion {
  id: string;
  label: string;
  lat: number;
  lng: number;
}

export interface IMapPickerDialogLabels {
  title?: string;
  close?: string;
  searchLabel?: string;
  searchPlaceholder?: string;
  confirm?: string;
  cancel?: string;
}

export interface IMapPickerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
  canConfirm?: boolean;
  searchQuery?: string;
  suggestions?: IMapPickerSuggestion[];
  mapContent?: ReactNode;
  labels: IMapPickerDialogLabels;
  onSearchQueryChange: (query: string) => void;
  onSuggestionSelect: (suggestion: IMapPickerSuggestion) => void;
}
