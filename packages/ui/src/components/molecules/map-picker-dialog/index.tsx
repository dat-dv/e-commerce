"use client";

import { ReactNode } from "react";

import Button from "../../atoms/button";
import { AppDialog, AppDialogPanel, AppDialogTitle } from "../../atoms/dialog";
import { XIcon } from "../../atoms/icons";
import Input from "../../atoms/input";

export interface MapPickerSuggestion {
  id: string | number;
  label: string;
}

export interface MapPickerDialogLabels {
  title: string;
  close: string;
  searchLabel: string;
  searchPlaceholder: string;
  cancel: string;
  confirm: string;
}

export interface MapPickerDialogProps {
  isOpen: boolean;
  loading?: boolean;
  canConfirm?: boolean;
  searchQuery: string;
  suggestions?: MapPickerSuggestion[];
  labels: MapPickerDialogLabels;
  mapContent: ReactNode;
  onClose: () => void;
  onConfirm: () => void;
  onSearchQueryChange: (value: string) => void;
  onSuggestionSelect: (suggestion: MapPickerSuggestion) => void;
}

export function MapPickerDialog({
  isOpen,
  loading = false,
  canConfirm = true,
  searchQuery,
  suggestions = [],
  labels,
  mapContent,
  onClose,
  onConfirm,
  onSearchQueryChange,
  onSuggestionSelect,
}: MapPickerDialogProps) {
  return (
    <AppDialog isOpen={isOpen} onClose={onClose} isDismissable={false}>
      <AppDialogPanel className="bg-surface border-content/10 relative w-full max-w-2xl rounded-3xl border p-8 shadow-2xl">
        <AppDialogTitle className="mb-4 text-2xl font-bold">
          {labels.title}
        </AppDialogTitle>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-6 right-6"
          aria-label={labels.close}
        >
          <XIcon />
        </Button>

        <div className="border-content/10 mb-4 h-[400px] w-full overflow-hidden rounded-2xl border">
          {mapContent}
        </div>

        <div className="bg-content/5 border-content/10 space-y-6 rounded-2xl border p-6">
          <div>
            <div className="relative mb-4">
              <Input
                aria-label={labels.searchLabel}
                type="text"
                value={searchQuery}
                onChange={(event) => onSearchQueryChange(event.target.value)}
                placeholder={labels.searchPlaceholder}
                label={labels.searchLabel}
                variant="outline"
                size="md"
                className="bg-surface border-content/10 hover:border-content/20 focus:ring-primary/50 w-full"
              />
              {suggestions.length > 0 ? (
                <div className="bg-surface/90 border-content/10 absolute z-[1100] mt-2 max-h-60 w-full overflow-y-auto rounded-xl border shadow-2xl backdrop-blur-md">
                  {suggestions.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className="hover:bg-primary/5 border-content/5 block w-full cursor-pointer border-b px-4 py-3 text-left text-sm transition-colors last:border-b-0"
                      onClick={() => onSuggestionSelect(item)}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="ghost" onClick={onClose}>
              {labels.cancel}
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={onConfirm}
              disabled={!canConfirm || loading}
            >
              {labels.confirm}
            </Button>
          </div>
        </div>
      </AppDialogPanel>
    </AppDialog>
  );
}

export default MapPickerDialog;
