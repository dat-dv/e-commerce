import { INotificationResponse } from "@ecommerce/shared";
import { INotification } from "../types/notification";

export class NotificationsMapper {
  static toDomain(raw: INotificationResponse): INotification {
    return {
      id: raw.id,
      userId: raw.user_id,
      title: raw.title,
      content: raw.content,
      type: raw.type,
      link: raw.link || undefined,
      isRead: raw.is_read,
      metadata: raw.metadata ? JSON.parse(raw.metadata) : undefined,
      createdAt: raw.created_at.toString(),
      updatedAt: raw.updated_at.toString(),
    };
  }

  static toDomainList(raw: INotificationResponse[]): INotification[] {
    return raw.map((item) => this.toDomain(item));
  }
}
