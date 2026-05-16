import { ApiResponse, TRequest } from "@/utils/request/request.types";
import { INotificationTokenResponse } from "@ecommerce/shared";
import {
  INotificationsRepository,
  TSaveTokenRequest,
} from "../types/notifications.repository";

export class NotificationsRepository implements INotificationsRepository {
  constructor(private request: TRequest) {}

  async saveToken(
    data: TSaveTokenRequest,
  ): Promise<ApiResponse<INotificationTokenResponse>> {
    return this.request.post<INotificationTokenResponse>(
      "/notifications/tokens",
      data,
    );
  }
}
