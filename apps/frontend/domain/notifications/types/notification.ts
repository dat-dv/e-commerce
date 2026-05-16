export interface INotification {
  id: string;
  userId: string;
  title: string;
  content: string;
  type: string;
  link?: string;
  isRead: boolean;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}
