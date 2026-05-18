import { TAddress } from "@/domain/addresses/types/address.model";
import { cn } from "@/utils/cn";
import { Button } from "@headlessui/react";
import { Edit } from "lucide-react";

interface AddressItemProps {
  address: TAddress;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
}

const getFullAddress = (address: TAddress) =>
  [address.street, address.ward, address.district, address.province]
    .filter(Boolean)
    .join(", ");

export const AddressItem = ({
  address,
  isSelected,
  onSelect,
  onEdit,
}: AddressItemProps) => {
  const fullAddress = getFullAddress(address);
  return (
    <div
      className={cn(
        "flex items-center gap-4 rounded-xl border px-5 py-3.5 transition-colors",
        isSelected
          ? "border-primary bg-primary/[0.05] shadow-sm shadow-primary/5"
          : "border-content/5 bg-content/[0.01] hover:border-content/10 hover:bg-content/[0.03]",
      )}
    >
      <button
        type="button"
        onClick={onSelect}
        className="flex min-w-0 flex-1 items-center gap-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        aria-pressed={isSelected}
      >
        <span
          className={cn(
            "flex size-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
            isSelected
              ? "border-primary bg-primary"
              : "border-content/20 bg-transparent",
          )}
          aria-hidden
        >
          {isSelected && <span className="size-1.5 rounded-full bg-surface" />}
        </span>

        <span className="min-w-0 flex-1">
          <span className="flex min-w-0 flex-wrap items-center gap-2">
            <span className="truncate text-sm font-bold capitalize text-content">
              {address.name || "No Name"}
            </span>
            <span className="text-xs font-medium text-content/40">
              {address.phone || "No Phone"}
            </span>
          </span>
          <span className="block truncate text-sm font-normal text-content/50">
            {fullAddress}
          </span>
        </span>
      </button>

      <div className="flex shrink-0 items-center justify-end gap-2">
        {address.isDefault && (
          <span className="shrink-0 rounded-md border border-primary/20 bg-primary/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-tighter text-primary">
            Default
          </span>
        )}
        <Button
          type="button"
          onClick={onEdit}
          aria-label={`Edit address for ${address.name || "recipient"}`}
          className="size-7 rounded-lg p-0 text-content/30 opacity-100 hover:bg-content/5 hover:text-content"
        >
          <Edit size={14} className="rotate-45" aria-hidden />
        </Button>
      </div>
    </div>
  );
};
