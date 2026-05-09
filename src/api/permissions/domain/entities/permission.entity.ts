export interface IPermission {
  permission_id: string;
  permission_name: string;
  description?: string | null;
  category?: string | null;
  created_at: Date;
}
