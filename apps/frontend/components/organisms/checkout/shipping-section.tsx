import Button from "@/components/atoms/button";
import AddressCard from "@/components/molecules/address-card";
import AddressEmptyState from "@/components/molecules/address-empty-state";
import AddressLoadingCard from "@/components/molecules/address-loading-card";
import { TAddress } from "@/domain/addresses/types/address.model";
import { MapPin, Plus } from "lucide-react";
import { useTranslations } from "next-intl";

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
}) => {
  const t = useTranslations("CheckoutPage.shipping");

  return (
    <div className="mb-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="flex size-8 items-center justify-center rounded-full bg-content text-surface">
          <MapPin size={16} aria-hidden />
        </div>
        <h2 className="text-xl font-bold capitalize text-content">
          {t("title")}
        </h2>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={onAddAddress}
        className="h-auto rounded-lg px-0 py-1 text-xs font-semibold capitalize text-content/60 opacity-100 hover:text-primary"
      >
        <Plus size={14} aria-hidden />
        {t("newAddress")}
      </Button>
    </div>
  );
};

export const ShippingSection = ({
  addresses,
  selectedAddressId,
  setSelectedAddressId,
  loading,
  onAddAddress,
  onClickEdit,
}: IShippingSectionProps) => {
  const t = useTranslations("CheckoutPage.shipping");

  return (
    <section>
      <ShippingSectionHeader onAddAddress={onAddAddress} />

      <div className="flex flex-col gap-2">
        {loading ? (
          <AddressLoadingCard />
        ) : addresses.length > 0 ? (
          addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              mode="select"
              isSelected={selectedAddressId === address.id}
              onSelect={() => setSelectedAddressId(address.id)}
              onEdit={() => onClickEdit(address)}
            />
          ))
        ) : (
          <AddressEmptyState
            title={t("empty.title")}
            description={t("empty.description")}
            actionLabel={t("empty.action")}
          />
        )}
      </div>
    </section>
  );
};
