import Button from "@/components/atoms/button";
import AddressCard from "@/components/molecules/address-card";
import AddressEmptyState from "@/components/molecules/address-empty-state";
import AddressLoadingCard from "@/components/molecules/address-loading-card";
import { UI_RADIUS } from "@/constants/ui-radius";
import { TAddress } from "@/domain/addresses/types/address.model";
import { cn } from "@/utils/cn";
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
    <div className="mb-5 flex items-center justify-between gap-4 md:mb-6">
      <div className="flex min-w-0 items-center gap-3 md:gap-4">
        <div className="bg-content text-surface flex size-8 shrink-0 items-center justify-center rounded-full">
          <MapPin size={16} aria-hidden />
        </div>
        <h2 className="text-content truncate text-lg font-bold capitalize md:text-xl">
          {t("title")}
        </h2>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={onAddAddress}
        className={cn(
          UI_RADIUS.control,
          "text-content/60 hover:text-primary h-auto shrink-0 px-0 py-1 text-xs font-semibold capitalize opacity-100",
        )}
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
              contentClassName="items-start gap-3 sm:items-center sm:gap-4"
              selectButtonClassName="items-start gap-3 sm:items-center sm:gap-4"
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
