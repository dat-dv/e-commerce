import Button from "@/components/atoms/button";
import EmptyState from "@/components/molecules/empty-space";
import { TAddress } from "@/domain/addresses/types/address.model";
import { MapPin, Plus } from "lucide-react";
import { AddressItem } from "./address-item";

interface IShippingSectionProps {
  addresses: TAddress[];
  selectedAddressId: string | null;
  setSelectedAddressId: (id: string | null) => void;
  loading: boolean;
  onAddAddress: () => void;
  onClickEdit: (address: TAddress) => void;
}

const ShippingSectionHeader = ({
  onAddAddress,
}: {
  onAddAddress: () => void;
}) => (
  <div className="mb-6 flex items-center justify-between">
    <div className="flex items-center gap-4">
      <div className="flex size-8 items-center justify-center rounded-full bg-content text-surface">
        <MapPin size={16} aria-hidden />
      </div>
      <h2 className="text-xl font-bold capitalize text-content">
        Shipping Address
      </h2>
    </div>
    <Button
      variant="ghost"
      size="sm"
      onClick={onAddAddress}
      className="h-auto rounded-lg px-0 py-1 text-xs font-semibold capitalize text-content/60 opacity-100 hover:text-primary"
    >
      <Plus size={14} aria-hidden />
      New Address
    </Button>
  </div>
);

const ShippingAddressLoading = () => (
  <div className="rounded-2xl border border-content/[0.05] bg-surface/40 p-5">
    <div className="animate-pulse space-y-3">
      <div className="h-4 w-1/3 rounded bg-content/[0.06]" />
      <div className="h-3 w-2/3 rounded bg-content/[0.05]" />
      <div className="h-3 w-1/2 rounded bg-content/[0.05]" />
    </div>
  </div>
);

export const ShippingSection = ({
  addresses,
  selectedAddressId,
  setSelectedAddressId,
  loading,
  onAddAddress,
  onClickEdit,
}: IShippingSectionProps) => {
  return (
    <section>
      <ShippingSectionHeader onAddAddress={onAddAddress} />

      <div className="flex flex-col gap-2">
        {loading ? (
          <ShippingAddressLoading />
        ) : addresses.length > 0 ? (
          addresses.map((address) => (
            <AddressItem
              key={address.id}
              address={address}
              isSelected={selectedAddressId === address.id}
              onSelect={() => setSelectedAddressId(address.id)}
              onEdit={() => onClickEdit(address)}
            />
          ))
        ) : (
          <EmptyState
            title="No Addresses Found"
            description="Add a shipping address before placing your order."
            icon={MapPin}
            className="rounded-2xl border-dashed bg-surface/20 px-6 py-12"
            delay={0}
          >
            <Button
              type="button"
              size="sm"
              onClick={onAddAddress}
              className="mt-8 text-[10px] font-black uppercase tracking-widest"
            >
              Add New Address
            </Button>
          </EmptyState>
        )}
      </div>
    </section>
  );
};
