export interface TPermission {
  id: string;
  permissionName: string;
  description?: string | null;
  category?: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}
