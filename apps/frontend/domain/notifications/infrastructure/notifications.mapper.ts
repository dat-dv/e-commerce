import { INotificationResponse, ISaveTokenRequest } from "@ecommerce/shared";
import { INotification } from "../types/notification";
import { TSaveTokenRequest } from "../types/notifications.repository";

export class NotificationsMapper {
  static toSaveTokenRequest(data: TSaveTokenRequest): ISaveTokenRequest {
    return {
      token: data.token,
      deviceType: data.deviceType,
    };
  }

  static toDomain(raw: INotificationResponse): INotification {
    return {
      id: raw.id,
      userId: raw.user_id,
      title: raw.title,
      content: raw.content,
      type: raw.type,
      link: raw.link || undefined,
      isRead: raw.is_read,
      metadata: raw.metadata ?? undefined,
      createdAt: raw.created_at.toString(),
      updatedAt: raw.updated_at.toString(),
    };
  }

  static toDomainList(raw: INotificationResponse[]): INotification[] {
    return raw.map((item) => this.toDomain(item));
  }
}
