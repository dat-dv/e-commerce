export enum EShippingAddressLabels {
  HOME = 0,
  WORK = 1,
  APARTMENT = 2,
  OTHER = 3,
}

export const SHIPPING_ADDRESS_LABELS_OPTIONS = [
  { label: "Home", value: EShippingAddressLabels.HOME },
  { label: "Work", value: EShippingAddressLabels.WORK },
  { label: "Apartment", value: EShippingAddressLabels.APARTMENT },
  { label: "Other", value: EShippingAddressLabels.OTHER },
];
