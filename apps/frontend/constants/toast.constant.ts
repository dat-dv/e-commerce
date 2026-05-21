type ToastKeyValue = string | number;

type ToastKeyFactory = ToastKeyValue | ((...args: never[]) => ToastKeyValue);

const defineToastKeys = <T extends Record<string, ToastKeyFactory>>(keys: T) =>
  keys;

type ToastKeyResult<T> = T extends (...args: never[]) => infer R ? R : T;

type ToastKeysToId<T extends Record<string, ToastKeyFactory>> = {
  [K in keyof T]: ToastKeyResult<T[K]>;
}[keyof T];

export const TOAST_KEYS = defineToastKeys({
  ORDER_PLACE: (orderId: string) => `order-place-${orderId}` as const,

  ORDER_CANCEL: (orderId: string) => `order-cancel-${orderId}` as const,

  NETWORK_ERROR: "network-error",
} as const);

export type TToastId = ToastKeysToId<typeof TOAST_KEYS>;
