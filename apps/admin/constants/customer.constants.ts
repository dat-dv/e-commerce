import { ESortDirection } from "./common.constants";

export enum ECustomerSortField {
  CREATED_AT = "createdAt",
  NAME = "name",
}

export const CUSTOMER_DEFAULT_SORT = `${ECustomerSortField.CREATED_AT}:${ESortDirection.DESC}`;

export const createCustomerSortValue = (
  field: ECustomerSortField,
  direction: ESortDirection,
) => `${field}:${direction}`;

export const CUSTOMER_SORT_OPTIONS = [
  {
    label: "Newest First",
    value: createCustomerSortValue(
      ECustomerSortField.CREATED_AT,
      ESortDirection.DESC,
    ),
  },
  {
    label: "Oldest First",
    value: createCustomerSortValue(
      ECustomerSortField.CREATED_AT,
      ESortDirection.ASC,
    ),
  },
  {
    label: "Name (A-Z)",
    value: createCustomerSortValue(ECustomerSortField.NAME, ESortDirection.ASC),
  },
  {
    label: "Name (Z-A)",
    value: createCustomerSortValue(
      ECustomerSortField.NAME,
      ESortDirection.DESC,
    ),
  },
];
