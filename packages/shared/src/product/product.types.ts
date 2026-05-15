export * from "../generate/browser";

export enum EProductStatus {
  DRAFT = 0,
  ACTIVE = 1,
  OUT_OF_STOCK = 2,
}

export enum EProductSort {
  DEFAULT = 0,
  PRICE_ASC = 1,
  PRICE_DESC = 2,
  BUY_MOST = 3,
  BUY_LESS = 4,
}
