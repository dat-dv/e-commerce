import { appRequest } from "@/constants/app-request";
import { IGetNotificationsRequest } from "@ecommerce/shared";
import { NotificationsRepository } from "../infrastructure/notifications.repository";
import { TSaveTokenRequest } from "../types/notifications.repository";

const notificationsRepository = new NotificationsRepository(appRequest);

export const notificationsUseCase = {
  saveToken: (data: TSaveTokenRequest) =>
    notificationsRepository.saveToken(data),
  getNotifications: (query?: IGetNotificationsRequest) =>
    notificationsRepository.getNotifications(query),
  getUnreadCount: () => notificationsRepository.getUnreadCount(),
  markAsRead: (id: string) => notificationsRepository.markAsRead(id),
  markAllAsRead: () => notificationsRepository.markAllAsRead(),
};
