export interface TPermission {
  id: string;
  permission_name: string;
  description?: string | null;
  category?: string | null;
  created_at: string | Date;
  updated_at: string | Date;
}
