import { appRequest } from "@/utils/request/request";
import { NotificationsRepository } from "../infrastructure/notifications.repository";
import { TSaveTokenRequest } from "../types/notifications.repository";

const notificationsRepository = new NotificationsRepository(appRequest);

export const notificationsUseCase = {
  saveToken: (data: TSaveTokenRequest) =>
    notificationsRepository.saveToken(data),
  getNotifications: (params?: { page?: number; limit?: number }) =>
    notificationsRepository.getNotifications(params),
  getUnreadCount: () => notificationsRepository.getUnreadCount(),
  markAsRead: (id: string) => notificationsRepository.markAsRead(id),
  markAllAsRead: () => notificationsRepository.markAllAsRead(),
};
