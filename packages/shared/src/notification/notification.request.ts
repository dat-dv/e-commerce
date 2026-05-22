export interface ISaveTokenRequest {
  token: string;
  deviceType?: string;
}

export interface IGetNotificationsRequest {
  page?: number;
  limit?: number;
}
