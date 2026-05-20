"use client";

import Button from "@/components/atoms/button";
import { TAddress } from "@/domain/addresses/types/address.model";
import { cn } from "@/utils/cn";
import { Edit, Star, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

type AddressCardMode = "select" | "manage";

interface AddressCardProps {
  address: TAddress;
  mode?: AddressCardMode;
  isSelected?: boolean;
  disabled?: boolean;
  isMutating?: boolean;
  onSelect?: () => void;
  onEdit?: () => void;
  onSetDefault?: () => void;
  onDelete?: () => void;
}

const getFullAddress = (address: TAddress) =>
  [address.street, address.ward, address.district, address.province]
    .filter(Boolean)
    .join(", ");

const AddressMeta = ({ address }: { address: TAddress }) => {
  const t = useTranslations("ProfileAddressesPage");

  const getLocalizedLabel = (label?: string | null | number) => {
    const raw = String(label ?? "").trim();
    if (!raw || /^\d+$/.test(raw)) return undefined;
    const lower = raw.toLowerCase();
    if (lower === "home") return t("form.labels.home");
    if (lower === "office" || lower === "work") return t("form.labels.work");
    if (lower === "apartment") return t("form.labels.apartment");
    if (lower === "other") return t("form.labels.other");
    return raw;
  };
  const resolvedLabel = getLocalizedLabel(address?.label);

  return (
    <span className="min-w-0 flex-1">
      <span className="flex min-w-0 flex-wrap items-center gap-2">
        <span className="truncate text-sm font-bold text-content">
          {address.name || t("noName")}
        </span>
        <span className="text-content/30">·</span>
        <span className="text-xs font-medium text-content/50">
          {address.phone || t("noPhone")}
        </span>
        {address.isDefault && (
          <span className="rounded-md border border-primary/20 bg-primary/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-tighter text-primary">
            {t("defaultBadge")}
          </span>
        )}
        {resolvedLabel && (
          <span className="rounded-full bg-content/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-content/60">
            {resolvedLabel}
          </span>
        )}
      </span>
      <span className="block truncate text-sm font-normal text-content/60">
        {getFullAddress(address)}
      </span>
    </span>
  );
};

const SelectionIndicator = ({ selected }: { selected: boolean }) => (
  <span
    className={cn(
      "flex size-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
      selected
        ? "border-primary bg-primary"
        : "border-content/20 bg-transparent",
    )}
    aria-hidden
  >
    {selected && <span className="size-1.5 rounded-full bg-surface" />}
  </span>
);

export const AddressCard = ({
  address,
  mode = "manage",
  isSelected = false,
  disabled = false,
  isMutating = false,
  onSelect,
  onEdit,
  onSetDefault,
  onDelete,
}: AddressCardProps) => {
  const isSelectable = mode === "select" && onSelect;

  return (
    <div
      className={cn(
        "rounded-xl border px-5 py-3.5 transition-colors",
        isSelected || address.isDefault
          ? "border-primary/30 bg-primary/[0.05] shadow-sm shadow-primary/5"
          : "border-content/5 bg-surface/40 hover:border-content/10 hover:bg-content/[0.03]",
      )}
    >
      <div className="flex items-center gap-4">
        {isSelectable ? (
          <button
            type="button"
            onClick={onSelect}
            disabled={disabled}
            className="flex min-w-0 flex-1 items-center gap-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-60"
            aria-pressed={isSelected}
          >
            <SelectionIndicator selected={isSelected} />
            <AddressMeta address={address} />
          </button>
        ) : (
          <div className="flex min-w-0 flex-1 items-center gap-4">
            <AddressMeta address={address} />
          </div>
        )}

        <div className="flex shrink-0 items-center justify-end gap-1">
          {mode === "manage" && !address.isDefault && onSetDefault && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onSetDefault}
              disabled={disabled}
              aria-label={`Set ${address.name || "address"} as default`}
              className="size-8 rounded-lg p-0 text-content/40 opacity-100 hover:bg-primary/5 hover:text-primary"
            >
              <Star size={16} aria-hidden />
            </Button>
          )}

          {onEdit && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onEdit}
              disabled={disabled}
              aria-label={`Edit address for ${address.name || "recipient"}`}
              className="size-8 rounded-lg p-0 text-content/30 opacity-100 hover:bg-content/5 hover:text-content"
            >
              <Edit size={14} className="rotate-45" aria-hidden />
            </Button>
          )}

          {mode === "manage" && onDelete && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onDelete}
              disabled={disabled}
              aria-label={`Delete address for ${address.name || "recipient"}`}
              className="size-8 rounded-lg p-0 text-content/40 opacity-100 hover:bg-red-500/5 hover:text-red-500"
            >
              {isMutating ? (
                <span className="size-4 rounded-full border-2 border-content/30 border-t-transparent animate-spin" />
              ) : (
                <Trash2 size={16} aria-hidden />
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddressCard;
