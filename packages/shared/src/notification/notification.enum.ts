export enum ENotificationType {
  ORDER = 0,
  PROMO = 1,
  SYSTEM = 2,
  SOCIAL = 3,
}

export enum ENotificationClientEvent {
  REFRESH = "notifications:refresh",
  CHANGED = "notifications:changed",
}
