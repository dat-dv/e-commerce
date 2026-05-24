import { ENotificationClientEvent } from "@ecommerce/shared";

const NOTIFICATION_BROADCAST_CHANNEL = "notifications";

type TNotificationSyncMessage = {
  type: ENotificationClientEvent.CHANGED;
};

export const isNotificationSyncMessage = (
  message: unknown,
): message is TNotificationSyncMessage =>
  typeof message === "object" &&
  message !== null &&
  "type" in message &&
  message.type === ENotificationClientEvent.CHANGED;

export const createNotificationBroadcastChannel = () => {
  if (typeof window === "undefined" || !("BroadcastChannel" in window)) {
    return null;
  }

  return new BroadcastChannel(NOTIFICATION_BROADCAST_CHANNEL);
};

export const emitNotificationRefresh = (shouldBroadcast = true) => {
  if (typeof window === "undefined") return;

  window.dispatchEvent(new Event(ENotificationClientEvent.REFRESH));

  if (!shouldBroadcast) return;

  const channel = createNotificationBroadcastChannel();
  channel?.postMessage({
    type: ENotificationClientEvent.CHANGED,
  } satisfies TNotificationSyncMessage);
  channel?.close();
};
